using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System;
using KBN;
using System.Linq;


public class AssetBundleManager
{
	protected string m_OTAPath;
	protected Dictionary <string,string> m_BundleNames = new Dictionary <string,string>();
	protected Dictionary <string,AssetBundle> m_AssetBundles = new Dictionary <string,AssetBundle>();
	protected Dictionary <string,string> m_BundleNameMd5sFromServer = new Dictionary <string,string>();//data from resourcelist.txt
	protected Dictionary <string,string> m_BundleNameMd5sFromLocal = new Dictionary <string,string>();// data from bundlelist.txt
	protected Dictionary <string,bool> m_BundleDownloadOKDic = new Dictionary<string,bool> ();
	protected Dictionary <string,bool> m_BundleReadyDic = new Dictionary<string,bool> ();

	public bool BundleListReady { get; set; }

	public struct DownLoadQueueItem
	{
		public string remoteBundleName;
		public string localBundleName;

		public DownLoadQueueItem(string remoteName,string localName)
		{
			remoteBundleName = remoteName;
			localBundleName = localName;
		}
	}

	protected string m_DownLoadURL;
	protected string m_DownLoadBackURL;
	protected Queue <DownLoadQueueItem> m_NeedDownLoadQueue = new Queue <DownLoadQueueItem> ();
	
	private static AssetBundleManager singleton = null;
	private AssetBundleManager(){}
	public static AssetBundleManager Instance()
	{
		if(singleton == null)
		{
			singleton = new AssetBundleManager();
		}
		return singleton;
	}

	// // Use this for initialization
	// void Start () 
	// {
	
	// }
	
	// // Update is called once per frame
	// void Update () 
	// {
	
	// }

    public int DownloadCompleteCount
    {
        get;
        protected set;
    }

    public int DownloadTotalCount
    {
        get;
        protected set;
    }

	public AssetBundle GetAssetBundle(string resName)
	{
		if(resName == null)
		{
			return null;
		}
		if(m_BundleNames.ContainsKey(resName))
		{
			string bundleName = m_BundleNames[resName];
			if(m_AssetBundles.ContainsKey(bundleName))
			{
				return m_AssetBundles[bundleName];
			}
			else{
				return LoadAssetBundleSimple(bundleName);

			}
		}
		return null;
	}



    private AssetBundle LoadAssetBundleSimple(string bundleName)
	{
        if(m_AssetBundles.ContainsKey(bundleName))
		{
			return m_AssetBundles[bundleName] ;
		}
		string fullPath = Path.Combine(m_OTAPath,bundleName + Constant.AssetBundleManager.AssetBundleNameSuffix);
		if(File.Exists(fullPath))
		{
			try
			{
				AssetBundle bundle = AssetBundle.LoadFromFile(fullPath);
				if(bundle != null)
				{
					m_AssetBundles.Add(bundleName,bundle);
					m_BundleReadyDic[bundleName] = true;
					return bundle;
				}
				else {
					return null;
				}
			}
			catch{
				return null;
			}
		}
		return null;
	}
	public void UnLoadAssetBundles(string resName)
	{
		if(resName == null)
		{
			return;
		}
		if(m_BundleNames.ContainsKey(resName))
		{
			string bundleName = m_BundleNames[resName];
			if(m_AssetBundles.ContainsKey(bundleName))
			{
				m_AssetBundles[bundleName].Unload(false);
				m_AssetBundles.Remove(bundleName);
			}
			if(m_BundleReadyDic.ContainsKey(bundleName))
			{
				m_BundleReadyDic[bundleName] = false;
			}
	    }
	}
	public bool IsResExist(string resName)
	{
		return m_BundleNames.ContainsKey (resName);
	}

