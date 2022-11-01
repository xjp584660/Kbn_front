using UnityEngine;
using System;
using System.Collections;

using Datas = KBN.Datas;
using GameFramework;

public class OutpostSkillListItem : FullClickItem
{

	[SerializeField]
	private SimpleLabel lbIcon;
	[SerializeField]
	private SimpleLabel lbTitle;
	[SerializeField]
	private SimpleLabel lbDesc;
	[SerializeField]
	private SimpleButton btnDetail;
	[SerializeField]
	private SimpleLabel lbSeparator;

    private AvaPlayerSkillItem m_Data;

	public override void Init ()
	{
		base.Init();

//		lbIcon
        btnDefault.alpha = 0.3f;
		btnDetail.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_moreinfo_small2_normal", TextureType.BUTTON);
		btnDetail.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_moreinfo_small2_down", TextureType.BUTTON);
		btnDetail.OnClick = new Action<object>(OnDetailButton);
        btnDefault.OnClick = new Action<object>(OnDetailButton);

		lbSeparator.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line_list_small", TextureType.DECORATION);
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

        base.Draw();

		GUI.BeginGroup(rect);
		lbIcon.Draw();
		lbTitle.Draw();
		lbDesc.Draw();
		btnDetail.Draw();
		lbSeparator.Draw();
		GUI.EndGroup();

		return -1;
	}

	public override void SetRowData (object data)
	{
        m_Data = data as AvaPlayerSkillItem;
        if (m_Data == null)
        {
            throw new ArgumentNullException("data");
        }

		lbIcon.useTile = true;
		lbIcon.tile = m_Data.Icon;
        lbTitle.txt = string.Format("{0} <color=white>(Lv {1})</color>", m_Data.Name, m_Data.Level);
        lbDesc.txt = m_Data.Description;
	}

    private void OnDetailButton(object param)
	{
		if (null != handlerDelegate)
			handlerDelegate.handleItemAction("OnDetailButton", m_Data);
	}
}
