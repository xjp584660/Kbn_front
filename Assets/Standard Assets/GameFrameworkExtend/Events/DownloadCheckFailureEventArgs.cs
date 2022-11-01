using GameFramework;

namespace KBN
{
	public class DownloadCheckFailureEventArgs : GameEventArgs
	{
		public DownloadCheckFailureEventArgs(string _downloadPath, string downloadUri, string _errorMsg, string _userData)
		{
			DownloadPath = _downloadPath;
			DownloadUri = downloadUri;
			ErrorMessage = _errorMsg;
			UserData = _userData;
		}
		
		public override int Id
		{
			get
			{
				return (int)EventId.DownloadCheckFailure;
			}
		}
		
		public string DownloadPath
		{
			get;
			private set;
		}
		
		public string DownloadUri
		{
			get;
			private set;
		}

		public string ErrorMessage
		{
			get;
			private set;
		}
		
		public object UserData
		{
			get;
			private set;
		}
	}
}
