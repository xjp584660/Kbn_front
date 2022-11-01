//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using System;

namespace GameFramework
{
    /// <summary>
    /// 下载代理辅助器接口。
    /// </summary>
    public interface IDownloadAgentHelper
    {
        /// <summary>
        /// 下载代理辅助器更新事件。
        /// </summary>
        event EventHandler<DownloadAgentHelperUpdateEventArgs> DownloadAgentHelperUpdate;

        /// <summary>
        /// 下载代理辅助器完成事件。
        /// </summary>
        event EventHandler<DownloadAgentHelperCompleteEventArgs> DownloadAgentHelperComplete;

        /// <summary>
        /// 下载代理辅助器错误事件。
        /// </summary>
        event EventHandler<DownloadAgentHelperErrorEventArgs> DownloadAgentHelperError;

        /// <summary>
        /// 通过下载代理辅助器下载指定地址的数据。
        /// </summary>
        /// <param name="uri">下载地址。</param>
        void Download(string uri);

        /// <summary>
        /// 通过下载代理辅助器下载指定地址的数据。
        /// </summary>
        /// <param name="uri">下载地址。</param>
        /// <param name="fromPosition">下载数据起始位置。</param>
        void Download(string uri, int fromPosition);

        /// <summary>
        /// 通过下载代理辅助器下载指定地址的数据。
        /// </summary>
        /// <param name="uri">下载地址。</param>
        /// <param name="fromPosition">下载数据起始位置。</param>
        /// <param name="toPosition">下载数据结束位置。</param>
        void Download(string uri, int fromPosition, int toPosition);

        /// <summary>
        /// 重置下载代理辅助器。
        /// </summary>
        void Reset();
    }
}
