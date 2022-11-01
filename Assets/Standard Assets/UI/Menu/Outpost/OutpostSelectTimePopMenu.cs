using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;
using KBN.DataTable;
using System;

public class OutpostSelectTimePopMenu : PopMenu
{
    public Label lineLabel;
    public ToggleButton EUToggleButton;
    public ToggleButton NAToggleButton;
    public Button btnConfirm;
    public Label bg;
    public Label msg;
    public Label CurTitle;
    public Label CurStartTime;
    public Label CurEndTime;
    public Label NextTitle;
    public Label NextStartTime;
    public Label NextEndTime;
    public Label EUButtonLabel;
    public Label NAButtonLabel;

    public string selectGroup;


    public override void Init()
    {
        base.Init();

        btnClose.Init();
        btnClose.OnClick = new System.Action<System.Object>((param) => {
            KBN.MenuMgr.instance.PopMenu("OutpostSelectTimePopMenu");
        });

        title.txt = Datas.getArString("AVA.Outpost_CompetitionRegion");
        msg.txt = Datas.getArString("AVA.Outpost_Msg");
        EUButtonLabel.txt = Datas.getArString("AVA.Outpost_EUToggleButton");
        NAButtonLabel.txt = Datas.getArString("AVA.Outpost_NAToggleButoon");
        //EUToggleButton.txt = Datas.getArString("AVA.Outpost_EUToggleButton");
        EUToggleButton.selected = false;
		EUToggleButton.valueChangedFunc = EUValueChangedFunc;	
        //NAToggleButton.txt = Datas.getArString("AVA.Outpost_NAToggleButton");
        NAToggleButton.selected = false;
		NAToggleButton.valueChangedFunc = NAValueChangedFunc;	

        btnConfirm.txt = Datas.getArString("Common.OK_Button");
        btnConfirm.OnClick = new System.Action<System.Object>((param) => {
            int avaState = _Global.INT32(GameMain.Ava.Event.CurStatus);
            int avaMode = _Global.INT32(GameMain.Ava.Event.CurAvaType);
            if((avaState >= 1 && avaState <= 7))
            {
                ErrorMgr.singleton.PushError("",  Datas.getArString( string.Format( "Error.err_{0}", 4421 ) ), true, "", null);
                btnConfirm.EnableBlueButton(false);
            }
            else
            {
                int allianceId = KBN.Alliance.singleton.MyAllianceId();
                UnityNet.GetSelectAvaAllianceRegion(allianceId, selectGroup, getSelectAvaAllianceRegionOk, getSelectAvaAllianceRegionError);
            }           
        });
    }
	
    protected override void DrawItem()
    {
        base.DrawItem();

        bg.Draw();
        lineLabel.Draw();
        EUToggleButton.Draw();
        NAToggleButton.Draw();
        EUButtonLabel.Draw();
        NAButtonLabel.Draw();
        CurTitle.Draw();
        CurStartTime.Draw();
        CurEndTime.Draw();
        NextTitle.Draw();
        NextStartTime.Draw();
        NextEndTime.Draw();
        msg.Draw();
        btnConfirm.Draw();
    }

    private void getSelectAvaAllianceRegionOk(HashObject result)
	{
		if(KBN._Global.GetBoolean(result["ok"]))
		{
			GameMain.Ava.Event.RequestAvaEvent();
            KBN.MenuMgr.instance.PopMenu("OutpostSelectTimePopMenu");
		}
	}

	private void getSelectAvaAllianceRegionError(string errorMessage, string errorCode)
	{
        ErrorMgr.singleton.PushError("",  Datas.getArString( string.Format( "Error.err_{0}", errorCode ) ), true, "", null);
	}

    public void EUValueChangedFunc(bool b)
    {
        selectGroup = "eu";
        NAToggleButton.selected = false;
        EUToggleButton.selected = b;
        SetDatas();
    }

    public void NAValueChangedFunc(bool b)
    {
        selectGroup = "na";
        EUToggleButton.selected = false;
        NAToggleButton.selected = b;
        SetDatas();
    }

    public override void Update()
    {
        base.Update();
    }

    public override void OnPush(object param)
    {
        base.OnPush(param);
        int avaState = _Global.INT32(GameMain.Ava.Event.CurStatus);
        int avaMode = _Global.INT32(GameMain.Ava.Event.CurAvaType);
        int gwWonderState = _Global.INT32(GameMain.Ava.Event.CurGWWonderState());
        if((avaState >= 1 && avaState <= 7) || (gwWonderState == 2 && avaMode == 1))
        {
            btnConfirm.EnableBlueButton(false);
        }
        else
        {
            if((Alliance.singleton.myAlliance != null && Alliance.singleton.myAlliance.isChairman() == true))
            {
                btnConfirm.EnableBlueButton(true);
            }
            else
            {
                btnConfirm.EnableBlueButton(false);
            }
        }

        CurTitle.SetVisible(false);
        CurStartTime.SetVisible(false);
        CurEndTime.SetVisible(false);
        NextTitle.SetVisible(false);
        NextStartTime.SetVisible(false);
        NextEndTime.SetVisible(false);
        string avaGroup = GameMain.Ava.Event.AllianceRegion();
        if(avaGroup == "na")
		{
			NAValueChangedFunc(true);
		}
		else if(avaGroup == "eu")
		{
			EUValueChangedFunc(true);
		}
    }

