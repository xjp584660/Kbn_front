



public class CitySkinPropViewItem extends ListItem {

	@Space(30) @Header("----------CitySkinPropViewItem----------")

		/*bg*/
	public var itemBGFrame: Label;

		/*icon*/
	public var itemIcon: Label;
	public var itemIconMask: Label;

	public var itemName: Label;
	public var itemDescription: Label;

	public var gemIcon: Label;
	
		/*btn */
	public var btnUse: Button;
	public var labelUse: Label;
	public var btnBuy: Button;
	public var labelBuy: Label;

		/*label*/
	public var labelBuyLimitCount: Label;
	public var labelOwnCount: Label;
	public var labelSalePrice: Label;

	/*private var citySkinId: String;//皮肤 id  */
	private var skinPropId: int;/*皮肤道具的 id  */
	private var buyLimitCount: int;	/*购买的限制剩余数量*/
	private var ownCount: int;	/*已经拥有的数量*/
	private var limitBuyTime: int;	/* 道具购买时间限制 */
	private var buyCount: int;	/* 已经购买的数量 */
	
	private var isCanBuy: boolean;	/*是否可以购买*/
	private var skinPrice: int;	/*已经拥有的数量*/

	private var citySkinPropView : CitySkinPropView;

	function Init() {
		itemBGFrame.Init();
		itemBGFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("backFrame", TextureType.FTE);

 
		itemIcon.Init();
		itemIconMask.Init();

		itemName.Init();
		itemDescription.Init();

		btnUse.Init();
		labelUse.Init();

		btnBuy.Init();
		labelBuy.Init();

		labelBuyLimitCount.Init();
		labelOwnCount.Init();

		btnUse.OnClick = handleUseClick;
		btnBuy.OnClick = handleBuyClick;

		skinPropId = -1;
		skinPrice = -1;
		limitBuyTime = 0;
		buyCount = 0;
		ownCount = 0;
		buyLimitCount = 0;
	}


	public function Update() {

	}

	function Draw() {

		if (!visible) return;

		GUI.BeginGroup(rect);
		itemBGFrame.Draw();
		itemIconMask.Draw();
 		itemIcon.Draw();

		itemName.Draw();
		itemDescription.Draw();

		/*可以购买的城堡皮肤*/
		if (isCanBuy) {

			btnBuy.Draw();
			labelBuy.Draw();

			gemIcon.Draw();
			labelSalePrice.Draw();

			/*不限制购买时，不显示*/
			if (buyLimitCount != -1)
				labelBuyLimitCount.Draw();
		}


		btnUse.Draw();
		labelUse.Draw();
		labelOwnCount.Draw();


		GUI.EndGroup();
	}

	public function SetRowData(data: Object): void {
		var m_data: Hashtable = data as Hashtable;

		skinPropId = _Global.INT32(m_data["prop_id"]);

		/*itemIcon.useTile = true;*/
		itemIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture(m_data["icon_name"], TextureType.CITYSKIN);

		var state_data: HashObject = m_data["item_state"] as HashObject;


		/*
			7   day : Gear_circle_0
			30  day : Gear_circle_4
			90  day : Gear_circle_2
			--  day : Gear_circle_3
			365 day : Gear_circle_2
		*/

		var icon_mask_name = state_data["bgitem"].Value as String;
		if (String.IsNullOrEmpty(icon_mask_name))
			icon_mask_name = "Gear_circle_0";

		itemIconMask.mystyle.normal.background = TextureMgr.instance().LoadTexture(icon_mask_name, TextureType.BUTTON);

		itemName.txt = Datas.getArString(m_data["item_name_key"]);
		itemDescription.txt = Datas.getArString(m_data["desc_key"]);
		 
		labelUse.txt = Datas.getArString("Common.Use_button");
		labelBuy.txt = Datas.getArString("Common.Buy");

		/*处理按钮的状态*/
		SetShowState(state_data);

	}


	public function SetCitySkinPropView(view: CitySkinPropView) {
		citySkinPropView = view;
	}


