using System;
using System.Collections.Generic;
using ThinkingAnalytics;
using UnityEngine;

[DisallowMultipleComponent]
public class ThinkingAnalyticsManager : MonoBehaviour {


    #region init instance

    private static readonly object lockObject = new object();

    private static ThinkingAnalyticsManager _instance;
    public static ThinkingAnalyticsManager Instance {
        get {
            if (_instance == null) {
                lock (lockObject)
                {
                    _instance = GameObject.FindObjectOfType<ThinkingAnalyticsManager>();
                    if (_instance == null) {
                        _instance = new GameObject(typeof(ThinkingAnalyticsManager).Name).AddComponent<ThinkingAnalyticsManager>();
                    }

                    DontDestroyOnLoad(_instance.gameObject);
                }
            }

            return _instance;
        }
    }

    #endregion


    /* ------------------------------------------------------------------------ Confirguration ------------------------------------------------------------------------ */

    [Space(10)]
    [Header(" TA 开关 ")]
    public bool IS_ENABLE = true;
    [Space(10)]
    [Header(" 在 Start 中 直接初始化 TA （默认 enableAutoInit = false）")]
    [SerializeField] private bool enableAutoInit = false;
    [Space(20)]
    [Header("---Confirguration---")]

    [Header("是否打开 Log")]
    [SerializeField] private bool enableLog = true;

    [Header("是否打开 开启自动采集事件")]
    [SerializeField] private bool enableAutoTrack = true;

    [Header("是否打开 开启自动采集事件")]
    [SerializeField] private AUTO_TRACK_EVENTS autoTrackType = AUTO_TRACK_EVENTS.ALL;

    [Space(5)]
    [Header("设置网络类型")]
    [SerializeField] private ThinkingAnalyticsAPI.NetworkType networkType = ThinkingAnalyticsAPI.NetworkType.DEFAULT;

    [Space(10)]
    [Header("---Project token---")]
    [Space(5)]
    [Header("-- 是否启用测试id,需要 useTestAppID 以及 BuildSetting.DebugMode 均满足时才会启用---")]
    [SerializeField] private bool useTestAppID = true; 
    [SerializeField] private string testAppID = "b303a5b6cb12495caa02c71c286109bf";   //ta test: eff28a4bd7ec423fa5294b4a2c1eff28
    [SerializeField] private string appID = "6cce9e73e6954d07a31d605093add75c";   //ta  test: eff28a4bd7ec423fa5294b4a2c1eff28
    [SerializeField] private string serverURL = "https://ta.decagames.com/";      //ta  test: "https://receiver.ta.thinkingdata.cn"
    [SerializeField] private ThinkingAnalyticsAPI.TAMode mode = ThinkingAnalyticsAPI.TAMode.NORMAL;
    [SerializeField] private ThinkingAnalyticsAPI.TATimeZone timeZone = ThinkingAnalyticsAPI.TATimeZone.Local;

    /* ------------------------------------------------------------------------ Awake & Init ------------------------------------------------------------------------ */

    private ThinkingAnalyticsAPI taAPI;


    private void Start() {
        if(enableAutoInit)
            Init();
    }

    /// <summary>
    /// 初始化 TA (使用在  Inspector面板中显示的配置信息初始化 TA)
    /// </summary>
    public void Init() {
        if (!IS_ENABLE || taAPI != null)
            return;

        Debug.LogWarning("<color=#5474F1FF>[ThinkingSDK]</color><color=#ffff00ff> ------- init ThinkingAnalytics sdk ------- </color>");

        if (taAPI == null) {
            taAPI = GetComponent<ThinkingAnalyticsAPI>();
            if (taAPI == null)
                taAPI = gameObject.AddComponent<ThinkingAnalyticsAPI>();
        }

        taAPI.Init();
        taAPI.enableLog = enableLog;
        taAPI.networkType = networkType;

        StartThinkingAnalytics();

        EnableAutoTrack();
    }

