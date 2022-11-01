public class Alliance extends KBN.Alliance {
    public static function getInstance() : Alliance
    {
        if(singleton == null) {
            singleton = new Alliance();
            GameMain.instance().resgisterRestartFunc(function() {
                singleton = null;
            });
        }
        return singleton as Alliance;
    }

    public function reqAllianceHelp(qitem : QueueItem, okFunc : Function) {
        var rItem : Research.ResearchQueueElement = qitem as Research.ResearchQueueElement;
        var bItem : BuildingQueueMgr.QueueElement = qitem as BuildingQueueMgr.QueueElement;
        var cid : int = GameMain.instance().getCurCityId();
        if(rItem != null)
        {
            reqAllianceHelp(rItem.cityId,2,rItem.id,rItem.id,rItem.level,okFunc);
        }
        else
            if(bItem != null)
        {
            reqAllianceHelp(bItem.cityId,1,bItem.itemType,bItem.id,bItem.level,okFunc);
        }
    }

    public function CanInviteUser(userInfo : UserDetailInfo) : boolean {
        return CanInviteUser(_Global.INT32(userInfo.userId), _Global.INT32(userInfo.allianceId));
    }

    public function DoInviteUser(userInfo : UserDetailInfo) : void {
        DoInviteUser(_Global.ToString(userInfo.userName), _Global.INT32(userInfo.userId));
    }

    protected function GetInviteEmailType() : int {
        return ComposeObj.InviteMail;
    }

    protected function EmailMenuClickCompose(_obj : Hashtable) : void {
        EmailMenu.getInstance().clickCompose(_obj);
    }

    protected function UpdateQueuesWithHelpData(key : String, cid : int, tData : HashObject) {
        if(key.StartsWith("b") )
        {
            BuildingQueueMgr.instance().updateBuildingQueueWithHelpData(cid,tData);
        }
        else
            if(key.StartsWith("t") )
        {
            Research.instance().updateSearchWithHelpData(cid,tData);
        }
        else
        {
        	MenuMgr.instance.PushMessage((tData["helperName"].Value as String)+" Help you!!!!!");
        }
    }
}
