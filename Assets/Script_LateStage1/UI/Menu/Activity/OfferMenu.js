#pragma strict

import System;
import System.Collections.Generic;

public class OfferMenu extends ComposedMenu implements IEventHandler
{
	@Space(30) @Header("---------- OfferMenu ----------")


	public var scroll:ScrollList;
	var listData:Array = new Array();
	//public var  cityTemplate:CityItem;
	public var offerItem:OfferItem;
	//public var data:Array = new Array();
	public var selectShow:int =1;
	public var bgFrame:Label;
	public var menuTitleBg:Label;
	public var menuTitle:Label;
	public var lastPage:int;
	private var backRect:Rect;
	private var offerData : PaymentOfferData ;

	public var pageScrList : ScrollList;
	public var offerPageItem : OfferPageItem;
	public var pageDatas : Array;
	public var offerPageItems : System.Collections.Generic.List.<ListItem>;
	public var offerPageIndex : int;

	//payment
	public var paymentList:ScrollView;

	public var payItem:PaymentNewItem;
    public var offerPayItem:PaymentNewItem;

 	public var btn_buy:Button;
 	public var gotoOfferMenu:Button;
 	public var payNotice:PaymentNotice;
 	public var Offer3Notice:PaymentNotice;
 	public var bl:BlueLightBar;
	public var tapJoyItem:TapJoyItem;

 	private var select_item:PaymentNewItem;
    private var selectedCurrency : int;

 	protected var cur_notice:UIObject;

 	private var plist:Array;

 	private var isInitnotice:boolean;

 	public var timeTakenDuringLerp : float = 0.02f;
	var _isLerping : boolean = false;
	var _timeStartedLerping : float;
	private var pagePosMax : float;
 	public var l_pageLeft:Button;
 	public var l_pageRight:Button;

 	public var l_noOfferNotice:Label;

	/* 三方支付的 web shop 进入按钮 */
	@SerializeField private var btn_thirdPartyPayment: Button;
	private var isShowThirdPartyPayment = false;


	public function Init()
	{
		super.Init();

		scroll.Init(offerItem);
		menuTitle.txt = Datas.getArString("paymentLabel.beginnerOfferTtile");
		var texMgr : TextureMgr = TextureMgr.instance();

		pageScrList.itemDelegate = this;
		offerPageItem.Init();
		pageScrList.Init(offerPageItem);

		//payment
		paymentList.Init();
 		payNotice.Init();
 		Offer3Notice.Init();
 		isInitnotice = true;
 		var min:float;
 		var max:float;

 		btn_buy.OnClick =  buyClick;

		btn_buy.txt = Datas.getArString("Temple_BuyGoldModal.BuyGold_Button");

		l_pageLeft.OnClick = OnPageLeft;
		l_pageRight.OnClick = OnPageRight;

		l_noOfferNotice.txt = Datas.getArString("Offer.nonoffer");


		btn_thirdPartyPayment.OnClick = OnThirdPartyPaymentBtnClick;
		btn_thirdPartyPayment.txt = Datas.getArString("ENTER WEBSHOP");

	}

 	protected function resetAll(noticetype:int, updateNotice : boolean):void
 	{
 		paymentList.clearUIObject();
 		cur_notice = null;
        select_item = null;

        var notice : Payment.Notice = null;

        Payment.instance().reqNotice();
	    notice = Payment.instance().notice;

		cur_notice = bl;
		bl.Init();
		var needSpecialItem : boolean = false;

      	paymentList.addUIObject(cur_notice);

        PrepareItemList(needSpecialItem, notice);
 	}

    protected function PrepareItemList(needSpecialItem : boolean, notice : Payment.Notice)
    {
        var showList : List.<Payment.PaymentElement> = GetPaymentListForShow();

        if (needSpecialItem)
        {
            RepermutateShowList(showList, notice);
        }

        AddPayItemsToScrollView(needSpecialItem, showList, notice);
    }

    protected function AddPayItemsToScrollView(needSpecialItem : boolean, showList : List.<Payment.PaymentElement>, notice : Payment.Notice)
    {
        for (var i = 0; i < showList.Count; ++i)
        {
            var d : Payment.PaymentElement = showList[i];
            var item : PaymentNewItem;

            if (needSpecialItem && notice.pricePoint == d.currency)
            {
                item = Instantiate(offerPayItem);
            }
            else
            {
                item = Instantiate(payItem);
            }

            item.Init();
            item.handlerDelegate = this;
            paymentList.SetItemAutoScale(item);
            paymentList.addUIObject(item);
            item.SetRowData({"PayItem" : d, "Notice" : notice});

            if (selectedCurrency > 0)
            {
                item.SetSelected(selectedCurrency == d.currency);
            }
            else if (needSpecialItem)
            {
                item.SetSelected(notice.pricePoint == d.currency);
            }
            else
            {
                item.SetSelected(d.itunesProductId == "com.kabam.kocmobile.tier20");
            }
        }
        paymentList.AutoLayout();
 		paymentList.MoveToTop();
    }

