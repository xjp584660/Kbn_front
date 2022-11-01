#pragma strict

import System;
import System.Text.RegularExpressions;

// Sub-menu to show the invitation code input UI
public class RedeemInviteCodeSubMenu extends SubMenu
{
    private enum DataStatus
    {
        Unknown,
        CanInput,
        AlreadyUsed
    }
    private static var dataStatus : DataStatus = DataStatus.Unknown;

    // UI groups in different states
    @SerializeField
    private var canInputUIGroup : ComposedUIObj;
    @SerializeField
    private var afterInputUIGroup : ComposedUIObj;
    // !UI groups in different states
    
    // UI elements when the user can input the invitation code
    @SerializeField
    private var inviteCodeDescLabel : Label;
    @SerializeField
    private var inviteCodeInput : InputText;
    @SerializeField
    private var inviteCodeBg : Label;
    @SerializeField
    private var redeemButton : Button;
    @SerializeField
    private var howToGetInviteCodeLabel : Label;
    // !UI elements when the user can input the invitation code
    
    // UI elements when the user has already input the code
    @SerializeField
    private var alreadyUsedDescLabel : Label;
    @SerializeField
    private var inviteOthersDescButton : Button;
    // !UI elements when the user has already input the code
    
    @SerializeField
    private var invalidInviteCodeInputKey : String;
    @SerializeField
    private var inputCodeDescKey : String;
    @SerializeField
    private var alreadyUsedDescKey : String;
    @SerializeField
    private var inviteOthersDescKey : String;
    @SerializeField
    private var howToGetInviteCodeKey : String;

    private var currentStateUIGroup : ComposedUIObj;
    
    public function Init(parent : ComposedMenu) : void
    {
        super.Init(parent);
        canInputUIGroup.Init();
        afterInputUIGroup.Init();
        
        inviteCodeInput.Init();
        
        redeemButton.OnClick = OnClickRedeem;
        redeemButton.changeToBlueNew();
        redeemButton.txt = Datas.getArString("Common.OK_Button");
        
        howToGetInviteCodeLabel.txt = Datas.getArString(howToGetInviteCodeKey);
        
        inviteCodeDescLabel.txt = Datas.getArString(inputCodeDescKey);
        inviteCodeBg.mystyle.normal.background =
            TextureMgr.instance().LoadTexture("square_black2", TextureType.DECORATION);

        alreadyUsedDescLabel.mystyle.normal.background =
            TextureMgr.instance().LoadTexture("square_black2", TextureType.DECORATION);
        
        inviteOthersDescButton.txt = Datas.getArString(inviteOthersDescKey);
        inviteOthersDescButton.OnClick = OnClickInviteOthers;
        
        
        currentStateUIGroup = canInputUIGroup;
        
        this.title.txt = Datas.getArString("Settings.RedeemInviteCode");
        
        // Reset the dataStatus if when the game
        GameMain.instance().resgisterRestartFunc(function() : void {
            dataStatus = DataStatus.Unknown;
            return;
        });
    }
    
    private function OnClickInviteOthers(param : System.Object) : void
    {
        MenuMgr.getInstance().PopMenu(m_parent.menuName);
        MenuMgr.getInstance().PushMenu("ShareMenu", null);
    }
    
    public function DrawItem() : void
    {
        btnBack.Draw();
        currentStateUIGroup.Draw();
    }
    
    public function Update() : void
    {
        currentStateUIGroup.Update();
    }
    
    public function OnPush(param : Object):void
    {
        InputText.closeActiveInput();
        inviteCodeInput.txt = String.Empty;
        SetDataStatus(dataStatus);
        if (dataStatus == DataStatus.Unknown)
        {
            ReqCheckCanInput();
        }
    }
    
    private function ReqCheckCanInput() : void
    {
        var paramDict : Hashtable = new Hashtable();
        paramDict.Add("op", "check_has_awarded");
        UnityNet.reqWWW("inviteCode.php", paramDict, OnCheckCanInputSuccess, OnCheckCanInputFailure);
    }
    
    private function OnCheckCanInputSuccess(ho : HashObject) : void
    {
        var canInput : boolean = _Global.GetBoolean(ho["canInput"]);
        SetDataStatus(canInput ? DataStatus.CanInput : DataStatus.AlreadyUsed);
        
        if (dataStatus == DataStatus.AlreadyUsed)
        {
            alreadyUsedDescLabel.txt = String.Format(Datas.getArString(alreadyUsedDescKey),
                _Global.GetString(ho["whoInvitedMe"]));
        }
    }
    
    private function OnCheckCanInputFailure(errMsg : String, errCode : String) : void
    {
        // When failing to check the 'canInput' state, consider it as true.
        SetDataStatus(DataStatus.CanInput);
    }
    
    private function OnClickRedeem(param : System.Object) : void
    {
        ReqRedeem();
    }
    
    private function ReqRedeem() : void
    {
        InputText.closeActiveInput();
        var rawInput : String = inviteCodeInput.txt;
        
        if (rawInput == null)
        {
            rawInput = String.Empty;
        }
        
        rawInput = rawInput.Trim().ToUpper();
        
        if (String.IsNullOrEmpty(rawInput) || !Regex.IsMatch(rawInput, "^KBN\\d+$"))
        {
            ErrorMgr.instance().PushError("", Datas.getArString(invalidInviteCodeInputKey));
            return;
        }
        
        var paramDict : Hashtable = new Hashtable();
        paramDict.Add("op", "active_invite_code");
        paramDict.Add("invite_code", rawInput);
        UnityNet.reqWWW("inviteCode.php", paramDict, OnRedeemSuccess, null);
    }
    
    private function OnRedeemSuccess(ho : HashObject) : void
    {
        SetDataStatus(DataStatus.AlreadyUsed);
        // Reuse the toast node of the response to get the inviter name
        var inviterName : String = _Global.GetString(ho["toast"]["msgParams"][_Global.ap + "0"]);
        alreadyUsedDescLabel.txt = String.Format(Datas.getArString(alreadyUsedDescKey),
            _Global.GetString(inviterName));
    }
    
    private function SetDataStatus(newStatus : DataStatus) : void
    {
        InputText.closeActiveInput();
        dataStatus = newStatus;
        switch (dataStatus)
        {
        case DataStatus.CanInput:
            currentStateUIGroup = canInputUIGroup;
            break;
        case DataStatus.AlreadyUsed:
            currentStateUIGroup = afterInputUIGroup;
            break;
        default:
            currentStateUIGroup = canInputUIGroup;
            break;
        }
    }
}