class ScoutMenu extends PopMenu
{
    @SerializeField
    private var contentBg : Label;
    @SerializeField
    private var scoutIcon : Label;
    @SerializeField
    private var contentTitleLabel : Label;
    @SerializeField
    private var contentLabel : Label;
    @SerializeField
    private var scoutNowBtn : Button;
    @SerializeField
    private var scoutNowLabel : Label;
    @SerializeField
    private var scoutBtn : Button;
    @SerializeField
    private var scoutLabel : Label;
    @SerializeField
    private var scoutInstantlyDesc : Label;
    
    @SerializeField
    private var strategyNormal : ScoutMenuStrategy_Normal;
    @SerializeField
    private var strategyAva : ScoutMenuStrategy_Ava;
    
    private var m_targetX : int;
    private var m_targetY : int;
    private var m_strategy : ScoutMenuStrategy_Base;
    
    public function OnPush(param : Object)
    {
    	checkIphoneXAdapter();
        var paramDict : Hashtable = param as Hashtable;
        
        contentBg.setBackground("square_black2",TextureType.DECORATION);
        this.m_targetX = _Global.INT32(paramDict["x"]);
        this.m_targetY = _Global.INT32(paramDict["y"]);
        this.m_strategy = _Global.INT32(paramDict["ava"]) != 0 ? strategyAva : strategyNormal;

        scoutIcon.useTile = true;
        scoutIcon.tile = TextureMgr.instance().ResearchSpt().GetTile("timg_6");

        title.txt = String.Format("{0}({1},{2})", Datas.getArString("Common.Scout"), m_targetX.ToString(), m_targetY.ToString());

        contentTitleLabel.txt = Datas.getArString("Scout.descriptionTitle");
        contentLabel.txt = Datas.getArString(m_strategy.DescKey);
        
        scoutBtn.rect = m_strategy.ScoutButtonPos;
        scoutLabel.rect = m_strategy.ScoutLabelPos;
        
        scoutNowBtn.txt = Datas.getArString("Scout.ScoutInstantly");
        scoutBtn.txt = Datas.getArString("Common.Scout");
        scoutInstantlyDesc.txt = Datas.getArString("Scout.ScoutInstantlyDesc");
        
        scoutNowBtn.OnClick = function(p : Object)
        {
            var seed : Object = GameMain.instance().getSeed();
            var scoutCost : int = 2;
            if(Payment.instance().CheckGems(scoutCost))
            {
                m_strategy.StartScout(m_targetX, m_targetY, true, scoutOkCallback);
            }
            else
            {
                // gems not enough
            }
        };

        scoutBtn.OnClick = function(p : Object)
        {
            m_strategy.StartScout(m_targetX, m_targetY, false, scoutOkCallback);
        };

        var scoutTime : long = m_strategy.CalcScoutTime(m_targetX, m_targetY);
        scoutLabel.txt = _Global.timeFormatStr(scoutTime);
        
        scoutNowLabel.txt = m_strategy.CalcInstantScoutGems(m_targetX, m_targetY).ToString();
        
        SetInstantScoutVisibility(m_strategy.CanScoutInstantly());
    }
    
    private function SetInstantScoutVisibility(visible : boolean)
    {
        scoutNowLabel.SetVisible(visible);
        scoutNowBtn.SetVisible(visible);
        scoutInstantlyDesc.SetVisible(visible);
    }
    
    public function DrawTitle()
    {
        title.Draw();
    }
    
    public function DrawItem()
    {
        contentBg.Draw();
        scoutIcon.Draw();
        
        contentTitleLabel.Draw();
        contentLabel.Draw();
        
        scoutNowBtn.Draw();
        scoutNowLabel.Draw();
        
        scoutBtn.Draw();
        scoutLabel.Draw();
        scoutInstantlyDesc.Draw();
    }
    
    public function handleNotification(type : String, body : Object)
    {
        switch (type)
        {
        case Constant.Notice.AvaMarchOK:
            var marchInfo : AvaBaseMarch = body as AvaBaseMarch;
            if (marchInfo != null && marchInfo.Type == Constant.AvaMarchType.SCOUT)
            {
                scoutOkCallback(false);
            }
            break;
        }
    }
    
    private function scoutOkCallback(instant : boolean)
    {
        SoundMgr.instance().PlayEffect("start_march", /*TextureType.AUDIO*/ "Audio/");
        MenuMgr.getInstance().PopMenu("ScoutMenu");
        if (instant)
        {
            //JIRA 2507 Add Toaster.
            MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.Instant_Scout"));
        }
    }
}
