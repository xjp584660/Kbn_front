using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using KBN;

/// <summary>
/// Gds manager helper. Extended and utility methods for gds manager.
/// </summary>
public static class GdsManagerHelper
{
    private const string Url2CheckGdsVersion = "gdsVersion.php";

    public static void CheckGdsVersion(this GdsManager mgr, Action<HashObject> callback)
    {
        var reqParams = new Hashtable();
        reqParams["d"] = Datas.singleton.getDataVersion();
        reqParams["worldId"] = Datas.singleton.worldid();

        foreach (var kvPair in mgr)
        {
            var gds = kvPair.Value;
            reqParams[gds.KeyForVersionCheck] = gds.InitVersion();
        }

        UnityNet.reqWWW(Url2CheckGdsVersion, reqParams, new Action<HashObject>(delegate (HashObject ho) {
            var data = ho["data"];
            if (data == null)
            {
                return;
            }

            if (data["d"] != null)
            {
                GameMain.singleton.NeedDownloadData = _Global.INT32(data["d"]["load"]) != 0;
            }

            foreach (var kvPair in mgr)
            {
                var gds = kvPair.Value;
                var node = data[gds.KeyForVersionCheck];
                if (node == null)
                {
                    continue;
                }
                gds.NeedDownLoad = _Global.INT32(node["load"]) != 0;

                if (gds.NeedDownLoad)
                {
                    _Global.Log(string.Format("[GdsManagerHelper CheckGdsVersion] need download: FileName={0}, CurrentVer={1}, NewVer={2}",
                                              gds.FileName, gds.getVersion(), _Global.GetString(node["version"])));
                }
            }

            if (callback != null)
            {
                callback(ho);
            }
        }), null);
    }

    public static void CheckGdsReloadFromServer(this GdsManager mgr, HashObject ho)
    {
        foreach (var kvPair in mgr)
        {
            var gds = kvPair.Value;
            var node = ho[gds.KeyForVersionCheck];
            if (node == null)
            {
                continue;
            }

            if (!gds.IsLoaded)
            {
                continue;
            }

            if (_Global.INT32(node) == gds.getVersion())
            {
                continue;
            }

            gds.IsReloaded = false;
            _Global.Log("[GdsManagerHelper CheckGdsReloadFromServer] Try to re-download gds: " + gds.FileName);
            gds.DownLoadFromServer(gds.FileName);
        }
    }

    public static bool NeedRestartGame(this GdsManager mgr)
    {
        return mgr.Any<KeyValuePair<string, NewGDS>>(kvPair => kvPair.Value.NeedRestartGame);
    }

    public static bool GdsesAreAllReloaded(this GdsManager mgr)
    {
        foreach (var kvPair in mgr)
        {
            if (!kvPair.Value.IsReloaded)
            {
                return false;
            }
        }

        return true;
    }

    public static bool GdsesOfCategoryAreLoaded(this GdsManager mgr, GdsCategory category)
    {
        var gdses = mgr.GetGdsesOfCategory(category);
        if (gdses == null)
        {
            return false;
        }

        for (int i = 0; i < gdses.Length; ++i)
        {
            if (!gdses[i].IsLoaded)
            {
                return false;
            }
        }
        return true;
    }

    public static void LoadGdsesOfCategory(this GdsManager mgr, GdsCategory category)
    {
        foreach (var gds in mgr.GetGdsesOfCategory(category))
        {
            gds.LoadData();
        }
    }

    public static void LoadGdsesOfCategoryFromLocal(this GdsManager mgr, GdsCategory category)
    {
        foreach (var gds in mgr.GetGdsesOfCategory(category))
        {
            gds.LoadFromLocal();
        }
    }

    public static void RegisterAll(this GdsManager mgr)
    {
        mgr.Register (
            new GDS_Building (),
            new KBN.GDS_Troop (),
            new KBN.GDS_Gear (),
            new KBN.GDS_GearSkill (),
            new KBN.GDS_TierSkill (),
            new KBN.GDS_GearLevelUp (),
            new KBN.GDS_GearSysUnlock (),
            new KBN.GDS_GearItemChestList (),
            new KBN.GDS_WorldMap (),
            new KBN.GDS_PveStory (),
            new KBN.GDS_PveLevel (),
            new KBN.GDS_PveBoss (),
            new KBN.GDS_PveChapter (),
            new KBN.GDS_PveMap (),
            new KBN.GDS_PveDrop (),
            new KBN.GDS_Vip (),
            new KBN.GDS_HeroBasic (),
            new KBN.GDS_HeroCommon (),
            new KBN.GDS_HeroLevel (),
            new KBN.GDS_HeroRenownItem (),
            new KBN.GDS_HeroSkillFate (),
            new KBN.GDS_HeroSkillLevel (),
            new KBN.GDS_HeroLevelUpItems (),
			new KBN.GDS_AllianceUpgrade (),
			new KBN.GDS_AllianceDonate (),
			new KBN.GDS_AllianceSkill (),
			new KBN.GDS_Buff (),
            new KBN.GDS_AllianceShopItem (),
            new KBN.GDS_AvaSkill (),
			new KBN.GDS_AVABuffList (),
			new KBN.GDS_AvaReward (),
            new KBN.GDS_AvaModeReward(),
			new KBN.GDS_SellItem (),
			new GDS_Technology(),
			new GDS_TechnologyShow(),
			new KBN.GDS_SeasonLeague(),
            new KBN.GDS_Alliancelanguage(),
            new KBN.GDS_WorldBoss(),
            new GDS_SeasonPassMap(),
            new GDS_Relic(),
            new GDS_RelicSkill(),
            new GDS_RelicUpgrade(),
            new GDS_RelicSet(),
            new KBN.GDS_UnSellItem(),
            new KBN.GDS_ExpeditionBattle(),
            new KBN.GDS_ExpeditionMap(),
            new KBN.GDS_ExpeditionRankReward(),
            new KBN.GDS_ExpeditionBuff(),
            new KBN.GDS_ExpeditionLeader(),
            new KBN.GDS_ExpeditionMerChant()
            );
    }
}
