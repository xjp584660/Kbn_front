import System.Collections.Generic;
class MarchDataManager
{


    private	static	var	singleton:MarchDataManager;

	public	static	function	instance()
	{
		if( singleton == null ){
			singleton = new MarchDataManager();
			GameMain.instance().resgisterRestartFunc(function(){
				singleton = null;
			});
		}
		return singleton;
	}



    public var item_general_data:GeneralInfoVO ;  //已选将军信息
	public var max_troop 	:long;
	public var isAVA        :Boolean = false;

   // public var item_type_data	:Hashtable;
	//resource & troop are lists.
   //	protected var max_troop 	:long;
    public var max_resource	:long;
    public var carmotload_resource	:long;
    public var march_time	:long;
    public var select_troops :long;
    public var select_resources:long;
	//data for  send
	public var reqVAR:Hashtable = {};
	public var march_type 	:int;
	public var troopList		:Array;
	public var generalList	:Array;
	public var resourceList	:Array;
	public var heroList		:Array;
	public var fx	:int;
	public var fy	:int;
	public var tx	:int;
	public var ty	:int;
    public var destTilePlayer:int ;
    public var MAXSIZE:long;
    public var resignSelectMarchCount:int=0;
    public var oneTimeMarchSizeBuff:String = "";
	public var VisibleMarchCount:int = 1;
	public var picCampTileLevel:int = 0;
	public var extraMarchCount=0;
	public var marchresource:long[] = [0l,0l,0l,0l,0l,0l,0l,0l];
	public var item_type_data	:Hashtable;

    private var requestId:long = 0;
    private var requestName:String;




    public var oneTimeBuffs : String = ""; //buff
    private var resianTroopList:Array;
    private var carmotWeight:float = 1;
	private var showErrorFlag:boolean=false;





    function Init()
    {
        var seed:HashObject = GameMain.instance().getSeed();
		carmotWeight = _Global.FLOAT(seed["carmotweight"].Value);
		destTilePlayer = -1;
		marchHeroId.Clear();
	    oneTimeBuffs = "";
		isAVA = false;
		item_type_data = null;
		item_general_data = null;
		cachedData = null;
		resignSelectMarchCount = 0;
		VisibleMarchCount = 1;
	    picCampTileLevel = 0;
	    extraMarchCount=0;
    }

	public function Clear()
	{
		this.marchHeroId.Clear();
		this.oneTimeBuffs = "";
		item_type_data = null;
		item_general_data = null;
		cachedData = null;
		singleton = null;

	}
	function SetMarchType(type:int)
	{
      this.march_type = type;
	}

	function SetData(param:Object):void
    {
		Init();
		var data:Hashtable = param as Hashtable;
		this.cachedData = data;
		if(data != null && data["ava"] != null)
		{
			PrepareAvaData();
			isAVA = true;
		}
		else
		{
			PrepareData(data);
			isAVA = false;
			//refreshGeneralScrollData();
		}
		CheckDisplayMarchTypeCon(data);
			if(march_type == -1)
			{
               MenuMgr.getInstance().PushMenu("MarchTypeCon",param,"trans_zoomComp");
			}
			else if(IsDefaultType())
			{
				MenuMgr.getInstance().PushMenu("MarchDefaultMenu",null,"trans_zoomComp");
			}
			else if( march_type == Constant.MarchType.TRANSPORT||march_type == Constant.MarchType.REASSIGN )
			{
				MenuMgr.getInstance().PushMenu("ChooseTroops",null,"trans_zoomComp");
			}
			else
			{
			   MenuMgr.getInstance().PushMenu("SelectKnight",param,"trans_zoomComp");
			}

	}



	//Data -----------------------------------------------------------------------------------
	public function PrepareData(data:Hashtable)
	{
		//this.unitstats =  Datas.instance().getGameData()["unitstats"];
		var cityId:int = GameMain.instance().getCurCityId();
		this.max_troop = March.instance().getTroopMax(cityId,null, (null != data && _Global.INT32(data["type"]) == Constant.MarchType.AVA_SENDTROOP));
		this.item_type_data = null;
		this.select_troops = 0;
		this.select_resources = 0;
		this.item_general_data = null;

		var cityInfo:HashObject = GameMain.instance().GetCityInfo(cityId);
		if(cityInfo)
		{
			fx = _Global.INT32( cityInfo[_Global.ap+2] );
			fy = _Global.INT32( cityInfo[_Global.ap+3] );
		}
		if(data && data["res"] != null && _Global.INT64(data["res"]) > 0)
		{
			troopList = Barracks.instance().GetTroopListWithOutZero(data["res"]);
			troopList.Sort(Barracks.TroopInfo.CompareByLevelAndType);
		}
		else
		{
			troopList = Barracks.instance().GetTroopListWithOutZero();
			troopList.Sort(Barracks.TroopInfo.CompareByLevelAndType);
			troopList.Reverse();

		}

		if(data && data["isCamp"] !=null && _Global.INT32(data["isCamp"])>0){
			SetPictTileLevel(_Global.INT32(data["tileLevel"]));
		}else{
			SetPictTileLevel(0);
		}

		if(data != null)
		{
			requestId = _Global.INT64(data["requestId"]);
			requestName = data["requestUser"];
		}
		else
		{
			requestId = 0;
			requestName = String.Empty;
		}
		generalList = General.instance().getMarchAbleKinghtList(-1);

		var resArr:long[]=null; ;
		if(cachedData!=null && cachedData["cityId"]!=null)
		{
			if(!CanTransportCarmot(cityId,_Global.INT32(cachedData["cityId"]))){//;
				resArr = [0l,0l,0l,0l,0l];
			}else{
				resArr = [0l,0l,0l,0l,0l,0l];
			}
		}else
		{
			if(Resource.instance().GetCastleLevel()>=Constant.CarmotLimitLevel){
				resArr = [0l,0l,0l,0l,0l,0l];
			}else{
				resArr = [0l,0l,0l,0l,0l];
			}
		}

		if(data && data["resArr"] != null)
		{
			var res:Array = (data["resArr"] as String).Split(","[0]);
			if(res.length>4 && res.length <= resArr.Length)
			{
				for(var idx:int =0;idx < res.length;idx++)
				{
					resArr[idx] = _Global.INT64(res[idx]);
				}
			}
		}
		resourceList = Resource.instance().getTransPortResourceList(cityId,resArr);

		var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
		heroList = (KBN.HeroManager.Instance.GetMarchHeroList(currentCityIndex) as List.<KBN.HeroInfo>).ToArray();
	}
	public function PrepareAvaData()
	{
		//this.unitstats =  Datas.instance().getGameData()["unitstats"];
		var avaMarch:AvaMarch = GameMain.Ava.March;
		var avaUnits:AvaUnits = GameMain.Ava.Units;
		var cityId:int = GameMain.instance().getCurCityId();
		this.max_troop = avaMarch.GetMaxTroops(null);
		this.item_type_data = null;
		this.select_troops = 0;
		this.select_resources = 0;
		this.item_general_data = null;
		this.fx = GameMain.Ava.Seed.MyOutPostTileX;
		this.fy = GameMain.Ava.Seed.MyOutPostTileY;

		troopList = avaUnits.TroopList.ToArray();
		troopList.Sort(Barracks.TroopInfo.CompareByLevelAndType);
		troopList.Reverse();

		generalList = avaUnits.GetMarchGeneralList().ToArray();
		heroList = avaUnits.GetMarchHeroList().ToArray();
		resourceList = new Array();
	}
	public function SetPictTileLevel(level:int){
		picCampTileLevel=level;
	}
	private var rallyId:int;
    private function CheckDisplayMarchTypeCon(data : Hashtable) : void
    {
    	if(data != null && data["type"] != null && _Global.INT32(data["type"]) == Constant.MarchType.JION_RALLY_ATTACK)
    	{
    		if(data["rallyId"] != null)
    		{
    			rallyId = _Global.INT32(data["rallyId"]);
    		}
    	}else
        if (data != null &&  data["x"] != null && data["y"] != null && data["type"] != null && _Global.INT32(data["type"]) != Constant.MarchType.RALLY_ATTACK)
        {
            march_type = _Global.INT32(data["type"]);
            //nextHandler(null);
        }
        else
        {
            // nc.push(mc_type);
            // item_type_data = mc_type.getDefaultTypeData();
			// march_type = item_type_data["type"];
			march_type = -1;

		}
		if(data != null&&data["x"]!=null && data["y"]!=null)
		{
		  tx = _Global.INT32(data["x"]);
		  ty = _Global.INT32(data["y"]);
		}
		GetDistTileInfo();
    }
	//DataEnd ----------------------------------------------------------------------------------

