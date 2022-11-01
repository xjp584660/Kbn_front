using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using PBData;
using _Global = KBN._Global;
using MystryChestLevelData = PBData.PBMsgResMystryChest.LevelData;
using MystryChestResponse = PBData.PBMsgResMystryChest;
using MystryChestData = PBData.PBMsgResMystryChest.ChestData;
using MystryChestRequest = PBData.PBMsgReqMystryChest;

public class LevelLimitChest
{
	public int id { get; set; }
	public string textureName { get; set; }
	public int levelLimit { get; set; }

	public LevelLimitChest() {
	}

	public static LevelLimitChest CreateFromPBMsg(MystryChestLevelData data) {
		var ret = new LevelLimitChest();
		ret.id = data.id;
		ret.textureName = data.icon;
		ret.levelLimit = data.level;
		return ret;
	}
}
namespace KBN{
public class MystryChest : object {
	public static MystryChest singleton { get; protected set; }
	public delegate void PFNLoadOK();

	private static string MystryChestVersion = "MystryChestVersion";
	private System.IO.Stream m_mystryChestRespondFileStream;
	private System.Collections.Generic.Dictionary<int, MystryChestData> m_mystryChestDatas;
	private long m_maxVersion = 0;
	protected System.Collections.Generic.HashSet<int> m_forSalesId;
	private System.Collections.Generic.List<PFNLoadOK> m_funcLoadOK = new System.Collections.Generic.List<PFNLoadOK>();
	protected bool m_isLoadOK = false;
	private System.Threading.Thread m_threadTransPB;
	private long m_savedFileVersion = 0;
	private System.DateTime m_startLoadTime;
	private int mg_MaxWaitedSeconds = 90;

	protected System.Collections.Generic.Dictionary<int, LevelLimitChest> levelLimitChestHash = new System.Collections.Generic.Dictionary<int, LevelLimitChest>();

	protected int[] chestOrder;
	public enum EnumLoadType
	{
		AsyncLoad
		,	SyncLoad
	}
	protected EnumLoadType m_mstryChestLoadedType = EnumLoadType.AsyncLoad;

	//public	static	MystryChest	instance(){
	//	if( singleton == null ){
	//		singleton = new MystryChest();
	//		KBN.GameMain.singleton.resgisterRestartFunc(new System.Action(delegate() {
	//			singleton = null;
	//		}));
	//	}

	//	MystryChest ret  = singleton as MystryChest;
	//	ret.prot_checkForPBFuncLoad();

	//	return ret;
	//}

	protected void prot_checkForPBFuncLoad()
	{
		if ( this.m_threadTransPB != null )
		{
			if ( this.m_isLoadOK && this.m_threadTransPB.Join(0) )
			{
				this.m_threadTransPB = null;
				this.priv_invokeFuncOnLoadOK();
			}
			else if ( m_maxVersion > 0 && (System.DateTime.Now - m_startLoadTime).TotalSeconds > mg_MaxWaitedSeconds )
			{
				this.m_threadTransPB.Abort();
				this.m_threadTransPB.Join();
				this.m_threadTransPB = null;
				this.GetConfigOk(null);
				this.priv_invokeFuncOnLoadOK();
			}
		}

		if ( m_savedFileVersion > m_maxVersion )
		{
			m_maxVersion = m_savedFileVersion;
			PlayerPrefs.SetString(MystryChestVersion, m_maxVersion.ToString());
		}
	}

	
	public EnumLoadType LoadType
	{
		set {m_mstryChestLoadedType = value;}
		get {return m_mstryChestLoadedType;}
	}
	
	public int[] ChestOrder
	{
		get
		{
			if ( !m_isLoadOK )
				return new int[0];
			return chestOrder;
		}
	}

	public bool IsLoadFinish
	{
		get {return m_isLoadOK;}
	}
	
	public virtual void InitWithAsync()
	{
		this.priv_requestMystryChestInfo(EnumLoadType.AsyncLoad, false);
	}

	public virtual void InitWithSync()
	{
		this.priv_requestMystryChestInfo(EnumLoadType.SyncLoad, true);
	}
	
	public void AddLoadMystryChestCallback(PFNLoadOK proc)
	{
		if ( m_isLoadOK )
		{
			proc();
			return;
		}
		
		m_funcLoadOK.Add(proc);
	}

	protected void priv_invokeFuncOnLoadOK()
	{
		foreach ( var func in m_funcLoadOK )
			func();
		m_funcLoadOK.Clear();
	}

