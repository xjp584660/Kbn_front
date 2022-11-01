/*
 * @FileName:		MistExpeditionSceneMenuMerchantEventGemsShop.js
 * @Author:			lisong
 * @Date:			2022-04-08 03:33:17
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 商人 - 宝石折扣商店
 *
*/


public class MistExpeditionSceneMenuMerchantEventGemsShop extends UIObject {

    @Space(30) @Header("---------- MistExpedition SceneMenu MerchantEvent GemsShop ----------")


    @Header("----------language key")
    @SerializeField private var langKey_itemName: String;
    @SerializeField private var langKey_itemDesc: String;
    @Space(20)


    @Space(20)
    @SerializeField private var mistExpeditionCoinImgBG: Label;
    @SerializeField private var mistExpeditionCoinImg: Label;
    @SerializeField private var mistExpeditionCoinLabel: Label;


    @Space(20)
    @SerializeField private var scrollList: ScrollList;
    @SerializeField private var item: MistExpeditionSceneMenuMerchantEventGemsShopItem;



    private var itemlist: System.Collections.Generic.List.<MistExpeditionSceneMenuMerchantEventGemsShopItem>;

    private var eventPointId: int = 0;
    private var itemcost: int;
    private var purchasedId: int;
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

        RefreshMistExpeditionGems();

        eventPointId = epId;


        var okFunc: Function = function (result: HashObject) {
            var array: Array = new Array();

            if (result != null && result.Contains("ok")) {

                var itemDataStr: Array = _Global.GetObjectValues(result["result"]["gems"]);
           
                for (var i: int = 0; i < itemDataStr.length; i++) {

                    var itemDataHash: HashObject = itemDataStr[i] as HashObject;
                    var buffID: String = itemDataHash["buff"].Value.ToString();
                    var price: String = itemDataHash["price"].Value.ToString();
                    var discount: String = itemDataHash["discount"].Value.ToString();/*打折后价格*/
                    var limit: String = itemDataHash["limit"].Value.ToString();
                    var purchased: String = itemDataHash["purchased"].Value.ToString();/*购买的次数*/

                    var data: HashObject = new HashObject({
                        "ctr": this,
                        "buff": buffID,
                        "name": MystryChest.instance().GetChestName(_Global.INT32(buffID)),
                        "price": price,
                        "discount": discount,
                        "desc": MystryChest.instance().GetChestDesc(_Global.INT32(buffID)),
                        "limit": limit,
                        "purchased": purchased
                    });
                    MistExpeditionManager.GetInstance().SetMistExpeditionShopPayDicItem(buffID, data);/*缓存 远征商人信息*/
                    array.push(data);
                }

            } else {
                #if UNITY_EDITOR
                Debug.LogWarning("<color=#FF7070FF> CoinShop no item data </color>");
                #endif

            }

            MistExpeditionSceneMenuMerchantEventGemsShopItem.ResetDescShowState();

            scrollList.Clear();
            scrollList.SetData(array);
            scrollList.ResetPos();


            itemlist = new System.Collections.Generic.List.<MistExpeditionSceneMenuMerchantEventGemsShopItem>();
            var itemArr: Array = scrollList.GetItemLists().ToArray();
            for (var j = 0; j < itemArr.Count; j++) {
                itemlist.Add(itemArr[j] as MistExpeditionSceneMenuMerchantEventGemsShopItem);
            }

        };


        var okFunc2: Function = function () {

            var array_Dic: Array = new Array();
            var shopGmesDic: Dictionary.<String, HashObject> = MistExpeditionManager.GetInstance().GitMistExpeditionShopPayDic();
            if (shopGmesDic != null) {

                for (var key: KeyValuePair.<String, HashObject> in shopGmesDic) {

                    var shopGmesItem: HashObject = key.Value as HashObject;

                    var buffID_Dic: String = shopGmesItem["buff"].Value.ToString();
                    var price_Dic: String = shopGmesItem["price"].Value.ToString();
                    var discount_Dic: String = shopGmesItem["discount"].Value.ToString();/*打折后价格*/
                    var limit_Dic: String = shopGmesItem["limit"].Value.ToString();
                    var purchased_Dic: String = shopGmesItem["purchased"].Value.ToString();/*购买的次数*/

                    var data_Dic: HashObject = new HashObject({
                        "ctr": this,
                        "buff": buffID_Dic,
                        "name": MystryChest.instance().GetChestName(_Global.INT32(buffID_Dic)),
                        "price": price_Dic,
                        "discount": discount_Dic,
                        "desc": MystryChest.instance().GetChestDesc(_Global.INT32(buffID_Dic)),
                        "limit": limit_Dic,
                        "purchased": purchased_Dic
                    });


                    array_Dic.push(data_Dic);
                }

            } else {
                 #if UNITY_EDITOR
                Debug.LogWarning("<color=#FF7070FF> GmesShop no item data </color>");
                #endif

            }

            MistExpeditionSceneMenuMerchantEventGemsShopItem.ResetDescShowState();

            scrollList.Clear();
            scrollList.SetData(array_Dic);
            scrollList.ResetPos();

            itemlist = new System.Collections.Generic.List.<MistExpeditionSceneMenuMerchantEventGemsShopItem>();
            var itemArr: Array = scrollList.GetItemLists().ToArray();
            for (var j = 0; j < itemArr.Count; j++) {
                itemlist.Add(itemArr[j] as MistExpeditionSceneMenuMerchantEventGemsShopItem);
            }


        };

