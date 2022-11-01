public class MarchMenu extends PopMenu implements IEventHandler
{
	//btnClose()
	public var  navHead:NavigatorHead;	
	protected var nc:NavigatorController;
	
	public var l_bg :Label;
	public var l_bg2:Label;
	
	public var texture_line :Texture2D;
	public var btn_next :Button;	
	
	public var mc_type :MarchTypeCon;
	
	public var con_general	:ComposedUIObj;
	public var con_troop	:ComposedUIObj;
	public var con_resource	:ComposedUIObj;
	
	public var scroll_general :ScrollList;
	public var scroll_troop :ScrollList;
	public var scroll_resource :ScrollList;

	public var mc_boost : MarchBoostComplex;
	
	public var ins_GeneralItem :ListItem;
	public var ins_TroopItem:ListItem;
	public var ins_ResourceItem :ListItem;
	
	
	public var at_l_troop	:Label;
	public var tp_l_troop	:Label;
	public var btn_AddMarchSize	:Button;
	public var tp_l_troop0:Label;
	public var tp_l_resource:Label;	//both show at Troop TAB.
	public var tp_l_resource2:Label;
	
	public var blankTip	:Label;
	
	public var l_mtile		:Label;
	
	private var requestId:long = 0;
	private var requestName:String;
	private var marchresource:long[] = [0l,0l,0l,0l,0l,0l,0l,0l];
	
	private var marchHeroId : List.<long> = new List.<long>();
    
    private var cachedData : Hashtable;
    
    private var oneTimeBuffs : String = null;
    private var oneTimeMarchSizeBuff:String = "";
    
	public var carmot_l_troop	:Label;
   	private var carmotWeight:float = 1;
    private	var resignSelectMarchCount:int=0;
    private var VisibleMarchCount:int=1;
    private var showErrorFlag:boolean=false;
    private var resianTroopList:Array;
//    private var picTileData:HashObject;
	private var picCampTileLevel:int = 0;
	
	public var rallyId:int;
    private function setOneTimeBuffs(buffs : String)
    {
    	oneTimeBuffs = buffs;
    }
	
	public function DrawBackground()
	{
		super.DrawBackground();
		this.drawTexture(texture_line,45,105,490,17);
//		this.drawTexture(texture_line,10,750,550,17);
//		DrawTextureClipped(texture_line, Rect( 0, 0, texture_line.width, texture_line.height ), Rect( 0, 119, 550,17), UIRotation.NONE);
	}
	

	
	public function SetPictTileLevel(level:int){
		picCampTileLevel=level;
	}
	
	public function DrawTitle()
	{
//		btnClose.Draw();
		navHead.Draw();
	}
	
	public function DrawItem()
	{
		GUI.BeginGroup(Rect(10,0,570,800));		
		nc.DrawItems();
		GUI.EndGroup();
		
		btn_next.Draw();
		at_l_troop.Draw();
		carmot_l_troop.Draw();
		
		tp_l_troop.Draw();
		btn_AddMarchSize.Draw();
		tp_l_troop0.Draw();
		tp_l_resource.Draw();
		tp_l_resource2.Draw();
		l_mtile.Draw();
		//
//		ins_GeneralItem.Draw();
//		ins_ResourceItem.Draw();
	}
	function FixedUpdate()
	{
		nc.u_FixedUpdate();	
	}
	public static var MAXSIZE:long=0;
	public function Update()
	{
		nc.u_Update();
		// MAXSIZE=
	}
	
	public function Init()
	{
		super.Init();
		nc = new NavigatorController();
		nc.popedFunc = popedFunc;
		nc.pushedFunc = pushedFunc;
		nc.soundOn = false;
		
		navHead.controller = nc;
		navHead.Init();
		
		//mc_type.Init();
		mc_type.t_scroll.itemDelegate = this;
		//
		btn_next.OnClick = nextHandler;
		
		ins_GeneralItem.Init();
		ins_ResourceItem.Init();			
				
		
		scroll_general.Init(ins_GeneralItem);
		scroll_troop.Init(ins_ResourceItem);

		scroll_resource.Init(ins_ResourceItem);
		
		scroll_general.itemDelegate = this;
		scroll_troop.itemDelegate = this;
		scroll_resource.itemDelegate = this;
		
		//mc_boost.Init();	

//		frameLabel.SetVisible(false);

		marchHeroId.Clear();
		var texMgr : TextureMgr = TextureMgr.instance();
		l_mtile.mystyle.normal.background = texMgr.LoadTexture("icon_time", TextureType.ICON);
        
        btn_AddMarchSize.setNorAndActBG("btn_plus_normal","btn_plus_down");
        btn_AddMarchSize.OnClick = OnAddMarchSize;
        
        cachedData = null;
        var seed:HashObject = GameMain.instance().getSeed();
	 	carmotWeight = _Global.FLOAT(seed["carmotweight"].Value);

	 	extraMarchCount=0;
	 
	}

    private function CheckDisplayMarchTypeCon(data : Hashtable) : void
    {
        //mc_type.show(data);
    
    	if(data != null && data["type"] != null && _Global.INT32(data["type"]) == Constant.MarchType.JION_RALLY_ATTACK)
    	{
    		if(data["rallyId"] != null)
    		{
    			rallyId = _Global.INT32(data["rallyId"]);
    		}   		
    	}
        if (data != null &&  data["x"] != null && data["y"] != null && data["type"] != null && _Global.INT32(data["type"]) != Constant.MarchType.RALLY_ATTACK)
        {
            march_type = _Global.INT32(data["type"]);
            nextHandler(null);  
        }
        else
        {
            nc.push(mc_type);
           // item_type_data = mc_type.getDefaultTypeData();
        	march_type = item_type_data["type"];   
        
        }
    }

	/***
		param contains vars.
		x,y,types: then only show types selector..
		x,y,type : skip march type directly to general or troop.
		
	*/
	public function OnPush(param:Object)
	{
		checkIphoneXAdapter();
		//{x:xxxx, y:xxxxx, type:xxxx, types:[xx,xx]}
		var data:Hashtable = param as Hashtable;
        cachedData = data;
		march_type = -1;
		destTilePlayer = -1;
		oneTimeBuffs = null;
		nc.clear();
	
		if(data != null && data["ava"] != null)
		{
			PrepareAvaData();
		}
		else
		{
			PrepareData(data);
			refreshGeneralScrollData();
		}

        CheckDisplayMarchTypeCon(data);
		
		scroll_resource.rect.x = 0;
		scroll_troop.rect.x = 0;
		scroll_general.rect.x = 0;
//		mc_boost.rect.x = 0;
		scroll_resource.SetResposeAngle(60);
		scroll_troop.SetResposeAngle(60);	
		scroll_general.SetData(generalList);	
		scroll_resource.SetData(resourceList);	
		scroll_general.ResetPos();	
		scroll_resource.ResetPos();
			
		navHead.updateBackButton();
		var toX : int = 999;
		var toY : int = 999;
		if(cachedData != null)
		{
		   toX = _Global.INT32(cachedData["x"]);
           toY = _Global.INT32(cachedData["y"]);
		}
		
        if(WorldBossController.singleton.isWorldBoss(toX, toY))
        {
			mc_boost.updateData(Constant.MarchType.EMAIL_WORLDBOSS);        
        }
        else
        {
        	mc_boost.updateData(march_type);
        }
		
		updateStatusBar();
//		SetCarmotTroop();
		scroll_troop.SetColPerPage(troopList.length/2+1);
		scroll_troop.SetData(troopList);
		scroll_troop.ResetPos();

		handleItemAction("Slider_Up",null);
	}
	
	function refreshGeneralScrollData(){
	
		var okFunc:Function=function(mData:Array){
			generalList=mData;
			scroll_general.SetData(generalList);
			if(generalList.length>0){
				(generalList[0] as GeneralInfoVO).selected=true;
			}
		};
		General.instance().refreshGeneralStatus(okFunc,-1);
	}
	//自动选择可以带领士兵数量，按照将军的load进行计算最大值
	function SetCarmotTroop(){
		var maxTroopsize:long=(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize()) /*+ Technology.instance().getAddMarchCount()*/;
		var curTroopsize:long=0;
		var offset:long=0;
//		if(march_type == Constant.MarchType.COLLECT){
			
			for(var i:int=0;i<troopList.length;i++){
				var troopItem:Barracks.TroopInfo =troopList[i];
				if(curTroopsize<maxTroopsize){
					if(troopItem.owned+curTroopsize >= maxTroopsize){
						offset=maxTroopsize-curTroopsize;
						curTroopsize+=offset;
						troopItem.selectNum=offset;
					}else{
						curTroopsize+=troopItem.owned;
						troopItem.selectNum=troopItem.owned;
					}
				}else{
					troopItem.selectNum=0;
				}

				if(troopItem.actType==1){
					troopList.splice(i,1);
					
					i--;
				}
			}
//		}
	}
	
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
	
	function CanTransportCarmot(curCityId:int,targetCityId):boolean
	{
		if(Resource.singleton.GetCastleLevel(curCityId)<Constant.CarmotLimitLevel || Resource.singleton.GetCastleLevel(targetCityId)<Constant.CarmotLimitLevel){
			return false;
		}else return true;
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
	
	public	function	OnPopOver()
	{
		scroll_general.Clear();
		scroll_troop.Clear();
		scroll_resource.Clear();
		
		mc_type.Clear();
		mc_boost.Clear();
		con_general.clearUIObject();
		con_troop.clearUIObject();
		con_resource.clearUIObject();
        
        cachedData = null;
	}
	
	public function setXYfromBookMark(xStr:String,yStr:String):void
	{
		mc_type.setXY(xStr,yStr);
	
	}

	protected function nextHandler(clickParam:Object):void
	{
		updateStatusBar();
		
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
		 
		if(nc.topUI == mc_type){//select march type menu
			showErrorFlag=false;
			if(march_type == Constant.MarchType.TRANSPORT || march_type ==Constant.MarchType.REASSIGN || march_type == Constant.MarchType.ATTACK){
				UnityNet.reqDestTileInfo(tx, ty, onGetDestTileInfo, null);
				return;
			}
		}
		
		checkUI(nc.topUI);	
	}
	
	protected function onGetDestTileInfo(result : HashObject) 
	{	
		if (_Global.GetBoolean(result["ok"])) {
			
			if (march_type == Constant.MarchType.ATTACK && null != result["tileinfo"]) 
			{
				 if(_Global.INT32(result["tileinfo"]["tileType"])==Constant.TileType.CITY && _Global.INT32(result["tileinfo"]["tileUserId"])==0)
				 {
					picCampTileLevel = _Global.INT32(result["tileinfo"]["tileType"]);
					if(destTilePlayer == -1) checkUI(nc.topUI);
				  }else{
					destTilePlayer = _Global.INT32(result["tileinfo"]["tileUserId"]);
					checkUI(nc.topUI);
					//nextHandler(null);
				}		
			}else if(march_type == Constant.MarchType.TRANSPORT || march_type == Constant.MarchType.REASSIGN) 
			{
				var cityId:int = GameMain.instance().getCurCityId();
				var userId:int=GameMain.instance().getUserId();
				if(march_type ==Constant.MarchType.REASSIGN && userId!=_Global.INT32(result["tileinfo"]["tileUserId"])){
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
					scroll_resource.SetData(resourceList);
//					nextHandler(null);
				}else{
				showErrorFlag=true;
				//阻止发送运输March
//				ErrorMgr.instance().PushError("",Datas.getArString("Error.err_201"));
//				navHead.pop2RootUI();				
				}
				checkUI(nc.topUI);
			}
		}
		
	}
    
    protected function CheckShouldStartAvaRallyAttack(ui : UIObject) : boolean
    {
        if (cachedData == null || _Global.INT32(cachedData["ava"]) == 0)
        {
            return false;
        }
    
        if (ui != mc_type)
        {
            return false;
        }    
        
        if (march_type != Constant.AvaMarchType.RALLYATTACK)
        {
            return false;
        }
        
        return true;
    }
	
	protected function checkUI(ui:UIObject):void
	{
		var error:int = 0;
		if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
		{
			error = check2NextForAva(ui);
		}
		else
		{
			error = check2Next(ui);
		}
		if(error > 0)
		{
			ErrorMgr.instance().PushError("",errorStr);
			return;
		}
        
        if (CheckShouldStartAvaRallyAttack(ui))
        {
            MenuMgr.getInstance().PopMenu("MarchMenu");
            MenuMgr.getInstance().PushMenu("AvaRallyAttackTimeSettings", 
            {
                "x" : _Global.INT32(cachedData["x"]),
                "y" : _Global.INT32(cachedData["y"]),
                "type" : march_type
            }, "trans_zoomComp");
            return;
        }
        
		switch(march_type)
		{
			case Constant.MarchType.TRANSPORT:
			case Constant.MarchType.REASSIGN:				
				///
				switch(ui)
				{
					case null:
					case mc_type:
					    next_con = con_troop;
					    scroll_troop.SetColPerPage(troopList.length/2+1);
					    scroll_troop.SetData(troopList);
						break;
					case con_troop:
						next_con = con_resource;
						break;
					case con_resource:
						next_con = mc_boost;
						mc_boost.SetBoostType(MarchBoostComplex.BOOST_TYPE.NORMAL);
						mc_boost.SetBuffCallback(setOneTimeBuffs);
						break;
					default:
						next_con = null;
				}			
				break;				
			case Constant.MarchType.REINFORCE:
			case Constant.MarchType.ATTACK:
			case Constant.MarchType.COLLECT:
			case Constant.MarchType.COLLECT_RESOURCE:
			case Constant.MarchType.PVE:
			case Constant.MarchType.ALLIANCEBOSS:
			case Constant.AvaMarchType.ATTACK:
			case Constant.AvaMarchType.REINFORCE:
			case Constant.AvaMarchType.RALLYATTACK:
			case Constant.AvaMarchType.RALLYREINFORCE:
			case Constant.MarchType.RALLY_ATTACK:
				switch(ui)
				{
					case null:
					case mc_type:
						next_con = con_general;
						break;
					case con_general:
					    next_con = con_troop;
						AddMarchSizeData.getInstance().ResetBuffListData();
					    AutoSelectCarmotTroop();
					    scroll_troop.SetColPerPage(heroList.Concat(troopList).length/2+1);
					    scroll_troop.SetData(heroList.Concat(troopList));
						break;
					case con_troop:
						next_con = mc_boost;
						if(march_type == Constant.AvaMarchType.ATTACK || march_type == Constant.AvaMarchType.REINFORCE || march_type == Constant.AvaMarchType.RALLYATTACK || march_type == Constant.AvaMarchType.RALLYREINFORCE)
							mc_boost.SetBoostType(MarchBoostComplex.BOOST_TYPE.AVA);
						else
							mc_boost.SetBoostType(MarchBoostComplex.BOOST_TYPE.NORMAL);
						mc_boost.SetBuffCallback(setOneTimeBuffs);
						break;
					default:
						next_con = null;
				}								
				break;
			case Constant.MarchType.AVA_SENDTROOP:
			
				switch(ui)
				{
					case null:
					case mc_type:
						next_con = con_general;
						break;
					case con_general:
					    next_con = con_troop;
					    scroll_troop.SetColPerPage(heroList.Concat(troopList).length/2+1);
					    scroll_troop.SetData(heroList.Concat(troopList));
						break;
					case con_troop:
						next_con = null;
						break;
					default:
						next_con = null;
				}								
				break;
			case Constant.MarchType.JION_RALLY_ATTACK:		
				switch(ui)
				{
					case null:
					case mc_type:
						next_con = con_general;
						break;
					case con_general:
					    next_con = con_troop;
					    scroll_troop.SetColPerPage(troopList.length/2+1);
					    scroll_troop.SetData(troopList);
						break;
					case con_troop:
						next_con = null;
						break;
					default:
						next_con = null;
				}								
				break;
		}
		
		var list:ScrollList = null;
		var addTip:boolean = true;
		switch(next_con)
		{
			case con_general:
				if(generalList.length == 0)					
					blankTip.txt = Datas.getArString("Generals.NoGeneral");				
				else
					list = scroll_general;
				break;
			case con_troop:
				if(troopList.length  == 0)				
					blankTip.txt = Datas.getArString("March.NO_Troop");				
				else
					list = scroll_troop;
				break;
			case con_resource:
				if(resourceList.length  == 0)
					blankTip.txt = Datas.getArString("March.NO_Resource");				
				else
					list = scroll_resource;
				break;		
			default:
				addTip = false;
		}	
		////////////
		if(addTip)
		{
			(next_con as ComposedUIObj).clearUIObject();
			if(list)
				(next_con as ComposedUIObj).addUIObject(list);
			else
				(next_con as ComposedUIObj).addUIObject(blankTip);
		}
		
		
		if(next_con != null && nc.topUI != next_con)
		{
			nc.push(next_con);
			navHead.updateBackButton();		
			updateStatusBar();	
		}
		if(next_con == null)		
		{
			var peaceTime:long = KBNPlayer.Instance().getTruceExpireUnixTime();
			var nowTime:long = GameMain.unixtime();
			if (destTilePlayer > 0 && (march_type == Constant.MarchType.ATTACK || march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE)  && nowTime < peaceTime) {
				var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
				dialog.setLayout(600,380);
				dialog.setTitleY(60);
				dialog.setContentRect(70,140,0,100);
				dialog.setButtonText(Datas.getArString("Common.Yes"),Datas.getArString("Common.No") );
				MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("PeaceTime.BreakTips"), "", function() {
					MenuMgr.getInstance().PopMenu("");
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
	}	
	
	function AutoSelectCarmotTroop()
	{
		if(march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE) 
		{
			var maxWeight : long = calcCarmotMaxValue() + 1;
			var curTroopsize : long = 0;
			var offset:long = 0;
			var skillLoadBuf : float = 0;
			var curSelectTroop : long = 0;
			var suitAndSkillAdd : float ;
			if(item_general_data != null) //有选择骑士，计算骑士装备技能加成
			{
				var knightID : int = item_general_data.knightId;
				var knight : Knight = GearManager.Instance().GearKnights.GetKnight(knightID);
	//			skillLoadBuf = GearManager.Instance().GetKnightSkillLoad(knight.Arms);
				suitAndSkillAdd = GearReport.Instance().GetSuitAndSkillAdd(knight.Arms,4);
			}
			
			var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
			var resTransBuffValue : BuffValue = new BuffValue();
				if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
					resTransBuffValue = GameMain.PlayerBuffs.AvaSelfRunningBuffs.GetRunningBuffsValueBy(BuffScene.Ava, BuffTarget.Limit, new BuffSubtarget( BuffSubtargetType.ResourceTransport, 0 ));
				else
					resTransBuffValue = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Limit, new BuffSubtarget(BuffSubtargetType.ResourceTransport,0) );
			var maxTpNum = (max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize()) /*+ Technology.instance().getAddMarchCount()*/;
			for(var i : int = 0; i < troopList.length; i++) 
			{
				var troopInfo:Barracks.TroopInfo = troopList[i];
				if(troopInfo.actType == 1)
				{//剔除运输兵
					troopList.splice(i,1);	
					i--;
					continue;
				}
				//获取单种兵运输资源数量
				var weight : int = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,troopInfo.typeId,Constant.TroopAttrType.LOAD);
				if(weight <= 0){
					troopInfo.selectNum = 0;
					continue;
				}
				var perTroopWeight : float = 0;
				if(march_type == Constant.MarchType.COLLECT)
				{
					perTroopWeight = ( weight *  ( 1 + Research.instance().bonusForType(Constant.Research.WEIGHT_DIST) + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Load) + resTransBuffValue.Percentage+suitAndSkillAdd) + resTransBuffValue.Number)/carmotWeight;
				}
				else
				{
					perTroopWeight = ( weight *  ( 1 + Research.instance().bonusForType(Constant.Research.WEIGHT_DIST) + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Load) + resTransBuffValue.Percentage+suitAndSkillAdd) + resTransBuffValue.Number);
				}

				if(maxWeight > 0 &&  curSelectTroop < maxTpNum)
				{//已经选择的士兵数量，小于需要运输资源士兵数量
					var needTroopCount : long = 0;
					if(maxWeight % perTroopWeight == 0)
					{
						needTroopCount = maxWeight / perTroopWeight;
						needTroopCount = needTroopCount == 0 ? 1 : needTroopCount;
					}
					else
					{
						needTroopCount = maxWeight / perTroopWeight + 1;
					}
								
					if(curSelectTroop + needTroopCount > maxTpNum ){//如果选择的士兵加上需要的士兵数量大于自己带领士兵的最大值
						needTroopCount = maxTpNum - curSelectTroop;					
					}
					
					if(troopInfo.owned >= needTroopCount){//当前士兵可以满足要求运输剩余的资源
						curSelectTroop += needTroopCount;
						troopInfo.selectNum = needTroopCount;
						maxWeight = 0;
					}else{//当前士兵不足以运输剩余的资源
						curSelectTroop += troopInfo.owned;
						troopInfo.selectNum = troopInfo.owned;
						maxWeight -= troopInfo.owned * perTroopWeight - 1;
					}
				}else{
					troopInfo.selectNum = 0;
				}
			}
		}
	}
	
	protected function check2Next(cur:UIObject):int
	{
		var error:int = 0;
		switch(cur)
		{
			case mc_type:
				if(march_type < 0)
				{
					error = 1;		
					errorStr = Datas.getArString("Error.March_NeedType");
				}
				if(tx == 0 || ty == 0)
				{
					error = 2;
					errorStr = Datas.getArString("Error.March_NeedXY");
				}
				break;
			case con_general:
				if(Building.instance().getMaxLevelForType(Constant.Building.GENERALS_QUARTERS,GameMain.instance().getCurCityId() ) <= 0)
				{
					error = 21;
					errorStr = Datas.getArString("March.Need_GeneralsQuarters");
				}
				else
				if(item_general_data == null)
				{
					error =  11;					
					errorStr = Datas.getArString("Error.March_NeedGeneral");
				}
				break;
			case con_troop:
				if(select_troops <= 0)
				{
					error = 21;	
					errorStr = Datas.getArString("Error.March_NeedTroops");
				}
				else
				if(select_troops > VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize() /*+ Technology.instance().getAddMarchCount()*/)+extraMarchCount)
				{
					error = 21;	
					errorStr = Datas.getArString("ModalAttack.OverMarch");
				}
				break;
			case con_resource:
				if(select_resources <= 0)
				{
					if(march_type != Constant.MarchType.REASSIGN)
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
				break;
		}
		return error;
	}
	
	protected function check2NextForAva(cur:UIObject):int
	{
		var error:int = 0;
		switch(cur)
		{
			case mc_type:
				if(march_type < 0)
				{
					error = 1;		
					errorStr = Datas.getArString("Error.March_NeedType");
				}
				if(tx == 0 || ty == 0)
				{
					error = 2;
					errorStr = Datas.getArString("Error.March_NeedXY");
				}
				break;
			case con_general:
				if(item_general_data == null)
				{
					error =  11;					
					errorStr = Datas.getArString("Error.March_NeedGeneral");
				}
				break;
			case con_troop:
				if(select_troops <= 0)
				{
					error = 21;	
					errorStr = Datas.getArString("Error.March_NeedTroops");
				}
				else
				if(select_troops > (max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize()) /*+ Technology.instance().getAddMarchCount()*/)
				{
					error = 21;	
					errorStr = Datas.getArString("ModalAttack.OverMarch");
				}
				break;
		}
		return error;
	}
	
	protected function updateStatusBar()
	{
		this.at_l_troop.SetVisible(false);
		this.carmot_l_troop.SetVisible(false);
		this.tp_l_troop0.SetVisible(false);
		this.tp_l_resource.SetVisible(false);
		this.tp_l_resource2.SetVisible(false);
		this.tp_l_troop.SetVisible(false);
		btn_AddMarchSize.SetVisible(false);
		this.l_mtile.SetVisible(false);

		if(nc.topUI != mc_boost )
		{
			if (nc.topUI == con_troop && march_type == Constant.MarchType.AVA_SENDTROOP)
			{
				btn_next.txt = Datas.getArString("Common.Deploy");
			}
			else
			{
				btn_next.txt = Datas.getArString("Common.Next_Button");		
			}
		}
		else
		{
			switch(march_type)
			{
				case Constant.MarchType.REINFORCE:
				case Constant.AvaMarchType.REINFORCE:
					btn_next.txt = Datas.getArString("Common.Reinforce");	
					break;
				case Constant.MarchType.ATTACK:
				case Constant.MarchType.PVE:
				case Constant.MarchType.ALLIANCEBOSS:
				case Constant.AvaMarchType.ATTACK:
					btn_next.txt = Datas.getArString("Common.Attack");
                    break;
				case Constant.MarchType.COLLECT:
                    btn_next.txt = Datas.getArString("Newresource.tile_button_gather");
                    break;
                case Constant.AvaMarchType.RALLYATTACK:
                    btn_next.txt = Datas.getArString("AVA.chrome_rallyattackbtn");
					break;
				case Constant.MarchType.AVA_SENDTROOP:
					btn_next.txt = Datas.getArString("Common.Deploy");
					break;
				
			}
			navHead.titleTxt = btn_next.txt;				
		}
					
		tx = _Global.INT32(mc_type.p_it_x.txt);
		ty = _Global.INT32(mc_type.p_it_y.txt);
		
		calcTroops();
		calcResources();
		
		switch(nc.topUI)
		{
			case mc_type:
				if(march_type == Constant.MarchType.RALLY_ATTACK)
				{
					navHead.titleTxt = "Rally";					
				}
				else
				{
					navHead.titleTxt = Datas.getArString("ModalTitle.March");				
				}
				break;
			case con_general:
				navHead.titleTxt = Datas.getArString("ModalTitle.Select_General");
				
				break;
			case con_troop:
				navHead.titleTxt = Datas.getArString("ModalTitle.Choose_Troops");
				at_l_troop.SetVisible(march_type != Constant.MarchType.TRANSPORT && march_type != Constant.MarchType.REASSIGN );
				if(march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE){
					carmot_l_troop.SetVisible(true);
					carmot_l_troop.mystyle.normal.background = CollectionResourcesMgr.instance().GetTilePopUpIcon(String.Format("{0}_{1}", tx, ty));
					at_l_troop.rect.y = 770;
					btn_AddMarchSize.rect.y = 770;
				}else {
					at_l_troop.rect.y = 787;
					btn_AddMarchSize.rect.y = 787;
				}
				tp_l_troop0.SetVisible(march_type == Constant.MarchType.REASSIGN);
				tp_l_resource.SetVisible(march_type == Constant.MarchType.TRANSPORT || march_type == Constant.MarchType.REASSIGN);
				tp_l_troop.SetVisible(march_type == Constant.MarchType.TRANSPORT || march_type == Constant.MarchType.REASSIGN);
				btn_AddMarchSize.SetVisible(march_type == Constant.MarchType.ATTACK || march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE || march_type == Constant.MarchType.PVP || march_type == Constant.MarchType.REASSIGN);
				if(march_type == Constant.MarchType.REASSIGN){
					tp_l_troop.rect.x = 167;
				}else 
					tp_l_troop.rect.x = 26;
				break;
			case con_resource:
				navHead.titleTxt = Datas.getArString("ModalTitle.Choose_Resources");
				tp_l_resource2.SetVisible(true);				
//				btn_next.txt = Datas.getArString("Common.Transport");
				switch(march_type)
				{
					case Constant.MarchType.TRANSPORT:
						btn_next.txt = Datas.getArString("Common.Transport");	
						break;
					case Constant.MarchType.REASSIGN:
						btn_next.txt = Datas.getArString("Common.Reassign");
						break;
				}
				break;
			case mc_boost:
			if(march_type == Constant.MarchType.COLLECT )
				navHead.titleTxt = Datas.getArString("Newresource.march_Marchnow");
			else 
				navHead.titleTxt = Datas.getArString("ModalTitle.March_Now");
				l_mtile.SetVisible(true);
				break;
		}

		tp_l_troop.txt = at_l_troop.txt =  _Global.NumSimlify(select_troops) + "/" + _Global.NumSimlify(VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize() /*+ Technology.instance().getAddMarchCount()*/))
			+(extraMarchCount==0?"":("+"
			+"<color=#00ff00>" + _Global.NumSimlify(extraMarchCount) + "</color>"));
			MarchDataManager.instance().MAXSIZE=VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize() /*+ Technology.instance().getAddMarchCount()*/)+extraMarchCount;
		if(march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE){
			carmot_l_troop.txt= _Global.NumSimlify(carmotload_resource) + "/" + _Global.NumSimlify(calcCarmotMaxValue());
		}else if(march_type == Constant.MarchType.REASSIGN){
			tp_l_troop0.txt=resignSelectMarchCount+"/"+VisibleMarchCount ;
			tp_l_troop.rect.x = 26;
			btn_AddMarchSize.rect.y = 770;
			btn_AddMarchSize.rect.x = 200;
		}			
		btn_AddMarchSize.rect.x = tp_l_troop.rect.x + _Global.GUICalcWidth(tp_l_troop.mystyle,tp_l_troop.txt) + 5;
		tp_l_resource.txt = tp_l_resource2.txt = _Global.NumSimlify(select_resources) + "/" + _Global.NumSimlify(max_resource);
		l_mtile.txt = _Global.timeFormatStr(march_time);
	}

	private var extraMarchCount=0;
	private function SliderValueChange(item : ListItem) : boolean
    {
        var itemNow = item as MarchResourceItem2;
        var limitValue:long=VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize()) + extraMarchCount -select_troops;
        itemNow.slider.SetLimitValue(limitValue);
        itemNow.RefreshMaxLabel();
        if (limitValue<=0) {
        	at_l_troop.SetNormalTxtColor(FontColor.Red);
			tp_l_troop.SetNormalTxtColor(FontColor.Red);
			if (IsInvoking("SetInvoke")) {
				CancelInvoke("SetInvoke");
			}
			Invoke("SetInvoke",1f);
        }
        return true;
    }

    private function SetInvoke(){
    	at_l_troop.SetNormalTxtColor(FontColor.TabNormal);
		tp_l_troop.SetNormalTxtColor(FontColor.TabNormal);
    }
	
	
	private function calcCarmotMaxValue():long
	{
		var key= tx+"_" +ty;
		var curCarmotNum : long = 0;
		if(CollectionResourcesMgr.instance().collectResources.ContainsKey(key))
		{
		     curCarmotNum = _Global.INT64(CollectionResourcesMgr.instance().collectResources[key].resourcesCount);
		}
		return curCarmotNum;
	}
	
	protected function calcListSelectNum(list:Array):long
	{
		var n:int = list.length;
		var i:int;
		var sum:long = 0;
		for(i=0; i<n; i++)
		{	
			if(i==5){
				sum += (list[i] as ResourceVO).selectNum*carmotWeight;
			}else sum += (list[i] as ResourceVO).selectNum;
		}
		return sum;
	}
	
	protected function calcResources():void
	{
		select_resources = calcListSelectNum(resourceList);
		if(select_resources > max_resource)
		{
			tp_l_resource.SetNormalTxtColor(FontColor.Red);
			tp_l_resource2.SetNormalTxtColor(FontColor.Red);
			
		}
		else
		{
			tp_l_resource.SetNormalTxtColor(FontColor.TabNormal);
			tp_l_resource2.SetNormalTxtColor(FontColor.TabNormal);
		}
	}

	private var base_speed:float=0f;
	
	protected function calcTroops():void
	{
		var n:int = troopList.length;
		var troopInfo :Barracks.TroopInfo;
		var speed:float = 65535;
		var uspd:float;
		var skillLoadBuf:float=0;
		var suitAndSkillAdd:float=0;
		select_troops = 0;
		max_resource = 0;
		carmotload_resource=0;
		var currentcityid:int = GameMain.instance().getCurCityId();
		var tr1:float = Research.instance().bonusForType(Constant.Research.ROADS);
		var tr2:float = Research.instance().bonusForType(Constant.Research.HORSE);
		var logisticsCtrBonus:float = ((march_type == Constant.MarchType.ATTACK || march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE) ? 0f : 0.5 * Building.instance().getMaxLevelForType(Constant.Building.RELIEF_STATION, currentcityid));
		var allMarchSpeedBuff:BuffValue = new BuffValue();
		
		if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
			allMarchSpeedBuff = GameMain.PlayerBuffs.AvaSelfRunningBuffs.GetRunningBuffsValueBy(BuffScene.Ava, BuffTarget.UnitSpeed, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));
		else
			allMarchSpeedBuff = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy(BuffScene.Home, BuffTarget.UnitSpeed, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));
		
		if(item_general_data != null)
		{
			var knightID:int = item_general_data.knightId;
			var knight:Knight = GearManager.Instance().GearKnights.GetKnight(knightID);
			if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
			{
				this.max_troop = GameMain.Ava.March.GetMaxTroops(knight);
			}
			else
			{
				this.max_troop = March.instance().getTroopMax(currentcityid,knight,(march_type == Constant.MarchType.AVA_SENDTROOP));
			}
			
			var speeddatas:Dictionary.<int,double>[] = GearReport.Instance().Calculate(knight.Arms);
			skillLoadBuf = GearManager.Instance().GetKnightSkillLoad(knight.Arms);	
			suitAndSkillAdd = GearReport.Instance().GetSuitAndSkillAdd(knight.Arms,4);
		}
		for(var i:int = 0; i<n; i++)
		{
			troopInfo = troopList[i] as Barracks.TroopInfo;
			if (troopInfo == null)
			{
				continue;
			}
			if(troopInfo.selectNum <= 0)
				continue;
			select_troops += troopInfo.selectNum;
			var weight:int = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,troopInfo.typeId,Constant.TroopAttrType.LOAD);
			var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
			var resTransBuffValue:BuffValue = new BuffValue();
			if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
				resTransBuffValue = GameMain.PlayerBuffs.AvaSelfRunningBuffs.GetRunningBuffsValueBy(BuffScene.Ava, BuffTarget.Limit, new BuffSubtarget( BuffSubtargetType.ResourceTransport, 0 ));
			else
				resTransBuffValue = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Limit, new BuffSubtarget(BuffSubtargetType.ResourceTransport,0) );
			if(march_type == Constant.MarchType.COLLECT)
			{//carmot资源负载值计算
				carmotload_resource +=(troopInfo.selectNum * weight *  ( 1 + Research.instance().bonusForType(Constant.Research.WEIGHT_DIST) + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Load)+ resTransBuffValue.Percentage+suitAndSkillAdd)+ resTransBuffValue.Number)/carmotWeight;
			}
			else if(march_type == Constant.MarchType.COLLECT_RESOURCE)
			{
				carmotload_resource +=(troopInfo.selectNum * weight *  ( 1 + Research.instance().bonusForType(Constant.Research.WEIGHT_DIST) + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Load)+ resTransBuffValue.Percentage+suitAndSkillAdd)+ resTransBuffValue.Number);
			}
			else{//运输资源上限计算			
				max_resource += troopInfo.selectNum * weight *  ( 1 + Research.instance().bonusForType(Constant.Research.WEIGHT_DIST) + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Load) + resTransBuffValue.Percentage ) + resTransBuffValue.Number;		
			}
