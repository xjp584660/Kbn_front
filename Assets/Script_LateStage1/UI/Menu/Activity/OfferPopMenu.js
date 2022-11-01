#pragma strict

import System;

public class OfferPopMenu extends ComposedMenu implements IEventHandler
{
public var scroll:ScrollList;
var listData:Array = new Array();
//public var  cityTemplate:CityItem;
public var offerItem:OfferPopItem;
//public var data:Array = new Array();
public var selectShow:int =1;
public var bgFrame:Label;
public var menuTitleBg:Label;
public var menuTitle:Label;
public var closeBtn:Button;
public var lastPage:int;
private var curType : int;
private var backRect:Rect;
private var offerData : PaymentOfferData ;
public function Init()
{
	super.Init();
	var texMgr : TextureMgr = TextureMgr.instance();
	bgFrame.useTile = true;
	bgFrame.tile = texMgr.IconSpt().GetTile("popup1_transparent");
	scroll.Init(offerItem);
	scroll.updateable = false;
	//scroll.onDragFnished = OnDragFnished;
	menuTitle.txt = Datas.getArString("paymentLabel.beginnerOfferTtile");
	scroll.btnNextPage.mystyle.normal.background = texMgr.LoadTexture("button_flip_right_normal", TextureType.BUTTON);
	scroll.btnNextPage.mystyle.active.background = texMgr.LoadTexture("button_flip_right_down", TextureType.BUTTON);
	scroll.btnPrevPage.mystyle.normal.background = texMgr.LoadTexture("button_flip_left_normal", TextureType.BUTTON);
	scroll.btnPrevPage.mystyle.active.background = texMgr.LoadTexture("button_flip_left_down", TextureType.BUTTON);
	bgStartY = 16;
	closeBtn.OnClick = CloseMenu;
}

private function OnDragFnished()
{
	var curPage:int = scroll.CurrentPage();
	var pageNum : int = scroll.PageNum();
	var bMovreRight : boolean = scroll.bIsMoveRight();
	if(!bMovreRight && (curPage + 1) >= pageNum)
	{
		setToPage(-1);	
	}
}

public function CloseMenu(param:Object)
{
	MenuMgr.getInstance().PopMenu("");
}

public function OnPush(param:Object)
{
	super.OnPush(param);
	showIphoneXFrame=false;
	 var data : PaymentOfferData = null;
        if ((param as PaymentOfferData) != null)
        {
            offerData = param as PaymentOfferData;
            curType = Payment.instance().currentNoticeType;
        }
        else{
//        	var paramDict : Hashtable = param as Hashtable;
//        	if(paramDict["data"]!=null){
//        		offerData = paramDict["data"];
//        	}
//		    
//		    curType = paramDict["curType"];
        }
	lastPage=-1;
	GetOfferList();
	
	var texMgr : TextureMgr = TextureMgr.instance();
	var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
	bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
	repeatTimes = (rect.height - 15)/bgMiddleBodyPic.rect.height +1;
	backRect = Rect( 5, 5, rect.width, rect.height - 10);
}

function GetOfferList()
{
		listData.length=0;

	listData = PaymentOfferManager.Instance.GetPopOfferDatas();
	scroll.SetData(listData);
	scroll.ResetPos();
	if(listData.Count <=1){
 		scroll.drawPageNum=false;
 	}else scroll.drawPageNum=true;
}

function refreshOfferList()
{
	listData.length=0;

	listData = PaymentOfferManager.Instance.GetPopOfferDatas();
 	if(listData.Count==0) {
		MenuMgr.getInstance().PopMenu("");
		return;
	}
	scroll.Clear();
	scroll.SetData(listData);
	scroll.ResetPos();
	
	if(listData.Count <=1){
 		scroll.drawPageNum=false;
 	}else scroll.drawPageNum=true;
}

//public function handleItemAction(action:String,param:Object):void
//{
//	switch(action)
//	{
//		case "refreshOfferMenuList":
//			refreshData();
//	}
//}

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
				 MenuMgr.getInstance().PopMenu("OfferMenu");
				UpdateSeed.instance().update_seed_ajax(true, afterUpdateSeed);			
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

	refreshOfferList();
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
 	if(listData.Count <=1){
 		scroll.drawPageNum=false;
 	}else scroll.drawPageNum=true;
 	
 	if(isRefresh){
 		if(listData.Count==0) {
 		MenuMgr.getInstance().PopMenu("");
 			return;
 		}
 		scroll.Clear();
 		scroll.SetData(listData);
		scroll.ResetPos();
 	} 		
}



public  function OnPopOver ()
{
	super.OnPopOver ();
	_Global.Log("MonthCard   offerMenu OnPopOver");
	UpdateSeed.instance().update_seed_ajax(true, afterUpdateSeed);
}

//public var ddddd : boolean = false;
public function DrawItem()
{
	bgFrame.Draw();
	scroll.Draw();
	menuTitleBg.Draw();
	menuTitle.Draw();
	closeBtn.Draw();
	
//	if(ddddd)
//	{
//		ddddd = false;
////		PaymentOfferManager.Instance.RemovePaymentMonthlyCardOffer();
////		refreshOfferList();
// MenuMgr.getInstance().PopMenu("OfferMenu");
//	}
}

function DrawBackground()
	{
		if(Event.current.type != EventType.Repaint)
			return;
		
		GUI.BeginGroup(backRect);
		DrawMiddleBg(rect.width - 22,6);
		prot_drawFrameLine();
		GUI.EndGroup();
	}
	
function getPageIndex( type:int)
{
	
}

function setToPage(pageIndex:int)
{
	scroll.SetToPage(pageIndex);
}

function UpdateTouch()
{
	//var offerItem : OfferItem = scroll.curSelectItem;
//	var offerItem : OfferPopItem = scroll.GetItem(0);
//	if(offerItem != null && (offerItem.GetChestDetailView().GetChestScrollView().IsMoved() 
//	&& offerItem.GetChestDetailView().GetChestScrollView().isVisible()) || 
//	(offerItem.GetChestDetailView().GetItemsScrollList().IsMoved() && offerItem.GetChestDetailView().GetItemsScrollList().isVisible()))
//	{
//		scroll.updateable = false;
//	}
//	else 
//	{
//		scroll.updateable = true;
//	}

	scroll.updateable = false;
}

 function Update()
 {
 	scroll.Update();
 	UpdateTouch();

	var curPage:int = scroll.CurrentPage();
	if (curPage >= 0 && curPage < listData.Count && curPage != lastPage)
	{
		lastPage = curPage;

		SetTitle(lastPage);
	}
 }
 
 function SetTitle(curPage:int)
 {
 	if(listData[curPage]!=null){
	 	var data : PaymentOfferData =  listData[curPage] as PaymentOfferData;
	 	menuTitle.txt = data.Name;
 	}
 	
 }
 
 function getPageIndex(data : PaymentOfferData)
 {
 	if(data!=null){
 		for(var i:int;i<listData.Count;i++){
 		var item : PaymentOfferData =  listData[i] as PaymentOfferData;;
 		if(data.Id==item.Id){
 			return i;
 		}
 		}
 	}
 	
 	return 0;
 }
 
 

}