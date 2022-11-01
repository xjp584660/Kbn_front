using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;
using KBN.DataTable;
using System;

public class OutpostGWWonderPopMenu : PopMenu
{
    public Label lineLabel;
    public Button btnSignUp;
    public Label bg;
    public Label msg;
    public Label Notice;
    public Label SmallNotice;
    public Label CurTitle;
    public Label CurDeployTime;
    public Label CurStartTime;
    public Label CurEndTime;
    public Label NextDeployTime;
    public Label NextTitle;
    public Label NextStartTime;
    public Label NextEndTime;
    
    public string selectGroup;


    public override void Init()
    {
        base.Init();

        btnClose.Init();
        btnClose.OnClick = new System.Action<System.Object>((param) => {
            KBN.MenuMgr.instance.PopMenu("OutpostGWWonderPopMenu");
        });

        title.txt = Datas.getArString("GWWonder.Detail_Title");
        msg.txt = Datas.getArString("GWWonder.Desc_Text1");
        Notice.txt = Datas.getArString("GWWonder.Desc_Text2");

        btnSignUp.txt = Datas.getArString("GWWonder.DescEventTime_SignUp");
        btnSignUp.OnClick = new System.Action<System.Object>((param) => {
            int avaState = _Global.INT32(GameMain.Ava.Event.CurStatus);
            if((avaState >= 2 && avaState <= 7))
            {
                ErrorMgr.singleton.PushError("",  Datas.getArString( string.Format( "Error.err_4431" ) ), true, "", null);
                btnSignUp.EnableBlueButton(false);
            }
            else
            {
                int allianceId = KBN.Alliance.singleton.MyAllianceId();
                UnityNet.AvaApply(allianceId, getAvaApplyOk, getAvaApplyError);
            }           
        });
    }
	
    protected override void DrawItem()
    {
        base.DrawItem();

        bg.Draw();
        lineLabel.Draw();
        CurTitle.Draw();
        CurDeployTime.Draw();
        CurStartTime.Draw();
        CurEndTime.Draw();
        NextTitle.Draw();
        NextDeployTime.Draw();
        NextStartTime.Draw();
        NextEndTime.Draw();
        msg.Draw();
        Notice.Draw();
        SmallNotice.Draw();
        btnSignUp.Draw();
    }

    private void getAvaApplyOk(HashObject result)
	{
		if(KBN._Global.GetBoolean(result["ok"]))
		{
			GameMain.Ava.Event.RequestAvaEvent();
            KBN.MenuMgr.instance.PopMenu("OutpostGWWonderPopMenu");
		}
	}

	private void getAvaApplyError(string errorMessage, string errorCode)
	{
        ErrorMgr.singleton.PushError("",  Datas.getArString( string.Format( "Error.err_{0}", errorCode ) ), true, "", null);
	}

    public override void Update()
    {
        base.Update();
    }

    public static string redColor = "<color=#FF0000>{0}</color>";
    public override void OnPush(object param)
    {
        base.OnPush(param);
        int avaState = _Global.INT32(GameMain.Ava.Event.CurStatus);
        int gwWonderState = _Global.INT32(GameMain.Ava.Event.CurGWWonderState());
        int avaMode = _Global.INT32(GameMain.Ava.Event.CurAvaType);
        if((avaState >= 2 && avaState <= 7) || gwWonderState == 0 || gwWonderState == 2 || avaMode == 0)
        {
            btnSignUp.EnableBlueButton(false);
        }
        else
        {
            if((Alliance.singleton.myAlliance != null && (Alliance.singleton.myAlliance.isChairman() == true || Alliance.singleton.myAlliance.isVC() == true)))
            {
                btnSignUp.EnableBlueButton(true);
            }
            else
            {
                btnSignUp.EnableBlueButton(false);
            }
        }

        string sRegion;
        selectGroup = GameMain.Ava.Event.AllianceRegion();
        if(selectGroup == "none")
        {
            SmallNotice.txt = Datas.getArString("AVA.OutpostNoneAlliance");
        }
        else if(selectGroup == "eu")
        {
            sRegion = string.Format(redColor, Datas.getArString("AVA.Outpost_EUToggleButton"));
            SmallNotice.txt = string.Format(Datas.getArString("GWWonder.DescEventTime_Text"), sRegion);
        }
        else if(selectGroup == "na")
        {
            sRegion = string.Format(redColor, Datas.getArString("AVA.Outpost_NAToggleButoon"));
            SmallNotice.txt = string.Format(Datas.getArString("GWWonder.DescEventTime_Text"), sRegion);
        }

        
        CurTitle.SetVisible(false);
        CurDeployTime.SetVisible(false);
        CurStartTime.SetVisible(false);
        CurEndTime.SetVisible(false);
        NextTitle.SetVisible(false);
        NextDeployTime.SetVisible(false);
        NextStartTime.SetVisible(false);
        NextEndTime.SetVisible(false);

        SetDatas();
    }

