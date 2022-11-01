using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

using Datas = KBN.Datas;

public class DipAllianceVO : AllianceVO {
    //  public int allianceId;
    //  public string name;    //allianceName
    public int relation;   //Friend 1 hostile 2 pending. 3
    //  public int membersCount;
    //  public int ranking;     //rank
    //  public int might;
    //
    public int status; //
    public string statusStr;
    public string relationStr;
    protected static string[] SS = new string[] {
        "",
        "Friendly",
        "Hostile",
        "Pending"
    };
    
    public static void SInit() {
        SS[1] = Datas.getArString("Alliance.relationFriendly");
        SS[2] = Datas.getArString("Alliance.relationHostile");
        SS[3] = Datas.getArString("Alliance.statusPending");
    }
    
    public void mergeDataFromDipView(object src) {
        base.mergeDataFrom(src);
        this.allianceId = this.getInt("allianceId");
        this.name = this.getString("allianceName");
        this.relation = this.getInt("relation");
        this.membersCount = this.getInt("membersCount");
        this.ranking = this.getInt("rank");
        this.might = this.getLong("might");
        this.founderName = this.getString("founderUserName");
        this.host = this.getString("host");
        //
        statusStr = SS[status];
    }
    
    public void mergeDataFromSearch(object src) {
        base.mergeDataFrom(src);
        this.allianceId = this.getInt("allianceId");
        this.name = this.getString("allianceName");
        this.relation = this.getInt("relation");
        this.membersCount = this.getInt("membersCount");
        this.ranking = this.getInt("ranking");
        this.might = this.getLong("might");
        this.founderUserId = this.getInt("founderUserId");
        //      this.hostGenderAndName = this.getString("hostGenderAndName");
        this.founderName = this.getString("founder");
        this.host = this.getString("host");
    }
    
    
}
