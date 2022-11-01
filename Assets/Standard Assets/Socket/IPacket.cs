// Socket Network Manager v1.0
// yjiang@kabaminc.com 2014-06-18

/// <summary>
/// 消息包接口。
/// </summary>
public interface IPacket : ProtoBuf.IExtensible
{
    /// <summary>
    /// 获取消息包协议编号。
    /// </summary>
    int Opcode
    {
        get;
    }

}