    private void SetLabelColor(FontColor fontColor)
    {
        CurTitle.SetNormalTxtColor(fontColor);
        CurStartTime.SetNormalTxtColor(fontColor);
        CurEndTime.SetNormalTxtColor(fontColor);
        NextTitle.SetNormalTxtColor(fontColor);
        NextStartTime.SetNormalTxtColor(fontColor);
        NextEndTime.SetNormalTxtColor(fontColor);
    }

    private void SetDatas()
    {
        HashObject avaWeeklyCycle = GameMain.singleton.GetAvaWeeklyCycle();
        int weeklyCount = _Global.GetObjectValues(avaWeeklyCycle).Length;

        if(Application.platform == RuntimePlatform.Android)
        {
            SetLabelColor(FontColor.New_Describe_Grey_1);
        }
        else
        {
            SetLabelColor(FontColor.New_Level_Yellow);
        }

        for( int i = 0; i < weeklyCount; i ++ )
        {
            HashObject weekly = avaWeeklyCycle[_Global.ap + i];

            int competingTime = _Global.INT32(weekly["competingTime"]);
            int startDayEU = _Global.INT32(weekly["startDayEU"]);
            int startDayNA = _Global.INT32(weekly["startDayNA"]);
            string startTimeEUShow = _Global.GetString(weekly["startTimeEUShow"]);
            string endTimeEUShow = _Global.GetString(weekly["endTimeEUShow"]);
            string startTimeNAShow = _Global.GetString(weekly["startTimeNAShow"]);
            string endTimeNAShow = _Global.GetString(weekly["endTimeNAShow"]);
            if(i == 0)
            {// 上
                if(selectGroup == "na")
		        {
                    CurTitle.txt = GetTitleTxt(startDayNA);
                    CurStartTime.txt = Datas.getArString("AVA.Outpost_StartTime") + " " + startTimeNAShow;
                    CurEndTime.txt = Datas.getArString("AVA.Outpost_EndTime") + " " + endTimeNAShow;
                }
                else if(selectGroup == "eu")
                {
                    CurTitle.txt = GetTitleTxt(startDayEU);
                    CurStartTime.txt = Datas.getArString("AVA.Outpost_StartTime") + " " + startTimeEUShow;
                    CurEndTime.txt = Datas.getArString("AVA.Outpost_EndTime") + " " + endTimeEUShow;
                }
                CurTitle.SetVisible(true);
                CurStartTime.SetVisible(true);
                CurEndTime.SetVisible(true);               
            }
            else if(i == 1)
            {// 下
                if(selectGroup == "na")
		        {
                    NextTitle.txt = GetTitleTxt(startDayNA);
                    NextStartTime.txt = Datas.getArString("AVA.Outpost_StartTime") + " " + startTimeNAShow;
                    NextEndTime.txt = Datas.getArString("AVA.Outpost_EndTime") + " " + endTimeNAShow;
                }
                else if(selectGroup == "eu")
                {
                    NextTitle.txt = GetTitleTxt(startDayEU);
                    NextStartTime.txt = Datas.getArString("AVA.Outpost_StartTime") + " " + startTimeEUShow;
                    NextEndTime.txt = Datas.getArString("AVA.Outpost_EndTime") + " " + endTimeEUShow;
                }
                NextTitle.SetVisible(true);
                NextStartTime.SetVisible(true);
                NextEndTime.SetVisible(true);
            }
        }
    }

    public string GetEndTimeString(string startTime, int competingTime)
    {
        string[] parts = startTime.Split(':');
        int startHour = _Global.INT32(parts[0]);
        int startMinute = _Global.INT32(parts[1]);
        int hour = competingTime / 60;
        int minute = competingTime % 60;

        string sMinute = string.Empty;
        int allMinute = startMinute + minute;
        if(allMinute >= 60)
        {
            hour += 1;
            allMinute -= 60;
        }

        if(allMinute < 10)
        {
            sMinute = "0" + _Global.GetString(allMinute);
        }
        else
        {
            sMinute = _Global.GetString(allMinute);
        }

        string sHour = string.Empty;
        int allHour = startHour + hour;
       
        if(allHour > 24)
        {
            allHour = allHour % 24;
            if(allHour < 10)
            {
                sHour = "0" + _Global.GetString((allHour));
            }
        }
        else
        {
            if(allHour < 10)
            {
                sHour = "0" + _Global.GetString((allHour));
            }
            else
            {
                sHour = _Global.GetString((allHour));
            }           
        }

        return  sHour + ":" + sMinute + ":00";
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