    protected function GetPaymentListForShow() : List.<Payment.PaymentElement>
    {
        var originalShowList : Array = Payment.instance().getPaymentListForShow(plist);
        var ret : List.<Payment.PaymentElement> = new List.<Payment.PaymentElement>();
        for (var i : int = 0; i < originalShowList.length; ++i)
        {
            ret.Add(originalShowList[i]);
        }
        return ret;
    }

    protected function RepermutateShowList(showList : List.<Payment.PaymentElement>, notice : Payment.Notice)
    {
        var hasFoundOfferItem : boolean = false;
        for (var i : int = showList.Count - 1; i >= 0; --i)
        {
            if (!hasFoundOfferItem)
            {
                if (notice.pricePoint == showList[i].currency)
                {
                    hasFoundOfferItem = true;
                }
                continue;
            }

            var tmp : Payment.PaymentElement = showList[i];
            showList[i] = showList[i + 1];
            showList[i + 1] = tmp;
        }
    }

 	protected function removeNotice():void
 	{
        resetAll(-1, false);
 	}

	public function buyClick(clickParam:Object):void
 	{
		if(Payment.instance().CheckBlockAndPopMessage()) {
 			return;
 		}

		 if(select_item != null) {
 			var pe:Payment.PaymentElement = select_item.getData();
 			Payment.instance().AddOrderInfo(pe);
 			MenuMgr.getInstance().PopMenu("");
 			Payment.instance().BuyItem(pe);
		}
	}

	/* 跳转到 web shop */
	private function OnThirdPartyPaymentBtnClick() {

		var url = GameMain.instance().GetThirdPartyPaymentURL();
		if (!String.IsNullOrEmpty(url))
			Application.OpenURL(url);
	}


 	public function handleItemAction(action:String,data:Object):void
 	{
 		switch(action)
		{
			case Constant.Action.PAYMENT_ITEM_SELECT:
		 		if(select_item && select_item != data)
		        {
		 			select_item.SetSelected(false);
		        }
		 		select_item = data as PaymentNewItem;
		        selectedCurrency = select_item.getData().currency;
				break;
		}
 	}

	private function SetMyItemPageTab(pageType : int)
	{
		l_noOfferNotice.SetVisible(false);
		// offer
		if(pageType != 0)
		{
			listData = PaymentOfferManager.Instance.GetPaymentListByPriority(pageType);
			if(listData.Count==0) {
//				MenuMgr.getInstance().PopMenu("");
//				return;
				l_noOfferNotice.SetVisible(true);
			}
			scroll.Clear();
			scroll.SetData(listData);
			scroll.ResetPos();
		}// payment
		else
		{
			if(plist == null || plist.Count == 0)
			{
				var okCallback:Function = function( result:Object ){
					plist = result as Array;
					resetAll(Payment.instance().currentNoticeType, true);
				} ;
				Payment.instance().reqPaymentList(okCallback,null, true, true);
			}
			else
			{
				resetAll(Payment.instance().currentNoticeType, true);
			}
		}

		//SetPageSelect(pageType);
		if(!isFirstOpen)
		{
			var carPageItem : OfferPageItem = GetSelectPageItem(pageType);
			var curSelectedPageLeftPos : int = carPageItem.rect.x - pageScrList.rect.width;
			var curSelectedPageRightPos : int = carPageItem.rect.x - pageScrList.rect.width + pageScrList.colDist;

			if(curSelectedPageLeftPos + pageScrList.m_nOffSet < 0 || curSelectedPageRightPos + pageScrList.m_nOffSet > pageScrList.rect.width)
			{
				var curSelectedPagePos : int = carPageItem.rect.x - pageScrList.rect.width + pageScrList.colDist;

				var offset : int = pageScrList.rect.width - curSelectedPagePos;

				var scrollistOffset : int = Mathf.Clamp(offset, -pageScrList.m_nMaxOffset, 0);
				SetPageListFromAndToPos(pageScrList.m_nOffSet, scrollistOffset, 0.3f);
			}
		}
		isFirstOpen = false;

		offerPageIndex = pageType;
	}

	public function GetSelectPageItem(page : int) : OfferPageItem
	{
		for(var i : int = 0; i < offerPageItems.Count;++i)
		{
			var pageItem : OfferPageItem = offerPageItems[i] as OfferPageItem;
			if(pageItem.GetPageType() == page)
			{
				return pageItem;
			}
		}

		return offerPageItems[0];
	}