	public void ClearAll()
	{
		m_BundleNames.Clear ();
		m_BundleNameMd5sFromServer.Clear ();
		m_BundleNameMd5sFromLocal.Clear ();
		m_NeedDownLoadQueue.Clear ();
		m_BundleDownloadOKDic.Clear ();
		m_BundleReadyDic.Clear ();
		UnloadAllAssetBundles ();
		BundleListReady = false;
		DownloadTotalCount = 0;
		DownloadCompleteCount = 0;
	}

	public void UnloadAllAssetBundles()
	{
		foreach ( var assetBundle in m_AssetBundles.Values )
		{
			if(assetBundle!=null)
			assetBundle.Unload(true);
		}
		m_AssetBundles.Clear ();
	}

	public void LoadAssetBundle(string bundleName)
	{
		if(m_AssetBundles.ContainsKey(bundleName))
		{
			return;
		}
		string fullPath = Path.Combine(m_OTAPath,bundleName + Constant.AssetBundleManager.AssetBundleNameSuffix);
		if(File.Exists(fullPath))
		{
			try
			{
				AssetBundle bundle = AssetBundle.LoadFromFile(fullPath);
				if(bundle != null)
				{
					m_AssetBundles.Add(bundleName,bundle);
					m_BundleReadyDic[bundleName] = true;
				}
				else
				{
					//bundle error
					DeleteBundleFile(bundleName);
					string bundleListPath = Path.Combine(m_OTAPath,Constant.AssetBundleManager.BundleMd5List);
					if(File.Exists(bundleListPath))
					{
						File.Delete(bundleListPath);
					}
				}
			}
			catch (Exception e)
			{
				//bundle error
				DeleteBundleFile(bundleName);
				string bundleListPath = Path.Combine(m_OTAPath,Constant.AssetBundleManager.BundleMd5List);
				if(File.Exists(bundleListPath))
				{
					File.Delete(bundleListPath);
				}
			}

		}
		else
		{
			//bundle is not enough
		}
		
	}
	
	public void LoadAllAssetBundles()
	{
		foreach(string bundleName in m_BundleNameMd5sFromServer.Keys)
		{
			LoadAssetBundle(bundleName);
		}
	}

	public void Init(string otaPath)
	{
		m_OTAPath = otaPath;
		ClearAll ();
		LoadBundleListFromLocal ();
		RegistDownloadHandler ();
	}

	public void ReqResourceList()
	{
		BundleListReady = false;
		string fullPath = Path.Combine (m_OTAPath,Constant.AssetBundleManager.ResourceList);
		string md5OfResourceList = string.Empty;
		if (File.Exists (fullPath))
		{
			md5OfResourceList = GetMd5 (fullPath);
		}
		//php request
		string url = "otaResourceList.php";
		WWWForm form = new WWWForm();	
		/*
		int platform = 201;
		if(RuntimePlatform.Android == Application.platform)
		{
			form.AddField("texture", BuildSetting.ANDROID_COMPRESSION);
			platform = 203;
			_Global.Log("ming android ota texture:" + BuildSetting.ANDROID_COMPRESSION);
		}
		form.AddField("platform", platform);
        _Global.Log("ming android ota platform:" + platform);
		*/
		form.AddField ("md5",md5OfResourceList);
		KBN.UnityNet.DoRequest(url, form, new Action<HashObject>(OnGetResourceListOK) , new Action<string,string,string>(OnGetResourceListFailed));
	}

	private void OnGetResourceListOK(HashObject data)
	{
        if (KBN._Global.GetBoolean(data["ok"]))
        {
            string resourceListText = KBN._Global.GetString(data["data"]);
            ParseResourceList(resourceListText);
            KBN.Utility.WriteToFile(Path.Combine(m_OTAPath, Constant.AssetBundleManager.ResourceList), resourceListText);
        }
        else
        {
            LoadResourceListFromLocal();
		}
		CheckResourceList ();
		ReqOTAURL ();
	}

	private void OnGetResourceListFailed(string errorMsg, string errorCode, string feedback)
	{
		LoadResourceListFromLocal ();
		CheckResourceList ();
		ReqOTAURL ();
	}

