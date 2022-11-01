using UnityEngine;
using System;
using System.Collections;

using KBN;

public class RotatorItem : ListItem {


	[SerializeField]
	private SimpleLabel lbImage;
	[SerializeField]
	private SimpleLabel lbTitle;
//	[SerializeField]
//	private SimpleLabel lbDesc;
//	[SerializeField]
//	private SimpleButton btnGoto;

	public override void Init ()
	{
		base.Init ();

//		btnGoto.EnableBlueButton(true);
//		btnGoto.txt = Datas.getArString("Common.View");
	}

	public override void SetRowData (object data)
	{
		base.SetRowData (data);
		Notice notice = data as Notice;
		if (null == notice)
			return;

		lbImage.useTile = false;
		if (string.IsNullOrEmpty(notice.EmbedImage))
		{
			lbImage.SetVisible(true);
			lbImage.setBackground("Default", TextureType.CHAT_SALE);
		}
		else
		{
			lbImage.SetVisible(true);
			lbImage.setBackground(notice.EmbedImage, TextureType.CHAT_SALE);
		}

		lbTitle.txt = notice.Title;
//		lbDesc.txt = "                " + notice.Detail;
//
//		btnGoto.OnClick = new Action(delegate () {
////			OnBtnGoto(notice);
//		});
	} 


	public override int Draw ()
	{
		if (!visible) 
			return -1;

		GUI.BeginGroup(rect);

		lbImage.Draw();

		lbTitle.Draw();
//		lbDesc.Draw();
//		btnGoto.Draw();


		GUI.EndGroup();

		return -1;
	}
}