    public var marchHeroId : List.<long> = new List.<long>();

	public var cachedData : Hashtable;

	public function GetJoinHeroCount() : int
	{
		return marchHeroId.Count;
	}

	public function GetMarchType() : int
	{
		return march_type;
	}

	public function ContainHero(heroId : long) : boolean
	{
		return marchHeroId.Contains(heroId);
	}

	public function JoinHero(heroId : long) : void
	{
		if (!ContainHero(heroId))
		{
			marchHeroId.Add(heroId);
		}
	}

	public function DisJoinHero(heroId : long) : void
	{
		if (ContainHero(heroId))
		{
			marchHeroId.Remove(heroId);
		}
    }

	public function ClearHero()
	{
		marchHeroId.Clear();
	}




	function CanTransportCarmot(curCityId:int,targetCityId):boolean
	{
		if(Resource.singleton.GetCastleLevel(curCityId)<Constant.CarmotLimitLevel || Resource.singleton.GetCastleLevel(targetCityId)<Constant.CarmotLimitLevel){
			return false;
		}else return true;
    }


	 function GetDistTileInfo():void
	{
		if (-1 == destTilePlayer  &&
			(tx >= 1 && tx <= Constant.Map.WIDTH && ty >= 1 && ty <= Constant.Map.HEIGHT) )
		{
			if(march_type == Constant.MarchType.ATTACK || march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE){
				MapMemCache.instance().switchDataSet( true );
				var tile : HashObject = MapMemCache.instance().getTileInfoData(tx, ty);
				if (null != tile)
				{
					destTilePlayer = _Global.INT32(tile["tileUserId"]);
				}
				else
				{
					UnityNet.reqDestTileInfo(tx, ty, onGetDestTileInfo, null);
					return;
				}
			}
		}

			// showErrorFlag=false;
			// if(march_type == Constant.MarchType.TRANSPORT || march_type ==Constant.MarchType.REASSIGN || march_type == Constant.MarchType.ATTACK){
			// 	UnityNet.reqDestTileInfo(tx, ty, onGetDestTileInfo, null);
			// 	return;
			// }

	}

    protected function onGetDestTileInfo(result : HashObject)
	{
		if (_Global.GetBoolean(result["ok"])) {

			if (march_type == Constant.MarchType.ATTACK && null != result["tileinfo"])
			{
				 if(_Global.INT32(result["tileinfo"]["tileType"])==Constant.TileType.CITY && _Global.INT32(result["tileinfo"]["tileUserId"])==0)
				 {
					picCampTileLevel = _Global.INT32(result["tileinfo"]["tileType"]);
					//if(destTilePlayer == -1) checkUI(nc.topUI);
				  }else{
					destTilePlayer = _Global.INT32(result["tileinfo"]["tileUserId"]);
					//checkUI(nc.topUI);
					//nextHandler(null);
				}
			}else if(march_type == Constant.MarchType.TRANSPORT || march_type == Constant.MarchType.REASSIGN)
			{
				var cityId:int = GameMain.instance().getCurCityId();
				var userId:int=GameMain.instance().getUserId();
				if(march_type == Constant.MarchType.REASSIGN && userId!=_Global.INT32(result["tileinfo"]["tileUserId"])){
					showErrorFlag=true;
				}
				if(_Global.INT32(result["tileinfo"]["tileType"])==Constant.TileType.CITY){
					var resArr:long[]=null;
					if(_Global.INT32(result["tileinfo"]["tileLevel"])>=Constant.CarmotLimitLevel){
						resArr = [0l,0l,0l,0l,0l,0l];
					}else{
						resArr = [0l,0l,0l,0l,0l];
					}

					resourceList = Resource.instance().getTransPortResourceList(cityId,resArr);
					//scroll_resource.SetData(resourceList);
//					nextHandler(null);
				}else{
				showErrorFlag=true;
				//阻止发送运输March
//				ErrorMgr.instance().PushError("",Datas.getArString("Error.err_201"));
//				navHead.pop2RootUI();
				}
				//checkUI(nc.topUI);
			}
		}

	}