	/*使用皮肤道具*/
	private function handleUseClick(): void {

		if (ownCount <= 0) return;

		if (citySkinPropView == null) return;

		if (skinPropId == -1) return;


		var okFunc: Function = function (result: HashObject) {
			citySkinPropView.RefershScrollList(result);/*直接将数据 传回给 的tailview ，然后让其完全创建一个新的 列表*/
			MenuMgr.getInstance().PushMessage(Datas.getArString("CastleSkin.Tips2"));
		};

		var errorFunc: Function = function (errorMsg: String, errorCode: String) {
			Debug.LogWarning("使用城堡皮肤道具失败：skinPropId: " + skinPropId + " <color=#ff0000>errorMsg:" + errorMsg + "  errorCode:" + errorCode + "</color>");
			var retryFunc: Function = function(){
				handleUseClick();
			};
			citySkinPropView.PopUpErrorInfo(errorMsg, errorCode, true, retryFunc, null);

		};

		/*皮肤是否已经激活 */
		if (!citySkinPropView.IsSkinActive()) {
			citySkinPropView.UseCitySkinProp(skinPropId, okFunc, errorFunc); 

		} else {
			var dialog: ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
			dialog.setLayout(600, 380);
			dialog.setTitleY(60);
			dialog.setContentRect(70, 140, 0, 100);
			dialog.setButtonText(Datas.getArString("Common.Yes"), Datas.getArString("Common.No"));
			MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("CastleSkin.Tips3"), "", function () {
				MenuMgr.getInstance().PopMenu("");

				citySkinPropView.UseCitySkinProp(skinPropId, okFunc, errorFunc); 

			}, null);
		}
		
	}

	/* 购买皮肤道具  */
	private function handleBuyClick(): void {

		if (skinPropId == -1) return;

		var errorFunc: Function = function (errorMsg: String, errorCode: String) {
			#if UNITY_EDITOR
				Debug.LogWarning("检测失败！无法购城堡皮肤道具： <color=#ff0000>errorMsg:" + errorMsg + "  errorCode:" + errorCode + "</color>");
			#endif

			citySkinPropView.PopUpErrorInfo(errorMsg, errorCode, true, function () { handleBuyClick(); }, null);
		};
 
		
		var okFunc: Function = function () {
			var buyOkFunc: Function = function (result: HashObject) {

				if (!_Global.GetBoolean(result["ok"])) {
					return;
				}

				var str1 = "buySkinItem";
				var str2 = _Global.ap + "1";

				if (!result.Contains(str1) || !result[str1].Contains(str2)) {
					#if UNITY_EDITOR
						Debug.LogWarning("<color=#ff0011>购买的返回数据错误！！！！</color>");
					#endif

					citySkinPropView.PopUpErrorInfo(String.Empty, String.Empty, true, function () { handleBuyClick(); }, null);
					return;
				}


				var data = new HashObject({ "ok": true, "result": result[str1][str2] });

				/*直接将数据 传回给 的tailview ，然后让其完全创建一个新的 列表*/
				citySkinPropView.RefershScrollList(data);
				/*购买道具完成后的回调*/
				citySkinPropView.UpdateCitySkinProp(skinPropId); 
			};

			var buyErrorFunc: Function = function (errorMsg: String, errorCode: String) {
				#if UNITY_EDITOR
					Debug.LogWarning("购城堡皮肤道具失败： <color=#ff0000>errorMsg:" + errorMsg + "  errorCode:" + errorCode + "</color>");
				#endif

				citySkinPropView.PopUpErrorInfo(errorMsg, errorCode, true, function () { handleBuyClick(); }, null);
			};


			/*citySkinPropView.reqCityReplaceSkinBuySkinProp(skinPropId, 1, buyOkFunc, buyErrorFunc);*/
			/* 购买皮肤道具接口 */
			Shop.instance().swiftCitySkinPropBuy(skinPropId, 1, buyOkFunc, buyErrorFunc);

		};

 
		/*是否可以购买道具（由服务器的判断，防止玩家盗刷数据）*/
		citySkinPropView.CheckLimitStateOfBuyCitySkinProp(skinPropId, okFunc, errorFunc); 

 
	}


	/*设置状态*/
	private function SetShowState(state_data: HashObject) {
		
		/*
		* buyFrequency :当前购买次数/已经购买的数量
		* buyitemlimit :道具购买次数限制 （为-1时不限制购买 ）
		* limitbuytime :道具购买时间限制 （一定时间段内可以购买的限制，时间结束后，则不可购买;例如： 3天内可购买5次）
		* quantityNet  :道具剩余数量/拥有的数量
		*
	   */

		ownCount = _Global.INT32(state_data["quantityNet"].Value);
		if (ownCount < 0)
			ownCount = 0;

		buyLimitCount = _Global.INT32(state_data["buyitemlimit"].Value);

		isCanBuy = false;

		var itemDatas: HashObject = Datas.instance().itemlist();
		var iid: String = "i" + skinPropId;
 
		skinPrice = -1;

		if (itemDatas.Contains(iid)) {
			skinPrice = _Global.INT32(itemDatas[iid]["price"]);
		}

		if (skinPrice != -1) {
			if (buyLimitCount == -1) {
				isCanBuy = true;
			} else {
				/* 限制购买的时间 */
				limitBuyTime = _Global.INT32(state_data["limitbuytime"].Value);
				/* 已经购买的数量 */
				buyCount = _Global.INT32(state_data["buyFrequency"].Value);

				/* 限制购买的时间 =0 或者  道具购买次数限制 = 0 时，不可以购买 */
				if (limitBuyTime == 0 || buyLimitCount == 0) {
					isCanBuy = false;
				}
				else {
					/* 限制购买的数量  > 已经购买的数量	,才可以 可以购买道具 */
					isCanBuy = buyLimitCount > buyCount;
                }

			}
		}

		RefreshState();
	}


	/*根据数据来处理显示的状态*/
	private function RefreshState() {
		labelBuyLimitCount.txt = Datas.getArString("itemBuy.limit") + buyCount + "/" + buyLimitCount;
		labelOwnCount.txt = Datas.getArString("Common.Owned") + ": " + ownCount;		
		labelSalePrice.txt = "" + skinPrice;		
		
		var tempRect: Rect;


		/* 可以购买的城堡皮肤 */
		if (isCanBuy) {

			btnBuy.changeToGreenNew();/*恢复可点击*/

			/*buy*/

			tempRect = btnBuy.rect;
			btnBuy.rect = new Rect(tempRect.x, 20, tempRect.width, tempRect.height);

			tempRect = labelBuy.rect;
			labelBuy.rect = new Rect(tempRect.x, 5, tempRect.width, tempRect.height);

			tempRect = gemIcon.rect;
			gemIcon.rect = new Rect(tempRect.x, 45, tempRect.width, tempRect.height);

			tempRect = labelSalePrice.rect;
			labelSalePrice.rect = new Rect(tempRect.x, 50, tempRect.width, tempRect.height);

			tempRect = labelBuyLimitCount.rect;
			labelBuyLimitCount.rect = new Rect(tempRect.x, 60, tempRect.width, tempRect.height);

			/*use*/

			tempRect = btnUse.rect;
			btnUse.rect = new Rect(tempRect.x, 110, tempRect.width, tempRect.height);

			tempRect = labelUse.rect;
			labelUse.rect = new Rect(tempRect.x, 105, tempRect.width, tempRect.height);

			tempRect = labelOwnCount.rect;
			labelOwnCount.rect = new Rect(tempRect.x, 150, tempRect.width, tempRect.height);

		}
		else {/*不可购买的城堡皮肤*/
			btnBuy.changeToGreyNew();/*恢复可点击*/

			tempRect = btnUse.rect;
			btnUse.rect = new Rect(tempRect.x, 80, tempRect.width, tempRect.height);

			tempRect = labelUse.rect;
			labelUse.rect = new Rect(tempRect.x, 75, tempRect.width, tempRect.height);

			tempRect = labelOwnCount.rect;
			labelOwnCount.rect = new Rect(tempRect.x, 125, tempRect.width, tempRect.height);

		}

		 
		/*use*/
		if (ownCount > 0) {
			btnUse.changeToBlueNew();/*恢复可点击*/
		}
		else {
			btnUse.changeToGreyNew();/*置灰处理*/
		}

		

	}




}