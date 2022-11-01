using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

using Datas = KBN.Datas;
using _Global = KBN._Global;
using General = KBN.General;
using GameMain = KBN.GameMain;
using HeroInfo = KBN.HeroInfo;
using ErrorMgr = KBN.ErrorMgr;
using MenuMgr = KBN.MenuMgr;

public class AvaRallyAttackListItem : ListItem
{
    [SerializeField]
    private SimpleLabel lbFrame;

    [SerializeField]
    private SimpleLabel lbIcon;
    [SerializeField]
    private SimpleLabel lbRole;
    [SerializeField]
    private SimpleLabel lbPlayerName;
    [SerializeField]
    private SimpleLabel lbTroopsTotal;

    [SerializeField]
    private SimpleButton btnOutpost;
    // situation 2
    [SerializeField]
    private SimpleLabel lbTimer;
    [SerializeField]
    private SimpleButton btnSpeedUp;

    [SerializeField]
    private SimpleLabel lbSeparator;
    [SerializeField]
    private SimpleLabel lbBelowHeroSeparator;

    [SerializeField]
    private float minHeight;
    [SerializeField]
    private float troopTypeWidth;
    [SerializeField]
    private float troopAmountWidth;
    [SerializeField]
    private float troopLabelHeight;
    [SerializeField]
    private float leftColStart;
    [SerializeField]
    private float rightColStart;
    
    private List<SimpleLabel> troopLabelList = new List<SimpleLabel>();

    private List<SimpleLabel> heroLabelList = new List<SimpleLabel>();

    private const int ContentMargin = 10;

    private AvaRallyDetailInfo.Player cachedPlayer;

    public override void Init ()
    {
        base.Init ();

        lbFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_black", TextureType.DECORATION);
        lbSeparator.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line_list_small", TextureType.DECORATION);
        lbBelowHeroSeparator.mystyle.normal.background = TextureMgr.singleton.LoadTexture("between line_list_small", TextureType.DECORATION);
        lbBelowHeroSeparator.rect = lbSeparator.rect;
        btnSpeedUp.txt = Datas.getArString("Common.Speedup");
        btnSpeedUp.OnClick = new Action(OnSpeedUp);
        btnOutpost.OnClick = new Action<object>(OnOutpostButton);
    }
    
    public override int Draw ()
    {
        if (!visible)
            return -1;

        GUI.BeginGroup(rect);
        lbFrame.Draw();

        lbIcon.Draw();
        lbRole.Draw();
        lbPlayerName.Draw();
        lbTroopsTotal.Draw();

        btnOutpost.Draw();
        
        lbTimer.Draw();
        btnSpeedUp.Draw();
        
        lbSeparator.Draw();

        if (null != this.heroLabelList)
        {
            for (int i = 0; i < heroLabelList.Count; i++)
            {
                this.heroLabelList[i].Draw();
            }
        }

        this.lbBelowHeroSeparator.Draw();

        if (null != troopLabelList)
        {
            for (int i = 0 ; i < troopLabelList.Count; i++)
            {
                troopLabelList[i].Draw();
            }
        }
        GUI.EndGroup();

        return -1;
    }

    public override void Update()
    {
        UpdateTimer();
        UpdateSpeedUpButton();
    }

    private void UpdateTimer()
    {
        if (!lbTimer.isVisible() || cachedPlayer == null)
        {
            return;
        }

        long eta = cachedPlayer.ArrivalTime - GameMain.unixtime();

        lbTimer.txt = string.Format("{0} <color=white>{1}</color>", Datas.getArString("AVA.outpost_troopsmovement_arrivingtime"),
                                    _Global.timeFormatStr(eta > 0 ? eta : 0));
    }

    private void UpdateSpeedUpButton()
    {
        if (!btnSpeedUp.isVisible())
        {
            return;
        }

        if (!cachedPlayer.HasArrived && !cachedPlayer.RallyAttack.HasLeft)
        {
            btnSpeedUp.EnableGreenButton(true);
            return;
        }

        btnSpeedUp.EnableGreenButton(false);
    }

    public override void SetRowData (object data)
    {
        base.SetRowData (data);
        cachedPlayer = data as AvaRallyDetailInfo.Player;

        SetGeneralPortrait();
        SetPlayerRole();
        lbPlayerName.txt = cachedPlayer.PlayerName;
        lbTroopsTotal.txt = string.Format("{0} {1}",
                                          Datas.getArString("AVA.coop_ralllyinfo_troopsdonated"),
                                          cachedPlayer.TroopCount.ToString());

        if (cachedPlayer.Role == AvaRallyDetailInfo.PlayerRole.Starter)
        {
            btnOutpost.SetVisible(true);
            btnSpeedUp.SetVisible(false);
            lbTimer.SetVisible(false);

            btnOutpost.txt = string.Format("{2} <color={3}>({0},{1})</color>", cachedPlayer.RallyAttack.StarterCoordX, cachedPlayer.RallyAttack.StarterCoordY,
                                           Datas.getArString("Common.PlayerTile"), _Global.FontColorEnumToString(FontColor.Blue));
        }
        else
        {
            btnOutpost.SetVisible(false);
            lbTimer.SetVisible(true);
            UpdateTimer();

            if (cachedPlayer.PlayerId == Datas.singleton.tvuid())
            {
                btnSpeedUp.SetVisible(true);
                UpdateSpeedUpButton();
            }
            else
            {
                btnSpeedUp.SetVisible(false);
            }
        }

        rect.height = lbSeparator.rect.yMax + 6;
        rect.height += FillHeroList(rect.height);
        rect.height += FillTroopList(rect.height);
        rect.height = Mathf.Max(rect.height, minHeight);
        lbFrame.rect.height = rect.height;
    }

