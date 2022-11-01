//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

namespace GameFramework
{
    /// <summary>
    /// 游戏框架模块抽象类。
    /// </summary>
    internal abstract class FrameworkModule
    {
        protected Framework m_Framework;

        /// <summary>
        /// 初始化游戏框架模块的新实例。
        /// </summary>
        /// <param name="framework">游戏框架。</param>
        public FrameworkModule(Framework framework)
        {
            if (framework == null)
            {
                throw new FrameworkException("Game framework is invalid.");
            }

            m_Framework = framework;
            m_Framework.RegisterModule(this);
        }

        /// <summary>
        /// 获取游戏框架模块的名称。
        /// </summary>
        internal abstract string Name
        {
            get;
        }

        /// <summary>
        /// 初始化游戏框架模块。
        /// </summary>
        internal abstract void Init();

        /// <summary>
        /// 游戏框架模块轮询。
        /// </summary>
        /// <param name="elapseSeconds">逻辑流逝时间，以秒为单位。</param>
        /// <param name="realElapseSeconds">真实流逝时间，以秒为单位。</param>
        internal abstract void Update(float elapseSeconds, float realElapseSeconds);

        /// <summary>
        /// 关闭并清理游戏框架模块。
        /// </summary>
        internal abstract void Shutdown();
    }
}