    /// <summary>
    /// 初始化 TA （使用自定义参数初始化 TA）
    /// </summary>
    /// <param name="token"> 项目相关信息 </param>
    /// <param name="enableLog"> 是否开启日志记录 </param>
    /// <param name="enableAutoTrack"> 是否开启自动采集事件 </param>
    /// <param name="autoTrackType"> 当 enableAutoTrack 开启时，自动采集的方式类型</param>
    /// <param name="networkType"> 上传数据使用的网络类型 </param>
    public void Init(ThinkingAnalyticsAPI.Token token, bool enableLog ,bool enableAutoTrack, AUTO_TRACK_EVENTS autoTrackType,  ThinkingAnalyticsAPI.NetworkType networkType) {
        if (taAPI != null)
            return;

        this.enableLog = enableLog;
        this.enableAutoTrack = enableAutoTrack;
        this.autoTrackType = autoTrackType;
        this.networkType = networkType;

        appID = token.appid;
        serverURL = token.serverUrl;
        mode = token.mode;
        timeZone = token.timeZone;


        Init();
    }

    /// <summary>
    /// 只有在 当前组件已经启用（IS_ENABLE = true），并且已经初始化 TA API（taAPI != null）
    /// 才可以进行其他操作。
    /// 
    /// <para>防止未初始化 TA 的API 就直接调用 TA 的接口</para>
    /// </summary>
    private bool IsInitOK { get { return IS_ENABLE && taAPI != null; }}
    /* ------------------------------------------------------------------------ Init prop ------------------------------------------------------------------------ */



    /// <summary>
    /// 初始化 ta
    /// </summary>
    private void StartThinkingAnalytics() {
        var isUseTestID = useTestAppID && BuildSetting.DebugMode == 1;

        var id = isUseTestID ? testAppID : appID;
      
#if UNITY_EDITOR
            if(isUseTestID)
                Debug.LogWarning("<color=#5474F1FF>[ThinkingSDK]---------- use <color=#ff0000ff>TEST</color> id:" + id + "  ----------</color>");
            else
                Debug.LogWarning("<color=#5474F1FF>[ThinkingSDK]---------- use id:" + id + "  ----------</color>");
#endif





        var token = new ThinkingAnalyticsAPI.Token
        {
            appid = id,
            serverUrl = serverURL,
            mode = mode,
            timeZone = timeZone
        };

        ThinkingAnalyticsAPI.StartThinkingAnalytics(token);
    }

    /// <summary>
    /// 开启自动采集事件
    ///
    /// <para> > APP_START  :当应用进入前台的时候触发上报，对应 ta_app_start</para> 
    /// <para> > APP_END    :当应用进入后台的时候触发上报，对应 ta_app_end</para> 
    /// <para> > APP_CRASH  :当出现未捕获异常的时候触发上报，对应 ta_app_crash</para> 
    /// <para> > APP_INSTALL:应用安装后首次打开的时候触发上报，对应 ta_app_install</para> 
    /// 
    /// </summary>
    /// 
    private void EnableAutoTrack() {
        if(IsInitOK && enableAutoTrack)
            ThinkingAnalyticsAPI.EnableAutoTrack(autoTrackType);
    }


    /// <summary>
    /// 开启自动采集事件
    ///
    /// <para> > APP_START  :当应用进入前台的时候触发上报，对应 ta_app_start</para> 
    /// <para> > APP_END    :当应用进入后台的时候触发上报，对应 ta_app_end</para> 
    /// <para> > APP_CRASH  :当出现未捕获异常的时候触发上报，对应 ta_app_crash</para> 
    /// <para> > APP_INSTALL:应用安装后首次打开的时候触发上报，对应 ta_app_install</para> 
    /// 
    /// </summary>
    /// <param name="enable"></param>
    public void EnableAutoTrack(bool enable){
        enableAutoTrack = enable;
        EnableAutoTrack();
    }


    /// <summary>
    /// Gets the device identifier.
    /// </summary>
    /// <returns>The device identifier.</returns>
    public string GetDeviceId() {
        if(IsInitOK)
            return ThinkingAnalyticsAPI.GetDeviceId();
        else
            return "";

    }

    /* ------------------------------------------------------------------------ Set ID ------------------------------------------------------------------------ */

