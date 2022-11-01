//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

using System.Collections.Generic;

namespace GameFramework
{
    /// <summary>
    /// 任务池。
    /// </summary>
    /// <typeparam name="T">任务类型。</typeparam>
    internal class TaskPool<T> where T : ITask
    {
        private readonly Stack<ITaskAgent<T>> m_FreeAgents;
        private readonly LinkedList<ITaskAgent<T>> m_WorkingAgents;
        private readonly LinkedList<T> m_WaitingTasks;

        /// <summary>
        /// 初始化任务池的新实例。
        /// </summary>
        public TaskPool()
        {
            m_FreeAgents = new Stack<ITaskAgent<T>>();
            m_WorkingAgents = new LinkedList<ITaskAgent<T>>();
            m_WaitingTasks = new LinkedList<T>();
        }

        /// <summary>
        /// 获取任务代理总个数。
        /// </summary>
        public int TotalAgentCount
        {
            get
            {
                return FreeAgentCount + WorkingAgentCount;
            }
        }

        /// <summary>
        /// 获取可用任务代理个数。
        /// </summary>
        public int FreeAgentCount
        {
            get
            {
                return m_FreeAgents.Count;
            }
        }

        /// <summary>
        /// 获取工作中任务代理个数。
        /// </summary>
        public int WorkingAgentCount
        {
            get
            {
                return m_WorkingAgents.Count;
            }
        }

        /// <summary>
        /// 获取等待任务个数。
        /// </summary>
        public int WaitingTaskCount
        {
            get
            {
                return m_WaitingTasks.Count;
            }
        }

        /// <summary>
        /// 任务池轮询。
        /// </summary>
        /// <param name="elapseSeconds">逻辑流逝时间，以秒为单位。</param>
        /// <param name="realElapseSeconds">真实流逝时间，以秒为单位。</param>
        public void Update(float elapseSeconds, float realElapseSeconds)
        {
            for (LinkedListNode<ITaskAgent<T>> current = m_WorkingAgents.First; current != null; /* Empty increment */)
            {
                if (current.Value.Task.Done)
                {
                    LinkedListNode<ITaskAgent<T>> next = current.Next;
                    current.Value.Reset();
                    m_FreeAgents.Push(current.Value);
                    m_WorkingAgents.Remove(current);
                    current = next;
                    continue;
                }

                current.Value.Update(elapseSeconds, realElapseSeconds);
                current = current.Next;
            }

            while (FreeAgentCount > 0 && WaitingTaskCount > 0)
            {
                ITaskAgent<T> agent = m_FreeAgents.Pop();
                m_WorkingAgents.AddLast(agent);
                agent.Start(m_WaitingTasks.First.Value);
                m_WaitingTasks.RemoveFirst();
            }
        }

        /// <summary>
        /// 关闭并清理任务池。
        /// </summary>
        public void Shutdown()
        {
            while (FreeAgentCount > 0)
            {
                m_FreeAgents.Pop().Shutdown();
            }

            for (LinkedListNode<ITaskAgent<T>> current = m_WorkingAgents.First; current != null; current = current.Next)
            {
                current.Value.Shutdown();
            }
            m_WorkingAgents.Clear();

            m_WaitingTasks.Clear();
        }

        /// <summary>
        /// 增加任务代理。
        /// </summary>
        /// <param name="agent">要增加的任务代理。</param>
        public void AddAgent(ITaskAgent<T> agent)
        {
            if (agent == null)
            {
                throw new FrameworkException("Task agent is invalid.");
            }

            agent.Init();
            m_FreeAgents.Push(agent);
        }

        /// <summary>
        /// 增加任务。
        /// </summary>
        /// <param name="task">要增加的任务。</param>
        public void AddTask(T task)
        {
            m_WaitingTasks.AddLast(task);
        }

        /// <summary>
        /// 移除任务。
        /// </summary>
        /// <param name="serialId">要移除任务的序列编号。</param>
        /// <returns>被移除的任务。</returns>
        public T RemoveTask(int serialId)
        {
            for (LinkedListNode<T> current = m_WaitingTasks.First; current != null; current = current.Next)
            {
                if (current.Value.SerialId == serialId)
                {
                    m_WaitingTasks.Remove(current);
                    return current.Value;
                }
            }

            for (LinkedListNode<ITaskAgent<T>> current = m_WorkingAgents.First; current != null; current = current.Next)
            {
                if (current.Value.Task.SerialId == serialId)
                {
                    current.Value.Reset();
                    m_FreeAgents.Push(current.Value);
                    m_WorkingAgents.Remove(current);
                    return current.Value.Task;
                }
            }

            return default(T);
        }

        /// <summary>
        /// 移除全部任务。
        /// </summary>
        public void RemoveAllTasks()
        {
            m_WaitingTasks.Clear();
            for (LinkedListNode<ITaskAgent<T>> current = m_WorkingAgents.First; current != null; current = current.Next)
            {
                current.Value.Reset();
                m_FreeAgents.Push(current.Value);
            }
            m_WorkingAgents.Clear();
        }
    }
}
