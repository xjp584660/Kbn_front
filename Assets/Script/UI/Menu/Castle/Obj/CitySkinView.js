



public class CitySkinView extends UIObject {

    @Space(30) @Header("----------CitySkinView----------")



    public var imageBG: Label;
    public var imageTitleBG: Label;
    public var labelTipsInfo: Label;

    public var helpBtn: Button;

    public var scrollList: ScrollList;
    public var citySkinViewItem: CitySkinViewItem;



    private var citySkinItemArr: Array;/*所有的 city skin的 item */

    private var currentCitySkinId: String;/* 当前的选中的 city skin*/

    private var citySkinData: HashObject;/* city skin 的数据*/


    public static var DefaultCitySkinId: String;/*默认的 city skin 的ID */

    @HideInInspector
    public var IsCitySkinUpdated: boolean;/*city skin 是否已经更新 */



     function Init() {
       

         imageBG.Init();
         imageTitleBG.Init();

        labelTipsInfo.Init();

        helpBtn.Init();
        helpBtn.OnClick = onGameHelpClickHandler;

         scrollList.Init(citySkinViewItem);

        citySkinItemArr = new Array();

        currentCitySkinId = null;
         labelTipsInfo.txt = Datas.getArString("CastleSkin.Text1");

         DefaultCitySkinId = "1";
         IsCitySkinUpdated = false;
     }




    function Draw() {

        if (!visible) return;

        GUI.BeginGroup(rect);


        imageBG.Draw();
        imageTitleBG.Draw();

        labelTipsInfo.Draw();

        helpBtn.Draw();

        if (scrollList != null)
            scrollList.Draw();


        GUI.EndGroup();
    }


    function FixedUpdate() {
        if (IsHaveData() && scrollList != null)
            scrollList.Update();
    }



    /* 缓存数据只有在 界面关闭时才会完全清空掉 */
    public function Clear() {

        citySkinItemArr = null;
        currentCitySkinId = null;

        DefaultCitySkinId = "1";

        scrollList.Clear();
        citySkinData = null;
    }



    /*是否已经 缓存 数据文件*/
    function IsHaveData(): boolean {
        return citySkinData != null;
    }


    public function SetListData(): void {
        UpdateListDataFromServer();
    }


    /*从 服务器 更新list 列表数据*/
    private function UpdateListDataFromServer(): void {

        if (IsHaveData()) return;

        reqCityReplaceSkinData(okFuncSuccessGetData, FailedGetDataFunc);
    }




    /*成功获得数据 */
    private function okFuncSuccessGetData(result: HashObject) {
        if (!_Global.GetBoolean(result["ok"]))
            return;


        /*缓存数据 */
        citySkinData = result;
        /*更新列表 */
        ItemsUpdateAndOrder();

    }

    /*获得数据失败   */
    private function FailedGetDataFunc(errorMsg: String, errorCode: String) {
        #if UNITY_EDITOR
            Debug.Log(String.Format("[{0}]<color=#FF0099FF>尝试请求 皮肤数据列表数据 失败！    errorMsg:{1}\t errorCode:{2}</color>"
                                , System.DateTime.Now.ToString("HH:mm:ss:fff"), errorMsg, errorCode));
	    #endif

        var retryFunc: Function = function () {
            UpdateListDataFromServer();
        };

        var closeFunc: Function = function () {
        /*  关闭当前的窗口，显示上一个界面 */

            var newCastleMenu = MenuMgr.getInstance().getMenu("NewCastleMenu") as NewCastleMenu;
            if (newCastleMenu != null && newCastleMenu.overviewContent != null) {
                newCastleMenu.overviewContent.BackOtherViewFromCitySkinView();
                Clear();
            }
            
        };


        /* 弹出提示框 */
        PopUpErrorInfo(errorMsg, errorCode, true, retryFunc, closeFunc);
            
    }



