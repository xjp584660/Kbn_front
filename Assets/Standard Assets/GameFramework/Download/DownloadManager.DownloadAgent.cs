//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using System;
using System.IO;

namespace GameFramework
{
    internal partial class DownloadManager
    {
        /// <summary>
        /// 下载代理。
        /// </summary>
        private class DownloadAgent : ITaskAgent<DownloadTask>, IDisposable
        {
            private readonly IDownloadAgentHelper m_Helper;
            private DownloadTask m_Task;
            private FileStream m_FileStream;
            private int m_WaitFlushSize;
            private float m_WaitTime;
            private int m_StartLength;
            private int m_DownloadedLength;
            private int m_SavedLength;
            private bool m_Disposed;

            public Action<DownloadAgent> DownloadAgentStart;
            public Action<DownloadAgent> DownloadAgentUpdate;
            public Action<DownloadAgent> DownloadAgentSuccess;
            public Action<DownloadAgent, string> DownloadAgentFailure;

            /// <summary>
            /// 初始化下载代理的新实例。
            /// </summary>
            /// <param name="downloadAgentHelper">下载代理辅助器。</param>
            public DownloadAgent(IDownloadAgentHelper downloadAgentHelper)
            {
                if (downloadAgentHelper == null)
                {
                    throw new FrameworkException("Download agent helper is invalid.");
                }

                m_Helper = downloadAgentHelper;
                m_Task = null;
                m_FileStream = null;
                m_WaitFlushSize = 0;
                m_WaitTime = 0f;
                m_StartLength = 0;
                m_DownloadedLength = 0;
                m_SavedLength = 0;
                m_Disposed = false;

                DownloadAgentStart = null;
                DownloadAgentUpdate = null;
                DownloadAgentSuccess = null;
                DownloadAgentFailure = null;
            }

            /// <summary>
            /// 获取下载任务。
            /// </summary>
            public DownloadTask Task
            {
                get
                {
                    return m_Task;
                }
            }

            /// <summary>
            /// 获取已经等待时间。
            /// </summary>
            public float WaitTime
            {
                get
                {
                    return m_WaitTime;
                }
            }

            /// <summary>
            /// 获取开始下载时已经存在的大小。
            /// </summary>
            public int StartLength
            {
                get
                {
                    return m_StartLength;
                }
            }

            /// <summary>
            /// 获取本次已经下载的大小。
            /// </summary>
            public int DownloadedLength
            {
                get
                {
                    return m_DownloadedLength;
                }
            }

            /// <summary>
            /// 获取当前的大小。
            /// </summary>
            public int CurrentLength
            {
                get
                {
                    return m_StartLength + m_DownloadedLength;
                }
            }

            /// <summary>
            /// 获取已经存盘的大小。
            /// </summary>
            public long SavedLength
            {
                get
                {
                    return m_SavedLength;
                }
            }

            /// <summary>
            /// 初始化下载代理。
            /// </summary>
            public void Init()
            {
                m_Helper.DownloadAgentHelperUpdate += OnDownloadAgentHelperUpdate;
                m_Helper.DownloadAgentHelperComplete += OnDownloadAgentHelperComplete;
                m_Helper.DownloadAgentHelperError += OnDownloadAgentHelperError;
            }

            /// <summary>
            /// 下载代理轮询。
            /// </summary>
            /// <param name="elapseSeconds">逻辑流逝时间，以秒为单位。</param>
            /// <param name="realElapseSeconds">真实流逝时间，以秒为单位。</param>
            public void Update(float elapseSeconds, float realElapseSeconds)
            {
                if (m_Task.Status == DownloadTaskStatus.Doing)
                {
                    m_WaitTime += realElapseSeconds;
                    if (m_WaitTime >= m_Task.TimeOut)
                    {
                        OnDownloadAgentHelperError(this, new DownloadAgentHelperErrorEventArgs("Timeout"));
                    }
                }
            }

            /// <summary>
            /// 关闭并清理下载代理。
            /// </summary>
            public void Shutdown()
            {
                Dispose();

                m_Helper.DownloadAgentHelperUpdate -= OnDownloadAgentHelperUpdate;
                m_Helper.DownloadAgentHelperComplete -= OnDownloadAgentHelperComplete;
                m_Helper.DownloadAgentHelperError -= OnDownloadAgentHelperError;
            }

