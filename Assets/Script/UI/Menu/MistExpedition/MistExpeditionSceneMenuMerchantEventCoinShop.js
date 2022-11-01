/*
 * @FileName:		MistExpeditionSceneMenuMerchantEventCoinShop.js
 * @Author:			lisong
 * @Date:			2022-04-08 03:33:04
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 商人 - 远征币商店
 *
*/


public class MistExpeditionSceneMenuMerchantEventCoinShop extends UIObject {

    @Space(30) @Header("---------- MistExpedition SceneMenu MerchantEvent CoinShop ----------")


    @Header("----------language key")
    @SerializeField private var langKey_itemName: String;
    @SerializeField private var langKey_itemDesc: String;

    @Space(20)
    @SerializeField private var mistExpeditionCoinImgBG: Label;
    @SerializeField private var mistExpeditionCoinImg: Label;
    @SerializeField private var mistExpeditionCoinLabel: Label;

    @Space(20)
    @SerializeField private var scrollList: ScrollList;
    @SerializeField private var item: MistExpeditionSceneMenuMerchantEventCoinShopItem;


    private var itemlist: System.Collections.Generic.List.<MistExpeditionSceneMenuMerchantEventCoinShopItem>;


    private var eventPointId: int = 0;
    private var itemShopInfo: HashObject;
    private var itemId: String;

    public function Init() {
        super.Init();

        mistExpeditionCoinImgBG.Init();
        mistExpeditionCoinImg.Init();
        mistExpeditionCoinLabel.Init();


        item.Init();
        scrollList.Init(item);
    }

    public function Draw() {
        if (!visible)
            return;

        scrollList.Draw();

        mistExpeditionCoinImgBG.Draw();
        mistExpeditionCoinImg.Draw();
        mistExpeditionCoinLabel.Draw();


    }

    public function Update() {
    if (scrollList != null)
        scrollList.Update();
    }

    public function SetData(epId: int): void {

        RefreshMistExpeditionCoin();

        eventPointId = epId;

        var okFunc: Function = function (result: HashObject) {
            var array: Array = new Array();

            if (result != null && result.Contains("ok")) {

                var itemDataStr: Array = _Global.GetObjectValues(result["result"]["coin"]);
                for (var i: int = 0; i < itemDataStr.length; i++) {

                    var itemDataHash: HashObject = itemDataStr[i] as HashObject;
                    var buffID: String = itemDataHash["buff"].Value.ToString();
                    var price: String = itemDataHash["price"].Value.ToString();
                    var limit: String = itemDataHash["limit"].Value.ToString();
                    var purchased: String = itemDataHash["purchased"].Value.ToString();/*购买的次数*/

                    var data: HashObject = new HashObject({
                        "ctr": this,
                        "buff": buffID,
                        "name": Datas.getArString(langKey_itemName + buffID),
                        "price": price,
                        "desc": Datas.getArString(langKey_itemDesc + buffID),
                        "limit": limit,
                        "purchased": purchased
                    });
                    MistExpeditionManager.GetInstance().SetMistExpeditionShopCoinDicItem(buffID, data);/*存储 远征商人 远征币 商品信息*/
                    array.push(data);
                }

            } else {
                #if UNITY_EDITOR
                Debug.LogWarning("<color=#FF7070FF> CoinShop no item data </color>");
                #endif
               
            }

            array.Sort(function (objA: Object, objB: Object) {
                return _Global.INT32((objB as HashObject)["buff"].Value) - _Global.INT32((objA as HashObject)["buff"].Value);
            });
            MistExpeditionSceneMenuMerchantEventCoinShopItem.ResetDescShowState();

            scrollList.Clear();
            scrollList.SetData(array);
            scrollList.ResetPos();


            itemlist = new System.Collections.Generic.List.<MistExpeditionSceneMenuMerchantEventCoinShopItem>();
            var itemArr: Array = scrollList.GetItemLists().ToArray();
            for (var j = 0; j < itemArr.Count; j++) {
                itemlist.Add(itemArr[j] as MistExpeditionSceneMenuMerchantEventCoinShopItem);
            }

        };

        var okFunc2: Function = function () {

            var array_Dic: Array = new Array();
            var shopCoinDic: Dictionary.<String, HashObject> = MistExpeditionManager.GetInstance().GitMistExpeditionShopCoinDic();
            if (shopCoinDic != null) {
                for (var key: KeyValuePair.<String, HashObject> in shopCoinDic) {
                    var shopCoinItem: HashObject = key.Value as HashObject;

                    var buffID_Dic: String = shopCoinItem["buff"].Value.ToString();
                    var price_Dic: String = shopCoinItem["price"].Value.ToString();
                    var limit_Dic: String = shopCoinItem["limit"].Value.ToString();
                    var purchased_Dic: String = shopCoinItem["purchased"].Value.ToString();/*购买的次数*/

                    var data_Dic: HashObject = new HashObject({
                        "ctr": this,
                        "buff": buffID_Dic,
                        "name": Datas.getArString(langKey_itemName + buffID_Dic),
                        "price": price_Dic,
                        "desc": Datas.getArString(langKey_itemDesc + buffID_Dic),
                        "limit": limit_Dic,
                        "purchased": purchased_Dic
                    });

                    array_Dic.push(data_Dic);
                }

                array_Dic.Sort(function (objA_Dic: Object, objB_Dic: Object) {
                    return _Global.INT32((objB_Dic as HashObject)["buff"].Value) - _Global.INT32((objA_Dic as HashObject)["buff"].Value);
                });
                MistExpeditionSceneMenuMerchantEventCoinShopItem.ResetDescShowState();

                scrollList.Clear();
                scrollList.SetData(array_Dic);
                scrollList.ResetPos();
            } else {
                #if UNITY_EDITOR
                Debug.LogWarning("<color=#FF7070FF> CoinShopDic no item data </color>");
                #endif
            }


            itemlist = new System.Collections.Generic.List.<MistExpeditionSceneMenuMerchantEventCoinShopItem>();
            var itemArr: Array = scrollList.GetItemLists().ToArray();
            for (var jj = 0; jj < itemArr.Count; jj++) {
                itemlist.Add(itemArr[jj] as MistExpeditionSceneMenuMerchantEventCoinShopItem);
            }

        };


        if (!MistExpeditionManager.GetInstance().IsMistExpeditionShopCoinDic()) {

            UnityNet.reqMistExpeditionEventMerchantGetItemList(eventPointId, okFunc, null);

        } else {

            okFunc2();

        }

       
    }



