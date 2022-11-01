// Socket Network Manager v1.0
// yjiang@kabaminc.com 2014-06-18

/// <summary>
/// 连接错误回调函数。
/// </summary>
/// <param name="errorCode">错误码。</param>
/// <param name="errorMessage">错误信息。</param>
public delegate void NetworkErrorHandler(NetworkErrorCode errorCode, string errorMessage);
