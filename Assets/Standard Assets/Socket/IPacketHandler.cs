// Socket Network Manager v1.0
// yjiang@kabaminc.com 2014-06-18

/// <summary>
/// 消息包处理器接口。
/// </summary>
public interface IPacketHandler
{
    /// <summary>
    /// 获取消息包协议编号。
    /// </summary>
    int Opcode
    {
        get;
    }

    /// <summary>
    /// 消息包处理函数。
    /// </summary>
    /// <param name="bytes">消息包流数据。</param>
    void Handle(byte[] bytes);
}
