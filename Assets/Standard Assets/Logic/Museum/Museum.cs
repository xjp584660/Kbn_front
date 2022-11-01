using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
namespace KBN
{
	public abstract class Museum
	{
		protected HashObject artifaceData;
		protected List<EventEntity> artifactArray;
		
		protected string noEventDes;
		protected List<EventEntity> eventsByOrder;
		protected int hasNewEvent=0;
		public static Museum singleton { get; protected set; }


		public List<EventEntity> getOrderedEvents
		{
			get 
			{
				return eventsByOrder;
			}
		}
		
		public List<EventEntity> getArtiFacts
		{
			get 
			{
				return artifactArray;
			}
		}
		public void ReSetArtDatas(int id,int count){
			if(artifactArray!=null){
				for(int i=0;i<artifactArray.Count;i++){
					if(id==artifactArray[i].id){
						artifactArray[i].resetArtEvent(count);
					}else{
						artifactArray[i].resetEvent();
					}
				}
			}
		}
		public EventEntity GetEventById(int id){
			if(eventsByOrder!=null){
				for(int i=0;i<eventsByOrder.Count;i++){
					if(id==eventsByOrder[i].id){
						return eventsByOrder[i];
					}
				}
			}
			return null;
		}
		public EventEntity GetArtById(int id){
			if(artifactArray!=null){
				for(int i=0;i<artifactArray.Count;i++){
					if(id==artifactArray[i].id){
						return artifactArray[i];
					}
				}
			}
			return null;
		}
		public void checkForRoundTower()
		{
			
		}

		protected int count = 0;
		
		public bool HasEvent
		{
			get
			{
				return hasNewEvent > 0 ? true : false;
			}
		}
		
		public string getNoEventDes
		{
			get 
			{
				return noEventDes;
			}
		}
		
		public int eventNum
		{
			get
			{
				return hasNewEvent;
			}
		}
		
		public bool isItemExist(int itemId)
		{
			
			if(itemId >= 20410 && itemId <= 21000)
			{
				return true;
			}
			else if( itemId >= 21100 && itemId <= 21103 ) // World map bonus items
			{
				return true;
			}
			
			return false;
		}

		public void OnMutiClaimOk(HashObject result)
		{
			if(_Global.GetBoolean(result["ok"]))
			{
				int eventId = _Global.INT32(result["eventId"]);
				int crestId = _Global.INT32(result["crestId"]);
				int claimCount = _Global.INT32(result["claimCount"]);
				EventEntity eventEntity;
				for(int a = 0; a < eventsByOrder.Count; a ++)
				{
					eventEntity = eventsByOrder[a];
					
					if(eventEntity.id == eventId)
					{
						MyItems.singleton.AddItem(eventEntity.itemId, eventEntity.itemNum*claimCount);
						
						EventEntity.EventPiece piece;
						for(int b = 0; b < eventEntity.pieces.Count; b++)
						{
							piece = eventEntity.pieces[b];
							if (crestId > 0) {				// 'or' logic
								if (crestId == piece.id) {
									MyItems.singleton.subtractItem(piece.id, (int)piece.needNum*claimCount);
									break;
								}
							} else {						// 'and' logic
								MyItems.singleton.subtractItem(piece.id, (int)piece.needNum*claimCount);
							}
						}
						
						break;
					}
				}
				
				for(int a = 0; a < eventsByOrder.Count; a ++)
				{
					eventEntity = eventsByOrder[a];
					
					eventEntity.resetEvent();
					
					if(eventEntity.id == eventId)
					{
						eventEntity.resetChangeQuanlity(claimCount);
					}
				}
				
//				if(callback != null)
//				{
//					callback.DynamicInvoke();
//				}
			}
		}

		public void MutiClaimEvent(int eventId, int crestId, int claimNum, MulticastDelegate okFunc)
		{
			if (crestId > 0)
				UnityNet.reqClaimEvent(eventId, crestId,claimNum, okFunc, null);	
			else
				UnityNet.reqClaimEvent(eventId,claimNum, okFunc, null);	
		}

		protected HashObject InitArtifactData()
		{
			if(artifaceData == null)
			{
				artifaceData = Datas.singleton.artifactData();
			}
			return artifaceData;
		}
		public string loadArtifactTexture(int category)
		{
			return TextureMgr.instance().LoadTileNameFromSetting("" + category);
		}
		public TileSprite loadArtifactSprite(int category)
		{
			return TextureMgr.instance().GetSpriteFromSetting(""+ category);
		}
		
