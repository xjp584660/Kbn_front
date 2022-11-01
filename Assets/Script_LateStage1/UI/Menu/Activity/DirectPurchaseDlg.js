class DirectPurchaseDlg extends PopMenu {
	public var contentBg:Label;
	public var contentIcon:Label;
	public var contentText:Label;
	public var contentMoney:Label;
	public var btnY:Button;
	public var btnN:Button;
	public var seperateLine:Label;
	public var _PayItem:Payment.PaymentElement;
	
	public function Init():void {
		super.Init();
		btnClose.OnClick = OnClose;
		btnY.OnClick = OnY;
		btnN.OnClick = OnN;
		setDefaultButtonText();
	}
	
	public function Draw() {
		super.Draw();
	}
	public function DrawItem() {
		//seperateLine.Draw();
		title.Draw();
		btnClose.Draw();
		contentBg.Draw();
		contentIcon.Draw();
		contentText.Draw();
		contentMoney.Draw();
		btnY.Draw();
		//btnN.Draw();
	}
	
	public function setDefautLayout() : void {
		setDefaultButtonText();
	}

	public function setDefaultButtonText() : void {
		this.setButtonText(Datas.getArString("paymentLabel.purchase"),Datas.getArString("MessagesModal.BegProtectionLaterButton") );
	}
	
	public function setButtonText(confirmTxt:String, cancelTxt:String) : void {
		btnY.txt = confirmTxt;
		btnN.txt = cancelTxt;
	}
	
	public function SetCloseAble(b:boolean):void {
		btnClose.SetVisible(b);
	}

	public function SetPaymentItem(Description:String, ProductName:String, PayItem:Payment.PaymentElement) {
		_PayItem = PayItem;
		contentText.txt = ProductName;
		title.txt = Description;
		contentMoney.txt = PayItem.price;
		contentIcon.useTile = true;
		contentIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile(PayItem.icon);
		//contentIcon.tile.SetSpriteEdge(0);
		//contentIcon.tile.name = PayItem.icon;
		contentIcon.SetRectWHFromTile();
	}
	
	function OnPush(param:Object) {
		SetCloseAble(true);
		if (param == null) {
			return;
		}
		var Obj:HashObject = param as HashObject;
		SetPaymentItem(Datas.getArString(Obj["description"].Value),
			Datas.getArString(Obj["productname"].Value),
			Payment.instance().GetPaymentItem(Obj["productid"].Value));
	}
	
	protected function OnClose(param:Object):void {
		if (_PayItem) {
			MenuMgr.getInstance().PopMenu("");
			this.setDefautLayout();
			UnityNet.SendPaymentBI(_PayItem.bi - 1);
		}
	}
	
	protected function OnY(param:Object):void {
		if (_PayItem) {
		 	MenuMgr.getInstance().PopMenu("");
			Payment.instance().BuyItem(_PayItem);
		}
	}
	
	protected function OnN(param:Object):void {
		OnClose(param);
	}
	
	public function OnPopOver():void {
		this.setDefaultButtonText();
	}
}
