/*
 * @FileName:		MistExpeditionSceneMenuMerchantEventCoinShopItem.js
 * @Author:			lisong
 * @Date:			2022-04-12 06:38:43
 * @UnityVersion:	2017.4.40c1
 *
 * @Description:	迷雾远征 - 商人 - 远征币商店 - 物品项
 *
*/


public class MistExpeditionSceneMenuMerchantEventCoinShopItem extends ListItem {

	@Space(30) @Header("---------- MistExpedition SceneMenu MerchantEvent CoinShop Item ----------") 



	@SerializeField private var itemBG: Label;
	@SerializeField private var itemIcon: Label;
	@SerializeField private var itemIconMask: Label;

	@Space(20)
	@SerializeField private var nameLabel: Label;
	@SerializeField private var priceLabel: Label;
	@SerializeField private var limitLabel: Label;

	@Space(20)
	@SerializeField private var descBG: Label;
	@SerializeField private var descLabel: Label;
	@SerializeField private var descIcon: Label;

	@Space(20)
	@SerializeField private var descBtn: Button;
	@SerializeField private var buyBtn: Button;



	private var combinationCtr: CombinationController;
	private var turnover: Turnover;
	private var descIconFade: Fade;
	private var descFade: Fade;
	private var nameFade: Fade;


	private var itemID: String = String.Empty;
	private var price: int = 0;

	private var controller: MistExpeditionSceneMenuMerchantEventCoinShop = null;

	/* 记录所有的item的 desc 的显示状态 */
	private static var descShowStateDic  = new System.Collections.Generic.Dictionary.<String, boolean>();
	/* 当前 item 的 desc 的显示状态 */
	private var isDescShow = false;

	private var limit: int = 1;
	private var purchased: int;
	private var buffID: int;
	private var itemShopInfo: HashObject = null;




	public function Init(): void {
		itemBG.Init();
		itemIcon.Init();
		itemIconMask.Init();

		nameLabel.Init();
		priceLabel.Init();

		descBG.Init();
		descLabel.Init();
		descIcon.Init();
		limitLabel.Init();

		descBtn.Init();
		buyBtn.Init();


		descBtn.OnClick = OnShowDescClick;
		buyBtn.OnClick = OnBuyClick;
		buyBtn.txt = Datas.getArString("Common.Buy");


		/* desc fade */

		descBG.alphaEnable = true;
		descBG.alpha = 0.7f;

		combinationCtr = new CombinationController(CombinationController.CombinationType.SERIAL);
		turnover = new Turnover();
		turnover.init(null, descBG, true);
		combinationCtr.add(turnover);

		descIconFade = new Fade();
		descIconFade.init(descIcon, EffectConstant.FadeType.FADE_OUT);
		combinationCtr.add(descIconFade);

		nameFade = new Fade();
		nameFade.init(nameLabel, EffectConstant.FadeType.FADE_IN);
		combinationCtr.add(nameFade);

		descFade = new Fade();
		descFade.init(descLabel, EffectConstant.FadeType.FADE_IN);
		combinationCtr.add(descFade);

	}




	public function Draw() {

		if (!visible)
			return;

		GUI.BeginGroup(rect);

		itemBG.Draw();

		nameLabel.Draw();
		priceLabel.Draw();
		limitLabel.Draw();

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
		combinationCtr.updateEffect();
	}

	public function SetRowData(tempData: Object): void {
		var data: HashObject = tempData as HashObject;

		controller = data["ctr"].Value as MistExpeditionSceneMenuMerchantEventCoinShop;
		itemID = data["buff"].Value as String;
		var key: String = itemID;
		var buffDic: Dictionary.<String, KBN.DataTable.IDataItem> = MistExpeditionManager.GetInstance().GetBuffDic();/*获取buff 字典数据*/
		if (buffDic.ContainsKey(key))/*判断该商品ID是否是 buff */ {
			var itemBuff: KBN.DataTable.ExpeditionBuff = buffDic[key] as KBN.DataTable.ExpeditionBuff;


			var itemTile = TextureMgr.instance().GetHeroSpt().GetTile(itemBuff.ICON);
			if (itemTile.prop != null) {
				itemIcon.useTile = true;
				itemIcon.tile = itemTile;
			} else {
				var itemImg = TextureMgr.instance().LoadTexture(itemBuff.ICON, TextureType.MISTEXPEDITION);
				if (itemImg != null) {
					itemIcon.useTile = false;
					itemIcon.mystyle.normal.background = itemImg;
				} else {
					itemIcon.useTile = true;
					itemIcon.tile = itemTile;
				}
			}
			
			nameLabel.txt = Datas.getArString(itemBuff.NAME);
			var type: int = _Global.INT32(itemBuff.VALUE_TYPE);
			var value: Object;
			if (type == 1) {
				value = _Global.INT32(itemBuff.VALUE) / 100f;
				descLabel.txt = String.Format(Datas.getArString(itemBuff.DESCRIPTION), value);
			} else {
				value = itemBuff.VALUE;
				descLabel.txt = String.Format(Datas.getArString(itemBuff.DESCRIPTION), value);
			}

		} else {
			var nameStr = data["name"].Value as String;
			var descStr = data["desc"].Value as String;


			itemIcon.tile = TextureMgr.instance().GetHeroSpt().GetTile("i" + itemID);

			nameLabel.txt = nameStr;
			descLabel.txt = descStr;
		}


		buffID = _Global.INT32(itemID);
		RefreshBuySucceedBtnClickableState(itemID);
		


		price = _Global.INT32(data["price"].Value);
		priceLabel.txt = price + "";



		
		isDescShow = GetDescShowState(itemID);

		if (isDescShow) {
			combinationCtr.resetEffectState(EffectConstant.EffectState.END_STATE);
		}
		else {
			combinationCtr.resetEffectState(EffectConstant.EffectState.START_STATE);
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

		buyBtn.EnableGreenButton(price <= MistExpeditionManager.GetInstance().GetCurrentExpeditionResidueCoinCount() && limit > purchased);
	}

	/*购买成功后属性可点击状态*/
	public function RefreshBuySucceedBtnClickableState(data: String) {

		itemShopInfo = MistExpeditionManager.GetInstance().GitMistExpeditionShopCoinDicItem(data);
		if (itemShopInfo != null) {

			var id: int;
			id = _Global.INT32(itemShopInfo["buff"].Value);

			if (buffID == id) {

				limit = _Global.INT32(itemShopInfo["limit"].Value);
				purchased = _Global.INT32(itemShopInfo["purchased"].Value);
				var owned: int = limit - purchased;

				limitLabel.txt = Datas.getArString("Common.Limit") + ": " + (owned > 0 ? owned : 0);

				if (owned <= 0) {

					limitLabel.SetNormalTxtColor(FontColor.Red);/*字体颜色设置为红色*/
				} else {
					limitLabel.SetNormalTxtColor(FontColor.Yellow);/*字体颜色设置为黄色*/
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
			combinationCtr.revertEffect();
		}
		else {
			combinationCtr.playEffect();
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
			controller.BuyItem(price, _Global.INT32(itemID));

	}

}