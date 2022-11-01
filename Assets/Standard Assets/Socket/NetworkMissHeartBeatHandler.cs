// Socket Network Manager v1.0
// yjiang@kabaminc.com 2014-06-18

/// <summary>
/// 心跳丢失回调函数。
/// </summary>
/// <param name="missCount">已丢失次数。</param>
public delegate void NetworkMissHeartBeatHandler(int missCount);
