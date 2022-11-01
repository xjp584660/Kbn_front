import System.IO;
//import System.Data;
//import Mono.Data.Sqlite;
import System.IO;
import System.Text;
import System.Collections.Generic;

class ChatMsgDB
{
	private function ChatMsgDB()
	{}
	
	private static var instance:ChatMsgDB = null;
	public static function GetInstance():ChatMsgDB
	{
		if(!instance)
		{
			instance = new ChatMsgDB();
			var userId:int=GameMain.singleton.getUserId();
			var worldId:int=Datas.singleton.worldid();
			if (PlayerPrefs.GetInt(userId+"_"+worldId+"_"+"privateChat",0)!=1) {
				instance.DeleteDBFile();
				PlayerPrefs.SetInt(userId+"_"+worldId+"_"+"privateChat",1);
			}
			
			GameMain.instance().resgisterRestartFunc(function(){
				instance = null;
			});
		}
		
		return instance;
	}
	private final var oldFileName:String = "chatMsgs.msgdb";
	//private final var version:String = "ver.ffff";  			// as ver.0000
//	private final var version:String = "ver.0001";				// added avatar and badge
	
	private final var fileName:String = "chatMsgs.cpb";
	private final var version:String = "ver.0002";				// added avatar and badge for single chat record
	
	var read_ver:int = -1;
	var writer:StreamWriter = null;
	var reader:StreamReader = null;
	
	private function GetSavePath():String
	{
	    var dir:String = SerializationUtils.FILEPATH + "/";
	    dir += "user_" + Datas.instance().tvuid() + "/world_" + Datas.instance().worldid();
	    dir += "/";
		return dir;
	}
	
	public function DeleteDBFile()
	{
		deleteFile(fileName);
	}
	
	private function deleteFile(filename : String)
	{
		// Save it in same directory with Email datas
		var fullPath:String = GetSavePath();
		var dir:DirectoryInfo = new DirectoryInfo(fullPath);
        fullPath += filename;
        
        if (System.IO.File.Exists(fullPath))
        {
        	System.IO.File.Delete(fullPath);
        }
	}
	
	public function WriteData(datas:List.<SingleConvData>)
	{
		// Save it in same directory with Email datas
		var fullPath:String = GetSavePath();
		var dir:DirectoryInfo = new DirectoryInfo(fullPath);
        if(!dir.Exists)
        {
        	dir.Create();
        }
        
        fullPath += fileName;
#if UNITY_IPHONE
		UnityEngine.iOS.Device.SetNoBackupFlag(fileName);
#endif
        var fs:FileStream = null;
        try
		{
			fs = new FileStream(fullPath, FileMode.Create);
        	writer = new StreamWriter(fs, Encoding.UTF8);
        	
        	// Custom write format
        	writer.WriteLine(version);
        	writer.WriteLine(datas.Count);
        	
        	var singleConvData:SingleConvData = null;
        	for (var i:int = 0; i < datas.Count; i++)
        	{
        		singleConvData = datas[i];
        		WriteSingleConvData(singleConvData);
        	}
        	
        	writer.Flush();
        }
        catch (ex:System.Exception)
        {
        	if (System.IO.File.Exists(fullPath))
        	{
        		System.IO.File.Delete(fullPath);
        	}
        }
        finally
        {
	        if (null != fs)
	        {
		        writer.Close();
	        	fs.Close();
	        }
	        
	        writer = null;
	        fs = null;
        }
	}
	
	private function WriteSingleConvData(data:SingleConvData)
	{
		if (null == writer) return;
		
		writer.WriteLine(data.targetId);
		writer.WriteLine(data.targetName);
		writer.WriteLine(data.targetAllianceId);
		writer.WriteLine(data.targetAllianceName);
		writer.WriteLine(data.targetAvatar);		// ver.0001
		writer.WriteLine(data.targetBadge);			// ver.0001
		writer.WriteLine(data.targetAvatarFrame);
		writer.WriteLine(data.targetChatFrame);
		writer.WriteLine(data.lastestReadedChatId);
		writer.WriteLine(data.newestChatId);
		
		writer.WriteLine(data.Count);
		for (var i:int = 0; i < data.Count; i++)
		{
			WriteChatItemData(data.GetChatData(i));
		}
	}
	
	private function WriteChatItemData(data:ChatItemData)
	{
		if (null == writer) return;
		
		writer.WriteLine(data.chatId);
		writer.WriteLine(data.chatType);
		writer.WriteLine(data.chatState);
		
		writer.WriteLine(data.userId);
		writer.WriteLine(data.userName);
		
		writer.WriteLine(data.msgContent);
		writer.WriteLine(data.msgDateTime);
		writer.WriteLine(data.msgDateTimeHash);
		
		writer.WriteLine(data.avatar);				// ver.0002
		writer.WriteLine(data.badge);				// ver.0002
		writer.WriteLine(data.avatarFrame);
		writer.WriteLine(data.chatFrame);
		
		writer.WriteLine(data.allianceName);
		writer.WriteLine(data.allianceId);
		writer.WriteLine(data.alliancePosition);
		
		writer.WriteLine(data.attachItemId);

		writer.WriteLine(data.transLate);
		writer.WriteLine(data.shareReport);
	}
	
