using UnityEngine;
using System.Collections;

using MessageDAO = KBN.MessageDAO;
using Datas = KBN.Datas;
using _Global = KBN._Global;
using GameMain = KBN.GameMain;

public class ReportViewingStrategy_Default : ReportViewingStrategy_Base
{
    public override void DeleteAllReports(MessageDAO dao)
    {
        dao.DeleteAllReports();
    }
    
    public override void InsertReportMessage(MessageDAO dao, object[] reports)
    {
        dao.InsertReportMessage(reports);
    }
    
    public override void DeleteReports(MessageDAO dao, int[] reportIds)
    {
        dao.DeleteReports(reportIds);
    }
    
    public override Hashtable SelectReports(MessageDAO dao, int pageNo, int pageSize)
    {
        return dao.SelectReports(pageNo, pageSize);
    }
    
    public override void SetReportsRead(MessageDAO dao, int[] reportIds)
    {
        dao.SetReportsRead(reportIds);
    }

    public override int ReportPageCount(MessageStatistics statistics, int pageSize)
    {
        return statistics.ReportPageCount(pageSize);
    }

    public override int AllReportCount(MessageStatistics statistics)
    {
        return statistics.AllReportCount;
    }

    public override int UnreadReportCount(MessageStatistics statistics)
    {
        return statistics.UnReadReportCount;
    }

