#pragma strict
import System.Collections.Generic;
import System;

// State transition
// - Switch between hide/onhide: Unhiding <-> HidingNoDefense
// - Deploy selective defense: HidingNoDefense -> HidingDeploying -> HidingDefense
// - Rechoose troops: HidingDefense -> HidingDeploying
// - Recall/Dimiss selective defense troops: HidingDefense -> HidingNoDefense
public class CastleDefenseContent extends UIObject
{
    @SerializeField
    private var hideTroopsTitle : SimpleLabel;
    public function get HideTroopsTitle() : SimpleLabel
    {
        return hideTroopsTitle;
    }

    @SerializeField
    private var hideTroopsSwitch : SwitchButton;
    public function get HideTroopsSwitch() : SwitchButton
    {
        return hideTroopsSwitch;
    }

    @SerializeField
    private var gateCoolTimeTip : SimpleLabel;
    public function get GateCoolTimeTip() : SimpleLabel
    {
        return gateCoolTimeTip;
    }

    @SerializeField
    private var hideTroopsTip : SimpleLabel;
    public function get HideTroopsTip() : SimpleLabel
    {
        return hideTroopsTip;
    }

    @SerializeField
    private var splitLine : SimpleLabel;
    public function get SplitLine() : SimpleLabel
    {
        return splitLine;
    }
    
    @SerializeField
    private var hideTroopsDetailTip : SimpleLabel;
    public function get HideTroopsDetailTip() : SimpleLabel
    {
        return hideTroopsDetailTip;
    }

    @SerializeField
    private var bottomView : SimpleLabel;
    public function get BottomView() : SimpleLabel
    {
        return bottomView;
    }

    @SerializeField
    private var spaceBetweenSplitLineAndDetailTip : float = 28;
    
    @SerializeField
    private var spaceBetweenSplitLineAndBelow : float = 15;
    public function get SpaceBetweenSplitLineAndBelow() : float
    {
        return spaceBetweenSplitLineAndBelow;
    }
    
    private var itemToDefendHeight : int = 0;
    public function get ItemToDefendHeight() : int
    {
        return itemToDefendHeight;
    }
    
    @SerializeField
    private var yOffsetForScrollView : float = 75;
    public function get YOffsetForScrollView() : float
    {
        return yOffsetForScrollView;
    }

    private var currentCityId : int = -1;
    public function get CurrentCityId() : int
    {
        return currentCityId;
    }

    @Serializable
    public class DefenseAmountDisplayer
    {
        @SerializeField
        private var descLabel : SimpleLabel;
        public function get DescLabel() : SimpleLabel
        {
            return descLabel;
        }
        
        @SerializeField
        private var icon : SimpleLabel;
        public function get Icon() : SimpleLabel
        {
            return icon;
        }

        @SerializeField
        private var amountLabel : SimpleLabel;
        public function get AmountLabel() : SimpleLabel
        {
            return amountLabel;
        }

        public function Draw() : void
        {
            descLabel.Draw();
            icon.Draw();
            amountLabel.Draw();
        }
        
        public function UpdateData(amount : long, capacity : long)
        {
            amountLabel.txt = String.Format("{0}/{1}", amount, capacity);
        }
    }
    
    @SerializeField
    private var theTrainItem : TrainItem;
    public function get TheTrainItem() : TrainItem
    {
        return theTrainItem;
    }
    
    @SerializeField
    private var theScrollView : ScrollView;
    public function get TheScrollView() : ScrollView
    {
        return theScrollView;
    }
    
    @SerializeField
    private var deployingItemTemplate : TroopListItem;
    public function get DeployingItemTemplate() : TroopListItem
    {
        return deployingItemTemplate;
    }
    
    @SerializeField
    private var itemPairTemplate : TroopListItemPair;
    public function get ItemPairTemplate() : TroopListItemPair
    {
        return itemPairTemplate;
    }
    
    @SerializeField
    private var knightPositionButton : Button;
    public function get KnightPositionButton() : Button
    {
        return knightPositionButton;
    }

    @SerializeField
    private var defenseAmount : DefenseAmountDisplayer;
    public function get DefenseAmount() : DefenseAmountDisplayer
    {
        return defenseAmount;
    }
    
    @SerializeField
    private var chooseTroopsButton : Button;
    public function get ChooseTroopsButton() : Button
    {
        return chooseTroopsButton;
    }
    
    @SerializeField
    private var rechooseTroopsButton : Button;
    public function get RechooseTroopsButton() : Button
    {
        return rechooseTroopsButton;
    }
    
    @SerializeField
    private var dismissTroopsButton : Button;
    public function get DismissTroopsButton() : Button
    {
        return dismissTroopsButton;
    }
    
    @SerializeField
    private var itemToDefend : Item2Defend;
    public function get ItemToDefend() : Item2Defend
    {
        return itemToDefend;
    }
    
