import System.Collections;
import System.Collections.Generic;
public class HeroRelic extends ComposedMenu implements IEventHandler, ITouchable
{
	private enum HeroRelicState
	{
		MainType,
		EquipType,
		UpgradeType
	}

	@SerializeField
	private var heroName : Label;
	@SerializeField
	private var headBack : Label;
	@SerializeField
	private var head : Label;
    @SerializeField
	private var headAlpha : Label;
    @SerializeField
	private var frame : Label;
	@SerializeField
	private var level : Label;
	@SerializeField
	private var attack : Label;
	@SerializeField
	private var health : Label;
	@SerializeField
	private var load : Label;
	@SerializeField
	private var heroRelicItems : List.<HeroRelicItem> = new List.<HeroRelicItem>();
    
	private var heroInfo : KBN.HeroInfo = null;

	private var heroRelicState : HeroRelicState = HeroRelicState.MainType;
	//Equip
	public var relicEquipBack : Label;
	public var equipBtn : Button;
	public var unloadBtn : Button;
	public var relicEquipBackArrow : Label;
	@SerializeField
	private var equipBackArrowRextYs : List.<int> = new List.<int>();

	public var nameAndLevelLeft : Label;
	public var mainTitleLeft : Label;
	public var mainValueLeft : Label;
	public var deputyTitleLeft : Label;
	public var deputyValue1Left : Label;
	public var deputyValue2Left : Label;
	public var deputyValue3Left : Label;

	public var nameAndLevelRight : Label;
	public var mainTitleRight : Label;
	public var mainValueRight : Label;
	public var deputyTitleRight : Label;
	public var deputyValue1Right : Label;
	public var deputyValue2Right : Label;
	public var deputyValue3Right : Label;

	public var equipArrow : Label;
	public var equipLineLeft : Label;
	public var equipLineRight : Label;

	public var relicScrollList  : ScrollList;
	public var heroSimpleRelicItem : HeroSimpleRelicItem;
	public var selectEquipRelicId : int = 0; // 选择圣物列表的id
	public var selectBodyRelicId : int = 0;  // 身上穿的圣物id
	public var slot : int = 0; 


	public var relicSetBack : Label;
	public var relicSetTitle : Label;
	public var relicSetOne : Label;
	public var relicSetTwo : Label;
	public var relicSetButton : Button;

	public var needClearRelicScrollList : boolean = true;

	@SerializeField private var bgLabel : Label;

	@SerializeField private var arrow : Label;
 
	@SerializeField private var bg : Label;

	public function Init() : void
 	{
         super.Init();
		 
		 relicScrollList.Init(heroSimpleRelicItem);
		 relicScrollList.itemDelegate = this;

		 heroRelicState = HeroRelicState.MainType;
         menuHead.setTitle(Datas.getArString("HeroHouse.Relic_Title"));
		 menuHead.backTile.rect = Rect(0, 0, 640, 140);
		menuHead.leftHandler = GoBackMenu;
 		
 		setDefautlFrame = true;
 		frameTop.rect = Rect(0, 70, frameTop.rect.width, frameTop.rect.height);

 		frame.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_heroframe1");
 		level.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_lvframe");
 		attack.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_attack");
 		health.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_health");
		 load.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_load");
		 
		 for(var i : int = 0; i < heroRelicItems.Count; i++)
		{
			heroRelicItems[i].Init();
			heroRelicItems[i].rect.y = 350 + 150 * i;
		}

		relicSetTitle.txt = Datas.getArString("HeroRelicSet.BlessingEffect");

		equipBtn.txt = Datas.getArString("HeroRelic.Change");
		equipBtn.OnClick = OnEquipBtnClick;
		unloadBtn.txt = Datas.getArString("HeroRelic.Unload");
		unloadBtn.OnClick = OnUnloadBtnClick;
		relicSetButton.txt = Datas.getArString("HeroRelicSet.ViewTroopsBtns");
		relicSetButton.OnClick = OnRelicSetBtnClick;

		TipsDown();
	}
 	
