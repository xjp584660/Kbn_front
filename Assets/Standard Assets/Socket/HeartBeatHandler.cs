// Socket Network Manager v1.0
// yjiang@kabaminc.com 2014-06-18

/// <summary>
/// 心跳协议包处理器。
/// </summary>
public class HeartBeatHandler : IPacketHandler
{
    /// <summary>
    /// 获取心跳协议包协议编号。
    /// </summary>
    public int Opcode
    {
        get
        {
			return (int)PBOpcode.heartbeat;
        }
    }

    /// <summary>
    /// 心跳协议包处理函数。
    /// </summary>
    /// <param name="bytes">心跳协议包流数据。</param>
    public void Handle(byte[] bytes)
    {

    }
}
