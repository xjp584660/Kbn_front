



public class CitySkinPropView extends UIObject {
     
    @Space(30) @Header("----------CitySkinPropView----------") 

    public var imageBG: Label;
    public var imageTitleBG: Label;

    public var btnBack: Button;

    public var scrollList: ScrollList;
    public var citySkinPropViewItem: CitySkinPropViewItem;



    /*选择的city skin 的id */
    private var clickCitySkinItemId: String;

    private var IsCanBackBtnClick: boolean = true;/* 是否可以点击返回按钮 */

    function Init() {
        imageBG.Init();
        imageTitleBG.Init();

        btnBack.Init();
        scrollList.Init(citySkinPropViewItem);
        IsCanBackBtnClick = true;
        clickCitySkinItemId = "";
        btnBack.OnClick = handleBackClick;
    }

    function Draw() {

        if (!visible) return;

        GUI.BeginGroup(rect);
        imageBG.Draw();
        imageTitleBG.Draw();

        btnBack.Draw();
        scrollList.Draw();


        GUI.EndGroup();	
    }

    /*
     function Update() {
        scrollList.Update();
    }
    */

    function FixedUpdate() {
        scrollList.Update();
    }




    public function Clear() {

        scrollList.Clear();
    }

 

    public function SetListData(skinID: String, data: HashObject): void {
       

        /*
       //-------------------------------默认：未使用
       ["skinid"]      = "1"
       ["skinres"]     = "skinres_0"
       ["isdefault"]   = "1"						//当前皮肤是否是默认皮肤
       ["itemids"]     = ""
       ["buffids"]     = ""


       //-------------------------------其他： 以启用 以使用
       ["skinid"]      = "2"
       ["skinres"]     = "skinres_1"
       ["isdefault"]   = "0"
       ["itemids"]     =  {					// 道具物品列表
							[33009] = "121" ,table = { buyFrequency , buyitemlimit , quantityNet  , limitbuytime}
							[33010] = "0"
							[33011] = "0"
							[33012] = "0"
							}
       ["buffids"]     = "445"

       ["cityid"]      = "2561"
       ["playerid"]    = "1618"
       ["inuse"]       = "1"					//当前使用的是否是该皮肤，当没有该字段或者是 值为 0时，表示不在使用中
       ["begintime"]   = "2022-01-05 16:47:58"	//皮肤启用 的 开始时间戳；以启用的会出现该字段
       ["endtime"]     = "2022-02-25 16:48:01"	//皮肤启用 的 结束时间戳；以启用的会出现该字段
	   ["creattime"]	= "2022-01-05 16:47:58"	//皮肤的上架销售时间


       //-------------------------------其他： 未启用
       ["skinid"]      = "3"
       ["skinres"]     = "skinres_2"
       ["isdefault"]   = "0"
	   ["itemids"]     = {[33006],[33007],[33008]}
       ["buffids"]     = "443"

        */

        clickCitySkinItemId = skinID;

        if (!data.Contains("itemids"))
            return;

        /*解析皮肤道具列表信息*/
  
        var array: Array = new Array();
        
        for (var id: String in  data["itemids"].Keys) {

            var itemData: Hashtable = {
                "prop_id": id,
                "icon_name": "skinres_" + id,
                "item_name_key": "ItemName.i" + id,
                "desc_key": "ItemDesc.i" + id,
                "item_state": data["itemids"][id]
            };

            array.push(itemData);

        }  
        scrollList.Clear();
        scrollList.SetData(array);

         
        scrollList.ResetPos();

        var itemArr: Array = scrollList.GetItemLists().ToArray();
        for (var j: int = 0; j < itemArr.Count; j++) {
            (itemArr[j] as CitySkinPropViewItem).SetCitySkinPropView(this);
        }

    }


 
 
    /*返回上一级*/
    private function handleBackClick(): void {
    if (!IsCanBackBtnClick)
        return;

        var castleMenu: NewCastleMenu = GetCastleMenu();
        if (castleMenu) {
            castleMenu.overviewContent.popCitySkinPropView();
        }
    }

    /*购买道具限制检测 */
    public function CheckLimitStateOfBuyCitySkinProp(citySkinPropId: int, okFunc: Function, errorFunc: Function) {

        var citySkinView: CitySkinView = GetCitySkinView();
        if (citySkinView != null) {
            citySkinView.CheckLimitStateOfBuyCitySkinProp(citySkinPropId, okFunc, errorFunc);
        }

    }

    /*购买道具 */
    public function reqCityReplaceSkinBuySkinProp(citySkinPropId: int,buyCnt: int, okFunc: Function, errorFunc: Function) {

        var citySkinView: CitySkinView = GetCitySkinView();
        if (citySkinView != null) {
            citySkinView.BuySkinProp(citySkinPropId, buyCnt, okFunc, errorFunc);
        }

    }

    /*购买道具完成后的回调，更新道具数据 */
    public function UpdateCitySkinProp(citySkinPropId: int) {

        var citySkinView: CitySkinView = GetCitySkinView();
        if (citySkinView != null) {
            citySkinView.UpdateCitySkinProp(citySkinPropId);
    }

}


    /*使用皮肤道具 */
    public function UseCitySkinProp(citySkinPropId: int, okFunc: Function, errorFunc: Function) {

        var citySkinView: CitySkinView = GetCitySkinView();
        if (citySkinView != null) {
            citySkinView.UseCitySkinProp(clickCitySkinItemId, citySkinPropId, okFunc, errorFunc);
        }
    }


    /*皮肤是否处于激活状态 */
    public function IsSkinActive(): boolean {
        var citySkinView: CitySkinView = GetCitySkinView();
        if (citySkinView == null)
            return false;

        return citySkinView.GetSkinRemainTimeByID(clickCitySkinItemId) > 0;
    }


    /*刷新 道具列表（依据购买、使用道具后，后端返回的 城堡皮肤的全部数据）*/
    public function RefershScrollList(data: HashObject) {
        var citySkinView: CitySkinView = GetCitySkinView();
        if (citySkinView != null) {

            IsCanBackBtnClick = false;/* 先禁止返回按钮的点击，在数据刷新后再回复，以免数据还未刷新完成，就返回，造成 cityskin 列表不显示*/
            var callbackFunc: Function = function () { IsCanBackBtnClick = true; };
            /*先更新数据*/
            citySkinView.UpdateCitySkinData(data, callbackFunc);
            /*获得 更新后 的新的 道具列表数据*/
            var detailData: HashObject = citySkinView.GetSkinDetailDataByID(clickCitySkinItemId);
            /*刷新列表*/
            SetListData(clickCitySkinItemId, detailData);

        }
    }


    /* 网络链接错误 弹出框 */
    public function PopUpErrorInfo(errorMsg: String, errorCode: String, isCanClosed: boolean, retryFunc: Function, closeFunc: Function) {
        var citySkinView: CitySkinView = GetCitySkinView();
        if (citySkinView != null) {
            citySkinView.PopUpErrorInfo(errorMsg, errorCode, isCanClosed, retryFunc, closeFunc);
        }
    }


    private function GetCastleMenu(): NewCastleMenu{
        return  MenuMgr.getInstance().getMenu("NewCastleMenu") as NewCastleMenu;
    }


    private function GetCitySkinView(): CitySkinView {
        var castleMenu: NewCastleMenu = GetCastleMenu();
        if (castleMenu != null)
            return castleMenu.overviewContent.citySkinView;
        else
            return null;
    }

}