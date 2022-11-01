using UnityEngine;
using System;
using System.Text;
using System.Collections;

using _Global = KBN._Global;
using GameMain = KBN.GameMain;
using Datas = KBN.Datas;
using OutpostTroopsDeployment = KBN.OutpostTroopsDeployment;

public class OutpostTroopsMovementListItem : FullClickItem {

	[SerializeField]
	private SimpleLabel lbIcon;

	[SerializeField]
	private SimpleLabel lbInfos;

	[SerializeField]
	private SimpleButton btnRecall;

	[SerializeField]
	private SimpleButton btnDetail;

	[SerializeField]
	private SimpleLabel lbSeparator;

	private OutpostTroopsDeployment.MarchData cachedDeployData;
	private AvaBaseMarch cachedMarchData;

	private static StringBuilder sharedSb = new StringBuilder();

	public override void Init ()
	{
		base.Init ();

		btnDefault.alpha = 0.3f;

		btnRecall.EnableBlueButton(true);
		btnRecall.txt = Datas.getArString("Common.Recall");
		btnRecall.OnClick = new Action(OnRecallButton);
		
		btnDetail.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_moreinfo_small2_normal", TextureType.BUTTON);
		btnDetail.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_moreinfo_small2_down", TextureType.BUTTON);
		btnDetail.OnClick = new Action(OnDetailButton);
		btnDefault.OnClick = new Action(OnDetailButton);

		lbSeparator.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line_list_small", TextureType.DECORATION);
	}

	public override int Draw ()
	{
		if (!visible) 
			return -1;

		GUI.BeginGroup(rect);

		lbIcon.Draw();
		lbInfos.Draw();
		btnRecall.Draw();
		btnDetail.Draw();
		lbSeparator.Draw();

		GUI.EndGroup();

		base.Draw();

		return -1;
	}

	public override void SetRowData (object data)
	{
		base.SetRowData (data);

		cachedDeployData = data as OutpostTroopsDeployment.MarchData;
		cachedMarchData = data as AvaBaseMarch;

		if (null != cachedDeployData) {

			lbIcon.useTile = true;
			lbIcon.tile = TextureMgr.singleton.GeneralSpt().GetTile(cachedDeployData.knightTexName);

			btnRecall.SetVisible(GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Prepare);

			lbInfos.txt = string.Format("{0}\n\n{1}", 
			                            Datas.getArString("Common.Deploy"), 
			                            (btnRecall.isVisible() ? 
			                            	_Global.GUIClipToWidth(lbInfos.mystyle, cachedDeployData.knightShowName, 220, "...", null) : 
			                            	cachedDeployData.knightShowName));


		} else if (null != cachedMarchData) {

			lbIcon.useTile = true;
			lbIcon.tile = TextureMgr.singleton.GeneralSpt().GetTile(
				cachedMarchData.Type == Constant.AvaMarchType.SCOUT ? 
				"timg_6" : 
				cachedMarchData.KnightTextureName);

			UpdateAvaMarchData();

		} else {
            lbIcon.useTile = false;
            lbIcon.tile = null;

            lbInfos.txt = string.Empty;
            btnRecall.SetVisible(false);
        }
	}

