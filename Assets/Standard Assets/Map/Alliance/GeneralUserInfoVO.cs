using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

using _Global = KBN._Global;

[JasonReflection.JasonDataAttribute]
public class GeneralUserInfoVO : BaseVO {
    //TODO.. OfficeType ,positionType
    public int userId;
    public string name;
    public string genderAndName;
    public int fbuid;
    public long might;
    public int title;
	[JasonReflection.JasonData("portraitname")]
    public string avatar;
    [JasonReflection.JasonData("avatarFrameImg")]
    public string avatarFrame;
	public string badge;
    public int allianceId;
    public int officerType;
    public string ranking;
    public string allianceName;
	public AllianceEmblemData allianceEmblem;
    [JasonReflection.JasonDataAttribute("..skip auto")]
    public int[]
    provinceIds;
    public int cities;
    public int population;
    public int positionType;
    public string positionStr;
    public int oldOfficerType;
    public UnityEngine.Vector2[] coords;
    [JasonReflection.JasonData("mvp")]
    public bool isMVP;
	[JasonReflection.JasonData("lastLogin")]
	public string lastLogin;
	[JasonReflection.JasonData("canBeImpeached")]
	public bool isCanBeImpeached;
	//[JasonReflection.JasonData("impeachTime")]
	public long impeachTime;
    
    public override void mergeDataFrom(object src) {
        base.mergeDataFrom(src);
        JasonReflection.JasonConvertHelper.ParseToObjectOnce(this, src as HashObject);
        oldOfficerType = officerType;
        this.provinceIds = this.getIntArrayFromString((src as HashObject)["provinceIds"].Value as string, ","[0]);
        positionStr = KBN.Alliance.getPositionStr(positionType);
    }
    
    public void changeOfficeType(int type) {
        oldOfficerType = officerType;
        this.officerType = type;
        this.positionStr = KBN.Alliance.getPositionStr(officerType);
    }
}