    /*对 skin item 进行更新排序*/
    private function ItemsUpdateAndOrder() {
        IsCitySkinUpdated = false;

        currentCitySkinId = null;


        var subItems: HashObject = citySkinData["result"];
        var keys: String[] = _Global.GetObjectKeys(subItems);

        var i: int = 0;
        var j: int = 0;
        var k: int = 0;


        var array: Array = new Array();

        var defaultSkinData: HashObject = null;
        /*以激活列表*/
        var arrayActive: Array = new Array();
        /*未激活列表*/
        var arrayInactive: Array = new Array();

        for (j = 0; j < keys.Length; j++) {

            /*if (keys[j] != ((j+1) +"")) continue;*/

            var data: HashObject = subItems[keys[j]];

            if (data.Contains("inuse") && _Global.INT32(data["inuse"].Value) == 1) {
                if (currentCitySkinId == null) {
                    currentCitySkinId = data["skinid"].Value as String;/* 第一次显示界面时，需要获得当前正在使用的 皮肤 ID */
                }
            }

            if (data.Contains("isdefault") && _Global.INT32(data["isdefault"].Value) == 1) {
                defaultSkinData = data;
                DefaultCitySkinId = data["skinid"].Value as String;/* 获得默认的皮肤 id */

            } else if (data.Contains("endtime")) {
                arrayActive.push(data);
            } else {
                arrayInactive.push(data);
            }
        }


        /*order active ：激活的剩余时间多少排序 ,剩余时间越短，排序越靠上 -- endtime */
        var times: int = arrayActive.Count - 1;

        var data01: HashObject;
        var data02: HashObject;

        for (i = 0; i < times; i++) {

            for (j = i; j < times; j++) {
                data01 = arrayActive[i] as HashObject;
                data02 = arrayActive[j + 1] as HashObject;

                if (!data01.Contains("endtime") || !data02.Contains("endtime")) {
                    continue;
                }

                if (GetRemainTimeOfSkin(data01["endtime"].Value) > GetRemainTimeOfSkin(data02["endtime"].Value)) {
                    arrayActive[i] = data02;
                    arrayActive[j + 1] = data01;
                }
            }

        }


        /* order inactive: 以投放时间先后排序 ,最新投放的在上面 -- creattime */
        times = arrayInactive.Count - 1;

        for (i = 0; i < times; i++) {

            for (j = i; j < times; j++) {
                data01 = arrayInactive[i] as HashObject;
                data02 = arrayInactive[j + 1] as HashObject;

                if (!data01.Contains("creattime") || !data02.Contains("creattime")) {
                    continue;
                }

                if (GetRemainTimeOfSkin(data01["creattime"].Value) < GetRemainTimeOfSkin(data02["creattime"].Value)) {
                    arrayInactive[i] = data02;
                    arrayInactive[j + 1] = data01;
                }
            }

        }


        /* add default  */
        if (defaultSkinData != null)
            array.push(defaultSkinData);

        /* add active*/
        for (j = 0; j < arrayActive.Count; j++) {
            array.push(arrayActive[j] as HashObject);
        }

        /* add inactive */
        for (j = 0; j < arrayInactive.Count; j++) {
            array.push(arrayInactive[j] as HashObject);
        }

        scrollList.Clear();
        scrollList.SetData(array);
        var itemArr: Array = scrollList.GetItemLists().ToArray();

        citySkinItemArr = new Array();
        for (i = 0; i < itemArr.Count; i++) {
            var item: CitySkinViewItem = itemArr[i] as CitySkinViewItem;
            item.SetCitySkinView(this);
            AddCitySkinItemArr(item);
        }



        if (currentCitySkinId == null) {
            currentCitySkinId = DefaultCitySkinId;
        }

        /*将正在使用的皮肤 选中 显示*/
        SelectSkinItem(currentCitySkinId);

        IsCitySkinUpdated = true;
    }


    /* 更新 citySkinData 的数据 */
    public function UpdateCitySkinData(skinData: HashObject, callbackFunc: Function) {
        if (skinData != null) {

            /* 数据是有效的 */
            if (!_Global.GetBoolean(skinData["ok"])) {
                if (callbackFunc != null)
                    callbackFunc();

                return;
            }
            
            okFuncSuccessGetData(skinData);
            RefreshCitySkinModel();
        }

        if (callbackFunc != null)
            callbackFunc();
    }


    public function GetItemByIndex(index: int): CitySkinViewItem {
        if (scrollList != null)
            return scrollList.GetItem(index) as CitySkinViewItem;
        else
            return null;
    }


    /*通过 id 获得 skin item   */
    private function CitySkinViewItemByID(id: String): CitySkinViewItem {

        var itemArr: Array = scrollList.GetItemLists().ToArray();
        for (var i: int = 0; i < itemArr.Count; i++) {
            var item: CitySkinViewItem = itemArr[i] as CitySkinViewItem;
            if (item.GetSkinID() == id)
                return item;
        }

        return null;

    }



