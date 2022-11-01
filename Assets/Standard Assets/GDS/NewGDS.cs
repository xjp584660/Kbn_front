using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System;
namespace KBN
{
	public abstract class NewGDS : IResponseHandler
	{
		protected const string FILE_SUFFIX = "n.txt";
		protected const int splitMaxCount = 4;
		protected string applicationTxtDir;
		protected string m_strData = null;
		protected int m_iVer = 0;
		protected KBN.DataTable.DataTable m_DT = null;

        public virtual GdsCategory Category
        {
            get
            {
                return GdsCategory.Default;
            }
        }

        private string m_fileName;
        public virtual string FileName
        {
            get
            {
                if (string.IsNullOrEmpty(m_fileName))
                {
                    m_fileName = GetType().Name.Replace("GDS_", string.Empty);
                }
                return m_fileName;
            }
        }

        public virtual string KeyForVersionCheck
        {
            get
            {
                return FileName;
            }
        }

        public bool IsLoaded { get; protected set; }
        public bool IsReloaded { get; set; }
        public bool NeedRestartGame { get; protected set; }

        private bool m_NeedDownLoad = true;
        public bool NeedDownLoad
        {
            get { return m_NeedDownLoad; }
            set { m_NeedDownLoad = value; }
        }

        public NewGDS()
        {
            Init();
        }

		protected virtual void Init()
		{
			applicationTxtDir = GameMain.GetApplicationDataSavePath() + "/txt";
            m_DT = new KBN.DataTable.DataTable ();
		}

		public int getWorldId()
		{
			return Datas.singleton.worldid();
		}
		
		public int getVersion()
		{
			return m_iVer;
		}
		
		public string getData()
		{
			return m_strData;
		}

		protected void FreeStrData()
		{
			m_strData = null;
		}

		public virtual void OKHandler(byte[] data)
		{

		}

		public virtual void ErrorHandler(string errorMessage, string errorCode)
		{
			
		}

		public int InitVersion()
		{
            string filename = FileName;
			DirectoryInfo dirInfo = new DirectoryInfo (applicationTxtDir);
			FileInfo[] fileInfos = dirInfo.GetFiles();
			foreach (FileInfo info in fileInfos) 
			{
				//_Global.LogWarning("info.Name : " + info.Name);
				string[] list = info.Name.Split('_');
				if(list.Length < splitMaxCount) 
				{
					continue;
				}

				//_Global.LogWarning("list 3: " + list[3]);
				if( list[0] == filename && list[2] == getWorldId().ToString() && list[3] == FILE_SUFFIX)
				{
					string[] split = info.Name.Split('_');
					m_iVer = _Global.INT32(split[1]);
					return m_iVer;
				}
			}

			m_iVer = 0;
			return m_iVer;
		}

        public void LoadFromLocal()
        {
            LoadFromLocal(FileName);
        }

		public virtual void LoadFromLocal(string filename)
		{
			DirectoryInfo dirInfo = new DirectoryInfo (applicationTxtDir);
			FileInfo[] fileInfos = dirInfo.GetFiles();
			foreach (FileInfo info in fileInfos) 
			{
				string[] list = info.Name.Split('_');
				if(list.Length < splitMaxCount) 
				{
					continue;
				}
				if( list[0] == filename && list[2] == getWorldId().ToString() && list[3] == FILE_SUFFIX)
				{
					m_strData = ReadFromFile (applicationTxtDir + "/"+ info.Name);
					m_strData = DesDeCode(m_strData);   //所有GDS数据解密
                    IsLoaded = true;
					return;
				}
			}
	
			TextAsset text = Resources.Load ("Data/" + filename) as TextAsset;
			if(text != null){
				m_strData = text.text;
			    m_strData = DesDeCode(m_strData);    //本地数据暂时没有加密
			}
				
            IsLoaded = true;
		}

        //解密
		protected string DesDeCode(string str)
		{
			try
			{
				if (!NeedDownLoad)
				{
					return KBN.UnityNet.DESDeCode_AES(str);   //所有GDS数据解密				
				}else
				{
					return str;
				}
			}
			catch (System.Exception)
			{
				return "";
				throw;
			}
			
		}

        //加密
		protected string DesEncode(string str)
		{
			try
			{
				return KBN.UnityNet.DESEnCode_AES(str);   //所有GDS数据解密				
			}
			catch (System.Exception)
			{
				return "";
				throw;
			}
		}

        public void DownloadFromServer()
        {
            DownLoadFromServer(FileName);
        }

		public virtual void DownLoadFromServer(string filename)
		{
			PBMsgReqGds.PBMsgReqGds reqMsg = new PBMsgReqGds.PBMsgReqGds ();
			reqMsg.type = filename;
			reqMsg.version = getVersion();
			reqMsg.worldId = Datas.singleton.worldid();
			string url = "gds.php";
			UnityNet.SendRequestWithOutErrorFunc (url,reqMsg,this,true);
		}

        public void LoadData()
        {
			 _Global.LogWarning("NewGDS.LoadData fileName: " + FileName);
            if (NeedDownLoad) 
            {
                DownloadFromServer();
            }
            else
            {
                LoadFromLocal();
            }
        }

		protected void Save(string fileName,int iVer,string strData,bool bRestart)
		{
			System.DateTime startTime = System.DateTime.Now;
			m_strData = strData;
			m_iVer = iVer;
			WriteToFile (fileName, m_strData);
            IsLoaded = true;
            IsReloaded = true;
			if (bRestart) 
			{
                NeedRestartGame = true;
			}
			_Global.Log("$$$$$ DataTable WriteFile: " + fileName + ": " + (System.DateTime.Now - startTime).TotalMilliseconds);

		}

		public string ReadFromFile(string fileFullPath)
		{
			string ret = null;
			try
			{
				using (StreamReader sr = new StreamReader(fileFullPath))
				{
					ret = sr.ReadToEnd();
					sr.Close();
				}
			}
			catch(IOException)
			{
				if (File.Exists(fileFullPath))
				{
					File.Delete(fileFullPath);
				}
			}
			return ret;
		}
		
		public void	WriteToFile(string fileName,string content)
		{
			//delete oldfile
			DirectoryInfo dirInfo = new DirectoryInfo (applicationTxtDir);
			FileInfo[] fileInfos = dirInfo.GetFiles();
			foreach (FileInfo info in fileInfos) 
			{
				string[] list = info.Name.Split('_');
				if(list.Length < splitMaxCount) 
				{
					continue;
				}

				if( list[0] == fileName && list[2] == getWorldId().ToString() && list[3] == FILE_SUFFIX)
				{
					info.Delete();
				}
			}
			//write new file
			string fileFullPath = applicationTxtDir + "/" + fileName + "_" + m_iVer + "_" + getWorldId () + "_" + FILE_SUFFIX;
			try
			{
				using (StreamWriter sw = new StreamWriter(fileFullPath,false))
				{
					content = DesEncode(content); //GDS加密存储
					sw.Write(content);
					sw.Close();
				}
			}
			catch(IOException)
			{
				if (File.Exists(fileFullPath))
				{
					File.Delete(fileFullPath);
				}
			}
		}

		public KBN.DataTable.DataTable GetDT()
		{
			return m_DT;
		}
		
		public Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection GetItems()
		{
			return m_DT.GetItems();
		}
		
		public Dictionary<string, KBN.DataTable.IDataItem> GetItemDictionary()
		{
			return m_DT.GetItemDictionary();
		}
	}
}