    private void SetGeneralPortrait()
    {
        lbIcon.useTile = true;

        var textureName = General.getGeneralTextureName(cachedPlayer.GeneralName, cachedPlayer.GeneralCityOrder);
        lbIcon.tile = TextureMgr.singleton.GeneralSpt().GetTile(textureName);
    }

    private void SetPlayerRole()
    {
        string key;
        if (cachedPlayer.Role == AvaRallyDetailInfo.PlayerRole.Starter)
        {
            key = "AVA.outpost_rallyattack_initiator";
        }
        else
        {
            key = "AVA.outpost_rallyattack_backer";
        }

        lbRole.txt = Datas.getArString(key);
    }

    private float FillHeroList(float origY)
    {
        if (cachedPlayer.Heros.Count <= 0)
        {
            lbBelowHeroSeparator.SetVisible(false);
            return 0f;
        }

        var keys = new string[cachedPlayer.Heros.Count];
        var values = new string[cachedPlayer.Heros.Count];
        for (int i = 0; i < keys.Length; ++i)
        {
            var heroInfo = new HeroInfo(0, 0);
            heroInfo.Type = cachedPlayer.Heros[i].TypeId;
            keys[i] = heroInfo.Name;
            values[i] = "Lv " + cachedPlayer.Heros[i].Level.ToString();
        }
        var height = FillLabelList(keys, values, origY, this.heroLabelList);

        lbBelowHeroSeparator.rect.y = origY + (float)ContentMargin + height;
        return (float)ContentMargin + height + lbBelowHeroSeparator.rect.height;
    }

    private float FillTroopList(float origY)
    {
        var keys = new string[cachedPlayer.Units.Count];
        var values = new string[cachedPlayer.Units.Count];
        for (int i = 0; i < keys.Length; ++i)
        {
            keys[i] = Datas.getArString("unitName.u" + cachedPlayer.Units[i].Id.ToString());
            values[i] = cachedPlayer.Units[i].Count.ToString();
        }
        var height = FillLabelList(keys, values, origY + (float)ContentMargin, this.troopLabelList);

        return height + 2 * (float)ContentMargin;
    }

    private float FillLabelList(string[] keys, string[] values, float origY, List<SimpleLabel> labels)
    {
        int row = 0, col = 0;
        
        labels.Clear();
        for (int i = 0; i < keys.Length; ++i)
        {
            if (col == 0)
            {
                ++row;
            }
            
            float startX = (col == 0) ? leftColStart : rightColStart;
            float startY = origY + troopLabelHeight * (row - 1);
            
            SimpleLabel lbKey = new SimpleLabel();
            SimpleLabel lbValue = new SimpleLabel();
            
            lbKey.rect = new Rect(startX, startY, troopTypeWidth, troopLabelHeight);
            lbKey.SetFont();
            lbKey.txt = keys[i];
            lbKey.txt = _Global.GUIClipToWidth(lbKey.mystyle, lbKey.txt, troopTypeWidth, "...", ":");
            
            lbValue.rect = new Rect(startX + troopTypeWidth, startY, troopAmountWidth, troopLabelHeight);
            lbValue.SetFont();
            lbValue.txt = values[i];
            
            labels.Add(lbKey);
            labels.Add(lbValue);
            
            col = (col + 1) % 2;
        }
        
        return row * troopLabelHeight;
    }

    private void OnSpeedUp()
    {
        var marchInfo = GameMain.Ava.March.GetMarchById(cachedPlayer.MarchId);
        if (marchInfo == null)
        {
            ErrorMgr.singleton.PushError("", Datas.getArString("Common.CannotSpeedUp"));
            return;
        }

        var pushParam = new AvaSpeedUp.AvaSpeedUpData
        {
            type = Constant.AvaSpeedUpType.AvaMarchSpeedUp,
            id = cachedPlayer.MarchId,
            endTime = marchInfo.EndTime,
            startTime = marchInfo.StartTime,
            origTotalTime = marchInfo.OrigTotalTime,
        };

        MenuMgr.instance.PushMenu("AvaSpeedUpMenu", pushParam, "trans_zoomComp");
    }

    private void OnOutpostButton(object param)
    {
        if (MenuMgr.instance.hasMenuByName("AvaMainChrome"))
        {
            MenuMgr.instance.pop2Menu("AvaMainChrome");
        }
        GameMain.singleton.setSearchedTileToHighlight2(cachedPlayer.RallyAttack.StarterCoordX, cachedPlayer.RallyAttack.StarterCoordY);
        GameMain.singleton.gotoMap2(cachedPlayer.RallyAttack.StarterCoordX, cachedPlayer.RallyAttack.StarterCoordY);
    }
}