	public virtual string GetChestImage(int id)
	{
		MystryChestData mystryChestData;
		if ( m_mystryChestDatas == null || !m_mystryChestDatas.TryGetValue(id, out mystryChestData) )
			return "";
		return mystryChestData.icon;
	}

	public virtual bool IsExchangeChest(int id)
	{
		if ( !this.m_isLoadOK || m_mystryChestDatas == null)
			return false;
		if(m_mystryChestDatas.ContainsKey(id))
		{
			MystryChestData exchangeData = m_mystryChestDatas[id];
			if(exchangeData.isExchange == 1)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}

	public bool IsLevelChest(int id)
	{
		if ( !this.m_isLoadOK )
			return false;
		return levelLimitChestHash.ContainsKey(id);
	}
	
	public string GetLevelChestImage(int id)
	{
		if ( !this.m_isLoadOK )
			return "";
		return levelLimitChestHash[id].textureName;
	}
	
	public int GetLevelOfChest(int id)
	{
		if ( !this.m_isLoadOK )
			return 0;
		return levelLimitChestHash[id].levelLimit;
	}

	// TODO: Remove when possible. No used to know if an ID is mystery chest quickly
	// before the MystryChest config data is loaded
	public static bool IsMystryChest_Temp(int id) {
	    return id >= 60000;
	}

	private void GetConfigOk(MystryChestResponse data) {
		var startTimeInMain = System.DateTime.Now;
		_Global.Log("GetConfigOk : Begin");
		bool isNeedSaveNewMystryChest = true;
		MystryChestResponse dataInFile = priv_loadMystryChestFromLocalFile(m_mystryChestRespondFileStream);
		if ( data == null || data.version < 0 )
		{
			isNeedSaveNewMystryChest = false;
			if ( dataInFile != null )
			{
				data = dataInFile;
				dataInFile = null;
			}
		}

		m_mystryChestDatas = priv_combine(ref data, dataInFile);

		CreateOnSaleList(data.data);
		CreateLevelLimitChest(data.ldata);
		CreateMChestOrder(data.order);

		Flags.instance().MYSTRY_CHEST_CONFIG = true;
		m_isLoadOK = true;
		var timeSpan = System.DateTime.Now - startTimeInMain;
		_Global.Log("GetConfigOk : " + (timeSpan.TotalMilliseconds * 0.001f).ToString());

		if ( isNeedSaveNewMystryChest )
		{
			priv_saveMystryChestToLocalFile(data);
		}

		
	}

	private System.Collections.Generic.Dictionary<int, MystryChestData> priv_combine(ref MystryChestResponse target, MystryChestResponse src)
	{
		_Global.Log("priv_combine : BEGIN");
		var startTimeInMain = System.DateTime.Now;
		if ( src == null )
			return priv_cast(target.data);

		if ( target.ldata != null && target.ldata.Count != 0 )
		{
			src.ldata.Clear();
			src.ldata.AddRange(target.ldata);
		}
		
		if ( target.order != null && target.order.Count != 0 )
		{
			src.order.Clear();
			src.order.AddRange(target.order);
		}

		var mystryChestDatas = priv_cast(src.data);
		if ( target.version > src.version && target.data != null && target.data.Count != 0 )
		{
			foreach ( var mystryChestData in target.data )
			{
				if ( mystryChestDatas.ContainsKey(mystryChestData.id) )
					mystryChestDatas[mystryChestData.id] = mystryChestData;
				else
					mystryChestDatas.Add(mystryChestData.id, mystryChestData);
			}
			target.data.Clear();
			src.data.Clear();
			foreach ( var mystryChestDataInDictionary in mystryChestDatas.Values )
			{
				src.data.Add(mystryChestDataInDictionary);
			}
			src.version = target.version;
		}
		target = src;
		var timeSpan = System.DateTime.Now - startTimeInMain;
		_Global.Log("priv_combine : " + (timeSpan.TotalMilliseconds * 0.001f).ToString());
		return mystryChestDatas;
	}

	private System.Collections.Generic.Dictionary<int, MystryChestData> priv_cast(System.Collections.Generic.IEnumerable<MystryChestData> dats)
	{
		var mystryChestDatas = new System.Collections.Generic.Dictionary<int, MystryChestData>();
		if ( dats == null )
			return mystryChestDatas;
		_Global.Log("priv_cast : BEGIN");
		var startTimeInMain = System.DateTime.Now;
		foreach ( var mystryChestData in dats)
			mystryChestDatas.Add(mystryChestData.id, mystryChestData);
		var timeSpan = System.DateTime.Now - startTimeInMain;
		_Global.Log("priv_cast : " + (timeSpan.TotalMilliseconds * 0.001f).ToString());
		return mystryChestDatas;
	}

	private void CreateOnSaleList(List<MystryChestData> data) {
		int curWorld = KBN.Datas.singleton.worldid() ;
		m_forSalesId = new System.Collections.Generic.HashSet<int>();
		foreach(var dat in data)
		{
			if ( !dat.forSale )
				continue;
			if ( !dat.serverId.Contains(curWorld) && !dat.serverId.Contains(0) )
				continue;
			m_forSalesId.Add(dat.id);
		}
	}

	private void CreateLevelLimitChest(IEnumerable<MystryChestLevelData> ldata) {
		if(ldata == null) {
			return;
		}
		
		levelLimitChestHash.Clear();
		foreach (MystryChestLevelData d in ldata) {
			var transformedData = LevelLimitChest.CreateFromPBMsg(d);
			levelLimitChestHash.Add(transformedData.id, transformedData);
		}
	}

	private void CreateMChestOrder(List<int> order) {
		List<int> chestOrderList = order;
		if (chestOrderList == null) {
			chestOrderList = new List<int>();
		}
		chestOrder = chestOrderList.ToArray();
	}

	#region Request & Respond
	private void priv_requestMystryChestInfo(EnumLoadType loadType, bool isSync)
	{
		if ( m_mstryChestLoadedType != loadType )
			return;
		m_isLoadOK = false;
		Flags.instance().MYSTRY_CHEST_CONFIG = false;

		m_mystryChestRespondFileStream = priv_loadMystryChestFileStream();
		string maxVersion = PlayerPrefs.GetString(MystryChestVersion, "0");
		m_maxVersion = _Global.INT64(maxVersion);

		MystryChestRequest request = new MystryChestRequest();
		request.version = m_maxVersion;
		string url = "getMysteryChestList_proto.php";
		System.Action<byte[]> okFunc = (result) =>
		{
			if ( result == null )
				return;

			if ( isSync )
				priv_onGetMystryChestBufferWithSync(result);
			else
				priv_onGetMystryChestBufferWithASync(result);
		};

		KBN.UnityNet.RequestForGPB(url, request, okFunc, null, true);
	}

	private void priv_onGetMystryChestBufferWithSync(byte[] result)
	{
		var startTimeInMain = System.DateTime.Now;
		_Global.Log("priv_onGetMystryChestBufferWithSync : Begin");
		priv_transDatPB(result);
		var timeSpan = System.DateTime.Now - startTimeInMain;
		_Global.Log("priv_onGetMystryChestBufferWithSync : " + (timeSpan.TotalMilliseconds * 0.001f).ToString());
		this.priv_invokeFuncOnLoadOK();
	}

	private void priv_onGetMystryChestBufferWithASync(byte[] result)
	{
		var startTimeInMain = System.DateTime.Now;
		_Global.Log("priv_onGetMystryChestBufferWithASync : Begin");
		System.Threading.Thread td = new System.Threading.Thread(this.priv_transDatPB);
		td.Start(result);
		m_threadTransPB = td;
		m_startLoadTime = System.DateTime.Now;
		var timeSpan = m_startLoadTime - startTimeInMain;
		_Global.Log("priv_onGetMystryChestBufferWithASync : " + (timeSpan.TotalMilliseconds * 0.001f).ToString());
	}

	private void priv_transDatPB(object dat)
	{
		var startTimeInMain = System.DateTime.Now;
		_Global.Log("priv_transDatPB : Begin");
		byte[] result = (byte[])dat;
		var mystryChestRespond = KBN._Global.DeserializePBMsgFromBytes<MystryChestResponse>(result);
		var timeSpan = System.DateTime.Now - startTimeInMain;
		_Global.Log("priv_transDatPB : " + (timeSpan.TotalMilliseconds * 0.001f).ToString());
		//System.Threading.Thread.Sleep(30000);
		this.GetConfigOk(mystryChestRespond);
	}
	#endregion

	public string GetChestName(int id)
	{
		return KBN.Datas.getArString("itemName.i" + id.ToString());
	}
	
	public string GetChestDesc(int id)
	{
		return KBN.Datas.getArString("itemDesc.i" + id.ToString());
	}
	
	public string GetChestDescMyst(int id)
	{
		return KBN.Datas.getArString("itemDescMyst.i" + id.ToString());
	}

	public virtual bool IsMystryChest(int id)
	{
		if ( m_mystryChestDatas == null )
			return IsMystryChest_Temp(id);
		if(m_mystryChestDatas.ContainsKey(id))
		{
			MystryChestData temp = m_mystryChestDatas[id];
			if(temp.isExchange == 1)
			{
				return false;
			}
			else
			{
				return true;
			}
		}
		else
		{
			return false;
		}
	}

	public virtual Hashtable GetChestItemData(int id)
	{
		MystryChestData mystryChestData;
		if ( m_mystryChestDatas == null || !m_mystryChestDatas.TryGetValue(id, out mystryChestData) )
			return null;
		Hashtable newItem = priv_getChestHashtableFromMystryChestData(mystryChestData);
		return newItem;
	}

	public virtual MystryChestData GetChestItemRawData(int id)
	{
		MystryChestData mystryChestData;
		if ( m_mystryChestDatas == null || !m_mystryChestDatas.TryGetValue(id, out mystryChestData) )
			return null;
		return mystryChestData;
	}
	
	public virtual System.Collections.Generic.IEnumerable<Hashtable> ChestList
	{
		get
		{
			if ( !this.m_isLoadOK )
				yield break;
			foreach (int itemId in m_forSalesId )
			{
				MystryChestData mystryChestData;
				if ( !m_mystryChestDatas.TryGetValue(itemId, out mystryChestData) )
					continue;
				Hashtable newItem  = priv_getChestHashtableFromMystryChestData(mystryChestData);
				yield return newItem;
			}
		}
	}

	private Hashtable priv_getChestHashtableFromMystryChestData(MystryChestData mystryChestData)
	{
//		if(mystryChestData.id == 4166 || mystryChestData.id == 4167 || mystryChestData.id == 4168)
//		{
//				int aaa = 10;
//				mystryChestData.isExchange = 1;
//		}
		Hashtable newItem  = new Hashtable
		{
			{ "ID", mystryChestData.id },
			{ "salePrice", mystryChestData.discountPrice == 0?mystryChestData.price:mystryChestData.discountPrice},
			{ "price", mystryChestData.price},
			{ "Count", 0}, 
			{ "Category", KBN.MyItems.Category.MystryChest},
			{ "startTime", mystryChestData.starttime},
			{ "endTime", mystryChestData.finishtime},
			{ "discountStartTime", mystryChestData.discountPrice == 0?0:mystryChestData.discountStarttime},
			{ "discountEndTime", mystryChestData.discountPrice == 0?0:mystryChestData.discountFinishtime},
			{ "isShow", 1},
			{ "isExchange",mystryChestData.isExchange}
		};
		return newItem;
	}

	private void priv_saveMystryChestToLocalFile(MystryChestResponse dat)
	{
		string fileDir = KBN.GameMain.GetApplicationDataSavePath();
		fileDir = System.IO.Path.Combine(fileDir, "pbuff");
		if ( !System.IO.Directory.Exists(fileDir) )
		{
			try
			{
				System.IO.Directory.CreateDirectory(fileDir);
			}
			catch(System.Exception)
			{
				return;
			}
		}

		var filePath = System.IO.Path.Combine(fileDir, "mystrychest.pb");
		try
		{
			var file = System.IO.File.Open(filePath, System.IO.FileMode.Create, System.IO.FileAccess.Write);
			if ( file == null )
				return;
			using ( file )
			{
				ProtoBuf.Serializer.Serialize(file, dat);
			}
			m_savedFileVersion = dat.version;
			return;
		}
		catch(System.Exception)
		{
		}
	}

	private System.IO.Stream priv_loadMystryChestFileStream()
	{
		string fileDir = KBN.GameMain.GetApplicationDataSavePath();
		fileDir = System.IO.Path.Combine(fileDir, "pbuff");
		
		var filePath = System.IO.Path.Combine(fileDir, "mystrychest.pb");
		try
		{
			var file = System.IO.File.OpenRead(filePath);
			if ( file == null )
				return null;
			
			using ( file )
			{
				var memStream = new System.IO.MemoryStream((int)file.Length);
				byte[] dat = new byte[1024];
				do
				{
					int rdSize = file.Read(dat, 0, dat.Length);
					if ( rdSize == 0 )
						break;
					memStream.Write(dat, 0, rdSize);
				}while(true);
				memStream.Seek(0, System.IO.SeekOrigin.Begin);
				return memStream;
				//return ProtoBuf.Serializer.Deserialize<MystryChestResponse> (file);
			}
		}
		catch(System.Exception)
		{
		}
		
		return null;

	}

	private MystryChestResponse priv_loadMystryChestFromLocalFile(System.IO.Stream file)
	{
		if ( file == null )
			return null;

		try
		{
			return ProtoBuf.Serializer.Deserialize<MystryChestResponse> (file);
		}
		catch(System.Exception)
		{
		}

		return null;
	}
}
}

