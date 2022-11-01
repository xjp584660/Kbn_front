
namespace RemoteFile
{
	public enum RemoteFileState
	{	FileWaiting
		,	FileGetInfo
		,	FileDownloading
		,	FileChecking
		,	FlieNotFound
		,	FileLoadLost
		,	FileDone
	}
	
	
	public enum RemoteLifeType
	{	LivingWithDownload
		,	LivingWithLastUse
		,	LivingWithDeathLine
	}
	
	
	public abstract class RemoteFileInfo
	{
		public delegate void AsyncReadCallback(object usrData, long start, int rdLen, byte[] dat, int datStart);
		public delegate void DownloadFinishHandle(object usrData, RemoteFileInfo rfi, bool isLoadOK);
		
		public RemoteFileInfo(string _fileKey, string _fileURLPath, string _fileMD5)
		{
			fileKey = _fileKey;
			fileURLPath = _fileURLPath;
			m_fileMD5 = _fileMD5??string.Empty;
		}
		
		public readonly string	fileKey;
		public readonly string	fileURLPath;
		public string	fileMD5{get{ return m_fileMD5; }}
		
		protected long    m_fileTotalSize;
		public long		fileTotalSize{ get{ return m_fileTotalSize; }}
		
		protected RemoteFileState m_fileState;
		public RemoteFileState 	fileState{get{return m_fileState;}}
		
		public abstract bool AsyncRead(object usrData, long start, int rdLen, AsyncReadCallback readCallback);
		public abstract void OnDownloadFinish(System.DateTime timeout, object usrData, DownloadFinishHandle handle);
		
