import System.Collections;
import System.Collections.Generic;
import System.Reflection;
public class Museum extends KBN.Museum
{
	public	static	function	instance()
	{
		if( singleton == null ){
			singleton = new Museum();
		}
		return singleton as Museum;
	}

	public function init(data:HashObject):void
	{	
		noEventDes = Datas.getArString("Museum.NoCurrentEvents");
	
		if(data["rtEvent"] != null)
		{
			hasNewEvent = _Global.INT32(data["rtEvent"].Value);
			
			if(hasNewEvent > 0)
			{
				var decInfor:BuildingDecMgr.DecrationInfor = new BuildingDecMgr.DecrationInfor();
				decInfor.buildingType = Constant.Building.MUSEUM;
				decInfor.textureName = "RoundTower_icon2";
				decInfor.sceneLevel = GameMain.CITY_SCENCE_LEVEL;
				decInfor.slotId = Building.instance().getPositionForType(Constant.Building.MUSEUM);
				ChromeOrganizerMenu.IsShowRoundTowerButton = true;
				
				BuildingDecMgr.getInstance().addDecration(decInfor);					
			}
			else
			{
				ChromeOrganizerMenu.IsShowRoundTowerButton = false;
			}		
		}
		else
		{
			hasNewEvent = 0;
		}
																	
	}
	
	public function updateEvent(data:HashObject):void
	{
	/*
		var a:int = _Global.INT32(data.Value);
	
		if(count++ == 0)
		{
			a = 0;
			count = 0;
		}
	*/
		//if(hasNewEvent != a)
		if(hasNewEvent != _Global.INT32(data.Value))
		{			
			hasNewEvent = _Global.INT32(data.Value);
			
			if(hasNewEvent > 0)
			{
				var decInfor:BuildingDecMgr.DecrationInfor = new BuildingDecMgr.DecrationInfor();
				decInfor.buildingType = Constant.Building.MUSEUM;
				decInfor.textureName = "RoundTower_icon2";
				decInfor.sceneLevel = GameMain.CITY_SCENCE_LEVEL;
				decInfor.slotId = Building.instance().getPositionForType(Constant.Building.MUSEUM);
				
				BuildingDecMgr.getInstance().addDecration(decInfor);
				ChromeOrganizerMenu.IsShowRoundTowerButton = true;
				
			}
			else
			{
				BuildingDecMgr.getInstance().delDecration(Constant.Building.MUSEUM);
				ChromeOrganizerMenu.IsShowRoundTowerButton = false;
			}
		}
	}
	
	public function ClaimEvent(eventId:int, crestId:int, claimNum:int, callback:System.MulticastDelegate):void
	{	
		var ok:Function = function(result:HashObject)
		{
			if(result["ok"].Value)
			{
				var eventEntity:KBN.EventEntity;
				for(var a:int = 0; a < eventsByOrder.Count; a ++)
				{
					eventEntity = eventsByOrder[a];

					if(eventEntity.id == eventId)
					{
						MyItems.instance().AddItem(eventEntity.itemId, eventEntity.itemNum*claimNum);
						
						var piece:KBN.EventEntity.EventPiece;
						for(var b:int = 0; b < eventEntity.pieces.Count; b++)
						{
							piece = eventEntity.pieces[b];
							if (crestId > 0) {				// 'or' logic
								if (crestId == piece.id) {
									MyItems.instance().subtractItem(piece.id, piece.needNum*claimNum);
									break;
								}
							} else {						// 'and' logic
								MyItems.instance().subtractItem(piece.id, piece.needNum*claimNum);
							}
						}

						break;
					}
				}
				
				for(a = 0; a < eventsByOrder.Count; a ++)
				{
					eventEntity = eventsByOrder[a];
				
					eventEntity.resetEvent();
					
					if(eventEntity.id == eventId)
					{
						eventEntity.resetChangeQuanlity(claimNum);
					}
				}
				
				if(callback != null)
				{
					callback.DynamicInvoke();
				}
			}
		};
		if (crestId > 0)
			UnityNet.reqClaimEvent(eventId, crestId,claimNum, ok, null);	
		else
			UnityNet.reqClaimEvent(eventId,claimNum, ok, null);	
	}
	
