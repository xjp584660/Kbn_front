using System.Collections;

using MessageDAO = KBN.MessageDAO;
using _Global = KBN._Global;

public abstract class ReportViewingStrategy_Base
{
    public void SetReportRead(MessageDAO dao, int reportId)
    {
        SetReportsRead(dao, new int[] { reportId });
    }

    public abstract void SetReportsRead(MessageDAO dao, int[] reportIds);

    public abstract void DeleteAllReports(MessageDAO dao);

    public void DeleteReport(MessageDAO dao, int reportId)
    {
        DeleteReports(dao, new int[] { reportId });
    }

    public abstract void DeleteReports(MessageDAO dao, int[] reportIds);

    public abstract Hashtable SelectReports(MessageDAO dao, int pageNo, int pageSize);

    public abstract void InsertReportMessage(MessageDAO dao, object[] reports);

    public abstract int ReportPageCount(MessageStatistics statistics, int pageSize);

    public abstract int UnreadReportCount(MessageStatistics statistics);

    public abstract int AllReportCount(MessageStatistics statistics);

    public abstract string GetMarchReportTitle(HashObject report, HashObject rslt);

    protected abstract string ParseTileType(int type, int tileKid);

    public abstract bool IsSuccessReport(HashObject header, HashObject data);

    public abstract string GetAttackReportType(HashObject header, HashObject data);

    protected string GetAttackOtherPlayerReportType(HashObject g_header, HashObject g_data)
    {
        var reportType = string.Empty;

        if (_Global.INT32(g_header["side"]) == 1&&_Global.INT32(g_data["winner"]) == 1  )// || _Global.INT32(g_data["winner"]) == 2 && _Global.INT32(g_header["side"]) == 1)
        {
            reportType = "attack_win";
        }
        else if (_Global.INT32(g_header["side"]) == 1 && _Global.INT32(g_data["winner"]) != 1)
        {
            reportType = "attack_defeat";
        }
        else if (_Global.INT32(g_header["side"]) == 0&&_Global.INT32(g_data["winner"]) != 1  )
        {
            reportType = "defend_victory";
        }
        else if (_Global.INT32(g_header["side"]) == 0 && _Global.INT32(g_data["winner"]) == 1 )
        {
            reportType = "defend_defeat";
        }   

        return reportType;
    }

    protected string GetAttackWildernessReportType(HashObject g_header, HashObject g_data)
    {
        var reportType = string.Empty;

        // if (_Global.INT32(g_data["winner"]) == 1 && _Global.INT32(g_header["side"]) == 1 || _Global.INT32(g_data["winner"]) == 2 && _Global.INT32(g_header["side"]) == 1)
        // {
        //     reportType = "wilderness_win";
        // }
        // else if (_Global.INT32(g_data["winner"]) == 0 && _Global.INT32(g_header["side"]) == 0)
        // {
        //     reportType = "wilderness_win";
        // }
        // else if ((_Global.INT32(g_header["side"]) == 1 && _Global.INT32(g_data["winner"]) == 0) || (_Global.INT32(g_header["side"]) == 0 && _Global.INT32(g_data["winner"]) == 1))
        // {
        //     reportType = "wilderness_lose";
        // }

        if (_Global.INT32(g_header["side"]) == 1&&_Global.INT32(g_data["winner"]) == 1  )// || _Global.INT32(g_data["winner"]) == 2 && _Global.INT32(g_header["side"]) == 1)
        {
            reportType = "wilderness_win";
        }
        else if (_Global.INT32(g_header["side"]) == 1 && _Global.INT32(g_data["winner"]) != 1)
        {
            reportType = "wilderness_lose";
        }
        else if (_Global.INT32(g_header["side"]) == 0&&_Global.INT32(g_data["winner"]) != 1  )
        {
            reportType = "wilderness_win";
        }
        else if (_Global.INT32(g_header["side"]) == 0 && _Global.INT32(g_data["winner"]) == 1 )
        {
            reportType = "wilderness_lose";
        }   

        return reportType;
    }

    public abstract void GoToMapFromReport(int x, int y);
}
