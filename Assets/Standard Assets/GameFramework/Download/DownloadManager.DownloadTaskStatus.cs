//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

namespace GameFramework
{
    internal partial class DownloadManager
    {
        /// <summary>
        /// 下载任务状态。
        /// </summary>
        private enum DownloadTaskStatus
        {
            /// <summary>
            /// 准备下载。
            /// </summary>
            Todo,
            /// <summary>
            /// 下载中。
            /// </summary>
            Doing,
            /// <summary>
            /// 下载完成。
            /// </summary>
            Done,
            /// <summary>
            /// 下载错误。
            /// </summary>
            Error
        }
    }
}