    public override string GetMarchReportTitle(HashObject report, HashObject rslt)
    {
        var subject = "";
        var curUserId = Datas.singleton.tvuid();
        //attack side
        var side1PlayerId = _Global.INT32(report["side1PlayerId"]);
        //defense side
        var side0PlayerId = _Global.INT32(report["side0PlayerId"]);
        
        if (curUserId == side1PlayerId)
        {
            var side1PlayeName = "";
            if (rslt != null)
            {
                side1PlayeName = _Global.GetString(rslt["arPlayerNames"]["p" + side1PlayerId]);
            }
            else
            {
                side1PlayeName = _Global.GetString(report["s1Name"]);
            }

            switch (_Global.INT32(report["marchType"]))
            {
            case Constant.MarchType.TRANSPORT:
                subject = "(" + side1PlayeName + ")" + " " + Datas.getArString("Common.Transported") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ")";
                break;
            case Constant.MarchType.REINFORCE:
                
                break;
			case Constant.MarchType.COLLECT:
				if ( side0PlayerId == 0){
					subject = "(" + side1PlayeName + ")" + " "+ Datas.getArString("Newresource.Report_Gathered") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ") - "+  Datas.getArString("Newresource.tile_name_Nolevel")+ " " + Datas.getArString("Common.Lv") + report["side0TileLevel"].Value ;
				}else{
					subject = "(" + side1PlayeName + ")" + " "+ Datas.getArString("Common.Attacked") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ") - "+  Datas.getArString("Newresource.tile_name_Nolevel")+ " " + Datas.getArString("Common.Lv") + report["side0TileLevel"].Value ;
				}
					break;
            case Constant.MarchType.COLLECT_RESOURCE:
                int collectResourceTileType = _Global.INT32(report["boxContent"]["type"]);
                string collectResourceTileName = CollectionResourcesMgr.instance().GetResourceName(collectResourceTileType);
				if ( side0PlayerId == 0){
					subject = "(" + side1PlayeName + ")" + " "+ Datas.getArString("Newresource.Report_Gathered2") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ") - "+  collectResourceTileName+ " " + Datas.getArString("Common.Lv") + report["side0TileLevel"].Value ;
				}else{
					subject = "(" + side1PlayeName + ")" + " "+ Datas.getArString("Common.Attacked") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ") - "+  collectResourceTileName+ " " + Datas.getArString("Common.Lv") + report["side0TileLevel"].Value ;
				}
			    break;
            case Constant.MarchType.EMAIL_WORLDBOSS:
                subject = "(" + side1PlayeName + ")" + " " + Datas.getArString("Common.Attacked") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ") - "+Datas.getArString("WorldBoss.BossUnit_Text1");;
                break;
            case Constant.MarchType.ATTACK:              
            case Constant.MarchType.PVP:
			case Constant.MarchType.RALLY_ATTACK:
			case Constant.MarchType.JION_RALLY_ATTACK:
                if (_Global.INT32(report["side0TileType"]) != 51 || side0PlayerId == 0)
                {
                    var tileTypeNameStr = "";
					int tileLv=_Global.INT32(report["side0TileLevel"]);
                    if (_Global.INT32(report["side0TileType"]) == 51 && side0PlayerId == 0)
                    {
						if(tileLv>10){
							tileTypeNameStr = Datas.getArString("Common.BarbarianCamp2");
							tileLv -= 10;
						}else{
							tileTypeNameStr = Datas.getArString("Common.BarbarianCamp");
						}
                        
                    }
                    else
                    {
						tileTypeNameStr = ParseTileType(_Global.INT32(report["side0TileType"]), _Global.INT32(report["boxContent"]["tileKind"]));
                    }
					subject = "(" + side1PlayeName + ")" + " " + Datas.getArString("Common.Attacked") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ") - " + tileTypeNameStr + " " + Datas.getArString("Common.Lv") + tileLv;
                }
                else
                {
                    subject = "(" + side1PlayeName + ")" + " " + Datas.getArString("Common.Attacked") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ")";
                }
                break;
            case Constant.MarchType.SCOUT:
                subject = "(" + side1PlayeName + ")" + " " + Datas.getArString("Common.Scouted") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ")";
                
                break;
            case Constant.MarchType.REASSIGN:
                var fromCity = GameMain.singleton.getCityNameById(_Global.INT32(report["side1CityId"]));
                var toCity = GameMain.singleton.getCityNameById(_Global.INT32(report["side0CityId"]));
                subject = Datas.getArString("ModalMessagesViewReports.ReassignFrom") + " " + fromCity + " " + Datas.getArString("Common.To") + " " + toCity;
                break;  
            case Constant.MarchType.PVE:
            case Constant.MarchType.ALLIANCEBOSS:
                var pveLevelName = _Global.ToString(report["side0LevelName"]);
                subject = "(" + side1PlayeName + ")" + " " + Datas.getArString("Common.Attacked") + " " + Datas.getArString(pveLevelName);
                break;

                case Constant.MarchType.MistExpedition:
                    subject = "(" + side1PlayeName + ")" + Datas.getArString("Common.ExpeditionBattle");
                    break;

            default:
                break; 
            }
        }
        else
        {
            var myCityName = "";
            var myUserName = "";
            var otherUserName = "";
            var otherCityName = "";
            if (rslt != null)
            {
                myCityName = _Global.GetString(rslt["arCityNames"]["c" + report["side0CityId"].Value]);
                myUserName = _Global.GetString(rslt["arPlayerNames"]["p" + side0PlayerId]);
                otherUserName = _Global.GetString(rslt["arPlayerNames"]["p" + side1PlayerId]);
                otherCityName = _Global.GetString(rslt["arCityNames"]["c" + report["side1CityId"].Value]);
            }
            else
            {
                myCityName = _Global.GetString(report["s0CityName"]);
                myUserName = _Global.GetString(report["s0Name"]);
                otherUserName = _Global.GetString(report["s1Name"]);
                otherCityName = _Global.GetString(report["s1CityName"]);
            }
            if (myCityName.Length > 12)
            {
                myCityName = myCityName.Substring(0, 9) + "...";
            }
            
            if (myUserName.Length > 12)
            {
                myUserName = myUserName.Substring(0, 9) + "...";
            }
            
            if (otherUserName.Length > 12)
            {
                otherUserName = otherUserName.Substring(0, 9) + "...";
            }
            
            if (otherCityName.Length > 12)
            {
                otherCityName = otherCityName.Substring(0, 9) + "...";
            }
            
            switch (_Global.INT32(report["marchType"]))
            {
            case Constant.MarchType.TRANSPORT:
                subject = "(" + myUserName + " " + myCityName + ")" + " " + Datas.getArString("Common.TransportedFrom") + " " + otherUserName + " (" + otherCityName + ")";
                break;
            case Constant.MarchType.REINFORCE:
                
                break;
			
            case Constant.MarchType.ATTACK:
            case Constant.MarchType.PVP:
                subject = "(" + myUserName + " " + myCityName + ")" + " " + Datas.getArString("Common.AttackedBy") + " " + otherUserName + " (" + otherCityName + ")";
                break;
            case Constant.MarchType.SCOUT:
                subject = "(" + myUserName + " " + myCityName + ")" + " " + Datas.getArString("Common.ScoutedBy") + " " + otherUserName + " (" + otherCityName + ")";
                break;
            case Constant.MarchType.REASSIGN:
                
                break;  
			case Constant.MarchType.COLLECT:
				if (_Global.INT32(report["marchType"])==Constant.MarchType.COLLECT && side0PlayerId == 0){
					subject ="(" + myUserName + " " + myCityName + ")" + " "+ Datas.getArString("Newresource.Report_Gathered") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ") - "+  Datas.getArString("Newresource.tile_name_Nolevel")+ " " + Datas.getArString("Common.Lv") + report["side0TileLevel"].Value ;
				}else{
					subject ="(" + myUserName + " " + myCityName + ")" + " "+ Datas.getArString("Common.AttackedBy") + " " + otherUserName   + " (" + otherCityName + ")";
					
				}
					break;
            case Constant.MarchType.COLLECT_RESOURCE:
                int collectTileType = _Global.INT32(report["boxContent"]["type"]);
                string collectTileName = CollectionResourcesMgr.instance().GetResourceName(collectTileType);
				if (_Global.INT32(report["marchType"])==Constant.MarchType.COLLECT_RESOURCE && side0PlayerId == 0){
					subject ="(" + myUserName + " " + myCityName + ")" + " "+ Datas.getArString("Newresource.Report_Gathered") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ") - "+  collectTileName+ " " + Datas.getArString("Common.Lv") + report["side0TileLevel"].Value ;
				}else{
					subject ="(" + myUserName + " " + myCityName + ")" + " "+ Datas.getArString("Common.AttackedBy") + " " + otherUserName   + " (" + otherCityName + ")";
					
				}
					break;
				
            default:
                break; 
            }
        }
        return subject;
    }

