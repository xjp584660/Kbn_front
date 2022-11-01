using UnityEngine;
using System.Collections;
using System;
using KBN;
public class AvAEventItem : ListItem 
{
	public SimpleLabel sl_Line;

	public override int Draw ()
	{
		GUI.BeginGroup(rect);
		title.Draw();
		icon.Draw();	
		description.Draw();
		btnSelect.Draw();
		sl_Line.Draw ();
		GUI.EndGroup();
		return 1;
	}

	public override void SetRowData(object param)
	{
		sl_Line.setBackground ("between line_list_small", TextureType.DECORATION);
		btnSelect.changeToBlueNew ();
		btnSelect.OnClick = new Action<object>(OnDetailClick);
		btnSelect.txt = Datas.getArString ("AVA.details_lastAVAresultcheckbtn");
		icon.setBackground ("ava_icon_last_result", TextureType.ICON);
		title.txt = Datas.getArString ("AVA.details_lastAVAresulttitle");
		description.txt = Datas.getArString ("AVA.details_lastAVAresultdesc");
	}

	private void OnDetailClick(object param)
	{
		if( handlerDelegate != null )
		{
			handlerDelegate.handleItemAction(Constant.Action.AVA_LASTRESULT,null);
		}
	}

}
