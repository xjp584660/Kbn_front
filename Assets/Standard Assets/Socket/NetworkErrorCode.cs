// Socket Network Manager v1.0
// yjiang@kabaminc.com 2014-06-18

/// <summary>
/// 网络错误码。
/// </summary>
public enum NetworkErrorCode
{
    /// <summary>
    /// 未定义错误。
    /// </summary>
    Undefined,
    /// <summary>
    /// 网络状态错误。
    /// </summary>
    StatusError,
    /// <summary>
    /// 序列化错误。
    /// </summary>
    SerializeError,
    /// <summary>
    /// 反序列化错误。
    /// </summary>
    DeserializeError,
    /// <summary>
    /// 网络连接错误。
    /// </summary>
    ConnectError,
    /// <summary>
    /// 消息包发送错误。
    /// </summary>
    SendError,
    /// <summary>
    /// 消息包接收错误。
    /// </summary>
    ReceiveError,
    /// <summary>
    /// 消息包流错误。
    /// </summary>
    StreamError,
    /// <summary>
    /// 未知的消息包协议。
    /// </summary>
    UnknownOpcode,
}
