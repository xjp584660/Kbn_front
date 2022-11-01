using UnityEngine;
using System.Collections;
using System;
using KBN;

public class AllianceLeaderBoardItem : FullClickItem {
	private LeaderBoardItemInfo itemData;

	[SerializeField] private SimpleLabel rank;
	[SerializeField] private SimpleLabel name;
	[SerializeField] private SimpleLabel score;
	[SerializeField] private float lineY;

	public Action<LeaderBoardItemInfo> clickFunc {
		set;
		get;
	}
	
	public override void Init()
	{
		base.Init();
		line.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("between line_list_small", TextureType.DECORATION);
		line.rect.y = lineY;
	}
	
	public override void OnPopOver()
	{
		base.OnPopOver();
	}
	
	public override int Draw()
	{
		base.Draw ();
		GUI.BeginGroup(rect);
		rank.Draw ();
		name.Draw ();
		score.Draw ();
		line.Draw ();
		GUI.EndGroup();
		return -1;
	}
	
	public override void Update()
	{
	}
	
	public override void SetRowData(object data)
	{
		itemData = data as LeaderBoardItemInfo;
		btnDefault.OnClick = new Action(OnClick);
		rank.txt = itemData.rank+"";
		name.txt = itemData.displayName;
		score.txt = itemData.score+"";
	}
	
	private void OnClick()
	{
		if(clickFunc != null)
			clickFunc (itemData);
	}
}
