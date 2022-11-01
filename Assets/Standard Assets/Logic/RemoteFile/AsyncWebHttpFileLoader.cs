
namespace RemoteFile.AsyncLoader
{
	public class AsyncWebHttpFileLoader
		: IAsyncFileLoader, System.IDisposable
	{
		private class _ResponseInfo
			: System.IDisposable, System.IAsyncResult
		{
			private const int gm_binDataBufferSize = 65536;
			private System.Net.HttpWebRequest m_webRequest;
			private System.Net.HttpWebResponse m_webResponse;
			private bool m_isDisposed;
			private byte[] m_binData;

			public System.IO.Stream _asyncStream;

			public int httpCode = 200;
			public long start;
			public int end;
			public object usrDat;
			public AsyncReaderHandle readHandle;

			public int seekFromBegin = 0;
			public int rdLen = 0;

			#region System.IAsyncResult
			public object AsyncState{get{ return usrDat; }}
			public System.Threading.WaitHandle AsyncWaitHandle{get{return null;}}
			public bool CompletedSynchronously	{get{ return false; }}
			public bool IsCompleted
			{
				get
				{
					return _asyncStream != null;
				}
			}
			#endregion
			public _ResponseInfo(long in_start, int in_end, object in_usrDat, AsyncReaderHandle in_callBack)
			{
				start = in_start;
				end = in_end;
				usrDat = in_usrDat;
				readHandle = in_callBack;
			}

			~_ResponseInfo()
			{
				this.priv_doDispose(false);
			}

			public System.Net.HttpWebRequest _webRequest
			{
				get{ return m_webRequest; }
				set
				{
					_endLastActiveTime = System.DateTime.Now;
					m_webRequest = value;
				}
			}

			public System.DateTime _endLastActiveTime;
			public System.Net.HttpWebResponse _webResponse
			{
				get{ return m_webResponse; }
				set
				{
					_endLastActiveTime = System.DateTime.Now;
					m_webResponse = value;
				}
			}

			public void Dispose()
			{
				priv_doDispose(true);
			}

			private void priv_doDispose(bool isDispose)
			{
				if (m_isDisposed)
					return;

				m_isDisposed = true;
				if (isDispose)
				{
					m_binData = null;
					m_webRequest = null;
				}

				if (m_webResponse != null)
				{
					m_webResponse.Dispose();
					m_webResponse = null;
				}

				if (_asyncStream != null)
				{
					_asyncStream.Flush();
					_asyncStream.Dispose();
					_asyncStream = null;
				}
				System.GC.SuppressFinalize(this);
			}

			public byte[] _binData
			{
				get
				{
					if (m_binData == null)
						m_binData = new byte[gm_binDataBufferSize];
					return m_binData;
				}
			}
		}

		private readonly string m_url;
		private long m_contentLength = -1;
		public AsyncWebHttpFileLoader(string path)
		{
			m_url = path;
		}

		~AsyncWebHttpFileLoader()
		{
			priv_doDispose(false);
		}

		public void Dispose()
		{
			priv_doDispose(true);
		}

		private void priv_doDispose(bool isDispose)
		{
			System.GC.SuppressFinalize(this);
		}

		#region AsyncLoader.IAsyncFileLoader
		public System.IAsyncResult BeginRead(long start, int end, object usrDat, AsyncReaderHandle callBack)
		{
			_ResponseInfo rInfo = new _ResponseInfo(start, end, usrDat, callBack);
			priv_downloadAtURL(rInfo, m_url);
			return rInfo;
		}
		public long Size{get{ return m_contentLength; }}
		public int EndRead(System.IAsyncResult result)
		{
			return (result as _ResponseInfo).rdLen;
		}

		public long StartPos(System.IAsyncResult result)
		{
			var rInfo = result as _ResponseInfo;
			return rInfo.start + rInfo.seekFromBegin;
		}

		public byte[] DataBuffer(System.IAsyncResult result)
		{
			return (result as _ResponseInfo)._binData;
		}
		#endregion

		private void priv_downloadAtURL(_ResponseInfo rInfo, string url)
		{
			try
			{
				System.Net.HttpWebRequest httpRequest =
					(System.Net.HttpWebRequest)System.Net.HttpWebRequest.Create(url);

				rInfo._webRequest = httpRequest;
				if ( rInfo.start != 0 )
				{
					if ( rInfo.end < 0 )
						rInfo._webRequest.AddRange(rInfo.start);
					else
						rInfo._webRequest.AddRange(rInfo.start, rInfo.end);
				}

				httpRequest.Timeout = 15000;
				httpRequest.AllowAutoRedirect = true;
				httpRequest.BeginGetResponse(priv_asyncGetRespond, rInfo);
			}
			catch(System.Net.WebException)
			{
				throw;
			}
		}

		private void priv_asyncGetRespond(System.IAsyncResult result)
		{
			_ResponseInfo rInfo = (_ResponseInfo)result.AsyncState;

			System.Net.HttpWebResponse webResponse = null;
			try
			{
				webResponse = (System.Net.HttpWebResponse)rInfo._webRequest.EndGetResponse(result);
				m_contentLength = webResponse.ContentLength;
			}
			catch(System.Net.WebException)
			{
				rInfo.rdLen = -1;
				rInfo.readHandle(rInfo);
				rInfo.Dispose();
				return;
			}

			rInfo._webResponse = webResponse;
			var code = webResponse.StatusCode;
			switch ((int)code / 100)
			{
				case 2:
					break;
				case 3:
					if (code == System.Net.HttpStatusCode.Redirect)
					{   //  302
						var newPath = webResponse.GetResponseHeader("Location");
						priv_downloadAtURL(rInfo, newPath);
							return;
					}
					goto default;

				default:
					rInfo.httpCode = (int)code;
					rInfo.readHandle(rInfo);
					//priv_sendToLastDownloadQueue(rInfo);
					return;
			}

			//  206
			if (code != System.Net.HttpStatusCode.PartialContent)  //  partical respond, the server don't support range.
			{
				rInfo.start = 0;
			}
			else
			{
				//webResponse.GetResponseHeader("CONTENT-RANGE");
			}
			var rdStream = webResponse.GetResponseStream();
			rInfo._asyncStream = rdStream;
			rdStream.BeginRead(rInfo._binData, 0, rInfo._binData.Length, priv_asyncDownloadFile, rInfo);
		}

		private void priv_asyncDownloadFile(System.IAsyncResult result)
		{
			var rInfo = (_ResponseInfo)result.AsyncState;
			var len = rInfo._asyncStream.EndRead(result);
			rInfo.rdLen = len;
			if (!rInfo.readHandle(rInfo) || len == 0 || (rInfo.end >= 0 && rInfo.end - rInfo.start <= len) )
			{
				rInfo.Dispose();
				return;
			}

			rInfo.seekFromBegin += len;
			rInfo.rdLen = 0;

			rInfo._asyncStream.BeginRead(rInfo._binData, 0, rInfo._binData.Length, priv_asyncDownloadFile, rInfo);
		}
	}
}
	