	public void ReqOTAURL()
	{
		string url = "ota.php";
		WWWForm form = new WWWForm();
		KBN.UnityNet.DoRequest(url, form, new Action<HashObject>(OnGetOTAURLOK) , null);
	}

	private void OnGetOTAURLOK(HashObject data)
	{
		if(KBN._Global.GetBoolean(data["ok"]))
		{
			m_DownLoadURL = _Global.GetString (data["data"]["url"]);
			m_DownLoadBackURL = _Global.GetString (data["data"]["ourl"]);
			DownLoadAssetBundles();
		}
	}

	//compare remote resourcelist to the local one
	protected void CheckResourceList()
	{	
		string remoteName;
		string localName;
		bool needDownload;
		foreach(string bundleName in m_BundleNameMd5sFromServer.Keys)
		{
			needDownload = false;
			if(m_BundleNameMd5sFromLocal.ContainsKey(bundleName))
			{
				if(m_BundleNameMd5sFromServer[bundleName] != m_BundleNameMd5sFromLocal[bundleName])
				{
					//bundle update, add to download queue
					DeleteBundleFile(bundleName);
					needDownload = true;
				}
			}
			else
			{
				//new Bundle, add to download queue
				needDownload = true;
			}
			if(needDownload)
			{
#if UNITY_ANDROID
                remoteName = bundleName + Constant.AssetBundleManager.JointBundleNameAndMd5 + m_BundleNameMd5sFromServer[bundleName] + Constant.AssetBundleManager.AssetBundleNameSuffix + ".android";
#else
                remoteName = bundleName + Constant.AssetBundleManager.JointBundleNameAndMd5 + m_BundleNameMd5sFromServer[bundleName] + Constant.AssetBundleManager.AssetBundleNameSuffix + ".ios";
#endif
				localName = Path.Combine(m_OTAPath,bundleName + Constant.AssetBundleManager.AssetBundleNameSuffix); 
				DownLoadQueueItem item = new DownLoadQueueItem(remoteName,localName);
				m_NeedDownLoadQueue.Enqueue(item);
			}

			//ok bundle list for bundleList.txt
			if( !m_BundleDownloadOKDic.ContainsKey(bundleName) )
			{
				m_BundleDownloadOKDic.Add(bundleName,!needDownload);
			}
			if( !m_BundleReadyDic.ContainsKey(bundleName) )
			{
				m_BundleReadyDic.Add(bundleName,false);
			}
		}

		//check bundle deprecate,delete file
		foreach(string bundleName in m_BundleNameMd5sFromLocal.Keys)
		{
			if( !m_BundleNameMd5sFromServer.ContainsKey(bundleName) )
			{
				DeleteBundleFile(bundleName);
			}
		}
	}

	protected bool DeleteBundleFile(string bundleName)
	{
		string fullPath = Path.Combine (m_OTAPath,bundleName);
		if(File.Exists(fullPath))
		{
			File.Delete(fullPath);
			return true;
		}
		return false;
	}

	protected string GetMd5(string filePath)
	{
		if(File.Exists(filePath))
		{
			using(FileStream fs = File.Open(filePath, FileMode.Open))
			{
				fs.Position = 0;
				return KBN._Global.GetMD5Hash(fs);
			}
		}
		return string.Empty;
	}

	public void LoadResourceListFromLocal()
	{
		string fullPath = Path.Combine (m_OTAPath,Constant.AssetBundleManager.ResourceList);
		string resourceListText = KBN.Utility.ReadFromFile (fullPath);
		ParseResourceList (resourceListText);
	}

