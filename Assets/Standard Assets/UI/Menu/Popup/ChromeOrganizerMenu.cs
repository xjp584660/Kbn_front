using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class ChromeOrganizerMenu : PopMenu
{
    [SerializeField]
    private SimpleLabel m_topSplice;
    [SerializeField]
    private KBN.ScrollList m_slItems;
    [SerializeField]
    private ChromeOrganizerListItem m_ltItemTemplate;
    [SerializeField]
    private ChromeOrganizerListItem.Data.AuxLabelData dailyLoginAuxLabelData;

    System.Collections.Generic.List<InvokeData> m_invokeDatas;

    class InvokeData
    {
        public InvokeData(System.Func<bool> in_isNeedShow,
                          System.Action<ChromeOrganizerListItem> in_updateItem,
                          System.Func<ChromeOrganizerListItem.Data> in_initItem)
        {
            isNeedShow = in_isNeedShow;
            updateItem = in_updateItem;
            initItem = in_initItem;
            isAlreadyShow = false;
        }

        public System.Func<bool> isNeedShow;
        public System.Action<ChromeOrganizerListItem> updateItem;
        public System.Func<ChromeOrganizerListItem.Data> initItem;
        public bool isAlreadyShow;
    }

    public override void Init()
    {
        base.Init();
        title.txt = Datas.getArString("IconOrganize.PageTitle");

        m_slItems.Init(m_ltItemTemplate);
    }

    public override void OnPush(object pars)
    {
        base.OnPush(pars);

        StatePopupEntranceController.Instance.UIOpen();

        var texMgr = TextureMgr.instance();
        m_topSplice.mystyle.normal.background = texMgr.LoadTexture("between line", TextureType.DECORATION);
        var invokeDatas = new System.Collections.Generic.List<InvokeData>();
//        var dailyLoginInvokeData = new InvokeData(priv_shouldShowDailyLoginBtn, priv_updateDataDailyLogin, ()=>
//        {    //    btnDailyLogin
//            var dlData = new ChromeOrganizerListItem.Data();
//            dlData.iconText = texMgr.LoadTexture("Login_calendar", TextureType.DECORATION);
//            dlData.title = Datas.getArString("IconOrganize.Login_Title");
//            dlData.desc = Datas.getArString("IconOrganize.Login_Desc");
//            dlData.clickButtonPosition = DailyLoginRewardMgr.Instance.UpdateDataAndOpenMenu;
//            dlData.isNeedShowDot = DailyLoginRewardMgr.Instance.CanClaimAny;
//            dlData.updateCallback = priv_updateDataDailyLogin;
//            dlData.auxLabelData = dailyLoginAuxLabelData;
//            return dlData;
//        });
//        invokeDatas.Add(dailyLoginInvokeData);

        var dailyQuestInvokeData = new InvokeData(() => { return true; }, null, () =>
        {
            var data = new ChromeOrganizerListItem.Data();
            data.iconText = TextureMgr.instance().LoadTexture("DailyQuestEntrance", TextureType.BUTTON);
            data.title = Datas.getArString("DailyQuest.TabName");
            data.desc = Datas.getArString("IconOrganize.DailyQuest_Desc");
            data.isNeedShowDot = DailyQuestManager.Instance.CanClaimAny;
            data.clickButtonPosition = delegate()
            {
                MenuAccessor.OpenMissionMenu("daily");
            };
            data.updateCallback = delegate(ChromeOrganizerListItem item)
            {
                item.DotVisible = DailyQuestManager.Instance.CanClaimAny;
            };
            return data;
        });
        invokeDatas.Add(dailyQuestInvokeData);

        var roundTowerInvokeData = new InvokeData(()=>{return m_isShowBtnRoundTower;}, null, ()=>
        {
            var rtData = new ChromeOrganizerListItem.Data();
            rtData.iconText = texMgr.LoadTexture("RoundTower_icon", TextureType.ICON);
            rtData.title = Datas.getArString("IconOrganize.RoundTower_Title");
            rtData.desc = Datas.getArString("IconOrganize.RoundTower_Desc");
            rtData.clickButtonPosition = MenuAccessor.OpenEventDialog;
            return rtData;
        });
        invokeDatas.Add(roundTowerInvokeData);

//        var offerInvokeData = new InvokeData(()=>{return PaymentOfferManager.Instance.GetDataByCategory(3) != null;}, null, ()=>
//        {    //    btnUniversalOffer
//            var offerData = PaymentOfferManager.Instance.GetDataByCategory(3);
//            var uoData = new ChromeOrganizerListItem.Data();
//            uoData.iconText = texMgr.LoadTexture("Beginners-Offer_buff3", TextureType.DECORATION);
//			uoData.title = offerData.Name;
//            uoData.desc = Datas.getArString("IconOrganize.Offer_Desc");
//            uoData.clickButtonPosition = MenuAccessor.OpenUniversalOffer;
//            uoData.endTime = offerData.EndTime;
//            PaymentOfferManager.Instance.UpdateDisplayDataWithData(PaymentOfferManager.DisplayPosition.Lower, 3);
//            return uoData;
//        });
//        invokeDatas.Add(offerInvokeData);
        
        var blueLightInvokeData = new InvokeData(()=>{return PaymentOfferManager.Instance.PayingStatus == PaymentOfferManager.PayingStatusType.HasPaid && Payment.singleton.blueLightData.showIcon;}, null, ()=>
        {    //btnBlueLight
            var blData = new ChromeOrganizerListItem.Data();
            blData.iconText = texMgr.LoadTexture("gems_progress_bar_icon", TextureType.DECORATION);
            blData.title = Datas.getArString("IconOrganize.BlueLight_Title");
            blData.desc = Datas.getArString("IconOrganize.BlueLight_Desc");
            blData.clickButtonPosition = delegate()
            {
                Payment.singleton.blueLightData.hide_flag = true;
                Payment.singleton.blueLightData.openWithMainChrome();
                MenuMgr.instance.PushMenu("BlueLight",null,"trans_zoomComp");
            };
            return blData;
        });
        invokeDatas.Add(blueLightInvokeData);

        m_invokeDatas = invokeDatas;
        priv_initData();
    }

    private void priv_initData()
    {
        var dats = new System.Collections.Generic.List<ChromeOrganizerListItem.Data>();
        for ( int i = 0; i != m_invokeDatas.Count; ++i )
        {
            if ( !m_invokeDatas[i].isNeedShow() )
            {
                m_invokeDatas[i].isAlreadyShow = false;
                continue;
            }
            m_invokeDatas[i].isAlreadyShow = true;
            var data = m_invokeDatas[i].initItem();
            dats.Add(data);
        }
        m_slItems.SetData(dats);
        m_slItems.UpdateData();
    }

    public void RecheckItems()
    {
        bool isNeedUpdate = false;
        for ( int i = 0; i != m_invokeDatas.Count; ++i )
        {
            if ( m_invokeDatas[i].isAlreadyShow == m_invokeDatas[i].isNeedShow() )
                continue;
            isNeedUpdate = true;
            break;
        }
        if ( !isNeedUpdate )
        {
            m_slItems.UpdateData();
            return;
        }
        m_slItems.Clear();
        priv_initData();
    }

    public override void OnPopOver()
    {
        m_topSplice.mystyle.normal.background = null;
        title.txt = "";
        m_slItems.Clear();
        base.OnPopOver();
    }

    protected override void DrawItem()
    {
        m_topSplice.Draw();
        m_slItems.Draw();
    }

    public override void Update()
    {
        m_slItems.Update();
        MenuMgr.instance.GetMainChromeMenu().Update();
    }

    private bool priv_shouldShowDailyLoginBtn()
    {
        if (!DailyLoginRewardMgr.Instance.FeatureSwitch)
            return false;

        if (DailyLoginRewardMgr.Instance.HasMystryChest)
            return MystryChest.singleton.IsLoadFinish;

        return true;
    }
    
    private static bool m_isShowBtnRoundTower;
    public static     bool IsShowRoundTowerButton
    {
        set
        {
            m_isShowBtnRoundTower = value;
        }

        get
        {
            return m_isShowBtnRoundTower;
        }
    }

    private static bool m_showUniversalOffer;
    public static bool ShowUniversalOffer
    {
        get
        {
            return m_showUniversalOffer;
        }
        set
        {
            m_showUniversalOffer = value;
        }
    }

    public override void handleNotification(string type, object body)
    {
        switch(type)
        {
            case Constant.Notice.DailyQuestDataUpdated:
            case Constant.Notice.DailyQuestProgressIncreased:
            case Constant.Notice.DailyQuestRewardClaimed:
            //case Constant.Notice.DailyLoginRewardFeatureOnOrOff:
            //case Constant.Notice.DailyLoginRewardClaimSuccess:
            //case Constant.Notice.DailyLoginRewardUpdateDataSuccess:
                RecheckItems();
                break;
        }

        MenuMgr.instance.GetMainChromeMenu().handleNotification(type, body);
    }

    private void priv_updateDataDailyLogin(ChromeOrganizerListItem item)
    {
        var visible = priv_shouldShowDailyLoginBtn();
        var dotVisible = visible && DailyLoginRewardMgr.Instance.CanClaimAny;
        item.DotVisible = dotVisible;
        var shouldAnimate = false; //dotVisible && DailyLoginRewardMgr.Instance.HasNotOpenedUI;
        item.PlayRotateAnim = shouldAnimate;
    }
}