	protected override string ParseTileType(int type, int tileKind)
    {
        string tileName = "";
        switch(type)
        {
        case Constant.TileType.BOG:
            tileName = Datas.getArString("Common.Bog");
            break;
            
        case Constant.TileType.GRASSLAND:
            tileName = Datas.getArString("Common.Grassland");
            break;
            
        case Constant.TileType.LAKE:
            tileName = Datas.getArString("Common.Lake");
            break;
            
        case Constant.TileType.WOODS:
            tileName = Datas.getArString("Common.Woods");
            break;
            
        case Constant.TileType.HILLS:
            tileName = Datas.getArString("Common.Hills");
            break;
            
        case Constant.TileType.MOUNTAIN:
            tileName = Datas.getArString("Common.Mountain");
            break;
            
        case Constant.TileType.PLAIN:
            tileName = Datas.getArString("Common.Plain");
            break;
		case Constant.TileType.WORLDMAP_1X1_ACT:
			tileName = Datas.getArString( ( tileKind == 1 ) ? "PVP.TileType_Boss" : "PVP.TileType_Resource" );
			break;
		case Constant.TileType.WORLDMAP_1X1_DUMMY: 
		case Constant.TileType.WORLDMAP_2X2_LT_DUMMY:
		case Constant.TileType.WORLDMAP_2X2_RT_DUMMY:
		case Constant.TileType.WORLDMAP_2X2_LB_DUMMY:
		case Constant.TileType.WORLDMAP_2X2_RB_DUMMY:
			tileName = Datas.getArString("Common.Bog");
			break;
		case Constant.TileType.WORLDMAP_2X2_LT_ACT:
		case Constant.TileType.WORLDMAP_2X2_RT_ACT:
		case Constant.TileType.WORLDMAP_2X2_LB_ACT:
		case Constant.TileType.WORLDMAP_2X2_RB_ACT:
			tileName = Datas.getArString( ( tileKind == 1 ) ? "PVP.TileType_Boss" : "PVP.TileType_Resource" );
			break;
        }
        
        return tileName;
    }

