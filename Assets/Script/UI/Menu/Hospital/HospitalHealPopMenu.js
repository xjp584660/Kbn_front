#pragma strict

public class HospitalHealPopMenu
	extends PopMenu
{
	public class HealWoundedInfo
		extends TroopSelectionListItem.DisplayData
	{
		public function HealWoundedInfo(){}
		public function HealWoundedInfo(id : int, cnt : int)
		{
			super(id, cnt);
		}
		public function HealWoundedInfo(info : HospitalMenu.WoundedInfo)
		{
			this(info.troopId, info.troopCount);
		}
        
        public function get troopHealCount() : int
        {
            return selectCount;
        }
        
        public function set troopHealCount(value : int)
        {
            selectCount = value;
        }
	}
	
	private var m_woundedHealList : System.Collections.Generic.List.<HealWoundedInfo>;

	@SerializeField
	private var m_titleBar : Label;
	@SerializeField
	private var m_resourceBar : Label;
	@SerializeField
	private var m_resourceTitleBar : Label;
	@SerializeField
	private var m_resourceListes : Label[];
	
	//@SerializeField
	//private var m_resourceCostTitle : Label;
	@SerializeField
	private var m_resourceCost : Label[];
	@SerializeField
	private var m_resourceOwner : Label[];
	
	@SerializeField
	private var m_healCount : Label;
	@SerializeField
	private var m_healTime : Label;
	@SerializeField
	private var m_healGems : Label;
	
	@SerializeField
	private var m_slWounded : ScrollList;
	@SerializeField
	private var m_healWoundedTemplate : TroopSelectionListItem;

	@SerializeField
	private var m_btnHeal : Button;
	@SerializeField
	private var m_btnInstantHeal : Button;
	
	private var m_needHealCount : int;
	
	
	private var m_calcedCacheIsHaveEnoughResource : boolean;
	private var m_calcedCacheGemsCost : int;
	
	private	var m_cityId : int;

    private var healFormulaParamsBase : float = 1f;
    private var healFormulaParamsA1 : float = 0f;
    private var healFormulaParamsA2 : float = 0f;
    private var healFormulaParamsA3 : float = 0f;
	
	private var m_isNeedCreateNewHealQueue : boolean;

	private enum ResourceType
	{
		ResourceFood,
		ResourceOre,
		ResourceStone,
		ResourceCarmot,
		ResourceWood,
		ResourceGold,
	}

	public function Init()
	{
		super.Init();
		title.txt = Datas.getArString("ModalTitle.Choose_Troops");
		m_woundedHealList = new System.Collections.Generic.List.<HealWoundedInfo>();

		m_btnHeal.OnClick = priv_clickHeal;
		m_btnInstantHeal.OnClick = priv_clickInstantHeal;

		m_btnInstantHeal.changeToGreenNew();
		m_slWounded.Init(m_healWoundedTemplate);
		m_slWounded.SetResposeAngle(60);
		var texMgr : TextureMgr = TextureMgr.instance();
		m_resourceTitleBar.mystyle.normal.background = texMgr.LoadTexture("square_black2", TextureType.DECORATION);
		m_resourceBar.mystyle.normal.background = texMgr.LoadTexture("square_black2", TextureType.DECORATION);
		m_titleBar.mystyle.normal.background = texMgr.LoadTexture("between line", TextureType.DECORATION);
		m_titleBar.rect.height = m_titleBar.mystyle.normal.background.height;
		//m_titleBar.rect.width = m_titleBar.mystyle.normal.background.width;
		var resourceType : String[] = ["resource_Food_icon", "resource_Ore_icon", "resource_Stone_icon", "resource_Steel_icon", "resource_Wood_icon", "resource_Gold_icon"];
		for ( var i : int = 0; i != m_resourceListes.Length; ++i )
		{
			var curResource : Label = m_resourceListes[i];
			curResource.mystyle.normal.background = texMgr.LoadTexture(resourceType[i], TextureType.ICON);
		}
		m_btnHeal.txt = Datas.getArString("Hospital.Healbutton");
		m_btnInstantHeal.txt = Datas.getArString("Hospital.InstantHealbutton");
		m_healCount.image = texMgr.LoadTexture("icon_solider", TextureType.ICON);
		m_healTime.image = texMgr.LoadTexture("icon_time", TextureType.ICON);
		m_healGems.image = texMgr.LoadTexture("resource_icon_gems", TextureType.ICON);

		m_resourceCost[m_resourceCost.Length-1].txt = Datas.getArString("Common.Required");
		m_resourceOwner[m_resourceOwner.Length-1].txt = Datas.getArString("Common.youOwn");
        
        InitHealFormulaParams();

        m_isNeedCreateNewHealQueue = false;
	}
    
    private function InitHealFormulaParams() {
        var paramsHo : HashObject = GameMain.instance().getSeed()["serverSetting"]["healTime"];
        if (paramsHo != null) {
            healFormulaParamsBase = _Global.FLOAT(paramsHo["base"].Value);
            healFormulaParamsA1 = _Global.FLOAT(paramsHo["a1"].Value);
            healFormulaParamsA2 = _Global.FLOAT(paramsHo["a2"].Value);
            healFormulaParamsA3 = _Global.FLOAT(paramsHo["a3"].Value);
        }
    }

	public function OnPush(param : Object)
	{
		super.OnPush(param);
		var woundedInfo : System.Collections.Generic.List.<HospitalMenu.WoundedInfo> = param as System.Collections.Generic.List.<HospitalMenu.WoundedInfo>;
		if ( woundedInfo != null )
		{
			var gameMain : GameMain = GameMain.instance();
			var curCityId : int = gameMain.getCurCityId();
			m_cityId = curCityId;
		}
		else
		{
			m_cityId = param;
			woundedInfo = HospitalMenu.GetWoundedInHospital(m_cityId);
		}

		for ( var item : HospitalMenu.WoundedInfo in woundedInfo )
        {
            var displayData : HealWoundedInfo = new HealWoundedInfo(item);
            displayData.onValueChanged = CalcCost;
			m_woundedHealList.Add(displayData);
        }
		m_slWounded.SetData(m_woundedHealList.ToArray());

		priv_fillOwnerResource();
		this.CalcCost();
	}

	public function DrawItem()
	{
		m_resourceTitleBar.Draw();
		m_resourceBar.Draw();
		for ( var resourceIcon : Label in m_resourceListes )
			resourceIcon.Draw();
		for ( var resCost : Label in m_resourceCost )
			resCost.Draw();
		for ( var resOwner : Label in m_resourceOwner )
			resOwner.Draw();
		m_slWounded.Draw();
		m_btnHeal.Draw();
		m_btnInstantHeal.Draw();
		m_titleBar.Draw();
		m_healCount.Draw();
		m_healTime.Draw();
		m_healGems.Draw();
	}

	public function Update()
	{
		m_slWounded.Update();
	}
	
	public function OnPopOver()
	{
		m_slWounded.Clear();
	}

	public function CalcCost() : void
	{
		priv_updateHealInfo();
	}

	private function priv_getCostResource() : long[]
	{
		var gdsTroop : KBN.GDS_Troop = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>();
		var cost : long[] = [0L,0L,0L,0L,0L,0l];
		for ( var dat : HealWoundedInfo in m_woundedHealList )
		{
			if ( dat.troopHealCount == 0 )
				continue;

			var rCost:int[] = gdsTroop.GetTroopHealCostData(dat.troopId);
			var tech : float = Technology.instance().getReducedHospitalRes();
			cost[ResourceType.ResourceFood] += _Global.INT64(Mathf.Ceil(rCost[Constant.ResourceType.FOOD] / (1 + tech))) * dat.troopHealCount;
			cost[ResourceType.ResourceOre] += _Global.INT64(Mathf.Ceil(rCost[Constant.ResourceType.IRON] / (1 + tech))) * dat.troopHealCount;
			cost[ResourceType.ResourceStone] += _Global.INT64(Mathf.Ceil(rCost[Constant.ResourceType.STONE] / (1 + tech))) * dat.troopHealCount;
			cost[ResourceType.ResourceCarmot] += _Global.INT64(Mathf.Ceil(rCost[Constant.ResourceType.CARMOT] / (1 + tech))) * dat.troopHealCount;
			cost[ResourceType.ResourceWood] += _Global.INT64(Mathf.Ceil(rCost[Constant.ResourceType.LUMBER] / (1 + tech))) * dat.troopHealCount;
			cost[ResourceType.ResourceGold] += _Global.INT64(Mathf.Ceil(rCost[Constant.ResourceType.GOLD] / (1 + tech))) * dat.troopHealCount;
		}

		return cost;
	}
	
	private function priv_calcCostGems() : int
	{
		var costTime : int = priv_getCostTime();
		var speedUp : SpeedUp = SpeedUp.instance();
		var gemsCost : int = speedUp.getTotalGemCost(costTime);
		if ( m_calcedCacheIsHaveEnoughResource )
			return gemsCost;//don't need cost gems to buy resource
		var costReses : long[] = this.priv_getCostResource();// need cost gems to buy resource
		var totalCost : long = 0;
        var R7GemsRate : float = _Global.FLOAT(GameMain.instance().getSeed()["r7togem"].Value);//carmotWeight = _Global.FLOAT(seed["carmotweight"].Value);
//		for (var costRes : long in costReses)
//			totalCost += costRes;
		for(var i:int=0 ;i<costReses.length;i++){
		if(i==ResourceType.ResourceCarmot){
			totalCost += costReses[i]*R7GemsRate;
		}else
			totalCost += costReses[i];
		}
		var gemsForRes : int = Utility.CalcTotalResourceToGemsWithCost64(totalCost);
		return gemsCost + gemsForRes;
	}

	private function priv_getCostTime() : int
	{
        // Base healing time
		var gdsTroop : KBN.GDS_Troop = GameMain.GdsManager.GetGds.<KBN.GDS_Troop>();
		var costTime : float = 0;
        
        var troopCount : int = 0;
		for (var dat : HealWoundedInfo in m_woundedHealList) {
			costTime += gdsTroop.GetTroopHealCostTime(dat.troopId) * dat.troopHealCount;
            troopCount += dat.troopHealCount;
        }
        
        if (troopCount == 0) {
            return 0;
        }

        // Get max hospital level in the current city
		var hostpitals : Array = Building.instance().getAllOfType(Constant.Building.HOSPITAL, m_cityId);
		var levelField : String = _Global.ap + "1";
		var maxLevel : int = 0;
		for (var hospital : HashObject in hostpitals)
		{
			var level : int = _Global.INT32(hospital[levelField]);
            if (level > maxLevel)
            {
			    maxLevel = level;
            }
		}
		maxLevel = Mathf.Min(10, maxLevel);

        // Buff the healing time by hospital max level
        costTime *= Mathf.Pow(healFormulaParamsBase, healFormulaParamsA1 * maxLevel * maxLevel + healFormulaParamsA2 * maxLevel + healFormulaParamsA3);

        // Ceil the result and limit it to >= 30
        var result : int = Mathf.CeilToInt(costTime  / ( 1 + Technology.instance().getIncreasesHospitalWoundedSoldiersSpeed()));
		return result;
	}

	private function priv_getOwnerResource() : long[]
	{
		var r : long[] = [0L,0L,0L,0L,0L,0l];
		var resourceType : int[] = [Constant.ResourceType.FOOD, Constant.ResourceType.IRON, Constant.ResourceType.STONE,Constant.ResourceType.CARMOT, Constant.ResourceType.LUMBER, Constant.ResourceType.GOLD];
		var index=0;
		for ( var i : int = 0; i <= Constant.ResourceType.CARMOT; ++i )
		{
			if(i==5 || i==6) continue;
			r[index] =  Resource.instance().getCountForType(resourceType[index], m_cityId);
			index++;
		}
			
		return r;
	}
	
	private function priv_subOwnerResource(r : long[])
	{
		var res : Resource = Resource.instance();
		var resourceType : int[] = [Constant.ResourceType.FOOD, Constant.ResourceType.IRON, Constant.ResourceType.STONE, Constant.ResourceType.CARMOT,Constant.ResourceType.LUMBER, Constant.ResourceType.GOLD];
		for ( var i : int = 0; i != resourceType.Length; ++i )
			res.addToSeed(resourceType[i], -r[i], m_cityId);
	}

	private function priv_fillOwnerResource() : void
	{
		var res : long[] = priv_getOwnerResource();
		var resourceType : int[] = [Constant.ResourceType.FOOD, Constant.ResourceType.IRON, Constant.ResourceType.STONE, Constant.ResourceType.LUMBER, Constant.ResourceType.GOLD];
		for ( var i : int = 0; i != res.Length; ++i )
			m_resourceOwner[i].txt =  _Global.NumSimlify(res[i]);
	}
	
	private function priv_calcCurNeedHealCount() : int
	{
		var totalHeal : int = 0;
		for ( var dat : HealWoundedInfo in m_woundedHealList )
			totalHeal += dat.troopHealCount;
		return totalHeal;
	}
	
	private function priv_getWoundedList() : System.Collections.Generic.List.<System.Collections.Generic.KeyValuePair.<int, int> >
	{
		var wounded : System.Collections.Generic.List.<System.Collections.Generic.KeyValuePair.<int, int> > = new System.Collections.Generic.List.<System.Collections.Generic.KeyValuePair.<int, int> >();
		for ( var healWoundInfo : HealWoundedInfo in m_woundedHealList )
		{
			if ( healWoundInfo.troopHealCount <= 0 )
				continue;
			wounded.Add(new System.Collections.Generic.KeyValuePair.<int, int>(healWoundInfo.troopId, healWoundInfo.troopHealCount));
		}
		return wounded;
	}
	
	private function priv_directHeal() : void
	{
		if ( !priv_checkIsCanHeal() )
			return;
		var queueList : System.Collections.Generic.List.<HealQueue.HealQueueItem> = HealQueue.instance().GetQueueByCityId(m_cityId);
		if ( queueList == null || queueList.Count == 0 )
		{
			priv_clickHeal();
			return;
		}
		var healQueueItem : HealQueue.HealQueueItem = queueList[0];

		var costTime : int = healQueueItem.timeRemaining;
		var speedUp : SpeedUp = SpeedUp.instance();
		var gemsCost : int = speedUp.getTotalGemCost(costTime);

		var msg : String = Datas.getArString("HealModal.QueueFull");
		var biType : int = Constant.BIType.INSTANT_HEAL;
		Utility.instance().InstantFinishEvent(costTime, gemsCost, msg, biType
			, function(directBuyFlag : int, curPrice : int, paymentDat : Payment.PaymentElement)
			{
				var wounded : System.Collections.Generic.List.<System.Collections.Generic.KeyValuePair.<int, int> >
					= this.priv_getWoundedList();
				var itemList : String = speedUp.getItemListString(costTime);
				m_isNeedCreateNewHealQueue = true;
				speedUp.useInstantSpeedUp(SpeedUp.PLAYER_ACTION_HEAL, gemsCost, itemList, healQueueItem.id, m_cityId);
			});
	}

	private function priv_clickHeal() : void
	{
		if ( !priv_checkIsCanHeal() )
			return;
		var wounded : System.Collections.Generic.List.<System.Collections.Generic.KeyValuePair.<int, int> >
			= this.priv_getWoundedList();

		var okFunc : function(HashObject) = function(dat : HashObject)
		{
			if ( dat["ok"].Value != true )
				return;

			var costRes : long[] = this.priv_getCostResource();
			var startTime : long = _Global.INT64(dat["startTime"]);
			var endTime : long = _Global.INT64(dat["endTime"]);
			var queueId : int = _Global.INT32(dat["queueId"]);
			HealQueue.instance().AddQueue(queueId, m_cityId, startTime, endTime, wounded);
			this.priv_doHealOK(wounded);
		};
		UnityNet.reqDoHeal(m_cityId, 0, false, null, wounded, okFunc);
	}

	private function priv_clickInstantHeal() : void
	{
		if ( !priv_checkIsCanHeal() )
			return;
		if ( Payment.instance().Gems < m_calcedCacheGemsCost )
		{
			MenuMgr.getInstance().PushPaymentMenu();
			return;
		}

		var wounded : System.Collections.Generic.List.<System.Collections.Generic.KeyValuePair.<int, int> >
			= this.priv_getWoundedList();

		var okFunc : function(HashObject) = function(dat : HashObject)
		{
			if ( dat["ok"].Value != true )
				return;

			Payment.instance().SubtractGems(m_calcedCacheGemsCost);
            DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.Healing, wounded);
			this.priv_doHealOK(wounded);
		};
		var costTime : int = this.priv_getCostTime();
		var itemList : String = SpeedUp.instance().getItemListString(costTime);
		
		var okCostGemsFunc:Function = function()
		{
			UnityNet.reqDoHeal(m_cityId, m_calcedCacheGemsCost, false, itemList, wounded, okFunc);		
		};
		
		var open : boolean = SpeedUp.instance().GetSpeedUpIsOpenHint();
		if(m_calcedCacheGemsCost >= GameMain.instance().gemsMaxCost() && !open)
		{
			var contentData : Hashtable = new Hashtable(
			{
				"price":m_calcedCacheGemsCost
			});
            MenuMgr.getInstance().PushMenu("SpeedUpDialog", contentData , "trans_zoomComp"); 
			MenuMgr.getInstance().getMenuAndCall("SpeedUpDialog", function(menu : KBNMenu) {
				var SpeedUpDialogmenu:SpeedUpDialog = menu as SpeedUpDialog;
				if(SpeedUpDialogmenu != null)
			   {
				SpeedUpDialogmenu.setAction(okCostGemsFunc);
			   }
			});
		}
		else
		{
			okCostGemsFunc();
		}
	}

	public static function OnSpeedupOK() : void
	{
		var menuMgr : MenuMgr = MenuMgr.getInstance();
		var hospitalMenu : HospitalMenu = menuMgr.getMenu("HospitalMenu");
		if ( hospitalMenu != null )
			hospitalMenu.InitTrainItem();
		var hospitalHealPopMenu : HospitalHealPopMenu = menuMgr.getMenu("HospitalHealPopMenu");
		if ( hospitalHealPopMenu == null || !hospitalHealPopMenu.m_isNeedCreateNewHealQueue )
			return;
		hospitalHealPopMenu.m_isNeedCreateNewHealQueue = false;
		hospitalHealPopMenu.priv_clickHeal();
	}

	private function priv_checkIsCanHeal() : boolean
	{
		if ( m_needHealCount == 0 )
			return false;
		// test max count is ok.
		var totalHeal : int = HospitalMenu.GetAllWorkSlotCountForHeal(m_cityId) - HealQueue.instance().GetTotalInHealCountInCity(m_cityId);
		if ( m_needHealCount <= totalHeal )
			return true;

		var msg : String = Datas.getArString("Error.Overlimit");
		var errorMgr : ErrorMgr = ErrorMgr.instance();
		errorMgr.PushError(null, msg, true);
		return false;
	}

	public function handleNotification(type:String, body:Object):void
	{
		if ( type == Constant.Notice.SPEEDUP_ITEMS_UPDATED || type == Constant.Notice.HEAL_COMPLETED )
		{
			this.priv_updateHealInfo();
			return;
		}
		
		//if ( type == Constant.Notice.PREVIOUS_PROGRESS_COMPLETE && m_isNeedCreateNewHealQueue )
		//{
		//	m_isNeedCreateNewHealQueue = false;
		//	this.priv_clickHeal();
		//	return;
		//}
	}

	private function priv_updateHealInfo() : void
	{
		var cost : long[] = this.priv_getCostResource();
		var resOwner : long[] = priv_getOwnerResource();
		m_calcedCacheIsHaveEnoughResource = true;
		for ( var idx : int = 0; idx != cost.Length; ++idx )
		{
			m_resourceCost[idx].txt = _Global.NumSimlify(cost[idx]);
			if ( cost[idx] <= resOwner[idx] )
			{
				m_resourceCost[idx].SetNormalTxtColor(FontColor.Milk_White);
			}
			else
			{
				m_resourceCost[idx].SetNormalTxtColor(FontColor.Red);
				m_calcedCacheIsHaveEnoughResource = false;
			}
		}

		var amountHeal : int = HospitalMenu.GetAllWorkSlotCountForHeal(m_cityId);
		amountHeal -= HealQueue.instance().GetTotalInHealCountInCity(m_cityId);
		var strFmt : String;
		m_needHealCount = priv_calcCurNeedHealCount();
		if ( m_needHealCount <= amountHeal )
			strFmt = "<color=#9a6431>{0}/{1}</color>";
		else
			strFmt = "<color=red>{0}</color><color=#9a6431>/{1}</color>";
		m_healCount.txt = String.Format(strFmt, m_needHealCount.ToString(), amountHeal.ToString());
		m_healTime.txt = _Global.timeFormatStr(this.priv_getCostTime());

		if ( m_needHealCount == 0 )
			m_btnInstantHeal.changeToGreyNew();
		else
			m_btnInstantHeal.changeToGreenNew();

		if ( m_needHealCount != 0 && m_calcedCacheIsHaveEnoughResource )
		{
			m_btnHeal.changeToBlueNew();
			if ( HealQueue.instance().GetQueueByCityId(m_cityId).Count == 0 )
				m_btnHeal.OnClick = priv_clickHeal;
			else
				m_btnHeal.OnClick = priv_directHeal;
		}
		else
		{
			m_btnHeal.changeToGreyNew();
		}

		m_calcedCacheGemsCost = priv_calcCostGems();
		m_healGems.txt = m_calcedCacheGemsCost.ToString();
	}

	private function priv_doHealOK(wounded : System.Collections.Generic.List.<System.Collections.Generic.KeyValuePair.<int, int> >)
	{
		HospitalMenu.DoneHealOK(m_cityId, wounded);
		MenuMgr.getInstance().sendNotification(Constant.Notice.HOSPITAL_DATA_CHANGED, null);
		if ( m_calcedCacheIsHaveEnoughResource )
		{
			var cost : long[] = this.priv_getCostResource();
			priv_subOwnerResource(cost);
		}
		this.close();
	}
}