	public function GetEvents(callback:Function):void
	{
		var ok:Function = function(result:HashObject){
			if(result["ok"].Value)
			{
				var exchanges:HashObject = result["data"]["events"];
				var events:Array = _Global.GetObjectValues(exchanges);
				
				eventsByOrder = new List.<KBN.EventEntity>();
				
				var hashObj:HashObject = new HashObject({"num":events.length});
				updateEvent(hashObj["num"] as HashObject);
								
				if(events.length == 0)
				{
					noEventDes = result["data"]["note"].Value as String;
					
					if(noEventDes == "")					
					{
						noEventDes = Datas.getArString("Museum.NoCurrentEvents");
					}
				}
				else
				{
					var eventObj:HashObject;
					var eventDetail:KBN.EventEntity;
					var index:int = 0;
					for(var i=0; i<events.length; i++)
					{
						eventObj = exchanges[_Global.ap + i] as HashObject;

						eventDetail = new KBN.EventEntity();
						if(!eventDetail.initEvent(eventObj))
						{
							continue;
						}
						
						eventsByOrder.Add(eventDetail);												
					}
					EventPriority();
				}

				if(callback)
				{
					callback(eventsByOrder);
				}
			}
		};
		
		UnityNet.reqEventDetail(ok, null);		
	}
	public function EventPriority():void
	{
		var higherPriorityList = new List.<KBN.EventEntity>();
		var lowerPriorityList = new List.<KBN.EventEntity>();
		for(var j=0; j<eventsByOrder.Count;j++)
		{
			if(eventsByOrder[j].priority == 0)
			{
				higherPriorityList.Add(eventsByOrder[j]);
			}
			else
			{
				lowerPriorityList.Add(eventsByOrder[j]);
			}
		}
		higherPriorityList = EventOrder(higherPriorityList);
		lowerPriorityList = EventOrder(lowerPriorityList);
		for(var m=0;m<lowerPriorityList.Count;m++)
		{
			higherPriorityList.Add(lowerPriorityList[m]);
		}
		eventsByOrder = higherPriorityList;
	}
	public function EventOrder(priorityArray:List.<KBN.EventEntity>):List.<KBN.EventEntity>
	{
		var canClainList = new List.<KBN.EventEntity>();
		var canNotClaimList = new List.<KBN.EventEntity>();
		for(var j=0; j<priorityArray.Count;j++)
		{
			if(priorityArray[j].canClaim == false)
			{
				canNotClaimList.Add(priorityArray[j]);
			}
			else
			{
				canClainList.Add(priorityArray[j]);
			}
		}
		for(var m=0;m<canNotClaimList.Count;m++)
		{
			canClainList.Add(canNotClaimList[m]);
		}
		priorityArray = canClainList;
		return priorityArray;
	}
	
