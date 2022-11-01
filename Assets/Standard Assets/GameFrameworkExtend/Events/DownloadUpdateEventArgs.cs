//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using GameFramework;

namespace KBN
{
    public class DownloadUpdateEventArgs : GameEventArgs
    {
        public DownloadUpdateEventArgs(GameFramework.DownloadUpdateEventArgs e)
        {
            SerialId = e.SerialId;
            DownloadPath = e.DownloadPath;
            DownloadUri = e.DownloadUri;
            CurrentLength = e.CurrentLength;
            UserData = e.UserData;
        }

        public override int Id
        {
            get
            {
                return (int)EventId.DownloadUpdate;
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

        public int CurrentLength
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
