using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

using Datas = KBN.Datas;
using GameMain = KBN.GameMain;
using KBNPlayer = KBN.KBNPlayer;
using _Global = KBN._Global;

public class AllianceVO : BaseVO {
    public int allianceId;
    public string description;
    public string welcomeMessage;
    public int membersCount;   //members in my.
    public string name;
    public int founderUserId;
    public int avatarId;
    public long might;
    public int ranking;
    public int hostAvatarId;
    public int hostUserId;
    public string host;
    public string hostGenderAndName;
    public string founderName;
    public string founderGenderAndName;
    public string role;
	public int level;
    public string leaderName;
    public int leaderId;
	public int league;
	public int rankInLeague;
	public AllianceEmblemData emblem;

    //my..
    public int userOfficerType;
    public int founderAvatarId;
    //fix..
    public bool selected = false;
    public int topIndex = 0;    //

    public int minLevelCanJoin;
    public long minMightCanJoin;
    
    //  need true check, don false't need check.
    public bool joinCheckMode = true;

    public int languageId=1;
    
    //public string ToString()
    //{ //  for view this object detail info during debug.
    //  return "{" + name + ":" + might.ToString() + "}";
    //}
    
    public bool CanJoin() {
        if (minMightCanJoin > KBNPlayer.instance.getMight()) {
            return false;
        }
        if (minLevelCanJoin > KBNPlayer.instance.getTitle()) {
            return false;
        }
        return true;
    }
    
    public void mergeDataFromOthers(object src) {
        base.mergeDataFrom(src);
        
        this.allianceId = this.getInt("allianceId");
        this.description = this.getString("description");
        this.welcomeMessage = this.getString("welcomemessage");
        this.membersCount = this.getInt("membersCount");
        this.name = this.getString("name");
        this.founderUserId = this.getInt("founderUserId");
        this.avatarId = this.getInt("avatarId");
        this.might = this.getLong("might");
        this.ranking = this.getInt("ranking");
        this.hostAvatarId = this.getInt("hostAvatarId");
        this.hostUserId = this.getInt("hostUserId");
        this.host = this.getString("host");
        this.hostGenderAndName = this.getString("hostGenderAndName");
        this.founderName = this.getString("founderName");
        this.founderGenderAndName = this.getString("founderGenderAndName");
		this.level = this.getInt ("level");
        this.leaderName = this.getString("leaderName");
        this.leaderId = this.getInt("leaderId");
		this.league = this.getInt ("leagueLevel");
		this.rankInLeague = this.getInt ("leagueRank");
        this.joinCheckMode = (this.getInt("recrutingmode") == 0);
        this.languageId=this.getInt("languageId");
        if (this.joinCheckMode) {
            this.minLevelCanJoin = this.getInt("levelLimit");
            this.minMightCanJoin = this.getLong("mightLimit");
            if (this.minLevelCanJoin < 1)
                this.minLevelCanJoin = 1;
        } else {
            this.minLevelCanJoin = 1;
            this.minMightCanJoin = 0;
        }

		if (null != rawData["emblem"] && string.Empty != rawData["emblem"].Value) {
			emblem = new AllianceEmblemData();
			JasonReflection.JasonConvertHelper.ParseToObjectOnce(emblem, rawData["emblem"]);
		} else {
			emblem = null;
		}
    }
    
    public void mergeDataFromMy(object src) {
        base.mergeDataFrom(src);
        this.allianceId = this.getInt("allianceId");
        this.description = this.getString("description");
        this.welcomeMessage = this.getString("welcomemessage");
        this.name = this.getString("allianceName");
        this.membersCount = this.getInt("members");
        this.ranking = this.getInt("ranking");
        this.might = this.getLong("might");
        this.founderName = this.getString("founder");
        this.founderGenderAndName = this.getString("founderGenderAndName");
        this.founderAvatarId = this.getInt("founderAvatarId");
        
        this.leaderName = this.getString("leaderName");
        this.leaderId = this.getInt("leaderId");
		this.league = this.getInt ("leagueLevel");
		this.rankInLeague = this.getInt ("leagueRank");
        this.joinCheckMode = (this.getInt("recrutingmode") == 0);
        this.languageId=this.getInt("languageId");
        
        if (this.joinCheckMode) {
            this.minLevelCanJoin = this.getInt("levelLimit");
            this.minMightCanJoin = this.getLong("mightLimit");
            if (this.minLevelCanJoin < 1)
                this.minLevelCanJoin = 1;
        } else {
            this.minLevelCanJoin = 1;
            this.minMightCanJoin = 0;
        }

		if (null != rawData["emblem"] && string.Empty != rawData["emblem"].Value) {
			emblem = new AllianceEmblemData();
			JasonReflection.JasonConvertHelper.ParseToObjectOnce(emblem, rawData["emblem"]);
		} else {
			emblem = null;
		}
    }
    //test..
    public void setUserOfficerType(object obj) {
        userOfficerType = _Global.INT32(obj);
        role = KBN.Alliance.getPositionStr(userOfficerType);
    }
    
