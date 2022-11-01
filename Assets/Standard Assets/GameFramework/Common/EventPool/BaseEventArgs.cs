//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

namespace GameFramework
{
    /// <summary>
    /// 事件基类。
    /// </summary>
    public abstract class BaseEventArgs : FrameworkEventArgs
    {
        /// <summary>
        /// 获取事件类型编号。
        /// </summary>
        public abstract int Id
        {
            get;
        }
    }
}
