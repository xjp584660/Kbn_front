using UnityEngine;
using System.Collections;
using System;
using KBN;

public class AvaRallyMarchInfo : ComposedUIObj
{
	public Button btn_back;
	public Label l_title;
	public Label l_img;
	
	public Label l_bg1;	
	
	public Label l_name;
//	public Label l_type;
	public Label l_status;
//	public Label l_tileType;
	public Label l_owner;
	public Label l_surving;
	public Label l_time;
	
	public ScrollList scroll_troop;
	public ListItem ins_troopItem;

	public	Label seperateLine;
	
	public Button btn_recall;
	public Button btn_speedup;

	protected NavigatorController nc;	

	public SimpleLabel line;

	private float buttonDefaultWidth;
	private float buttonSmallWidth;
	private	PBMsgAvaTileTroops.PBMsgAvaTileTroops.MarchInfo dataItem;
	
	public void Init(NavigatorController nc)
	{
		this.nc = nc;
		btn_back.OnClick = new Action<object>(buttonHandler);
		
		scroll_troop.Init(ins_troopItem);
		
		btn_recall.OnClick = new Action<object>(buttonHandler);
		btn_speedup.OnClick = new Action<object>(buttonHandler);
		
		btn_back.clickParam = "BACK";
		btn_recall.clickParam = "RECALL";
		btn_speedup.clickParam = "SPEEDUP";
		
		btn_recall.txt = Datas.getArString("Common.Recall");
		btn_speedup.txt = Datas.getArString("Common.Speedup");
		
		seperateLine.setBackground("between line", TextureType.DECORATION);
		line.setBackground("between line", TextureType.DECORATION);

		buttonDefaultWidth = 260f;
		buttonSmallWidth = 180f;
	}
	
	public void resetNC(NavigatorController nc)
	{
		this.nc = nc;
	}
	
	public void showMarchInfo(object param)
	{
		dataItem = param as PBMsgAvaTileTroops.PBMsgAvaTileTroops.MarchInfo;

		updateData ();
	}

	protected void updateData()
	{
		int curCityOrder = dataItem.cityOrder;
		
		int marchType = dataItem.marchType;
		if(marchType == Constant.MarchType.TRANSPORT || marchType == Constant.MarchType.REASSIGN)
		{
			l_img.useTile = true;
			l_img.tile = TextureMgr.instance().ElseIconSpt().GetTile("icon_transport");
			l_name.txt = Datas.getArString("Common.General") +": - ";
		}	
		else
		{
			l_img.useTile = true;
			l_img.tile = TextureMgr.instance().GeneralSpt().GetTile(General.getGeneralTextureName(dataItem.knightName, dataItem.cityOrder));

			if(dataItem.fromPlayerId == GameMain.singleton.getUserId())
			{
				l_name.txt = Datas.getArString("Common.General") +": " + General.singleton.getKnightShowName(dataItem.knightName, dataItem.cityOrder);
			}
			else
			{
				l_name.txt = Datas.getArString("Common.General") + ": " + General.getKnightNameByCityOrderAndName(dataItem.knightName, dataItem.cityOrder);
			}
		}

//		l_type.txt = Datas.getArString("Common.Type") +": " + AvaMarch.getMarchTypeString(dataItem.marchStatus);
		string status;
		if(marchType == Constant.MarchType.SURVEY && dataItem.marchStatus == Constant.AvaMarchStatus.OUTBOUND)
			status = Datas.getArString("Common.Surveying");
		else
			status = AvaMarch.getMarchStatusString(dataItem.marchStatus);
		l_status.txt = Datas.getArString("Common.Status") +": "  + status;
//		l_tileType.txt = AvaUtility.GetTileNameKey(GameMain.Ava.March.TileTroopInfo.tileType);
		l_owner.txt = Datas.getArString("Common.Owner") +": " + dataItem.fromPlayerName;
		l_surving.txt = Datas.getArString("Common.Surveying");
		l_surving.SetVisible(false);
		l_time.SetVisible(false);

		ArrayList listData = new ArrayList ();
		listData.AddRange (dataItem.heroList);
		listData.AddRange (dataItem.unitList);
		scroll_troop.Clear ();
		scroll_troop.SetData(listData.ToArray());
		scroll_troop.UpdateData();
		scroll_troop.ResetPos();
		
		int ms = dataItem.marchStatus;

		btn_recall.SetVisible(dataItem.fromPlayerId == Datas.singleton.tvuid());		
		btn_speedup.SetVisible(false);
		btn_recall.clickParam = "RECALL";
		btn_recall.txt = Datas.getArString("Common.Recall");

		l_title.txt =  AvaMarch.getMarchTypeString(dataItem.marchStatus) + "(" + GameMain.Ava.March.TileTroopInfo.xCoord + "," + GameMain.Ava.March.TileTroopInfo.yCoord + ")";
	}

	
	public override void Update()
	{
		base.Update();
	}
	
	public void buttonHandler(object clickParam)
	{
		string strParam = clickParam as string;
		switch(strParam)
		{
		case "STOP":
			break;
		case "SURVEY":
			break;
		case "OPENREWARD":
			break;
		case "BACK":
			nc.pop();	
			break;
		case "SPEEDUP":
			break;
		case "RECALL":	
			if(dataItem.marchType == Constant.AvaMarchType.RALLYREINFORCE || dataItem.marchType == Constant.AvaMarchType.REINFORCE)
			{
				GameMain.Ava.March.RequestMarchRecall(dataItem.marchId);
			}
			else
			{
				AvaBaseMarch march = GameMain.Ava.March.GetMarchById (dataItem.marchId);
				if(march != null)
				{
					GameMain.Ava.March.RequestMarchRecall(dataItem.marchId);
					GameMain.Ava.TileShare.AbandonTile(march.TileId);
				}			
			}
			MenuMgr.instance.PopMenu("");
			break;			
		}
	}
	
	public void Clear()
	{
		scroll_troop.Clear();
	}
}
