//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using System.Collections.Generic;

namespace GameFramework
{
    /// <summary>
    /// 游戏框架。
    /// </summary>
    public class Framework
    {
        private readonly IList<FrameworkModule> m_FrameworkModules;

		private readonly DownloadManager m_DownloadManager;
        private readonly EventManager m_EventManager;

        /// <summary>
        /// 初始化游戏框架的新实例。
        /// </summary>
        public Framework()
        {
            m_FrameworkModules = new List<FrameworkModule>();

			m_DownloadManager = new DownloadManager(this);
            m_EventManager = new EventManager(this);
        }

		public IDownloadManager Download
		{
			get
			{
				return m_DownloadManager;
			}
		}

        /// <summary>
        /// 获取事件管理器。
        /// </summary>
        public IEventManager Event
        {
            get
            {
                return m_EventManager;
            }
        }

        /// <summary>
        /// 初始化所有游戏框架模块。
        /// </summary>
        public void Init()
        {
            for (int i = 0; i < m_FrameworkModules.Count; i++)
            {
                m_FrameworkModules[i].Init();
            }
        }

        /// <summary>
        /// 所有游戏框架模块轮询。
        /// </summary>
        /// <param name="elapseSeconds">逻辑流逝时间，以秒为单位。</param>
        /// <param name="realElapseSeconds">真实流逝时间，以秒为单位。</param>
        public void Update(float elapseSeconds, float realElapseSeconds)
        {
            for (int i = 0; i < m_FrameworkModules.Count; i++)
            {
                m_FrameworkModules[i].Update(elapseSeconds, realElapseSeconds);
            }
        }

        /// <summary>
        /// 关闭并清理所有游戏框架模块。
        /// </summary>
        public void Shutdown()
        {
            for (int i = m_FrameworkModules.Count - 1; i >= 0; i--)
            {
                m_FrameworkModules[i].Shutdown();
            }

            m_FrameworkModules.Clear();
        }

        /// <summary>
        /// 注册游戏框架模块。
        /// </summary>
        /// <param name="module">要注册的游戏框架模块。</param>
        internal void RegisterModule(FrameworkModule module)
        {
            if (module == null)
            {
                throw new FrameworkException("Game framework module is invalid.");
            }

            for (int i = 0; i < m_FrameworkModules.Count; i++)
            {
                if (m_FrameworkModules[i].Name == module.Name)
                {
                    throw new FrameworkException(string.Format("Already exist module '{0}'.", module.Name));
                }
            }

            m_FrameworkModules.Add(module);
        }
    }
}
