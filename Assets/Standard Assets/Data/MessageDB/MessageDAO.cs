using System.IO;
using KBN;
using System.Collections;
using System;
using System.Collections.Generic;

public static class JoinHelper
{
	public static string join<T>(this T[]  arr, string append)
	{
		return JoinHelper.join(arr, append, "");
	}

	public static string join<T>(this T[]  arr, string append, string beginAppend)
	{
		if ( arr == null || arr.Length == 0 )
			return "";
		var sb = new System.Text.StringBuilder();
		for ( int i = 0; i != arr.Length - 1; ++i )
		{
			sb.Append(beginAppend);
			sb.Append(arr[i].ToString());
			sb.Append(append);
		}
		sb.Append(beginAppend);
		sb.Append(arr[arr.Length-1].ToString());
		return sb.ToString();
	}

	public static string[] ToParamName(this string[] name)
	{
		string[] oval = new string[name.Length];
		for ( int i = 0; i != name.Length; ++i )
			oval[i] = string.Format("@{0}", name[i]);
		return oval;
	}
}

namespace KBN
{
    public abstract class MessageDAO
    {
    	protected static bool gm_isNeedCleanDBFile = false;
    	protected bool m_isNeedSendReport = true;

    	public const string inboxTable = "inbox";
    	public const string reportTable = "report";
    	public const string outboxTable = "outbox";
    	public const string prizeTable = "prize";
    	public const string headerTable = "header";
        public const string AvaReportTable = "ava_report";
		public const string eventCenterTable = "eventCenter";

    	public int pageSize = 10;
    	public static int PAGE_SIZE = 10; 

    	protected MessageStatistics statistics;
    	protected static MessageStatistics defaultStatistics;
    	protected static bool isReady = false;
    	
        public abstract bool OpenDB();

        public abstract void CloseDB();

        public MessageDAO()
        {
            defaultStatistics = new MessageStatistics();
        }

        public abstract void InitDb();

        public void Free()
        {
            defaultStatistics = null;
            isReady = false;
        }

    	protected void priv_setFlag(System.Exception error)
    	{
    		gm_isNeedCleanDBFile = true;
    		UnityEngine.PlayerPrefs.SetInt("gm_isNeedCleanDBFile", 1);
    		if ( !m_isNeedSendReport )
    			return;
    		m_isNeedSendReport = false;
    		KBN.UnityNet.reportErrorToServer("", null, "MessageDAO", string.Format("{0}\n{1}", error.ToString(), error.StackTrace), false);
    	}

    	protected void priv_checkCleanDBFile()
    	{
    		try
    		{
    			if ( !gm_isNeedCleanDBFile )
    				return;
    			this.CloseDB();
    	   		string path = priv_getDBDataPath();
    			if ( !System.IO.File.Exists(path) )
    			{
    				gm_isNeedCleanDBFile = false;
    				UnityEngine.PlayerPrefs.DeleteKey("gm_isNeedCleanDBFile");
    				return;
    			}
    			System.IO.File.Delete(path);
    			gm_isNeedCleanDBFile = false;
    			UnityEngine.PlayerPrefs.DeleteKey("gm_isNeedCleanDBFile");
    		}
    		catch(System.Exception)
    		{
    		}
    	}
    	
    	
    	//-----------------Save Mail
    	protected static string[] gm_messagesTableParamsName = new string[]{
    		"@messageid"
    		, "@message"
    		, "@isSys"
    		, "@unixTime"
    		, "@isRead"
    		, "@isDel"
			, "@sysMail"
    	};
    	protected object getMessageDataFromMail(System.Object dat, int idx, string paramName)
    	{
    		HashObject message = dat as HashObject;
    		switch ( idx )
    		{
    		case 0: return message["messageId"].Value;
    		case 1:
    			var messageTable = SerializationUtils.getInstance().HashObjectToHashtable(message);
    			return SerializationUtils.getInstance().HashtableToBytes(messageTable);

    		case 2: return message["isSysbox"].Value;
    		case 3: return message["unixTime"].Value;
    		case 4: return message["messageRead"].Value;
    		case 5: return "0";
			case 6:
				if (_Global.INT32(message["isSysbox"].Value) == 1 )
					return "1";
				else if (message["fromUserId"]!=null && _Global.INT32(message["fromUserId"].Value) == 0 )
					return "1";
				else return "0";
    	   	}
    	   	return null;
    	}


        public abstract void InsertInboxMessage(object[] messages, bool isSys);

        public abstract void InsertReportMessage(object[] reports);