            /// <summary>
            /// 开始处理下载任务。
            /// </summary>
            /// <param name="task">要处理的下载任务。</param>
            public void Start(DownloadTask task)
            {
                if (task == null)
                {
                    throw new FrameworkException("Task is invalid.");
                }

                m_Task = task;
                if(m_FileStream!=null){
                    m_FileStream.Dispose();
                    m_FileStream = null;
                }

                m_Task.Status = DownloadTaskStatus.Doing;
                string downloadFile = string.Format("{0}.download", m_Task.DownloadPath);

                if (File.Exists(downloadFile))
                {
                    m_FileStream = File.OpenWrite(downloadFile);
                    m_FileStream.Seek(0, SeekOrigin.End);
                    m_StartLength = m_SavedLength = (int)m_FileStream.Length;
                    m_DownloadedLength = 0;

                }
                else
                {
                    string directory = Path.GetDirectoryName(m_Task.DownloadPath);
                    if (!Directory.Exists(directory))
                    {
                        Directory.CreateDirectory(directory);
                    }
                    m_FileStream = new FileStream(downloadFile, FileMode.Create, FileAccess.Write);
                    m_StartLength = m_SavedLength = m_DownloadedLength = 0;
                    
                }

                if (DownloadAgentStart != null)
                {
                    DownloadAgentStart(this);
                }

                if (m_StartLength > 0)
                {
                    m_Helper.Download(m_Task.DownloadUri, m_StartLength);
                }
                else
                {
                    m_Helper.Download(m_Task.DownloadUri);
                }
            }

            /// <summary>
            /// 重置下载代理。
            /// </summary>
            public void Reset()
            {
                m_Helper.Reset();

                if (m_FileStream != null)
                {
                    m_FileStream.Close();
                    m_FileStream.Dispose();
                    m_FileStream = null;
                }

                m_Task = null;
                m_WaitFlushSize = 0;
                m_WaitTime = 0f;
                m_StartLength = 0;
                m_DownloadedLength = 0;
                m_SavedLength = 0;
            }

            /// <summary>
            /// 释放资源。
            /// </summary>
            public void Dispose()
            {
                Dispose(true);
                GC.SuppressFinalize(this);
            }

            protected virtual void Dispose(bool disposing)
            {
                if (m_Disposed)
                {
                    return;
                }

                if (disposing)
                {
                    if (m_FileStream != null)
                    {
                        m_FileStream.Dispose();
                        m_FileStream = null;
                    }
                }
               
               m_Disposed = true;
            }

            private void SaveBytes(byte[] bytes)
            {
                if (bytes != null)
                {
					try
					{
	                    int length = bytes.Length;
	                    m_FileStream.Write(bytes, 0, length);
	                    m_WaitFlushSize += length;
	                    m_SavedLength += length;

	                    if (m_WaitFlushSize >= m_Task.FlushSize)
	                    {
	                        m_FileStream.Flush();
	                        m_WaitFlushSize = 0;
	                    }
					}
					catch(System.IO.IOException ex)
					{
						if (KBN._Global.IsDiskFullException(ex)) 
						{
							KBN.ErrorMgr.singleton.PushError("", KBN.Datas.getArString("Common.DiskFull"),
							                                  false,KBN.Datas.getArString("FTE.Restart"),
							                                 new System.Action(KBN.GameMain.singleton.restartGame));
						}
					}
                }
            }

            private void OnDownloadAgentHelperUpdate(object sender, DownloadAgentHelperUpdateEventArgs e)
            {
                m_WaitTime = 0f;

                SaveBytes(e.GetBytes());

                m_DownloadedLength = e.Length;

                if (DownloadAgentUpdate != null)
                {
                    DownloadAgentUpdate(this);
                }
            }

            private void OnDownloadAgentHelperComplete(object sender, DownloadAgentHelperCompleteEventArgs e)
            {
                m_WaitTime = 0f;
                SaveBytes(e.GetBytes());
                m_DownloadedLength = e.Length;

                if (m_SavedLength != CurrentLength)
                {
                    throw new FrameworkException("Internal download error.");
                }
               
                m_Helper.Reset();
            
                
                m_FileStream.Close();
                m_FileStream.Dispose();
                m_FileStream = null;
               
                if (File.Exists(m_Task.DownloadPath))
                {
                    File.Delete(m_Task.DownloadPath);
                }

                File.Move(string.Format("{0}.download", m_Task.DownloadPath), m_Task.DownloadPath);

                m_Task.Status = DownloadTaskStatus.Done;

                if (DownloadAgentSuccess != null)
                {
                    DownloadAgentSuccess(this);
                }

                m_Task.Done = true;
            }

            private void OnDownloadAgentHelperError(object sender, DownloadAgentHelperErrorEventArgs e)
            {
                m_Helper.Reset();
                m_FileStream.Close();
                m_FileStream.Dispose();
               

                m_FileStream = null;

                m_Task.Status = DownloadTaskStatus.Error;

                if (DownloadAgentFailure != null)
                {
                    DownloadAgentFailure(this, e.ErrorMessage);
                }

                m_Task.Done = true;
            }
        }
    }
}
