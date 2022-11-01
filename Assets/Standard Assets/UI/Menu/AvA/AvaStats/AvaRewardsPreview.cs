using UnityEngine;
using System.Collections;
using KBN;

public class AvaRewardsPreview : PopMenu {

	[SerializeField]
	private SimpleLabel lbTitle;
	[SerializeField]
	private SimpleLabel lbSeparator;
	[SerializeField]
	private ScrollView scrollView;
	[SerializeField]
	private AvaRewardsPreviewInnerPanel innerPanel;
	[SerializeField]
	private ToolBar toolBar;
	[SerializeField]
	private ScrollView modeScrollView;
	[SerializeField]
	private AvaRewardsPreviewInnerPanel innerModePanel;

	public override void Init ()
	{
		base.Init ();

		lbTitle.txt = Datas.getArString("AVA.Reward_Preview_Title");
		lbSeparator.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line", TextureType.DECORATION);

		scrollView.Init();
		modeScrollView.Init();

		toolBar.Init();
		toolBar.toolbarStrings = new string[] { KBN.Datas.getArString("AVA.Loading_title"), KBN.Datas.getArString("GWWonder.Detail_Title") };
		toolBar.indexChangedFunc = OnTabIndexChanged;
	}

	private void OnTabIndexChanged(int index)
    {
        if (index == 0) // passMission quest
        {
			innerPanel.SetUIData(data);

			scrollView.AutoLayout();
			scrollView.MoveToTop();
        }
        else if(index == 1)
        {
			innerModePanel.SetModeUIData(null);
			modeScrollView.AutoLayout();
			modeScrollView.MoveToTop();
        }
    }

	private object data;
	public override void OnPush (object param)
	{
		base.OnPush (param);
		data = param;
		var table = param as Hashtable;
		if (null != table && _Global.GetBoolean(table["league"]))
		{
			lbTitle.txt = Datas.getArString("AVA.LeagueInfo_Title");
		}
		else
		{
			lbTitle.txt = Datas.getArString("AVA.Reward_Preview_Title");
		}
		OnTabIndexChanged(0);
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();

		lbTitle.Draw();
		lbSeparator.Draw();
		toolBar.Draw();

		switch (toolBar.selectedIndex)
        {
            case 0:
				scrollView.Draw();
                break;
            case 1:
				modeScrollView.Draw();
                break;
            default:
                break;
        }		
	}

	public override void Update ()
	{
		base.Update ();

		toolBar.Update();
        switch (toolBar.selectedIndex)
        {
            case 0:
				scrollView.Update();
                break;
            case 1:
				modeScrollView.Update();
                break;
            default:
                break;
        }
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

		innerPanel.OnPopOver();
		innerModePanel.OnPopOver();
	}
}