        public abstract void InsertAvaReportMessage(object[] reports);

        public abstract void InsertOutBoxMessage(object[] messages);

		public abstract void InsertEventCenterMessage(object[] messages);
		public abstract void DeleteEventCenterById(int message);
		public abstract Hashtable ReadEventCenterTable();

//        public abstract Hashtable SelectInboxMessages(int pageNo, int pageSize);
		public abstract Hashtable SelectInboxMessages(int pageNo, int pageSize,int isSys);

    	public class PrizeItems
    	{
			public int emailId;
    		public int[] items;
    		public int[] itemsCount;
    		public bool claimed;
    		public long createTime;
    		public long claimTime;
			public List<int> itemList;
			public List<int> itemCountList;

            public bool HasExpired
            {
                get
                {
                    //return true;
					return (GameMain.unixtime() - createTime >  10 * 86400);
				}
            }
    	}

    	public void ClaimPrize(int mailID, bool isSys)
    	{
    		var prizeItems = this.GetPrizeInMail(mailID, isSys);
    		if ( prizeItems == null || prizeItems.claimed )
    			return;

            string update = string.Format("UPDATE {0} SET isClaim = 1, claimTime = '{1}' WHERE id = {2} and isSys = {3}"
    		                              , prizeTable
    		                              , GameMain.unixtime().ToString()
    		                              , mailID.ToString()
                                          , isSys ? 1 : 0);

    		if ( !OpenDB() )
    			return;

            if (!ClaimPrizeInternal(update))
            {
                return;
            }
    	}

        public abstract int CountEmailsHavingPrize();

        protected abstract bool ClaimPrizeInternal(string update);

        public abstract PrizeItems GetPrizeInMail(int mailID, bool isSys);

		public abstract List<PrizeItems> GetAllUnClaimedPrizeInMails();

    	public Hashtable SelectReports(int pageNo,int pageSize)
    	{
            return SelectReportsWithTable(pageNo, pageSize, reportTable);
        }

        public Hashtable SelectAvaReports(int pageNo, int pageSize)
        {
            return SelectReportsWithTable(pageNo, pageSize, AvaReportTable);
        }

        protected Hashtable SelectReportsWithTable(int pageNo, int pageSize, string tableName)
        {
    		if(!isReady)
    			return null;

            string select = string.Format("SELECT * FROM [{0}] WHERE isdel=0 ORDER BY messageid DESC LIMIT {1}, {2}",
                                          tableName, (pageNo - 1) * pageSize, pageSize);
    		try
    		{
    			if ( !OpenDB() )
    				return null;

    			if(pageNo >=1 && pageSize >=1)
    			{	
                    return SelectGenericReportsInternal(select);
    			}
    		}
    		catch(System.Exception error)
    		{
    			priv_setFlag(error);
    			//throw;
    		}
    		finally
    		{
    			CloseDB();
    			priv_checkCleanDBFile();
    		}

    		return null;
    	}

        protected abstract Hashtable SelectGenericReportsInternal(string select);
    	
    	public System.Collections.Hashtable SelectOutBoxMessages(int pageNo,int pageSize)
    	{
    		if(!isReady)
    			return null;

    		string select = "SELECT * FROM [outbox] WHERE isdel=0 ORDER BY unixtime DESC,messageid DESC LIMIT "+(pageNo-1)*pageSize+","+pageSize;
    		try
    		{
    			if ( !OpenDB() )
    				return null;
    			if(pageNo >=1 && pageSize >=1)
    			{	
                    return SelectOutBoxInternal(select);
    			}
    		}
    		catch(System.Exception error)
    		{
    			priv_setFlag(error);
    			//throw;
    		}
    		finally
    		{
    			CloseDB();
    			priv_checkCleanDBFile();
    		}
    		return null;
    	}

        protected abstract Hashtable SelectOutBoxInternal(string select);

    	//select single message
    	public void SetMessageReaded(int messageId,bool isSys)
    	{ 
    		if(isReady)
    		{
    			var ids = new int[]{messageId};
    			if(isSys)
    			{
    				SetMessagesReaded(ids,null);
    			}
    			else
    			{
    				SetMessagesReaded(null,ids);
    			}
    		}
    	}
    	
        public abstract void SetMessagesReaded(int[] sysIds, int[] inboxIds);
    	
        public abstract void SetReportsRead(int[] messageIds);

		public abstract void SetEventCenterRead(int[] eventIds);

        public abstract void SetAvaReportsRead(int[] messageIds);
    	
