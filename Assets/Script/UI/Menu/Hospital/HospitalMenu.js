#pragma strict

public class HospitalMenu extends KBNMenu// implements IEventHandler
{
	public static var TAB_BUILD:String = "build";
	public static var TAB_TECHNOLOGY : String = "technology";

	public var clone_menuHead : MenuHead;
	public var toolBar :ToolBar;
	public var clone_content  : StandardBuildingContent;
	public var trainItem:TrainItem;
	private var info:Barracks.TrainInfo;
	public class WoundedInfo extends TroopListItem.DisplayData
	{
		public function WoundedInfo(){}
		public function WoundedInfo(id : int, cnt : int)
		{
            super(id, cnt);
		}
		public function WoundedInfo(o : WoundedInfo)
		{
			this(o.troopId, o.troopCount);
		}
	}

	private var buildingContent : StandardBuildingContent;
	private var menuHead : MenuHead;

	private var buildInfo : Building.BuildingInfo;

	protected var selectedIndex:int = 0;
	public static var gm_startPageIndex : int = -1;

    // Empty
    @SerializeField
    private var m_lbEmpty : Label;

    // Non-empty
	@SerializeField
	private var m_lbCapacity : Label;
	@SerializeField
	private var m_lbBottom : Label;
	@SerializeField
	private var m_btnHeal : Button;
	@SerializeField
	private var m_btnDismiss : Button;
	@SerializeField
	private var m_slWounded : ScrollList;
	@SerializeField
	private var m_woundedItem : HospitalWoundedItem;

	private var m_speedRect;
	private var m_noSpeedRect;

	public function Init()
	{
		super.Init();
		menuHead = GameObject.Instantiate(clone_menuHead);
		buildingContent = Instantiate(clone_content);
		buildingContent.Init();

		menuHead.Init();
		menuHead.SetVisible(true);	
		toolBar.Init();
		toolBar.ToMainTabTexture();
		toolBar.toolbarStrings = [Datas.getArString("Common.Details"), Datas.getArString("Hospital.BuildingTabname") ]; //["Detail","Technology"];
		priv_changeHealthCount();
		var texMgr : TextureMgr = TextureMgr.instance();
		var spt : TileSprite = texMgr.BackgroundSpt();
		m_lbBottom.mystyle.normal.background = texMgr.LoadTexture("tool bar_bottom", TextureType.BACKGROUND);
		m_lbBottom.rect.height = m_lbBottom.mystyle.normal.background.height;
		m_lbBottom.rect.y = MenuMgr.SCREEN_HEIGHT - m_lbBottom.rect.height;
		m_lbBottom.useTile = false;

		m_btnHeal.changeToGreyNew();
		m_btnHeal.txt = Datas.getArString("Hospital.Healbutton");
		m_btnHeal.OnClick = function()
		{
			var menuMgr : MenuMgr = MenuMgr.getInstance();
			menuMgr.PushMenu("HospitalHealPopMenu", this.GetWoundedInHospital(), "trans_zoomComp");
		};
		m_btnDismiss.changeToGreyNew();
		m_btnDismiss.txt = Datas.getArString("Hospital.Dismiss_Button");
		m_btnDismiss.OnClick = function()
		{
			var menuMgr : MenuMgr = MenuMgr.getInstance();
			menuMgr.PushMenu("HospitalDismissPopMenu", this.GetWoundedInHospital(), "trans_zoomComp");
		};
		m_slWounded.Init(m_woundedItem);
		priv_InitTrainItem();
        m_lbEmpty.mystyle.normal.background = texMgr.LoadTexture("square_black", TextureType.DECORATION);
        m_lbEmpty.txt = Datas.getArString("Hospital.NoTroops");
        SetTrainItemVisible(false);
	}

	public function InitTrainItem()
	{
		priv_InitTrainItem();
	}

	private function priv_InitTrainItem()
	{
		trainItem.seperateLine.SetVisible(false);
		trainItem.btnCancel.SetVisible(false);
		trainItem.icon.SetVisible(false);
		trainItem.Init();
		trainItem.btnSelect.OnClick = SpeedUp;
		info = null;
		
		m_speedRect = new Rect(40,270,560,540);
		m_noSpeedRect = new Rect(40,144,560,661);
		
	}
	function SpeedUp(param:Object)
	{
		var queue:System.Collections.Generic.List.<HealQueue.HealQueueItem> = HealQueue.instance().Queue();
		if(queue.Count <= 0) return;
		var item:HealQueue.HealQueueItem = queue[0];
		MenuMgr.getInstance().PushMenu("SpeedUpMenu",item, "trans_zoomComp");
	}

	
	private function SetTrainItemVisible(isVisible:boolean)
	{
        if (IsTrainItemVisible != isVisible)
        {
            if (isVisible)
            {
                m_slWounded.rect = m_speedRect;
            }
            else
            {
                m_slWounded.rect = m_noSpeedRect;
            }
            
            m_slWounded.AutoLayout();
        }
    
		trainItem.progress.SetVisible(isVisible);
		trainItem.title.SetVisible(isVisible);
		trainItem.owned.SetVisible(isVisible);
		trainItem.btnSelect.SetVisible(isVisible);
		trainItem.leftTime.SetVisible(isVisible);
	}
    