	public function GetNextBtnTxt():String
	{
		var txt:String = Datas.getArString("Common.Next_Button");
		if(IsDefaultType())
		{
			return txt;
		}
		switch(march_type)
			{
				case Constant.MarchType.REINFORCE:
				case Constant.AvaMarchType.REINFORCE:
					txt = Datas.getArString("Common.Reinforce");
					break;
				case Constant.MarchType.ATTACK:
				case Constant.MarchType.PVE:
				case Constant.MarchType.ALLIANCEBOSS:
				case Constant.AvaMarchType.ATTACK:
					txt = Datas.getArString("Common.Attack");
                    break;
				case Constant.MarchType.COLLECT:
                    txt = Datas.getArString("Newresource.tile_button_gather");
                    break;
                case Constant.AvaMarchType.RALLYATTACK:
                    txt = Datas.getArString("AVA.chrome_rallyattackbtn");
					break;
				case Constant.MarchType.AVA_SENDTROOP:
					txt = Datas.getArString("Common.Deploy");
					break;

			}
			return txt;
	}
	public function IsDefaultType():Boolean
	{
		return  march_type == Constant.MarchType.ATTACK || march_type == Constant.MarchType.PVE;
	}
	public function SetTroopData(list:Array):void
	{
		if(list.length <= 0 )
		{
			return;
		}
		var troopInfo :Barracks.TroopInfo;
		var speed:float = 65535;
		var uspd:float;
		var base_speed:float=0f;
		this.select_troops = 0;
		var suitAndSkillAdd:float=0;
		var knight:Knight = null;

		var currentcityid:int = GameMain.instance().getCurCityId();
		var tr1:float = Research.instance().bonusForType(Constant.Research.ROADS);
		var tr2:float = Research.instance().bonusForType(Constant.Research.HORSE);
		var logisticsCtrBonus:float = ((march_type == Constant.MarchType.ATTACK || march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE) ? 0f : 0.5 * Building.instance().getMaxLevelForType(Constant.Building.RELIEF_STATION, currentcityid));
		var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
		if(item_general_data != null)
		{
			var knightID:int = item_general_data.knightId;
			 knight = GearManager.Instance().GearKnights.GetKnight(knightID);
			if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
			{
				this.max_troop = GameMain.Ava.March.GetMaxTroops(knight);
			}
			else
			{
				this.max_troop = March.instance().getTroopMax(currentcityid,knight,(march_type == Constant.MarchType.AVA_SENDTROOP));
			}

			var speeddatas:Dictionary.<int,double>[] = GearReport.Instance().Calculate(knight.Arms);
			suitAndSkillAdd = GearReport.Instance().GetSuitAndSkillAdd(knight.Arms,4);
		}
		var allMarchSpeedBuff:BuffValue = new BuffValue();

		if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
			allMarchSpeedBuff = GameMain.PlayerBuffs.AvaSelfRunningBuffs.GetRunningBuffsValueBy(BuffScene.Ava, BuffTarget.UnitSpeed, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));
		else
			allMarchSpeedBuff = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy(BuffScene.Home, BuffTarget.UnitSpeed, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));

		for(var i:int = 0; i< list.length; i++)
		{
			troopInfo = list[i] as Barracks.TroopInfo;
			if (troopInfo == null)
			{
				continue;
			}
			if(troopInfo.selectNum <= 0)
				continue;
			this.select_troops += troopInfo.selectNum;
		// }


			if(AvaMarch.IsAvaMarch(march_type))
			{
				uspd = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,troopInfo.typeId,Constant.TroopAttrType.AVASPEED);
			}
			else
			{
				uspd = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,troopInfo.typeId,Constant.TroopAttrType.SPEED);
			}

			base_speed=uspd;

			var troopType : int = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(null,troopInfo.typeId,Constant.TroopAttrType.TYPE);
			var speedBuffValue:BuffValue = new BuffValue();
			if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
				speedBuffValue = GameMain.PlayerBuffs.AvaSelfRunningBuffs.GetRunningBuffsValueBy(BuffScene.Ava, BuffTarget.UnitSpeed, new BuffSubtarget( BuffSubtargetType.UnitType, troopType ));
			else
				speedBuffValue = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy(BuffScene.Home, BuffTarget.UnitSpeed, new BuffSubtarget( BuffSubtargetType.UnitType, troopType ));

			var buffP:float = speedBuffValue.Percentage + allMarchSpeedBuff.Percentage;
			var buffN:int = speedBuffValue.Number + allMarchSpeedBuff.Number;

			// Debug.LogWarning("uspd="+uspd);
			// Debug.LogWarning("buffP="+buffP+"  buffN="+buffN);
			var buspd = uspd;
			if (troopInfo.actType == Constant.TroopActType.Hourse)
				if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
					uspd = uspd * (1 + HeroManager.Instance().GetHeroSkillAffectedRatio(KBN.GameMain.Ava.Units.HeroIDList, KBN.HeroSkillAffectedProperty.HorseSpeed)+HeroManager.Instance().GetHeroSkillAffectedRatioLong(marchHeroId, KBN.HeroSkillAffectedProperty.Fast)+buffP)+buffN;
				else
					uspd = uspd * (1 + tr1 + tr2 + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.HorseSpeed)+HeroManager.Instance().GetHeroSkillAffectedRatioLong(marchHeroId, KBN.HeroSkillAffectedProperty.Fast) + buffP + logisticsCtrBonus) + buffN;	//(1 + Research.bonusForType(Constant.Research.HORSE));
			else
				if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
					uspd = uspd * (1 + HeroManager.Instance().GetHeroSkillAffectedRatio(KBN.GameMain.Ava.Units.HeroIDList, KBN.HeroSkillAffectedProperty.GroundSpeed)+HeroManager.Instance().GetHeroSkillAffectedRatioLong(marchHeroId, KBN.HeroSkillAffectedProperty.Fast)+buffP)+buffN;
				else
					uspd = uspd * (1 + tr1 + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.GroundSpeed)+HeroManager.Instance().GetHeroSkillAffectedRatioLong(marchHeroId, KBN.HeroSkillAffectedProperty.Fast) + buffP + logisticsCtrBonus) + buffN;
			//troopInfo.typeId
			if(knight != null)
			{
				if(speeddatas != null && speeddatas.length > 4)
				{
					var d : double = 1.0f;
					if ( speeddatas[4].TryGetValue(troopInfo.typeId, d) )
						uspd += buspd * d;
				}
			}
			// Debug.LogWarning("zuizhong_uspd="+uspd);
			if(uspd < speed){
				speed = uspd;
			}
		}


		if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1){

		}else{
			speed *= Technology.instance().getTroopsMarchSpeed();
		}

		if(cachedData != null) //世界boss speed
		{
			var toX = _Global.INT32(cachedData["x"]);
			var toY = _Global.INT32(cachedData["y"]);
			if(WorldBossController.singleton.isWorldBoss(toX, toY))
			{
					// Debug.LogWarning('base_speed='+base_speed);
					// Debug.LogWarning('buff_speed='+speed);
					// Debug.LogWarning('buff/base='+speed/base_speed);

					var sqrt0:float=GameMain.singleton.GetWorldBossSqrt()==0?1f:GameMain.singleton.GetWorldBossSqrt();
					speed = base_speed*Mathf.Pow(speed/base_speed, sqrt0);

					// Debug.LogWarning('now_speed='+speed);
			}
		}

		var dx:int = fx - tx;
		var dy:int = fy - ty;

		var dist:double = (dx * dx) + (dy * dy);
		dist = Mathf.Sqrt(dist);

		if(march_type ==Constant.MarchType.REASSIGN){
			var temp:float = 0;
			if(select_troops>0) temp = select_troops/(max_troop*1.00f + AddMarchSizeData.getInstance().GetSelectedBuffSize());
			var marchNum:int=_Global.CeilToInt(temp);
			if (marchNum>=VisibleMarchCount) {
				marchNum=VisibleMarchCount;
			}
			//resignSelectMarchCount=marchNum;
		}

		if(march_type == Constant.MarchType.PVE)
		{
			march_time = (KBN.PveController.instance().GetCurLevelMarchTime())/( 1 + allMarchSpeedBuff.Percentage );
		}
		else if(march_type == Constant.MarchType.ALLIANCEBOSS)
		{
			march_time = (KBN.AllianceBossController.instance().GetCurLevelMarchTime())/( 1 + allMarchSpeedBuff.Percentage );
		}
		else if(march_type == Constant.MarchType.AVA_SENDTROOP){
			march_time = 0;
		}
		else{

			march_time = Mathf.Max(Mathf.Ceil(dist * 6000f / speed),30);	//seconds.
		}

	}



	 //Check

	 protected function check2NextForAva():String
	{
		var error:int = 0;
		var errorStr:String ="";
				if(march_type < 0)
				{
					error = 1;
					errorStr = Datas.getArString("Error.March_NeedType");
				}else if(tx == 0 || ty == 0)
				{
					error = 2;
					errorStr = Datas.getArString("Error.March_NeedXY");
				}else if(item_general_data == null)
				{
					error =  11;
					errorStr = Datas.getArString("Error.March_NeedGeneral");
				}else if(select_troops <= 0)
				{
					error = 21;
					errorStr = Datas.getArString("Error.March_NeedTroops");
				}
				else if(select_troops > (max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize()) /*+ Technology.instance().getAddMarchCount()*/)
				{
					error = 21;
					errorStr = Datas.getArString("ModalAttack.OverMarch");
				}

		return errorStr;
	}

	protected function check2Next():String
	{
		var error:int = 0;
		var errorStr:String ="";
				if(march_type < 0)
				{
					error = 1;
					errorStr = Datas.getArString("Error.March_NeedType");
				}else
				if(tx == 0 || ty == 0)
				{
					error = 2;
					errorStr = Datas.getArString("Error.March_NeedXY");
				}
				else if (item_general_data == null && (march_type != Constant.MarchType.REASSIGN && march_type != Constant.MarchType.TRANSPORT
					&& march_type != Constant.MarchType.GIANTTPWER))
				{
					error =  11;
					errorStr = Datas.getArString("Error.March_NeedGeneral");
				}
				else if(item_general_data != null&&CheckKnight(item_general_data.knightId))
				{
					var name:String = General.singleton.getKnightShowName(item_general_data.knightName, GameMain.instance().getCurCityOrder());
					errorStr = String.Format(Datas.getArString("Preset.KnightNotInCity"),name);
				}
				else if(select_troops <= 0|| troopList.length <= 0)
				{
					error = 21;
					errorStr = Datas.getArString("Error.March_NeedTroops");
				}
				else if(select_troops > VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize() /*+ Technology.instance().getAddMarchCount()*/)+extraMarchCount)
				{
					error = 21;
					errorStr = Datas.getArString("ModalAttack.OverMarch");
				}
				else if(CheckTroops())
				{
					errorStr = Datas.getArString("Preset.TroopsLack");
				}
				else if (march_type == Constant.MarchType.REASSIGN || march_type == Constant.MarchType.TRANSPORT || march_type == Constant.MarchType.GIANTTPWER)
				{
					if  (select_resources <= 0)
					{
						if (march_type != Constant.MarchType.REASSIGN && march_type != Constant.MarchType.GIANTTPWER)
						{
							error = 22;
							errorStr = Datas.getArString("Error.March_NeedResources");
						}
					}
					else
					if(select_resources > max_resource)
					{
						error = 23;
						errorStr = Datas.getArString("Error.March_ResourceLimited");
					}
				}
			    else if(Building.instance().getMaxLevelForType(Constant.Building.GENERALS_QUARTERS,GameMain.instance().getCurCityId() ) <= 0)
				{
					error = 21;
					errorStr = Datas.getArString("March.Need_GeneralsQuarters");
				}
				else{
					if(marchHeroId.Count>0)
					{
						var str:String = CheckHero();
						if(!String.IsNullOrEmpty(str))
						{
							errorStr = String.Format(Datas.getArString("Preset.HeroNotInCity"),str);
							this.marchHeroId.Clear();
							return errorStr;
						}
						else
						{
							var str2:String = CheckSleepHero();
							if(!String.IsNullOrEmpty(str2))
							{
								errorStr = String.Format(Datas.getArString("Preset.HeroSleep"),str2);
								this.marchHeroId.Clear();
								return errorStr;
							 }
						}

					}
					if(!String.IsNullOrEmpty(oneTimeBuffs))
					{
						var str1 = CheckBuff();
						if(!String.IsNullOrEmpty(str1))
						{
							errorStr = String.Format(Datas.getArString("Preset.NoBuffItem"),str1);
							oneTimeBuffs = "";
						}
					}
			}

		return errorStr;
	}


	private function CheckKnight(kid:int):Boolean
	{
		var bool:Boolean = true;
		var list:Array = General.instance().getMarchAbleKinghtList(-1);
		for(var i:int = 0;i<list.length;i++)
		{
			if((list[i] as GeneralInfoVO).knightId == kid)
			{
				bool = false;
				break;
			}
		}
		return bool;
	}

	public function CheckSelectTroops()
	{
		for(var i:int = 0;i < troopList.length;i++)
		{
			var troopInfo:Barracks.TroopInfo = troopList[i] as Barracks.TroopInfo;
			if(troopInfo!=null){
				var cityId:int = GameMain.instance().getCurCityId();
				var owned:long = Barracks.instance().getUnitCountForType(troopInfo.typeId, cityId);
				if(troopInfo.selectNum > owned)
				{
					troopInfo.selectNum = owned;
				}
			}
		}
	}


	private function CheckTroops():Boolean
	{
		var bool:Boolean = false;

		for(var i:int = 0;i < troopList.length;i++)
		{
			var troopInfo:Barracks.TroopInfo = troopList[i] as Barracks.TroopInfo;
			if(troopInfo!=null){
				var cityId:int = GameMain.instance().getCurCityId();
				var owned:long = Barracks.instance().getUnitCountForType(troopInfo.typeId, cityId);
				if(troopInfo.selectNum > owned)
				{
					bool = true;
					break;
				}
			}
		}
        return bool;
	}
	private function CheckHero():String
	{
		var str:String = "";
		for(var heroId:long in marchHeroId)
		{
			var info:KBN.HeroInfo = KBN.HeroManager.Instance.GetHeroInfo(heroId);
			if(info.Status == KBN.HeroStatus.Marching||info.Status == KBN.HeroStatus.Unassigned)
			{
				str = info.Name;
				break;
			}
		}
		return str;
	}
	private function CheckSleepHero():String
	{
		var str:String = "";
		for(var heroId:long in marchHeroId)
		{
			var info:KBN.HeroInfo = KBN.HeroManager.Instance.GetHeroInfo(heroId);
			if(info.Status == KBN.HeroStatus.Sleeping)
			{
				str = info.Name;
				break;
			}
		}
		return str;
	}

	private function CheckBuff():String
	{
		var str:String = "";

		var arr:String[] = oneTimeBuffs.Split(','[0]);
		for(var j:int = 0;j < arr.length;j++)
		{
			var buffId :long = _Global.INT64(arr[j]);
			if(buffId>0){
				var itemNum:int = MyItems.singleton.countForItem(buffId);
				if(itemNum<=0)
				{
					str = Datas.getArString("itemName.i" + buffId);
					break;
				}
			}
		}
		return str;
	}
	// if (CheckShouldStartAvaRallyAttack(ui))
    //     {
    //         MenuMgr.getInstance().PopMenu("MarchMenu");
    //         MenuMgr.getInstance().PushMenu("AvaRallyAttackTimeSettings",
    //         {
    //             "x" : _Global.INT32(cachedData["x"]),
    //             "y" : _Global.INT32(cachedData["y"]),
    //             "type" : march_type
    //         }, "trans_zoomComp");
    //         return;
    //     }
	 //CheckEnd


	//StartMarch -------------------------------------------------------------------


	public function SendMarch():void
	{
	   var errorStr:String ="";
	   if(isAVA)
	   {
		   errorStr = check2NextForAva();
	   }
	   else
	   {
		   errorStr = check2Next();
	   }

		if(!String.IsNullOrEmpty(errorStr))
		{
			ErrorMgr.instance().PushError("",errorStr);
			return;
		}

		var peaceTime:long = KBNPlayer.Instance().getTruceExpireUnixTime();
		var nowTime:long = GameMain.unixtime();
		if (destTilePlayer > 0 && (march_type == Constant.MarchType.ATTACK || march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE)  && nowTime < peaceTime) {
			var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
			dialog.setLayout(600,380);
			dialog.setTitleY(60);
			dialog.setContentRect(70,140,0,100);
			dialog.setButtonText(Datas.getArString("Common.Yes"),Datas.getArString("Common.No") );
			MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("PeaceTime.BreakTips"), "", function() {
				MenuMgr.getInstance().sendNotification (Constant.Notice.SEND_MARCH,null);
				startMarch();
			}, null);

			return;
		}

		if(march_type == Constant.AvaMarchType.ATTACK || march_type == Constant.AvaMarchType.REINFORCE ||  march_type == Constant.AvaMarchType.SCOUT
			|| march_type == Constant.AvaMarchType.RALLYATTACK || march_type == Constant.AvaMarchType.RALLYREINFORCE)
		{
			startAvaMarch();
		}
		else
		{
			startMarch();
		}
	}

    public function startAvaMarch():void
	{
		var marchInfo:PBMsgReqAVA.PBMsgReqAVA.ReqMarchInfo = new PBMsgReqAVA.PBMsgReqAVA.ReqMarchInfo();
		var troopInfo:PBMsgReqAVA.PBMsgReqAVA.unit ;
		marchInfo.marchType = march_type;
		//troop
		for(var i:int=0; i < troopList.length; i++)
		{
			var troop:Barracks.TroopInfo = troopList[i] as Barracks.TroopInfo;
			if (troop != null)
			{
				if(troop.selectNum > 0)
				{
					troopInfo = new PBMsgReqAVA.PBMsgReqAVA.unit();
					troopInfo.unitId = troop.typeId;
					troopInfo.count = troop.selectNum;
					marchInfo.unitlist.Add(troopInfo);
				}
			}
		}
		//hero
		for (var heroId : long in marchHeroId)
		{
			marchInfo.herolist.Add(heroId);
		}
		//knight
		if(item_general_data != null)
		{
			marchInfo.knightid = item_general_data.knightId;
		}

		marchInfo.fromXCoord = GameMain.Ava.Seed.MyOutPostTileX;
		marchInfo.fromYCoord = GameMain.Ava.Seed.MyOutPostTileY;
		marchInfo.fromTileId = GameMain.Ava.Seed.MyOutPostTileId;
		marchInfo.toXCoord = tx;
		marchInfo.toYCoord = ty;
		if(marchInfo.marchType == Constant.AvaMarchType.RALLYATTACK)
		{
			marchInfo.rallyTime = _Global.INT32(cachedData["rallyTime"]);
		}
		else if(marchInfo.marchType == Constant.AvaMarchType.RALLYREINFORCE)
		{
			marchInfo.joinRallyAttackMarchId = _Global.INT32(cachedData["rallyAttackId"]);
		}
		GameMain.Ava.March.RequestMarch(marchInfo);
//		MenuMgr.getInstance().PopMenu("");
		MenuMgr.getInstance().sendNotification (Constant.Notice.SEND_MARCH,null);
    }
    protected function excuteMarchOK(result:HashObject):void
	{
		//UpdateSeed.instance().update_seed_ajax(true, null);
		var marchStatus:int = _Global.INT32(result["marchState"]);

		if (result["itemCount"]!=null) {
			var count=_Global.INT32(result["itemCount"]);
			MyItems.singleton.subtractItem (3298, count);
		}

		//Object	public	function	addQueue (marchid, start:int, eta:int, xcoord, ycoord, type, kid, resources, tid, ttype, tlevel)
		//close();
		AddMarchSizeData.getInstance().ResetBuffListData();
		var ut:long = GameMain.instance().unixtime();
		var timediff:long;

	 	timediff=System.Int64.Parse(result["eta"].Value) - System.Int64.Parse(result["initTS"].Value);

		var tobj:Object = reqVAR;

		var  mid:String = result["marchId"].Value;
		var xcoord:String = reqVAR["xcoord"];	//result["xcoord"];
		var ycoord:String = reqVAR["ycoord"];	//result["ycoord"];
		var type:String = reqVAR["type"] + "";	// result["type"];
		var kid:String = "0";
		if(reqVAR["kid"])
			kid = reqVAR["kid"] + "";	//result["kid"];
		var tileId:String = result["tileId"].Value;
		var tileType:String = result["tileType"].Value;
		var tileLevel:String = result["tileLevel"].Value;
		var surveyStatus:int = 0;
		var rallyId:int = result["rallyId"].Value;
//		if(timediff <= 0)
//		{
//			Debug.Break();
//		}
		if(march_type == Constant.MarchType.ATTACK && picCampTileLevel >10){
			Datas.instance().reducePicCampRemainTimes(1);
		}

		if(march_type == Constant.MarchType.ATTACK && picCampTileLevel >=1 && picCampTileLevel <= 10)
		{
			Datas.instance().reducePicCampAttackTimes(1);
		}

		var heroList : Array = _Global.GetObjectValues(result["userHeroIds"]);
		for (var i : HashObject in heroList)
		{
			var heroId : long = _Global.INT64(i);
			KBN.HeroManager.Instance.SetHeroMarchStatus(heroId);
		}

		var worldBossId:int = 0;
		if(WorldBossController.singleton.isWorldBoss(_Global.INT32(xcoord), _Global.INT32(ycoord)))
		{
			var bossId : int = KBN.WorldBossController.singleton.GetCurBossId();
			var key:String = xcoord + "_" + ycoord;
			PlayerPrefs.SetString(GameMain.singleton.getUserId()+"_"+Datas.singleton.worldid()+"_"+bossId, key);
			worldBossId = 999;
		}

		var atObj:HashObject = March.instance().addToSeed(mid, ut, ut+timediff, xcoord, ycoord,type,kid,tileId, tileType, tileLevel,surveyStatus,marchStatus,rallyId,worldBossId);
		if (!String.IsNullOrEmpty(_Global.GetString(result["buffItems"])))
		{
			atObj["buffItems"] = result["buffItems"];
		}

		// fill Resource and Troop
		var idx:int;
		var xid:Barracks.TroopInfo;
		var intType:int = _Global.INT32(type);
		var troopsCount:int = 0;
		for(idx=0; idx < lastMarchSelectTroops.Count; idx++)
		{
			xid = lastMarchSelectTroops[idx];
			atObj["unit" + xid.typeId + "Count"] = new HashObject( "" + xid.selectNum);
			troopsCount += xid.selectNum;

			if(intType == Constant.MarchType.TRANSPORT || intType == Constant.MarchType.REINFORCE || intType == Constant.MarchType.AVA_SENDTROOP)	//reinforce/transport all troops will be returned if it returned auto.
			{
				atObj["unit" + xid.typeId + "Return"]  = new HashObject( "" + xid.selectNum);
			}
			else
			{
				atObj["unit" + xid.typeId + "Return"]  = new HashObject( "0");
			}

			Barracks.instance().addUnitsToSeed(xid.typeId, -xid.selectNum);
		}
		// for(idx=0; idx < troopList.length; idx++)
		// {
		// 	xid = troopList[idx] as Barracks.TroopInfo;
		// 	atObj["unit" + xid.typeId + "Count"] = new HashObject( "" + xid.selectNum);
		// 	troopsCount += xid.selectNum;

		// 	if(intType == Constant.MarchType.TRANSPORT || intType == Constant.MarchType.REINFORCE || intType == Constant.MarchType.AVA_SENDTROOP)	//reinforce/transport all troops will be returned if it returned auto.
		// 	{
		// 		atObj["unit" + xid.typeId + "Return"]  = new HashObject( "" + xid.selectNum);
		// 	}
		// 	else
		// 	{
		// 		atObj["unit" + xid.typeId + "Return"]  = new HashObject( "0");
		// 	}

		// 	Barracks.instance().addUnitsToSeed(xid.typeId, -xid.selectNum);
		// }

		for(idx=0; idx < resourceList.length; idx++)
		{
			var recid:ResourceVO = resourceList[idx] as ResourceVO;
			marchresource[recid.id] = recid.selectNum;
			Resource.instance().addToSeed(recid.id, -recid.selectNum,GameMain.instance().getCurCityId());
		}

		Resource.instance().UpdateRecInfo();
		Barracks.instance().UpadateAllTroop();

		//this.sendNotification(Constant.Notice.ON_MARCH_OK,null);

		March.instance().addSeedMarchObj2Mgr(GameMain.instance().getCurCityId(),atObj);

		if(this.requestId > 0)
		{
			var message:String = "";
			if(intType == Constant.MarchType.REINFORCE) {
				message = String.Format(Datas.getArString("Alliance.ReinforceStatus"),KBNPlayer.Instance().getName(),requestName,troopsCount,timediff/60);
				MenuMgr.getInstance().getChatMenu().AllianceRequestAnswer(Constant.AllianceRequestType.REINFORCE, requestName, timediff / 60, troopsCount.ToString(), message);
			}
			else if(intType == Constant.MarchType.TRANSPORT)
			{
				message = String.Format(Datas.getArString("Alliance.ResourceStatus"),KBNPlayer.Instance().getName(),requestName,AllianceRequest.ResString(marchresource),timediff/60);
				var resCount : String[] = new String[marchresource.Length];
				for (var i : int = 0; i < resCount.Length; i++)
				{
					resCount[i] = (marchresource[i] > 0 ? _Global.NumSimlify(marchresource[i]) : "");
				}
				MenuMgr.getInstance().getChatMenu().AllianceRequestAnswer(Constant.AllianceRequestType.RESOURCE, requestName, timediff / 60, String.Join("_", resCount), message);
			}
		}

		if (_Global.GetBoolean(result["needCancelPeace"])) // cancel peace dove protection
		{
			KBNPlayer.Instance().setTruceExpireUnixTime(0);
			BuffAndAlert.instance().updateBuff(Constant.BuffType.BUFF_TYPE_PEASE, -1);
		}

        if (intType == Constant.MarchType.AVA_SENDTROOP)
        {
            GameMain.instance().seedUpdate(false);
		}
		if(march_type != Constant.MarchType.REASSIGN)
		{
			Clear();
		}
		/**
		var rb:RallyPointBuilding = MenuMgr.getInstance().GetCurMenu() as RallyPointBuilding;
		if(rb)
			rb.refreshData();
		**/
    }
    protected function excuteReasignMarch(useMarchSizeBuff:boolean,finnal:boolean):void
	{
		//select troop
		var singleMaxTroop:long=max_troop ;//single march max troop count;
		if(useMarchSizeBuff) singleMaxTroop += AddMarchSizeData.getInstance().GetSelectedBuffSize();//only first march calculate buff effect
		if(finnal)
			singleMaxTroop+=extraMarchCount;  //just for the first
		var tempCount:long=0;
		var offsetCount:long=0;
		var singleMaxResource:long=0;
		var weight:int=0;
		var buffWeight:float=0;
		for(var i:int = 0; i < resianTroopList.length; i++)
		{
			var troop:Barracks.TroopInfo = resianTroopList[i] as Barracks.TroopInfo;
			if (troop != null)
			{
				if(troop.selectNum > 0 && tempCount < singleMaxTroop) {
					 weight = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,troop.typeId,Constant.TroopAttrType.LOAD);

					if(troop.selectNum+tempCount <singleMaxTroop){//current troop cant fill the march
							reqVAR["u" + troop.typeId] = "" + troop.selectNum;
							tempCount+= troop.selectNum;
							 singleMaxResource+=weight*troop.selectNum;
							 troop.selectNum=0;
						}else{//current troop can fill the march
							offsetCount=singleMaxTroop-tempCount;
							reqVAR["u" + troop.typeId] = "" + offsetCount;
							tempCount += offsetCount;
							singleMaxResource += weight*offsetCount;
							troop.selectNum -= offsetCount;
						}
				}
			}
		}
		_Global.Log("tempCount="+tempCount);
		//calculate buff effect
		var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
		var resTransBuffValue:BuffValue = new BuffValue();
			if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
				resTransBuffValue = GameMain.PlayerBuffs.AvaSelfRunningBuffs.GetRunningBuffsValueBy(BuffScene.Ava, BuffTarget.Limit, new BuffSubtarget( BuffSubtargetType.ResourceTransport, 0 ));
			else
				resTransBuffValue = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Limit, new BuffSubtarget(BuffSubtargetType.ResourceTransport,0) );

		singleMaxResource = singleMaxResource *  ( 1 + Research.instance().bonusForType(Constant.Research.WEIGHT_DIST) + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Load)+ resTransBuffValue.Percentage)+ resTransBuffValue.Number;//)/carmotWeight;

			//select resource
			tempCount=0;
			offsetCount=0;
			var carmotWeightFlag:float=0;
		for(i=0;  i< resourceList.length; i++)
		{
			carmotWeightFlag=i==5?carmotWeight:1;
			var rec:ResourceVO = resourceList[i] as ResourceVO;
			if(rec.selectNum > 0 && tempCount<singleMaxResource) {
				if(tempCount+rec.selectNum*carmotWeightFlag < singleMaxResource){
					if(rec.id == 0)
						reqVAR["gold"] = "" + rec.selectNum;
					else
						reqVAR["r" + rec.id ] = "" + rec.selectNum;

					tempCount += rec.selectNum*carmotWeightFlag;
					rec.selectNum=0;

				}else{

					offsetCount=singleMaxResource-tempCount;
					if(rec.id == 0)
						reqVAR["gold"] = "" + offsetCount;
					else
						reqVAR["r" + rec.id ] = "" + (offsetCount/carmotWeightFlag);
					tempCount += offsetCount*carmotWeightFlag;
					rec.selectNum -= offsetCount/carmotWeightFlag;
				}
			}
		}

		//calcu buff
		if(useMarchSizeBuff) {
			var marchSizeBuffItemId:int = AddMarchSizeData.getInstance().GetSelectedBuffItemId();

			if(marchSizeBuffItemId != 0)
			{
				oneTimeMarchSizeBuff = marchSizeBuffItemId.ToString();
			}
			if (!String.IsNullOrEmpty(oneTimeBuffs))
			{
				if(!String.IsNullOrEmpty(oneTimeMarchSizeBuff))
				{
					oneTimeBuffs +="," + oneTimeMarchSizeBuff;
				}
				reqVAR["buffItems"] = oneTimeBuffs;
			}
			else
			{
				if(!String.IsNullOrEmpty(oneTimeMarchSizeBuff))
				{
					reqVAR["buffItems"] = oneTimeMarchSizeBuff;
				}
			}
		}

		if (finnal) {
			// reqVAR["extraItem"]=3298;
			Debug.Log("base="+extraMarchCount+"now="+_Global.INT32(extraMarchCount/10000000));
			if (_Global.INT32(extraMarchCount/10000000)!=0) {
				reqVAR["itemCount"]=_Global.INT32(extraMarchCount/10000000)+"";
			}
		}

		MenuMgr.getInstance().sendNotification (Constant.Notice.SEND_MARCH,null);
		//send march
			March.instance().executeMarch(reqVAR,excuteMarchOK);
    }
    protected function prepareResignMarchData(): IEnumerator
	{
		var troopsNum:Array=new Array();//save select troops
		var resourceNum:Array=new Array();//save select resource
		//save data
		var i:int;
		for(i = 0; i < troopList.length; i++)
		{
			var troop:Barracks.TroopInfo = troopList[i] as Barracks.TroopInfo;
			troopsNum.push(troop.selectNum);
		}
		for(i=0;  i< resourceList.length; i++){
			var rec:ResourceVO = resourceList[i] as ResourceVO;
			resourceNum.push(rec.selectNum) ;
		}

		var marchIds:Array= March.instance().getAvaliableMarchIds(GameMain.instance().getCurCityId());
		if(resignSelectMarchCount<=marchIds.length) {
			for(i=0;i<resignSelectMarchCount;i++){
				reqVAR = {};
				/*当前march_type = 24,就使其reqVAR["type"] = 5*/
				if (this.march_type == Constant.MarchType.GIANTTPWER) {
					reqVAR["type"] = "" + Constant.MarchType.REASSIGN;
				}
				else
				{
					reqVAR["type"] = "" + march_type;
				}
				reqVAR["xcoord"] = "" + tx;
				reqVAR["ycoord"] = "" + ty;
				reqVAR["cid"] = "" + GameMain.instance().getCurCityId();
				reqVAR["alRequestId"] = "" + this.requestId;
				//handel error case
				var mid:int =marchIds[i];
				if( mid == 0 || !Attack.instance().checkOverMarch() )
				{
		            if(march_type == Constant.MarchType.AVA_SENDTROOP)
		            {
		                ErrorMgr.instance().PushError("",Datas.getArString("AVA.DeployChangeCityNotice"));
		            }
					else if(Building.instance().getMaxLevelForType(Constant.Building.ACADEMY,GameMain.instance().getCurCityId() )  == 10)
					{
						ErrorMgr.instance().PushError("",Datas.getArString("ModalAttack.MaxMarchLimit"));
					}
					else
		            {
						ErrorMgr.instance().PushError("",Datas.getArString("ModalAttack.OverMarch") );	// debug info.
		            }
					return;
				}

				reqVAR["mid"] = "" + mid;
				excuteReasignMarch(i==0,i==resignSelectMarchCount-1);
//				 yield;
				 yield new WaitForSeconds(0.4f);
			}
			//Clear();
		}else{
			//show erreo info
			_Global.LogWarning("ErrorLog");
		}
	}

	private var lastMarchSelectTroops : List.<Barracks.TroopInfo> = new List.<Barracks.TroopInfo>();
    protected function excuteMarch():void
	{
		reqVAR = {};
		/*当前march_type = 24,就使其reqVAR["type"] = 5*/
		if (this.march_type == Constant.MarchType.GIANTTPWER) {
			reqVAR["type"] = "" + Constant.MarchType.REASSIGN;
		}
		else {
			reqVAR["type"] = "" + march_type;
		}
		reqVAR["xcoord"] = "" + tx;
		reqVAR["ycoord"] = "" + ty;

		var tmpV:long;
		var id:Object;
		var i:int;
		resianTroopList=new Array();
		lastMarchSelectTroops.Clear();
		for(i=0; i < troopList.length; i++)
		{
			var troop:Barracks.TroopInfo = troopList[i] as Barracks.TroopInfo;
			if (troop != null)
			{
				if(troop.selectNum > 0)
				{
					reqVAR["u" + troop.typeId] = "" + troop.selectNum;
					lastMarchSelectTroops.Add(troop);
				}
			}
		}

		for (var heroId : long in marchHeroId)
		{
			reqVAR["h" + heroId] = "1";
		}

		for(i=0;  i< resourceList.length; i++)
		{
			var rec:ResourceVO = resourceList[i] as ResourceVO;
			switch(march_type)
			{
				case Constant.MarchType.REASSIGN:
				case Constant.MarchType.TRANSPORT:
						var gMain:GameMain = GameMain.instance();
						var currentcityid:int = gMain.getCurCityId();
						var ownNum : double = Resource.instance().getCountForType(rec.id,currentcityid);
						_Global.Log(" resourceType : " + i + " own : " + ownNum + " select : " + rec.selectNum);
						if(!isDetermineExcuteMarch)
						{
							if(rec.selectNum > ownNum)
							{
								if(rec.selectNum - ownNum >= 100)
								{
									var comparedData : ComparedData = new ComparedData();
							        comparedData.callBack = function()
							        {
							            DetermineExcuteMarch();
							        };
							        comparedData.msgTxt = Datas.getArString("TransportResouces.Text1");
							        MenuMgr.getInstance().PushMenu("MigrateComparedDialog", comparedData , "trans_zoomComp");
									return;
								}
								else
								{
									rec.selectNum = ownNum;
								}
							}
						}
						else
						{
							if(rec.selectNum > ownNum)
							{
								rec.selectNum = ownNum;
							}
						}

						tmpV = rec.selectNum;
					break;
				default:
					rec.selectNum = tmpV = 0;
					break;
			}
			if(rec.id == 0)
				reqVAR["gold"] = "" + tmpV;
			else
				reqVAR["r" + rec.id ] = "" + tmpV;
		}
		var b_needGeneral:boolean = (
			march_type != Constant.MarchType.REASSIGN &&
			march_type != Constant.MarchType.TRANSPORT
			);

		if(item_general_data != null && b_needGeneral)
			reqVAR["kid"] = "" + item_general_data.knightId;

		reqVAR["cid"] = "" + GameMain.instance().getCurCityId();

		var mid:int = March.instance().getMarchId(GameMain.instance().getCurCityId());
		reqVAR["mid"] = "" + mid;
		reqVAR["alRequestId"] = "" + this.requestId;
		if( mid == 0 || !Attack.instance().checkOverMarch() )
		{
            if(march_type == Constant.MarchType.AVA_SENDTROOP)
            {
                ErrorMgr.instance().PushError("",Datas.getArString("AVA.DeployChangeCityNotice"));
            }
			else if(Building.instance().getMaxLevelForType(Constant.Building.ACADEMY,GameMain.instance().getCurCityId() )  == 10)
			{
				ErrorMgr.instance().PushError("",Datas.getArString("ModalAttack.MaxMarchLimit"));
			}
			else
            {
				ErrorMgr.instance().PushError("",Datas.getArString("ModalAttack.OverMarch") );	// debug info.
            }
			return;
		}

		var marchSizeBuffItemId:int = AddMarchSizeData.getInstance().GetSelectedBuffItemId();
		if(marchSizeBuffItemId != 0)
		{
			oneTimeMarchSizeBuff = marchSizeBuffItemId.ToString();
		}
		if (!String.IsNullOrEmpty(oneTimeBuffs))
		{
			if(!String.IsNullOrEmpty(oneTimeMarchSizeBuff))
			{
				oneTimeBuffs +="," + oneTimeMarchSizeBuff;
			}
			reqVAR["buffItems"] = oneTimeBuffs;
		}
		else
		{
			if(!String.IsNullOrEmpty(oneTimeMarchSizeBuff))
			{
				reqVAR["buffItems"] = oneTimeMarchSizeBuff;
			}
		}

		MenuMgr.getInstance().sendNotification (Constant.Notice.SEND_MARCH,null);
		//_Global.Log("Start March: toPos("+tx+","+ty+" TYPE:" + march_type);
		if(march_type == Constant.MarchType.ALLIANCEBOSS)
		{
			KBN.AllianceBossController.instance().ReqMarch(reqVAR);

		}
		else if(march_type == Constant.MarchType.PVE)
		{
			KBN.PveController.instance().ReqMarch(reqVAR);
		}
		else if(march_type == Constant.MarchType.RALLY_ATTACK)
		{
			if(item_type_data["rallyTime"] != null)
			{
				reqVAR["rallyTime"] = item_type_data["rallyTime"].ToString();
			}

			March.instance().executeMarch(reqVAR,excuteMarchOK);
		}
		else if(march_type == Constant.MarchType.JION_RALLY_ATTACK)
		{
			reqVAR["rallyId"] = rallyId.ToString();
			March.instance().executeMarch(reqVAR,excuteMarchOK);
		}
		else
		{
			March.instance().executeMarch(reqVAR,excuteMarchOK);
			isDetermineExcuteMarch = false;
		}
    }
    var isDetermineExcuteMarch : boolean = false;
	private function DetermineExcuteMarch() : void
	{
		isDetermineExcuteMarch = true;
		excuteMarch();
	}
    public function startMarch():void
	{
		if(showErrorFlag){
			ErrorMgr.instance().PushError("",Datas.getArString("Error.err_206"));
			return;
		}
		var warn:boolean = false;
		var slotInfo:HashObject = MapMemCache.instance().getTileInfoData(tx,ty);

		warn = RallyPoint.instance().checkMarchWarn(slotInfo,troopList);

		if( warn && (march_type == Constant.MarchType.ATTACK || march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE) )
		{
			var tileType : int = _Global.INT32(slotInfo["tileType"].Value);

			var tileTypeIsOk : boolean = ( tileType < Constant.TileType.WORLDMAP_1X1_DUMMY ) ||
									( tileType > Constant.TileType.WORLDMAP_LAST );
			if( tileTypeIsOk )
			{
				var targetLevel:int = _Global.INT32(slotInfo["tileLevel"]);
				var content:String ;
				if( tileType != Constant.TileType.CITY)	//wild
				{
					content = Datas.getArString("March.newUserWild" + targetLevel);
				}
				else	//pictish
				{
					content = Datas.getArString("March.newUserPict" + targetLevel);
				}

				MenuMgr.getInstance().PushMenu("MarchConfirmDialog",null,"trans_zoomComp");
				MenuMgr.getInstance().getMenuAndCall("MarchConfirmDialog", function(menu:KBNMenu) {
					var mcd:MarchConfirmDialog = menu as MarchConfirmDialog;
					if( mcd ){
						mcd.SetContent(content,excuteMarch);
					}
				});
			}
			else
			{
				excuteMarch();
			}
		} else if (march_type == Constant.MarchType.REASSIGN || march_type == Constant.MarchType.GIANTTPWER) {
		 if (GameMain.instance() != null) {
		 		resianTroopList=new Array();
				 for(var i:int = 0; i < troopList.length; i++)
				{
					var troop:Barracks.TroopInfo = troopList[i] as Barracks.TroopInfo;
					var mtroop:Barracks.TroopInfo = new Barracks.TroopInfo();
					mtroop.selectNum=troop.selectNum;
					mtroop.typeId=troop.typeId;
					resianTroopList.push(mtroop);
				}
                GameMain.instance().StartCoroutine(prepareResignMarchData());
            }

		}else if(march_type == Constant.MarchType.ATTACK && picCampTileLevel >10){
			if(Datas.instance().getPicCampRemainTimes()>0){
				excuteMarch();
			}else{
				ErrorMgr.instance().PushError("",Datas.getArString("Error.err_258"));
				return;
			}
		}
		else
		{
			excuteMarch();
		}
    }

    //StartMarchEND
}
