/*
 * @FileName:		MistExpeditionMenuExpeditionHornItem.js
 * @Author:			lisong
 * @Date:			2022-09-02 17:13:50
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 详情信息 -  远征号角
*/


public class MistExpeditionMenuExpeditionHornItem extends ListItem
{
	@Space(30) @Header("---------- MistExpedition Menu Expedition Horn Item ----------")

	@SerializeField private var line:SimpleLabel;
	@SerializeField private var priceLabel: Label;



	private var buySuccessCallbackFunc: Function;/* 当远征号角购买完成时，执行该回调函数 */
	private var itemId:int;
	private var price: int = 0;

 
	
	public function Init()
	{
		btnSelect.OnClick = OnBtnClick;
		btnSelect.txt = Datas.getArString("Common.BuyAndUse_button");

		line.setBackground("between line_list_small", TextureType.DECORATION);

		icon.useTile = true;
		price = 0;
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		line.Draw();
		icon.Draw();
		title.Draw();
		description.Draw();
		btnSelect.Draw();
		priceLabel.Draw();
		
		GUI.EndGroup();
	}
	
	
	
	public function SetRowData(data:Object)
	{
		itemId = (data as Hashtable)["ID"];
		buySuccessCallbackFunc = ((data as Hashtable)["callback"]) as Function;
		price = MistExpeditionManager.GetInstance().GetExpeditionHornHavePrice();

		var iconID = TextureMgr.instance().LoadTileNameOfItem(itemId);

		priceLabel.txt = price+"";

		icon.tile = TextureMgr.instance().ItemSpt().GetTile(iconID);
		title.txt = MystryChest.instance().GetChestName(itemId);
		description.txt = MystryChest.instance().GetChestDesc(itemId);

	}
	
	private function OnBtnClick()
	{
		if (price > Payment.instance().NormalGems) {
			MenuMgr.getInstance().PushPaymentMenu();/* 跳转 充值 界面 */
			return;
		}


		var okFunc: Function = function (result: HashObject) {
			if (result != null && result.Contains("ok") && _Global.GetBoolean(result["ok"].Value)) {

				Payment.instance().SetGames(result["gemsData"]); /* 更新 gems */

				OnBuySucess();
		
			} else {
				Debug.Log("<color=#ff6611ff>Gems buy item error! result: " + result.ToString() + "</color>");
			}

		};

		var errorFunc: Function = function (errorMsg: String, errorCode: String) {
			Debug.Log("<color=#FF2D66FF>Gems buy item error! errorCode: " + errorCode + "\terrorMsg: " + errorMsg + "</color>");
		};


		UnityNet.reqMistExpeditionEventMerchantBuyItemByGems(itemId, 1, 0, okFunc, errorFunc);

	}


	/* 购买号角成功的回调 */
	private function OnBuySucess() {
		MenuMgr.instance.PopMenu(Constant.MistExpeditionConst.SceneMenu_ExpeditionBuyHorn);
		if (buySuccessCallbackFunc != null) {
			buySuccessCallbackFunc();
		}
	}
}