    private function get IsTrainItemVisible() : boolean
    {
        return trainItem.progress.isVisible();
    }

	public function DrawItem():void	
	{
		switch(selectedIndex)
		{
			case 0:
				buildingContent.Draw();
				break;
			case 1:
				m_lbBottom.Draw();
				m_lbCapacity.Draw();
				m_btnHeal.Draw();
				m_btnDismiss.Draw();
				
//				trainItem.owned.rect.x = trainItem.title.GetWidth() - 250 + trainItem.title.rect.x;
				trainItem.Draw();
				m_slWounded.Draw();
                if (m_slWounded.GetDataLength() <= 0 && HealQueue.instance().IsHaveEmptySlotByHeal) {
                    m_lbEmpty.Draw();
                }
				break;
		}
	}

	public function DrawTitle():void
	{
		menuHead.Draw();
		selectedIndex = toolBar.Draw();
	}
	function Update()
	{
		menuHead.Update();
		if(trainItem != null)
		{	
			
			trainItem.Update();
			
			var queue:System.Collections.Generic.List.<HealQueue.HealQueueItem> = HealQueue.instance().Queue();		
			if(queue.Count > 0)
			{
				SetTrainItemVisible(true);
				var item:HealQueue.HealQueueItem = queue[0];
				if(item != null)
				{
					if(info == null)
					{
						info = new Barracks.TrainInfo();
						info.startTime = item.startTime;
						info.timeRemaining = item.timeRemaining;
						info.needed = item.needed;
						info.startTime = item.startTime;
						info.endTime = item.endTime;
						info.classType = QueueType.HealQueue;
						info.id = item.id;
						trainItem.progress.Init(info,0.0f,info.needed);
						trainItem.SetTrainInfo(info);

						trainItem.owned.txt = item.m_totalUnit.ToString();
						trainItem.title.txt = Datas.getArString("Hospital.Subtitle_1");
//						trainItem.owned.rect.x = trainItem.title.GetWidth() - 250 + trainItem.title.rect.x;
					}
					else
					{
						info.timeRemaining = item.timeRemaining;
					}
				}
			}
			else
			{
				SetTrainItemVisible(false);
				info = null;
			}
		}
		if(selectedIndex == 0)
		{
			buildingContent.Update();
		}
		else
		{
			m_slWounded.Update();
		}
	}
	
	public function OnPush(param:Object):void
	{
		super.OnPush(param);
		buildInfo = param as Building.BuildingInfo;
		
		menuHead.rect.height = Constant.UIRect.MENUHEAD_H2;
		this.buildingContent.rect.y = menuHead.rect.height;

		if ( gm_startPageIndex < 0 )
			toolBar.selectedIndex = 0;
		else
			toolBar.selectedIndex = gm_startPageIndex;
		gm_startPageIndex = -1;

		this.UpdateData(param);
		var woundedDat : System.Collections.Generic.List.<WoundedInfo> = GetWoundedInHospital();
		if ( woundedDat.Count != 0 )
			m_btnHeal.changeToBlueNew();
			
		m_btnDismiss.changeToRedNew();
			
		m_slWounded.SetData(woundedDat.ToArray());
		SoundMgr.instance().PlayOpenBuildMenu(buildInfo.typeId);
		
	}
	