	public function ReadData(datas:List.<SingleConvData>)
	{
		var fullPath:String = GetSavePath();
		read_ver = -1;
        
        if (!System.IO.File.Exists(fullPath + fileName))
    	{
    		if (!System.IO.File.Exists(fullPath + oldFileName))
    		{
    			return;
    		}
    		fullPath += oldFileName;
    		read_ver = 0;
    	}
    	else 
    	{
    		fullPath += fileName;
    	}
        
        var fs:FileStream = null;
        try
		{
			fs = new FileStream(fullPath, FileMode.Open);
        	reader = new StreamReader(fs, Encoding.UTF8);
        	
        	if (-1 == read_ver) {
	        	var ver:String = reader.ReadLine();
	        	if (ver == "ver.ffff") {
	        		read_ver = 0;
	        	} else {
	        		read_ver = _Global.INT32(ver.Substring(4, 4));
	        	}
        	}
        	if (-1 == read_ver) {
        		return;
        	}
        	
        	var count:int = _Global.INT32(reader.ReadLine());
        	
        	var singleConvData:SingleConvData = null;
        	for (var i:int = 0; i < count; i++)
        	{
        		singleConvData = ReadSingleConvData();
        		if (null != singleConvData)
        			datas.Add(singleConvData);	
        	}
        }
        catch (ex:System.Exception)
        {
        	// Do nth.
        	//Debug.Log(ex.Message);
        	//throw;
        }
        finally
        {
	        if (null != fs)
	        {
		        reader.Close();
	        	fs.Close();
	        }
	        
	        reader = null;
	        fs = null;
	        
	        if (0 == read_ver) {
	        	deleteFile(oldFileName);
	        }
        }
	}
	
	private function ReadSingleConvData():SingleConvData
	{
		if (null == reader) return null;
		
		var data:SingleConvData = new SingleConvData();
		
		data.targetId = _Global.INT32(reader.ReadLine());
		data.targetName = reader.ReadLine();
		data.targetAllianceId = _Global.INT32(reader.ReadLine());
		data.targetAllianceName = reader.ReadLine();
		if (read_ver >= 1) {
			data.targetAvatar = reader.ReadLine();
			data.targetBadge = reader.ReadLine();
			data.targetAvatarFrame = reader.ReadLine();
			data.targetChatFrame = reader.ReadLine();
		}
		data.lastestReadedChatId = _Global.INT32(reader.ReadLine());
		data.newestChatId = _Global.INT32(reader.ReadLine());
		
		var chatsCnt:int = _Global.INT32(reader.ReadLine());
		var chatData:ChatItemData = null;
		for (var i:int = 0; i < chatsCnt; i++)
		{
			chatData = ReadChatItemData();
			if (null != chatData)
				data.Add(chatData);
		}
		
		return data;
	}
	
	private function ReadChatItemData():ChatItemData
	{
		if (null == reader) return null;
		
		var data:ChatItemData = new ChatItemData();
		
		data.chatId = _Global.INT32(reader.ReadLine());
		data.chatType = reader.ReadLine();
		data.chatState = _Global.INT32(reader.ReadLine());
		data.chatState = ChatItemData.ChatStateReaded; // Force the state
		
		data.userId = _Global.INT32(reader.ReadLine());
		data.userName = reader.ReadLine();
		
		data.msgContent = reader.ReadLine();
		data.msgDateTime = reader.ReadLine();
		data.msgDateTimeHash = _Global.INT64(reader.ReadLine());
		
		if (read_ver >= 2) {
			data.avatar = reader.ReadLine();
			data.badge = reader.ReadLine();
			data.avatarFrame = reader.ReadLine();
			data.chatFrame = reader.ReadLine();
		}
		
		data.allianceName = reader.ReadLine();
		data.allianceId = _Global.INT32(reader.ReadLine());
		data.alliancePosition = _Global.INT32(reader.ReadLine());
		
		data.attachItemId = _Global.INT32(reader.ReadLine());

		data.transLate= _Global.GetString(reader.ReadLine());
		data.shareReport = _Global.GetString(reader.ReadLine());
		
		return data;
	}
	
	//---------------------------------------------------------------
	/// Database section no use now
	//---------------------------------------------------------------
//	private var dbAccess:DBAccess = null;
//	private var databaseName:String = "chatMsgDB.sqdb";
//	private var databaseFullPath:String = "";
//	private var dbHeader:Hashtable;
//	
//	private var privateChatTableName:String = "PrivateChatMsg";

/*
	private function InitDB()
	{
		// Save it in same directory with Email datas
		var dir:DirectoryInfo = new DirectoryInfo(GetSavePath());
        if(!dir.Exists){
        	dir.Create();
        }
        
        if (null == dbAccess)
       		dbAccess = new DBAccess();
       		
        databaseFullPath = GetSavePath() + databaseName;
        if(!(new FileInfo(databaseFullPath).Exists))
        {
			dbAccess.OpenDB(databaseFullPath);	
			var trans:IDbTransaction = dbAccess.getDbCon().BeginTransaction();
			try
			{
				CreatePrivateChatTable(dbAccess, trans);
				
				trans.Commit();
			}
			catch(e:System.Exception)
			{ 
				trans.Rollback();
				throw;
			}
			finally
			{
				trans.Dispose();
				dbAccess.CloseDB();
			}
		}
	} // 
	
	private function CreatePrivateChatTable(db:DBAccess, trans:IDbTransaction)
	{
    	var columnNames = new Array("id", "messageid", "message", "isSys", "unixTime", "isRead", "isDel");
   		var columnValues = new Array("integer", "integer", "blob", "integer", "text", "integer", "integer");
		db.CreateTable(trans, privateChatTableName, columnNames, columnValues, true);
		
		var cols:Array = new Array();
		cols.Add("[messageid]");
		cols.Add("[isSys]");
		
		var index:String = "ChatIndex";
		
		var createSql = "CREATE INDEX [" + index + "] ON [" + privateChatTableName +"] ("+ cols.join(",") +")";
		db.ExecuteNonQuery(trans, createSql, null);
	}
*/
}