    /// <summary>
    /// 设置 账号ID / 设置登录的账号
    /// </summary>
    /// <param name="id"></param>
    public void SetAccountID(string id) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.Login(id);

    }

    /// <summary>
    /// 设置 游客 ID / 设置 登录的游客ID
    /// </summary>
    /// <param name="id"></param>
    public void SetDistinctID(string id) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.Identify(id);
    }


    /// <summary>
    /// 获得 游客 ID 
    /// </summary>
    /// <returns></returns>
    public string GetDistinctId() {
        if (IsInitOK)
            return ThinkingAnalyticsAPI.GetDistinctId();
        else
            return "";
    }


    /// <summary>
    /// 取消登录 / 退出当前账号的登录状态
    /// </summary>
    public void ClearAccountID() {
        if(IsInitOK)
            ThinkingAnalyticsAPI.Logout();

    }

    /* ------------------------------------------------------------------------ User Property ------------------------------------------------------------------------ */

    /* ----------- set ----------- */

    /// <summary>
    /// 设置 用户属性。该接口上传的属性将会覆盖原有的属性值.
    /// </summary>
    /// <param name="userProperties"></param>
    public void SetUserProperty(Dictionary<string, object> userProperties) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserSet(userProperties);
    }

    /// <summary>
    /// 设置 用户属性 ，附加日期。该接口上传的属性将会覆盖原有的属性值.
    /// </summary>
    /// <param name="userProperties"></param>
    /// <param name="dateTime"></param>
    public void SetUserProperty(Dictionary<string, object> userProperties, DateTime dateTime) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserSet(userProperties, dateTime);
    }

    /* ----------- set onece ----------- */

    /// <summary>
    /// 设置 用户属性。当该属性之前已经有值的时候，将会忽略这条信息.
    /// </summary>
    /// <param name="userProperties"></param>
    public void SetUserPropertyOnce(Dictionary<string, object> userProperties) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserSetOnce(userProperties);

    }
    /// <summary>
    /// 设置 用户属性 ，附加日期。当该属性之前已经有值的时候，将会忽略这条信息.
    /// </summary>
    /// <param name="userProperties"></param>
    /// <param name="dateTime"></param>
    public void SetUserPropertyOnce(Dictionary<string, object> userProperties, DateTime dateTime) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserSetOnce(userProperties, dateTime);
    }

    /* ----------- add ----------- */

    /// <summary>
    /// 对数值类用户属性进行累加. 如果该属性还未被设置，则会赋值 0 后再进行计算.
    /// </summary>
    /// <param name="property">属性名称</param>
    /// <param name="value">数值</param>
    public void AddUserProperty(string property, object value) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserAdd(property, value);

    }

    /// <summary>
    /// 对数值类用户属性进行累加. 如果属性还未被设置，则会赋值 0 后再进行计算.
    /// </summary>
    /// <param name="properties">用户属性</param>
    public void AddUserProperty(Dictionary<string, object> properties) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserAdd(properties);
    }


    /// <summary>
    /// 对数值类用户属性进行累加. 如果属性还未被设置，则会赋值 0 后再进行计算.
    /// </summary>
    /// <param name="properties">用户属性</param>
    /// <param name="dateTime">操作时间</param>
    public void AddUserProperty(Dictionary<string, object> properties, DateTime dateTime) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserAdd(properties, dateTime);
    }

    /* ----------- append ----------- */



    /// <summary>
    /// 对 List 类型的用户属性进行追加.
    /// </summary>
    /// <param name="properties">用户属性</param>
    public void AppendUserProperty(Dictionary<string, object> properties) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserAppend(properties);

    }

    /// <summary>
    /// 对 List 类型的用户属性进行去重追加.
    /// </summary>
    /// <param name="properties">用户属性</param>
    public void UniqAppendUserProperty(Dictionary<string, object> properties) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserUniqAppend(properties);

    }

    /// <summary>
    /// 对 List 类型的用户属性进行去重追加.
    /// </summary>
    /// <param name="properties">用户属性</param>
    /// <param name="dateTime">操作时间</param>
    public void UniqAppendUserProperty(Dictionary<string, object> properties, DateTime dateTime) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserUniqAppend(properties, dateTime);

    }

    /// <summary>
    /// 对 List 类型的用户属性进行追加.
    /// </summary>
    /// <param name="properties">用户属性</param>
    /// <param name="dateTime">操作时间</param>
    public void AppendUserProperty(Dictionary<string, object> properties, DateTime dateTime) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserAppend(properties, dateTime);

    }

    /* ----------- unset ----------- */


    /// <summary>
    /// 重置一个用户属性.
    /// </summary>
    /// <param name="property">用户属性名称</param>
    public void UnsetUserProperty(string property) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserUnset(property);

    }

    /// <summary>
    /// 重置一组用户属性
    /// </summary>
    /// <param name="properties">用户属性列表</param>
    public void UnsetUserProperty(List<string> properties) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserUnset(properties);
    }

    /// <summary>
    /// 重置一组用户属性, 并指定操作时间
    /// </summary>
    /// <param name="properties">用户属性列表</param>
    /// <param name="dateTime">操作时间</param>
    public void UnsetUserProperty(List<string> properties, DateTime dateTime) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserUnset(properties, dateTime);

    }

    /* ----------- Delete ----------- */


    /// <summary>
    /// 删除用户数据. 之后再查询该名用户的用户属性，但该用户产生的事件仍然可以被查询到
    /// </summary>
    public void DeleteUserProperty() {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserDelete();

    }

    /// <summary>
    /// 删除用户数据并指定操作时间.
    /// </summary>
    public void DeleteUserProperty(DateTime dateTime){
        if(IsInitOK)
            ThinkingAnalyticsAPI.UserDelete(dateTime);
    }


    /* ------------------------------------------------------------------------ Set SuperProperties ------------------------------------------------------------------------ */

    /// <summary>
    /// 设置/更新 公共事件属性. 公共事件属性指的就是每个事件都会带有的属性.
    /// </summary>
    /// <param name="superProperties">公共事件属性</param>
    public void SetSuperProperties(Dictionary<string, object> superProperties) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.SetSuperProperties(superProperties);
    }


    /// <summary>
    /// 设置动态公共事件属性获得接口
    /// </summary>
    public interface IDynamicSuperProperties : ThinkingAnalytics.IDynamicSuperProperties { }

    /// <summary>
    /// 设置 动态公共属性. 
    /// </summary>
    /// <param name="dynamicSuperProperties">动态公共事件属性获得接口</param>
    public void SetDynamicSuperProperties(IDynamicSuperProperties dynamicSuperProperties)
    {
        if (IsInitOK)
            ThinkingAnalyticsAPI.SetDynamicSuperProperties(dynamicSuperProperties);
    }


    /// <summary>
    /// 删除某个公共事件属性.
    /// </summary>
    /// <param name="property">属性名称</param>
    public void UnsetSuperProperty(string property) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.UnsetSuperProperty(property);
    }

    /// <summary>
    /// 清空公共事件属性.
    /// </summary>
    public void ClearSuperProperties() {
        if(IsInitOK)
            ThinkingAnalyticsAPI.ClearSuperProperties();

    }


    /// <summary>
    /// 获得事件预置属性
    /// </summary>
    /// <returns>事件预置属性</returns>
    public TDPresetProperties GetPresetProperties() {
        if (IsInitOK)
            return ThinkingAnalyticsAPI.GetPresetProperties();
        else
            return null;
    }

    /* ------------------------------------------------------------------------ Track Event ------------------------------------------------------------------------ */

    public void TrackEvent(string eventName)
    {
        if (IsInitOK)
            ThinkingAnalyticsAPI.Track(eventName);
    }

    /// <summary>
    /// 上传事件 / 追踪事件 
    /// </summary>
    /// <param name="taEvent"></param>
    public void TrackEvent(ThinkingAnalyticsEvent taEvent) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.Track(taEvent);
    }

    /// <summary>
    ///  上传事件 / 追踪事件 
    /// </summary>
    /// <param name="eventName"> 事件名称</param>
    /// <param name="properties">事件上传参数</param>
    public void TrackEvent(string eventName, Dictionary<string, object> properties) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.Track(eventName, properties);
    }


    /// <summary>
    /// track 事件及事件属性，并指定 #event_time 属性.
    /// <para>该事件会先缓存在本地，达到触发上报条件或者主动调用 Flush 时会上报到服务器.</para>
    /// <para>从 v1.3.0 开始，会考虑 date 的时区信息。支持 UTC 和 local 时区.</para>
    /// </summary>
    /// <param name="eventName">事件名称</param>
    /// <param name="properties">事件属性</param>
    /// <param name="date">事件时间</param>
    public void TrackEvent(string eventName, Dictionary<string, object> properties, DateTime date){
        if(IsInitOK)
            ThinkingAnalyticsAPI.Track(eventName, properties, date);
    }


    /* --------------------- timer Track Event --------------------- */

    /// <summary>
    /// 开始 计时 追踪事件，并开始计时（需要与 <seealso cref="EndTimeTrackEvent"/> 一同使用）
    /// </summary>
    /// <param name="eventName"></param>
    public void StartTimeTrackEvent(string eventName) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.TimeEvent(eventName);

    }

    /// <summary>
    /// 结束 计时 追踪事件，并上传事件（需要与 <seealso cref="StartTimeTrackEvent"/> 一同使用）
    /// </summary>
    /// <param name="eventName">事件名称</param>
    public void EndTimeTrackEvent(string eventName){
        if(IsInitOK)
            TrackEvent(eventName);
    }


    /// <summary>
    /// 结束 计时 追踪事件，并上传事件（需要与 <seealso cref="StartTimeTrackEvent"/> 一同使用）
    /// </summary>
    /// <param name="eventName">事件名称</param>
    /// <param name="properties">事件属性</param>
    public void EndTimeTrackEvent(string eventName, Dictionary<string, object> properties) {
        if (IsInitOK)
            TrackEvent(eventName,properties);
    }


    /// <summary>
    /// 结束 计时 追踪事件，并上传事件（需要与 <seealso cref="StartTimeTrackEvent"/> 一同使用）
    /// </summary>
    /// <param name="eventName">事件名称</param>
    /// <param name="properties">事件属性</param>
    /// <param name="date">事件时间</param>
    public void EndTimeTrackEvent(string eventName, Dictionary<string, object> properties, DateTime date) {
        if (IsInitOK)
            TrackEvent(eventName, properties, date);
    }

    /* --------------------- first Track Event --------------------- */

    /// <summary>
    /// 首次上传事件 / 首次追踪事件  
    /// </summary>
    /// <param name="eventName">事件名称</param>
    public void TrackFirstEvent(string eventName)
    {
        if (IsInitOK) {
            var te = new TDFirstEvent(eventName, new Dictionary<string, object>());
            TrackEvent(te);
        }
    }

    /// <summary>
    /// 首次上传事件 / 首次追踪事件  
    /// </summary>
    /// <param name="eventName">事件名称</param>
    /// <param name="properties">事件属性</param>
    public void TrackFirstEvent(string eventName, Dictionary<string, object> properties) {
        if (IsInitOK) {
            var te = new TDFirstEvent(eventName, properties);
            TrackEvent(te);
        }
    }


    /// <summary>
    /// 首次上传事件 / 首次追踪事件  
    /// </summary>
    /// <param name="eventName">事件名称</param>
    /// <param name="firstCheckId">将设备ID设置为首次事件的#first_check_id，该标识作为首次事件校验的标准</param>
    public void TrackFirstEvent(string eventName,string firstCheckId) {
        if (IsInitOK) {
            var te = new TDFirstEvent(eventName, new Dictionary<string, object>());
            te.SetFirstCheckId(firstCheckId);
            TrackEvent(te);
        }
    }

    /// <summary>
    /// 首次上传事件 / 首次追踪事件  
    /// </summary>
    /// <param name="eventName">事件名称</param>
    /// <param name="firstCheckId">将设备ID设置为首次事件的#first_check_id，该标识作为首次事件校验的标准</param>
    /// <param name="properties">事件属性</param>
    public void TrackFirstEvent(string eventName, string firstCheckId, Dictionary<string, object> properties) {
        if (IsInitOK) {
            var te = new TDFirstEvent(eventName, properties);
            te.SetFirstCheckId(firstCheckId);
            TrackEvent(te);
        }
    }


    /* --------------------- U*pdatable Track Event --------------------- */

    /// <summary>
    /// 上传可被更新事件  
    /// </summary>
    /// <param name="eventName">事件名称</param>
    /// <param name="eventId">事件 id</param>
    public void TrackUpdatableEvent(string eventName, string eventId)
    {
        if (IsInitOK) {
            var te = new TDUpdatableEvent(eventName, new Dictionary<string, object>(), eventId);
            TrackEvent(te);
        }
    }

    /// <summary>
    /// 上传可被更新事件 
    /// </summary>
    /// <param name="eventName">事件名称</param>
    /// <param name="properties">事件属性</param>
    /// <param name="eventId">事件 id</param>
    public void TrackUpdatableEvent(string eventName, Dictionary<string, object> properties, string eventId)
    {
        if (IsInitOK) {
            var te = new TDUpdatableEvent(eventName, properties, eventId);
            TrackEvent(te);
        }
    }

    /* --------------------- Overwrite Track Event --------------------- */
    /// <summary>
    /// 上传可被重写事件  
    /// </summary>
    /// <param name="eventName">事件名称</param>
    /// <param name="eventId">事件 id</param>
    public void TrackOverWritableEvent(string eventName, string eventId) {
        if (IsInitOK) {
            var te = new TDOverWritableEvent(eventName, new Dictionary<string, object>(), eventId);
            TrackEvent(te);
        }
    }

    /// <summary>
    /// 上传可被重写事件 
    /// </summary>
    /// <param name="eventName">事件名称</param>
    /// <param name="properties">事件属性</param>
    /// <param name="eventId">事件 id</param>
    public void TrackOverWritableEvent(string eventName, Dictionary<string, object> properties, string eventId) {
        if (IsInitOK){
            var te = new TDOverWritableEvent(eventName, properties, eventId);
            TrackEvent(te);
        }
    }


    /* ------------------------------------------------------------------------ TA State Setting ------------------------------------------------------------------------ */

    /// <summary>
    /// 主动触发上报缓存事件到服务器. 
    /// </summary>
    public void Flush() {
        if(IsInitOK)
            ThinkingAnalyticsAPI.Flush();
    }

    /// <summary>
    /// 设置数据上报状态 : 暂停数据上报
    /// </summary>
    public void Pause() {
        if(IsInitOK)
            ThinkingAnalyticsAPI.SetTrackStatus(TA_TRACK_STATUS.PAUSE);
    }

    /// <summary>
    /// 设置数据上报状态 : 停止数据上报，并清除缓存
    /// </summary>
    public void Stop() {
        if(IsInitOK)
            ThinkingAnalyticsAPI.SetTrackStatus(TA_TRACK_STATUS.STOP);
    }

    /// <summary>
    /// 设置数据上报状态 : 恢复数据上报
    /// </summary>
    public void Resume() {
        if(IsInitOK)
            ThinkingAnalyticsAPI.SetTrackStatus(TA_TRACK_STATUS.NORMAL);
    }

    /// <summary>
    /// 设置数据上报状态 : 数据入库，但不上报
    /// </summary>
    public void SaveOnly() {
        if(IsInitOK)
            ThinkingAnalyticsAPI.SetTrackStatus(TA_TRACK_STATUS.SAVE_ONLY);
    }


    /// <summary>
    /// 传入时间戳校准 SDK 时间.
    /// </summary>
    /// <param name="timestamp">当前 Unix timestamp, 单位 毫秒</param>
    public void CalibrateTime(long timestamp){
        if(IsInitOK)
            ThinkingAnalyticsAPI.CalibrateTime(timestamp);
    }

    /// <summary>
    /// 传入 NTP Server 地址校准 SDK 时间.
    ///
    /// <para>您可以根据您用户所在地传入访问速度较快的 NTP Server 地址, 例如 time.asia.apple.com</para>
    /// 
    /// SDK 默认情况下会等待 3 秒，去获取时间偏移数据，并用该偏移校准之后的数据.
    /// 如果在 3 秒内未因网络原因未获得正确的时间偏移，本次应用运行期间将不会再校准时间.
    ///
    /// </summary>
    /// <param name="timestamp">可用的 NTP 服务器地址</param>
    public void CalibrateTimeWithNtp(string ntpServer) {
        if(IsInitOK)
            ThinkingAnalyticsAPI.CalibrateTimeWithNtp(ntpServer);
    }

}