		protected string m_fileMD5;
	}
	
	
	public class RemoteFileMgr
		: System.IDisposable
	{
		private class _AsyncFileInfo
		{
			public AsyncLoader.IAsyncFileLoader _asyncFL;
			public System.IAsyncResult  _asyncResult;
		}
		
		private class _RemoteFileInfo
			: RemoteFileInfo
		{
			public _RemoteFileInfo(StreamCache streamCache, string _fileRootPath, string _fileKey, string _fileLocalPath, string _fileURLPath, string _fileMD5)
				: base(_fileKey, _fileURLPath, _fileMD5)
			{
				m_streamCache = streamCache;
				fileFullPath = System.IO.Path.Combine(_fileRootPath, _fileLocalPath);
				fileLocalPath = _fileLocalPath;
			}
			
			~_RemoteFileInfo()
			{
				if ( m_wtFileHandle != null )
				{
					m_wtFileHandle.Flush();
					m_wtFileHandle.Dispose();
				}
			}
			public readonly string  fileFullPath;
			public readonly string	fileLocalPath;
			
			public new long			fileTotalSize{get{ return m_fileTotalSize; } set{ m_fileTotalSize = value; }}
			public long				fileDownloadSize;
			
			public RemoteLifeType	remoteLifeType;
			public long				fileValidTime;
			
			public System.DateTime 	lastDownloadTime;
			public System.DateTime 	lastUseageTime;
			public System.DateTime 	lastUpdateTime;
			public new RemoteFileState 	fileState
			{
				get{ return m_fileState; }
				set
				{
					if (m_fileState == value)
						return;
					m_fileState = value;
					if (m_fileState == RemoteFileState.FileDone)
						this.priv_onFileDone();
				}
			}
			
			private readonly StreamCache m_streamCache;
			private _AsyncFileInfo   m_asyncFileInfo;
			private System.IO.Stream m_wtFileHandle;
			private System.IO.Stream m_rdFileHandle;
			
			public void Close()
			{
				if (m_wtFileHandle != null)
				{
					m_streamCache.ReleaseFile(fileFullPath);
					m_wtFileHandle = null;
				}
				
				if (m_rdFileHandle != null)
				{
					m_streamCache.ReleaseFile(fileFullPath);
					m_rdFileHandle = null;
				}
			}
			
			public _AsyncFileInfo   _asyncFileInfo
			{
				get{ return m_asyncFileInfo; }
				set
				{
					if (value == null)
					{
						System.IDisposable disPos = m_asyncFileInfo._asyncFL as System.IDisposable;
						if ( disPos != null )
							disPos.Dispose();
						disPos = m_asyncFileInfo._asyncResult as System.IDisposable;
						if ( disPos != null )
							disPos.Dispose();
					}
					m_asyncFileInfo = value;
				}
			}
			
			/// <summary>
			/// Gets the writeable file handle.
			/// </summary>
			/// <value>The writeable file handle.</value>
			public System.IO.Stream wtFileHandle
			{
				get
				{
					if (m_wtFileHandle == null)
					{
						try
						{
							m_wtFileHandle = m_streamCache.LockWriteFile(fileFullPath, true);
						}
						catch(System.IO.IOException)
						{
						}
					}
					
					return m_wtFileHandle;
				}
			}
			
			public System.IO.Stream rdFileHandle
			{
				get
				{
					if (m_rdFileHandle == null)
					{
						try
						{
							m_rdFileHandle = m_streamCache.LockReadFile(fileFullPath, true);
							//System.IO.File.Open(fileFullPath, System.IO.FileMode.Open, System.IO.FileAccess.Read, System.IO.FileShare.Read);
						}
						catch (System.IO.IOException)
						{
						}
					}
					return m_rdFileHandle;
				}
			}
			
			protected void FillMD5(string md5)
			{
				if ( !string.IsNullOrEmpty(fileMD5) )
					throw new System.Exception("Can't rewrite MD5");
				m_fileMD5 = md5;
			}
			
			public override bool AsyncRead(object usrData, long start, int rdLen, AsyncReadCallback readCallback)
			{
				if (fileState != RemoteFileState.FileDone)
					return false;
				if (m_rdFileHandle == null)
					this.Close();
				if (rdFileHandle == null)
				{
					readCallback(usrData, start, rdLen, null, 0);
					return true;
				}
				
				byte[] rdDat = new byte[rdLen];
				rdFileHandle.Seek(start, System.IO.SeekOrigin.Begin);
				rdFileHandle.BeginRead(rdDat, 0, rdLen, ((ar) =>
				                                         {
					int len = rdFileHandle.EndRead(ar);
					readCallback(ar.AsyncState, start, len, rdDat, 0);
				}), usrData);
				return true;
			}
			
			private class _DownloadCallbackInfo
			{
				public _DownloadCallbackInfo(System.DateTime timeout, object usrData, DownloadFinishHandle handle)
				{
					m_timeout = timeout;
					m_usrData = usrData;
					m_handle = handle;
				}
				
				public void Invoke(bool isDownloadOK, RemoteFileInfo rfi)
				{
					if (m_handle == null)
						return;
					m_handle(m_usrData, rfi, isDownloadOK);
					m_handle = null;
				}
				
				public bool Update(RemoteFileInfo rfi)
				{
					if (m_handle == null)
						return false;
					if (System.DateTime.Now > m_timeout)
						return true;
					m_handle(m_usrData, rfi, false);
					m_handle = null;
					return false;
				}
				
				public bool IsTimeout
				{
					get{ return System.DateTime.Now > m_timeout; }
				}
				
				System.DateTime m_timeout;
				object m_usrData;
				DownloadFinishHandle m_handle;
			}
			
			System.Collections.Generic.LinkedList<_DownloadCallbackInfo> m_downloadCallbackList;
			public override void OnDownloadFinish(System.DateTime timeout, object usrData, DownloadFinishHandle handle)
			{
				if (this.fileState == RemoteFileState.FileDone)
				{
					handle(usrData, this, true);
					return;
				}
				
				lock (this)
				{
					if (m_downloadCallbackList == null)
						m_downloadCallbackList = new System.Collections.Generic.LinkedList<_DownloadCallbackInfo>();
					m_downloadCallbackList.AddLast(new _DownloadCallbackInfo(timeout, usrData, handle));
				}
			}
			
			private void priv_invokeDownloadFinish(object usrData, bool isDownloadOK)
			{
				System.Collections.Generic.LinkedList<_DownloadCallbackInfo> downloadCallbackList = null;
				lock (this)
				{
					downloadCallbackList = m_downloadCallbackList;
					m_downloadCallbackList = null;
				}
				
				if (downloadCallbackList == null)
					return;
				for (var item = downloadCallbackList.First; item != null; item = item.Next)
					item.Value.Invoke(isDownloadOK, this);
			}
			
			private void priv_onFileDone()
			{
				System.Collections.Generic.LinkedList<_DownloadCallbackInfo> downloadCallbackList = null;
				lock (this)
				{
					downloadCallbackList = m_downloadCallbackList;
					m_downloadCallbackList = null;
				}
				
				if (downloadCallbackList != null)
				{
					for (var item = downloadCallbackList.First; item != null; item = item.Next)
					{
						item.Value.Invoke(true, this);
					}
				}
			}
			
			public void Update()
			{
				if (m_downloadCallbackList == null)
					return;
				System.Collections.Generic.LinkedList<_DownloadCallbackInfo> downloadCallbackList = null;
				
				lock (this)
				{
					if (m_downloadCallbackList == null)
						return;
					for (var item = m_downloadCallbackList.First; item != null; )
					{
						var oldItem = item;
						item = item.Next;
						if (oldItem.Value.IsTimeout)
						{
							if ( downloadCallbackList == null )
								downloadCallbackList = new System.Collections.Generic.LinkedList<_DownloadCallbackInfo>();
							downloadCallbackList.AddLast(oldItem.Value);
							m_downloadCallbackList.Remove(oldItem);
						}
					}
				}
				
				if (downloadCallbackList != null)
				{
					for (var item = downloadCallbackList.First; item != null; item = item.Next)
					{
						item.Value.Update(this);
					}
				}
			}
		}
		
		private static System.TimeSpan gm_flushConfigTime = new System.TimeSpan(0, 0, 30);
		
		private string m_rootPath;
		private StreamCache m_streamCache = new StreamCache(5);
		private System.Collections.Generic.Dictionary<string, _RemoteFileInfo>	_md5ToFileInfo = new System.Collections.Generic.Dictionary<string, _RemoteFileInfo>();
		private System.Collections.Generic.Dictionary<string, _RemoteFileInfo>	_keyToFileInfo = new System.Collections.Generic.Dictionary<string, _RemoteFileInfo>();
		private System.Collections.Generic.LinkedList<string>	_keyForNeedLoad = new System.Collections.Generic.LinkedList<string>();
		private System.Threading.AutoResetEvent _waitForLoadEvent;
		private System.Threading.Thread _workThread;
		private System.DateTime m_lastSaveConfigTime;
		private int _downloadFileCountAtOnce = 1;
		private int _activeDownloadQuery = 0;
		private bool m_isDisposed = false;
		private bool _isNeedExitThread = false;
		private bool m_isNeedSaveConfig = false;
		
		private string MakeMD5(string val)
		{
			//return val;
			return KBN._Global.GetMD5Hash(val);
		}
		
		public RemoteFileMgr(string rootPath)
		{
			m_rootPath = rootPath;
			priv_createFromPath(rootPath);
		}
		~RemoteFileMgr()
		{
			priv_doDispose(false);
		}
		
		public void Start()
		{
			if (_workThread != null)
				return;
			_waitForLoadEvent = new System.Threading.AutoResetEvent(false);
			System.Threading.Thread td = new System.Threading.Thread(priv_workingThread);
			td.Start();
			_workThread = td;
		}
		
		public RemoteFileInfo DownloadFile(string key, string urlWeb)
		{
			return DownloadFile(key, null, urlWeb);
		}
		
		public RemoteFileInfo DownloadFile(string key, string md5, string urlWeb)
		{
			string path = MakeMD5(key);
			_RemoteFileInfo fi = new _RemoteFileInfo(this.m_streamCache, this.m_rootPath, key, path, urlWeb, md5);
			_RemoteFileInfo old;
			lock(m_rootPath)
			{
				if ( !_keyToFileInfo.TryGetValue(key, out old) )
				{
					if ( !string.IsNullOrEmpty(md5) )
					{
						_md5ToFileInfo.Add(md5, fi);
					}
					
					_keyToFileInfo.Add(key, fi);
					_keyForNeedLoad.AddFirst(key);
					_waitForLoadEvent.Set();
					return fi;
				}
				
				if ( old.fileURLPath == urlWeb )
				{
					if (old.fileState == RemoteFileState.FileDone)
					{
						if (string.IsNullOrEmpty(md5) && string.IsNullOrEmpty(old.fileMD5))
							return old;
						if (!string.IsNullOrEmpty(md5) && !string.IsNullOrEmpty(old.fileMD5) && md5 == old.fileMD5)
							return old;
					}
				}
			}
			
			priv_reloadFile(old);
			return old;
		}
		
		public System.IAsyncResult BeginRead(string key, string usrDat, System.DateTime timeoutTime, System.AsyncCallback callBack)
		{
			return null;
		}
		#region ForDispose Methods
		public void Dispose()
		{
			priv_doDispose(true);
		}
		
		private void priv_doDispose(bool isDispose)
		{
			if (m_isDisposed)
				return;
			_isNeedExitThread = true;
			_waitForLoadEvent.Set();
			if (_activeDownloadQuery != 0)
				return;
			
			m_isDisposed = true;
			priv_tryStop();
			if (isDispose)
			{
				_md5ToFileInfo = null;
				_keyToFileInfo = null;
				_keyForNeedLoad = null;
			}
			
			if (_waitForLoadEvent != null)
			{
				_waitForLoadEvent.Dispose();
				_waitForLoadEvent = null;
			}
			System.GC.SuppressFinalize(this);
		}
		
		private bool priv_tryDoWork()
		{
			if (_isNeedExitThread)
				return false;
			System.Threading.Interlocked.Increment(ref _activeDownloadQuery);
			return true;
		}
		
		private bool priv_endDoWork(bool isNeedContinue)
		{
			if (!_isNeedExitThread && isNeedContinue)
				return true;
			
			int refCnt = System.Threading.Interlocked.Decrement(ref _activeDownloadQuery);
			if (refCnt > 0 )
				return false;
			if (_isNeedExitThread)
				priv_doDispose(false);
			return false;
		}
		
		private void priv_tryStop()
		{
			if (_workThread == null)
				return;
			_isNeedExitThread = true;
			_waitForLoadEvent.Set();
			_workThread.Join();
			lock (m_rootPath)
			{
				foreach (_RemoteFileInfo rfi in _keyToFileInfo.Values)
				{
					rfi.Close();
				}
			}
			
			priv_flushToEnverioment();
		}
		
		#endregion
		
		private void priv_reloadFile(_RemoteFileInfo rfi)
		{
			priv_delLoadFile(rfi);
			lock(m_rootPath)
			{
				var item = _keyForNeedLoad.First;
				for (; item != null; item = item.Next)
				{
					if (item.Value == rfi.fileKey)
					{
						_keyForNeedLoad.Remove(item);
						break;
					}
				}
				
				_keyForNeedLoad.AddFirst(rfi.fileKey);
				_waitForLoadEvent.Set();
			}
		}
		
		
		private void priv_delLoadFile(_RemoteFileInfo rfi)
		{
			rfi.fileDownloadSize = 0;
		}
		
		private void priv_createFromPath(string path)
		{
			if ( !System.IO.Directory.Exists(path) )
			{
				System.IO.Directory.CreateDirectory(path);
				priv_createDefaultDictionary();
				return;
			}
			
			if ( !System.IO.File.Exists(this.priv_GetDatFile()) )
			{
				priv_createDefaultDictionary();
				return;
			}
			
			priv_recoverEnverioment();
		}
		
		private void priv_createDefaultDictionary()
		{
			lock(m_rootPath)
			{
				if ( _md5ToFileInfo == null )
					_md5ToFileInfo = new System.Collections.Generic.Dictionary<string, _RemoteFileInfo>();
				if ( _keyToFileInfo == null )
					_keyToFileInfo = new System.Collections.Generic.Dictionary<string, _RemoteFileInfo>();
				if ( _keyForNeedLoad != null )
					_keyForNeedLoad = new System.Collections.Generic.LinkedList<string>();
			}
		}
		
		private string priv_GetDatFile()
		{
			return System.IO.Path.Combine(m_rootPath, ".fdb");
		}
		
		private string priv_GetDatBakFile()
		{
			return System.IO.Path.Combine(m_rootPath, "bak.fdb");
		}
		
		private void priv_recoverEnverioment()
		{
			string datFilePath = priv_GetDatFile();
			try
			{
				priv_readFromFile(datFilePath);
				return;
			}
			catch(System.Exception)
			{
			}

			//	need recover info from back file.
			try
			{
				string datBakFilePath = priv_GetDatBakFile();
				priv_readFromFile(datBakFilePath);
				System.IO.File.Copy(datBakFilePath, datFilePath, true);
				return;
			}
			catch(System.Exception)
			{
				throw;
			}
		}
		
		private void priv_workingThread()
		{
			while ( !_isNeedExitThread )
			{
				priv_doUpdate();
				if (_waitForLoadEvent.WaitOne(1000) != true)
				{
					continue;
				}
				
				if (System.Threading.Interlocked.Decrement(ref _downloadFileCountAtOnce) < 0)
				{
					priv_finishFileDownload(false);
					continue;
				}
				
				_RemoteFileInfo rfi;
				if (!priv_getNextNeedLoadFile(out rfi))
				{
					priv_finishFileDownload(false);
					continue;
				}
				priv_downloadAtURL(rfi, rfi.fileURLPath);
			}
		}
		
		private void priv_doUpdate()
		{
			System.Collections.Generic.LinkedList<_RemoteFileInfo> rfiList;
			lock (this.m_rootPath)
			{
				if (_keyToFileInfo.Count == 0)
					return;
				rfiList = new System.Collections.Generic.LinkedList<_RemoteFileInfo>();
				foreach (_RemoteFileInfo rfi in _keyToFileInfo.Values)
				{
					rfiList.AddLast(rfi);
				}
			}
			
			for (var item = rfiList.First; item != null; item = item.Next)
			{
				item.Value.Update();
			}
			
			if (m_isNeedSaveConfig && (System.DateTime.Now - m_lastSaveConfigTime) > gm_flushConfigTime)
			{
				m_isNeedSaveConfig = false;
				priv_flushToEnverioment();
				m_lastSaveConfigTime = System.DateTime.Now;
			}
		}
		
		private void priv_finishFileDownload(bool sig)
		{
			System.Threading.Interlocked.Increment(ref _downloadFileCountAtOnce);
			if (sig && this._waitForLoadEvent != null)
				_waitForLoadEvent.Set();
		}
		
		private void priv_downloadAtURL(_RemoteFileInfo rfi, string url)
		{
			try
			{
				rfi._asyncFileInfo = new _AsyncFileInfo();
				if (!priv_tryDoWork())
					return;
				rfi._asyncFileInfo._asyncFL = new AsyncLoader.AsyncWebHttpFileLoader(url);
				rfi._asyncFileInfo._asyncResult = rfi._asyncFileInfo._asyncFL.BeginRead(rfi.fileDownloadSize, -1, rfi, priv_asyncDownloadFile);
			}
			catch (System.Net.WebException)
			{
				rfi.fileState = RemoteFileState.FileLoadLost;
				rfi.lastDownloadTime = System.DateTime.Now;
				priv_finishFileDownload(true);
				priv_endDoWork(true);
			}
		}
		
		private bool priv_asyncDownloadFile(System.IAsyncResult result)
		{
			bool rtv = priv_flushToFile(result);
			return priv_endDoWork(rtv);
		}
		
		private bool priv_flushToFile(System.IAsyncResult result)
		{
			var rfi = (_RemoteFileInfo)result.AsyncState;
			rfi.lastDownloadTime = System.DateTime.Now;
			if (rfi.fileTotalSize < 0)
				rfi.fileTotalSize = rfi._asyncFileInfo._asyncFL.Size;
			
			var len = rfi._asyncFileInfo._asyncFL.EndRead(result);
			if (len < 0)
			{
				rfi.fileState = RemoteFileState.FileLoadLost;
				priv_sendToLastDownloadQueue(rfi);
				priv_finishFileDownload(true);
				return false;
			}
			
			if (rfi.wtFileHandle == null)
			{
				rfi.fileState = RemoteFileState.FileDownloading;
				priv_sendToLastDownloadQueue(rfi);
				priv_finishFileDownload(true);
				return false;
			}
			
			long startPos = rfi._asyncFileInfo._asyncFL.StartPos(result);
			var datBuf = rfi._asyncFileInfo._asyncFL.DataBuffer(result);
			if (len != 0)
			{
				rfi.fileDownloadSize = startPos + len;
				rfi.wtFileHandle.Seek(startPos, System.IO.SeekOrigin.Begin);
				rfi.wtFileHandle.Write(datBuf, 0, len);
				rfi.wtFileHandle.Flush();
				//rfi.Close();
				rfi.lastDownloadTime = System.DateTime.Now;
				rfi.lastUpdateTime = System.DateTime.Now;
				m_isNeedSaveConfig = true;
				return true;
			}
			
			if (rfi.fileTotalSize > 0)
			{
				if (rfi.fileTotalSize != rfi.fileDownloadSize)
				{   //  error and send to list end
					priv_sendToLastDownloadQueue(rfi);
					_waitForLoadEvent.Set();
					priv_finishFileDownload(true);
					return false;
				}
				//  finish.
			}
			
			rfi.fileTotalSize = rfi.fileDownloadSize;
			rfi.fileState = RemoteFileState.FileDone;
			priv_finishFileDownload(true);
			m_lastSaveConfigTime = new System.DateTime(0);
			m_isNeedSaveConfig = true;
			return false;
		}
		
		private void priv_sendToLastDownloadQueue(_RemoteFileInfo rfi)
		{
			rfi._asyncFileInfo = null;
			rfi.lastDownloadTime = System.DateTime.Now;
			var key = rfi.fileKey;
			lock (m_rootPath)
			{
				
				for (var iter = _keyForNeedLoad.First; iter != null; iter = iter.Next)
				{
					if (iter.Value != key)
						continue;
					_keyForNeedLoad.Remove(iter);
					break;
				}
				_keyForNeedLoad.AddLast(key);
			}
		}
		
		private bool priv_getNextNeedLoadFile(out _RemoteFileInfo rfi)
		{
			rfi = null;
			for ( int i = 0; i != _keyForNeedLoad.Count; ++i )
			{
				lock (m_rootPath)
				{
					if (_keyForNeedLoad.Count == 0)
						return false;
					
					if (!this._keyToFileInfo.TryGetValue(_keyForNeedLoad.First.Value, out rfi))
					{
						_keyForNeedLoad.RemoveFirst();
						continue;
					}
					
					if (rfi._asyncFileInfo != null)
					{
						priv_cycleShift();
						continue;
					}
					
					if (rfi.fileState == RemoteFileState.FileLoadLost && (System.DateTime.Now - rfi.lastDownloadTime).TotalSeconds < 30 )
					{
						priv_cycleShift();
						continue;
					}
					return true;
				}
			}
			return false;
		}
		
		private void priv_cycleShift()
		{
			var first = _keyForNeedLoad.First;
			_keyForNeedLoad.RemoveFirst();
			_keyForNeedLoad.AddLast(first);
		}
		
		private void priv_readFromFile(string datFile)
		{
			System.IO.FileStream fs = System.IO.File.OpenRead(datFile);
			using ( fs )
			{
				var binFile = new System.IO.BinaryReader(fs);
				using ( binFile )
				{
					var md5ToFileInfo = new System.Collections.Generic.Dictionary<string, _RemoteFileInfo>();
					var keyToFileInfo = new System.Collections.Generic.Dictionary<string, _RemoteFileInfo>();
					var keyForNeedLoad = new System.Collections.Generic.LinkedList<string>();
					int fileCnt = binFile.ReadInt32();
					for ( int i = 0; i != fileCnt; ++i )
					{
						_RemoteFileInfo fi = priv_readFileInfo(binFile);
						keyToFileInfo.Add(fi.fileKey, fi);
						if ( !string.IsNullOrEmpty(fi.fileMD5) )
							md5ToFileInfo.Add(fi.fileMD5, fi);
						if ( fi.fileState == RemoteFileState.FileWaiting || fi.fileState == RemoteFileState.FileDownloading )
							keyForNeedLoad.AddLast(fi.fileKey);
					}
					
					lock(m_rootPath)
					{
						_md5ToFileInfo = md5ToFileInfo;
						_keyToFileInfo = keyToFileInfo;
						_keyForNeedLoad = keyForNeedLoad;
					}
					
					m_lastSaveConfigTime = System.DateTime.Now;
				}
			}
		}
		
		private void priv_flushToEnverioment()
		{
			string datFilePath = priv_GetDatFile();
			priv_writeToFile(datFilePath);
		}
		
		private void priv_writeToFile(string datFile)
		{
			if (System.IO.File.Exists(datFile))
				System.IO.File.Copy(datFile, priv_GetDatBakFile(), true);
			
			System.IO.FileStream fs = System.IO.File.OpenWrite(datFile);
			using (fs)
			{
				var binFile = new System.IO.BinaryWriter(fs);
				using (binFile)
				{
					lock (m_rootPath)
					{
						int fileCnt = this._keyToFileInfo.Count;
						binFile.Write(fileCnt);
						foreach (_RemoteFileInfo rfi in _keyToFileInfo.Values)
						{
							priv_writeFileInfo(rfi, binFile);
						}
					}
				}
			}
		}
		
		private _RemoteFileInfo priv_readFileInfo(System.IO.BinaryReader fs)
		{
			string fileKey = fs.ReadString();
			string fileLocalPath = fs.ReadString();
			string fileURLPath = fs.ReadString();
			string fileMD5 = fs.ReadString();
			
			_RemoteFileInfo fi = new _RemoteFileInfo(
				this.m_streamCache,
				this.m_rootPath,
				fileKey,
				fileLocalPath,
				fileURLPath,
				fileMD5
				);
			
			fi.fileTotalSize = fs.ReadInt64();
			fi.fileDownloadSize = fs.ReadInt64();
			fi.fileValidTime = fs.ReadInt64();
			fi.remoteLifeType = (RemoteLifeType)fs.ReadByte();
			fi.fileState = (RemoteFileState)fs.ReadByte();
			fi.lastDownloadTime = priv_readDateTime(fs);
			fi.lastUseageTime = priv_readDateTime(fs);
			fi.lastUpdateTime = priv_readDateTime(fs);
			//fi.wtFileHandle = null;
			//fi._webRequest = null;
			return fi;
		}
		
		private void priv_writeFileInfo(_RemoteFileInfo fi, System.IO.BinaryWriter fs)
		{
			fs.Write(fi.fileKey);
			fs.Write(fi.fileLocalPath);
			fs.Write(fi.fileURLPath);
			fs.Write(fi.fileMD5);
			
			fs.Write(fi.fileTotalSize);
			fs.Write(fi.fileDownloadSize);
			fs.Write(fi.fileValidTime);
			fs.Write((byte)fi.remoteLifeType);
			fs.Write((byte)fi.fileState);
			priv_writeDateTime(fi.lastDownloadTime, fs);
			priv_writeDateTime(fi.lastUseageTime, fs);
			priv_writeDateTime(fi.lastUpdateTime, fs);
			//fi.wtFileHandle = null;
			//fi._webRequest = null;
		}
		
		private System.DateTime priv_readDateTime(System.IO.BinaryReader fs)
		{
			long dat = fs.ReadInt64();
			return new System.DateTime(dat);
		}
		
		private void priv_writeDateTime(System.DateTime dt, System.IO.BinaryWriter fs)
		{
			fs.Write(dt.Ticks);
		}
	}
}