	private void UpdateAvaMarchData()
	{
		if (null == cachedMarchData)
			return;

        AvaRallyAttack rallyAttack = cachedMarchData as AvaRallyAttack;

		if (cachedMarchData.Type == Constant.AvaMarchType.RALLYATTACK && null != rallyAttack && null != rallyAttack.MarchData.rallyAttackInfo)
		{
            var cachedData = new AvaRallySummaryInfo(rallyAttack);
			sharedSb.Length = 0;
			sharedSb.AppendFormat(Datas.getArString("AVA.Coop_RallyAttackDesc"), cachedData.StarterPlayerName, cachedData.TargetTileTypeName);
			sharedSb.Append('\n');
			
			var unixTime = GameMain.unixtime();
			string timeStr;
			
			var time = cachedData.LeavingTime - unixTime;
			if (time >= 0)
			{
				sharedSb.Append(Datas.getArString("AVA.coop_ralllyinfo_marchsetouttime"));
			}
			else
			{
				sharedSb.Append(Datas.getArString("AVA.Coop_MarchArriveIn"));
				time = cachedData.BattleTime - unixTime;
			}
			sharedSb.Append(" ");
			time = time > 0 ? time : 0;
			timeStr = _Global.timeFormatStr(time);
			
			sharedSb.AppendFormat("<color={0}>{1}</color>", _Global.ColorToString(FontMgr.GetColorFromTextColorEnum(FontColor.Button_White)), timeStr);
			sharedSb.Append('\n');
			
			sharedSb.Append(Datas.getArString("AVA.coop_ralllyinfo_troopsdonated"));
			sharedSb.Append(" ");
			sharedSb.Append(_Global.NumFormat(cachedData.TroopCount));
			sharedSb.Append('\n');
			
			sharedSb.Append(Datas.getArString("AVA.coop_ralllyinfo_marchslots"));
			sharedSb.Append(" ");
			sharedSb.AppendFormat("{0}/{1}", cachedData.CurMarchSlotCnt, cachedData.MaxMarchSlotCnt);

			lbInfos.txt = sharedSb.ToString();

			btnRecall.SetVisible(false);
		}
		else
		{
			string statusAndTime = cachedMarchData.GetStatusString(true);
			if (cachedMarchData.Status != Constant.AvaMarchStatus.DEFENDING)
				statusAndTime += "(" +  _Global.timeFormatStr(cachedMarchData.LeftTime) + ")";
			
			btnRecall.SetVisible(cachedMarchData.Status == Constant.AvaMarchStatus.DEFENDING);

			lbInfos.txt = string.Format("{0}\n{1}\n<color=white>{2}</color>", 
			                            cachedMarchData.GetTypeString(), 
			                            (btnRecall.isVisible() ? 
			                            	_Global.GUIClipToWidth(lbInfos.mystyle, statusAndTime, 220, "...", null) : 
			                            	statusAndTime),
			                            cachedMarchData.GetTileCoordStr());
		}
	}

	private float lastUpdateTime = 0.0f;
	public override void Update ()
	{
		base.Update ();

		if (Time.realtimeSinceStartup - lastUpdateTime > 0.5f) {
			lastUpdateTime = Time.realtimeSinceStartup;
			UpdateAvaMarchData();
		}

		if (null != cachedDeployData) {
			
			// check if need refresh march list
			int status = _Global.INT32(cachedDeployData.rawData["marchStatus"]);
			if (status != Constant.MarchStatus.DEFENDING && null != handlerDelegate) {
				handlerDelegate.handleItemAction("RefreshList", null);
			}
			btnRecall.SetVisible(GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Prepare);
		}
	}


	private void OnRecallButton()
	{
		if (null != cachedDeployData) {

			if (null != handlerDelegate)
				handlerDelegate.handleItemAction("OnRecall", cachedDeployData);

		} else if (null != cachedMarchData) {
			if (null != cachedMarchData && cachedMarchData.Status == Constant.AvaMarchStatus.DEFENDING)
			{
				if(cachedMarchData.Type == Constant.AvaMarchType.RALLYREINFORCE || cachedMarchData.Type == Constant.AvaMarchType.REINFORCE)
				{
					GameMain.Ava.March.RequestMarchRecall(cachedMarchData.MarchId);
				}
				else
				{
					GameMain.Ava.March.RequestMarchRecall(cachedMarchData.MarchId);
					GameMain.Ava.TileShare.AbandonTile(cachedMarchData.TileId);
				}
			}
		}
	}

	private void OnDetailButton()
	{
		if (null != handlerDelegate) {
			if (null != cachedDeployData)
				handlerDelegate.handleItemAction("OnClick", cachedDeployData);
			if (null != cachedMarchData)
				handlerDelegate.handleItemAction("OnClick", cachedMarchData);
		}
	}
}