 	public function Update() : void
	{
        super.Update();
		menuHead.Update();
		
		if(heroRelicState == HeroRelicState.EquipType)
		{
			relicScrollList.Update();
		}
	}
	
	public function DrawBackground() : void
	{
        menuHead.Draw();
		bgStartY = 70;
		DrawMiddleBg();
		frameTop.Draw();
	}
	
	public function DrawItem() : void
	{
		heroName.Draw();
	    headBack.Draw();
	    head.Draw();

	    frame.Draw();

		level.Draw();
		attack.Draw();
		health.Draw();
		load.Draw();

		relicSetBack.Draw();
		relicSetTitle.Draw();
		relicSetOne.Draw();
		relicSetTwo.Draw();
		relicSetButton.Draw();

		for(var i : int = 0; i < heroRelicItems.Count; i++)
		{
			heroRelicItems[i].Draw();
		}

		if(heroRelicState == HeroRelicState.EquipType)
		{
			relicEquipBack.Draw();
			equipBtn.Draw();
			unloadBtn.Draw();
			relicEquipBackArrow.Draw();

			nameAndLevelLeft.Draw();
			mainTitleLeft.Draw();
			mainValueLeft.Draw();
			deputyTitleLeft.Draw();
			deputyValue1Left.Draw();
			deputyValue2Left.Draw();
			deputyValue3Left.Draw();

			nameAndLevelRight.Draw();
			mainTitleRight.Draw();
			mainValueRight.Draw();
			deputyTitleRight.Draw();
			deputyValue1Right.Draw();
			deputyValue2Right.Draw();
			deputyValue3Right.Draw();

			equipArrow.Draw();
			equipLineLeft.Draw();
			equipLineRight.Draw();

			relicScrollList.Draw();
		}

		this.arrow.Draw();
		this.bg.Draw();
		this.bgLabel.Draw();

		if(Event.current!=null&& Event.current.type == EventType.MouseDown){   
			TipsDown();
		}
	}