        if (!MistExpeditionManager.GetInstance().IsMistExpeditionPayDic()) {

            UnityNet.reqMistExpeditionEventMerchantGetItemList(eventPointId, okFunc, null);

        } else {

            okFunc2();

        }

    }

    public function OnPop() {
        MistExpeditionSceneMenuMerchantEventGemsShopItem.DestroyDescShowState();
        scrollList.Clear();

    }

    /* 购买  buff item 物品 */
    public function BuyItem(buyCnt: int, itemID: int, price: int, limit: int, purchased: int, obj: HashObject) {

        if (price > Payment.instance().NormalGems) {
            MenuMgr.getInstance().PushPaymentMenu();/* 跳转 充值 界面 */
            return;
        }

        var okFunc: Function = function (result: HashObject) {
            if (result != null && result.Contains("ok") && _Global.GetBoolean(result["ok"].Value)) {

                BuySucess(result, buyCnt);


                var buffID_Dic: String = obj["buff"].Value.ToString();
                var name: String = obj["name"].Value.ToString();
                var price_Dic: String = obj["price"].Value.ToString();
                var discount_Dic: String = obj["discount"].Value.ToString();/*打折后价格*/
                var desc: String = obj["desc"].Value.ToString();

                var data: HashObject = new HashObject({
                    "ctr": this,
                    "buff": buffID_Dic,
                    "name": name,
                    "price": price_Dic,
                    "discount": discount_Dic,
                    "desc": desc,
                    "limit": limit,
                    "purchased": (purchased + 1)
                });


                Payment.instance().SetGames(result["gemsData"]); /* 更新 gems */
                itemId = itemID.ToString();
                MistExpeditionManager.GetInstance().SetMistExpeditionShopPayDicItem(itemId, data);/*缓存 远征商人信息*/
                RefreshItemBuyBtnClickableState();
                RefreshMistExpeditionGems();

            } else {
                Debug.Log("<color=#ff6611ff>Gems buy item error! result: " + result.ToString() + "</color>");
            }

        };

        var errorFunc: Function = function (errorMsg: String, errorCode: String) {
            Debug.Log("<color=#FF2D66FF>Gems buy item error! errorCode: " + errorCode + "\terrorMsg: " + errorMsg + "</color>");
        };


        itemcost = price;
        purchasedId = itemID;
        UnityNet.reqMistExpeditionEventMerchantBuyItemByGems(itemID, buyCnt, eventPointId, okFunc, errorFunc);
    }


    /* 刷新所有的 item的 购买按钮的可点击状态 */
    private function RefreshItemBuyBtnClickableState() {
        for (var i: int = 0; i < itemlist.Count; i++) {
            itemlist[i].RefreshBuySucceedBtnClickableState(itemId);
        }
    }


    /* 刷洗界面上的 gems 的显示 */
    private function RefreshMistExpeditionGems() {
        mistExpeditionCoinLabel.txt = Datas.getArString("Common.Owned") + ": " + Payment.instance().NormalGems;

    }

    /*购买成功后 修改背包道具的数量 需改gmes数量*/
    private function BuySucess(result: HashObject, itemCnt: int) {
        var seed: HashObject = GameMain.instance().getSeed();
        var isReal: boolean = false;
        if (result["isWorldGem"] != null) {
            isReal = result["isWorldGem"].Value;
        }

        //Payment.instance().SubtractGems(itemcost, isReal);/*修改gmes数量*/
       
        if (purchasedId > 4201 && purchasedId <= 4210) {
            MyItems.instance().AddItem(4201, _Global.INT32(result["amount"]));
        } else {
            MyItems.instance().AddItem(purchasedId, itemCnt);
        }

        MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.BuySuccess"));
    }

}