using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class AvaLastRankMenu : PopMenu
{
    public SimpleLabel divideLine;
    public SimpleLabel desc;
    public ToolBar toolBar;

    public SimpleLabel tipColumnsBg;
    public SimpleLabel tipRank;
    public SimpleLabel tipName;
    public SimpleLabel tipScore;

    public ToggleButton tb_eu;
    public ToggleButton tb_na;
    public ToggleButton tb_all;
    private List<ToggleButton> tbList = null;
    public SimpleLabel l_eu;
    public SimpleLabel l_na;
    public SimpleLabel l_all;

    #region ToolBar Index 1
    public AvALeaderBoardAllianceItem allianceItemTemplate;
    public KBN.ScrollList allianceList;
    #endregion ToolBar Index 1

    #region ToolBar Index 2
    public AvALeaderBoardIndividualItem individualItemTemplate;
    public KBN.ScrollList individualList;
    #endregion ToolBar Index 2

    public AvaLeaderBoardSelfItem selfLastRankItem;

    public Button4Page pageNavigator;

    private int m_currentIndex;
    private int m_areaIndex = 0; // 0:all  1:eu  2:na  3:other

    private const int PAGESIZE = 10;

    public override void Init()
    {
        base.Init();

        title.txt = KBN.Datas.getArString("AVA.lastAVArank_title");

        btnClose.OnClick = new System.Action<System.Object>((param) => {
            KBN.MenuMgr.instance.PopMenu("AvaLastRankMenu");
        });

        toolBar.toolbarStrings = new string[]{KBN.Datas.getArString("AVA.leaderboard_aliancebtn"), KBN.Datas.getArString("AVA.leaderboard_individualbtn")};
        toolBar.indexChangedFunc = handleToolBarIndexChanged;
        toolBar.SetVisible(false);

        tb_eu.Init();
        tb_na.Init();
        tb_all.Init();
        tbList = new List<ToggleButton> {tb_all, tb_eu, tb_na};
        tb_eu.selected = true;
        AddToggleButtonHandler();
        l_eu.txt = KBN.Datas.getArString("AVA.leaderboard_EUbtn");
        l_na.txt = KBN.Datas.getArString("AVA.leaderboard_NAbtn");
        l_all.txt = KBN.Datas.getArString("AVA.leaderboard_ALLbtn");

        m_areaIndex = 1;

        allianceItemTemplate.Init();
        allianceList.Init(allianceItemTemplate);

        individualItemTemplate.Init();
        individualList.Init(individualItemTemplate);

        handleToolBarIndexChanged(toolBar.selectedIndex);

        if (divideLine.mystyle.normal.background == null)
        {
            divideLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line", TextureType.DECORATION);
        }

        if (tipColumnsBg.mystyle.normal.background == null)
        {
            tipColumnsBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2", TextureType.DECORATION);
        }

        desc.txt = KBN.Datas.getArString("AVA.lastAVArank_desc");

        pageNavigator.Init();
        pageNavigator.pageChangedHandler = new System.Action<int>(handlePageChanged);

        selfLastRankItem.Init();
    }

    protected override void DrawItem()
    {
        base.DrawItem();

        divideLine.Draw();
        desc.Draw();
        toolBar.Draw();

        tb_eu.Draw();
        tb_na.Draw();
        tb_all.Draw();
        l_eu.Draw();
        l_na.Draw();
        l_all.Draw();

        tipColumnsBg.Draw();
        tipRank.Draw();
        tipName.Draw();
        tipScore.Draw();

        if (m_currentIndex == 0)
        {
            allianceList.Draw();
        }
        else if (m_currentIndex == 1)
        {
            individualList.Draw();
        }

        selfLastRankItem.Draw();

        pageNavigator.Draw();
    }

    public override void Update()
    {
        base.Update();

        if (m_currentIndex == 0)
        {
            allianceList.Update();
        }
        else if (m_currentIndex == 1)
        {
            individualList.Update();
        }
    }

    public override void OnPush(object param)
    {
        base.OnPush(param);

        RequestLastRank(1);
    }

    public override void OnPopOver()
    {
        base.OnPopOver();

        allianceList.Clear();
        individualList.Clear();

        divideLine.mystyle.normal.background = null;
        tipColumnsBg.mystyle.normal.background = null;
    }

    private void AddToggleButtonHandler()
    {
        tb_eu.valueChangedFunc2 = new System.Action<ToggleButton, bool>(selectedIndexChanged);
        tb_na.valueChangedFunc2 = new System.Action<ToggleButton, bool>(selectedIndexChanged);
        tb_all.valueChangedFunc2 = new System.Action<ToggleButton, bool>(selectedIndexChanged);
    }
    
    private void RemoveToggleButtonHandler()
    {
        tb_eu.valueChangedFunc2 = null;
        tb_na.valueChangedFunc2 = null;
        tb_all.valueChangedFunc2 = null;
    }

    private void selectedIndexChanged(ToggleButton sender, bool selected)
    {
        RemoveToggleButtonHandler();
        if (sender == tbList[m_areaIndex])
        {
            tbList[m_areaIndex].selected = true;
        }
        else
        {
            for (int i = 0; i < tbList.Count; ++i)
            {
                if (tbList[i] == sender)
                {
                    m_areaIndex = i;
                    tbList[i].selected = true;
                }
                else
                {
                    tbList[i].selected = false;
                }
            }

            RequestLastRank(1);
        }
        AddToggleButtonHandler();
    }

    private void handleToolBarIndexChanged(int index)
    {
        m_currentIndex = index;

        if (m_currentIndex == 0)
        {
            tipRank.txt = KBN.Datas.getArString("AVA.lastAVArank_rank");
            tipName.txt = KBN.Datas.getArString("AVA.leaderboard_aliancebtn");
            tipScore.txt = KBN.Datas.getArString("AVA.lastAVArank_score");
        }
        else if (m_currentIndex == 1)
        {
            tipRank.txt = KBN.Datas.getArString("AVA.lastAVArank_rank");
            tipName.txt = KBN.Datas.getArString("AVA.lastAVArank_alianceandplayer");
            tipScore.txt = KBN.Datas.getArString("AVA.lastAVArank_combatscore");
        }

        RequestLastRank(1);
    }

    private void handlePageChanged(int index)
    {
        RequestLastRank(index);
    }

    private PBMsgReqAVA.PBMsgReqAVA ConstructReqMsg(int _page)
    {
        PBMsgReqAVA.PBMsgReqAVA request =new PBMsgReqAVA.PBMsgReqAVA();
        request.cmd = 6;
        if (m_currentIndex == 0)
        {
            request.subcmd = 3;
        }
        else if(m_currentIndex == 1)
        {
            request.subcmd = 4;
        }

        request.leaderboard = new PBMsgReqAVA.PBMsgReqAVA.Leaderboard();
        request.leaderboard.page = _page;
        request.leaderboard.pageSize = PAGESIZE;
        request.leaderboard.area = m_areaIndex;
        request.leaderboard.previous = 1;

        return request;
    }

    private void RequestLastRank(int _page)
    {
        PBMsgReqAVA.PBMsgReqAVA request = ConstructReqMsg(_page);
        KBN.UnityNet.RequestForGPB("ava.php", request, OnGetLastRankOK, null, false);
    }

    void OnGetLastRankOK(byte[] data)
    {
        PBMsgAVALeaderBoard.PBMsgAVALeaderBoard lastRank = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVALeaderBoard.PBMsgAVALeaderBoard>(data);

        if (m_currentIndex == 0) // alliance
        {
            allianceList.SetData(lastRank.lblist);
            allianceList.ResetPos();
        }
        else if (m_currentIndex == 1) // individual
        {
            individualList.SetData(lastRank.lblist);
            individualList.ResetPos();
        }

        int _pageCount = Mathf.CeilToInt(System.Convert.ToSingle(lastRank.total) / System.Convert.ToSingle(PAGESIZE));
        int _curPage = lastRank.page;
        if (_pageCount <= 0)
        {
            _pageCount = 0;
            _curPage = 0;
        }
        pageNavigator.setPages(_curPage, _pageCount);

        UpdateSelfItemData(lastRank);

//        Debug.Log("[OnGetLastRankOK]");
    }

    private void UpdateSelfItemData(PBMsgAVALeaderBoard.PBMsgAVALeaderBoard lastRank)
    {
        selfLastRankItem.SetItemUIData(m_currentIndex, lastRank);
    }
}
