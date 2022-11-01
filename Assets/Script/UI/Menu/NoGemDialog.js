class NoGemDialog extends ConfirmDialog
{		
	public function OnPush(param:System.Object)
	{	
//		var arString:Object = Datas.instance().arStrings();
		
		m_msg.rect.height = 110;
		
		setButtonText(Datas.getArString("Common.GetMore"), Datas.getArString("Common.NotNow"));		
		SetAction(Datas.getArString("Error.NeedCash"), "", OKfunction ,null);		
	}
		
	private function OKfunction():void
	{
		MenuMgr.getInstance().PopMenu("");
		MenuMgr.getInstance().PushPaymentMenu(Constant.PaymentBI.BuyOpen);
//		var okCallback:Function = function( result:Object )
//		{
//			MenuMgr.getInstance().PushMenu("PaymentMenu", result, "trans_pop" );
//		};
//		
//		Payment.callPaymentServer(okCallback);
		
	}
}