	public function SetPageSelect(page : int)
	{
		if(_isLerping)
		{
			for(var i : int = 0; i < offerPageItems.Count;++i)
			{
				var pageItem : OfferPageItem = offerPageItems[i] as OfferPageItem;
				pageItem.SetPageNormal();
			}
		}
		else
		{
			for(var j : int = 0; j < offerPageItems.Count;++j)
			{
				var pageItem1 : OfferPageItem = offerPageItems[j] as OfferPageItem;
				pageItem1.SetPageTab(page);
			}
		}
	}

	public function RefreshOfferPage()
	{
		pageScrList.Clear();
		pageScrList.ClearData();
		pageDatas = PaymentOfferManager.Instance.GetOfferCategoryList();

		pageScrList.SetData(pageDatas);

		pagePosMax = -pageScrList.m_nMaxOffset;

		offerPageItems = pageScrList.GetItemLists();
		pageScrList.updateable = pageDatas.length > 4 ? true : false;
	}

	public var isFirstOpen : boolean = false;
	public function OnPush(param:Object)
	{
		super.OnPush(param);

		isFirstOpen = true;
		offerPageIndex = -1;
//		var data:Hashtable = param as Hashtable;
		var page : int = _Global.INT32(param);
		plist = Payment.instance().getPaymentItems();

		RefreshOfferPage();
		pageScrList.m_nOffSet = 0;

		if(page == Constant.OfferPage.Payment)
		{
			//plist = data["data"] as Array;
	 		if( GameMain.instance().getPlayerLevel() <= 4 )
	 		{
	 			var toastMsg:String = Datas.getArString("ToastMsg.GemsPurpose");
				MenuMgr.getInstance().PushMessage(toastMsg);
			}

			SetMyItemPageTab(0);
		}
		else if(page == Constant.OfferPage.Offer)
		{
            offerData = PaymentOfferManager.Instance.GetDisplayDataByDisplayPosition();
			if(offerData != null)
			{
				SetMyItemPageTab(offerData.offerPriority);
			}
		}
		else
		{
			SetMyItemPageTab(10);
		}

		menuHead.rect.height = 150;
		menuHead.offerGemsDataSet();

		var texMgr : TextureMgr = TextureMgr.instance();
		var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
	}

	function UpdateItemList()
	{
//	l_pageLeft.SetVisible(true);
//				l_pageRight.SetVisible(true);
		if(pageScrList.updateable)
		{
			if(pageScrList.m_nOffSet == 0)
			{
				l_pageLeft.SetVisible(false);
				l_pageRight.SetVisible(true);
			}
			else if(pageScrList.m_nOffSet == pagePosMax)
			{
				l_pageLeft.SetVisible(true);
				l_pageRight.SetVisible(false);
			}
			else
			{
				l_pageLeft.SetVisible(true);
				l_pageRight.SetVisible(true);
			}
		}
		else
		{
			l_pageLeft.SetVisible(false);
			l_pageRight.SetVisible(false);
		}
	}

	function OnPageLeft()
	{
		SetPageListFromAndToPos(pageScrList.m_nOffSet, 0f, 0.01f);
	}

	function OnPageRight()
	{
		SetPageListFromAndToPos(pageScrList.m_nOffSet, pagePosMax, 0.01f);
	}

	private var pagePosFrom : float;
	private var pagePosTo : float;
	private function SetPageListFromAndToPos(from : float, to : float, moveTime : float)
	{
		_timeStartedLerping = Time.time;

		pagePosFrom = from;
		pagePosTo = to;
		timeTakenDuringLerp = moveTime;

		_isLerping = true;
	}

	private function UpdatePageListPos()
	{
		if(_isLerping)
		{
			var timeSinceStarted : float = Time.time - _timeStartedLerping;
            var percentageComplete : float = timeSinceStarted / timeTakenDuringLerp;

            var offSet : float = Mathf.Lerp(pagePosFrom,pagePosTo,percentageComplete);
            pageScrList.SetOffSet(offSet);

            if(percentageComplete >= 1.0f)
            {
            	_isLerping = false;
            	pageScrList.SetOffSet(pagePosTo);
            }
		}
	}