	public function OnPush(param : Object) : void
	{
		super.OnPush(param);
		
		heroRelicState = HeroRelicState.MainType;
	    var paramTable : Hashtable = param as Hashtable;
	    heroInfo = paramTable["hero"] as KBN.HeroInfo;
		headBack.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.HeadBack);
		head.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.Head);
		heroInfo.CalculateRelicSet();
		
		RefreshHeroDetail();

		RefreshHeroRelic();
		needClearRelicScrollList = true;
		TipsDown();
	}

	public function RefreshHeroRelic()
	{
		heroInfo = KBN.HeroManager.Instance.GetHeroInfo(heroInfo.Id);
		for(var i : int = 0; i < this.heroRelicItems.Count; i++)
		{
			//heroRelicItems[i].SetData(KBN.HeroRelicManager.instance().heroRelicList[1]);
			if(heroInfo.Relic[i] != 0)
			{
				var relicInfo : KBN.HeroRelicInfo = KBN.HeroRelicManager.instance().GetHeroRelicInfo(heroInfo.Relic[i]);
				if(relicInfo != null)
				{
					heroRelicItems[i].SetData(relicInfo, i);
				}
			}
			else
			{
				heroRelicItems[i].SetNoData(i);
			}
		}
	}
	
	public function OnPushOver() : void
	{
		super.OnPushOver();
		KBN.HeroRelicManager.instance().SetAllHeroRelicNoSelect();
	}

	public function OnPop() : void
	{
		super.OnPop();
	}

	public function OnPopOver() : void
	{
        TryDestroy(menuHead);
		menuHead = null;
		relicScrollList.Clear();
		super.OnPopOver();
	}

	public function setEquipLeftData(relicInfo : KBN.HeroRelicInfo)
	{
		nameAndLevelLeft.txt = String.Empty;
		mainTitleLeft.txt = String.Empty;
		mainValueLeft.txt = String.Empty;
		deputyTitleLeft.txt = String.Empty;
		deputyValue1Left.txt = String.Empty;
		deputyValue2Left.txt = String.Empty;
		deputyValue3Left.txt = String.Empty;

		if(relicInfo == null)
		{
			return;
		}

        nameAndLevelLeft.txt = relicInfo.RelicName + "  " + "Lv " + relicInfo.Level.ToString();

		mainTitleLeft.txt = Datas.getArString("HeroRelic.MainValue");
		mainValueLeft.txt = relicInfo.MainSkillDesc;
		if(relicInfo.LockSkill == 0)
		{
			deputyTitleLeft.txt = String.Empty;
			deputyValue1Left.txt = String.Empty;
			deputyValue2Left.txt = String.Empty;
			deputyValue3Left.txt = String.Empty;
		}
		else
		{
			deputyTitleLeft.txt = Datas.getArString("HeroRelic.DeputyValue");
			if(relicInfo.DeputySkill1 != 0)
			{        
				deputyValue1Left.txt = relicInfo.DeputySkill1Desc;
			}

			if(relicInfo.DeputySkill2 != 0)
			{
				deputyValue2Left.txt = relicInfo.DeputySkill2Desc;
			}
			
			if(relicInfo.DeputySkill3 != 0)
			{
				deputyValue3Left.txt = relicInfo.DeputySkill3Desc;
			}  
		}		
	}

	public function setEquipRightData(relicInfo : KBN.HeroRelicInfo)
	{
		nameAndLevelRight.txt = String.Empty;
		mainTitleRight.txt = String.Empty;
		mainValueRight.txt = String.Empty;
		deputyTitleRight.txt = String.Empty;
		deputyValue1Right.txt = String.Empty;
		deputyValue2Right.txt = String.Empty;
		deputyValue3Right.txt = String.Empty;

		if(relicInfo == null)
		{
			return;
		}

        nameAndLevelRight.txt = relicInfo.RelicName + "  " + "Lv " + relicInfo.Level.ToString();

		mainTitleRight.txt = Datas.getArString("HeroRelic.MainValue");
		mainValueRight.txt = relicInfo.MainSkillDesc;
		if(relicInfo.LockSkill == 0)
		{
			deputyTitleRight.txt = String.Empty;
			deputyValue1Right.txt = String.Empty;
			deputyValue2Right.txt = String.Empty;
			deputyValue3Right.txt = String.Empty;
		}
		else
		{
			deputyTitleRight.txt = Datas.getArString("HeroRelic.DeputyValue");
			if(relicInfo.DeputySkill1 != 0)
			{        
				deputyValue1Right.txt = relicInfo.DeputySkill1Desc;
			}

			if(relicInfo.DeputySkill2 != 0)
			{
				deputyValue2Right.txt = relicInfo.DeputySkill2Desc;
			}
			
			if(relicInfo.DeputySkill3 != 0)
			{
				deputyValue3Right.txt = relicInfo.DeputySkill3Desc;
			}  
		}
	}

	public function RefreshHeroRelicItemSelect() : void
	{
		for(var i : int = 0; i < heroRelicItems.Count; i++)
		{
			heroRelicItems[i].Refresh();
		}

		selectEquipRelicId = 0;
		selectBodyRelicId = 0;
	}

	public function RefreshButtonState() : void
	{
		if(selectBodyRelicId != 0)
		{
			unloadBtn.SetDisabled(false);
			unloadBtn.changeToBlueNew();
		}
		else
		{
			unloadBtn.SetDisabled(true);
			unloadBtn.changeToGreyNew();
		}

		if(selectEquipRelicId != 0)
		{
			equipBtn.SetDisabled(false);
			equipBtn.changeToBlueNew();
		}
		else
		{
			equipBtn.SetDisabled(true);
			equipBtn.changeToGreyNew();
		}
	}

	public function handleNotification(type : String, param : Object) : void
    {
        switch (type)
	    {
	        case Constant.HeroRelic.RelicEquipDisplay:
				slot = _Global.INT32(param);
				if(heroInfo.Relic[slot] != 0)
				{
					var relicInfo : KBN.HeroRelicInfo = KBN.HeroRelicManager.instance().GetHeroRelicInfo(heroInfo.Relic[slot]);
					if(relicInfo != null)
					{
						selectBodyRelicId = relicInfo.RelicId;
						setEquipLeftData(relicInfo);
					}
				}
				else
				{
					selectBodyRelicId = 0;
					setEquipLeftData(null);
				}
				setEquipRightData(null);			
				relicEquipBackArrow.rect.y = equipBackArrowRextYs[slot];
				for(var i : int = 0; i < heroRelicItems.Count; i++)
				{
					heroRelicItems[i].SetEquipState(false);
				}
				UpdateRelicList();
				RefreshButtonState();
				needClearRelicScrollList = false;
				KBN.HeroRelicManager.instance().SetAllHeroRelicNoSelect();
				SetSimpleRelicItemSelect(0);
				heroRelicState = HeroRelicState.EquipType;
				TipsDown();
	            break;
            case Constant.HeroRelic.RelicEquipHide:
				RefreshHeroRelic();
				//RefreshHeroRelicItemSelect();
				RefreshButtonState();
				//needClearRelicScrollList = true;
				KBN.HeroRelicManager.instance().SetAllHeroRelicNoSelect();
				SetSimpleRelicItemSelect(0);
				heroRelicState = HeroRelicState.MainType;
				TipsDown();
	            break;
            case Constant.HeroRelic.RelicEquipSuccess:
				RefreshHeroRelicItemSelect();
				RefreshHeroDetail();
				RefreshHeroRelic();
				RefreshButtonState();
				needClearRelicScrollList = true;
				heroRelicState = HeroRelicState.MainType;
            	break;
            case Constant.HeroRelic.RelicEquipRefresh:
				var curClickSlot = _Global.INT32(param);
				if(curClickSlot != slot)
				{
					RefreshHeroRelicItemSelect();
				}	
				RefreshButtonState();			
          	  	break;
			case Constant.HeroRelic.RelicUpgradeSuccess:
				RefreshHeroDetail();
				RefreshHeroRelic();
				needClearRelicScrollList = true;
				break;
	    }
	}

	private function OnEquipBtnClick(param : Object)
	{
		TipsDown();
		KBN.HeroRelicManager.instance().EquipAndReplaceHeroRelic(selectEquipRelicId, heroInfo.Id, slot);
	}

	private function OnUnloadBtnClick(param : Object)
	{
		TipsDown();
		KBN.HeroRelicManager.instance().RemoveHeroRelic(selectBodyRelicId, heroInfo.Id, slot);
	}

	public var bgOffset : int = 0;
	private function OnRelicSetBtnClick(param : Object)
	{
		var msg : String = heroInfo.GetAllDeputySkillInfo();
		this.bgLabel.txt = msg;
	
		var bgLabelHeight = 18 * heroInfo.AllDeputySkillCount;
		// var min:float = 0f;
		// var max:float = 0f;
		// this.bgLabel.mystyle.CalcMinMaxWidth(GUIContent(this.bgLabel.txt), min, max);
		this.bg.rect.height = bgLabelHeight + bgOffset;
		this.bg.SetVisible(true);
		this.arrow.SetVisible(true);
		this.bgLabel.SetVisible(true);
	}

	private function TipsDown()
	{
		this.bg.SetVisible(false);
		this.arrow.SetVisible(false);
		this.bgLabel.SetVisible(false);
	}
	
	private function GoBackMenu() : void
	{
        menuHead.setTitle(Datas.getArString("HeroHouse.Detail_Title"));
        MenuMgr.getInstance().PopMenu("HeroRelic");
	}

	private function UpdateLevelFrame()
	{
	    if(heroInfo != null)
	    {
		    if(heroInfo.Elevate == 0)
		    {
		    	 level.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_lvframe");
		    }
		   	else
		   	{
		   		level.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_lvframe" + heroInfo.Elevate);
		   	}
	   }
	}

	private function RefreshHeroDetail() : void
    {
	    heroName.txt = heroInfo.Name;
	    level.txt = heroInfo.Level.ToString();
	    attack.txt = heroInfo.Attack.ToString();
	    health.txt = heroInfo.Health.ToString();
		load.txt = heroInfo.Load.ToString();
		UpdateLevelFrame();	
		
		relicSetOne.txt = String.Empty;
		relicSetTwo.txt = String.Empty;
		var twoBonus : String = "RelicSet.TwoBonus_";
		var fourBonus : String = "RelicSet.FourBonus_";
		switch(heroInfo.RelicSet.setType)
		{
			case KBN.RelicSetType.One_Foue_Effect:
				relicSetOne.txt = String.Format(Datas.getArString(twoBonus + heroInfo.RelicSet.OneSetId.ToString()), heroInfo.RelicSet.OneSetValue);
				relicSetTwo.txt = String.Format(Datas.getArString(fourBonus + heroInfo.RelicSet.TwoSetId.ToString()), heroInfo.RelicSet.TwoSetValue);
				break;
			case KBN.RelicSetType.One_Two_Effect:
				relicSetTwo.txt = String.Format(Datas.getArString(twoBonus + heroInfo.RelicSet.OneSetId.ToString()), heroInfo.RelicSet.OneSetValue);
				break;
			case KBN.RelicSetType.Two_Two_Effect:
				relicSetOne.txt = String.Format(Datas.getArString(twoBonus + heroInfo.RelicSet.OneSetId.ToString()), heroInfo.RelicSet.OneSetValue);
				relicSetTwo.txt = String.Format(Datas.getArString(twoBonus + heroInfo.RelicSet.TwoSetId.ToString()), heroInfo.RelicSet.TwoSetValue);
				break;
			case KBN.RelicSetType.None:
				relicSetTwo.txt = Datas.getArString("HeroRelic.NoneSet");
				break;
		}
	}

	private function UpdateRelicList() {		
		selectEquipRelicId = 0;
		
		if(needClearRelicScrollList)
		{
			var list : List.<KBN.HeroRelicInfo> = KBN.HeroRelicManager.instance().GetEquipRelics();
			relicScrollList.Clear();
			relicScrollList.ClearData();
			relicScrollList.updateable = false;
			relicScrollList.SetData(list);
			relicScrollList.updateable = true;
			SetSimpleRelicItemSelect(0);
		}
		
		relicScrollList.MoveToTop();
		relicScrollList.ResetPos();
		KBN.HeroRelicManager.instance().simpleRelicItemType = KBN.SimpleRelicItemType.EquipType;
	}

	// private function SetSimpleRelicEquipType()
	// {
	// 	relicScrollList.ForEachItem( function ( item : ListItem ) : boolean {
	// 		var simpleRelicItem : HeroSimpleRelicItem = item as HeroSimpleRelicItem;
	// 		if (null == simpleRelicItem)
	// 			return true;
	// 		simpleRelicItem.SetSimpleRelicEquipType();
	// 		return true;
	// 	} );
	// }
	
	private function SetSimpleRelicItemSelect(relicId : int) {
		relicScrollList.ForEachItem( function ( item : ListItem ) : boolean {
			var simpleRelicItem : HeroSimpleRelicItem = item as HeroSimpleRelicItem;
			if (null == simpleRelicItem)
				return true;
			simpleRelicItem.RelicSelect = (simpleRelicItem.GetHeroRelicInfo().RelicId == relicId);
			return true;
		} );
	}
	
	public function handleItemAction(action:String,param:Object):void
	{	
		switch(action)
		{
			case Constant.HeroRelic.RelicEquipSelect:
				var simpleRelicItem : HeroSimpleRelicItem = param as HeroSimpleRelicItem;
				if(simpleRelicItem == null)
					return;
				var tempRelicInfo : KBN.HeroRelicInfo = simpleRelicItem.GetHeroRelicInfo();
				selectEquipRelicId = tempRelicInfo.RelicId;
				SetSimpleRelicItemSelect(selectEquipRelicId);
				setEquipRightData(tempRelicInfo);

				RefreshButtonState();
				KBN.HeroRelicManager.instance().SetAllHeroRelicNoSelect();
                KBN.HeroRelicManager.instance().SetHeroRelicSelectState(selectEquipRelicId, true);
			break;
		}
	}
}
