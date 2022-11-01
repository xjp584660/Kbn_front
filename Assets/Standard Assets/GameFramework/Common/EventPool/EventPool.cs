//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using System;
using System.Collections.Generic;

namespace GameFramework
{
    /// <summary>
    /// 事件池。
    /// </summary>
    /// <typeparam name="T">事件类型。</typeparam>
    internal partial class EventPool<T> where T : BaseEventArgs
    {
        private readonly IDictionary<int, EventHandler<T>> m_EventHandlers;
        private readonly Queue<Event> m_Events;
        private readonly bool m_NoHandlerAllowed;

        /// <summary>
        /// 初始化事件池的新实例。
        /// </summary>
        /// <param name="noHandlerAllowed">是否允许没有事件处理函数。</param>
        public EventPool(bool noHandlerAllowed)
        {
            m_EventHandlers = new Dictionary<int, EventHandler<T>>();
            m_Events = new Queue<Event>();
            m_NoHandlerAllowed = noHandlerAllowed;
        }

        /// <summary>
        /// 事件池轮询。
        /// </summary>
        /// <param name="elapseSeconds">逻辑流逝时间，以秒为单位。</param>
        /// <param name="realElapseSeconds">真实流逝时间，以秒为单位。</param>
        public void Update(float elapseSeconds, float realElapseSeconds)
        {
            while (m_Events.Count > 0)
            {
                Event e = null;
                lock (m_Events)
                {
                    e = m_Events.Dequeue();
                }

                HandleEvent(e.Sender, e.EventArgs);
            }
        }

        /// <summary>
        /// 关闭并清理事件池。
        /// </summary>
        public void Shutdown()
        {
            lock (m_Events)
            {
                m_Events.Clear();
            }

            m_EventHandlers.Clear();
        }

        /// <summary>
        /// 是否存在事件处理函数。
        /// </summary>
        /// <param name="id">事件类型编号。</param>
        /// <param name="handler">要检查的事件处理函数。</param>
        /// <returns>是否存在事件处理函数。</returns>
        public bool HasHandler(int id, EventHandler<T> handler)
        {
            if (handler == null)
            {
                throw new FrameworkException("Event handler is invalid.");
            }

            EventHandler<T> handlers = null;
            if (!m_EventHandlers.TryGetValue(id, out handlers))
            {
                return false;
            }

            if (handlers != null)
            {
                foreach (EventHandler<T> i in handlers.GetInvocationList())
                {
                    if (i == handler)
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        /// <summary>
        /// 注册事件处理函数。
        /// </summary>
        /// <param name="id">事件类型编号。</param>
        /// <param name="handler">要注册的事件处理函数。</param>
        /// <returns>是否注册事件处理函数成功。</returns>
        public bool RegisterHandler(int id, EventHandler<T> handler)
        {
            if (HasHandler(id, handler))
            {
                return false;
            }

            if (!m_EventHandlers.ContainsKey(id))
            {
                m_EventHandlers.Add(id, null);
            }

            m_EventHandlers[id] += handler;
            return true;
        }

        /// <summary>
        /// 解除事件处理函数。
        /// </summary>
        /// <param name="id">事件类型编号。</param>
        /// <param name="handler">要解除的事件处理函数。</param>
        /// <returns>是否解除事件处理函数成功。</returns>
        public bool UnregisterHandler(int id, EventHandler<T> handler)
        {
            if (!HasHandler(id, handler))
            {
                return false;
            }

            m_EventHandlers[id] -= handler;
            return true;
        }

        /// <summary>
        /// 抛出事件，这个操作是线程安全的，即使不在主线程中抛出，也可保证在主线程中回调事件处理函数，但事件会在抛出后的下一帧分发。
        /// </summary>
        /// <param name="sender">事件源。</param>
        /// <param name="e">事件参数。</param>
        public void Fire(object sender, T e)
        {
            Event eventNode = new Event(sender, e);
            lock (m_Events)
            {
                m_Events.Enqueue(eventNode);
            }
        }

        /// <summary>
        /// 抛出事件立即模式，这个操作不是线程安全的，事件会立刻分发。
        /// </summary>
        /// <param name="sender">事件源。</param>
        /// <param name="e">事件参数。</param>
        public void FireNow(object sender, T e)
        {
            HandleEvent(sender, e);
        }

        /// <summary>
        /// 处理事件结点。
        /// </summary>
        /// <param name="sender">事件源。</param>
        /// <param name="e">事件参数。</param>
        private void HandleEvent(object sender, T e)
        {
            EventHandler<T> handlers = null;
            if (m_EventHandlers.TryGetValue(e.Id, out handlers))
            {
                if (handlers != null)
                {
                    handlers(sender, e);
                    return;
                }
            }

            if (!m_NoHandlerAllowed)
            {
                throw new FrameworkException(string.Format("Event '{0}' not have any handler.", e.Id));
            }
        }
    }
}