    	public void DeleteAllInbox()
    	{
    		string delete = "DELETE FROM [inbox]";
    		DeleteInboxInternal(delete, null, null);
    	}

		public void DeleteNormalInbox()
		{
			string delete = "DELETE FROM [inbox] WHERE [sysMail]= '0'";
			DeleteInboxInternal(delete, null, null);
		}

		public abstract void ReadAllSysEmail();
		public abstract void ReadAllEmail();
		public abstract void ReadAllReport();

		public void DeleteSysInbox()
		{
			string delete = "DELETE FROM [inbox] WHERE [sysMail]= '1'";
			DeleteInboxInternal(delete, null, null);
		}
    	
    	public void DeleteInbox(int messageId,bool isSys)
    	{
    		if(isReady)
    		{
    			string sys = "0";
    			if(isSys)
    			{
    				sys = "1";
    			}
    			else
    			{
    				sys = "0";
    			}
    			string deleteInboxs = "DELETE FROM [inbox] WHERE [isSys]='" + sys + "' AND [messageid]='"+messageId +"'";

                int[] inboxIds = isSys ? new int[] {} : new int[] { messageId };
                int[] sysIds = isSys ? new int[] { messageId } : new int[] {};
    			DeleteInboxInternal(deleteInboxs, inboxIds, sysIds);
    		}
    	}
    	
    	public void DeleteInboxs(int[] inboxIds, int[] sysIds)
    	{
    		var deletes = new System.Collections.Generic.List<string>();

    		if(inboxIds != null && inboxIds.Length >0)
    		{
    			string deleteInboxs = "DELETE FROM [inbox] WHERE [isSys]='0' AND [messageid] IN (" + inboxIds.join(",") + ")";
    			deletes.Add(deleteInboxs);
    		}
    		if(sysIds != null && sysIds.Length >0)
    		{
    			string deleteSys = "DELETE FROM [inbox] WHERE [isSys]='1' AND [messageid] IN (" + sysIds.join(",") + ")";
    			deletes.Add(deleteSys);
    		}
    		
    		if(deletes.Count > 0)
    		{
    			string strDels = deletes.ToArray().join(";");

                if (inboxIds == null) inboxIds = new int[] {};
                if (sysIds == null) sysIds = new int[] {};

    			DeleteInboxInternal(strDels, inboxIds, sysIds);
    		}
    	}

        /// <summary>
        /// protected utility method for delete mails in inbox and relative prizes, and 
        /// </summary>
        /// <param name="cmdText">SQL text to execute</param>
        /// <param name="inboxIds">Non-system email identifiers to delete. 'null' means to delete all.</param>
        /// <param name="sysIds">system email identifiers to delete. 'null' means to delete all.</param>
        protected abstract void DeleteInboxInternal(string cmdText, int[] inboxIds, int[] sysIds);
    	
    	public void DeleteAllOutbox()
    	{
    		string delete = "DELETE FROM [outbox]";
    		DeleteOutboxInternal(delete);
    	}
    	
    	public void DeleteOutbox(int outboxId)
    	{
    		if(isReady)
    		{
    			string cmdTxt = "DELETE FROM [outbox] WHERE [messageid]='"+ outboxId +"'";
    			DeleteOutboxInternal(cmdTxt);
    		}
    	}
    	
    	public void DeleteOutboxs(int[] outboxIds)
    	{
    		if(outboxIds != null && outboxIds.Length > 0)
    		{
    			string delete = "DELETE FROM [outbox] WHERE [messageid] IN (" + outboxIds.join(",") + ")";
    			DeleteOutboxInternal(delete);
    		} 
    	}
    	
        protected abstract void DeleteOutboxInternal(string cmdText);
    	
		public abstract void DeleteAllEventCenter ();

    	public void DeleteAllReports()
    	{
    		string delete = "DELETE FROM [report]";
    		DeleteReportsInternal(delete);
    	}

        public void DeleteAllAvaReports()
        {
            string delete = string.Format("DELETE FROM [{0}]", AvaReportTable);
            DeleteAvaReportsInternal(delete);
        }
    	
    	public void DeleteReport(int reportId)
    	{ 
    		if(isReady)
    		{
    			string cmdTxt = "DELETE FROM [report] WHERE [messageid]='" + reportId + "'";
    			DeleteReportsInternal(cmdTxt);
    		}
    	}

        public void DeleteAvaReport(int reportId)
        {
            DeleteAvaReports(new int[] { reportId });
        }

