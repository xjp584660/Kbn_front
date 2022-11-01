using System.Collections;

using MessageDAO = KBN.MessageDAO;
using Datas = KBN.Datas;
using _Global = KBN._Global;
using GameMain = KBN.GameMain;

public class ReportViewingStrategy_Ava : ReportViewingStrategy_Base
{
    public override void DeleteAllReports(MessageDAO dao)
    {
        dao.DeleteAllAvaReports();
    }

    public override void InsertReportMessage(MessageDAO dao, object[] reports)
    {
        dao.InsertAvaReportMessage(reports);
    }

    public override void DeleteReports(MessageDAO dao, int[] reportIds)
    {
        dao.DeleteAvaReports(reportIds);
    }

    public override Hashtable SelectReports(MessageDAO dao, int pageNo, int pageSize)
    {
        return dao.SelectAvaReports(pageNo, pageSize);
    }

    public override void SetReportsRead(MessageDAO dao, int[] reportIds)
    {
        dao.SetAvaReportsRead(reportIds);
    }

    public override int ReportPageCount(MessageStatistics statistics, int pageSize)
    {
        return statistics.AvaReportPageCount(pageSize);
    }

    public override int AllReportCount(MessageStatistics statistics)
    {
        return statistics.AllAvaReportCount;
    }

    public override int UnreadReportCount(MessageStatistics statistics)
    {
        return statistics.UnreadAvaReportCount;
    }

    public override string GetMarchReportTitle(HashObject report, HashObject rslt)
    {
        var subject = "";
        var curUserId = Datas.singleton.tvuid();
        //attack side
        var side1PlayerId = _Global.INT32(report["side1PlayerId"]);
        //defense side
        var side0PlayerId = _Global.INT32(report["side0PlayerId"]);
        
        if (curUserId != side0PlayerId)
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

            var tileTypeNameStr = ParseTileType(_Global.INT32(report["side0TileType"]), 0);
            switch (_Global.INT32(report["marchType"]))
            {
            case Constant.AvaMarchType.ATTACK:
                if (side0PlayerId == 0)
                {
                    subject = "(" + side1PlayeName + ")" + " " + Datas.getArString("Common.Attacked") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ") - " + tileTypeNameStr;
                }
                else
                {
                    subject = "(" + side1PlayeName + ")" + " " + Datas.getArString("Common.Attacked") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ")";
                }
                break;
            case Constant.AvaMarchType.SCOUT:
                subject = "(" + side1PlayeName + ")" + " " + Datas.getArString("Common.Scouted") + " " + "(" + report["side0XCoord"].Value + "," + report["side0YCoord"].Value + ")";
                break;
            case Constant.AvaMarchType.RALLYATTACK:
                if (side0PlayerId == 0)
                {
                    subject = string.Format("({0}) {1} ({2}, {3}) - {4}", side1PlayeName, Datas.getArString("AVA.chrome_mail_rallyacttackreport"),
                                            report["side0XCoord"].Value, report["side0YCoord"].Value, tileTypeNameStr);
                }
                else
                {
                    subject = string.Format("({0}) {1} ({2}, {3})", side1PlayeName, Datas.getArString("AVA.chrome_mail_rallyacttackreport"),
                                            report["side0XCoord"].Value, report["side0YCoord"].Value);
                }
                break;
            default:
                break; 
            }
        }
        else
        {
            var myUserName = "";
            var otherUserName = "";

            if (rslt != null)
            {
                myUserName = _Global.GetString(rslt["arPlayerNames"]["p" + side0PlayerId]);
                otherUserName = _Global.GetString(rslt["arPlayerNames"]["p" + side1PlayerId]);
            }
            else
            {
                myUserName = _Global.GetString(report["s0Name"]);
                otherUserName = _Global.GetString(report["s1Name"]);
            }

            if (myUserName.Length > 12)
            {
                myUserName = myUserName.Substring(0, 9) + "...";
            }
            
            if (otherUserName.Length > 12)
            {
                otherUserName = otherUserName.Substring(0, 9) + "...";
            }

            switch (_Global.INT32(report["marchType"]))
            {
            case Constant.AvaMarchType.ATTACK:
                subject = string.Format("({0}) {1} {2}", myUserName, Datas.getArString("Common.AttackedBy"), otherUserName);
                break;
            case Constant.AvaMarchType.SCOUT:
                subject = string.Format("({0}) {1} {2}", myUserName, Datas.getArString("Common.ScoutedBy"), otherUserName);
                break;
            case Constant.AvaMarchType.RALLYATTACK:
                subject = string.Format("({0}) {1} {2}", myUserName, Datas.getArString("AVA.chrome_mail_RallyAttackedBy"), otherUserName);
                break;
            default:
                break; 
            }
        }
        return subject;
    }

    protected override string ParseTileType(int type, int kid)
    {
        return Datas.getArString(AvaUtility.GetTileNameKey(type));
    }

    public override bool IsSuccessReport(HashObject header, HashObject data)
    {
        int marchType = _Global.INT32(header["marchtype"]);

        switch (marchType)
        {
        case Constant.AvaMarchType.ATTACK:
        case Constant.AvaMarchType.RALLYATTACK:
            int winner = _Global.INT32(data["winner"]);
            int side = _Global.INT32(header["side"]);
            return !((winner == 1) ^ (side == 1));
        case Constant.AvaMarchType.SCOUT:
            return _Global.GetBoolean(data["success"]);
        }
        return false;
    }

    public override string GetAttackReportType(HashObject g_header, HashObject g_data)
    {
        string reportType = string.Empty;

        if (_Global.INT32(g_header["tiletype"]) == Constant.TileType.TILE_TYPE_AVA_PLAYER)
        {
            reportType = this.GetAttackOtherPlayerReportType(g_header, g_data);
        }
        else
        {
            reportType = this.GetAttackWildernessReportType(g_header, g_data);
        }
        return reportType;
    }

    public override void GoToMapFromReport(int x, int y)
    {
        GameMain.singleton.gotoMap2(x, y);
    }
}
