//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using System;
using System.Collections;
using System.Collections.Generic;
using GameFramework;
using UnityEngine;

namespace KBN
{
    /// <summary>
    /// WWW 下载代理辅助器。
    /// </summary>
    public class WWWDownloadAgentHelper : DownloadAgentHelper
    {
        private WWW m_WWW = null;
        private int m_LastDownloadedSize = 0;

        /// <summary>
        /// 下载代理辅助器更新事件。
        /// </summary>
        public override event EventHandler<DownloadAgentHelperUpdateEventArgs> DownloadAgentHelperUpdate = null;

        /// <summary>
        /// 下载代理辅助器完成事件。
        /// </summary>
        public override event EventHandler<DownloadAgentHelperCompleteEventArgs> DownloadAgentHelperComplete = null;

        /// <summary>
        /// 下载代理辅助器错误事件。
        /// </summary>
        public override event EventHandler<DownloadAgentHelperErrorEventArgs> DownloadAgentHelperError = null;

        /// <summary>
        /// 通过下载代理辅助器下载指定地址的数据。
        /// </summary>
        /// <param name="uri">下载地址。</param>
        public override void Download(string uri)
        {
            m_WWW = new WWW(uri);
        }

        /// <summary>
        /// 通过下载代理辅助器下载指定地址的数据。
        /// </summary>
        /// <param name="uri">下载地址。</param>
        /// <param name="fromPosition">下载数据起始位置。</param>
        public override void Download(string uri, int fromPosition)
        {
            Hashtable header = new Hashtable();
            //Dictionary<string, string> header = new Dictionary<string, string>();
            header.Add("Range", string.Format("bytes={0}-", fromPosition.ToString()));
            m_WWW = new WWW(uri, null, header);
        }

        /// <summary>
        /// 通过下载代理辅助器下载指定地址的数据。
        /// </summary>
        /// <param name="uri">下载地址。</param>
        /// <param name="fromPosition">下载数据起始位置。</param>
        /// <param name="toPosition">下载数据结束位置。</param>
        public override void Download(string uri, int fromPosition, int toPosition)
        {
            Hashtable header = new Hashtable();
            //Dictionary<string, string> header = new Dictionary<string, string>();
            header.Add("Range", string.Format("bytes={0}-{1}", fromPosition.ToString(), toPosition.ToString()));
            m_WWW = new WWW(uri, null, header);
        }

        /// <summary>
        /// 重置下载代理辅助器。
        /// </summary>
        public override void Reset()
        {
            if (m_WWW != null)
            {
                m_WWW.Dispose();
                m_WWW = null;
            }

            m_LastDownloadedSize = 0;
        }

        private void Update()
        {
            if (m_WWW == null)
            {
                return;
            }

            if (!m_WWW.isDone)
            {
                if (m_LastDownloadedSize < m_WWW.bytesDownloaded)
                {
                    m_LastDownloadedSize = m_WWW.bytesDownloaded;
                    DownloadAgentHelperUpdate(this, new DownloadAgentHelperUpdateEventArgs(m_WWW.bytesDownloaded, null));
                }

                return;
            }

            if (!string.IsNullOrEmpty(m_WWW.error))
            {
                if (m_WWW.error.Length >= 3 && m_WWW.error.Substring(0, 3) == "416") // "416 Requested Range Not Satisfiable" is all right.
                {
                    DownloadAgentHelperComplete(this, new DownloadAgentHelperCompleteEventArgs(0, null));
                }
                else
                {
                    DownloadAgentHelperError(this, new DownloadAgentHelperErrorEventArgs(m_WWW.error));
                }
            }
            else
            {
                DownloadAgentHelperComplete(this, new DownloadAgentHelperCompleteEventArgs(m_WWW.bytesDownloaded, m_WWW.bytes));
            }
        }
    }
}
