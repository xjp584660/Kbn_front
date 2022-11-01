using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using KBN;
using KBN.DataTable;
using System;

public class AvaInfo : UIObject
{
	public Label l_bg1;
	public Label l_bg2;
	public Label l_bg3;
	public Label l_tipBg1;
	public Label l_yourTip;
	public Label l_enemyTip;
	public Label l_yourFlag;
	public Label l_enemyFlag;

    public SimpleLabel l_buffTipBackground;
    public SimpleLabel l_buffTip;
    public SimpleLabel l_buffYourFlag;
    public SimpleLabel l_buffYourAlliance;
    public SimpleLabel l_buffEnemyFlag;
    public SimpleLabel l_buffEnemyAlliance;

    public Button btnHelp;

    public AvaInfoItem scoreItemTemplate;
    public KBN.ScrollList scoreList;
    private List<AvaInfoItemData> scoreData;

    public AvaInfoItem infoItemTemplate;
    public KBN.ScrollList infoList;
    private List<AvaInfoItemData> infoData;

    public FullClickItem buffItemTemplate;
    public KBN.ScrollList buffList;
    private List<AvaInfoItemData> buffData;

	public override void Init ()
	{
		pri_initTips();

        pri_initScoreItemTemplate();

        pri_initInfoItemTemplate();

        buffItemTemplate.Init();
        buffList.Init(buffItemTemplate);

        scoreList.ResetPos();
        infoList.ResetPos();

        btnHelp.OnClick = new System.Action<System.Object>(onHelpClick);

		ReqBuffData ();

        RequestAvaStats();
	}

	private void pri_initTips()
	{
        l_yourTip.txt = KBN.Datas.getArString("AVA.stats_youralliance");
        l_enemyTip.txt = KBN.Datas.getArString("AVA.stats_enemyalliance");

        l_yourFlag.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_blue_1", TextureType.ICON_ELSE);
        l_enemyFlag.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_red_1", TextureType.ICON_ELSE);

        l_buffTip.txt = KBN.Datas.getArString("AVA.stats_alliancebuff");
        l_buffYourAlliance.txt = KBN.Datas.getArString("AVA.stats_youralliance");
        l_buffEnemyAlliance.txt = KBN.Datas.getArString("AVA.stats_enemyalliance");
        l_buffYourFlag.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_blue_1", TextureType.ICON_ELSE);
        l_buffEnemyFlag.image = TextureMgr.instance().LoadTexture("icon_map_view_flag_red_1", TextureType.ICON_ELSE);
	}

    private void pri_initScoreItemTemplate()
    {
        AvaInfoItem _template = (GameObject.Instantiate(scoreItemTemplate.gameObject) as GameObject).GetComponent<AvaInfoItem>();
        _template.Init();
        _template.l_Name.SetNormalTxtColor(FontColor.Milk_White);
        _template.l_You.SetNormalTxtColor(FontColor.Milk_White);
        _template.l_Enemy.SetNormalTxtColor(FontColor.Milk_White);
        scoreList.Init(_template);
    }

    private void pri_initInfoItemTemplate()
    {
        AvaInfoItem _template = (GameObject.Instantiate(infoItemTemplate.gameObject) as GameObject).GetComponent<AvaInfoItem>();
        _template.Init();
        _template.l_Name.SetNormalTxtColor(FontColor.Description_Dark);
        _template.l_You.SetNormalTxtColor(FontColor.Light_Yellow);
        _template.l_Enemy.SetNormalTxtColor(FontColor.Light_Yellow);
        infoList.Init(_template);
    }

    private void onHelpClick(System.Object param)
    {
        KBN.MenuMgr.instance.PushMenu("AvaBuffInfoPopMenu", null, "trans_zoomComp");
    }

	public override int Draw ()
	{
        GUI.BeginGroup(rect);
		pri_drawBg();
        GUI.EndGroup();

		return -1;
	}

