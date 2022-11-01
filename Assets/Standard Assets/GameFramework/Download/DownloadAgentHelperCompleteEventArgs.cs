//------------------------------------------------------------
// Game Framework v1.0
// Copyright Ellan Jiang 2014-2015. All rights reserved.
// Feedback: mailto:yjiang@kabaminc.com
//------------------------------------------------------------

namespace GameFramework
{
    /// <summary>
    ///  下载代理辅助器完成事件。
    /// </summary>
    public class DownloadAgentHelperCompleteEventArgs : FrameworkEventArgs
    {
        private byte[] m_Bytes;

        /// <summary>
        /// 初始化下载代理辅助器完成的新实例。
        /// </summary>
        /// <param name="length">下载的数据大小。</param>
        /// <param name="bytes">下载的数据流。</param>
        public DownloadAgentHelperCompleteEventArgs(int length, byte[] bytes)
        {
            Length = length;
            m_Bytes = bytes;
        }

        /// <summary>
        /// 获取下载的数据大小。
        /// </summary>
        public int Length
        {
            get;
            private set;
        }

        /// <summary>
        /// 获取下载的数据流。
        /// </summary>
        public byte[] GetBytes()
        {
            return m_Bytes;
        }
    }
}