    public function OnPop() {
        MistExpeditionSceneMenuMerchantEventCoinShopItem.DestroyDescShowState();
        scrollList.Clear();

    }

    /* 购买  buff item 物品 */
    public function BuyItem(price: int, itemID:int) {
        if (price > MistExpeditionManager.GetInstance().GetCurrentExpeditionResidueCoinCount())
            return;

        var okFunc: Function = function (result: HashObject) {
            if (result != null && result["result"].Contains("status") && _Global.GetBoolean(result["result"]["status"].Value)) {
                /*把购买完成后的远征币数量更新到远征基数数据里面*/
                MistExpeditionManager.GetInstance().SetExpeditionBuffInfo(result["result"]["data"]["playerBuffs"].Value);/*更新buff信息*/

                itemId = result["result"]["data"]["buffInfo"]["buff"].Value.ToString();
                MistExpeditionManager.GetInstance().SetMistExpeditionShopCoinDicItem(itemId, result["result"]["data"]["buffInfo"]);/*存储 远征商人 远征币 商品信息*/

                MistExpeditionManager.GetInstance().SetCurrentExpeditionResidueCoinCount(_Global.INT32(result["result"]["data"]["currentExpeditionResidueCoin"]));
                MistExpeditionManager.GetInstance().ExecuteExpeditionDataUpdateCallbackDic("RefreshMistExpeditionCoin");/*迷雾远征主场景金币刷新*/
                RefreshItemBuyBtnClickableState();
                MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.BuySuccess"));
            } else {
                Debug.Log("<color=#ff6611ff>coin buy item error! result: " + result.ToString() + "</color>");
            }

        };

        var errorFunc: Function = function (errorMsg: String, errorCode: String) {
            Debug.Log("<color=#FF2D66FF>coin buy item error! errorCode: " + errorCode + "\terrorMsg: " + errorMsg+ "</color>");
        };

        UnityNet.reqMistExpeditionEventMerchantBuyItemByCoin(eventPointId, itemID, okFunc, errorFunc);
    }


    /* 刷新所有的 item的 购买按钮的可点击状态 */
    private function RefreshItemBuyBtnClickableState() {

        for (var i: int = 0; i < itemlist.Count; i++) {
            itemlist[i].RefreshBuySucceedBtnClickableState(itemId);
        }

        RefreshMistExpeditionCoin();
    }


    /* 刷洗界面上的远征币的显示 */
    private function RefreshMistExpeditionCoin() {
        mistExpeditionCoinLabel.txt = Datas.getArString("Common.Owned") + ": " + MistExpeditionManager.GetInstance().GetCurrentExpeditionResidueCoinCount();
    }

}