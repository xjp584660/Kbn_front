using UnityEngine;
using System.Collections;
using System.Text;
using System;
using General = KBN.General;
using _Global = KBN._Global;
using Datas = KBN.Datas;
using GameMain = KBN.GameMain;
using MenuMgr = KBN.MenuMgr;

public class AvaCoopRallyItem : FullClickItem
{
    [SerializeField]
    private SimpleLabel lblKnightPortrait;
    [SerializeField]
    private SimpleLabel lblDisplayText;
    [SerializeField]
    private SimpleLabel lblArrow;
    [SerializeField]
    private FontColor timeColor;

    private AvaRallySummaryInfo cachedData;
    private string timeColorCode;
    private static StringBuilder sharedSb = new StringBuilder();

    public const float TextUpdatePeriod = 1f;
    private float textLastUpdateTime = 0f;

    public override void Init()
    {
        base.Init();
        lblArrow.setBackground("button_moreinfo_small2_normal", TextureType.BUTTON);
        this.line.setBackground("between line_list_small", TextureType.DECORATION);
        timeColorCode = _Global.FontColorEnumToString(timeColor);

        this.btnDefault.rect = new Rect(0f, 0f, this.rect.width, this.rect.height);
        this.btnDefault.alpha = .3f;
        this.btnDefault.OnClick = new Action<object>(OnClickItem);
    }

    public override void SetRowData(object data)
    {
        cachedData = data as AvaRallySummaryInfo;

        if (cachedData == null)
        {
            return;
        }

        SetKnightPortrait();
        UpdateDisplayText();
    }

    public override int Draw()
    {
        base.Draw();
        GUI.BeginGroup(this.rect);
        lblKnightPortrait.Draw();
        lblDisplayText.Draw();
        lblArrow.Draw();
        GUI.EndGroup();
        return -1;
    }

    public override void Update()
    {
        base.Update();

        if (Time.time - textLastUpdateTime > TextUpdatePeriod)
        {
            UpdateDisplayText();
            textLastUpdateTime = Time.time;
        }
    }

    private void SetKnightPortrait()
    {
        var knightName = cachedData.GeneralName;
        var cityOrder = cachedData.CityOrder;
        var textureName = General.getGeneralTextureName(knightName, cityOrder);
        lblKnightPortrait.tile = TextureMgr.instance().IconSpt().GetTile(textureName);
    }

    private void UpdateDisplayText()
    {
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

        sharedSb.AppendFormat("<color={0}>{1}</color>", this.timeColorCode, timeStr);
        sharedSb.Append('\n');

        sharedSb.Append(Datas.getArString("AVA.coop_ralllyinfo_troopsdonated"));
        sharedSb.Append(" ");
        sharedSb.Append(_Global.NumFormat(cachedData.TroopCount));
        sharedSb.Append('\n');

		bool full = cachedData.CurMarchSlotCnt >= cachedData.MaxMarchSlotCnt;
		if (!full)
			sharedSb.Append("<color=#F87600>");
		else
			sharedSb.Append("<color=#F3143E>");
        sharedSb.Append(Datas.getArString("AVA.coop_ralllyinfo_marchslots"));
        sharedSb.Append(" ");
		sharedSb.AppendFormat("{0}/{1}{2}</color>", cachedData.CurMarchSlotCnt, cachedData.MaxMarchSlotCnt,
		                      full ? Datas.getArString("AVA.WarRoom_MarchSlots_Full") : Datas.getArString("AVA.WarRoom_MarchSlots_Remain") );

        this.lblDisplayText.txt = sharedSb.ToString();
    }

    private void OnClickItem(object param)
    {
        MenuMgr.instance.sendNotification(Constant.Notice.AvaCoopInspectRallyDetail, this.cachedData.Id);
    }
}