	private void pri_drawBg()
	{
        l_bg1.Draw();
        l_bg2.Draw();
        l_bg3.Draw();
        l_tipBg1.Draw();
        l_yourTip.Draw();
        l_enemyTip.Draw();
        l_yourFlag.Draw();
        l_enemyFlag.Draw();

        l_buffTipBackground.Draw();
        l_buffTip.Draw();
        l_buffYourFlag.Draw();
        l_buffYourAlliance.Draw();
        l_buffEnemyFlag.Draw();
        l_buffEnemyAlliance.Draw();

        scoreList.Draw();
        infoList.Draw();
        buffList.Draw();

        btnHelp.Draw();
	}

    public override void Update()
    {
        base.Update();

        buffList.Update();
    }

	public override void OnPopOver()
	{
		base.OnPopOver ();
		scoreList.Clear ();
		infoList.Clear ();
		buffList.Clear ();
		scoreData = null;
		infoData = null;
		buffData = null;
	}

	private void ReqBuffData()
	{
		AvaBuff.OnBuffDataOk OkFunc = delegate () {
			FillBuffData();
			buffList.SetData(buffData);
			buffList.UpdateData();
			buffList.ResetPos();
		};
		GameMain.Ava.Buff.RequestBuffList (OkFunc);
	}

	private void FillBuffData()
	{
		buffData = new List<AvaInfoItemData>();

		RunningBuffs myRunBuffs = GameMain.PlayerBuffs.AvaSelfRunningBuffs;
		RunningBuffs enemyRunBuffs = GameMain.PlayerBuffs.AvaEnemyRunningBuffs;


		GDS_AVABuffList avaBuffListGds = GameMain.GdsManager.GetGds<GDS_AVABuffList>();
		Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection dataItems  = avaBuffListGds.GetItems ();
		float myBuff = 0f;
		float enemyBuff = 0f;
        int avaMode = _Global.INT32(GameMain.Ava.Event.CurAvaType);
		foreach(AVABuffList dataItem in dataItems)
		{
            if(avaMode == 0 && (dataItem.ID == 10 || dataItem.ID == 11))
            {
                continue;
            }
            
			myBuff = GetBuffPercent(myRunBuffs, dataItem, true);

			enemyBuff = GetBuffPercent(enemyRunBuffs, dataItem, false);

			BuffTarget tempTarget = (BuffTarget)Enum.Parse(typeof( BuffTarget), dataItem.TARGET.ToString());
			BuffSubtarget tempSubtarget = new BuffSubtarget (dataItem.SUB_TARGET);
			buffData.Add(new AvaInfoItemData(dataItem.ICON, _Global.GetString(myBuff*100f), _Global.GetString(enemyBuff*100f)));
		}
	}

