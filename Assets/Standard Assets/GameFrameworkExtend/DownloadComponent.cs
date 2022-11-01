//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using GameFramework;
using UnityEngine;

namespace KBN
{
    /// <summary>
    /// 下载组件。
    /// </summary>
    [AddComponentMenu("Game Framework/Download Module")]
    public class DownloadComponent : MonoBehaviour
    {
        private IDownloadManager m_DownloadManager = null;
        private EventComponent m_EventComponent = null;

        [SerializeField]
        private DownloadAgentHelper m_DownloadAgentHelperTemplate = null;
        [SerializeField]
        private int m_DownloadAgentHelperCount = 1;
        [SerializeField]
        private Transform m_DownloadAgentHelperRoot = null;
        [SerializeField]
        private float m_TimeOut = 30f;
        [SerializeField]
        private int m_FlushSize = 1024 * 1024;
        /// <summary>
        /// 获取下载代理总个数。
        /// </summary>
        public int TotalAgentCount
        {
            get
            {
                return m_DownloadManager.TotalAgentCount;
            }
        }

        /// <summary>
        /// 获取可用下载代理个数。
        /// </summary>
        public int FreeAgentCount
        {
            get
            {
                return m_DownloadManager.FreeAgentCount;
            }
        }

        /// <summary>
        /// 获取工作中下载代理个数。
        /// </summary>
        public int WorkingAgentCount
        {
            get
            {
                return m_DownloadManager.WorkingAgentCount;
            }
        }

        /// <summary>
        /// 获取等待下载任务个数。
        /// </summary>
        public int WaitingTaskCount
        {
            get
            {
                return m_DownloadManager.WaitingTaskCount;
            }
        }

        /// <summary>
        /// 获取或设置下载超时时长，以秒为单位。
        /// </summary>
        public float TimeOut
        {
            get
            {
                return m_DownloadManager.TimeOut;
            }
            set
            {
                m_DownloadManager.TimeOut = m_TimeOut = value;
            }
        }

        /// <summary>
        /// 获取或设置将缓冲区写入磁盘的临界大小，仅当开启断点续传时有效。
        /// </summary>
        public int FlushSize
        {
            get
            {
                return m_DownloadManager.FlushSize;
            }
            set
            {
                m_DownloadManager.FlushSize = m_FlushSize = value;
            }
        }

        private void Awake()
        {
            m_EventComponent = GetComponent<EventComponent>();
        }

        internal void Init(IDownloadManager manager)
        {
            if (manager == null)
            {
                throw new FrameworkException("Download manager is invalid.");
            }

            m_DownloadManager = manager;

            m_DownloadManager.DownloadStart += OnDownloadStart;
            m_DownloadManager.DownloadUpdate += OnDownloadUpdate;
            m_DownloadManager.DownloadSuccess += OnDownloadSuccess;
            m_DownloadManager.DownloadFailure += OnDownloadFailure;
            m_DownloadManager.FlushSize = m_FlushSize;
            m_DownloadManager.TimeOut = m_TimeOut;

            if (m_DownloadAgentHelperTemplate == null)
            {
                throw new FrameworkException("Download agent helper template is invalid.");
            }

            for (int i = 0; i < m_DownloadAgentHelperCount; i++)
            {
                DownloadAgentHelper helper = Instantiate(m_DownloadAgentHelperTemplate) as DownloadAgentHelper;
                helper.transform.parent = m_DownloadAgentHelperRoot;
                helper.name = string.Format("Download Agent Helper - {0}", i.ToString());
                m_DownloadManager.AddDownloadAgentHelper(helper);
            }

            Debug.Log("Download component has been initialized.");
        }

        /// <summary>
        /// 增加下载任务。
        /// </summary>
        /// <param name="downloadPath">下载后存放路径。</param>
        /// <param name="downloadUri">原始下载地址。</param>
        /// <returns>新增下载任务的序列编号。</returns>
        public int AddDownload(string downloadPath, string downloadUri)
        {
            return m_DownloadManager.AddDownload(downloadPath, downloadUri, null);
        }

        /// <summary>
        /// 增加下载任务。
        /// </summary>
        /// <param name="downloadPath">下载后存放路径。</param>
        /// <param name="downloadUri">原始下载地址。</param>
        /// <param name="userData">用户自定义数据。</param>
        /// <returns>新增下载任务的序列编号。</returns>
        public int AddDownload(string downloadPath, string downloadUri, object userData)
        {
            return m_DownloadManager.AddDownload(downloadPath, downloadUri, userData);
        }

        /// <summary>
        /// 移除下载任务。
        /// </summary>
        /// <param name="serialId">要移除下载任务的序列编号。</param>
        public void RemoveDownload(int serialId)
        {
            m_DownloadManager.RemoveDownload(serialId);
        }

        /// <summary>
        /// 移除全部下载任务。
        /// </summary>
        public void RemoveAllDownload()
        {
            m_DownloadManager.RemoveAllDownload();
        }

        private void OnDownloadStart(object sender, GameFramework.DownloadStartEventArgs e)
        {
            m_EventComponent.Fire(this, new DownloadStartEventArgs(e));
        }

        private void OnDownloadUpdate(object sender, GameFramework.DownloadUpdateEventArgs e)
        {
            m_EventComponent.Fire(this, new DownloadUpdateEventArgs(e));
        }

        private void OnDownloadSuccess(object sender, GameFramework.DownloadSuccessEventArgs e)
        {
            m_EventComponent.Fire(this, new DownloadSuccessEventArgs(e));
        }

        private void OnDownloadFailure(object sender, GameFramework.DownloadFailureEventArgs e)
        {
            m_EventComponent.Fire(this, new DownloadFailureEventArgs(e));
        }
    }
}
