//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

namespace GameFramework
{
    /// <summary>
    ///  下载代理辅助器错误事件。
    /// </summary>
    public class DownloadAgentHelperErrorEventArgs : FrameworkEventArgs
    {
        /// <summary>
        /// 初始化下载代理辅助器错误的新实例。
        /// </summary>
        /// <param name="errorMessage">错误信息。</param>
        public DownloadAgentHelperErrorEventArgs(string errorMessage)
        {
            ErrorMessage = errorMessage;
        }

        /// <summary>
        /// 获取错误信息。
        /// </summary>
        public string ErrorMessage
        {
            get;
            private set;
        }
    }
}