    public override bool IsSuccessReport(HashObject header, HashObject data)
    {
        int marchType = _Global.INT32(header["marchtype"]);
        if (marchType == Constant.MarchType.TRANSPORT || marchType == Constant.MarchType.REASSIGN)
        {
            return true;
        }
        
        if (marchType == 8)
        {
            return _Global.INT32(data["winner"]) == 0;
        }
        
        if (marchType == Constant.MarchType.PVP)
        {
            return _Global.INT32(data["winner"]) == 1;
        }
        
        if (marchType == Constant.MarchType.SCOUT)
        {
            return _Global.GetBoolean(data["success"]);
        }
        
        if (_Global.INT32(header["tiletype"]) != 51)
        {
            if (_Global.INT32(header["side"]) == 1&&_Global.INT32(data["winner"]) == 1  )
            {
                return true;
            }
            else if (_Global.INT32(header["side"]) == 1 && _Global.INT32(data["winner"]) != 1)
            {
                return false;
            }
            else if (_Global.INT32(header["side"]) == 0&&_Global.INT32(data["winner"]) != 1 )
            {
                return true;
            }
            else if (_Global.INT32(header["side"]) == 0 && _Global.INT32(data["winner"]) == 1)
            {
                return false;
            }
        }
        else
        {
            if (_Global.INT32(header["defid"]) == 0)
            {
                //ATTACK BARBARIAN
                if (_Global.INT32(data["winner"]) == 1 && _Global.INT32(header["side"]) == 1 || _Global.INT32(data["winner"]) == 2 && _Global.INT32(header["side"]) == 1)
                {
                    return true;
                }
                else if (_Global.INT32(header["side"]) == 1 && _Global.INT32(data["winner"]) == 0)
                {
                    return false;
                }
            }
            else
            {
                //attack player city
                if (_Global.INT32(header["side"]) == 1&&_Global.INT32(data["winner"]) == 1  )
                {
                    return true;
                }
                else if (_Global.INT32(header["side"]) == 1 && _Global.INT32(data["winner"]) != 1)
                {
                    return false;
                }
                else if (_Global.INT32(header["side"]) == 0&&_Global.INT32(data["winner"]) != 1 )
                {
                    return true;
                }
                else if (_Global.INT32(header["side"]) == 0 && _Global.INT32(data["winner"]) == 1)
                {
                    return false;
                }
                
            }
        }
        
        return false;
    }

    public override string GetAttackReportType(HashObject g_header, HashObject g_data)
    {
        string reportType = string.Empty;

        if (_Global.INT32(g_header["marchtype"]) == 8)
        {
            int rand = 1 + Mathf.FloorToInt(Random.value * 2);
            
            if (_Global.INT32(g_data["winner"]) == 0)
            {
                reportType = "barbarianraid_lose" + rand;
            }
            else
            {
                reportType = "barbarianraid_win" + rand;
            }
        }
        else if (_Global.INT32(g_header["marchtype"]) == Constant.MarchType.PVP)
        {
            if( _Global.INT32(g_data["winner"]) == 1 )
            {
                reportType = "wilderness_win";
            }
            else
            {
                reportType = "wilderness_lose";
            }
        }
        else if (_Global.INT32(g_header["tiletype"]) != 51)
        {
            reportType = this.GetAttackWildernessReportType(g_header, g_data);
        }
        else
        {
            if (_Global.INT32(g_header["defid"]) == 0)
            {
                //ATTACK BARBARIAN
                if (_Global.INT32(g_data["winner"]) == 1 && _Global.INT32(g_header["side"]) == 1 || _Global.INT32(g_data["winner"]) == 2 && _Global.INT32(g_header["side"]) == 1)
                {
                    //ATTACK BARBARIAN AND WIN
                    reportType = "barbarian_win";
                }
                else if(_Global.INT32(g_header["side"])==1 && _Global.INT32(g_data["winner"])==0)
                {
                    //ATTACK BARBARIAN AND LOSE
                    reportType = "barbarian_lose";
                }
            }
            else
            {
                reportType = this.GetAttackOtherPlayerReportType(g_header, g_data);
            }
        }
        
        return reportType;
    }

    public override void GoToMapFromReport(int x, int y)
    {
        GameMain.singleton.gotoMap(x, y);
    }
}