		public int ComputeClaimCount(EventEntity eventEntity)
		{
			int iCount = int.MaxValue;
			int exchangeCount = 0;
			EventEntity.EventPiece piece;
			for(int i=0;i<eventEntity.pieces.Count;i++)
			{
				piece = eventEntity.pieces[i] as EventEntity.EventPiece;
				exchangeCount = (int)(piece.ownNum/piece.needNum);
				iCount = exchangeCount<iCount?exchangeCount:iCount;
			}
			return iCount;
		}	
	}
	public class Artifact
	{
		public List<Piece> pieces;
		public int category;
		public string icon;
		public string tips;
		public string des;
		public int price;
		public TileSprite sprite;
		public int artifactId;

		public int priority;
		
		public bool initArtifact(HashObject data)
		{
			category = _Global.INT32(data["rewardItemId"].Value);
			
			if(category == 0)
			{
				return false;
			}
			
			artifactId = _Global.INT32(data["eventId"].Value);
			icon	 = TextureMgr.instance().LoadTileNameOfItem(category);
			sprite	 = Museum.singleton.loadArtifactSprite(category);
			tips	 = Datas.getArString("itemName.i" + category);
			des		 = Datas.getArString("itemDesc.i" + category);
			priority = _Global.INT32(data["priority"].Value);

			pieces = new List<Piece>();
			
			object[] arr = _Global.GetObjectValues(data["exchangings"]);	
			Piece piece;
			HashObject pieceObj;
			for(int a = 0; a < arr.Length; a ++)
			{
				pieceObj = data["exchangings"][_Global.ap + a];
				piece = new Piece();
				piece.id = _Global.INT32(pieceObj["crestId"].Value);
				
				if(piece.id == 0)
				{
					continue;
				}			
				
				piece.need = _Global.INT32(pieceObj["amount"].Value);
				piece.own = MyItems.singleton.countForItem(piece.id);
				piece.icon = TextureMgr.instance().LoadTileNameOfItem(piece.id);
				piece.name = Datas.getArString("itemName.i" + piece.id);

				pieces.Add(piece);
			}

			return true;		
		}
		
		public void resetPieces()
		{
			if(pieces == null)
			{
				pieces = new List<Piece>();
			}
			
			Piece piece;
			for(int i = 0; i < pieces.Count; i++)
			{
				piece = pieces[i] as Piece;
				piece.own = MyItems.singleton.countForItem(piece.id);
			}		
		}
		
		public bool CanClaim()
		{
			bool result = true;
			for(int i=0;i< pieces.Count;i++)
			{	
				if((pieces[i] as Piece).own < (pieces[i] as Piece).need)
				{
					result = false;
					break;
				}
			}
			if(result)
			{
				List<ArtifactClaimRequireItem> requires = ClaimRequireMents();
				for(int j=0;j<requires.Count;j++)
				{
					if((requires[j] as ArtifactClaimRequireItem).completed == false)
					{
						result = false;
						break;
					}
				}
			}
			return result;
		}
		//TODO: fix next version
		public List<ArtifactClaimRequireItem> ClaimRequireMents()
		{
			ArtifactClaimRequireItem requireResearch = new ArtifactClaimRequireItem();
			requireResearch.completed = true;
			requireResearch.require = "";
			ArtifactClaimRequireItem requireBuilding = new ArtifactClaimRequireItem();
			requireBuilding.completed = true;
			requireBuilding.require = "";
			List<ArtifactClaimRequireItem> result = new List<ArtifactClaimRequireItem>();
			result.Add(requireResearch);
			result.Add(requireBuilding);
			return result;
		}
		
	}
	public class Piece
	{
		public long need;
		public long own;
		public int id;
		public string name;
		public string icon;
		public int price;
	}
	public class ArtifactClaimRequireItem
	{
		public string require;
		public bool completed;
	}
	
	public class EventEntity
	{
		public class EventPiece:UnityEngine.Object
		{
			public int id;
			public int categary;
			public string texturePath;
			public long ownNum;
			public long needNum;
			public bool IsOrLogic;
		}
		
		public int id;
		public int tab;
		
		public string eventName;
		public int limitQuantity;
		public int changedQuantity;
		