    @SerializeField
    private var xOffsetInScrollView : int = 300;
    public function get XOffsetInScrollView() : int
    {
        return xOffsetInScrollView;
    }
    
    @SerializeField
    private var yOffsetInScrollView : int = 150;
    public function get YOffsetInScrollView() : int
    {
        return yOffsetInScrollView;
    }

    private var seed : HashObject;
    public function get Seed() : HashObject
    {
        return seed;
    }

    public enum StateType
    {
        Unhiding,
        HidingNoDefense,
        HidingDeploying,
        HidingDefense
    }
    
    private var currentState : CastleDefenseContentStateBase;
    private var states : Dictionary.<StateType, CastleDefenseContentStateBase>
        = new Dictionary.<StateType, CastleDefenseContentStateBase>();
    
    private var defenseCapacity : long = 0;
    public function get DefenseCapacity() : long
    {
        return defenseCapacity;
    }

    public function Init() : void
    {
        states.Clear();
        states.Add(StateType.Unhiding, new CastleDefenseContentStateUnhiding().Init(this));
        states.Add(StateType.HidingNoDefense, new CastleDefenseContentStateHidingNoDefense().Init(this));
        states.Add(StateType.HidingDeploying, new CastleDefenseContentStateHidingDeploying().Init(this));
        states.Add(StateType.HidingDefense, new CastleDefenseContentStateHidingDefense().Init(this));

        currentCityId = GameMain.instance().getCurCityId();

        hideTroopsTitle.txt = Datas.getArString("OpenPalace.HideTroop");
        hideTroopsTip.txt = Datas.getArString("OpenPalace.HideTroopTip_New");

        hideTroopsSwitch.Init();
        hideTroopsSwitch.textOn = Datas.getArString("Settings.On");
        hideTroopsSwitch.textOff = Datas.getArString("Settings.Off");
        hideTroopsSwitch.OnClick = OnHideTroopsSwitch;

        bottomView.setBackground("tool bar_bottom", TextureType.BACKGROUND);
        splitLine.setBackground("between line", TextureType.DECORATION);

        defenseAmount.DescLabel.txt = Datas.getArString("SelectiveDefense.TroopAmount");
        defenseAmount.Icon.setBackground("icon_solider", TextureType.ICON);

        chooseTroopsButton.txt = Datas.getArString("ModalTitle.Choose_Troops");
        chooseTroopsButton.OnClick = OnChooseTroops;
        chooseTroopsButton.changeToBlueNew();
        
        rechooseTroopsButton.txt = Datas.getArString("SelectiveDefense.AdjustButton");
        rechooseTroopsButton.OnClick = OnRechooseTroops;
        rechooseTroopsButton.changeToBlueNew();
        
        dismissTroopsButton.txt = Datas.getArString("Common.Recall");
        dismissTroopsButton.OnClick = OnDismissTroops;
        dismissTroopsButton.changeToBlueNew();
        
        knightPositionButton.txt = Datas.getArString("SelectiveDefense.Tips_3");
        knightPositionButton.image = TextureMgr.instance().LoadTexture("pointing_right", TextureType.FTE);
        knightPositionButton.OnClick = OnKnightPosition;

        InitItemToDefend();
        InitTrainItem();
        
        theScrollView.Init();
    }

    public function SetData()
    {
        seed = GameMain.instance().getSeed();
        defenseAmount.UpdateData(0, 0);
        defenseCapacity = Seed["selective_defense_capacity"] == null ?
            0 : _Global.INT64(Seed["selective_defense_capacity"][String.Format("c{0}", currentCityId)]);
            
        SetDataForItemToDefend();
        
        hideTroopsDetailTip.rect.y = splitLine.rect.yMax + spaceBetweenSplitLineAndDetailTip + itemToDefendHeight;
        hideTroopsDetailTip.rect.height = bottomView.rect.y - hideTroopsDetailTip.rect.y;

        var isHiding : boolean = (seed["citystats"]["city" + currentCityId]["gate"].Value == Constant.City.HIDE);
        if (!isHiding)
        {
            GoToState(StateType.Unhiding);
        }
        else if (SelectiveDefenseQueueMgr.instance().Queue().Count > 0)
        {
            GoToState(StateType.HidingDeploying);
        }
        else if (Castle.instance().HasSelectiveDefense())
        {
            GoToState(StateType.HidingDefense);
        }
        else
        {
            GoToState(StateType.HidingNoDefense);
        }
        
        if (MyItems.instance().NeedUpdate)
        {
            MyItems.instance().NeedUpdate = false;
            MyItems.instance().getInventoryData(SetData);
        }
    }

    public function Draw() : int
    {
        if (currentState != null)
        {
            currentState.Draw();
        }
        return -1;
    }
    