	protected void ParseResourceList(string data)
	{
		int beginIndex = 0;
		string resourceNames;
		string bundleName;
		string md5;
		for(int i=0;i<data.Length;i++)
		{
			if(data[i] == '\r' || data[i] == '\n')
			{
				string line = data.Substring(beginIndex,i-beginIndex);
				beginIndex = i+1;
				if(String.IsNullOrEmpty(line))
				{
					continue;
				}
				var columns = line.Split(':');
				resourceNames = columns[0];
				int index = columns[1].IndexOf(Constant.AssetBundleManager.JointBundleNameAndMd5);
				bundleName = columns[1].Substring(0,index);
				int JointLen = Constant.AssetBundleManager.JointBundleNameAndMd5.Length;
				md5 = columns[1].Substring(index+JointLen,32);// 32 is length of md5
				var resourceNameList = resourceNames.Split(',');
				foreach(string resName in resourceNameList)
				{
					if(!m_BundleNames.ContainsKey(resName))
					{
						m_BundleNames.Add(resName,bundleName);
					}
					else
					{
						m_BundleNames[resName] = bundleName;
					}
				}
				if(!m_BundleNameMd5sFromServer.ContainsKey(bundleName))
				{
					m_BundleNameMd5sFromServer.Add(bundleName,md5);
				}
				else
				{
					m_BundleNameMd5sFromServer[bundleName] = md5;
				}
			}
		}
		BundleListReady = true;
	}

	protected void LoadBundleListFromLocal()
	{
		string fullPath = Path.Combine (m_OTAPath,Constant.AssetBundleManager.BundleMd5List);
		string bundleListText = KBN.Utility.ReadFromFile (fullPath);
		int beginIndex = 0;
		string bundleName;
		string bundleMd5;
		for(int i=0;i<bundleListText.Length;i++)
		{
			if(bundleListText[i] == '\r' || bundleListText[i] == '\n')
			{
				string line = bundleListText.Substring(beginIndex,i-beginIndex);
				beginIndex = i+1;
				if(String.IsNullOrEmpty(line))
				{
					continue;
				}
				
				var columns = line.Split(':');
				bundleName = columns[0];
				bundleMd5 = columns[1];
				if(!m_BundleNameMd5sFromLocal.ContainsKey(bundleName) && File.Exists(Path.Combine (m_OTAPath,bundleName + Constant.AssetBundleManager.AssetBundleNameSuffix)))
				{
					//string str = Path.Combine(m_OTAPath, bundleName + Constant.AssetBundleManager.AssetBundleNameSuffix);
					//using (FileStream fs = File.Open(str, FileMode.Open))
					//{
					//	byte[] zipFile = new byte[fs.Length];
					//	fs.Read(zipFile, 0, (int)fs.Length);
					//	byte[] unzipFile = FileZip.UnZipStream(zipFile);
					//	fs.Close();
					//	fs.Dispose();

					//	FileStream zipFs = new FileStream(str, FileMode.Create);
					//	zipFs.Write(unzipFile, 0, unzipFile.Length);
					//	zipFs.Close();
					//	zipFs.Dispose();
     //                   //File.Delete(str);
     //               }
					m_BundleNameMd5sFromLocal.Add(bundleName,bundleMd5);
				}
				else
				{
//					m_BundleNameMd5sFromLocal[bundleName] = bundleMd5;
				}
			}
		}
	}

	protected void SaveBundleList()
	{
		string fullPath = Path.Combine (m_OTAPath,Constant.AssetBundleManager.BundleMd5List);
		if(File.Exists(fullPath))
		{
			File.Delete(fullPath);
		}
		
		string line;
		using (StreamWriter sw = new StreamWriter(fullPath,false))
		{
			foreach(string bundleName in m_BundleDownloadOKDic.Keys)
			{
				if(m_BundleDownloadOKDic[bundleName] && m_BundleNameMd5sFromServer.ContainsKey(bundleName))
				{
					line = bundleName + ":" + m_BundleNameMd5sFromServer[bundleName];
					sw.WriteLine(line);
				}
			}
			sw.Close();
		}
	}

