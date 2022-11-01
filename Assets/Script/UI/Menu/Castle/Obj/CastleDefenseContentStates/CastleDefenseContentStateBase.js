#pragma strict

public class CastleDefenseContentStateBase
{
    protected var owner : CastleDefenseContent;

    public function Init(owner : CastleDefenseContent) : CastleDefenseContentStateBase
    {
        this.owner = owner;
        return this;
    }

    public function OnEnter()
    {
        _Global.Log(String.Format("[{0} OnEnter]", GetType()));
        owner.HideTroopsSwitch.SetOn(true);
        owner.OnSelectiveDefenseCountChanged();
        owner.TheScrollView.MakeNeedScreenRectOnce();
    }
    
    public function OnExit()
    {
        _Global.Log(String.Format("[{0} OnExit]", GetType()));
    }

    public function Draw() : void
    {
        owner.HideTroopsTitle.Draw();
        owner.HideTroopsSwitch.Draw();
        owner.HideTroopsTip.Draw();
        owner.GateCoolTimeTip.Draw();
        owner.SplitLine.Draw();
        owner.ItemToDefend.Draw();
        owner.BottomView.Draw();
    }

    public function Update() : void
    {
        // Empty for override
        var gateCoolTime : long = Castle.instance().GetCurCityTKGateCoolTime();
        var curTime : long = GameMain.unixtime();
		if(gateCoolTime < curTime)
		{
            owner.GateCoolTimeTip.SetVisible(false);
            owner.HideTroopsSwitch.canNotClick = false;
		}
		else
		{
            owner.GateCoolTimeTip.txt = String.Format(Datas.getArString("NewTK.HideTroopCD"), _Global.timeFormatStr(gateCoolTime - curTime));
            owner.GateCoolTimeTip.SetVisible(true);
            owner.HideTroopsSwitch.canNotClick = true;
		}  
    }

    public function OnHideTroopsSuccess(result : HashObject) : void
    {
        var sancType = (!owner.HideTroopsSwitch.on ? Constant.City.HIDE : Constant.City.DEFEND);
        owner.Seed["citystats"]["city" + owner.CurrentCityId]["gate"].Value = sancType;

        if (result != null && result["updateSeed"])
        {
            UpdateSeed.instance().update_seed(result["updateSeed"]);
        }
        
        MoveSelectiveDefenseBackToCityUnits();
        
        // Completing transition from 'hide' to 'unhide', show user the cities menu.
        if (sancType == Constant.City.DEFEND)
        {
            MenuMgr.getInstance().PushMenu("Cities", {"CityIdToUnhideTroops": owner.CurrentCityId}, "trans_zoomComp");         
        }
    }
    
    protected function MoveSelectiveDefenseBackToCityUnits() : void
    {
        var defenseNode : HashObject = owner.Seed["selective_defense"];
        if (defenseNode == null)
        {
            defenseNode = new HashObject();
        }
        
        var currentCityNode : HashObject = defenseNode[String.Format("c{0}", owner.CurrentCityId)];
        if (currentCityNode == null)
        {
            currentCityNode = new HashObject();
        }
        
        var keys : String[] = _Global.GetObjectKeys(currentCityNode);
        for (var key in keys)
        {
            var troopId : int = _Global.INT32(key.Substring(1));
            var troopCount : int = _Global.INT32(currentCityNode[key]);
            if (troopId > 0 && troopCount > 0)
            {
                var cityKey : String = String.Format("city{0}", owner.CurrentCityId);
                var unitKey : String = String.Format("unt{0}", troopId);
                
                var unit : HashObject = owner.Seed["units"][cityKey][unitKey];
                if (unit == null)
                {
                    owner.Seed["units"][cityKey][unitKey] = new HashObject();
                    unit = owner.Seed["units"][cityKey][unitKey];
                }
                unit.Value = _Global.INT32(unit) + troopCount;
            }
            currentCityNode[key].Value = 0;
        }
        
        Barracks.instance().UpadateAllTroop();
    }
    
    public function OnRechooseTroops() : void
    {
        throw new System.NotImplementedException();
    }
    
    public function OnDismissTroops() : void
    {
        throw new System.NotImplementedException();
    }
    
    public function OnHideTroopsSwitch() : void
    {
        var sancType = owner.HideTroopsSwitch.on == true ? Constant.City.HIDE : Constant.City.DEFEND;
        owner.HideTroopsSwitch.SetOn(!owner.HideTroopsSwitch.on);
        
        if (!owner.HideTroopsSwitch.on)
        {
            Castle.instance().sanctuaryChange(owner.CurrentCityId, sancType, owner.OnHideTroopsSuccess);
            return;
        }
        
        var confirmDialog : ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
        confirmDialog.setButtonText(Datas.getArString("Common.OK_Button"),Datas.getArString("Common.Cancel"));
        confirmDialog.setLayout(600, 320);
        confirmDialog.setContentRect(70, 75, 0, 140);
        var cityName : String = GameMain.instance().getCityNameById(owner.CurrentCityId);
        MenuMgr.getInstance().PushConfirmDialog(
            String.Format(Datas.getArString("SelectiveDefense.UnhideConfirm"), cityName), null,
            function() : void
            {
                Castle.instance().sanctuaryChange(owner.CurrentCityId, sancType, owner.OnHideTroopsSuccess);
            },
            null, true);
    }
    
    public function OnChooseTroops() : void
    {
        throw new System.NotImplementedException();
    }
    
    public function OnDeployStarted() : void
    {
        throw new System.NotImplementedException();
    }
    
    public function OnDismissSuccess() : void
    {
        throw new System.NotImplementedException();
    }

    public function GetStateType() : CastleDefenseContent.StateType
    {
        throw new System.NotImplementedException();
    }
    
    public function OnSelectiveDefenseCountChanged() : void
    {
        UpdateDefenseAmountDisplay(CalculateSelectiveDefenseAmount());
    }
    
    protected function CalculateSelectiveDefenseAmount() : int
    {
        var selectiveDefenseNode : HashObject = owner.Seed["selective_defense"];
        if (selectiveDefenseNode == null)
        {
            return 0;
        }

        var currentCity : HashObject = selectiveDefenseNode[String.Format("c{0}", owner.CurrentCityId)];
        if (currentCity == null)
        {
            return 0;
        }

        var amount : long = 0;
        var keys : String[] = _Global.GetObjectKeys(currentCity);
        for (var i : int = 0; i < keys.Length; ++i)
        {
            amount += _Global.INT64(currentCity[keys[i]]);
        }

        return amount;
    }
    
    protected function UpdateDefenseAmountDisplay(amount : int) : void
    {
        owner.DefenseAmount.UpdateData(amount, owner.DefenseCapacity);
    }
}