    /*通过索引获得 skin的 ID */
    private function GetItemCitySkinIDByIndex(index: int): String {
        var item: CitySkinViewItem = GetItemByIndex(index);
        if (item != null)
            return item.GetSkinID();
        else
            return "";
    }




    /*将各个item添加到集合统一处理 */
    private function AddCitySkinItemArr(item: CitySkinViewItem) {
        var count: int = citySkinItemArr.length;
        for (var i: int = 0; i < count; i++) {
            if ((citySkinItemArr[i] as CitySkinViewItem) == item)
                return;
        }
        citySkinItemArr.push(item);
    }






    /*使用默认的皮肤  */
    public function UseDefaultCitySkin() {
        if (DefaultCitySkinId != null)
            UseCitySkin(DefaultCitySkinId);
    }


    /*使用 皮肤 */
    public function UseCitySkin(citySkinId: String) {

        if (currentCitySkinId == citySkinId) {
            /*可以弹出提示使用的是相同的皮肤的信息*/
            return;
        }


        var okFunc: Function = function (result: HashObject) {
            if (!_Global.GetBoolean(result["ok"]))
                return;

            /* 刷新列表数据 */
            okFuncSuccessGetData(result);
            /* 刷新模型 */
            RefreshCitySkinModel();
         
            /* 底部弹出提示信息 */
            MenuMgr.getInstance().PushMessage(Datas.getArString("CastleSkin.Tips1"));
        };


        var errorFunc: Function = function (errorMsg: String, errorCode: String) {
                /*可以弹出提示未成功使用的信息*/
        #if UNITY_EDITOR
            Debug.LogWarning("未成功使用皮肤： <color=#ff0000>errorMsg:" + errorMsg + "  errorCode:" + errorCode + "</color>");
	    #endif

            PopUpErrorInfo(errorMsg, errorMsg, true, function () { UseCitySkin(citySkinId); }, null);
        };

        reqCityReplaceSkinChangeNewSkin(citySkinId, okFunc, errorFunc);
    }



    /* 刷新 城堡皮肤的模型 */
    private function RefreshCitySkinModel() {
        /*立即刷新皮肤*/
        GameMain.instance().CitySkinUpdateImmediately(currentCitySkinId);

        /*更新 seed 的数据，之后再由seed去确认更正皮肤的更新 */
        GameMain.instance().invokeUpdateSeedInTime(0);
    }




    /*设置skin item 的选中状态*/
    private function SelectSkinItem(citySkinId: String) {

        var count: int = citySkinItemArr.length;
        for (var i: int = 0; i < count; i++) {
            (this.citySkinItemArr[i] as CitySkinViewItem).SetSelectBtnState(citySkinId == GetItemCitySkinIDByIndex(i));
        }

    }


   

    /*切换到 详情界面 */
    public function pushCitySkinPropView(citySkinId: String) {
        var newCastleMenu = MenuMgr.getInstance().getMenu("NewCastleMenu") as NewCastleMenu;
        if (newCastleMenu != null && newCastleMenu.overviewContent != null) {
            var data: HashObject = GetSkinDetailDataByID(citySkinId);
            if (data == null) {
                Debug.LogError("no skin detail info data. skin id:" + citySkinId);
                return;
            }
            newCastleMenu.overviewContent.pushCitySkinPropView(citySkinId, data);
        }
    }


    /*帮助弹窗显示按钮 */
    private function onGameHelpClickHandler() {
        var setting: InGameHelpSetting = new InGameHelpSetting();
        setting.type = "one_context";
        setting.key = Datas.getArString("CastleIbutton.Text1");
        setting.name = Datas.getArString("CastleSkin.Skin");

        MenuMgr.getInstance().PushMenu("InGameHelp", setting, "trans_horiz");
    }

    /*根据皮肤的 id 获得 对应 皮肤的相关数据*/
    public function GetSkinDetailDataByID(citySkinId: String): HashObject {

        if (citySkinData == null)
            return null;


        var subItems: HashObject = citySkinData["result"];
        var keys: String[] = _Global.GetObjectKeys(subItems);

        for (var j: int = 0; j < keys.Length; j++) {
            var data: HashObject = subItems[keys[j]];
            if (citySkinId == (data["skinid"].Value as String)) {
                return data;
            }

        }
        return null;

    }


