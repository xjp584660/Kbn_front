//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

namespace GameFramework
{
    /// <summary>
    /// 下载失败事件。
    /// </summary>
    public class DownloadFailureEventArgs : FrameworkEventArgs
    {
        /// <summary>
        /// 初始化下载失败事件的新实例。
        /// </summary>
        /// <param name="serialId">下载任务序列编号。</param>
        /// <param name="downloadPath">下载后存放路径。</param>
        /// <param name="downloadUri">下载地址。</param>
        /// <param name="errorMessage">错误信息。</param>
        /// <param name="userData">用户自定义数据。</param>
        public DownloadFailureEventArgs(int serialId, string downloadPath, string downloadUri, string errorMessage, object userData)
        {
            SerialId = serialId;
            DownloadPath = downloadPath;
            DownloadUri = downloadUri;
            ErrorMessage = errorMessage;
            UserData = userData;
        }

        /// <summary>
        /// 获取下载任务序列编号。
        /// </summary>
        public int SerialId
        {
            get;
            private set;
        }

        /// <summary>
        /// 获取下载后存放路径。
        /// </summary>
        public string DownloadPath
        {
            get;
            private set;
        }

        /// <summary>
        /// 获取下载地址。
        /// </summary>
        public string DownloadUri
        {
            get;
            private set;
        }

        /// <summary>
        /// 获取错误信息。
        /// </summary>
        public string ErrorMessage
        {
            get;
            private set;
        }

        /// <summary>
        /// 获取用户自定义数据。
        /// </summary>
        public object UserData
        {
            get;
            private set;
        }
    }
}
