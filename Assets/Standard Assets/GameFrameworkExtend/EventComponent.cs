//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using GameFramework;
using System;
using UnityEngine;

namespace KBN
{
	/// <summary>
	/// 事件组件。
	/// </summary>
	[AddComponentMenu("Game Framework/Event Module")]
	public class EventComponent : MonoBehaviour
	{
	    private IEventManager m_EventManager = null;
	
	    private void Awake()
	    {
	
	    }
	
        internal void Init(IEventManager manager)
	    {
            if (manager == null)
            {
                throw new FrameworkException("Event manager is invalid.");
            }

	        m_EventManager = manager;

			Debug.Log("Event component has been initialized.");
	    }
	
	    /// <summary>
	    /// 是否存在事件处理回调函数。
	    /// </summary>
	    /// <param name="id">事件类型编号。</param>
	    /// <param name="handler">要检查的事件处理回调函数。</param>
	    /// <returns>是否存在事件处理回调函数。</returns>
	    public bool HasHandler(EventId id, EventHandler<GameEventArgs> handler)
	    {
	        return m_EventManager.HasHandler((int)id, handler);
	    }
	
	    /// <summary>
	    /// 注册事件处理回调函数。
	    /// </summary>
	    /// <param name="id">事件类型编号。</param>
	    /// <param name="handler">要注册的事件处理回调函数。</param>
	    /// <returns>是否注册事件处理回调函数成功。</returns>
		public bool RegisterHandler(EventId id, EventHandler<GameEventArgs> handler)
	    {
	        return m_EventManager.RegisterHandler((int)id, handler);
	    }
	
	    /// <summary>
	    /// 解除事件处理回调函数。
	    /// </summary>
	    /// <param name="id">事件类型编号。</param>
	    /// <param name="handler">要解除的事件处理回调函数。</param>
	    /// <returns>是否解除事件处理回调函数成功。</returns>
		public bool UnregisterHandler(EventId id, EventHandler<GameEventArgs> handler)
	    {
	        return m_EventManager.UnregisterHandler((int)id, handler);
	    }
	
	    /// <summary>
	    /// 抛出事件，这个操作是线程安全的，即使不在主线程中抛出，也可保证在主线程中回调事件处理函数，但事件会在抛出后的下一帧分发。
	    /// </summary>
	    /// <param name="sender">事件发送者。</param>
	    /// <param name="e">事件内容。</param>
	    public void Fire(object sender, GameEventArgs e)
	    {
	        m_EventManager.Fire(sender, e);
	    }
	
	    /// <summary>
	    /// 抛出事件立即模式，这个操作不是线程安全的，事件会立刻分发。
	    /// </summary>
	    /// <param name="sender">事件发送者。</param>
	    /// <param name="e">事件内容。</param>
	    public void FireNow(object sender, GameEventArgs e)
	    {
	        m_EventManager.FireNow(sender, e);
	    }
	}
}