		public long startTime;
		public long endTime;
		public long needTime;
		
		public int itemId;
		public int itemCategary;
		public string itemTexture;
		public int itemNum;
		public int logicType; // Constant.Museum.singleton.ExchangeLogicType
		public bool batchReward;
		public List<EventPiece> pieces = new List<EventPiece>();
		
		public bool canClaim = false;

		public int priority;

		public void resetPieces()
		{
			if(pieces == null)
			{
				pieces = new List<EventPiece>();
			}
			
			EventPiece piece;
			for(int i = 0; i < pieces.Count; i++)
			{
				piece = pieces[i] as EventPiece;
				piece.ownNum = MyItems.singleton.countForItem(piece.id);
			}		
		}

		public bool CanClaim()
		{
			bool result = true;
			for(int i=0;i< pieces.Count;i++)
			{	
				if((pieces[i] as EventPiece).ownNum < (pieces[i] as EventPiece).needNum)
				{
					result = false;
					break;
				}
			}
			if(result)
			{
				List<ArtifactClaimRequireItem> requires = ClaimRequireMents();
				for(int j=0;j<requires.Count;j++)
				{
					if((requires[j] as ArtifactClaimRequireItem).completed == false)
					{
						result = false;
						break;
					}
				}
			}
			return result;
		}
		public List<ArtifactClaimRequireItem> ClaimRequireMents()
		{
			ArtifactClaimRequireItem requireResearch = new ArtifactClaimRequireItem();
			requireResearch.completed = true;
			requireResearch.require = "";
			ArtifactClaimRequireItem requireBuilding = new ArtifactClaimRequireItem();
			requireBuilding.completed = true;
			requireBuilding.require = "";
			List<ArtifactClaimRequireItem> result = new List<ArtifactClaimRequireItem>();
			result.Add(requireResearch);
			result.Add(requireBuilding);
			return result;
		}

		public bool initEvent(HashObject param)
		{
			HashObject data = param as HashObject;
			
			id = _Global.INT32(data["eventId"].Value);
			startTime = data["startUnixtime"]==null?0:_Global.INT64(data["startUnixtime"].Value);
			endTime = data["endUnixtime"]==null?0:(_Global.INT64(data["endUnixtime"].Value) - 60);
			batchReward = data["batchReward"]==null?false:_Global.INT32(data["batchReward"])==1;
			priority = _Global.INT32(data["priority"].Value);

			if (data["tab"] != null)
			{
				tab = _Global.INT32(data["tab"]);
			}
			else
			{
				tab = 1;
			}
			
			if(data["rewardItemId"].Value == null)
			{
				return false;
			}
			
			itemId = _Global.INT32(data["rewardItemId"].Value);
			itemNum = _Global.INT32(data["rewardItemAmount"].Value); 
			itemCategary = getCategary(itemId);
			itemTexture	 = TextureMgr.instance().LoadTileNameOfItem(itemId);//getTexturePath(itemCategary, itemId);


			if(data["eventName"] != null)
			{
				eventName = data["eventName"].Value + "";
			}
			
			if(data["rewardLimit"] != null)
			{
				limitQuantity = _Global.INT32(data["rewardLimit"].Value);
			}
			
			if(data["rewardCount"] != null)
			{
				changedQuantity = _Global.INT32(data["rewardCount"].Value);
			}
			
			logicType = (data["type"] != null ? _Global.INT32(data["type"]) : /*Constant.Museum.singleton.ExchangeLogicType.LOGIC_OR);*/ Constant.Museum.ExchangeLogicType.LOGIC_AND);
			
			var isAndLogic = (logicType == Constant.Museum.ExchangeLogicType.LOGIC_AND);
			canClaim = isAndLogic;
			
			object[] arr = _Global.GetObjectValues(data["exchangings"]);		
			EventPiece piece;
			HashObject pieceObj;
			for(int a = 0; a < arr.Length; a++)
			{
				pieceObj = data["exchangings"][_Global.ap + a];
				piece = new EventPiece();
				piece.id = _Global.INT32(pieceObj["crestId"].Value);
				piece.needNum = _Global.INT32(pieceObj["amount"].Value);
				piece.ownNum  = MyItems.singleton.countForItem(piece.id); 
				piece.categary = getCategary(piece.id);
				piece.texturePath = TextureMgr.instance().LoadTileNameOfItem(piece.id);	
				piece.IsOrLogic=logicType == Constant.Museum.ExchangeLogicType.LOGIC_OR;

				pieces.Add(piece);

				if(isAndLogic && piece.needNum > piece.ownNum)
				{
					canClaim = false;

				} 
				else if(!isAndLogic && piece.needNum <= piece.ownNum)
				{
					canClaim = true;
				}
			}
			if(limitQuantity!=0){
				if(changedQuantity >= limitQuantity)
				{
					canClaim = false;
				}
			}
			
			return true;
		}
		public void resetArtEvent(int count)
		{
			EventPiece piece;
			
			bool isAndLogic = (logicType == Constant.Museum.ExchangeLogicType.LOGIC_AND);
			canClaim = isAndLogic;
			
			for(int a = 0; a < pieces.Count; a ++)
			{
				piece = pieces[a];
				
				piece.ownNum = MyItems.singleton.countForItem(piece.id);
				
				if(isAndLogic && piece.needNum > piece.ownNum)
				{
					canClaim = false;
				}
				else if(!isAndLogic && piece.needNum <= piece.ownNum)
				{
					canClaim = true;
				}
			}
			
			if(limitQuantity!=0){
				if(changedQuantity >= limitQuantity)
				{
					canClaim = false;
				}
			}
			resetChangeQuanlity(count);		
		}
		
