using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;
using ProgressArrow = OutpostTabMyTroopsHideProgressArrow;

public class OutpostTabMyTroopsHide : UIObject {
	
	[SerializeField]
	private SimpleLabel lbFrame;
	[SerializeField]
	private SimpleLabel lbFrameHeader;

	[SerializeField]
	private SimpleLabel lbTitle;
	[SerializeField]
	private SimpleLabel lbDesc;

	[SerializeField]
	private SimpleLabel lbLine1;
	[SerializeField]
	private SimpleLabel lbLine2;

	[SerializeField]
	private SimpleLabel lbPercent;
	[SerializeField]
	private SimpleLabel lbTime;
	
	[SerializeField]
	private SimpleLabel lbProgressBg;
	[SerializeField]
	private SimpleLabel lbProgress;

	[SerializeField]
	private ProgressArrow arrowTemplate;

	[SerializeField]
	private SimpleButton btnHide;
	
	[SerializeField]
	private SimpleLabel lbCurrent;

	private List<ProgressArrow> arrows;

	private bool troopsHidden = false;

	public override void Init ()
	{
		base.Init ();

		lbFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
		lbFrameHeader.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);

		lbTitle.txt = Datas.getArString("AVA.Outpost_HideTroops_Title");
		lbDesc.txt = Datas.getArString("AVA.Outpost_HideTroops_Description");

		lbLine1.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line_list_small", TextureType.DECORATION);
		lbLine2.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line_list_small", TextureType.DECORATION);

		lbPercent.txt = Datas.getArString("AVA.Outpost_HideTroops_HideRateDisplay");
		lbTime.txt = Datas.getArString("AVA.Outpost_HideTroops_Time");

		lbProgressBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("lv_The-progress-bar2_HD", TextureType.DECORATION);
		lbProgress.mystyle.normal.background = TextureMgr.singleton.LoadTexture("lv_The-progress-bar1_HD", TextureType.DECORATION);

		arrowTemplate.Init();

		btnHide.EnableBlueButton(true);

		lbCurrent.txt = Datas.getArString("AVA.Outpost_HideTroops_HideRate");
	}
	
	public override void SetUIData (object data)
	{
		base.SetUIData (data);

		var config = GameMain.Ava.Units.HideTroopsConfig;
		var timePoints = GameMain.Ava.Units.HideTroopsTimePoints;

		int duration = GameMain.Ava.Units.HideTroopsDuration;

		arrows = new List<ProgressArrow>();

		for (int i = 0; i < timePoints.Count; i++)
		{
			ProgressArrow arrow = GameObject.Instantiate(arrowTemplate) as ProgressArrow;
			arrow.Percentage = config[timePoints[i]] + "%";
			arrow.Time = _Global.timeFormatAbridged(timePoints[i]);

			if (duration <= 0)
			{
				arrow.rect.x = 0;
			}
			else
			{
				arrow.rect.x = lbProgressBg.rect.x + 6 + (float)timePoints[i] / duration * (lbProgressBg.rect.width - 12);
			}

			arrows.Add(arrow);
		}

		UpdateUIState();
	}

	float lastUpdateTime = 0.0f;
	public override void Update ()
	{
		base.Update ();

		if (troopsHidden != GameMain.Ava.Units.IsTroopsHidden)
		{
			troopsHidden = GameMain.Ava.Units.IsTroopsHidden;
			UpdateUIState();
		}

		float time = Time.realtimeSinceStartup;
		if (time - lastUpdateTime > 0.5f)
		{
			lastUpdateTime = time;
			SetProgress(GameMain.Ava.Units.CurrentHideTroopsProgress);
			lbCurrent.txt = string.Format(Datas.getArString("AVA.Outpost_HideTroops_HideRate"), GameMain.Ava.Units.CurrentHideTroopsRate);
		}
	}

	private void SetProgress(float progress)
	{
		progress = Mathf.Clamp01(progress);
		if (progress < 0.1f && progress != 0.0f)
			progress = 0.1f;
		lbProgress.rect.width = Mathf.Ceil(lbProgressBg.rect.width * progress);
		int border = Mathf.Clamp((int)(lbProgress.rect.width * 0.5f), 0, 20);
		lbProgress.mystyle.border.left = border;
		lbProgress.mystyle.border.right = border;
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);

		lbFrame.Draw();
		lbFrameHeader.Draw();
		
		lbTitle.Draw();
		lbDesc.Draw();
		
		lbLine1.Draw();
		lbLine2.Draw();
		
		lbPercent.Draw();
		lbTime.Draw();
		
		lbProgressBg.Draw();
		lbProgress.Draw();

		if (null != arrows)
		{
			for (int i = 0; i < arrows.Count; i++)
			{
				arrows[i].Draw();
			}
		}
		
		btnHide.Draw();

		if (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Combat)
		{
			lbCurrent.Draw();
		}
		
		GUI.EndGroup();
		
		return -1;
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

		if (null != arrows) {
			for (int i = 0; i < arrows.Count; i++)
			{
				TryDestroy(arrows[i]);
			}
			arrows = null;
		}
	}

	private void UpdateUIState()
	{
		if (troopsHidden)
		{
			btnHide.txt = Datas.getArString("AVA.Outpost_HideTroops_UNhideButton");
			btnHide.OnClick = new System.Action(OnBtnUnhide);
			lbProgress.mystyle.normal.background = TextureMgr.singleton.LoadTexture("lv_The-progress-bar1_HD", TextureType.DECORATION);
		}
		else
		{
			btnHide.txt = Datas.getArString("AVA.Outpost_HideTroops_HideButton");
			btnHide.OnClick = new System.Action(OnBtnHide);
			lbProgress.mystyle.normal.background = TextureMgr.singleton.LoadTexture("lv_The-progress-bar1_grey_HD", TextureType.DECORATION);
		}
	}

	private void OnBtnHide()
	{
		if (GameMain.Ava.Event.CurStatus != AvaEvent.AvaStatus.Combat)
		{
			KBN.ErrorMgr.singleton.PushError(string.Empty, Datas.getArString("AVA.Outpost_HideTroops_CantClick"));
			return;
		}
		GameMain.Ava.Units.RequestHideTroops();
	}

	private void OnBtnUnhide()
	{
		if (GameMain.Ava.Event.CurStatus != AvaEvent.AvaStatus.Combat)
		{
			KBN.ErrorMgr.singleton.PushError(string.Empty, Datas.getArString("AVA.Outpost_HideTroops_CantClick"));
			return;
		}
		GameMain.Ava.Units.RequestUnhideTroops();
	}

}