	private void DownLoadAssetBundles()
	{
        DownloadTotalCount = m_NeedDownLoadQueue.Count;

		while(m_NeedDownLoadQueue.Count > 0)
		{
			DownLoadQueueItem item = m_NeedDownLoadQueue.Dequeue();

			Game.Download.AddDownload(Path.Combine(m_OTAPath,item.localBundleName),m_DownLoadURL + item.remoteBundleName,m_DownLoadBackURL + item.remoteBundleName);
		}
	}

	public bool CheckAllAssetBundlesDownloadSuccess()
	{
		foreach(string bundleName in m_BundleDownloadOKDic.Keys)
		{
			if ( !m_BundleDownloadOKDic[bundleName] )
			{
				return false;
			}
		}
		return true;
	}

	public bool CheckAllAssetBundlesReady()
	{
		foreach(string bundleName in m_BundleReadyDic.Keys)
		{
			if ( !m_BundleReadyDic[bundleName] )
			{
				return false;
			}
		}
		return true;
	}

	private bool CheckBundleFileMd5(string fullPath)
	{
		string localMD5 = GetMd5 (fullPath);
		string fileName = Path.GetFileName (fullPath);
		int index = fileName.IndexOf (Constant.AssetBundleManager.AssetBundleNameSuffix);
		string bundleName = fileName.Substring (0,index);
		string serverMD5 = m_BundleNameMd5sFromServer [bundleName];
		return string.Equals(localMD5, serverMD5);
	}

	private bool UnZipBundleFile(string fullPath)
	{
		
		if(File.Exists(fullPath))
		{
			try
			{
#if UNITY_EDITOR_WIN
				byte[] zipContent;
                using (FileStream fs = File.Open(fullPath, FileMode.Open))
                {
                    zipContent = new byte[fs.Length];
                    fs.Read(zipContent, 0, zipContent.Length);
                    fs.Close();
                    fs.Dispose();
                }



                File.Delete(fullPath);
                byte [] unZipContent = FileZip.UnZipStream(zipContent);
                //byte[] unZipContent = zipContent;
                using (FileStream unZipfs = new FileStream(fullPath, FileMode.Create))
                {
                    unZipfs.Write(unZipContent, 0, unZipContent.Length);
                    unZipfs.Close();
                    unZipfs.Dispose();

                }

#endif

				return true;
			}
			catch(Exception e)
			{
				return false;
			}
		}
		else
		{
			return false;
		}
		
	}

	private void RegistDownloadHandler()
	{
		KBN.Game.Event.RegisterHandler(KBN.EventId.DownloadSuccess, OnDownloadSuccess);
	}

	private void OnDownloadSuccess(object sender, GameFramework.GameEventArgs e)
	{
		
		KBN.DownloadSuccessEventArgs ne = e as KBN.DownloadSuccessEventArgs;

		if (UnZipBundleFile(ne.DownloadPath) && CheckBundleFileMd5(ne.DownloadPath)) {

			string fileName = Path.GetFileName(ne.DownloadPath);
			int index = fileName.IndexOf(Constant.AssetBundleManager.AssetBundleNameSuffix);
			string bundleName = fileName.Substring(0, index);

			if (m_BundleDownloadOKDic.ContainsKey(bundleName)) {
				m_BundleDownloadOKDic[bundleName] = true;
				DownloadCompleteCount = DownloadTotalCount - m_BundleDownloadOKDic.Count(x => !x.Value);
			}
			else {
				Debug.LogError("DownLoaded an unknown bundle");
			}
			SaveBundleList();
			return;
		}
       
		Game.Event.Fire (this, new KBN.DownloadCheckFailureEventArgs (ne.DownloadPath, ne.DownloadUri, null, ne.UserData as string));
	
	}

	public void RetryDownload(string downloadPath, string uri, string userData)
	{
		string backUrl = userData as string;
		Game.Download.AddDownload (downloadPath, backUrl, userData);
	}
}
