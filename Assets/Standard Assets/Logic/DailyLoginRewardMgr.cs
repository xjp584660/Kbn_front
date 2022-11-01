using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

using UnityNet = KBN.UnityNet;
using MenuMgr = KBN.MenuMgr;
using MyItems = KBN.MyItems;
using _Global = KBN._Global;

/// <summary>
/// Logic layer for daily login reward.
/// </summary>
public class DailyLoginRewardMgr {
    #region Instance related
    private DailyLoginRewardMgr() {
        HasNotOpenedUI = true;
    }
    
    public static DailyLoginRewardMgr Instance { get; private set; }

    public static void MakeInstance() {
        if (Instance != null) {
            throw new NotSupportedException("An instance of DailyLoginRewardMgr already exists.");
        }
        Instance = new DailyLoginRewardMgr();
    }

    public static void ClearInstance() {
        Instance = null;
    }
    #endregion

    #region Fields and properties
    public DailyLoginRewardData Data { get; private set; }
    public long NewDataTimeStamp { get; private set; }
    public int LoginDayCnt { get; private set; }
    public bool FirstLoginToday { get; private set; }
    public bool AutoPopup { get; private set; }
    public bool HasNotOpenedUI { get; set; } // Modified and used by the UI layer

    private bool featureSwitch;
    public bool FeatureSwitch { 
        get {
            return featureSwitch;
        }
        private set {
            if (value != featureSwitch) {
                featureSwitch = value;
                MenuMgr.instance.sendNotification(Constant.Notice.DailyLoginRewardFeatureOnOrOff, featureSwitch);
            }
        }
    }
    private HashSet<int> claimedDays = new HashSet<int>();

    public bool HasMystryChest {
        get {
            if (Data == null) {
                return false;
            }
            return Data.HasMystryChest;
        }
    }

    public bool AllClaimed {
        get {
            if (Data == null) {
                return false;
            }
            //_Global.LogWarning("[DailyLoginRewardMgr AllClaimed: claimedDays.Count=" + claimedDays.Count +
            //        ", Data.RewardCount=" + Data.RewardCount);
            return claimedDays.Count >= Data.RewardCount;
        }
    }

    public bool CanClaimAny {
        get {
            if (Data == null) {
                return false;
            }

            for (int i = 0; i < Data.Length && i < LoginDayCnt; ++i) {
                if (!claimedDays.Contains(i + 1) && Data[i].ItemId > 0) {
                    return true;
                }
            }
            return false;
        }
    }
    #endregion

    #region public interface
    // Called during getSeed and updateSeed
    public void UpdateBySeed(HashObject seed) {
        if (seed["dailyLoginReward"] == null) {
            FeatureSwitch = false;
            return;
        }
        HashObject dailyLoginReward = seed["dailyLoginReward"] as HashObject;
        FeatureSwitch = (_Global.INT32(dailyLoginReward["featureSwitch"]) != 0);
        NewDataTimeStamp = _Global.INT64(dailyLoginReward["configTimeStamp"]);
    }

    // To be called in getSeedOk
    public void InitDataFromGetSeed(HashObject seed) {
        if (seed["dailyLoginRewardDetail"] == null) {
            return;
        }
        PopulateData(seed["dailyLoginRewardDetail"]);
    }
    
    // Called after sign up
    public void UpdateLogin(int dayCnt, bool firstLoginToday, bool autoPopup) {
        LoginDayCnt = dayCnt;
        FirstLoginToday = firstLoginToday;
        AutoPopup = autoPopup;
    }

    // To be called when the presentation layer needs to show
    public void UpdateDataAndOpenMenu() {
        if (Data != null && NewDataTimeStamp > 0 && Data.TimeStamp == NewDataTimeStamp) {
            MenuMgr.instance.sendNotification(Constant.Notice.DailyLoginRewardUpdateDataSuccess, null);
            return;
        }

        string url = "getDailyLoginRewardConfigs.php";
        WWWForm form = new WWWForm();
        UnityNet.DoRequest(url, form, new Action<HashObject>(OnGetNewDataSuccess), new Action<string, string>(OnGetNewDataFailure));
    }


    public bool HasClaimedOnDay(int dayCnt) {
        return claimedDays.Contains(dayCnt);
    }

    public bool HasClaimedToday() {
        return HasClaimedOnDay(LoginDayCnt);
    }

    // dayCnt starts from 1
    public void ClaimReward(int dayCnt) {
        string url = "claimDailyLoginReward.php";
        WWWForm form = new WWWForm();
        form.AddField("dayCnt", dayCnt.ToString());
        form.AddField("itemId", Data[dayCnt - 1].ItemId);
        form.AddField("itemCnt", Data[dayCnt - 1].ItemCnt);
        UnityNet.DoRequest(url, form, new Action<HashObject>(OnClaimSuccess), new Action<string, string>(OnClaimFailure));
    }
    #endregion

    #region private methods
    private void OnClaimSuccess(HashObject result) {
        if (result == null) return;
        int dayCnt = _Global.INT32(result["dayCnt"]);
        int itemId = _Global.INT32(result["itemId"]);
        int itemCnt = _Global.INT32(result["itemCnt"]);

        claimedDays.Add(dayCnt);
        MyItems.singleton.AddItemWithCheckDropGear(itemId, itemCnt);

        MenuMgr.instance.sendNotification(Constant.Notice.DailyLoginRewardClaimSuccess,
            new Hashtable() {
                { "dayCnt", dayCnt },
                { "itemId", itemId },
                { "itemCnt", itemCnt },
            }
        );
    }

    private void OnClaimFailure(string errMsg, string errCode) {
        MenuMgr.instance.sendNotification(Constant.Notice.DailyLoginRewardClaimFailure,
            new Hashtable() {
                { "errMsg", errMsg },
                { "errCode", errCode },
            }
        );
    }

    private void OnGetNewDataSuccess(HashObject result) {
        PopulateData(result);
        MenuMgr.instance.sendNotification(Constant.Notice.DailyLoginRewardUpdateDataSuccess, null);
    }

    private void PopulateData(HashObject result) {
        HashObject claimedDaysDict = result["playerinfo"]["claimflag"];
        if (claimedDaysDict != null) {
            claimedDays.Clear();
            foreach (string key in claimedDaysDict.Keys) {
                claimedDays.Add(_Global.INT32(claimedDaysDict[key]));
            }
        }
        Data = DailyLoginRewardData.CreateWithHashObject(result);
    }
    
    private void OnGetNewDataFailure(string errMsg, string errCode) {
        MenuMgr.instance.sendNotification(Constant.Notice.DailyLoginRewardUpdateDataFailure,
            new Hashtable() {
                { "errMsg", errMsg },
                { "errCode", errCode },             
            }
        );
    }
    #endregion
}
