
class Castle
{
	private static var singleton:Castle;
	private var	seed:HashObject;
	
	private var surveyCount:int;
	private var surveyLimit:int;

	public var gateCoolTime : long;
	public var curCityGateCoolTime : Dictionary.<int, long>;
																		
	public static function instance()
	{
		if(singleton == null)
		{
			singleton = new Castle();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}
	
	public function get SurveyCount():int
	{
		return surveyCount;
	}
	
	public function get SurveyLimit():int
	{
		return surveyLimit;
	}
	
	public function init(sd:HashObject)
	{
		seed = sd;

		curCityGateCoolTime = new Dictionary.<int, long>();
		if(seed["gateCoolTime"] != null)
		{
			var count : int = _Global.GetObjectValues(seed["gateCoolTime"]).Length;
			for(var i : int  = 0; i < count; i++)
			{
				var tkCoolTime : HashObject = seed["gateCoolTime"][_Global.ap + i];
				var cityId : int = _Global.INT32(tkCoolTime["cityId"]);
				var time : long = _Global.INT64(tkCoolTime["tkGateTime"]);

				curCityGateCoolTime.Add(cityId, time);
			}
		}
	}

	public function GetCurCityTKGateCoolTime() : long
	{
		var curCityId : int = GameMain.instance().getCurCityId();
		if(curCityGateCoolTime.ContainsKey(curCityId))
		{
			return curCityGateCoolTime[curCityId];
		}

		return 0;
	}

	public function sanctuaryChange (cityId:int, sanctype:String, successFunc:Function)
	{
		var params:Array = new Array();
		params.Add(cityId);
		params.Add(sanctype);
//		var temp = seed["citystats"]["city" + cityId]["gate"];
 
		if(seed["citystats"]["city" + cityId]["gate"].Value != sanctype + "")
		{		
			
			var okFunc:Function = function(result:HashObject)
			{
//				_Global.Log("sanctuaryChange OK");
				successFunc(result);
			};
			
//			var	errorFunc:Function = function(msg:String, errorCode:String)
//			{
//				_Global.Log("sanctuaryChange Error:");
//			};
			
			//---------------------------------------------------//
//			UnityNet.reqSanctuaryChange(params, okFunc, errorFunc);	
			if ( GameMain.instance().UseProtoBuffer )
			{
				//---------------------------------------------------//
				var msgReqGate : PBData.PBMsgReqGate = new PBData.PBMsgReqGate();
				msgReqGate.cid = cityId;
				msgReqGate.state = _Global.INT32(sanctype);
				
				var gateOkFunc : function(byte[]) : void = function(data : byte[])
				{
					var pbGate : PBMsgResGate.PBMsgResGate = _Global.DeserializePBMsgFromBytes.<PBMsgResGate.PBMsgResGate> (data);
					gateCoolTime = pbGate.gateCoolTime;
					if(curCityGateCoolTime.ContainsKey(cityId))
					{
						curCityGateCoolTime[cityId] = gateCoolTime;
					}
					successFunc(null);
				};
				UnityNet.RequestForGPB("gate_proto.php", msgReqGate, gateOkFunc, null, false);
			}
			else
			{
				UnityNet.reqSanctuaryChange(params, okFunc, null);
			}
		}
	} 
	
	public function raiseGoldModal()
	{
		
		var okFunc:Function = function(result:HashObject)
		{
			if(result["ok"].Value)
			{
				//need a popup window
				//raiseGoldConfirm()
				
				if(result["updateSeed"])
				{
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}
			}
			else
			{
//				_Global.Log("raiseGoldModal failed");
			}
		
		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String)
//		{
//			_Global.Log("raiseGoldModal Error:");
//		};	
		
 		var params:Array = new Array();
	 	params.Add(GameMain.instance().getCurCityId());
	 	
		//-----------------------------------------------------//
//		UnityNet.reqraiseGoldModal(params, okFunc, errorFunc);	
		UnityNet.reqraiseGoldModal(params, okFunc, null);	
		//-----------------------------------------------------//		
	}
	
	public function cityActionAbandon(tileID:int, cityID:int, xcoord:int, ycoord:int, successFunc:Function)
	{
		var okFunc:Function = function(result:HashObject)
		{
			if(result["ok"].Value)
			{
				successFunc(result);
			}
			else
			{
//				_Global.Log("cityActionAbandon failed");
			}
		
		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String)
//		{
//			_Global.Log("cityActionAbandon Error:");
//		};
		
 		var params:Array = new Array();
 		params.Add(cityID);
 		params.Add(xcoord);
 		params.Add(ycoord);
 		params.Add(tileID);
			
		//-----------------------------------------------------//
//		UnityNet.reqCityActionAbandon(params, okFunc, errorFunc);	
		UnityNet.reqCityActionAbandon(params, okFunc, null);	
		//-----------------------------------------------------//			
	
	}
	

	
	public function changeTaxModal(newTaxRate:int, successFunc:Function)
	{		
		if(newTaxRate >= 0)
		{
			var canChangeTax:Function = function(result:HashObject)
			{
				if(result["ok"].Value)
				{
					successFunc(result);
				}
				else
				{
//					_Global.Log("changeTaxModal failed");
				}
			};						
												
			
//			var canntChangeTax:Function = function(msg:String, errorCode:String)
//			{
//				_Global.Log("changeTaxModal Error:");
//			};
			
		 		var params:Array = new Array();
		 		params.Add(GameMain.instance().getCurCityId());
	 		params.Add(newTaxRate);	 					

			//--------------------------------------------------------------//
//			UnityNet.reqChangeTaxModal(params, canChangeTax, canntChangeTax);
			UnityNet.reqChangeTaxModal(params, canChangeTax, null);
			//--------------------------------------------------------------//	
		}
	}
	
	public function increaseHappinessModal()
	{
		var okFunc:Function = function(result:HashObject)
		{
			if(result["ok"].Value)
			{
				//increaseHappinessModalConfirm();
				
				if(result["updateSeed"])
				{
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}
			}
			else
			{
//				_Global.Log("increaseHappinessModal failed");
			}
		
		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String)
//		{
//			_Global.Log("increaseHappinessModal Error:");
//		};
		
 		var params:Array = new Array();
	 	params.Add(GameMain.instance().getCurCityId());
 		params.Add(2);
			
		//-----------------------------------------------------//
//		UnityNet.reqIncreaseHappinessModal(params, okFunc, errorFunc);	
		UnityNet.reqIncreaseHappinessModal(params, okFunc, null);	
		//-----------------------------------------------------//		
	}
	
	public function chariotRaceModal()
	{
		var okFunc:Function = function(result:HashObject)
		{
			if(result["ok"].Value)
			{
				
				if(result["updateSeed"])
				{
					UpdateSeed.instance().update_seed(result["updateSeed"]);
				}
				
			}
			else
			{
//				_Global.Log("chariotRaceModal failed");
			}
		
		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String)
//		{
//			_Global.Log("chariotRaceModal Error:");
//		};
		
 		var params:Array = new Array();
 		params.Add(GameMain.instance().getCurCityId());
 		params.Add(3);
			
		//-----------------------------------------------------//
//		UnityNet.reqChariotRaceModal(params, okFunc, errorFunc);	
		UnityNet.reqChariotRaceModal(params, okFunc, null);	
		//-----------------------------------------------------//		
	}	
	

	
	public function getCityWilds(successFunc:Function):void
	{
		var curCityId:int = GameMain.instance().getCurCityId();
 		var params:Array = new Array();
 		params.Add(curCityId);
 			
		var okFunc:Function = function(result:HashObject)
		{
			if(result["ok"].Value)
			{
				if(result["wilderness"])
				{										
//					var obj:Object;
					var wilder:HashObject;
					var wilders:HashObject = new HashObject();
					var arr:Array = _Global.GetObjectKeys(result["wilderness"]);
					
					for(var a:int = 0; a < arr.length; a++)
					{
						wilder = result["wilderness"][arr[a]];
						
						wilders["t" + wilder["tileId"].Value] = new HashObject({	
															"tileId":wilder["tileId"].Value,
															"xCoord":wilder["xCoord"].Value,
															"yCoord":wilder["yCoord"].Value,
															"tileLevel":wilder["tileLevel"].Value,
															"tileType":wilder["tileType"].Value, 
															"orgTileLevel":wilder["orgTileLevel"].Value,
															"tileCityId":wilder["tileCityId"].Value,
															"tileUserId":wilder["tileUserId"].Value,
															"tileAllianceId":wilder["tileAllianceId"].Value,
															"tileProvinceId":wilder["tileProvinceId"].Value,
															"tileBlockId":wilder["tileBlockId"].Value,
															"freezeEndTime":wilder["freezeEndTime"].Value,
															"freezeNeedTimes":wilder["freezeNeedTimes"].Value,
															"inSurvey":wilder["inSurvey"].Value															
															});
					}
					
					seed["wilderness"]["city" + curCityId] = wilders;
				}
				
				if(result["surveyCount"] != null)
				{
					surveyCount = _Global.INT32(result["surveyCount"]);
				}
			
				if(result["surveyLimit"] != null)
				{
					surveyLimit = _Global.INT32(result["surveyLimit"]);
				}												
																
				if(successFunc)
				{
					var conquerItems:Array = new Array();
					var conquerItem:ConquerItem;
					var conquer:HashObject; 
					
					if(result["wilderness"])
					{
						for(var c:System.Collections.DictionaryEntry in result["wilderness"].Table)
						{
							conquer = c.Value as HashObject;
							conquerItem = new ConquerItem();
							if(conquerItem.parser(conquer))
							{
								conquerItems.Push(conquerItem);
							}
						}						
					}

					successFunc(conquerItems);
				}
			}		
		};
		
//		var	errorFunc:Function = function(msg:String, errorCode:String)
//		{
//			_Global.Log("raiseGoldModal Error:");
//		};	
			
		//-----------------------------------------------------//
		UnityNet.reqCityWilds(params, okFunc, null);	
		//-----------------------------------------------------//		
	}		

    public function HasSelectiveDefense() : boolean
    {
        return HasSelectiveDefenseByCityId(GameMain.instance().getCurCityId());
    }
    
    public function HasSelectiveDefenseByCityId(cityId : int) : boolean
    {
        var defenseNode : HashObject = seed["selective_defense"];
        if (defenseNode == null)
        {
            return false;
        }
        
        var currentCityDefense : HashObject = defenseNode[String.Format("c{0}", cityId)];
        if (currentCityDefense == null)
        {
            return false;
        }
        
        var keys : String[] = _Global.GetObjectKeys(currentCityDefense);
        for (var key : String in keys)
        {
            if (key.StartsWith("u") && _Global.INT32(currentCityDefense[key]) > 0)
            {
                return true;
            }
        }
        
        return false;
    }

	public class ConquerItem
	{
		public var id:int;
		public var type:int;
		public var xCoor:int;
		public var yCoor:int;
		public var level:int;
		public var status:String;
		public var tileName:String;
		public var coldDownTime:long;
		public var isSurveying:boolean;
		public var tilePicName:String;
		
		public function ConquerItem()
		{}
		
		public function parser(data:HashObject):boolean
		{
			type = _Global.INT32(data["tileType"]);
			
			if(type == 201 || type == 202 || type == 203 || type == 204)
			{
				return false;
			}
			
			id 		= _Global.INT32(data["tileId"]);
			xCoor 	= _Global.INT32(data["xCoord"]);
			yCoor 	= _Global.INT32(data["yCoord"]);
			level 	= _Global.INT32(data["tileLevel"]);
			status 	= "";
			tileName= tileNameByType(type);
			tilePicName = getTilePicName(type, level);
			
			if(data["freezeEndTime"])
			{
				coldDownTime = _Global.INT64(data["freezeEndTime"]);
				//coldDownTime = GameMain.unixtime() + 1000;
				
			}
			
			if(data["inSurvey"])
			{
				isSurveying = _Global.INT32(data["inSurvey"]) > 0 ? true : false;
			}
			
			return true;
		}
		
		private function getTilePicName(tileType:int, level:int):String
		{
			var textureName:String;
			var imgSubIdx:int = 1;

			if(tileType == Constant.TileType.CITY)
			{
				textureName = "Barbarian";
				if(level <= 3)
				{
					imgSubIdx = 1;
				}
				else if(level <= 6)
				{
					imgSubIdx = 2;
				}
				else
				{
					imgSubIdx = 3;
				}
			}
			else
			{
				textureName = "w_" + tileType;
				switch(tileType)
				{
					case Constant.TileType.CITY:
						if(level <= 3)
						{
							imgSubIdx = 1;
						}
						else if(level <= 6)
						{
							imgSubIdx = 2;
						}
						else if(level <= 9)
						{
							imgSubIdx = 3;
						}
						else
						{
							imgSubIdx = 4;
						}
						break;
						
					case Constant.TileType.BOG:
						imgSubIdx = 1;
						break;
					
					default:
						if(level <= 3)
						{
							imgSubIdx = 1;
						}
						else if(level <= 6)
						{
							imgSubIdx = 2;
						}
						else
						{
							imgSubIdx = 3;
						}
						break;
				}
			}
			
			textureName = textureName + "_" + imgSubIdx + "_1";
			
			return textureName;
		}
		
		private function tileNameByType(type:int):String
		{
			var name:String;
			switch(type)
			{
				case Constant.TileType.BOG:
					name = Datas.getArString("Common.Bog");
					break;
					
				case Constant.TileType.GRASSLAND:
					name = Datas.getArString("Common.Grassland");
					break;
					
				case Constant.TileType.LAKE:
					name = Datas.getArString("Common.Lake");
					break;
	
				case Constant.TileType.WOODS:
					name = Datas.getArString("Common.Woods");
					break;
					
				case Constant.TileType.HILLS:
					name = Datas.getArString("Common.Hills");
					break;
					
				case Constant.TileType.MOUNTAIN:
					name = Datas.getArString("Common.Mountain");
					break;
					
				case Constant.TileType.PLAIN:
					name = Datas.getArString("Common.Plain");
					break;
			}
			
			return name;			
		}
	}
}