    public function Update() : void
    {
        if (currentState != null)
        {
            currentState.Update();
        }
    }

    public function GoToState(newStateType : StateType)
    {
        if (currentState != null)
        {
            currentState.OnExit();
        }
        currentState = states[newStateType];
        currentState.OnEnter();
    }

    public function HandleNotification(type : String, body : Object)
    {
        switch (type)
        {
        case Constant.Notice.SelectiveDefenseCountChanged:
            OnSelectiveDefenseCountChanged();
            break;
        case Constant.Notice.SelectiveDefenseDeployStarted:
            OnDeployStarted();
            break;
        }
    }
    
    public function Clear() : void
    {
        if (currentState != null)
        {
            currentState.OnExit();
        }
    }

    private function InitTrainItem() : void
    {
        theTrainItem.seperateLine.SetVisible(false);
        theTrainItem.btnCancel.SetVisible(false);
        theTrainItem.icon.SetVisible(false);
        theTrainItem.Init();
        theTrainItem.btnSelect.OnClick = SpeedUp;
        theTrainItem.btnSelect.txt = Datas.getArString("Common.Speedup");
        theTrainItem.btnSelect.changeToGreenNew();
        theTrainItem.title.txt = Datas.getArString("SelectiveDefense.DeployTime");
    }
    
    private function SpeedUp(param : Object) : void
    {
        var queue : List.<SelectiveDefenseQueueItem> = SelectiveDefenseQueueMgr.instance().Queue();
        if (queue.Count <= 0) return;
        var item : SelectiveDefenseQueueItem = queue[0];
        MenuMgr.getInstance().PushMenu("SpeedUpMenu", item, "trans_zoomComp");
    }
    
    public static function OnSpeedupOK() : void
    {
        // No need to do anything special
        _Global.Log("[CastleDefenseContent OnSpeedupOK]");
    }
    
    public function OnSelectiveDefenseCountChanged() : void
    {
        if (currentState != null)
        {
            currentState.OnSelectiveDefenseCountChanged();
        }
    }

    private function OnHideTroopsSwitch(param : Object) : void
    {
        if (currentState != null)
        {
            currentState.OnHideTroopsSwitch();
        }
    }

    public function OnHideTroopsSuccess(result : HashObject) : void
    {
        if (currentState != null)
        {
            currentState.OnHideTroopsSuccess(result);
        }
    }

    public function OnChooseTroops(param : Object) : void
    {
        if (currentState != null)
        {
            currentState.OnChooseTroops();
        }
    }
    
    public function OnDismissSuccess(result : HashObject) : void
    {
        if (currentState != null)
        {
            currentState.OnDismissSuccess();
        }
    }
    
    private function OnRechooseTroops(param : Object) : void
    {
        if (currentState != null)
        {
            currentState.OnRechooseTroops();
        }
    }
    
    private function OnDismissTroops(param : Object) : void
    {
        if (currentState != null)
        {
            currentState.OnDismissTroops();
        }
    }
    
    private function OnKnightPosition(param : Object) : void
    {
        if (Building.instance().hasBuildingbyType(currentCityId, Constant.Building.GENERALS_QUARTERS))
        {
            var slotId : int = Building.instance().getPositionForType(Constant.Building.GENERALS_QUARTERS);
            var buildingInfo : Building.BuildingInfo = Building.instance().buildingInfo(slotId, Constant.Building.GENERALS_QUARTERS);
            var pushParam : Hashtable = {"tabIndex" : 2, "info" : buildingInfo};
            MenuMgr.getInstance().PushMenu("GeneralMenu", pushParam);
        }
        else
        {
            ErrorMgr.instance().PushError("", Datas.getArString("MessagesModal.BuildKnightsHall"));
        }
    }
    
    private function OnDeployStarted() : void
    {
        if (currentState != null)
        {
            currentState.OnDeployStarted();
        }
    }
    
    private function SetDataForItemToDefend()
    {
        var itemId : int = ServerSettingUtils.GetItemToDefendId();
        
        if (itemId > 0)
        {
            itemToDefend.SetVisible(true);
            itemToDefend.SetItemId(itemId);
            itemToDefend.rect.y = splitLine.rect.yMax;
            itemToDefendHeight = itemToDefend.rect.height;
        }
        else
        {
            itemToDefend.SetVisible(false);
            itemToDefendHeight = 0;
        }
    }
    
    private function InitItemToDefend()
    {
        itemToDefend.Init();
        itemToDefend.OnHelpButtonDelegate = new Action(OpenInGameHelp);
    }
    
    private function OpenInGameHelp() : void
    {
        var castleMenu : NewCastleMenu = MenuMgr.getInstance().getMenu("NewCastleMenu") as NewCastleMenu;
        if (castleMenu == null)
        {
            return;
        }
        castleMenu.OpenInGameHelp();
    }
}
