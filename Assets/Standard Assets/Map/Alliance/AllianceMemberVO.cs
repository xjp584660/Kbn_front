using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

using _Global = KBN._Global;
using ErrorMgr = KBN.ErrorMgr;

[JasonReflection.JasonData]
public class AllianceMemberVO : BaseVO {
    public int userId;
    public int positionType;
    public int cities;
    //public int population;
    public long might;
    public string dateJoined;
    public int daysInPosition;
    public string name;
    public string genderAndName;
    public int fbuid;
    public long prestige;
    public string ranking;
    public int title;
    public string lastLogin;
    [JasonReflection.JasonData("..skip")]
    public int
        lastLoginTS;   //  the timespan since last login time, lastLoginTimeSpan
    public string avatarurl;
    public int[] provinceIds;
    
    //addon.
    public string positionStr;
    public bool selected = false;
    [JasonReflection.JasonData("mvp")]
    public bool
        isMVP;
    
    //public string ToString()
    //{
    //  return "{AM-" + name + ":" + lastLogin + "}";
    //}
    
    public override void mergeDataFrom(object src) {
        base.mergeDataFrom(src);
        JasonReflection.JasonConvertHelper.ParseToObjectOnce(this, src as HashObject);
        //this.userId       = this.getInt("userId");
        //this.positionType     = this.getInt("positionType");
        //this.cities       = this.getInt("cities");
        //this.population   = this.getInt("population");
        //this.might            = this.getLong("might");
        //this.dateJoined       = this.getString("dateJoined");
        //this.daysInPosition = this.getInt("daysInPosition");
        //this.name             = this.getString("name");
        //this.genderAndName    = this.getString("genderAndName");
        //this.fbuid            = this.getInt("fbuid");
        //this.prestige         = this.getLong("prestige");
        //this.ranking      = this.getString("ranking");
        //this.title            = this.getInt("title");
        //this.lastLogin        = this.getString("lastLogin");
        string lastLoginTS_String = this.getString("lastLoginTS");
        if (lastLoginTS_String != null && lastLoginTS_String.Length != 0)
            this.lastLoginTS = _Global.INT32(lastLoginTS_String);
        else
            this.lastLoginTS = -1;
        
        this.avatarurl = this.getString("avatarurl");
        //      this.provinceIds    = this.getInt("provinceIds");
        this.provinceIds = this.getIntArrayFromString(_Global.GetString((src as HashObject)["provinceIds"]), ',');
        
        positionStr = KBN.Alliance.getPositionStr(positionType);
    }
    
    public void mergeDataFromApproval(object src) {
        base.mergeDataFrom(src);
        this.userId = this.getInt("fbuid"); //TODO..
        this.name = this.getString("name");
        this.genderAndName = this.getString("genderAndName");
        this.cities = this.getInt("cities");
        this.might = this.getLong("might");
    }
    
    public void mergeDataFromOfficer(object src) {
        base.mergeDataFrom(src);
        this.userId = this.getInt("id");
        this.name = this.getString("name");
        this.genderAndName = this.getString("genderAndName");
        this.cities = this.getInt("cities");
        this.might = this.getLong("might");
        this.positionType = this.getInt("type");
    }
    
    public void changePositionType(int type) {
        this.positionType = type;
        this.positionStr = KBN.Alliance.getPositionStr(positionType);
    }
}