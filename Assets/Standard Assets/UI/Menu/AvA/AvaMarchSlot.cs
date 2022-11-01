using UnityEngine;
using System;
using System.Collections;

using _Global = KBN._Global;
using GameMain = KBN.GameMain;
using Datas = KBN.Datas;

public class AvaMarchSlot : ListItem {

	[SerializeField]
	private ProgressBar progressBar;

	private AvaBaseMarch cachedData = null;
	private int lastMarchStatus = -1;

	public override void Init ()
	{
		base.Init ();
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);

		progressBar.Draw();
		title.Draw();
		btnSelect.Draw();

		GUI.EndGroup();

		return -1;
	}

	public override void UpdateData ()
	{
		base.UpdateData ();

		if (null == cachedData)
			return;

		UpdateTitle();

		switch (cachedData.Status) {
		case Constant.AvaMarchStatus.OUTBOUND:
		case Constant.AvaMarchStatus.RETURNING:
			
			btnSelect.SetVisible(true);
			btnSelect.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_speed up_green_normal", TextureType.DECORATION);
			btnSelect.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_speed up_green_down", TextureType.DECORATION);
			btnSelect.txt = Datas.getArString("Common.Speedup");
			btnSelect.OnClick = new Action(OnSpeedUpButton);
			break;

		case Constant.AvaMarchStatus.DEFENDING:

			btnSelect.SetVisible(true);
			btnSelect.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_speed_up_Brown_normal", TextureType.BUTTON);
			btnSelect.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_speed_up_Brown_down", TextureType.BUTTON);
			btnSelect.txt = Datas.getArString("Common.Recall");
			btnSelect.OnClick = new Action(OnRecallButton);
			break;

        default:
            btnSelect.SetVisible(false);
            break;
		}

		if (!btnSelect.isVisible())
		{
			progressBar.rect.width = rect.width;
            title.rect.width = rect.width - title.rect.x;
		}
		else
		{
			progressBar.rect.width = btnSelect.rect.x + 2;
            title.rect.width = rect.width - title.rect.x - btnSelect.rect.width;
		}

		lastMarchStatus = cachedData.Status;

		progressBar.SetCurValue(cachedData.Progress);
	}

	public override bool willBeRemoved ()
	{
		return (null == cachedData) || cachedData.Status == Constant.AvaMarchStatus.INACTIVE || cachedData.Status == Constant.AvaMarchStatus.DELETED;
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);

		cachedData = data as AvaBaseMarch;
		if (null == cachedData)
			return;

		btnSelect.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_speed up_green_normal", TextureType.DECORATION);
		btnSelect.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_speed up_green_down", TextureType.DECORATION);
		btnSelect.txt = Datas.getArString("Common.Speedup");

		
		if ( _Global.IsLargeResolution() )
		{
			this.rect.height = 68;
			this.rect.width = 965;
			progressBar.rect.x = 0;

			title.rect.x = 6;

            title.SetFont(FontSize.Font_32);
			title.rect.width = 500;
			btnSelect.SetFont(FontSize.Font_32);
			btnSelect.rect.width=170;
			btnSelect.rect.x = this.rect.width - btnSelect.rect.width;
		}
		else
		{
			this.rect.height = 57;
			this.rect.width = 590;
			progressBar.rect.x = 0;
			title.rect.x = 6;

			title.SetFont(FontSize.Font_18);
			title.rect.width = 380;
			btnSelect.SetFont(FontSize.Font_20);
			btnSelect.rect.width=110;
			btnSelect.rect.x = this.rect.width - btnSelect.rect.width;
		}

		btnSelect.rect.x = this.rect.width - btnSelect.rect.width;
		progressBar.rect.width = this.rect.width - btnSelect.rect.width - progressBar.rect.x;
		progressBar.rect.height = this.rect.height;
		btnSelect.rect.height = this.rect.height;
		title.rect.height = this.rect.height;
        title.rect.width = this.rect.width - title.rect.x - btnSelect.rect.width;
		progressBar.Init();

		UpdateData();
	}

	private int cachedStatus = Constant.AvaMarchStatus.DELETED;
	private string cachedStatusString = string.Empty;
	private void UpdateTitle()
	{
		if (cachedStatus != cachedData.Status) {
			cachedStatus = cachedData.Status;
			cachedStatusString = cachedData.GetStatusString(true);
		}
		title.txt = cachedStatusString;
		if (cachedData.Status == Constant.AvaMarchStatus.OUTBOUND ||
		    cachedData.Status == Constant.AvaMarchStatus.RETURNING ||
		    cachedData.Status == Constant.AvaMarchStatus.RALLYING)
		{
			title.txt += "(" + _Global.timeFormatStr(cachedData.LeftTime) + ")";
		}
	}

	private void OnSpeedUpButton()
	{
		AvaSpeedUp.AvaSpeedUpData data = new AvaSpeedUp.AvaSpeedUpData ();
		data.type = Constant.AvaSpeedUpType.AvaMarchSpeedUp;
		data.id = cachedData.MarchId;
		data.endTime = cachedData.EndTime;
		data.startTime = cachedData.StartTime;
		data.origTotalTime = cachedData.OrigTotalTime;
		KBN.MenuMgr.instance.PushMenu ("AvaSpeedUpMenu",data,"trans_zoomComp");

	}

	private void OnRecallButton()
	{
		if (null != cachedData && cachedData.Status == Constant.AvaMarchStatus.DEFENDING)
		{
			if(cachedData.Type == Constant.AvaMarchType.RALLYREINFORCE || cachedData.Type == Constant.AvaMarchType.REINFORCE)
			{
				GameMain.Ava.March.RequestMarchRecall(cachedData.MarchId);
			}
			else
			{
				GameMain.Ava.March.RequestMarchRecall(cachedData.MarchId);
				GameMain.Ava.TileShare.AbandonTile(cachedData.TileId);
			}
		}
	}
}