	public function ArifactPriority():void
	{
		var higherPriorityList = new List.<KBN.EventEntity>();
		var lowerPriorityList = new List.<KBN.EventEntity>();
		for(var j=0; j<artifactArray.Count;j++)
		{
			if(artifactArray[j].priority == 0)
			{
				higherPriorityList.Add(artifactArray[j]);
			}
			else
			{
				lowerPriorityList.Add(artifactArray[j]);
			}
		}
		higherPriorityList = ArtifactOrder(higherPriorityList);
		lowerPriorityList = ArtifactOrder(lowerPriorityList);
		for(var m=0;m<lowerPriorityList.Count;m++)
		{
			higherPriorityList.Add(lowerPriorityList[m]);
		}
		artifactArray = higherPriorityList;
	}
	public function ArtifactOrder(priorityArray:List.<KBN.EventEntity>):List.<KBN.EventEntity>
	{
		var canClainArt = new List.<KBN.EventEntity>();
		var canNotClaimArt = new List.<KBN.EventEntity>();
		for(var i=0; i<priorityArray.Count;i++)
		{
			if(priorityArray[i].CanClaim() == false)
			{
				canNotClaimArt.Add(priorityArray[i]);
			}
			else
			{
				canClainArt.Add(priorityArray[i]);
			}
		}
		for(var j=0;j<canNotClaimArt.Count;j++)
		{
			canClainArt.Add(canNotClaimArt[j]);
		}
		priorityArray = canClainArt;
		return priorityArray;	
	}
	public function GetArtifacts(callback:Function):void
	{
		
		var ok:Function = function(result:HashObject){
			if(result["ok"].Value)
			{
				var exchanges:HashObject = result["data"]["events"];
				var artifacts:Array = _Global.GetObjectValues(exchanges);
				
				artifactArray = new List.<KBN.EventEntity>();
				
				var artifactObj:HashObject;
				var artifact:KBN.EventEntity;
				var index:int = 0;
				for(var i=0; i<artifacts.length; i++)
				{
					artifactObj = exchanges[_Global.ap + i] as HashObject;

					artifact = new KBN.EventEntity();
					
					if(!artifact.initEvent(artifactObj))
					{
						continue;
					}
					
					artifactArray.Add(artifact);
				}
				ArifactPriority();

				if(callback)
				{
					callback(artifactArray);
				}
			}
		};	
		
		UnityNet.reqArtifactDetail(ok, null);		

	/*
		if(artifactArray == null || artifactArray.length == 0)
		{
			artifactArray = new Array();
			piecesShow = new Array();
			var artifactDataInternal:HashObject = InitArtifactData();
			var showCategories:Array = _Global.GetObjectValues(artifactDataInternal["showCategories"]);
			var piecesData:HashObject = artifactDataInternal["artifactNeedCount"];
			var artifactCategories:HashObject = artifactDataInternal["artifactCategories"];
			
			for(var i=0;i<showCategories.length;i++)
			{
				var artifactIds:Array = _Global.GetObjectValues(artifactCategories["" + (showCategories[i] as HashObject).Value]);
	
				for(var j=0;j<artifactIds.length;j++)
				{
					var artifactId:int =_Global.INT32((artifactIds[j] as HashObject));
					var artifact:Artifact = new Artifact();
					artifact.category = artifactId;
					artifact.tips = Datas.getArString("artifactPieceName.a" + artifactId);
					artifact.icon = loadArtifactTexture(artifactId);
					artifact.des = Datas.getArString("artifactSetDesc.a" + artifactId);
					artifact.sprite = loadArtifactSprite(artifactId);
					//pieces
					artifact.pieces = new Array();
					
					var artifactPieces:Array = _Global.GetObjectValues(piecesData["" + artifactId]);
					for(var k=0;k<artifactPieces.length;k++)
					{
						var piece:Piece = new Piece();
						var pieceIdAndCount:Array = _Global.GetObjectValues((artifactPieces[k] as HashObject));
						piece.id = _Global.INT32((pieceIdAndCount[0] as HashObject));
						piece.need = _Global.INT32((pieceIdAndCount[1] as HashObject));
						piece.name = Datas.getArString("artifactPieceName.a" + piece.id);
						piece.price = Shop.instance.getPriceOfItem(Shop.PIECE,piece.id, true);
						piece.icon = "i" + piece.id;
						piece.own = MyItems.instance().countForItem(piece.id);
						artifact.pieces.Add(piece);
						piecesShow.Add(piece.id);
					}
					artifactArray.Add(artifact);
				}
			}
			
			return artifactArray;
		
		}
		else
		{
			for(var l =0;l< artifactArray.length;l++)
			{
				var arcifact:Artifact = (artifactArray[l] as Artifact);
				for(var m = 0;m<arcifact.pieces.length;m++)
				{
					(arcifact.pieces[m] as Piece).own = MyItems.instance().countForItem( (arcifact.pieces[m] as Piece).id);
				}
			}
				
			return artifactArray;
		}*/
		
	}
	
				
}