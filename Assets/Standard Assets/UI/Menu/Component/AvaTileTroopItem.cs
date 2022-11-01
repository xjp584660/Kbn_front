using UnityEngine;
using System.Collections;
using System;
using KBN;

public class AvaTileTroopItem : ListItem{
	public	Label l_Line;
	public	Label generalLabel;
	public	Label allianceLabel;
	public	Label fromLabel;
	public  Button btnDefault;
	
	private	PBMsgAvaTileTroops.PBMsgAvaTileTroops.MarchInfo dataItem;
	
	public override void SetRowData(object data){
		this.dataItem = data as PBMsgAvaTileTroops.PBMsgAvaTileTroops.MarchInfo;
		
		btnDefault.OnClick = new Action<object>(onSelected);
		btnDefault.clickParam = "view";
		btnDefault.rect = new Rect(30, 20, rect.width-45, rect.height - 30);
		l_Line.setBackground("between line_list_small",TextureType.DECORATION);

		if(dataItem.fromPlayerId == GameMain.singleton.getUserId())
		{
			generalLabel.txt = Datas.getArString("Common.General") + ": " + General.singleton.getKnightShowName(dataItem.knightName, dataItem.cityOrder);
		}
		else
		{
			generalLabel.txt = Datas.getArString("Common.General") + ": " + General.getKnightNameByCityOrderAndName(dataItem.knightName, dataItem.cityOrder);
		}
		allianceLabel.txt = Datas.getArString("Common.Player") + ": " + dataItem.fromPlayerName;
		fromLabel.txt = Datas.getArString ("Common.From") + ": " + dataItem.fromXCoord + "," + dataItem.fromYCoord;
		
		icon.useTile = true;
		icon.tile = TextureMgr.instance().GeneralSpt().GetTile(General.getGeneralTextureName(dataItem.knightName, dataItem.cityOrder));

		btnSelect.SetDisabled(false);
		btnSelect.SetVisible(true);
		btnDefault.SetDisabled(false);
		btnDefault.SetVisible(true);		
		btnSelect.OnClick = new Action<object>(onSelected);
	}
	protected void onSelected(object cp)
	{
		if(handlerDelegate != null)
		{
			handlerDelegate.handleItemAction("", dataItem);
		}
	}
	public override int Draw(){
		GUI.BeginGroup(rect);
		Color oldColor = GUI.color;
		GUI.color = new Color(0f, 0f, 0f, 0.4f);	
		btnDefault.Draw();
		GUI.color = oldColor;
		l_Line.Draw();
		icon.Draw();
		generalLabel.Draw();
		allianceLabel.Draw();
		fromLabel.Draw();
		btnSelect.Draw();
		GUI.EndGroup();		
		return -1;
	}
}