    private void SetLabelColor(FontColor fontColor)
    {
        CurDeployTime.SetNormalTxtColor(fontColor);
        CurTitle.SetNormalTxtColor(fontColor);
        CurStartTime.SetNormalTxtColor(fontColor);
        CurEndTime.SetNormalTxtColor(fontColor);
        NextDeployTime.SetNormalTxtColor(fontColor);
        NextTitle.SetNormalTxtColor(fontColor);
        NextStartTime.SetNormalTxtColor(fontColor);
        NextEndTime.SetNormalTxtColor(fontColor);
        SmallNotice.SetNormalTxtColor(fontColor);
    }

    private void SetDatas()
    {
        HashObject avaWeeklyCycle = GameMain.singleton.GetGWWonderWeeklyCycle();
        int weeklyCount = _Global.GetObjectValues(avaWeeklyCycle).Length;

        if(Application.platform == RuntimePlatform.Android)
        {
            SetLabelColor(FontColor.New_Describe_Grey_1);
        }
        else
        {
            SetLabelColor(FontColor.New_Level_Yellow);
        }

        int index = 0;
        if(weeklyCount >= 2)
        {
            long delopTimeShow1 = _Global.INT64(_Global.GetString(avaWeeklyCycle[_Global.ap + 0]["prepareTimeUnix"]));
            long delopTimeShow2 = _Global.INT64(_Global.GetString(avaWeeklyCycle[_Global.ap + 1]["prepareTimeUnix"]));
            index = delopTimeShow1 < delopTimeShow2 ? 0 : 1;
        }

        for( int i = 0; i < weeklyCount; i ++ )
        {
            if(index == i)
            {
                HashObject weekly = avaWeeklyCycle[_Global.ap + i];

                // int startDayEU = _Global.INT32(weekly["startDayEU"]);
                // int startDayNA = _Global.INT32(weekly["startDayNA"]);
                string delopTimeEUShow = _Global.GetString(weekly["prepareTimeShow"]);
                string startTimeEUShow = _Global.GetString(weekly["startTimeEUShow"]);
                string endTimeEUShow = _Global.GetString(weekly["endTimeEUShow"]);
                string delopTimeNAShow = _Global.GetString(weekly["prepareTimeShow"]);
                string startTimeNAShow = _Global.GetString(weekly["startTimeNAShow"]);
                string endTimeNAShow = _Global.GetString(weekly["endTimeNAShow"]);
        
                //CurTitle.txt = GetTitleTxt(startDayNA);
                CurDeployTime.txt = Datas.getArString("GWWonder.DescEventTime_Deploy") + " " + delopTimeEUShow;
                CurStartTime.txt = Datas.getArString("AVA.Outpost_StartTime") + " " + startTimeEUShow;
                CurEndTime.txt = Datas.getArString("AVA.Outpost_EndTime") + " " + endTimeEUShow;
        
                CurTitle.txt = Datas.getArString("AVA.Outpost_EUToggleButton") + ":";
                CurTitle.SetVisible(true);
                CurDeployTime.SetVisible(true);
                CurStartTime.SetVisible(true);
                CurEndTime.SetVisible(true);               

                        //NextTitle.txt = GetTitleTxt(startDayEU);
                NextDeployTime.txt = Datas.getArString("GWWonder.DescEventTime_Deploy") + " " + delopTimeNAShow;
                NextStartTime.txt = Datas.getArString("AVA.Outpost_StartTime") + " " + startTimeNAShow;
                NextEndTime.txt = Datas.getArString("AVA.Outpost_EndTime") + " " + endTimeNAShow;

                NextTitle.txt = Datas.getArString("AVA.Outpost_NAToggleButoon") + ":";
                NextDeployTime.SetVisible(true);
                NextTitle.SetVisible(true);
                NextStartTime.SetVisible(true);
                NextEndTime.SetVisible(true);
            }          
        }
    }

    public string GetTitleTxt(int weekDay)
    {
        switch(weekDay)
        {
            case 1:
                return Datas.getArString("AVA.Outpost_MondayCompetitionTime");
            case 2:
                return Datas.getArString("AVA.Outpost_TuesdayCompetitionTime");
            case 3:
                return Datas.getArString("AVA.Outpost_WednesdayCompetitionTime");
            case 4:
                return Datas.getArString("AVA.Outpost_ThursdayCompetitionTime");
            case 5:
                return Datas.getArString("AVA.Outpost_FridayCompetitionTime");
            case 6:
                return Datas.getArString("AVA.Outpost_SaturdayCompetitionTime");
            case 7:
                return Datas.getArString("AVA.Outpost_SundayCompetitionTime");
        }

        return Datas.getArString("AVA.Outpost_SundayCompetitionTime");
    }

    public override void OnPop()
    {
        base.OnPop();
    }

    public override void OnPopOver()
    {
        base.OnPopOver();
    }
}