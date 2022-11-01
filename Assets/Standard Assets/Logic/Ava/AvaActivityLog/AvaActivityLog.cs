using UnityEngine;
using System.IO;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class AvaActivityLog : AvaModule {

	
	public AvaActivityLog(AvaManager avaEntry) : base(avaEntry)
	{
		// 
	}

	public List<AvaActivityLogDataItem> Data
	{
		get;
		private set;
	}
	private int currentEventId = 0;

	public List<AvaActivityLogDataItem> DataFilter0;  // Mine

	public override void Init()
	{
		base.Init();

		Reset();

		Data = ReadLogsFromFile(ref currentEventId);
		if (null == Data) Data = new List<AvaActivityLogDataItem>();

		DataFilter0 = Data.FindAll(x => IsMine(x));
	}

	private float lastCheckTime = -1f;
	public override void Update()
	{
		base.Update();

		float now = Time.realtimeSinceStartup;
		if (now - lastCheckTime > 0.5f) {
			lastCheckTime = now;

			int newId = AvaEntry.Event.GetActId();
			if (AvaEntry.Event.CurStatus != AvaEvent.AvaStatus.Idle && 
			    AvaEntry.Event.CurStatus != AvaEvent.AvaStatus.ClaimReward &&
			    AvaEntry.Event.CurStatus != AvaEvent.AvaStatus.Rewward &&
			    AvaEntry.Event.CurStatus != AvaEvent.AvaStatus.EndIdle && newId != currentEventId)
			{
				currentEventId = newId;
				Data = new List<AvaActivityLogDataItem>();
				DataFilter0 = new List<AvaActivityLogDataItem>();
			}

			if (null != logQueue && logQueue.Count > 0 && logQueueEventId == currentEventId) {

				Data.AddRange(logQueue);
				DataFilter0.AddRange(new List<AvaActivityLogDataItem>(logQueue).FindAll(x => IsMine(x)));
				logQueue.Clear();

				Data.Sort();
				DataFilter0.Sort();
				WriteLogsToFile(currentEventId, Data);

				KBN.MenuMgr.instance.SendNotification(Constant.AvaNotification.ActivityLogUpdated);
			}
		}
	}

	public override void Clear()
	{
		base.Clear();

		Reset();
	}

	private void Reset()
	{
		Data = new List<AvaActivityLogDataItem>();
		currentEventId = 0;

		DataFilter0 = new List<AvaActivityLogDataItem>();
		
		logQueue = null;
		logQueueEventId = -1;
	}

	#region Filters

	private bool IsMine(AvaActivityLogDataItem log)
	{
		return log.ContainsPlayer(Datas.singleton.worldid(), Datas.singleton.tvuid());
	}

	#endregion

	#region Network

	private const string stringKey = "activityLog";
	private Queue<AvaActivityLogDataItem> logQueue = null;
	private int logQueueEventId = -1;

	public void UpdateActivityLog(List<PBMsgAVASocket.PBMsgAVASocket.kv> data)
	{
		string rawData = null;
		for (int i = 0; i < data.Count; i ++) {
			if (stringKey == data[i].key) {
				rawData = data[i].value;
				break;
			}
		}

		if (string.IsNullOrEmpty(rawData))
			return;

		var log = new AvaActivityLogDataItem(rawData);
		if (log.EventId < currentEventId) 
			return;
		
		if (log.EventId > logQueueEventId) {
			logQueueEventId = log.EventId;
			logQueue = new Queue<AvaActivityLogDataItem>();
		}

		if (log.EventId >= currentEventId)
		{
			logQueue.Enqueue(log);
		}
	}

	#endregion


	#region Serialization

	private const string magicLabel = "ActivityLog";
	private const int currentFormatVersion = 1;

	private string DataFilePath
	{
		get
		{
			return SerializationUtils.FILEPATH + "/user_" + Datas.singleton.tvuid() + "/world_" + Datas.singleton.worldid() + "/avtivity_log.txt";
		}
	}

	private List<AvaActivityLogDataItem> ReadLogsFromFile(ref int currentEventId)
	{
		List<AvaActivityLogDataItem> ret = null;

		string filepath = DataFilePath;
		if (!File.Exists(filepath)) 
		{
			return null;
		}

		StreamReader reader = null;
		try
		{
			reader = new StreamReader(filepath, System.Text.Encoding.UTF8);
			string line = reader.ReadLine();
			string[] header = line.Split(new char[] { ' ' }, System.StringSplitOptions.RemoveEmptyEntries);
			if (2 != header.Length || magicLabel != header[0]) {
				throw new System.Exception("[AvaActivityLog] Invalid file.");
			}

			int fileVersion = _Global.INT32(header[1]);
			if (fileVersion > currentFormatVersion) {
				throw new System.Exception("[AvaActivityLog] Unsupported format version.");
			} 

			if (fileVersion < currentFormatVersion) {
				// TODO
			}

			// format version 1 begin
			string fileEventId = reader.ReadLine();
			if (currentEventId == 0 || _Global.INT32(fileEventId) == currentEventId) {

				currentEventId = _Global.INT32(fileEventId);

				ret = new List<AvaActivityLogDataItem>();

				while (!reader.EndOfStream) {
					ret.Add(new AvaActivityLogDataItem(reader.ReadLine().Trim()));
				}
			}
			// format version 1 end
		}
		catch(System.Exception ex)
		{
			if (BuildSetting.DebugMode == 1) {
				_Global.LogError(ex.ToString());
			}
		}
		finally
		{
			if (null != reader) {
				reader.Close();
			}
		}

		if (null != ret) ret.Sort();

		return ret;
	}

	private bool WriteLogsToFile(int currentEventId, List<AvaActivityLogDataItem> logs)
	{
		string filepath = DataFilePath;
		FileStream stream = null;
		StreamWriter writer = null;

		bool hasError = false;
		try
		{
			stream = File.Open(filepath, FileMode.Create, FileAccess.Write);
			writer = new StreamWriter(stream);

			writer.WriteLine(magicLabel + " " + currentFormatVersion);
			writer.WriteLine(currentEventId);

			for (int i = 0; i < logs.Count; i++) 
			{
				writer.WriteLine(logs[i].RawData);
				Debug.LogWarning("Write: " + logs[i].RawData);
			}
		}
		catch(System.Exception ex)
		{
			if (BuildSetting.DebugMode == 1) {
				_Global.LogError(ex.ToString());
			}
			hasError = true;
		}
		finally
		{
			if (null != writer) writer.Close();
			if (null != stream) stream.Close();
		}

		return !hasError;
	}

//	private bool AppendLogToFile(int currentEventId, string log)
//	{
//		string filepath = DataFilePath;
//		if (File.Exists(filepath)) 
//		{
//
//		} 
//		else
//		{
//		}
//		return false;
//	}

	#endregion
}
