//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using System;

namespace GameFramework
{
    /// <summary>
    /// 事件管理器。
    /// </summary>
    internal class EventManager : FrameworkModule, IEventManager
    {
        private readonly EventPool<GameEventArgs> m_EventPool;

        /// <summary>
        /// 初始化事件管理器的新实例。
        /// </summary>
        /// <param name="framework">游戏框架。</param>
        public EventManager(Framework framework)
            : base(framework)
        {
            m_EventPool = new EventPool<GameEventArgs>(true);
        }

        /// <summary>
        /// 获取游戏框架模块的名称。
        /// </summary>
        internal override string Name
        {
            get
            {
                return "Event";
            }
        }

        /// <summary>
        /// 初始化事件管理器。
        /// </summary>
        internal override void Init()
        {

        }

        /// <summary>
        /// 事件管理器轮询。
        /// </summary>
        /// <param name="elapseSeconds">逻辑流逝时间，以秒为单位。</param>
        /// <param name="realElapseSeconds">真实流逝时间，以秒为单位。</param>
        internal override void Update(float elapseSeconds, float realElapseSeconds)
        {
            m_EventPool.Update(elapseSeconds, realElapseSeconds);
        }

        /// <summary>
        /// 关闭并清理事件管理器。
        /// </summary>
        internal override void Shutdown()
        {
            m_EventPool.Shutdown();
        }

        /// <summary>
        /// 是否存在事件处理函数。
        /// </summary>
        /// <param name="id">事件类型编号。</param>
        /// <param name="handler">要检查的事件处理函数。</param>
        /// <returns>是否存在事件处理函数。</returns>
        public bool HasHandler(int id, EventHandler<GameEventArgs> handler)
        {
            return m_EventPool.HasHandler(id, handler);
        }

        /// <summary>
        /// 注册事件处理函数。
        /// </summary>
        /// <param name="id">事件类型编号。</param>
        /// <param name="handler">要注册的事件处理函数。</param>
        /// <returns>是否注册事件处理函数成功。</returns>
        public bool RegisterHandler(int id, EventHandler<GameEventArgs> handler)
        {
            return m_EventPool.RegisterHandler(id, handler);
        }

        /// <summary>
        /// 解除事件处理函数。
        /// </summary>
        /// <param name="id">事件类型编号。</param>
        /// <param name="handler">要解除的事件处理函数。</param>
        /// <returns>是否解除事件处理函数成功。</returns>
        public bool UnregisterHandler(int id, EventHandler<GameEventArgs> handler)
        {
            return m_EventPool.UnregisterHandler(id, handler);
        }

        /// <summary>
        /// 抛出事件，这个操作是线程安全的，即使不在主线程中抛出，也可保证在主线程中回调事件处理函数，但事件会在抛出后的下一帧分发。
        /// </summary>
        /// <param name="sender">事件源。</param>
        /// <param name="e">事件参数。</param>
        public void Fire(object sender, GameEventArgs e)
        {
            m_EventPool.Fire(sender, e);
        }

        /// <summary>
        /// 抛出事件立即模式，这个操作不是线程安全的，事件会立刻分发。
        /// </summary>
        /// <param name="sender">事件源。</param>
        /// <param name="e">事件参数。</param>
        public void FireNow(object sender, GameEventArgs e)
        {
            m_EventPool.FireNow(sender, e);
        }
    }
}
