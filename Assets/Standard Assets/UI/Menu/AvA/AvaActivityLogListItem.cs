using UnityEngine;
using System;
using System.Collections;

public class AvaActivityLogListItem : ListItem {

	private static string[] icon_table = new string[] {
		"unused",
		"log_system",
		"log_system",
		"log_rally",
		"log_attack",
		"log_attack",
		"log_defense",
		"log_joinrally",
		"log_joinrally",
	};

	[SerializeField]
	private SimpleLabel lbTime;

	[SerializeField]
	private SimpleLabel lbIcon;

	[SerializeField]
	private SimpleLabel lbContent;

	[SerializeField]
	private SimpleButton btnGoDetail;

	[SerializeField]

	private SimpleButton btnShareReport;

	private AvaActivityLogDataItem data = null;

	public override void Init ()
	{
		base.Init ();

		btnGoDetail.Init();
		btnGoDetail.rect = rect;
		btnGoDetail.rect.x = 0;
		btnGoDetail.rect.y = 0;

		btnGoDetail.OnClick = new Action(OnGoDetailButton);

		lbTime.Init();
		lbIcon.Init();
		lbContent.Init();
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);

		lbTime.Draw();
		lbIcon.Draw();
		lbContent.Draw();

		btnGoDetail.Draw();

		btnShareReport.Draw();

		GUI.EndGroup();

		return -1;
	}

	public override void SetRowData (object data)
	{
		base.SetRowData (data);

		this.data = data as AvaActivityLogDataItem;
		lbTime.txt = "[" + this.data.TimeString + "]";
		lbIcon.mystyle.normal.background = TextureMgr.singleton.LoadTexture(icon_table[this.data.Type], TextureType.DECORATION);
		lbContent.txt = this.data.ColoredString;

		if(this.data.sharePlayerId!=0&&this.data.reportId!=0)
		{
          btnShareReport.SetVisible(true);
		  btnShareReport.txt =  "<color=#1e90ffff>" + KBN.Datas.getArString("AVA.WarRoomLog_BattleReport") + "</color>";
		  rect.height = 100;
		  btnShareReport.rect = new Rect(110,rect.height-30,rect.width,30);
		  btnShareReport.OnClick = new Action(OnShareReportWarRoom);
		}else{
		  btnShareReport.SetVisible (false)  ;
		}
	}

	private void OnGoDetailButton()
	{
		if (data.TileXCoord > 0 && data.TileYCoord > 0
		    && data.TileXCoord <= Constant.Map.AVA_MINIMAP_WIDTH
		    && data.TileYCoord <= Constant.Map.AVA_MINIMAP_HEIGHT)
		{
			this.handlerDelegate.handleItemAction("GotoTile", data);
		}
	}

	private void OnShareReportWarRoom()
	{
		if(this.data.sharePlayerId!=0&&this.data.reportId!=0)
		{
	    KBN.UnityNet.getAvaReportData(data.sharePlayerId,data.reportId,KBN.Datas.singleton.worldid(),data.EventId,OnShareWarRoomOkFunc,null);
		}
	}

	private void OnShareWarRoomOkFunc(HashObject result)
	{
       if (KBN._Global.GetBoolean(result["ok"]))
			{
		 		Hashtable obj = new Hashtable();
		   		KBN.MenuMgr.instance.PushMenu("EmailMenu",obj,"trans_immediate");

				KBN.MenuMgr.instance.GetMenuToCallFunc("EmailMenu",(KBNMenu menu)=>{
					ComposedMenu cm = menu as ComposedMenu;
					Hashtable data = new Hashtable();
					data["type"] = 1;
					data["index"] = 0;
					data["isSys"] = false;
					data["otherData"] = result;
					data["senderID"] = this.data.sharePlayerId;
		    	    cm.ClickShareReport(data);	
				});
		        //object data = new object[]{"type": EmailMenu.REPORT_TYPE, "index":0,"isSys":false,"otherData":result,"senderID":senderId};
				
			}
	}

}