    	public void DeleteReports(int[] reportIds)
    	{
    		if(reportIds != null && reportIds.Length >0)
    		{
    			string delete = "DELETE FROM [report] WHERE [messageid] IN (" + reportIds.join(",") + ")";
    			DeleteReportsInternal(delete);
    		}
    	}

        public void DeleteAvaReports(int[] reportIds)
        {
            if (reportIds != null && reportIds.Length > 0)
            {
                string delete = string.Format("DELETE FROM [{0}] WHERE [messageid] IN ({1})", AvaReportTable, reportIds.join(","));
                DeleteAvaReportsInternal(delete);
            }
        }

        public void DeleteAvaReportsExcludingEventId(int eventId)
        {
            string delete = string.Format("DELETE FROM [{0}] WHERE [ava_event_id] <> {1}", AvaReportTable, eventId);
            DeleteAvaReportsInternal(delete);
        }
    	
        protected abstract void DeleteReportsInternal(string cmdText);

        protected abstract void DeleteAvaReportsInternal(string cmdText);
    	
    	
    	public static void SetMessageReady()
    	{
    		isReady = true;
    		defaultStatistics = null;
    	}
    	
    	public MessageStatistics MessageStatistics
    	{
    		get
    		{
    			if(isReady)
    			{
    				if(statistics == null)
    				{
    					InitMessageStatistics(false);
    				}
    				
    				return statistics;
    			}
    			else
    			{
    				return defaultStatistics;
    			}
    		}
    	}


        protected abstract void InitMessageStatistics(bool dbopen);
		public abstract void ResetMessageStatistics();
    	
    	protected virtual string getDirPath(){
    		return string.Format("user_{0}/world_{1}/", Datas.singleton.tvuid().ToString(), Datas.singleton.worldid().ToString());
    		//string dir = "user_"+Datas.singleton.tvuid().ToString()+"/world_"+Datas.singleton.worldid().ToString();
    		//return dir+"/";
    	}
    	protected string databaseName = "msgDB.sqdb";
    	protected string databasePath = "";
    	protected System.Collections.Hashtable header;

    	public void DestroyDB()
    	{
    		isReady = false;
    		string dataPath = priv_getDBDataPath();
    		if ( System.IO.File.Exists(dataPath) )
    			System.IO.File.Delete(dataPath);
    	}

    	protected string priv_getDBDir()
    	{
    		string dirPath = SerializationUtils.GetiPhoneDocumentsPath()+"/"+getDirPath();
    		return dirPath;
    	}
    	
    	protected string priv_getDBDataPath()
    	{
    		return System.IO.Path.Combine(priv_getDBDir(), databaseName);
    	}

		protected void SaveSqlVersion(){
			UnityEngine.PlayerPrefs.SetString("sqlVersion",_Global.sqlVersion);
		}
    }

}

public class EventCenterTableInfo
{
	public int eventId;
	public int isRead;
}

public class MessageStatistics
{
	public int Id = 0;
	public int InboxMaxId = 0;
	public int ReportMaxId = 0;
    public int AvaReportMaxId = 0;
	public int OutboxMaxId = 0;
	public int SysMaxId = 0;
	public int UnReadInobxCount = 0;
	public int UnReadReportCount = 0;
    public int UnreadAvaReportCount = 0;
	public int AllInboxCount = 0;
	public int AllOutBoxCount = 0;
	public int AllReportCount = 0;
    public int AllAvaReportCount = 0;
	public int UnreadSysMailCount=0;
	public int AllSysMailCount=0;
	public int AllEventCenterCount=0;
	public int UnreadCount
	{
		get
		{
			return UnReadInobxCount + UnReadReportCount+UnreadSysMailCount;
		}
	}

    public int UnreadAvaCount
    {
        get
        {
            return UnReadInobxCount + UnreadAvaReportCount;
        }
    }
	
	public int InboxPageCount(int pageSize)
	{
		return CountPage(AllInboxCount,pageSize);
	}
	public int SysInboxPageCount(int pageSize)
	{
		return CountPage(AllSysMailCount,pageSize);
	}
	public int OutboxPageCount(int pageSize)
	{
		return CountPage(AllOutBoxCount,pageSize);
	}
	public int ReportPageCount(int pageSize)
	{
		return CountPage(AllReportCount,pageSize);
	}

    public int AvaReportPageCount(int pageSize)
    {
        return CountPage(AllAvaReportCount, pageSize);
    }

	protected int CountPage(int count,int size)
	{
		if((count % size) == 0)
		{
			return count / size;
		}
		else
		{
			return count / size + 1;
		}
	}


}
