import System.IO;
import System.Data;
import Mono.Data.Sqlite;
import System.Collections.Generic;

public class MessageDAO extends KBN.MessageDAO
{
    protected var db : DBAccess;
    
    public function OpenDB()
    {
        if(db == null)
        {
            return false;
        }
        
        if(!System.IO.File.Exists(databasePath))
        {
        	InitDb();
        }

        try
        {
            db.OpenDB(databasePath);
            return true;
        }
        catch(error : System.Exception)
        {
            priv_setFlag(error);
            priv_checkCleanDBFile();
            //throw;
            return false;
        }
    }
    
    public function CloseDB()
    {
        if(db != null)
        {
            db.CloseDB();
        }
    }
    
    public function InsertInboxMessage(messages : System.Object[], isSys : boolean) : void
    {
        if ( !isReady )
            return;
        if ( messages == null || messages.Length == 0 )
            return;

        if ( !OpenDB() )
            return;
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try
        {
            var insert : String = "INSERT INTO [inbox] ([messageid],[message],[isSys],[unixTime],[isRead],[isDel],[sysMail]) VALUES (@messageid,@message,@isSys,@unixTime,@isRead,@isDel,@sysMail)";
            db.ExecuteNonQueryV(trans, insert, messages, gm_messagesTableParamsName, getMessageDataFromMail);
            priv_insertPrizeItem(trans, messages);

            var strIsSys : String = isSys?"1":"0";
            var maxCount : int = isSys?Constant.MAIL.SYS_COUNT:Constant.MAIL.INBOX_COUNT;
            var maxIdFieldName : String = isSys?"sysmaxid":"inboxmaxid";

            // Delete prize items related to the emails to delete
            var deletePrize : String = String.Format("DELETE FROM [prize] WHERE [isSys] = {1} AND [id] <= (SELECT [messageid] FROM [inbox] WHERE [isSys]={1} ORDER BY [messageid] DESC LIMIT {0}, 1)", maxCount, strIsSys);
            db.ExecuteNonQuery(trans, deletePrize, null);

            // Delete emails and update header for email count
            var delete : String = String.Format("DELETE FROM [inbox] WHERE [isSys]= {0} AND [messageid] <= (SELECT [messageid] FROM [inbox] WHERE [isSys]= {0} ORDER BY [messageid] DESC LIMIT {1},1)", strIsSys, maxCount);
            var update : String = String.Format("UPDATE [header] SET [{0}]  =(SELECT max(messageid) FROM [INBOX] WHERE [isSys]={1}),[unreadInboxCount]=(SELECT count(*) FROM [inbox] WHERE [isRead]='0'),[allInboxCount]=(SELECT count(*) FROM [inbox]),[unreadSysMailCount]=(SELECT count(*) FROM [inbox] WHERE [isRead]='0' AND [sysMail]='1'),[allSysMailCount]=(SELECT count(*) FROM [inbox] WHERE [sysMail]='1')", maxIdFieldName, strIsSys);
            db.ExecuteNonQuery(trans,delete,null);
            db.ExecuteNonQuery(trans,update,null);
            trans.Commit(); 
            InitMessageStatistics(true);
        }
        catch (error : System.Exception)
        {
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }

    protected function priv_insertPrizeItem(trans : IDbTransaction, messages : System.Object[])
    {
        var paramNameList : String[] = ["id", "item", "count", "createTime", "claimTime", "isClaim", "isSys"];
        var paramInSQLList : String[] = paramNameList.ToParamName();

        var valList : String = paramNameList.join(",");
        var parList : String = paramInSQLList.join(",");
        var insert : String = String.Format("INSERT INTO {0} ({1}) VALUES ({2})", prizeTable, valList, parList);
        for ( var msg : HashObject in messages )
        {
            var itemRewards : HashObject = msg["itemRewards"];
            if ( itemRewards == null || itemRewards.Table == null || itemRewards.Table.Count == 0 )
                continue;

            var msgID : int = _Global.INT32(msg["messageId"]);
            var unixTime : long = _Global.INT64(msg["unixTime"]);
            var isClaim : byte = _Global.INT32(msg["claimStatus"]);
            var isSys : int = _Global.INT32(msg["isSysbox"]);
            db.ExecuteNonQueryV(trans, insert, itemRewards.Table, paramInSQLList, function(dat : System.Object, idx : int, paramName : String) : System.Object            {
                var dPair : System.Collections.DictionaryEntry = dat;
                switch ( idx )
                {
                case 0:return msgID;
                case 1:return _Global.INT32(dPair.Key);
                case 2:return _Global.INT32(dPair.Value);
                case 3:
                case 4:
                    return unixTime;
                case 5:
                    return isClaim;
                case 6:
                    return isSys;
                }
                return null;
            });
        }
    }    
        
    public function DeleteAllEventCenter()
    {
        if(!isReady)
        {
            return;
        }

        if ( !OpenDB() )
            return;
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try{
            var delete : String = "DELETE FROM [eventCenter]";
            db.ExecuteNonQuery(trans,delete,null);
            var update = "UPDATE [header] SET [allEventCenterCount]=(SELECT count(*) FROM [eventCenter])";
            db.ExecuteNonQuery(trans,update,null);
        
            trans.Commit(); 
            InitMessageStatistics(true);
        }
        catch(error : System.Exception)
        { 
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }
    
    public function DeleteEventCenterById(eventId : int) : void
    {
	    if(!isReady)
        {
            return;
        }
        if (!OpenDB())
        {
            return;
        }

        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try{
                var deleteEventCenter : String;

                deleteEventCenter = String.Format("DELETE FROM [{0}] WHERE [eventCenterid]={1}", eventCenterTable,eventId );
	    
	            db.ExecuteNonQuery(trans, deleteEventCenter, null);
	            trans.Commit(); 
            }
        catch(error : System.Exception)
        { 
            priv_setFlag(error);
            trans.Rollback();
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }    
    
    public function SetEventCenterRead(eventIds : int[]) : void
    {
	    if(!isReady)
        {
            return;
        }
        
        if ( !OpenDB() )
            return;
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try
        {
            var update : String = String.Format("UPDATE [{0}] SET [isRead]='1' WHERE [eventCenterid] IN ({1})", eventCenterTable,eventIds.join(",") );
            db.ExecuteNonQuery(trans,update,null);

            trans.Commit();
            InitMessageStatistics(true);
        }
        catch(error : System.Exception)
        { 
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }
    
    public function ReadEventCenterTable() : Hashtable
    {    
    	 if ( !OpenDB() )
            return;
        var cmdText : String = "SELECT * FROM [eventCenter]";
        var reader : IDataReader = db.ExcuteReader(cmdText,null);
        
        var reads : Hashtable = new System.Collections.Hashtable(); 
        var temp:HashObject;	
        while(reader.Read()){
            //statistics.Id = Convert.ToInt32(reader["id"]);
			//reads["eventCenterId"] = SerializationUtils.getInstance().BytesToHashtable(reader["eventCenterId"] as byte[]);
			var info : EventCenterTableInfo = new EventCenterTableInfo();
			var id : String = reader["eventCenterid"].ToString();
        	info.eventId = Convert.ToInt32(id);
        	info.isRead = Convert.ToInt32(reader["isRead"]);
        	reads[id] = info;
        }
        reader.Close();
        
        return reads;
    }
        
    public function InsertEventCenterMessage(eventCenters : System.Object[]) : void 
    {
	    if ( !isReady )
            return;

        if ( eventCenters == null || eventCenters.Length == 0 )
            return;

        if ( !OpenDB() )
            return;
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        //["id","eventCenterid","isRead","eventEndTime"];
        try
        {
            var paramsName : String[] = [
                "@eventCenterid"
                , "@isRead"
                , "@eventEndTime"
            ];

            var insert : String = "INSERT INTO [eventCenter] ([eventCenterid],[isRead],[eventEndTime]) VALUES (@eventCenterid,@isRead,@eventEndTime)";
            db.ExecuteNonQueryV(trans, insert, eventCenters, paramsName
                , function(dat : System.Object, idx : int, paramName : String) : System.Object
                {
                    var eventCenter : HashObject = dat as HashObject;
                    switch ( idx )
                    {
                    case  0 :
                        return _Global.INT32(eventCenter["eventId"]);
                    case 1:
                        return 0;
                    case 2: return 0;
                    case 3: return 0;
                    }
                    return null;
                }
            );

            var update : String = "UPDATE [header] SET [allEventCenterCount]=(SELECT count(*) FROM [eventCenter])";
            db.ExecuteNonQuery(trans,update,null);
            trans.Commit();
            InitMessageStatistics(true);
        }
        catch(error : System.Exception)
        {
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }
    
    public function InsertReportMessage(reports : System.Object[]) : void
    {
        if ( !isReady )
            return;

        if ( reports == null || reports.Length == 0 )
            return;

        if ( !OpenDB() )
            return;
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try
        {
            var paramsName : String[] = [
                "@messageid"
                , "@message"
                , "@isRead"
                , "@isDel"
            ];

            var insert : String = "INSERT INTO [report] ([messageid],[message],[isRead],[isDel]) VALUES (@messageid,@message,@isRead,@isDel)";
            db.ExecuteNonQueryV(trans, insert, reports, paramsName
                , function(dat : System.Object, idx : int, paramName : String) : System.Object
                {
                    var report : HashObject = dat as HashObject;
                    switch ( idx )
                    {
                    case  0 :
                        return _Global.INT32(report["marchReportId"]);
                    case 1:
                        var messageTable : Hashtable = SerializationUtils.getInstance().HashObjectToHashtable(report);
                        return SerializationUtils.getInstance().HashtableToBytes(messageTable);
                    case 2: return _Global.INT32(report["reportStatus"]) == 2?0:1;
                    case 3: return 0;
                    }
                    return null;
                }
            );

            var delete : String = String.Format("DELETE FROM [report] WHERE [messageid] <= (SELECT [messageid] FROM [report] ORDER BY [messageid] DESC LIMIT {0},1)",Constant.MAIL.REPORT_COUNT);
            db.ExecuteNonQuery(trans,delete,null);

            var update : String = "UPDATE [header] SET [reportmaxid]=(SELECT max(messageid) FROM [report]),[unreadReportCount]=(SELECT count(*) FROM [report] WHERE [isRead]='0'),[allReportCount]=(SELECT count(*) FROM [report])";
            db.ExecuteNonQuery(trans,update,null);
            trans.Commit();
            InitMessageStatistics(true);
        }
        catch(error : System.Exception)
        {
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }
    
    public function InsertAvaReportMessage(reports : System.Object[]) : void
    {
        if (!isReady)
        {
            return;
        }

        if (reports == null || reports.Length == 0)
        {
            return;
        }
        
        if (!OpenDB())
        {
            return;
        }
        
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try
        {
            var paramsName : String[] = [
                "@messageid"
                , "@message"
                , "@isRead"
                , "@isDel"
                , "@ava_event_id"
            ];
            
            var insert : String = String.Format("INSERT INTO [{0}] ([messageid], [message], [isRead], [isDel], [ava_event_id]) VALUES ({1})",
                                                AvaReportTable, paramsName.join(","));
            db.ExecuteNonQueryV(trans, insert, reports, paramsName,
                function(dat : System.Object, idx : int, paramName : String) : System.Object
                {
                    var report : HashObject = dat as HashObject;
                    switch ( idx )
                    {
                    case 0:
                        return _Global.INT32(report["marchReportId"]);
                    case 1:
                        var messageTable : Hashtable = SerializationUtils.getInstance().HashObjectToHashtable(report);
                        return SerializationUtils.getInstance().HashtableToBytes(messageTable);
                    case 2:
                        return _Global.INT32(report["reportStatus"]) == 2 ? 0 : 1;
                    case 3:
                        return 0;
                    case 4:
                        return _Global.INT32(report["avaEventId"]);
                    }
                    return null;
                }
            );
            
            var delete : String = String.Format("DELETE FROM [{0}] WHERE [messageid] <= (SELECT [messageid] FROM [{0}] ORDER BY [messageid] DESC LIMIT {1}, 1)",
                                                AvaReportTable, Constant.MAIL.AVA_REPORT_COUNT);
            db.ExecuteNonQuery(trans,delete,null);
            
            var update : String = String.Format("UPDATE [{0}] SET [ava_reportmaxid] = (SELECT max(messageid) FROM [{1}]), " +
                "[ava_unreadReportCount]=(SELECT count(*) FROM [{1}] WHERE [isRead]='0'), [ava_allReportCount]=(SELECT count(*) FROM [{1}])",
                headerTable, AvaReportTable);
            db.ExecuteNonQuery(trans,update,null);
            
            trans.Commit();
            InitMessageStatistics(true);
        }
        catch (error : Exception)
        {
            priv_setFlag(error);
            trans.Rollback();
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }
    
    public function InsertOutBoxMessage(messages : System.Object[]) : void
    {
        if ( !isReady )
            return;
        if ( messages == null || messages.Length == 0 )
            return;

        if ( !OpenDB() )
            return;
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try
        {
            var insert : String = "INSERT INTO [outbox] ([messageid],[message],[unixTime],[isRead],[isDel]) VALUES (@messageid,@message,@unixTime,@isRead,@isDel)";
            db.ExecuteNonQueryV(trans, insert, messages, gm_messagesTableParamsName, getMessageDataFromMail);

            var delete : String = String.Format("DELETE FROM [outbox] WHERE [messageid] <= (SELECT [messageid] FROM [outbox] ORDER BY [messageid] DESC LIMIT {0},1)",Constant.MAIL.OUTBOX_COUNT);
            db.ExecuteNonQuery(trans,delete,null);

            var update : String = "UPDATE [header] SET [outboxmaxid]=(SELECT max(messageid) FROM [outbox]),[allOutboxCount]=(SELECT count(*) FROM [outbox])";
            db.ExecuteNonQuery(trans,update,null);
            trans.Commit();
            InitMessageStatistics(true);
        }
        catch(error : System.Exception)
        {
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }
    
    public function SelectInboxMessages(pageNo : int, pageSize : int,isSys:int) : Hashtable
    {
        if(!isReady)
            return null;

        //	isSys=1;
        var select : String = String.Format("SELECT * FROM [inbox] WHERE isdel=0 and sysMail={2} ORDER BY unixtime DESC,messageid DESC LIMIT {0}, {1}", (pageNo-1)*pageSize, pageSize,isSys);
//        var select : String = String.Format("SELECT * FROM [inbox] WHERE isdel=0 ORDER BY unixtime DESC,messageid DESC LIMIT {0}, {1}", (pageNo-1)*pageSize, pageSize);
        try
        {
            if ( !OpenDB() )
                return null;

            if(pageNo >=1 && pageSize >=1)
            {
                var messages : Hashtable = new System.Collections.Hashtable(); 
                var reader : IDataReader = db.ExcuteReader(select,null);
                while (reader.Read())
                {
                    var messageId : String = String.Format("{0}_{1}", reader["messageid"].ToString(), reader["isSys"].ToString());
                    messages[messageId] = SerializationUtils.getInstance().BytesToHashtable(reader["message"] as byte[]);
                    (messages[messageId] as Hashtable)["messageRead"] = System.Convert.ToInt32(reader["isread"]);
                    (messages[messageId] as Hashtable)["isSys"] = System.Convert.ToInt32(reader["isSys"]);
                }
                reader.Dispose();
                return messages;
            }
        }
        catch(error : System.Exception)
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
    
    public function CountEmailsHavingPrize() : int
    {
        if (!isReady || !OpenDB())
        {
            return -1;
        }
        
        try
        {
            var query : String = String.Format("SELECT count(*) FROM (SELECT count(*) FROM [prize] GROUP BY [id], [isSys])");
            var reader : IDataReader = db.ExcuteReader(query, null);
            while (reader.Read())
            {
                return int.Parse(reader["count(*)"].ToString());
            }
        }
        catch (e : System.Exception)
        {
            return -1;
        }
        finally
        {
            CloseDB();
        }
    }
    
    protected function ClaimPrizeInternal(update : String) : boolean
    {
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try
        {
            db.ExecuteNonQuery(trans, update, null);
            trans.Commit();
        }
        catch(error : System.Exception)
        {
            trans.Rollback();
            //priv_setFlag(error);
            //throw;
            return false;
        }
        finally
        {
            CloseDB();
        }
        
        return true;
    }

    public function GetAllUnClaimedPrizeInMails() : List.<PrizeItems>
    {
        var prizeItemList : List.<PrizeItems> = new List.<PrizeItems>();
        if ( !OpenDB() )
            return prizeItemList;

        var cmdTexts : String = "SELECT * FROM prize WHERE isSys = 0";
        try
        {   
            var reader : IDataReader = db.ExcuteReader(cmdTexts, null);
            var dicItems : Dictionary.<int, PrizeItems> = new Dictionary.<int, PrizeItems>();
            while ( reader.Read() )
            {
                var emailId : int = _Global.INT32(reader["id"]);
                var item : int = _Global.INT32(reader["item"]);
                var count : int = _Global.INT32(reader["count"]);
                if(!dicItems.ContainsKey(emailId))
                {
                    var prizeItems : PrizeItems = new PrizeItems();
                    prizeItems.itemList = new System.Collections.Generic.List.<int>();
                    prizeItems.itemCountList = new System.Collections.Generic.List.<int>();
                    prizeItems.itemList.Add(item);
                    prizeItems.itemCountList.Add(count);

                    prizeItems.emailId = _Global.INT64(reader["id"]);
                    prizeItems.createTime = _Global.INT64(reader["createTime"]);
                    prizeItems.claimTime = _Global.INT64(reader["claimTime"]);
                    prizeItems.claimed = _Global.INT32(reader["isClaim"]) == 0 ? false:true;

                    prizeItems.items = prizeItems.itemList.ToArray();
                    prizeItems.itemsCount = prizeItems.itemCountList.ToArray();

                    dicItems.Add(emailId, prizeItems);

                    if(prizeItems != null && !prizeItems.HasExpired && !prizeItems.claimed)
                        prizeItemList.Add(prizeItems);
                }
                else
                {
                    dicItems[emailId].itemList.Add(item);
                    dicItems[emailId].itemCountList.Add(count);
                    dicItems[emailId].items = dicItems[emailId].itemList.ToArray();
                    dicItems[emailId].itemsCount = dicItems[emailId].itemCountList.ToArray();
                }     
            }
            reader.Close();
        }
        catch(e : System.Exception)
        {
            priv_setFlag(e);
            return prizeItemList;
        }
        finally
        {
            CloseDB();
            priv_checkCleanDBFile();
        }

        //_Global.LogWarning("prizeItemList.Count : " + prizeItemList.Count);
        return prizeItemList;
    }

    
    public function GetPrizeInMail(mailID : int, isSys : boolean) : PrizeItems
    {
        if ( !OpenDB() )
            return null;

        var itemsList : List.<int> = new System.Collections.Generic.List.<int>();
        var itemsCountList : List.<int> = new System.Collections.Generic.List.<int>();

        var sel : String = String.Format("SELECT * FROM {0} WHERE id = {1} and isSys = {2}", prizeTable, mailID.ToString(), isSys ? 1 : 0);
        var prizeItems : PrizeItems = null;
        try
        {
            var reader : IDataReader = db.ExcuteReader(sel, null);
            var isFirst : boolean = true;
            while ( reader.Read() )
            {
                var item : int = _Global.INT32(reader["item"]);
                var count : int = _Global.INT32(reader["count"]);
                itemsList.Add(item);
                itemsCountList.Add(count);
                if ( prizeItems == null )
                {
                    prizeItems = new PrizeItems();
                    prizeItems.emailId = _Global.INT64(reader["id"]);
                    prizeItems.createTime = _Global.INT64(reader["createTime"]);
                    prizeItems.claimTime = _Global.INT64(reader["claimTime"]);
                    prizeItems.claimed = _Global.INT32(reader["isClaim"]) == 0?false:true;
                    isFirst = false;
                }
            }
            reader.Close();
        }
        catch(e : System.Exception)
        {
            priv_setFlag(e);
            return null;
        }
        finally
        {
            CloseDB();
            priv_checkCleanDBFile();
        }

        if ( prizeItems != null )
        {
            prizeItems.items = itemsList.ToArray();
            prizeItems.itemsCount = itemsCountList.ToArray();
        }
        return prizeItems;
    }
    
    protected function SelectGenericReportsInternal(select : String) : Hashtable
    {
        var messages : Hashtable = new Hashtable();
        var reader : IDataReader = db.ExcuteReader(select,null);
        while(reader.Read()){
            var messageId : String = System.Convert.ToString(reader["messageid"]);
            messages[messageId] = SerializationUtils.getInstance().BytesToHashtable(reader["message"] as byte[]);
            (messages[messageId] as Hashtable)["messageRead"] = System.Convert.ToInt32(reader["isread"]);
        }
        reader.Dispose();
        return messages;
    }
    
    protected function SelectOutBoxInternal(select : String) : Hashtable
    {
        var messages : Hashtable = new Hashtable(); 
        var reader : IDataReader = db.ExcuteReader(select,null);
        while(reader.Read()){
            var messageId : String = System.Convert.ToString(reader["messageid"]);
            messages[messageId] = SerializationUtils.getInstance().BytesToHashtable(reader["message"] as byte[]);
            (messages[messageId] as Hashtable)["messageRead"] = System.Convert.ToInt32(reader["isread"]);
            (messages[messageId] as Hashtable)["isSys"] = 0;
        }
        reader.Dispose();
        return messages;
    }
    
    public function SetMessagesReaded(sysIds : int[], inboxIds : int[]) : void
    {
        if(isReady)
        {
            if ( !OpenDB() )
                return;
            var trans : IDbTransaction = db.getDbCon().BeginTransaction();
            try{
                var update : String = "";
                if(sysIds != null && sysIds.Length >0)
                {
                    update = "UPDATE [inbox] SET [isRead]='1' WHERE [messageid] IN (" + sysIds.join(",") + ") AND [sysMail]='1'";
                    db.ExecuteNonQuery(trans,update,null);
                }
                if(inboxIds != null && inboxIds.Length > 0)
                {
                    update = "UPDATE [inbox] SET [isRead]='1' WHERE [messageid] IN (" + inboxIds.join(",") + ") AND [isSys]='0'";
                    db.ExecuteNonQuery(trans,update,null);
                }
                
                update = "UPDATE [header] SET [unreadInboxCount]=(SELECT count(*) FROM [inbox] WHERE [isRead]='0'),[allInboxCount]=(SELECT count(*) FROM [inbox]),[unreadSysMailCount]=(SELECT count(*) FROM [inbox] WHERE [isRead]='0' AND [sysMail]='1'),[allSysMailCount]=(SELECT count(*) FROM [inbox] WHERE [sysMail]='1')";
                db.ExecuteNonQuery(trans,update,null);
                
                trans.Commit();
                InitMessageStatistics(true);
            }
            catch(error : System.Exception)
            { 
                priv_setFlag(error);
                trans.Rollback();
                //throw;
            }
            finally
            {
                trans.Dispose();
                CloseDB();
                priv_checkCleanDBFile();
            }
        }
    }

    public function ReadAllSysEmail()
    {
        if(!isReady)
        {
            return;
        }

        if ( !OpenDB() )
            return;
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try{
            
            var update : String = "UPDATE [inbox] SET [isRead]='1' WHERE [sysMail]='1'";
            db.ExecuteNonQuery(trans,update,null);

            update = "UPDATE [header] SET [unreadInboxCount]=(SELECT count(*) FROM [inbox] WHERE [isRead]='0'),[allInboxCount]=(SELECT count(*) FROM [inbox]),[unreadSysMailCount]=(SELECT count(*) FROM [inbox] WHERE [isRead]='0' AND [sysMail]='1'),[allSysMailCount]=(SELECT count(*) FROM [inbox] WHERE [sysMail]='1')";
            db.ExecuteNonQuery(trans,update,null);
        
            trans.Commit(); 
            InitMessageStatistics(true);
        }
        catch(error : System.Exception)
        { 
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }

    public function ReadAllEmail()
    {
        if(!isReady)
        {
            return;
        }

        if ( !OpenDB() )
            return;
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try{
            
            var update : String = "UPDATE [inbox] SET [isRead]='1' WHERE [sysMail]='0'";
            db.ExecuteNonQuery(trans,update,null);

            update = "UPDATE [header] SET [unreadInboxCount]=(SELECT count(*) FROM [inbox] WHERE [isRead]='0'),[allInboxCount]=(SELECT count(*) FROM [inbox]),[unreadSysMailCount]=(SELECT count(*) FROM [inbox] WHERE [isRead]='0' AND [sysMail]='1'),[allSysMailCount]=(SELECT count(*) FROM [inbox] WHERE [sysMail]='1')";
            db.ExecuteNonQuery(trans,update,null);
        
            trans.Commit(); 
            InitMessageStatistics(true);
        }
        catch(error : System.Exception)
        { 
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }

    public function ReadAllReport()
    {
        if(!isReady)
        {
            return;
        }

        if ( !OpenDB() )
            return;
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try{
            
            var update : String = "UPDATE [report] SET [isRead]='1'";
            db.ExecuteNonQuery(trans,update,null);

            update = "UPDATE [header] SET [unreadReportCount]=(SELECT count(*) FROM [report] WHERE [isRead]='0'), [allReportCount]=(SELECT count(*) FROM [report])";
            db.ExecuteNonQuery(trans,update,null);

            trans.Commit(); 
            InitMessageStatistics(true);
        }
        catch(error : System.Exception)
        { 
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }
    
    protected function DeleteInboxInternal(cmdText : String, inboxIds : int[], sysIds : int[]) : void
    {
        if(!isReady)
        {
            return;
        }
        if (!OpenDB())
        {
            return;
        }

        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try{
            var delete : String = cmdText;
            db.ExecuteNonQuery(trans,delete,null);

            var deleteInboxPrize : String;
            if (inboxIds != null)
            {
                deleteInboxPrize = String.Format("DELETE FROM [{0}] WHERE [id] IN ({1}) AND [isSys]='0'", prizeTable, inboxIds.join(","));
            }
            else
            {
                deleteInboxPrize = String.Format("DELETE FROM [{0}] WHERE [isSys]='0'", prizeTable);
            }
            db.ExecuteNonQuery(trans, deleteInboxPrize, null);

            var deleteSysPrize : String;
            if (sysIds != null)
            {
                deleteSysPrize = String.Format("DELETE FROM [{0}] WHERE [id] IN ({1}) AND [isSys]='1'", prizeTable, sysIds.join(","));
            }
            else
            {
                deleteSysPrize = String.Format("DELETE FROM [{0}] WHERE [isSys]='1'", prizeTable);
            }
            db.ExecuteNonQuery(trans, deleteSysPrize, null);

            var update : String = "UPDATE [header] SET [unreadInboxCount]=(SELECT count(*) FROM [inbox] WHERE [isRead]='0'),[allInboxCount]=(SELECT count(*) FROM [inbox]),[unreadSysMailCount]=(SELECT count(*) FROM [inbox] WHERE [isRead]='0' AND [sysMail]='1'),[allSysMailCount]=(SELECT count(*) FROM [inbox] WHERE [sysMail]='1')";
            db.ExecuteNonQuery(trans,update,null);
            
            trans.Commit(); 
            InitMessageStatistics(true);
        }
        catch(error : System.Exception)
        { 
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }
    
    protected function DeleteOutboxInternal(cmdText : String) : void
    {
        if(!isReady)
        {
            return;
        }

        if ( !OpenDB() )
            return;
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try{
            var delete : String = cmdText;
            db.ExecuteNonQuery(trans,delete,null);
            var update = "UPDATE [header] SET [allOutboxCount]=(SELECT count(*) FROM [outbox])";
            db.ExecuteNonQuery(trans,update,null);
        
            trans.Commit(); 
            InitMessageStatistics(true);
        }
        catch(error : System.Exception)
        { 
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }
    
    protected function DeleteReportsInternal(cmdText : String) : void
    {
        DeleteGenericReportsInternal(cmdText, reportTable, "unreadReportCount", "allReportCount");
    }
    
        
    protected function DeleteAvaReportsInternal(cmdText : String) : void
    {
        DeleteGenericReportsInternal(cmdText, AvaReportTable, "ava_unreadReportCount", "ava_allReportCount");
    }
    
    private function DeleteGenericReportsInternal(cmdText : String, reportTableName : String, unreadCountCol : String, allCountCol : String) : void
    {
        if(!isReady)
        {
            return;
        }

        if ( !OpenDB() )
            return;
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try{
            var delete : String = cmdText;
            db.ExecuteNonQuery(trans,delete,null);
            var update : String = String.Format("UPDATE [header] SET [{0}]=(SELECT count(*) FROM [{2}] WHERE [isRead]='0'),[{1}]=(SELECT count(*) FROM [{2}])",
                                                unreadCountCol, allCountCol, reportTableName);
            db.ExecuteNonQuery(trans,update,null);
            trans.Commit(); 
            InitMessageStatistics(true);
        }
        catch(error : System.Exception)
        { 
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }
    
    protected function InitMessageStatistics(dbopen : boolean) : void
    {
        if ( dbopen == false && !OpenDB() )
            return;
        var cmdText : String = "SELECT * FROM [header]";     
        var reader : IDataReader = db.ExcuteReader(cmdText,null);
        while(reader.Read()){
            statistics = new MessageStatistics();
            statistics.Id = Convert.ToInt32(reader["id"]);
            statistics.InboxMaxId = Convert.ToInt32(reader["inboxmaxid"]);
            statistics.ReportMaxId = Convert.ToInt32(reader["reportmaxid"]);
            statistics.AvaReportMaxId = Convert.ToInt32(reader["ava_reportmaxid"]);
            statistics.OutboxMaxId = Convert.ToInt32(reader["outboxmaxid"]);
            statistics.SysMaxId = Convert.ToInt32(reader["sysmaxid"]);
            statistics.UnReadInobxCount = Convert.ToInt32(reader["unreadInboxCount"]);
            statistics.UnReadReportCount = Convert.ToInt32(reader["unreadReportCount"]);
            statistics.UnreadAvaReportCount = Convert.ToInt32(reader["ava_unreadReportCount"]);
            statistics.AllInboxCount = Convert.ToInt32(reader["allInboxCount"]);
            statistics.AllOutBoxCount = Convert.ToInt32(reader["allOutboxCount"]);
            statistics.AllReportCount = Convert.ToInt32(reader["allReportCount"]);
            statistics.AllAvaReportCount = Convert.ToInt32(reader["ava_allReportCount"]);
            statistics.UnreadSysMailCount=Convert.ToInt32(reader["unreadSysMailCount"]);
            statistics.AllSysMailCount=Convert.ToInt32(reader["allSysMailCount"]);
            statistics.AllInboxCount = statistics.AllInboxCount -statistics.AllSysMailCount;
            statistics.UnReadInobxCount = statistics.UnReadInobxCount-statistics.UnreadSysMailCount;
            statistics.AllEventCenterCount = Convert.ToInt32(reader["allEventCenterCount"]);
        }
        reader.Close();
        if(dbopen == false)
        {
            CloseDB();
        }
    }
    
    public function ResetMessageStatistics()
    {
    	 statistics.Id =0;
        statistics.InboxMaxId = 0;
        statistics.ReportMaxId = 0;
        statistics.AvaReportMaxId = 0;
        statistics.OutboxMaxId = 0;
        statistics.SysMaxId = 0;
        statistics.UnReadInobxCount = 0;
        statistics.UnReadReportCount = 0;
        statistics.UnreadAvaReportCount = 0;
        statistics.AllInboxCount = 0;
        statistics.AllOutBoxCount = 0;
        statistics.AllReportCount = 0;
        statistics.AllAvaReportCount = 0;
        statistics.AllEventCenterCount = 0;
    }
    
    protected function CreatePrizeTable() : void
    {
        var trans : IDbTransaction = null;
        try
        {
            if ( !OpenDB() )
                return;
            trans = db.getDbCon().BeginTransaction();
            CreatePrizeTable(trans);
            trans.Commit();
        }
        catch(e : System.Exception)
        {
            if ( trans != null )
                trans.Rollback();
            throw;
        }
        finally
        {
            CloseDB();
        }
    }
    
    protected function CreatePrizeTable(trans : IDbTransaction)
    {
        var cmdText : String = "SELECT name FROM sqlite_master WHERE type = 'table'";
        var reader : IDataReader = db.ExcuteReader(cmdText, null);
        var havePrizeTable : boolean = false;
        while (reader.Read())
        {
            var name : String = reader["name"].ToString();
            if ( name == prizeTable )
            {
                havePrizeTable = true;
                break;
            }
        }
        reader.Close();
        if ( havePrizeTable )
            return;
        var colNames : String[] = ["id", "isSys", "item", "count", "createTime", "claimTime", "isClaim"];
        var colValues : String[] = ["integer", "integer", "integer", "integer", "text", "text", "byte"];
        db.CreateTable(trans,prizeTable,colNames,colValues,false);
        
        createIndex(prizeTable,String.Format("{0}Index", prizeTable), ["id", "isSys"], trans);
    }
    
    protected function createInboxTable(trans : IDbTransaction) : void
    {
        var columnNames : String[] = ["id","messageid","message","isSys","unixTime","isRead","isDel","sysMail"];
        var columnValues : String[] = ["integer","integer","blob","integer","text","integer","integer","integer"];
        db.CreateTable(trans,inboxTable,columnNames,columnValues,true);

        var cols : String[] = ["[messageid]", "[isSys]"];
        createIndex(inboxTable,"inboxIndex",cols,trans);
    }
    
    protected function createOutBoxTable(trans : IDbTransaction) : void
    {
        var columnNames : String[] = ["id","messageid","message","unixTime","isRead","isDel"];
        var columnValues : String[] = ["integer","integer","blob","text","integer","integer"];
        db.CreateTable(trans,outboxTable,columnNames,columnValues,true);
        
        createIndex(outboxTable,"outboxIndex", ["[messageid]"],trans);
    }
    
    protected function createReportTable(trans : IDbTransaction) : void
    {
        var columnNames : String[] = ["id","messageid","message","isRead","isDel"];
        var columnValues : String[] = ["integer","integer","blob","integer","integer"];
        db.CreateTable(trans,reportTable,columnNames,columnValues,true);
        var cols : String[] = ["[messageid]"];
        createIndex(reportTable,"reportIndex",cols,trans);
    }
    
    protected function createEventCenterTable(trans : IDbTransaction) : void
    {
    	var columnNames : String[] = ["id","eventCenterid","isRead","eventEndTime"];
        var columnValues : String[] = ["integer","integer","integer","text"];
        db.CreateTable(trans,eventCenterTable,columnNames,columnValues,true);
        var cols : String[] = ["[eventCenterid]"];
        createIndex(eventCenterTable,"eventCenterIndex",cols,trans);
    }
        
    protected function CreateAvaReportTable(trans : IDbTransaction) : void
    {
        var columnNames : String[] = [ "id", "ava_event_id", "messageid", "message", "isRead", "isDel"];
        var columnValues : String[] = [ "integer", "integer", "integer", "blob", "integer", "integer"];
        db.CreateTable(trans, AvaReportTable, columnNames, columnValues, true);
        var cols : String[] = [ "[ava_event_id]", "[messageid]" ];
        createIndex(AvaReportTable, AvaReportTable + "Index", cols, trans);
    }
    
    protected function createIndex(table : String, index : String, cols : String[], trans : IDbTransaction) : void
    {
        var cmdText : String = "CREATE INDEX [" + index + "] ON [" + table +"] ("+ cols.join(",") +")";
        db.ExecuteNonQuery(trans,cmdText,null);
    }
    
    protected function createHeaderTable(trans : IDbTransaction) : void
    {
        try
        {
            _Global.Log("createHeaderTable");
            var columnNames : List.<String> = new System.Collections.Generic.List.<String>();
            var columnValues : List.<String> = new System.Collections.Generic.List.<String>();
            columnNames.Add("id");columnValues.Add("integer");
            columnNames.Add("inboxmaxid");columnValues.Add("integer");
            columnNames.Add("inboxminid");columnValues.Add("integer");
            columnNames.Add("reportmaxid");columnValues.Add("integer");
            columnNames.Add("reportminid");columnValues.Add("integer");
            columnNames.Add("outboxmaxid");columnValues.Add("integer");
            columnNames.Add("outboxminid");columnValues.Add("integer");
            columnNames.Add("sysmaxid");columnValues.Add("integer");
            columnNames.Add("sysminid");columnValues.Add("integer");
            columnNames.Add("unreadInboxCount");columnValues.Add("integer");
            columnNames.Add("unreadReportCount");columnValues.Add("integer");
            columnNames.Add("allReportCount");columnValues.Add("integer");
            columnNames.Add("allInboxCount");columnValues.Add("integer");
            columnNames.Add("allOutboxCount");columnValues.Add("integer");
			columnNames.Add("allEventCenterCount");columnValues.Add("integer");
            columnNames.Add("ava_reportmaxid");
            columnValues.Add("integer");
            
            columnNames.Add("ava_reportminid");
            columnValues.Add("integer");
            
            columnNames.Add("ava_unreadReportCount");
            columnValues.Add("integer");
            
            columnNames.Add("ava_allReportCount");
            columnValues.Add("integer");
            
            columnNames.Add("unreadSysMailCount");
            columnValues.Add("integer");
            
            columnNames.Add("allSysMailCount");
            columnValues.Add("integer");
            db.CreateTable(trans,headerTable,columnNames.ToArray(),columnValues.ToArray(),true);
            var insert : String = "INSERT INTO [header] " +
                "([inboxmaxid],[inboxminid],[reportmaxid],[reportminid],[outboxmaxid],[outboxminid],[sysmaxid],[sysminid]," +
                "[unreadInboxCount],[unreadReportCount],[allReportCount],[allInboxCount],[allOutboxCount],[allEventCenterCount],[ava_reportmaxid], " + 
                "[ava_reportminid],[ava_unreadReportCount],[ava_allReportCount],[unreadSysMailCount],[allSysMailCount]) " +
                "VALUES ('0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0')";
            db.ExecuteNonQuery(trans,insert,null);
            
        }catch(error : System.Exception){
        
            priv_setFlag(error);
            _Global.Log("createHeaderTable"+error.ToString()); 
            throw;
        }
    }
    
    private function UpgradeDatabase() : void
    {
        CreatePrizeTable();
        UpgradeForAvaReports();
    }
    
    private function UpgradeForAvaReports() : void
    {
        if (!NeedUpgradeForAvaReports)
        {
            return;
        }
        
        if (!OpenDB())
        {
            return;
        }
        
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try
        {
            AlterHeaderTableForAvaReport(trans);
            CreateAvaReportTable(trans);
            trans.Commit();
        }
        catch(error : System.Exception)
        { 
            priv_setFlag(error);
            trans.Rollback();
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }
    
    private function AlterHeaderTableForAvaReport(trans : IDbTransaction) : void
    {
        var newColumns : String[] = [ "ava_reportmaxid", "ava_reportminId", "ava_unreadReportCount", "ava_allReportCount" ];
        var newValueTypes : String[] = [ "integer", "integer", "integer", "integer" ];
        var defaultValues : String[] = [ "0", "0", "0", "0" ];
        
        for (var i : int = 0; i < newColumns.Length; ++i)
        {
            var alterHeaderTable : String = String.Format("ALTER TABLE {0} ADD COLUMN {1} {2}", headerTable, newColumns[i], newValueTypes[i]);
            db.ExecuteNonQuery(trans, alterHeaderTable, null);
            var setDefaultValue : String = String.Format("UPDATE {0} SET {1} = {2}", headerTable, newColumns[i], defaultValues[i]);
            db.ExecuteNonQuery(trans, setDefaultValue, null);
        }
    }
    
    private function get NeedUpgradeForAvaReports() : boolean
    {
        return !TableExists(AvaReportTable);
    }
    
    private function TableExists(tableName : String) : boolean
    {
        if (!OpenDB())
        {
            return false;
        }
    
        var cmdText : String = "SELECT name FROM sqlite_master WHERE type = 'table'";
        var reader : IDataReader = db.ExcuteReader(cmdText, null);
        var ret : boolean = false;
        while (reader.Read())
        {
            var name : String = reader["name"].ToString();
            if (name == tableName)
            {
                ret = true;
                break;
            }
        }
        reader.Close();
        CloseDB();
        
        return ret;
    }
    
            
    public function InitDb() : void
    {
        if( !isReady )
            return;

        if ( UnityEngine.PlayerPrefs.GetInt("gm_isNeedCleanDBFile") != 0 )
            gm_isNeedCleanDBFile = true;
        else
            gm_isNeedCleanDBFile = false;

        var dirPath : String = priv_getDBDir();
        if ( !System.IO.Directory.Exists(dirPath) )
            System.IO.Directory.CreateDirectory(dirPath);
        db = new DBAccess();
        databasePath = priv_getDBDataPath();
        if ( System.IO.File.Exists(databasePath) )
        {
            if ( !gm_isNeedCleanDBFile )
            {
                UpgradeDatabase();
                return;
            }
            gm_isNeedCleanDBFile = false;
            UnityEngine.PlayerPrefs.DeleteKey("gm_isNeedCleanDBFile");
            System.IO.File.Delete(databasePath);
        }

		try
		{
	        db.OpenDB(databasePath);
        }
        catch(error : System.Exception)
        {
        	return;
        }
        
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try
        {
            createInboxTable(trans);
            createOutBoxTable(trans);
            createReportTable(trans);
            createEventCenterTable(trans);
            createHeaderTable(trans);
            CreatePrizeTable(trans);
            CreateAvaReportTable(trans);
            trans.Commit();
            SaveSqlVersion();
        }
        catch(error : System.Exception)
        { 
            priv_setFlag(error);
            trans.Rollback();
        }
        finally
        {
            trans.Dispose();
            db.CloseDB();
            priv_checkCleanDBFile();
        }
    }
    
    public function SetReportsRead(messageIds : int[]) : void
    {
        SetGenericReportsRead(messageIds, reportTable, "unreadReportCount", "allReportCount");
    }
    
    public function SetAvaReportsRead(messageIds : int[]) : void
    {
        SetGenericReportsRead(messageIds, AvaReportTable, "ava_unreadReportCount", "ava_allReportCount");
    }
    
    protected function SetGenericReportsRead(messageIds : int[], reportTableName : String, unreadCountCol : String, allCountCol : String)
    {
        if(!isReady)
        {
            return;
        }
        
        if ( !OpenDB() )
            return;
        var trans : IDbTransaction = db.getDbCon().BeginTransaction();
        try
        {
            var update : String = String.Format("UPDATE [{0}] SET [isRead]='1' WHERE [messageid] IN ({1})", reportTableName, messageIds.join(","));
            db.ExecuteNonQuery(trans,update,null);
            
            update = String.Format("UPDATE [header] SET [{0}]=(SELECT count(*) FROM [{2}] WHERE [isRead]='0'), [{1}]=(SELECT count(*) FROM [{2}])",
                                   unreadCountCol, allCountCol, reportTableName);
            db.ExecuteNonQuery(trans,update,null);
            trans.Commit();
            InitMessageStatistics(true);
        }
        catch(error : System.Exception)
        { 
            priv_setFlag(error);
            trans.Rollback();
            //throw;
        }
        finally
        {
            trans.Dispose();
            CloseDB();
            priv_checkCleanDBFile();
        }
    }
}