	private float GetBuffPercent(RunningBuffs buffs, AVABuffList dataItem, bool isMy)
	{
		float tempBuff = 0f;
		BuffSubtarget allType = new BuffSubtarget (BuffSubtargetType.UnitType, 0);
		BuffTarget tempTarget = (BuffTarget)Enum.Parse(typeof( BuffTarget), dataItem.TARGET.ToString());
		BuffSubtarget tempSubtarget = new BuffSubtarget (dataItem.SUB_TARGET);

        if(dataItem.ID == 10 || dataItem.ID == 11)
        {
            tempBuff += buffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, tempSubtarget, BuffSource.AllianceSkill).Percentage;
            tempBuff += buffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, tempSubtarget, BuffSource.AvaTile).Percentage;
            tempBuff += buffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, allType, BuffSource.AllianceSkill).Percentage;
        }
        else
        {
            tempBuff += buffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, tempSubtarget, BuffSource.AllianceSkill).Percentage;
            tempBuff += buffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, tempSubtarget, BuffSource.AvaTile).Percentage;
            tempBuff += buffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, allType, BuffSource.AllianceSkill).Percentage;
            tempBuff += buffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, allType, BuffSource.AvaTile).Percentage;
        }
		
		int skill24BuffCount = _Global.INT32(buffs.GetRunningBuffsValueBy(BuffScene.Ava, tempTarget, allType, BuffSource.AvaTile).Percentage * 100f / 5f);
		float skill24BuffValue = 0f;
		if(isMy)
		{
			skill24BuffValue += GameMain.PlayerBuffs.mySkill24BuffsValue * skill24BuffCount;
		}
		else
		{
			skill24BuffValue += GameMain.PlayerBuffs.emptySkill24BuffsValue * skill24BuffCount;
		}
		tempBuff += skill24BuffValue;
		return tempBuff;
	}

    #region stats info
    private void RequestAvaStats()
    {
        PBMsgReqAVA.PBMsgReqAVA request = new PBMsgReqAVA.PBMsgReqAVA();
        request.cmd = 1;
        request.subcmd = 4;
        
        KBN.UnityNet.RequestForGPB("ava.php", request, OnGetAvaStatsOK, OnGetAvaStatsError, false);
    }
    
    private void OnGetAvaStatsOK(byte[] data)
    {
        if (data != null)
        {
            PBMsgAVAStats.PBMsgAVAStats statsinfo = KBN._Global.DeserializePBMsgFromBytes<PBMsgAVAStats.PBMsgAVAStats>(data);
            PBMsgAVAStats.PBMsgAVAStats.SignalAlliance yourAlliance = null;
            PBMsgAVAStats.PBMsgAVAStats.SignalAlliance enemyAlliance = null;
            
            for (int i = 0; i < 2; ++i)
            {
                if ((statsinfo.alliances[i].allianceId == Alliance.singleton.MyAllianceId()) &&
                    (statsinfo.alliances[i].serverId == KBN.Datas.singleton.worldid()))
                {
                    yourAlliance = statsinfo.alliances[i];
                }
                else
                {
                    enemyAlliance = statsinfo.alliances[i];
                }
            }
            
            scoreData = new List<AvaInfoItemData>();
			scoreData.Add(new AvaInfoItemData(KBN.Datas.getArString("AVA.stats_totalscore"), _Global.GetString(yourAlliance.totalScore), _Global.GetString(enemyAlliance.totalScore)));
			scoreData.Add(new AvaInfoItemData(KBN.Datas.getArString("AVA.stats_wonderscore"), _Global.GetString(yourAlliance.wonderScore), _Global.GetString(enemyAlliance.wonderScore)));
			scoreData.Add(new AvaInfoItemData(KBN.Datas.getArString("AVA.stats_troopskillscore"), _Global.GetString(yourAlliance.troopKillScore), _Global.GetString(enemyAlliance.troopKillScore)));
            
            infoData = new List<AvaInfoItemData>();
			infoData.Add(new AvaInfoItemData(KBN.Datas.getArString("AVA.stats_wonderownednumeber"), _Global.GetString(yourAlliance.wonders), _Global.GetString(enemyAlliance.wonders)));
			infoData.Add(new AvaInfoItemData(KBN.Datas.getArString("AVA.stats_wondersownedtime"), _Global.GetString(yourAlliance.wonderTime), _Global.GetString(enemyAlliance.wonderTime), AvaInfoItemData.DataType.TIME));
			infoData.Add(new AvaInfoItemData(KBN.Datas.getArString("AVA.stats_superwonderownednumeber"), _Global.GetString(yourAlliance.superWonders), _Global.GetString(enemyAlliance.superWonders)));
			infoData.Add(new AvaInfoItemData(KBN.Datas.getArString("AVA.stats_superwondersownedtime"), _Global.GetString(yourAlliance.superWonderTime), _Global.GetString(enemyAlliance.superWonderTime), AvaInfoItemData.DataType.TIME));
			infoData.Add(new AvaInfoItemData(KBN.Datas.getArString("AVA.chrome_stats_troopskilltab"), _Global.GetString(yourAlliance.troopKills), _Global.GetString(enemyAlliance.troopKills)));
			infoData.Add(new AvaInfoItemData(KBN.Datas.getArString("AVA.stats_bufftitlesownednumber"), _Global.GetString(yourAlliance.buffTiles), _Global.GetString(enemyAlliance.buffTiles)));
            
            scoreList.SetData(scoreData);
            scoreList.ResetPos();
             
            infoList.SetData(infoData);
            infoList.ResetPos();
        }

      //  Debug.Log("[OnGetAvaStatsOK]");
    }
    
    private void OnGetAvaStatsError(string errorMessage, string errorCode)
    {
        Debug.LogWarning("[OnGetAvaStatsError]");
    }
    #endregion stats info
}
