using UnityEngine;
using System.Collections;
using GameMain = KBN.GameMain;
using Datas = KBN.Datas;
using _Global = KBN._Global;

public class AvaMainChromeFrozenTipBar : NormalTipsBar
{
    [SerializeField]
    private SimpleLabel tipTitle;
    [SerializeField]
    private SimpleLabel myAllianceName;
    [SerializeField]
    private SimpleLabel myAllianceScore;
    [SerializeField]
    private SimpleLabel myAllianceRank;
    [SerializeField]
    private SimpleLabel VS;
    [SerializeField]
    private SimpleLabel enemyAllianceName;
    [SerializeField]
    private SimpleLabel enemyAllianceScore;
    [SerializeField]
    private SimpleLabel enemyAllianceRank;
    [SerializeField]
    private SimpleLabel avaScore;
    [SerializeField]
    private SimpleLabel avaRank;

    private long battleBeginTime;
    private string titleFormat;

    public override void SetUIData(object data)
    {
        var matchMakingResult = data as PBMsgAVASeed.PBMsgAVASeed.MatchMakingResult;
        if (matchMakingResult == null)
        {
            return;
        }

        myAllianceName.txt = matchMakingResult.myAllianceName;
        myAllianceScore.txt = matchMakingResult.myAllianceScore.ToString();
        myAllianceRank.txt = matchMakingResult.myAllianceRank.ToString();

        if (string.IsNullOrEmpty(matchMakingResult.enemyAllianceName))
        {
            enemyAllianceName.txt = Datas.getArString("Chrome.match_noAlliance");
            enemyAllianceRank.txt = string.Empty;
            enemyAllianceScore.txt = string.Empty;

            myAllianceScore.txt = Datas.getArString("Chrome.match_basedOnScore");
            myAllianceRank.txt = Datas.getArString("Chrome.match_automaticVictory");
        }
        else
        {
            enemyAllianceName.txt = matchMakingResult.enemyAllianceName;
            enemyAllianceRank.txt = matchMakingResult.enemyAllianceRank.ToString();
            enemyAllianceScore.txt = matchMakingResult.enemyAllianceScore.ToString();
        }
    }

    public override int Draw()
    {
        if (!visible)
        {
            return -1;
        }

        base.Draw();
        GUI.BeginGroup(rect);
        tipTitle.Draw();
        myAllianceName.Draw();
        myAllianceScore.Draw();
        myAllianceRank.Draw();
        VS.Draw();
        avaScore.Draw();
        avaRank.Draw();
        enemyAllianceName.Draw();
        enemyAllianceScore.Draw();
        enemyAllianceRank.Draw();
        GUI.EndGroup();
        return -1;
    }

    public override void Show()
    {
        stopTime = float.PositiveInfinity;
        time = 0f;
        titleFormat = Datas.getArString("Event.AVA_frozentime");
        VS.txt = Datas.getArString ("AVA.matchmakingresult_VS");
        avaScore.txt = Datas.getArString ("AVA.matchmakingresult_AVAScore");
        avaRank.txt = Datas.getArString ("AVA.matchmakingresult_AVARank");
        battleBeginTime = GameMain.Ava.Event.BattleStartTime;
        base.Show();
    }

    public override void Update()
    {
        if (!visible)
        {
            return;
        }

        long timeLeft = battleBeginTime - GameMain.unixtime();
        if (timeLeft < 0L)
        {
            timeLeft = 0L;
            if (float.IsPositiveInfinity(stopTime))
            {
                stopTime = 0f;
                Hide();
            }
        }

        tipTitle.txt = string.Format(titleFormat, _Global.timeFormatStr(timeLeft));

        base.Update();
    }
}
