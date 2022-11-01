/*
 * @FileName:		MistExpeditionSceneMenuMerchantEventGemsShopItem.js
 * @Author:			lisong
 * @Date:			2022-04-12 06:38:26
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 商人 - 宝石折扣商店 - 物品项
 *
*/


public class MistExpeditionSceneMenuMerchantEventGemsShopItem extends ListItem {

	@Space(30) @Header("---------- MistExpedition SceneMenu MerchantEvent CoinShop Item ----------")

	@SerializeField private var itemBG: Label;
	@SerializeField private var itemIcon: Label;
	@SerializeField private var itemIconMask: Label;

	@Space(20)
	@SerializeField private var nameLabel: Label;

	@Space(20)
	@SerializeField private var ownedLabel: Label;
	@SerializeField private var originPriceLabel: Label;
	@SerializeField private var priceLabel: Label;
	@SerializeField private var discountLine: Label;

	@Space(20)
	@SerializeField private var descBG: Label;
	@SerializeField private var descLabel: Label;
	@SerializeField private var descIcon: Label;

	@Space(20)
	@SerializeField private var descBtn: Button;
	@SerializeField private var buyBtn: Button;



	private var combination: CombinationController;
	private var turnover:Turnover;
	private var descIconFade: Fade;
	private var descFade: Fade;
	private var nameFade: Fade;


	private var itemID: String = String.Empty;
	private var price: int = 0;
	private var limit: int = 0;
	private var purchased: int = 0;
	private var discount: int;

	private var controller: MistExpeditionSceneMenuMerchantEventGemsShop = null;

	/* 记录所有的item的 desc 的显示状态 */
	private static var descShowStateDic = new System.Collections.Generic.Dictionary.<String, boolean>();
	/* 当前 item 的 desc 的显示状态 */
	private var isDescShow = false;
	private var buffID: int;
	private var itemShopInfo: HashObject = null;
	private var data: HashObject = null;





	public function Init(): void {
		itemBG.Init();
		itemIcon.Init();
		itemIconMask.Init();

		nameLabel.Init();
		ownedLabel.Init();
		originPriceLabel.Init();
		discountLine.Init();
		priceLabel.Init();

		descBG.Init();
		descLabel.Init();
		descIcon.Init();

		descBtn.Init();
		buyBtn.Init();


		descBtn.OnClick = OnShowDescClick;
		buyBtn.OnClick = OnBuyClick;
		buyBtn.txt = Datas.getArString("Common.Buy");


		/* desc fade */

		descBG.alphaEnable = true;
		descBG.alpha = 0.7f;

		combination = new CombinationController(CombinationController.CombinationType.SERIAL);
		turnover = new Turnover();
		turnover.init(null, descBG, true);
		combination.add(turnover);

		descIconFade = new Fade();
		descIconFade.init(descIcon, EffectConstant.FadeType.FADE_OUT);
		combination.add(descIconFade);

		nameFade = new Fade();
		nameFade.init(nameLabel, EffectConstant.FadeType.FADE_IN);
		combination.add(nameFade);

		descFade = new Fade();
		descFade.init(descLabel, EffectConstant.FadeType.FADE_IN);	
		combination.add(descFade);


		itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		itemIcon.useTile = true;

	}




	public function Draw() {

		if (!visible)
			return;

		GUI.BeginGroup(rect);

		itemBG.Draw();

		nameLabel.Draw();
		ownedLabel.Draw();

		originPriceLabel.Draw(); 
		discountLine.Draw();
		priceLabel.Draw();


		turnover.drawItems();
		nameFade.drawItems();
		descFade.drawItems();

		itemIcon.Draw();
		itemIconMask.Draw();

		descIconFade.drawItems();

		buyBtn.Draw();
		descBtn.Draw();

		GUI.EndGroup();
	}

	public function Update() {
		combination.updateEffect();
	}

	public function SetRowData(tempData: Object): void {
		data = tempData as HashObject;

		controller = data["ctr"].Value as MistExpeditionSceneMenuMerchantEventGemsShop;
		itemID = data["buff"].Value.ToString();
		var nameStr = data["name"].Value as String;
		var descStr = data["desc"].Value as String;


		itemIcon.tile.name = TextureMgr.instance().LoadTileNameOfItem(_Global.INT32(itemID));


		nameLabel.txt = nameStr;
		descLabel.txt = descStr;


		buffID = _Global.INT32(itemID);
		RefreshBuySucceedBtnClickableState(itemID);

		price = _Global.INT32(data["price"].Value);
		discount = _Global.INT32(data["discount"].Value);
		originPriceLabel.txt = price + "";
		priceLabel.txt = discount + "";


		
		isDescShow = GetDescShowState(itemID);

		if (isDescShow) {
			combination.resetEffectState(EffectConstant.EffectState.END_STATE);
		}
		else {
			combination.resetEffectState(EffectConstant.EffectState.START_STATE);
		}

		RefreshBuyBtnClickableState();

	}


	/* 重置 所有的 item 的desc的显示状态 */
	public static function ResetDescShowState() {
		descShowStateDic = new System.Collections.Generic.Dictionary.<String, boolean>();
	}


	/* 销毁 所有的 item 的desc的显示状态 ，减少内存使用*/
	public static function DestroyDescShowState() {
		if (descShowStateDic != null)
			descShowStateDic.Clear();

	}

	/* 刷新购买按钮的可点击状态 */
	public function RefreshBuyBtnClickableState() {

		buyBtn.EnableGreenButton(limit > purchased);
	}


	/*购买成功后属性可点击状态*/
	public function RefreshBuySucceedBtnClickableState(data: String) {

		itemShopInfo = MistExpeditionManager.GetInstance().GitMistExpeditionShopPayDicItem(data);
		if (itemShopInfo != null) {
			var id: int = _Global.INT32(itemShopInfo["buff"].Value);
			if (buffID == id) {
				limit = _Global.INT32(itemShopInfo["limit"].Value);
				purchased = _Global.INT32(itemShopInfo["purchased"].Value);

				ownedLabel.txt = Datas.getArString("Common.Limit") + ": " + ((limit - purchased) > 0 ? (limit - purchased) : 0);
				if ((limit - purchased) <= 0) {

					ownedLabel.SetNormalTxtColor(FontColor.Red);/*字体颜色设置为红色*/
				} else {
					ownedLabel.SetNormalTxtColor(FontColor.Yellow);/*字体颜色设置为黄色*/
				}
				RefreshBuyBtnClickableState();
			} else {
				RefreshBuyBtnClickableState();
			}

		} else {
			RefreshBuyBtnClickableState();
		}

	}



	/* 获得 desc 的显示状态 */
	private function GetDescShowState(key : String): boolean {
		if (String.IsNullOrEmpty(key))
			return false;

		if (descShowStateDic.ContainsKey(key))
			return descShowStateDic[key];
		else
			return false;
	}


	/* 点击 desc 按钮 */
	private function OnShowDescClick(): void {
		if (isDescShow) {
			combination.revertEffect();
		}
		else {
			combination.playEffect();
		}
		isDescShow = !isDescShow;

		if (String.IsNullOrEmpty(itemID))
			return;

		if (descShowStateDic.ContainsKey(itemID))
			descShowStateDic[itemID] = isDescShow;
		else
			descShowStateDic.Add(itemID, isDescShow);
	}

	/* 点击 购买 按钮 */
	private function OnBuyClick(): void {
		if (controller != null)
			controller.BuyItem(1, _Global.INT32(itemID), discount, limit, purchased, data);

	}

}