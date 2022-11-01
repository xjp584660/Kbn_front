using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class AvALeaderboard : UIObject, IEventHandler
{
	public ToolBar dataType;
	public ToggleButton tb_eu;
	public ToggleButton tb_na;
	public ToggleButton tb_all;
    private List<ToggleButton> tbList = null;
	public Label l_eu;
	public Label l_na;
	public Label l_all;
	public Input2Page page_navigator;

	public Label lblBackground;
	public Label lblTipColumns;
	public Label lblTipRank;
	public Label lblTipName;
	public Label lblTipScore;

	public Label lblCutLine1;
	public Label lblCutLine2;

	public KBN.ScrollList scrollList;
	public ListItem individualItemTemplate;
	public ListItem allianceItemTemplate;

	public AvaLeaderBoardSelfItem selfRankItem;

	private int m_tabIndex = 0;
    private int m_areaIndex = 0; // 0:all  1:eu  2:na  3:other

    private const int PAGESIZE = 10;
	
	public override void Init ()
	{
		base.Init ();
		
		dataType.Init();
        dataType.toolbarStrings = new string[]{KBN.Datas.getArString("AVA.leaderboard_aliancebtn"), KBN.Datas.getArString("AVA.leaderboard_individualbtn")};
		dataType.indexChangedFunc = new System.Action<int>(IndexChanged);
        dataType.SetVisible(false);

		tb_eu.Init();
		tb_na.Init();
		tb_all.Init();
        tbList = new List<ToggleButton> {tb_all, tb_eu, tb_na};
        tb_eu.selected = true;
        m_areaIndex = 1;
        AddToggleButtonHandler();
		
		if (KBN._Global.IsLargeResolution ()) 
		{
			tb_eu.rect.width = 50;
			tb_na.rect.width = 50;
			tb_all.rect.width = 50;
		}
		else
		{
			tb_eu.rect.width = 55;
			tb_na.rect.width = 55;
			tb_all.rect.width = 55;
		}

		l_eu.Init();
		l_na.Init();
		l_all.Init();
        l_eu.txt = KBN.Datas.getArString("AVA.leaderboard_EUbtn");
		l_na.txt = KBN.Datas.getArString("AVA.leaderboard_NAbtn");
		l_all.txt = KBN.Datas.getArString("AVA.leaderboard_ALLbtn");

		page_navigator.Init();
        page_navigator.pageChangedHandler = new System.Action<int>(PageIndexChanged);

        selfRankItem.Init();

		individualItemTemplate.Init();
		allianceItemTemplate.Init();

		scrollList.itemDelegate = this;

        m_tabIndex = dataType.selectedIndex;

		SwitchIndex();
	}

	public void UpdateData(System.Object param)
	{

	}

    public void OnShow()
    {
        RequestAVALeaderboard(1);
    }

	public override void OnPopOver ()
	{
		base.OnPopOver ();
		scrollList.Clear();
		scrollList.ClearData2();
	}
	
	public override void Update ()
	{
		dataType.Update();

		scrollList.Update ();
		page_navigator.Update();
	}
	
	public override int Draw ()
	{
		GUI.BeginGroup(rect);
		dataType.Draw();

		tb_eu.Draw();
		tb_na.Draw();
		tb_all.Draw();
		l_eu.Draw();
		l_na.Draw();
		l_all.Draw();

		lblBackground.Draw();
		scrollList.Draw();
		DrawTips();

        selfRankItem.Draw();

		page_navigator.Draw();
		GUI.EndGroup();
		return -1;
	}

	private void DrawTips()
	{
		lblTipColumns.Draw();
		lblTipRank.Draw();
		lblTipName.Draw();
		lblTipScore.Draw();
		lblCutLine1.Draw ();
		lblCutLine2.Draw ();
	}
	
	public override void OnClear ()
	{
		base.OnClear ();

		scrollList.Clear();
	}

	public void handleItemAction(string action, object param)
	{
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

    private void PageIndexChanged(int index)
    {
        RequestAVALeaderboard(index);
    }

	private void IndexChanged(int index)
	{
		m_tabIndex = index;

		SwitchIndex();
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

            RequestAVALeaderboard(1);
        }
        AddToggleButtonHandler();
    }
    
    private void SwitchIndex()
    {
        scrollList.Clear();
        
        if (m_tabIndex == 0)
		{
            lblTipRank.txt = KBN.Datas.getArString("Alliance.members_performance_rank");
            lblTipName.txt = KBN.Datas.getArString("AVA.leaderboard_aliancebtn");
            lblTipScore.txt = KBN.Datas.getArString("AVA.lastAVArank_score");
			scrollList.Init(allianceItemTemplate);
		}
		else if (m_tabIndex == 1)
		{
            lblTipRank.txt = KBN.Datas.getArString("Alliance.members_performance_rank");
            lblTipName.txt = KBN.Datas.getArString("AVA.lastAVArank_alianceandplayer");
            lblTipScore.txt = KBN.Datas.getArString("AVA.lastAVArank_combatscore");
			scrollList.Init(individualItemTemplate);
		}

        RequestAVALeaderboard(1);
	}

    private void RequestAVALeaderboard(int page)
    {
        PBMsgReqAVA.PBMsgReqAVA request = ConstructRegMsg(page);
        KBN.UnityNet.RequestForGPB("ava.php", request, OnGetAVALeaderBoardOK, null, false);

//        Debug.Log("[RequestAVALeaderboard]" + page.ToString());
//        page_navigator.setShowPage(page);
    }

    private PBMsgReqAVA.PBMsgReqAVA ConstructRegMsg(int _page)
    {
        PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA();
        request.cmd = 6;
        if (m_tabIndex == 0)
        {
            request.subcmd = 3; // alliance
        }
        else if (m_tabIndex == 1)
        {
            request.subcmd = 4;
        }

        request.leaderboard = new PBMsgReqAVA.PBMsgReqAVA.Leaderboard();
        request.leaderboard.page = _page;
        request.leaderboard.pageSize = PAGESIZE;
        request.leaderboard.area = m_areaIndex;
        request.leaderboard.previous = 0;

        return request;
    }
    
    void OnGetAVALeaderBoardOK(byte[] data)
    {
        PBMsgAVALeaderBoard.PBMsgAVALeaderBoard avaRank = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVALeaderBoard.PBMsgAVALeaderBoard>(data);

        scrollList.SetData(avaRank.lblist);
        scrollList.ResetPos();

        int _pageCount = Mathf.CeilToInt(System.Convert.ToSingle(avaRank.total) / System.Convert.ToSingle(PAGESIZE));
        int _curPage = avaRank.page;
        if (_pageCount <= 0)
        {
            _pageCount = 0;
            _curPage = 0;
        }
        page_navigator.setPages(_curPage, _pageCount);

        UpdateSelfItemData(avaRank);
//        Debug.Log("[OnGetAVALeaderBoardOK]");
    }

    private void UpdateSelfItemData(PBMsgAVALeaderBoard.PBMsgAVALeaderBoard rankData)
    {
        selfRankItem.SetItemUIData(m_tabIndex, rankData);
    }
}