	public function OnPopOver()
	{
		m_slWounded.Clear();
		buildingContent.Clear();
		TryDestroy(buildingContent);
		buildingContent = null;
		TryDestroy(menuHead);
		menuHead = null;
	}

	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.BUILDING_PROGRESS_COMPLETE:
					handleComplete(body as BuildingQueueMgr.QueueElement);
				break;
			case Constant.Notice.HOSPITAL_DATA_CHANGED:
			case Constant.Notice.HEAL_COMPLETED:
				var woundedDat : System.Collections.Generic.List.<WoundedInfo> = GetWoundedInHospital();
				if ( woundedDat.Count != 0 )
					m_btnHeal.changeToBlueNew();
				m_slWounded.SetData(woundedDat.ToArray());
				priv_changeHealthCount();
				break;
		}
	}
	
	protected function handleComplete(qItem:BuildingQueueMgr.QueueElement):void
	{
		if(null == buildInfo || null == qItem  )
		{
			return;
		}
		
		if(qItem.level == 0 && qItem.slotId == buildInfo.slotId )
		{
			this.close();
		}
		else
		{	
			//
			this.UpdateData(Building.instance().buildingInfo(buildInfo.slotId,buildInfo.typeId) );
		}
	}
	
	public function UpdateData(param:Object):void
	{
		if(param)
		{
			buildInfo = param;
			var prestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(buildInfo.typeId,buildInfo.curLevel);	
			this.menuHead.setTitle(buildInfo.buildName,prestigeData["level"].Value,prestigeData["prestige"].Value);
			buildingContent.UpdateData(param);
		}
	}
	
	protected function buttonHandler(clickParam:String)
	{
		switch(clickParam)
		{
			case TAB_BUILD:
				this.selectedIndex = 0;
				break;
			case TAB_TECHNOLOGY:
				this.selectedIndex = 1;
				break;
		}
	}
	
	function DrawBackground()
	{
		super.DrawBackground();
		frameTop.Draw();
	}

	private function priv_changeHealthCount() : void
	{
		var cap : int = priv_getAllSlotCountForHealth();

		var vipLevel : int = GameMain.instance().GetVipOrBuffLevel();
		var vipDataItem : KBN.DataTable.Vip = GameMain.GdsManager.GetGds.<KBN.GDS_Vip>().GetItemById(vipLevel);
		cap = Mathf.Ceil(cap * (1 + (vipDataItem.HOSPITAL_CAP * 0.01f) + Technology.instance().getIncreaseWoundedSoldiersNum()));

		var woundedDat : System.Collections.Generic.List.<WoundedInfo> = GetWoundedInHospital();
		var totalWounded : int = 0;
		for ( var wdDat : WoundedInfo in woundedDat )
			totalWounded += wdDat.troopCount;
		var hospitalCapacity : String = String.Format(Datas.getArString("Hospital.Capacity"), totalWounded.ToString(), cap.ToString());
		var curCityId:int = GameMain.instance().getCurCityId();
		var healCapacity : int = GetAllWorkSlotCountForHeal(curCityId);
		var healInQueue : int = HealQueue.instance().GetTotalInHealCountInCity(curCityId);
		var healCapacityStr : String = String.Format(Datas.getArString("Hospital.HealingAmount"), healInQueue.ToString(), healCapacity.ToString());
		var resultStr : String = String.Format("{0}\n{1}", hospitalCapacity, healCapacityStr);
		m_lbCapacity.txt = resultStr;
	}
	
	static private function priv_getAllSlotCountForHealth() : int
	{
		var curCityId:int = GameMain.instance().getCurCityId();
		return priv_getAllSlotCountForHealthInCity(curCityId);
	}

	static private function priv_getAllSlotCountForHealthInCity(cityId : int)
	{
		var hostpitals : Array = Building.instance().getAllOfType(Constant.Building.HOSPITAL, cityId);
		var levelField : String = _Global.ap + "1";
		var cntForHealth : int = 0;
		var gdsBuilding : GDS_Building = GameMain.GdsManager.GetGds.<GDS_Building>();
		for (var hospital : HashObject in hostpitals)
		{
			var level : int = _Global.INT32(hospital[levelField]);
			cntForHealth += gdsBuilding.getBuildingEffect(Constant.Building.HOSPITAL, level, Constant.BuildingEffectType.EFFECT_TYPE_CURE_UNIT_CAP);
		}
		return cntForHealth;
	}

	
	static private function priv_getAllWorkSlotCountForHeal(cityId : int) : int
	{
		//var curCityId:int = GameMain.instance().getCurCityId();
		var hostpitals : Array = Building.instance().getAllOfType(Constant.Building.HOSPITAL, cityId);
		var levelField : String = _Global.ap + "1";
		var cntForHealth : int = 0;
		var gdsBuilding : GDS_Building = GameMain.GdsManager.GetGds.<GDS_Building>();
		for (var hospital : HashObject in hostpitals)
		{
			var level : int = _Global.INT32(hospital[levelField]);
			cntForHealth += gdsBuilding.getBuildingEffect(Constant.Building.HOSPITAL, level, Constant.BuildingEffectType.EFFECT_TYPE_CURE_UNIT_COUT);
		}
		return cntForHealth * Technology.instance().getIncreasesOnceTreatmentUpperLimit();
	}
	
	static public function GetAllSlotCountForHealth() : int
	{
		return priv_getAllSlotCountForHealth();
	}

	static public function GetAllSlotCountForHealthInCity(cityId : int)
	{
		return priv_getAllSlotCountForHealthInCity(cityId);
	}
	
	static public function GetAllWorkSlotCountForHeal(cityId : int) : int
	{
		return priv_getAllWorkSlotCountForHeal(cityId);
	}
	
	static public function GetWoundedInHospital() : System.Collections.Generic.List.<WoundedInfo>
	{
		var gameMain : GameMain = GameMain.instance();
		var curCityId : int = gameMain.getCurCityId();
		return priv_getWoundedInHospital(curCityId);
	}
	static public function GetHealInHospital() : System.Collections.Generic.List.<WoundedInfo>
	{
		var gameMain : GameMain = GameMain.instance();
		var curCityId : int = gameMain.getCurCityId();
		return priv_getHealInHospital(curCityId);
	}
	static public function GetWoundedInHospital(cityId : int) : System.Collections.Generic.List.<WoundedInfo>
	{
		return priv_getHealInHospital(cityId);
	}
	
	static private function priv_getWoundedInHospital(cityId : int) : System.Collections.Generic.List.<WoundedInfo>
	{
		var woundeds : System.Collections.Generic.List.<WoundedInfo> = new System.Collections.Generic.List.<WoundedInfo>();
		var curCityPerson : HashObject = priv_getHospitalInCity(cityId);
		if ( curCityPerson == null )
			return woundeds;
		var unit : String = "unit";
		for ( var dat : System.Collections.DictionaryEntry in curCityPerson.Table )
		{
			var k : String = dat.Key;
			if ( k.Length < unit.Length || k.Substring(0, unit.Length) != unit )
				continue;
			var cnt : int = _Global.INT32(dat.Value);
			if ( cnt <= 0 )
				continue;
			var idStr : String = k.Substring(unit.Length);
			var id : int = _Global.INT32(idStr);
			var wndInfo : WoundedInfo = new WoundedInfo(id, cnt);
			woundeds.Add(wndInfo);
		}
		woundeds.Sort(function(l : WoundedInfo, r : WoundedInfo) : int
		{
			return l.troopId < r.troopId?-1:1;
		});

		return woundeds;
	}
	static private function priv_getHealInHospital(cityId : int) : System.Collections.Generic.List.<WoundedInfo>
	{
		var woundeds : System.Collections.Generic.List.<WoundedInfo> = new System.Collections.Generic.List.<WoundedInfo>();
		var curCityPerson : HashObject = priv_getHospitalHealInCity(cityId);
		if ( curCityPerson == null )
			return woundeds;
		var unit : String = "unit";
		for ( var dat : System.Collections.DictionaryEntry in curCityPerson.Table )
		{
			var k : String = dat.Key;
			if ( k.Length < unit.Length || k.Substring(0, unit.Length) != unit )
				continue;
			var cnt : int = _Global.INT32(dat.Value);
			if ( cnt <= 0 )
				continue;
			var idStr : String = k.Substring(unit.Length);
			var id : int = _Global.INT32(idStr);
			var wndInfo : WoundedInfo = new WoundedInfo(id, cnt);
			woundeds.Add(wndInfo);
		}
		woundeds.Sort(function(l : WoundedInfo, r : WoundedInfo) : int
		{
			return l.troopId < r.troopId?-1:1;
		});

		return woundeds;
	}
	static public function DoneHealOK(cityId : int, heals : System.Collections.Generic.List.<System.Collections.Generic.KeyValuePair.<int, int> >)
	{
		var curCityPerson : HashObject = priv_getHospitalInCity(cityId);
		if ( curCityPerson == null )
			return;
		var unit : String = "unit";
		for ( var dat : System.Collections.Generic.KeyValuePair.<int, int> in heals )
		{
			var unitDat : HashObject = curCityPerson[unit + dat.Key.ToString()];
			if ( unitDat == null )
				continue;
			unitDat.Value = _Global.INT32(unitDat) - dat.Value;
		}
		BuildingDecMgr.getInstance().checkForHospitalHaveWounded();
		var sndMgr : SoundMgr = SoundMgr.instance();
		sndMgr.PlayEffect("Kbn_heal", /*TextureType.AUDIO*/"Audio/");
	}

	//static public function priv_getHospitalInCurCity() : HashObject
	//{
	//	var gameMain : GameMain = GameMain.instance();
	//	var curCityId : int = gameMain.getCurCityId();
	//	return priv_getHospitalInCity(curCityId);
	//}
	
	static public function priv_getHospitalInCity(cityId : int) : HashObject
	{
		var gameMain : GameMain = GameMain.instance();
		var seed : HashObject = gameMain.getSeed();
		var hospital_data : HashObject = seed["hospital_data"];
		if ( seed["hospital_data"] == null )
			return null;
		return hospital_data["c" + cityId.ToString()];
	}
	static public function priv_getHospitalHealInCity(cityId : int) : HashObject
	{
		var gameMain : GameMain = GameMain.instance();
		var seed : HashObject = gameMain.getSeed();
		var hospital_data : HashObject = seed["hospital_queue"];
		if ( seed["hospital_queue"] == null )
			return null;
		if ( seed["hospital_queue"]["q17"] == null )
			return null;
		return hospital_data["c" + cityId.ToString()]["q17"];
	}
}