//			max_resource += troopInfo.selectNum * weight *  ( 1 + Research.instance().bonusForType(Constant.Research.WEIGHT_DIST) + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Load) + resTransBuffValue.Percentage ) + resTransBuffValue.Number;
			//calc slowest speed;
			
			//uspd = _Global.INT32(unitstats["unt" + troopInfo.typeId][_Global.ap + 3 ]);	// (1 + Research.instance().bonusForType(Constant.Research.ROADS);
			
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
			if(uspd < speed)
				speed = uspd;
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
			resignSelectMarchCount=marchNum;
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
		else
			march_time = Mathf.Max(Mathf.Ceil(dist * 6000f / speed),30);	//seconds.
		//
		if(select_troops > VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize() /*+ Technology.instance().getAddMarchCount()*/)+extraMarchCount)
		{
			at_l_troop.SetNormalTxtColor(FontColor.Red);
//			carmot_l_troop.SetNormalTxtColor(FontColor.Red);
			tp_l_troop.SetNormalTxtColor(FontColor.Red);
		}
		else
		{
			at_l_troop.SetNormalTxtColor(FontColor.TabNormal);
//			carmot_l_troop.SetNormalTxtColor(FontColor.TabNormal);
			tp_l_troop.SetNormalTxtColor(FontColor.TabNormal);
			
		}
		if(resignSelectMarchCount > VisibleMarchCount){
			tp_l_troop0.SetNormalTxtColor(FontColor.Red);
		}else tp_l_troop0.SetNormalTxtColor(FontColor.TabNormal);
		
	}
	
	public function popedFunc(nc:NavigatorController, prevObj : UIObject)
	{
		extraMarchCount=0;
		updateStatusBar();
	}
	public function pushedFunc(nc:NavigatorController, prevObj : UIObject)
	{
		updateStatusBar();
	}
	
	public function updateGeneralExp():void
	{
		if(nc.topUI == con_general)	//scroll_general
		{
			var gid:int = 0;
			if(item_general_data)
				gid = item_general_data.knightId;			
			generalList = General.instance().getMarchAbleKinghtList(gid);
			calcSelectedGeneral();
			scroll_general.SetData(generalList);			
		}
	}
	protected function calcSelectedGeneral():void
	{
		if(!generalList)
			return;
		var i:int;
		item_general_data = null;
		for(i=0; i<generalList.length; i++)
		{
			if((generalList[i] as GeneralInfoVO).selected)
				item_general_data = generalList[i] as GeneralInfoVO;
		}
	}
	// reset...
	//global
	//protected var unitstats		:HashObject;
	
	protected var next_con:UIObject;	
	//selected march type & general.
	protected var item_type_data	:Hashtable;
	protected var item_general_data	:GeneralInfoVO;
	//resource & troop are lists.
	protected var max_troop 	:long;
	protected var max_resource	:long;
	protected var carmotload_resource	:long;
	protected var march_time	:long;
	protected var select_troops :long;
	protected var select_resources:long;
	//data for  send
	protected var reqVAR:Hashtable = {};
	protected var march_type 	:int;
	protected var troopList		:Array;
	protected var generalList	:Array;
	protected var resourceList	:Array;
	protected var heroList		:Array;
	protected var fx	:int;
	protected var fy	:int;
	protected var tx	:int;
	protected var ty	:int;
	protected var destTilePlayer:int;
	//tmp data 
	protected var errorStr:String;
	
	public function handleItemAction(action:String,param:Object):void
	{
		var last_itemData:Object;
		var data:Hashtable = param as Hashtable;
		switch(action)
		{
			case Constant.Action.MARCH_TYPE_SELECT:
					if(item_type_data)
						item_type_data["selected"] = false;
					data["selected"] = true;
					
					item_type_data = data;
					march_type = data["type"];	//int ..
					if(march_type == Constant.MarchType.RALLY_ATTACK)
					{
						break;
					}
					if(march_type ==Constant.MarchType.REASSIGN){
						VisibleMarchCount=Attack.instance().GetVisibleMarchCount();
//						VisibleMarchCount=March.instance().getAvaliableMarchIds(GameMain.instance().getCurCityId()).length;//Attack.instance().GetVisibleMarchCount();
			//			maxMarchCount=Attack.instance().GetMaxMarchCount();
					}else VisibleMarchCount =1;
				break;
			case Constant.Action.MARCH_GENERAL_SELECT:
				if(item_general_data)
					item_general_data.selected = false;
				item_general_data = param;
				item_general_data.selected = true;				
				break;
			// selectNum; 	
			case Constant.Action.MARCH_TROOP_SELECT:
				this.updateStatusBar();
				break;
			case "Slider_Up":
				scroll_troop.ForEachItem(SliderValueChange);
				break;
			case Constant.Action.MARCH_RESOURCE_SELECT:
				this.updateStatusBar();
				//check max ...
				break;
			case Constant.Action.MARCH_SPEEDUP_HERO:
				var heroInfo = param as KBN.HeroInfo;
				if(march_type >= Constant.AvaMarchType.ATTACK && march_type < Constant.MarchType.COLLECT)
				{
					var avaSpeedUpdata:AvaSpeedUp.AvaSpeedUpData = new AvaSpeedUp.AvaSpeedUpData ();
					avaSpeedUpdata.type = Constant.AvaSpeedUpType.AvaHeroSpeedUp;
					avaSpeedUpdata.id = heroInfo.Id;
					var rawHeroData:PBMsgAVATroop.PBMsgAVATroop.Hero = KBN.GameMain.Ava.Units.GetRawHeroData(heroInfo.Id);
					avaSpeedUpdata.endTime = rawHeroData.sleepEndTime;
					avaSpeedUpdata.startTime = rawHeroData.sleepStartTime;
					avaSpeedUpdata.origTotalTime = rawHeroData.sleepTotal;
					KBN.MenuMgr.instance.PushMenu ("AvaSpeedUpMenu",avaSpeedUpdata,"trans_zoomComp");
				}
				else
				{
					var queueData : QueueItem = HeroManager.Instance().GetNewHeroSpeedUpData(heroInfo);
					if (queueData == null)
					{
						return;
					}
					
					MenuMgr.getInstance().PushMenu("SpeedUpMenu", queueData, "trans_zoomComp");
				}
				break;
		}				
	}
	
	
	protected function startMarch():void
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
				MenuMgr.getInstance().getMenuAndCall("MarchConfirmDialog", function(menu : KBNMenu) {
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
		}else if(march_type == Constant.MarchType.REASSIGN){
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
	
	var isDetermineExcuteMarch : boolean = false;
	private function DetermineExcuteMarch() : void
	{
		isDetermineExcuteMarch = true;
		excuteMarch();
	}
	
	protected function excuteMarch():void
	{
		reqVAR = {};
		reqVAR["type"] = "" + march_type;
		reqVAR["xcoord"] = "" + tx;
		reqVAR["ycoord"] = "" + ty;
		
		var tmpV:long;
		var id:Object;
		var i:int;
		resianTroopList=new Array();
		for(i=0; i < troopList.length; i++)
		{
			var troop:Barracks.TroopInfo = troopList[i] as Barracks.TroopInfo;
			if (troop != null)
			{
				if(troop.selectNum > 0)
					reqVAR["u" + troop.typeId] = "" + troop.selectNum;
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
				reqVAR["type"] = "" + march_type;
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
		}else{
			//show erreo info
		}	
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
		
		//send march
			March.instance().executeMarch(reqVAR,excuteMarchOK);
	}
	
	protected function excuteMarchOK(result:HashObject):void
	{
		var marchStatus:int = _Global.INT32(result["marchState"]);

		if (result["itemCount"]!=null) {
			var count=_Global.INT32(result["itemCount"]);
			MyItems.singleton.subtractItem (3298, count);
		}
		
		//Object	public	function	addQueue (marchid, start:int, eta:int, xcoord, ycoord, type, kid, resources, tid, ttype, tlevel)
		close();
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
		for(idx=0; idx < troopList.length; idx++)
		{
			xid = troopList[idx] as Barracks.TroopInfo;
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
		
		for(idx=0; idx < resourceList.length; idx++)
		{
			var recid:ResourceVO = resourceList[idx] as ResourceVO;
			marchresource[recid.id] = recid.selectNum;
			Resource.instance().addToSeed(recid.id, -recid.selectNum,GameMain.instance().getCurCityId());
		}
		
		Resource.instance().UpdateRecInfo();
		Barracks.instance().UpadateAllTroop();	
			
		this.sendNotification(Constant.Notice.ON_MARCH_OK,null);
		
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
		/**
		var rb:RallyPointBuilding = MenuMgr.getInstance().GetCurMenu() as RallyPointBuilding;
		if(rb)
			rb.refreshData();		
		**/
	}
	
	public function getmyNacigator():NavigatorController
	{
		return nc;
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
	
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.PVE_MARCH_BEGIN:
			case Constant.Notice.SEND_MARCH:
				//add march progressbar to mainchrom
				MenuMgr.getInstance().PopMenu("MarchMenu");
				
				March.instance().addPveQueueItem();
				break;
			case Constant.Notice.AvaUseSpeedUpItemOk:
			case Constant.Notice.AvaUnitsRefreshed:
				resetTroopList();
				break;
			case Constant.Notice.OnMarchSizeBuffSeleted:
				oneTimeMarchSizeBuff = body as String;
				UpdateMarchSizeCap();
				break;
			case Constant.Notice.OnMarchAddItemUse:
				var count=_Global.INT32(body);
				OnMarchAddItemUse(count);
				break;
		}	
	}
	//使用addmarch道具
	private function OnMarchAddItemUse(count:int){
		extraMarchCount=count*10000000;
		tp_l_troop.txt = at_l_troop.txt =  _Global.NumSimlify(select_troops) + 
		"/" + _Global.NumSimlify(VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize()))
		+(extraMarchCount==0?"":("+"+
		"<color=#00ff00>" + _Global.NumSimlify(extraMarchCount) + "</color>"));
		MarchDataManager.instance().MAXSIZE=VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize())+extraMarchCount;
		btn_AddMarchSize.rect.x = tp_l_troop.rect.x + _Global.GUICalcWidth(tp_l_troop.mystyle,tp_l_troop.txt) + 5;
		scroll_troop.ForEachItem(SliderValueChange);
	}
	
	private function UpdateMarchSizeCap()
	{
		if(march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE){
			AutoSelectCarmotTroop();
			scroll_troop.SetColPerPage(heroList.Concat(troopList).length/2+1);
			scroll_troop.SetData(heroList.Concat(troopList));
			calcTroops();
			carmot_l_troop.txt= _Global.NumSimlify(carmotload_resource) + "/" + _Global.NumSimlify(calcCarmotMaxValue());
		}
		tp_l_troop.txt = at_l_troop.txt  =_Global.NumSimlify(select_troops) + "/" + _Global.NumSimlify(VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize() /*+ Technology.instance().getAddMarchCount()*/))
		+(extraMarchCount==0?"":("+"+
		"<color=#00ff00>" + _Global.NumSimlify(extraMarchCount) + "</color>"));
		MarchDataManager.instance().MAXSIZE=VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize() /*+ Technology.instance().getAddMarchCount()*/)+extraMarchCount;
		tp_l_troop0.txt= resignSelectMarchCount+"/"+VisibleMarchCount ;
		if(select_troops > (max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize()) /** Technology.instance().getAddMarchCount()*/)
		{
			at_l_troop.SetNormalTxtColor(FontColor.Red);
//			carmot_l_troop.SetNormalTxtColor(FontColor.Red);
			
			tp_l_troop.SetNormalTxtColor(FontColor.Red);
		}
		else
		{
			at_l_troop.SetNormalTxtColor(FontColor.TabNormal);
//			carmot_l_troop.SetNormalTxtColor(FontColor.TabNormal);
			
			tp_l_troop.SetNormalTxtColor(FontColor.TabNormal);		
		}
		AutoSelectCarmotTroop();
		scroll_troop.SetColPerPage(heroList.Concat(troopList).length/2+1);
		scroll_troop.SetData(heroList.Concat(troopList));
	}
	
	private function resetTroopList()
	{
		troopList = GameMain.Ava.Units.TroopList.ToArray();
		troopList.Sort(Barracks.TroopInfo.CompareByLevelAndType);
		troopList.Reverse();
		
		heroList = GameMain.Ava.Units.GetMarchHeroList().ToArray();
		scroll_troop.SetColPerPage(heroList.Concat(troopList).length/2+1);
		scroll_troop.SetData(heroList.Concat(troopList));
	}
	
	private function startAvaMarch():void
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
		MenuMgr.getInstance().PopMenu("");
	}
	
	private function OnAddMarchSize(clickParam:Object)
	{
		if (march_type == Constant.MarchType.REASSIGN) {
			// if (MyItems.singleton.GetItemCount (3298)<=0) {
			// 	ErrorMgr.instance().PushError("",Datas.getArString("你没有足够的3298道具"));
			// }
			var data:Hashtable = { "itemId":3298,
				"base_tropsMax":VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize()),
				"extra_tropsMax":extraMarchCount,
				"select_troops":select_troops,
				"tp_l_troop0":tp_l_troop0.txt
			};
			MenuMgr.getInstance().PushMenu("AddMrachMaxMenu", data, "trans_zoomComp");
		}else{
			MenuMgr.getInstance().PushMenu("AddMarchSizePopup",AddMarchSizeData.getInstance().BuffItemList,"trans_zoomComp"); 
		}
	}
}