    public bool isAdmin() {
        return userOfficerType == Constant.Alliance.Chancellor || userOfficerType == Constant.Alliance.ViceChancellor;
    }
    
    public bool HaveRights(AllianceRights.RightsType rightsType) {
        return AllianceRights.IsHaveRights(userOfficerType, rightsType);
    }
    
    public bool isChairman() {
        return userOfficerType == Constant.Alliance.Chancellor;
    }
    
    public bool isVC() {
        return userOfficerType == Constant.Alliance.ViceChancellor;
    }
    
    static public string getAllianceDiplomacy(int cityId, int allianceId) {
        bool bMine = false;
        HashObject seed = GameMain.singleton.getSeed();
        int curCityId = GameMain.singleton.getCurCityId();
        
        string result = Datas.getArString("Alliance.relationNeutral");
        if (cityId == curCityId) {
            bMine = true;
        } else {
            object[] cities = _Global.GetObjectValues(seed["cities"]);
            for (int i=0; i<cities.Length; i++) {
                if (cityId == _Global.INT32((cities[i] as HashObject)[_Global.ap + 0])) {
                    bMine = true;
                    break;
                }
            }
        }
        
        if (bMine) {
            result = Datas.getArString("Alliance.relationFriendly");
        } else if (allianceId != 0 && seed["allianceDiplomacies"] != null && seed["allianceDiplomacies"]["allianceId"] != null) {
            if (allianceId == _Global.INT32(seed["allianceDiplomacies"]["allianceId"])) { // they're in the player's alliance
                result = Datas.getArString("Alliance.relationFriendly");
            } else {
                object[] alliances = _Global.GetObjectValues(seed["allianceDiplomacies"]["friendly"]);
                bool completed = false;
                for (int i = 0; i<alliances.Length; i++) {
                    if (allianceId == _Global.INT32((alliances[i] as HashObject)["allianceId"].Value)) {
                        result = Datas.getArString("Alliance.relationFriendly");
                        completed = true;
                        break;
                    }
                }
                if (completed == false) {
                    alliances = _Global.GetObjectValues(seed["allianceDiplomacies"]["hostile"]);
                    for (int i = 0; i<alliances.Length; i++) {
                        if (allianceId == _Global.INT32((alliances[i] as HashObject)["allianceId"])) {
                            result = Datas.getArString("Alliance.relationHostile");
                            completed = true;
                            break;
                        }
                    }
                }
                
                if (completed == false) {
                    alliances = _Global.GetObjectValues(seed["allianceDiplomacies"]["friendlyToThem"]);
                    for (int i = 0; i<alliances.Length; i++) {
                        if (allianceId == _Global.INT32((alliances[i] as HashObject)["allianceId"])) {
                            result = Datas.getArString("Alliance.statusPending");
                            completed = true;
                            break;
                        }
                    }
                }
                
                if (completed == false) {
                    alliances = _Global.GetObjectValues(seed["allianceDiplomacies"]["friendlyToYou"]);
                    for (int i = 0; i<alliances.Length; i++) {
                        if (allianceId == _Global.INT32((alliances[i] as  HashObject)["allianceId"])) {
                            result = Datas.getArString("Alliance.statusPending");
                            completed = true;
                            break;
                        }
                    }
                }
                
                if (completed == false) {
                    result = Datas.getArString("Alliance.relationNeutral");
                }
            }
        } else {
            result = Datas.getArString("Alliance.relationNeutral");
        }
        return result;
    }
}