	function GetOfferList()
	{
		listData.length=0;

		listData = PaymentOfferManager.Instance.GetPaymentList();
		scroll.SetData(listData);
		scroll.ResetPos();
	}

	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case "refreshOfferMenuList":
				refreshData();
				break;
			case "refreshOfferPaymentData":
				var offerId : int = _Global.INT32(body);
				refreshOfferPaymentData(offerId);
				break;
			case Constant.Notice.PAYMENT_CLOSE:// buy offer finished
				_Global.Log("MonthCard   buy monthCard finished");
				MenuMgr.getInstance().PopMenu("OfferMenu", "trans_zoomComp");
				UpdateSeed.instance().update_seed_ajax(true, afterUpdateSeed);
				break;
			case Constant.Notice.PAYMENT_OFFER_CLICK_PAGE:
				var selectedMyItemList : int = System.Convert.ToInt32(body);
				SetMyItemPageTab(selectedMyItemList);
				break;
			case Constant.Notice.PAYMENT_NOTICE_END:
				removeNotice();
				break;
		}
	}

	public function afterUpdateSeed()
	{
	//	var curPage:int = scroll.CurrentPage();
	//	var data : PaymentOfferData =  listData[curPage] as PaymentOfferData;
	//	if(data.IsMonthlyCard)
	//	{
	//		Payment.instance().buyMonthlyCardOk = true;
	//	}
	}

	public function refreshOfferPaymentData(offerId : int)
	{
		var offerData : PaymentOfferData = PaymentOfferManager.Instance.GetPaymentOfferDataById(offerId);
		//_Global.Log("Payment offerMenu  refreshOfferPaymentData offerId : " + offerId + " offerData.IsMonthlyCard : " + offerData.IsMonthlyCard);
	    if(offerData != null && !offerData.IsMonthlyCard)
	    {
	        PaymentOfferManager.Instance.UpdateSurplusTimes(offerId);
	    }

		//RefreshOfferPage();
 		SetMyItemPageTab(offerPageIndex);
	}

	public function refreshData(){
		var isRefresh:boolean=false;
		for(var i:int;i<listData.Count;i++){
	 		var item : PaymentOfferData =  listData[i] as PaymentOfferData;
	 		var timeEnd : long = item.EndTime;
	        var timeSurplus : long = timeEnd - GameMain.unixtime();
	        if(timeSurplus<=0 || item.SurplusTimes <= 0){
	        	listData.splice(i,1);
	        	isRefresh=true;

	        	PaymentOfferManager.Instance.RemovePaymentOfferByOfferId(item.Id);
	        }
	 	}

	 	if(isRefresh){
	 		//RefreshOfferPage();
	 		SetMyItemPageTab(offerPageIndex);
	 	}
	}

	public function OnPop()
	{
		super.OnPop();

		MenuMgr.getInstance().floatMessage.forceFinish();
	}

	public  function OnPopOver ()
	{
		super.OnPopOver ();
		_Global.Log("MonthCard   offerMenu OnPopOver");
		UpdateSeed.instance().update_seed_ajax(true, afterUpdateSeed);

		_isLerping = false;
 		paymentList.clearUIObject();
 		pageScrList.Clear();
 		pageScrList.m_nOffSet = 0;
 		scroll.Clear();
	}

	public function DrawItem()
	{
		bgFrame.Draw();
		menuTitleBg.Draw();
		menuTitle.Draw();
		pageScrList.Draw();

		l_pageLeft.Draw();
		l_pageRight.Draw();

		//payment
		if(offerPageIndex == 0)
		{
			paymentList.Draw();
			btn_buy.Draw();
		}
		else
		{
			scroll.Draw();
			l_noOfferNotice.Draw();
		}

		btn_thirdPartyPayment.Draw();
	}

	function DrawBackground()
	{
		super.DrawBackground();
	}

	function DrawMiddleBg()
	{
		super.DrawMiddleBg();

		if(offerPageIndex == 0)
 		{
			gotoOfferMenu.Draw();
		}
	}

	function DrawTitle()
 	{

	}

	function UpdateTouch()
	{
		var offerItem : OfferItem = scroll.GetItem(0);
		if(offerItem != null && (offerItem.GetChestDetailView().GetItemsScrollList().IsMoved() &&
		offerItem.GetChestDetailView().GetItemsScrollList().isVisible()))
		{
			scroll.updateable = false;
		}
		else
		{
			scroll.updateable = true;
		}
	}

	 function Update()
	 {
	 	scroll.Update();

	 	paymentList.Update();
	 	pageScrList.Update();

	 	SetPageSelect(offerPageIndex);
	 	UpdateItemList();
		 UpdatePageListPos();

		 UpdateThirdPartyPaymentState();

	 }



	/* 更新 三方支付 按钮的显示状态 */
	private function UpdateThirdPartyPaymentState() {
		var isOpen = GameMain.instance().IsOpenThirdPartyPayment();

		btn_thirdPartyPayment.SetVisible(isOpen);
	}



}
