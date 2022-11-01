//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using GameFramework;

namespace KBN
{
    public class DownloadFailureEventArgs : GameEventArgs
    {
        public DownloadFailureEventArgs(GameFramework.DownloadFailureEventArgs e)
        {
            SerialId = e.SerialId;
            DownloadPath = e.DownloadPath;
            DownloadUri = e.DownloadUri;
            ErrorMessage = e.ErrorMessage;
            UserData = e.UserData;
        }

        public override int Id
        {
            get
            {
                return (int)EventId.DownloadFailure;
            }
        }

        public int SerialId
        {
            get;
            private set;
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
