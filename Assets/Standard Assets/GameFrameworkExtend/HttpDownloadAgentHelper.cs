//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using System;
using System.IO;
using System.Net;
using GameFramework;

namespace KBN
{
    /// <summary>
    /// HTTP 下载代理辅助器。
    /// </summary>
    public class HttpDownloadAgentHelper : DownloadAgentHelper
    {
        RequestState m_RequestState = null;
        private int m_DownloadedSize = 0;

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
            try
            {
                m_RequestState = new RequestState();
                HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(uri);
                m_RequestState.Request = httpWebRequest;
                httpWebRequest.BeginGetResponse(new AsyncCallback(ResponseCallback), null);
            }
            catch (Exception ex)
            {
                DownloadAgentHelperError(this, new DownloadAgentHelperErrorEventArgs(ex.Message));
            }
        }

        /// <summary>
        /// 通过下载代理辅助器下载指定地址的数据。
        /// </summary>
        /// <param name="uri">下载地址。</param>
        /// <param name="fromPosition">下载数据起始位置。</param>
        public override void Download(string uri, int fromPosition)
        {
            try
            {
                m_RequestState = new RequestState();
                HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(uri);
                httpWebRequest.AddRange(fromPosition);
                m_RequestState.Request = httpWebRequest;
                httpWebRequest.BeginGetResponse(new AsyncCallback(ResponseCallback), null);
            }
            catch (Exception ex)
            {
                DownloadAgentHelperError(this, new DownloadAgentHelperErrorEventArgs(ex.Message));
            }
        }

        /// <summary>
        /// 通过下载代理辅助器下载指定地址的数据。
        /// </summary>
        /// <param name="uri">下载地址。</param>
        /// <param name="fromPosition">下载数据起始位置。</param>
        /// <param name="toPosition">下载数据结束位置。</param>
        public override void Download(string uri, int fromPosition, int toPosition)
        {
            try
            {
                m_RequestState = new RequestState();
                HttpWebRequest httpWebRequest = (HttpWebRequest)WebRequest.Create(uri);
                httpWebRequest.AddRange(fromPosition, toPosition);
                m_RequestState.Request = httpWebRequest;
                httpWebRequest.BeginGetResponse(new AsyncCallback(ResponseCallback), null);
            }
            catch (Exception ex)
            {
                DownloadAgentHelperError(this, new DownloadAgentHelperErrorEventArgs(ex.Message));
            }
        }

        /// <summary>
        /// 重置下载代理辅助器。
        /// </summary>
        public override void Reset()
        {
            if (m_RequestState != null)
            {
                if (m_RequestState.Request != null)
                {
                    m_RequestState.Request.Abort();
                }

                if (m_RequestState.Response != null)
                {
                    m_RequestState.Response.Close();
                }

                if (m_RequestState.StreamResponse != null)
                {
                    m_RequestState.StreamResponse.Dispose();
                }

                m_RequestState = null;
                m_DownloadedSize = 0;
            }
        }

        private void Update()
        {

        }

        private void ResponseCallback(IAsyncResult asyncResult)
        {
            try
            {
                HttpWebRequest httpWebRequest = m_RequestState.Request;
                m_RequestState.Response = (HttpWebResponse)httpWebRequest.EndGetResponse(asyncResult);

                Stream responseStream = m_RequestState.Response.GetResponseStream();
                m_RequestState.StreamResponse = responseStream;

                responseStream.BeginRead(m_RequestState.BufferRead, 0, RequestState.BufferSize, new AsyncCallback(ReadCallBack), null);
            }
            catch (Exception ex)
            {
                DownloadAgentHelperError(this, new DownloadAgentHelperErrorEventArgs(ex.Message));
            }
        }

        private void ReadCallBack(IAsyncResult asyncResult)
        {
            try
            {
                Stream responseStream = m_RequestState.StreamResponse;
                int bytesRead = responseStream.EndRead(asyncResult);
                if (bytesRead > 0)
                {
                    m_DownloadedSize += bytesRead;
                    if (bytesRead == RequestState.BufferSize)
                    {
                        DownloadAgentHelperUpdate(this, new DownloadAgentHelperUpdateEventArgs(m_DownloadedSize, m_RequestState.BufferRead));
                    }
                    else
                    {
                        byte[] bytes = new byte[bytesRead];
                        Buffer.BlockCopy(m_RequestState.BufferRead, 0, bytes, 0, bytesRead);
                        DownloadAgentHelperUpdate(this, new DownloadAgentHelperUpdateEventArgs(m_DownloadedSize, bytes));
                    }

                    responseStream.BeginRead(m_RequestState.BufferRead, 0, RequestState.BufferSize, new AsyncCallback(ReadCallBack), null);
                }
                else
                {
                    responseStream.Close();
                    DownloadAgentHelperComplete(this, new DownloadAgentHelperCompleteEventArgs(m_DownloadedSize, null));
                }
            }
            catch (Exception ex)
            {
                DownloadAgentHelperError(this, new DownloadAgentHelperErrorEventArgs(ex.Message));
            }
        }

        private class RequestState
        {
            public const int BufferSize = 1024 * 128;

            public byte[] BufferRead
            {
                get;
                private set;
            }

            public HttpWebRequest Request
            {
                get;
                set;
            }

            public HttpWebResponse Response
            {
                get;
                set;
            }

            public Stream StreamResponse
            {
                get;
                set;
            }

            public RequestState()
            {
                BufferRead = new byte[BufferSize];
                Request = null;
                Response = null;
                StreamResponse = null;
            }
        }
    }
}