		public void resetEvent()
		{
			EventPiece piece;
			
			bool isAndLogic = (logicType == Constant.Museum.ExchangeLogicType.LOGIC_AND);
			canClaim = isAndLogic;
			
			for(int a = 0; a < pieces.Count; a ++)
			{
				piece = pieces[a];
				
				piece.ownNum = MyItems.singleton.countForItem(piece.id);
				
				if(isAndLogic && piece.needNum > piece.ownNum)
				{
					canClaim = false;
				}
				else if(!isAndLogic && piece.needNum <= piece.ownNum)
				{
					canClaim = true;
				}
			}
			
			if(limitQuantity!=0){
				if(changedQuantity >= limitQuantity)
				{
					canClaim = false;
				}
			}		
		}
		
		public void resetChangeQuanlity(int changeCount)
		{		
			changedQuantity += changeCount;
			
			if(limitQuantity!=0){
				if(changedQuantity >= limitQuantity)
				{
					canClaim = false;
				}
			}	
		}
		
		public int getCategary(int _itemId)
		{
			HashObject item = (Datas.singleton.itemlist())["i" + _itemId];
			
			// Hot fix for v16.3
			if (item == null) {
				return (int)MyItems.Category.UnknowItem;
			}
			
			int returnCategory;
			
			if(MystryChest.singleton.IsMystryChest(_itemId))
			{
				returnCategory = (int)MyItems.Category.MystryChest;
			}
			else if(MystryChest.singleton.IsLevelChest(_itemId))
			{
				returnCategory = (int)MyItems.Category.LevelChest;
			}
			else
			{
				returnCategory = _Global.INT32(item["category"]);
			}
			
			return returnCategory;			
		}
		
		public string getTexturePath(int _categary,int _id)
		{
			string imageName = "";
			
			if(_categary == (int)MyItems.Category.MystryChest)
			{ 
				imageName = MystryChest.singleton.GetChestImage(_id);
				if(!TextureMgr.instance().ItemSpt().IsTileExist(imageName))
				{
					imageName = Constant.DefaultChestTileName;
				}			
			}
			else if(_categary == (int)MyItems.Category.LevelChest)
			{
				imageName = MystryChest.singleton.GetLevelChestImage(_id);
				if(!TextureMgr.instance().ItemSpt().IsTileExist(imageName))
				{
					imageName = Constant.DefaultChestTileName;
				}			
			}
			else
			{
				if(_categary == (int)MyItems.Category.Chest)
				{
					imageName = "i"+ _id;
					if(!TextureMgr.instance().ItemSpt().IsTileExist(imageName))
					{
						imageName = Constant.DefaultChestTileName;
					}		
				}
				else
				{
					if(Datas.singleton.getImageName(_id) == "")
					{
						imageName = "i"+ _id;
					}
					else
					{
						imageName =	Datas.singleton.getImageName(_id);
					}
				}
			}
			
			return imageName;				
		}
	}
}