    /*获得皮肤的激活剩余时间 */
    public function GetSkinRemainTimeByID(citySkinId: String): long {
        var data: HashObject = GetSkinDetailDataByID(citySkinId);

        if (data != null) {
            if (data.Contains("endtime") && data["endtime"].Value != null && (data["endtime"].Value as String) != "") {
                return GetRemainTimeOfSkin(data["endtime"].Value);
            }
        }

        return 0;
    }






    /*使用城堡皮肤道具 */
    public function UseCitySkinProp(citySkinId: String, citySkinPropId: int, okFunc: Function, errorFunc: Function) {

        var okFuncCallback: Function = function (result: HashObject) {
            if (!_Global.GetBoolean(result["ok"])) return;

            /*CitySkinViewItemByID(citySkinId).UpdateState();*/

            okFunc(result);
        };

        var errorFuncCallback: Function = function (errorMsg: String, errorCode: String) {
            errorFunc(errorMsg, errorCode);
        };


        reqCityReplaceSkinUseSkinProp(citySkinPropId,okFuncCallback, errorFuncCallback);

    }




    /*解析时间戳 Ticks */
    private static function DateTimeChatToTicksWithFormat(timeStampObj: Object): long {

        return _Global.DateTimeChatToTicksWithFormat(timeStampObj as String, "yyyy-MM-dd HH:mm:ss");
    }

    /*获得皮肤的时间戳 */
    public static function GetSkinTimeStamp(timeStampObj: Object): long {

        return _Global.DateTimeTicksToUnixTimestamp(DateTimeChatToTicksWithFormat(timeStampObj));
    }


    /*获得皮肤时间戳距离现在的剩余时间 */
    public static function GetRemainTimeOfSkin(timeStampObj: Object): long {

        return GetSkinTimeStamp(timeStampObj) - GameMain.unixtime();

    }


    /* 网络链接错误 弹出框 */
    public function PopUpErrorInfo(errorMsg: String, errorCode: String, isCanClosed: boolean, retryFunc: Function, closeFunc: Function) {

        var msg: String = errorCode == UnityNet.NET_ERROR ? Datas.getArString("Error.Network_error") : UnityNet.localError(errorCode, errorMsg, null);

        if (msg != null) {
            ErrorMgr.instance().PushError("", msg, isCanClosed, Datas.getArString("FTE.Retry"), retryFunc, closeFunc);
        }
    }

/************* unity net **************************************/


    /* 获得 城堡皮肤列表数据 */
    private function reqCityReplaceSkinData(okFunc: Function, errorFunc: Function) {
        var cityId: int = GameMain.instance().getCurCityId();
        UnityNet.reqCityReplaceSkinData(cityId, okFunc, errorFunc);

    }

    /* 替换 城堡皮肤 */
    private function reqCityReplaceSkinChangeNewSkin(citySkinId: String, okFunc: Function, errorFunc: Function) {
        var cityId: int = GameMain.instance().getCurCityId();
        UnityNet.reqCityReplaceSkinChangeNewSkin(cityId, _Global.INT32(citySkinId),okFunc, errorFunc);

    }

    /* 使用 城堡皮肤道具 */
    private function reqCityReplaceSkinUseSkinProp(citySkinPropId: int, okFunc: Function, errorFunc: Function) {
        var cityId: int = GameMain.instance().getCurCityId();
        UnityNet.reqCityReplaceSkinUseSkinProp(cityId, citySkinPropId, okFunc, errorFunc);

    }

    /*检测购买城堡皮肤道具的限制  是否可以购买道具（由服务器的判断，防止玩家盗刷数据） */
    public function CheckLimitStateOfBuyCitySkinProp(citySkinPropId: int, okFunc: Function, errorFunc: Function) {
        var cityId: int = GameMain.instance().getCurCityId();
        UnityNet.reqCityReplaceSkinCheckBuyLimitState(cityId, citySkinPropId,okFunc, errorFunc);
    }

    /*购买城堡皮间道具 */
    public function BuySkinProp(citySkinPropId: int, buyCnt: int, okFunc: Function, errorFunc: Function) {
        var cityId: int = GameMain.instance().getCurCityId();
        UnityNet.reqCityReplaceSkinBuySkinProp(cityId, citySkinPropId, buyCnt, okFunc, errorFunc);
    }


    /*购买 城堡皮肤道具后，需要更新玩家的道具数据 */
    public function UpdateCitySkinProp(citySkinPropId: int) {
        var cityId: int = GameMain.instance().getCurCityId();
        UnityNet.reqCityReplaceSkinUpdateProp(cityId, citySkinPropId, null, null);
    }


/*************************************************************/



}