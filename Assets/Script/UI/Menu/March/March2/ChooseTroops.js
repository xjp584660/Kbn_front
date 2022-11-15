class ChooseTroops extends PopMenu implements IEventHandler
{
	@Space(30) @Header("----------ChooseTroops----------")


    public var scroll_troop :ScrollList;

    public var ins_TroopsItem :ListItem;
    public var at_l_troop	:Label;
    public var tp_l_troop	:Label;
    public var carmot_l_troop	:Label;
    public var tp_l_troop0  :Label;
	public var l_mtile		:Label;
	public var btn_next     :Button;
	public var navHead  :NavigatorHead;		
	public var texture_line :Texture2D;
	public var tp_l_resource:Label;	/*both show at Troop TAB. */
	public var blankTip	:Label;
	public var btn_AddMarchSize	:Button;
	

    private var troopList   :Array;
    private var cachedData : Hashtable;
    private var select_troops : long;
    private var march_type 	:int;
    private var max_troop 	:long;
    private var item_general_data	:GeneralInfoVO;
    private var marchHeroId : List.<long>;
    private var heroList : Array;
    private var fx	:int;
	private var fy	:int;
	private var tx	:int;
	private var ty	:int;
	private var select_resources:long;

    private var VisibleMarchCount:int=1;
    private var carmotload_resource	:long;
    private var march_time	:long;
    private var base_speed:float=0f;
    private var carmotWeight:float = 1;
    private	var resignSelectMarchCount:int=0;

    private var marchDataIns:MarchDataManager;
   
	private var isCity : boolean = false;



     public function Init()
     {
		super.Init();
        ins_TroopsItem.Init();
        scroll_troop.Init(ins_TroopsItem);
        scroll_troop.itemDelegate = this;
        l_mtile.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_time", TextureType.ICON);
        var seed:HashObject = GameMain.instance().getSeed();
         carmotWeight = _Global.FLOAT(seed["carmotweight"].Value);
         marchDataIns = MarchDataManager.instance(); 
		 navHead.titleTxt = Datas.getArString("ModalTitle.Choose_Troops");
		 btn_next.OnClick = OnNextBtnClick;
		 btn_AddMarchSize.setNorAndActBG("btn_plus_normal","btn_plus_down");
		 btn_AddMarchSize.OnClick = OnAddMarchSize;
		 extraMarchCount = 0;
		 btnClose.OnClick = onCloseBtnAction;

	 }

	public function DrawBackground()
	{
		super.DrawBackground();
		this.drawTexture(texture_line,45,105,490,17);
	}

	public function DrawItem()
    {
        scroll_troop.Draw();
		at_l_troop.Draw();
		carmot_l_troop.Draw();
		tp_l_troop.Draw();
		tp_l_troop0.Draw();
		l_mtile.Draw();
		btn_next.Draw();
		navHead.Draw();
		tp_l_resource.Draw();
		blankTip.Draw();
		btn_AddMarchSize.Draw();
    }

    public function OnPush(param:Object)
    {
		isCity = false;
		if(param != null)
		{
			isCity = true;
		}
        /* var data:Hashtable = param as Hashtable; */

		setData();

		at_l_troop.SetVisible(march_type != Constant.MarchType.TRANSPORT && march_type != Constant.MarchType.REASSIGN );
		carmot_l_troop.SetVisible(march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE);
			
		if(march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE){
			carmot_l_troop.mystyle.normal.background = CollectionResourcesMgr.instance().GetTilePopUpIcon(String.Format("{0}_{1}", tx, ty));
			at_l_troop.rect.y = 770;
			btn_AddMarchSize.rect.y = 770;
		}else {
			at_l_troop.rect.y = 787;
			btn_AddMarchSize.rect.y = 787;
		}

		tp_l_troop0.SetVisible(march_type == Constant.MarchType.REASSIGN);
		tp_l_troop.SetVisible(march_type == Constant.MarchType.TRANSPORT || march_type == Constant.MarchType.REASSIGN);
		btn_AddMarchSize.SetVisible(march_type == Constant.MarchType.ATTACK || march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE || march_type == Constant.MarchType.PVP || march_type == Constant.MarchType.REASSIGN);

		if (march_type == Constant.MarchType.REASSIGN) {
			tp_l_troop.rect.x = 167;
		}else 
			tp_l_troop.rect.x = 26;

		tp_l_resource.SetVisible(march_type == Constant.MarchType.TRANSPORT || march_type == Constant.MarchType.REASSIGN);
	
		if (march_type == Constant.MarchType.AVA_SENDTROOP) {
			btn_next.txt = Datas.getArString("Common.Deploy");
		} else {
			btn_next.txt = Datas.getArString("Common.Next_Button");		
		}

		if(troopList.length  == 0)	{
			blankTip.txt = Datas.getArString("March.NO_Troop");		
			this.blankTip.SetVisible(true);
			this.scroll_troop.SetVisible(false);
			tp_l_troop.rect.x = 26;
			btn_AddMarchSize.rect.y = 770;
			btn_AddMarchSize.rect.x = tp_l_troop.rect.x + _Global.GUICalcWidth(tp_l_troop.mystyle,tp_l_troop.txt) + 5;
		}			
		else
		{
			this.blankTip.SetVisible(false);
            this.scroll_troop.SetVisible(true);	
			scroll_troop.rect.x = 0;
			scroll_troop.SetResposeAngle(60);
			setTroopList();
			UpdateData();
			scroll_troop.ResetPos();
			handleItemAction("Slider_Up",null);
		}
		btn_next.txt = MarchDataManager.instance().GetNextBtnTxt();
	
		
	}
	
	function UpdateData()
	{
		calcTroops();
		calcResources();
		tp_l_troop.txt = at_l_troop.txt = _Global.NumSimlify(select_troops) + "/"
										+ _Global.NumSimlify(VisibleMarchCount * (max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize() /*+ Technology.instance().getAddMarchCount()*/))
										+ (extraMarchCount == 0 ? "" : ("+" + "<color=#00ff00>" + _Global.NumSimlify(extraMarchCount) + "</color>"));

		marchDataIns.MAXSIZE = VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize() /*+ Technology.instance().getAddMarchCount()*/)+extraMarchCount;
		if(march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE){
			carmot_l_troop.txt= _Global.NumSimlify(carmotload_resource) + "/" + _Global.NumSimlify(calcCarmotMaxValue());
		}else if(march_type == Constant.MarchType.REASSIGN){
			tp_l_troop0.txt=resignSelectMarchCount+"/"+VisibleMarchCount ;
			tp_l_troop.rect.x = 26;
			btn_AddMarchSize.rect.y = 770;
			btn_AddMarchSize.rect.x = 200;
		}			
		btn_AddMarchSize.rect.x = tp_l_troop.rect.x + _Global.GUICalcWidth(tp_l_troop.mystyle,tp_l_troop.txt) + 5;
		/*l_mtile.txt = _Global.timeFormatStr(march_time);*/
		tp_l_resource.txt = _Global.NumSimlify(select_resources) +"/" + _Global.NumSimlify(MarchDataManager.instance().max_resource);

	}

    function setData():void
    {
		/*this.troopList = marchDataIns.troopList;*/
		this.cachedData = marchDataIns.cachedData;
		if(marchDataIns.isAVA){
			var avaUnits:AvaUnits = GameMain.Ava.Units;
			troopList = avaUnits.TroopList.ToArray();
			troopList.Sort(Barracks.TroopInfo.CompareByLevelAndType);
			troopList.Reverse();
		}else if(cachedData && cachedData["res"] != null && _Global.INT64(cachedData["res"]) > 0)
		{
			troopList = Barracks.instance().GetTroopListWithOutZero(cachedData["res"]);
			troopList.Sort(Barracks.TroopInfo.CompareByLevelAndType);
		}
		else
		{
			troopList = Barracks.instance().GetTroopListWithOutZero();
			troopList.Sort(Barracks.TroopInfo.CompareByLevelAndType);
			troopList.Reverse();
		}

        this.cachedData = marchDataIns.cachedData;
        this.select_troops =  marchDataIns.select_troops;
        this.march_type = marchDataIns.march_type;
        this.max_troop = marchDataIns.max_troop;
        this.item_general_data = marchDataIns.item_general_data;
        this.marchHeroId = marchDataIns.marchHeroId;
        this.heroList = marchDataIns.heroList;
        this.fx = marchDataIns.fx;
        this.fy = marchDataIns.fy;
        this.tx = marchDataIns.tx;
		this.ty = marchDataIns.ty;
		this.VisibleMarchCount = marchDataIns.VisibleMarchCount;
		this.extraMarchCount = marchDataIns.extraMarchCount;

		if(this.march_type == Constant.MarchType.AVA_SENDTROOP)
		{
			/* 0显示攻城兵 1不显示攻城兵 */
			if(GameMain.instance().AvaU34DeploySwitch() == 1)
			{
				for (var i = 0; i < troopList.length; i++) {
					var avaRemove:Barracks.TroopInfo = troopList[i];
					if (avaRemove.actType == 5) {
						troopList.splice(i, 1);
						i--;
					}
				}	
			}
		}
		/*单独显示巨塔兵*/
		else if (this.march_type == Constant.MarchType.GIANTTPWER)
		{
			for (var k = 0; k < troopList.length; k++)
			{
				var troopRemove: Barracks.TroopInfo = troopList[k];
				if (troopRemove.actType != 5) {
					troopList.splice(k, 1);
					k--;
				}
			}
		}
		else
		{
			/* 剔除新兵种 5 攻城兵 */
			if(!((GameMain.instance().IsCityTile(tx, ty) || isCity)&& march_type == Constant.MarchType.ATTACK))
			{
				for (var j = 0; j < troopList.length; j++) {
					var troopInfoRemove:Barracks.TroopInfo = troopList[j];
					if (troopInfoRemove.actType == 5) {
						troopList.splice(j, 1);
						j--;
					}
				}	
			}
		}		
		/* marchDataIns.marchHeroId.Clear(); */
	}
	
	function setMarchData():void
	{
		marchDataIns.troopList = this.troopList;
        marchDataIns.select_troops =  this.select_troops ;
		marchDataIns.max_troop =  this.max_troop ;
		marchDataIns.select_resources =  this.select_resources ;
		marchDataIns.resignSelectMarchCount = this.resignSelectMarchCount;
		marchDataIns.VisibleMarchCount = this.VisibleMarchCount;
		marchDataIns.extraMarchCount = this.extraMarchCount;
        /* marchDataIns.heroList =  this.heroList ; */
	}

    public function OnPopOver()
	{
        scroll_troop.Clear();
    }


   public function Update()
   {
	  scroll_troop.Update();
   }
    
    protected function calcTroops():void
	{
		var n:int = troopList.length;
		var troopInfo :Barracks.TroopInfo;
		var speed:float = 65535;
		var uspd:float;
		var skillLoadBuf:float=0;
		var suitAndSkillAdd:float=0;
		select_troops = 0;
		marchDataIns.max_resource  = 0;
		carmotload_resource=0;
		var knight:Knight = null;
		var currentcityid:int = GameMain.instance().getCurCityId();
		var tr1:float = Research.instance().bonusForType(Constant.Research.ROADS);
		var tr2:float = Research.instance().bonusForType(Constant.Research.HORSE);
		var allMarchSpeedBuff:BuffValue = new BuffValue();

		var logisticsCtrBonus: float = 0f;
		if (march_type == Constant.MarchType.ATTACK || march_type == Constant.MarchType.COLLECT || march_type == Constant.MarchType.COLLECT_RESOURCE)
			logisticsCtrBonus = 0f;
		else
			logisticsCtrBonus = 0.5f * Building.instance().getMaxLevelForType(Constant.Building.RELIEF_STATION, currentcityid);

		if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
			allMarchSpeedBuff = GameMain.PlayerBuffs.AvaSelfRunningBuffs.GetRunningBuffsValueBy(BuffScene.Ava, BuffTarget.UnitSpeed, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));
		else
			allMarchSpeedBuff = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy(BuffScene.Home, BuffTarget.UnitSpeed, new BuffSubtarget( BuffSubtargetType.UnitType, 0 ));
		
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

			var troopGDS = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>();
			var weight: int = troopGDS.GetAttributeFromAttrType(Constant.TroopType.UNITS,troopInfo.typeId,Constant.TroopAttrType.LOAD);
			var currentCityIndex : int = GameMain.instance().getCurCityOrder() - 1;
			var resTransBuffValue:BuffValue = new BuffValue();
			if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
				resTransBuffValue = GameMain.PlayerBuffs.AvaSelfRunningBuffs.GetRunningBuffsValueBy(BuffScene.Ava, BuffTarget.Limit, new BuffSubtarget( BuffSubtargetType.ResourceTransport, 0 ));
			else
				resTransBuffValue = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy( BuffScene.Home, BuffTarget.Limit, new BuffSubtarget(BuffSubtargetType.ResourceTransport,0) );

			var bonus_WEIGHT_DIST = Research.instance().bonusForType(Constant.Research.WEIGHT_DIST);
			var heroSkillAffectedRatio = HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Load);
			if (march_type == Constant.MarchType.COLLECT)
			{
				/* carmot资源负载值计算 */
				carmotload_resource += (troopInfo.selectNum * weight * (1 + bonus_WEIGHT_DIST + Technology.instance().getTroopLoad() + heroSkillAffectedRatio+ resTransBuffValue.Percentage+suitAndSkillAdd)+ resTransBuffValue.Number)/carmotWeight;
			}
			else if(march_type == Constant.MarchType.COLLECT_RESOURCE)
			{
				carmotload_resource += (troopInfo.selectNum * weight * (1 + bonus_WEIGHT_DIST + Technology.instance().getTroopLoad() + heroSkillAffectedRatio+ resTransBuffValue.Percentage+suitAndSkillAdd)+ resTransBuffValue.Number);
			}
			else {
				/* 运输资源上限计算 */
				marchDataIns.max_resource += troopInfo.selectNum * weight * (1 + bonus_WEIGHT_DIST + Technology.instance().getTroopLoad() + heroSkillAffectedRatio + resTransBuffValue.Percentage ) + resTransBuffValue.Number;		
			}

			/*
			//max_resource += troopInfo.selectNum * weight *  ( 1 + bonus_WEIGHT_DIST + heroSkillAffectedRatio + resTransBuffValue.Percentage ) + resTransBuffValue.Number;
			//calc slowest speed;
			//uspd = _Global.INT32(unitstats["unt" + troopInfo.typeId][_Global.ap + 3 ]);	// (1 + Research.instance().bonusForType(Constant.Research.ROADS);
			*/
			
			

			if(AvaMarch.IsAvaMarch(march_type))
			{
				uspd = troopGDS.GetAttributeFromAttrType(Constant.TroopType.UNITS,troopInfo.typeId,Constant.TroopAttrType.AVASPEED);
			}
			else
			{
				uspd = troopGDS.GetAttributeFromAttrType(Constant.TroopType.UNITS,troopInfo.typeId,Constant.TroopAttrType.SPEED);
			}

			base_speed=uspd;
			
			var troopType: int = troopGDS.GetAttributeFromAttrType(null,troopInfo.typeId,Constant.TroopAttrType.TYPE);
			var speedBuffValue:BuffValue = new BuffValue();
			if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
				speedBuffValue = GameMain.PlayerBuffs.AvaSelfRunningBuffs.GetRunningBuffsValueBy(BuffScene.Ava, BuffTarget.UnitSpeed, new BuffSubtarget( BuffSubtargetType.UnitType, troopType ));
			else
				speedBuffValue = GameMain.PlayerBuffs.HomeRunningBuffs.GetRunningBuffsValueBy(BuffScene.Home, BuffTarget.UnitSpeed, new BuffSubtarget( BuffSubtargetType.UnitType, troopType ));
			
			var buffP:float = speedBuffValue.Percentage + allMarchSpeedBuff.Percentage;
			var buffN:int = speedBuffValue.Number + allMarchSpeedBuff.Number;

			/*
			 Debug.LogWarning("uspd="+uspd);
			  Debug.LogWarning("buffP="+buffP+"  buffN="+buffN);
			*/

			var buspd = uspd;
			var heroSkillAffectedRatioLong = HeroManager.Instance().GetHeroSkillAffectedRatioLong(marchHeroId, KBN.HeroSkillAffectedProperty.Fast);

			if (troopInfo.actType == Constant.TroopActType.Hourse) {
				if (cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
					uspd = uspd * (1 + HeroManager.Instance().GetHeroSkillAffectedRatio(KBN.GameMain.Ava.Units.HeroIDList, KBN.HeroSkillAffectedProperty.HorseSpeed) + heroSkillAffectedRatioLong + buffP) + buffN;
				else
					uspd = uspd * (1 + tr1 + tr2 + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.HorseSpeed) + heroSkillAffectedRatioLong + buffP + logisticsCtrBonus) + buffN;	/*(1 + Research.bonusForType(Constant.Research.HORSE));*/
			}
			else {
				if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1)
					uspd = uspd * (1 + HeroManager.Instance().GetHeroSkillAffectedRatio(KBN.GameMain.Ava.Units.HeroIDList, KBN.HeroSkillAffectedProperty.GroundSpeed) + heroSkillAffectedRatioLong + buffP) + buffN;
				else
					uspd = uspd * (1 + tr1 + HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.GroundSpeed) + heroSkillAffectedRatioLong + buffP + logisticsCtrBonus) + buffN;
			}

			/*troopInfo.typeId*/

			if (knight != null)
			{
				if(speeddatas != null && speeddatas.length > 4)
				{
					var d : double = 1.0f;
					if ( speeddatas[4].TryGetValue(troopInfo.typeId, d) )
						uspd += buspd * d;
				}
			}

			/* Debug.LogWarning("zuizhong_uspd="+uspd);*/

			if (uspd < speed) {
				speed = uspd;
			}
		}
		
		if(cachedData != null && _Global.INT32(cachedData["ava"]) == 1){

		}else{
			speed *= Technology.instance().getTroopsMarchSpeed();	
		}

		if(cachedData != null) /* 世界boss speed */
		{
		   var toX = _Global.INT32(cachedData["x"]);
           var toY = _Global.INT32(cachedData["y"]);
           if(WorldBossController.singleton.isWorldBoss(toX, toY))
	       {
			    /*
				 Debug.LogWarning('base_speed='+base_speed);
			     Debug.LogWarning('buff_speed='+speed);
			     Debug.LogWarning('buff/base='+speed/base_speed);
				*/
			    
				var sqrt0:float=GameMain.singleton.GetWorldBossSqrt()==0?1f:GameMain.singleton.GetWorldBossSqrt();
				speed = base_speed*Mathf.Pow(speed/base_speed, sqrt0);   
				
				/* Debug.LogWarning('now_speed='+speed);*/
	       }
		}
		
		var dx:int = fx - tx;
		var dy:int = fy - ty;
		
		var dist:double = (dx * dx) + (dy * dy);
		dist = Mathf.Sqrt(dist);		

		if (march_type == Constant.MarchType.REASSIGN || march_type == Constant.MarchType.GIANTTPWER) {
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
		else{

			march_time = Mathf.Max(Mathf.Ceil(dist * 6000f / speed),30);	/*seconds.*/
		}
        marchDataIns.march_time = march_time;
		
		
		if(select_troops > VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize() /*+ Technology.instance().getAddMarchCount()*/)+extraMarchCount)
		{
			at_l_troop.SetNormalTxtColor(FontColor.Red);
			tp_l_troop.SetNormalTxtColor(FontColor.Red);
		}
		else
		{
			at_l_troop.SetNormalTxtColor(FontColor.TabNormal);
			tp_l_troop.SetNormalTxtColor(FontColor.TabNormal);
		}
			

		if (resignSelectMarchCount > VisibleMarchCount) {
			tp_l_troop0.SetNormalTxtColor(FontColor.Red);
		} else {
			tp_l_troop0.SetNormalTxtColor(FontColor.TabNormal);
		}
		
    }
    


    public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			/*
				case Constant.Notice.PVE_MARCH_BEGIN:
			
			 	//add march progressbar to mainchrom
			 	MenuMgr.getInstance().PopMenu("ChooseTroops");
			 	March.instance().addPveQueueItem();
			 	break;
			*/
			case Constant.Notice.SEND_MARCH:
				if(MenuMgr.instance.getMenu("ChooseTroops") != null)
				{
					MenuMgr.getInstance().PopMenu("ChooseTroops");
				}
				break;
			case Constant.Notice.AvaUseSpeedUpItemOk:
			case Constant.Notice.AvaUnitsRefreshed:
				resetTroopList();
				break;
			case Constant.Notice.OnMarchSizeBuffSeleted:
				marchDataIns.oneTimeMarchSizeBuff = body as String;
				UpdateMarchSizeCap();
				break;
			case Constant.Notice.OnMarchAddItemUse:
				var count=_Global.INT32(body);
				OnMarchAddItemUse(count);
				break;
		}	
    }
    

    public function handleItemAction(action:String,param:Object):void
	{
        var last_itemData:Object;
		var data:Hashtable = param as Hashtable;
		switch(action)
		{
			case Constant.Action.MARCH_TROOP_SELECT:
				/*this.updateStatusBar();*/
				UpdateData();
				break;
			case "Slider_Up":
				scroll_troop.ForEachItem(SliderValueChange);
				break;
			case Constant.Action.MARCH_RESOURCE_SELECT:
				UpdateData();
				/*
				 this.updateStatusBar();
					//check max ...
				*/
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

	private var extraMarchCount = 0;
	private function SliderValueChange(item : ListItem) : boolean
    {
        var itemNow = item as MarchResourceItem2;
        var limitValue:long = VisibleMarchCount * (max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize()) + extraMarchCount -select_troops;

		itemNow.slider.SetLimitValue(limitValue);
		itemNow.RefreshMaxLabel();

        if (limitValue <= 0) {
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


    	/* 使用addmarch道具 */
	private function OnMarchAddItemUse(count:int){
		marchDataIns.extraMarchCount = this.extraMarchCount = count*10000000;
		
		tp_l_troop.txt = at_l_troop.txt =  _Global.NumSimlify(select_troops) + 
		"/" + _Global.NumSimlify(VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize()))
		+(extraMarchCount==0?"":("+"+
		"<color=#00ff00>" + _Global.NumSimlify(extraMarchCount) + "</color>"));
		marchDataIns.MAXSIZE = VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize())+extraMarchCount;
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
		tp_l_troop.txt = at_l_troop.txt = _Global.NumSimlify(select_troops) + "/"
										+ _Global.NumSimlify(VisibleMarchCount * (max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize() /*+ Technology.instance().getAddMarchCount()*/))
										+ (extraMarchCount == 0 ? "" : ("+" + "<color=#00ff00>" + _Global.NumSimlify(extraMarchCount) + "</color>"));

		marchDataIns.MAXSIZE = VisibleMarchCount*(max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize() /*+ Technology.instance().getAddMarchCount()*/)+extraMarchCount;
		tp_l_troop0.txt= resignSelectMarchCount+"/"+VisibleMarchCount ;
		if(select_troops > (max_troop + AddMarchSizeData.getInstance().GetSelectedBuffSize()) /** Technology.instance().getAddMarchCount()*/)
		{
			at_l_troop.SetNormalTxtColor(FontColor.Red);
			tp_l_troop.SetNormalTxtColor(FontColor.Red);
		}
		else
		{
			at_l_troop.SetNormalTxtColor(FontColor.TabNormal);
			tp_l_troop.SetNormalTxtColor(FontColor.TabNormal);		
		}
		AutoSelectCarmotTroop();
		scroll_troop.SetColPerPage(heroList.Concat(troopList).length/2+1);
		scroll_troop.SetData(heroList.Concat(troopList));
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
			if(item_general_data != null) /*有选择骑士，计算骑士装备技能加成*/
			{
				var knightID : int = item_general_data.knightId;
				var knight : Knight = GearManager.Instance().GearKnights.GetKnight(knightID);
				/* skillLoadBuf = GearManager.Instance().GetKnightSkillLoad(knight.Arms);*/
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
				if(troopInfo.actType == 1 && march_type == Constant.MarchType.COLLECT)
				{/* 剔除运输兵 */
					troopList.splice(i,1);	
					i--;
					continue;
				}

				/*获取单种兵运输资源数量*/
				var weight : int = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>().GetAttributeFromAttrType(Constant.TroopType.UNITS,troopInfo.typeId,Constant.TroopAttrType.LOAD);
				if(weight <= 0){
					troopInfo.selectNum = 0;
					continue;
				}
				var perTroopWeight: float = 0;
				var heroSkillAffectedRatio = HeroManager.Instance().GetHeroSkillAffectedRatio(currentCityIndex, KBN.HeroSkillAffectedProperty.Load);
				perTroopWeight = weight * (1 + Research.instance().bonusForType(Constant.Research.WEIGHT_DIST) + heroSkillAffectedRatio + resTransBuffValue.Percentage + suitAndSkillAdd) + resTransBuffValue.Number;

				if(march_type == Constant.MarchType.COLLECT)
				{
					perTroopWeight = perTroopWeight / carmotWeight;
				}
			 

				if(maxWeight > 0 &&  curSelectTroop < maxTpNum)
				{/*已经选择的士兵数量，小于需要运输资源士兵数量*/
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
								
					if (curSelectTroop + needTroopCount > maxTpNum) {/*如果选择的士兵加上需要的士兵数量大于自己带领士兵的最大值*/
						needTroopCount = maxTpNum - curSelectTroop;					
					}
					
					if (troopInfo.owned >= needTroopCount) {/*当前士兵可以满足要求运输剩余的资源*/
						curSelectTroop += needTroopCount;
						troopInfo.selectNum = needTroopCount;
						maxWeight = 0;
					}else{/*当前士兵不足以运输剩余的资源*/
						curSelectTroop += troopInfo.owned;
						troopInfo.selectNum = troopInfo.owned;
						maxWeight -= troopInfo.owned * perTroopWeight - 1;
					}
				}else{
					troopInfo.selectNum = 0;
				}
			}
			if(march_type == Constant.MarchType.COLLECT_RESOURCE)
			{
				for (var j = 0; j < troopList.length; j++) {
					var troopInfoRemove:Barracks.TroopInfo = troopList[j];
					if (troopInfoRemove.actType == 1) {
						troopList.splice(j, 1);
						troopList.unshift(troopInfoRemove);
					}
				}		
			}
		}
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
	private function resetTroopList()
	{
		troopList = GameMain.Ava.Units.TroopList.ToArray();
		troopList.Sort(Barracks.TroopInfo.CompareByLevelAndType);
		troopList.Reverse();
		
		heroList = GameMain.Ava.Units.GetMarchHeroList().ToArray();
		scroll_troop.SetColPerPage(heroList.Concat(troopList).length/2+1);
		scroll_troop.SetData(heroList.Concat(troopList));
	}

	private function setTroopList()
	{
		switch(march_type)
		{
			case Constant.MarchType.TRANSPORT:
			case Constant.MarchType.REASSIGN:
			case Constant.MarchType.GIANTTPWER:
					scroll_troop.SetColPerPage(troopList.length/2+1);
					scroll_troop.SetData(troopList);
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
					AddMarchSizeData.getInstance().ResetBuffListData();
					AutoSelectCarmotTroop();
					scroll_troop.SetColPerPage(heroList.Concat(troopList).length / 2 + 1);

					/* 是采集的时候,需要将采集部队放到前列 */
					if (march_type == Constant.MarchType.COLLECT_RESOURCE || march_type == Constant.MarchType.COLLECT) {
						troopList.Sort(Barracks.TroopInfo.CompareBySupplyType);
					}
					scroll_troop.SetData(heroList.Concat(troopList));
				break;
			case Constant.MarchType.AVA_SENDTROOP:
					    scroll_troop.SetColPerPage(heroList.Concat(troopList).length/2+1);
					    scroll_troop.SetData(heroList.Concat(troopList));
				break;
			case Constant.MarchType.JION_RALLY_ATTACK:		
					    scroll_troop.SetColPerPage(troopList.length/2+1);
					    scroll_troop.SetData(troopList);
				break;
		}
	}
	
	
    private function OnAddMarchSize(clickParam:Object)
    {
        if (march_type == Constant.MarchType.REASSIGN) {
            /*
			 if (MyItems.singleton.GetItemCount (3298)<=0) {
				ErrorMgr.instance().PushError("",Datas.getArString("你没有足够的3298道具"));
             }
			*/
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
	private function calcResources():void
	{
		select_resources = calcListSelectNum(marchDataIns.resourceList);
		if(select_resources > MarchDataManager.instance().max_resource)
		{
			tp_l_resource.SetNormalTxtColor(FontColor.Red);
			
		}
		else
		{
			tp_l_resource.SetNormalTxtColor(FontColor.TabNormal);
		}
    }
    
    private function calcListSelectNum(list:Array):long
	{
		if(list == null)
			return 0;
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
	
	function onCloseBtnAction():void
	{
		marchDataIns.marchHeroId.Clear();
		if(marchDataIns.IsDefaultType())
		{
          MenuMgr.instance.sendNotification (Constant.Notice.SET_MARCH_TROOP,null);
		}
		MenuMgr.getInstance().PopMenu("");
	}

	function OnNextBtnClick():void
	{
		var error:int = 0;
		var errorStr:String = "";
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
		if(error > 0)
		{
			ErrorMgr.instance().PushError("",errorStr);
			return;
		}
		setMarchData();

		if(marchDataIns.IsDefaultType())
		{
		  MenuMgr.getInstance().PopMenu("");
          MenuMgr.instance.sendNotification (Constant.Notice.SET_MARCH_TROOP,null);
		}
		else{
			switch(march_type)
			{
				case Constant.MarchType.TRANSPORT:
				case Constant.MarchType.REASSIGN:				
						MenuMgr.getInstance().PushMenu("SelectResource",null,"trans_zoomComp");
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
					if (march_type == Constant.AvaMarchType.ATTACK || march_type == Constant.AvaMarchType.REINFORCE
						|| march_type == Constant.AvaMarchType.RALLYATTACK || march_type == Constant.AvaMarchType.RALLYREINFORCE) {

						MenuMgr.getInstance().PushMenu("MarchBoostComplex",{"type":MarchBoostComplex.BOOST_TYPE.AVA},"trans_zoomComp");
					}
					else
						MenuMgr.getInstance().PushMenu("MarchBoostComplex",{"type":MarchBoostComplex.BOOST_TYPE.NORMAL},"trans_zoomComp");
					break;

				case Constant.MarchType.AVA_SENDTROOP:
					marchDataIns.SendMarch();
					break;
				case Constant.MarchType.JION_RALLY_ATTACK:		
					marchDataIns.SendMarch();
					break;
				case Constant.MarchType.GIANTTPWER:
					MenuMgr.getInstance().PushMenu("MarchBoostComplex", { "type": MarchBoostComplex.BOOST_TYPE.NORMAL }, "trans_zoomComp");
					break;
			}
		}

	}
	
 }