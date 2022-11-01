class MigrateDialog extends PopMenu
{
	public var l_bg:Label;
	public var mtitle:Label;
	public var m_message:Label;
	public var timerLabel:Label;
	public var timerMsgLabel:Label;
	public var btnConfirm:Button;
	public var btnCancle:Button;
	public var backGround:Label;
	public var redBack:Label;
	public var redBackLabel:Label;
	

//	protected var _callBack:System.Net.Sockets.MulticastDelegate;
	private var migrateType:int;
	private var migrateTime:String;
	private var isFromLoading:boolean=false;
	private var costItemId:int = 0;// migrate item Id
	private var costItemCount:int = 0;//cancle migrate consume item count
	private var migrateConsumItemCount:int = 0;//migrate consume item count


    @SerializeField private var headImage : Label;
    

	public function Init():void
	{
		
		super.Init();

		btnConfirm.OnClick = onClick;
		btnCancle.OnClick= OnCancelClick;
		btnClose.OnClick = 	OnCloseClick;
        btnCancle.changeToRedNew();
		frameSimpleLabel.rect = new Rect(25, 40, 590, rect.height -40);        
        
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		bgMiddleBodyPic = null;
		//bgMiddleBodyPic.rect = new Rect(25, 40, 590, rect.height -40); 
		bgStartY = 40; 			
        //headImage.mystyle.normal.background = TextureMgr.instance().LoadTexture("character_Morgause", TextureType.FTE);
	}
	
	
	public function Draw()
	{
		super.Draw();
	}
	
	public function DrawItem()
	{
		backGround.Draw();
		mtitle.Draw();
		m_message.Draw();
		btnClose.Draw();
		btnConfirm.Draw();
		btnCancle.Draw();
	}
	
	public function DrawLastItem()
	{
        headImage.Draw();
        redBack.Draw();
        redBackLabel.Draw();
	}
	
//	public function DrawMiddleBg(width:int,startX:int)
//	{
//        super.DrawMiddleBg(width,startX);
//		bgMiddleBodyPic.rect = new Rect(25, 40, 590, rect.height -40); 
//	}

	function OnPush(param:Object)
	{
		rect.x = (MenuMgr.SCREEN_WIDTH - rect.width) /2;
		rect.y = (MenuMgr.SCREEN_HEIGHT - rect.height) /2;
        
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		if ( iconSpt == null )
			return;
		frameSimpleLabel.useTile = true;
		frameSimpleLabel.tile = iconSpt.GetTile("popup1_transparent");
		redBackLabel.txt =  Datas.getArString("BuildingTutorial.labName");
		
		if(param!=null){
		  var paramDic : Hashtable = param as Hashtable;
		  migrateType = paramDic["type"];
		  
		  if(paramDic["fromLoading"]){
		  	isFromLoading=paramDic["fromLoading"]==1?true:false;
		  }
		  if(migrateType==0){//wait for migrate
		  	MigrateWait(paramDic);
		  }else if(migrateType==1){//migrate success
		  	MigrateSuccess(paramDic);
		  }else {//migrate fail
		  	MigrateFailed(paramDic);
		  }
		}
		
		
	}

	
	function MigrateWait(param:Hashtable){
		MenuMgr.getInstance().AndroidBackEnable=false;
		migrateTime = param["time"];
		btnConfirm.txt =  Datas.getArString("Migrate.Complete_ButtonQuit");
		btnCancle.txt =  Datas.getArString("Migrate.Complete_ButtonCancel");
		btnCancle.changeToRedNew();
		btnCancle.SetVisible(true);
		mtitle.SetVisible(false);
		m_message.rect = new Rect(280,98,310,161);
		btnCancle.rect = new Rect(323,304,220,60);
		btnConfirm.rect = new Rect(323,232,220,60);
		m_message.txt=Datas.getArString("Migrate.Complete_text",[String.Format("<color=#348620>{0}</color>",migrateTime)]);
//		String.Format("Your account is now waiting for Migration.Please come back after {0} UTC time when the migration is over.",migrateTime);
	}
	
	function MigrateSuccess(param:Hashtable){
		var sourceServer:String =param["sourceServer"];
		var targetServerServer:String =param["targetServer"];
		var renameItemCount:String =param["renameItemCount"]+"";
		btnConfirm.txt =  Datas.getArString("Common.OK_Button");
		btnCancle.SetVisible(false);
		mtitle.SetVisible(true);
		timerMsgLabel.rect = new Rect(260,80,300,161);
		m_message.rect = new Rect(292,132,300,161);
		btnConfirm.rect = new Rect(323,280,220,60);
		mtitle.SetNormalTxtColor(FontColor.New_PopUp_Title_Green);
		mtitle.txt=Datas.getArString("Migrate.EnterGame_SuccessTitle");//;
		m_message.txt=Datas.getArString("Migrate.EnterGame_SuccessText",[sourceServer,targetServerServer,renameItemCount]);
	}
	
	function MigrateFailed(param:Hashtable){
	var sourceServer:String =param["sourceServer"];
	var errorCode:int =param["errorCode"];
		btnConfirm.txt =  Datas.getArString("Common.OK_Button");
		btnCancle.SetVisible(false);
		mtitle.SetVisible(true);
		timerMsgLabel.rect = new Rect(260,80,300,161);
		m_message.rect = new Rect(286,154,300,161);
		btnConfirm.rect = new Rect(323,280,220,60);
		mtitle.SetNormalTxtColor(FontColor.New_PopUp_Title_Red);
		mtitle.txt=Datas.getArString("Migrate.EnterGame_FailedTitle");
		if(errorCode==9002){
			m_message.txt=Datas.getArString("Migrate.EnterGame_Failedreason1",[sourceServer]);
		}else
		   m_message.txt=Datas.getArString("Migrate.EnterGame_FailedText",[sourceServer]);
	}
	
	public function SetDefault():void
	{
		var data:Datas = Datas.instance();

		btnClose.SetVisible(true);
		btnConfirm.SetVisible(true);
		
		timerMsgLabel.txt = Datas.getArString("PopUpInfor.AccessGame");

		btnConfirm.txt =  Datas.getArString("Common.OK_Button") ? Datas.getArString("Common.OK_Button") : "OK";//Datas.getArString("Common.OK_Button");
//		_callBack = null;
		resetLayout();
	}
	
	public function setTitleY(y:int):void
	{
		title.rect.y = y;	
	}
	
	public function setContentRect(contentRect:Rect):void
	{
		m_message.rect.x = contentRect.x;
		m_message.rect.y = contentRect.y;
		if(contentRect.width == 0)
			contentRect.width = rect.width - 2*contentRect.x;
		m_message.rect.width = contentRect.width;
		m_message.rect.height = contentRect.height;
		resetLayout();
	}
	
	public function setLayout(wid:int,hgt:int):void
	{
		if(wid <= 0)
			wid = this.rect.width;
			
		this.rect.width = wid;
		this.rect.height = hgt;
		
		l_bg.rect.width = wid - l_bg.rect.x * 2;	// 10
		l_bg.rect.height = hgt - l_bg.rect.y * 2;	//10

		rect.x = (MenuMgr.SCREEN_WIDTH - rect.width)/2;
		rect.y = (MenuMgr.SCREEN_HEIGHT - rect.height)/2;		
			
	}
	
	public function OnPop()
	{

		super.OnPop();
	}

	
	protected function onClick(param:Object):void
	{
		
		switch(migrateType){
			case 0:
				 Application.Quit(); 
			break;
			case 1://
				MenuMgr.getInstance().PopMenu("");
			break;
			case 2:
				MenuMgr.getInstance().PopMenu("");
			break;
			default :
				MenuMgr.getInstance().PopMenu("");
			break;

		}
	}
	
	public function OnCancelClick(){
	
			var okFunc:Function=function(result:HashObject){
				MenuMgr.getInstance().PopMenu("");
				
				var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
				dialog.menuName = "migrateCancle";
				dialog.setLayout(600,380);
				dialog.setTitleY(60);
				dialog.setContentRect(70,120,0,120);
				dialog.setButtonText(Datas.getArString("Common.Yes"),Datas.getArString("Common.No"));
				migrateConsumItemCount = _Global.INT32(result["migrateCostItemAmt"]);
				costItemCount = _Global.INT32(result["costItemAmt"]);
				costItemId = _Global.INT32(result["itemId"]);
				var message:String=Datas.getArString("Migrate.Wait_ConfirmPopUp",[costItemCount]);
//				String.Format("Cancelling Migration will cost you {0} ticket,are you sure you want to cancel the Migration------>?", _Global.INT32(result["costItemAmt"]));
				MenuMgr.getInstance().PushConfirmDialog(message,"",shareOkClick,shareCancelClick);
//				dialog.setDefaultButtonText();

				if (dialog.btnClose)
				{
					dialog.btnClose.OnClick = shareCancelClick;
				}
			};
	
	
			var errorFunc:Function = function(errorMsg:String, errorCode:String)
			{
				
				MenuMgr.getInstance().PopMenu("");
				ErrorMgr.instance().PushError("",Datas.getArString("Error.err_"+errorCode),false,Datas.getArString("FTE.Restart"),restart);
				
			};
	
	
			
			
			var actionType:String = "GetTicket";//get migrate item count
			UnityNet.MigrateCancel(actionType,okFunc,errorFunc);

	}
	
	private function restart()
	{
		GameMain.instance().restartGame();
	}
	
	
	
	
	public function shareOkClick(){
//		_Global.Log("shareOkClick---------->" );
		MenuMgr.getInstance().PopMenu("");
		var okFunc:Function=function(result:HashObject){
				if (result["ok"].Value){
//					Application.Quit();
					if(isFromLoading){
						GameMain.instance().changeMigrateItemCount(costItemId, migrateConsumItemCount-costItemCount);
						GameMain.instance().fte_checkFTE();
					}else{
						MyItems.instance().AddItem(costItemId, costItemCount*(-1));
					}
					MenuMgr.getInstance().AndroidBackEnable=true;
				}
			};
		var errorFunc:Function = function(errorMsg:String, errorCode:String)
			{
				
				MenuMgr.getInstance().PopMenu("");
				ErrorMgr.instance().PushError("",Datas.getArString("Error.err_"+errorCode),false,Datas.getArString("FTE.Restart"),restart);
				
			};
			
			var actionType:String = "CancelMigrate";//get migrate item count
			UnityNet.MigrateCancel(actionType,okFunc,errorFunc);
	}
	
	public function shareCancelClick(){
//		_Global.Log("shareCancelClick---------->" );
		MenuMgr.getInstance().PopMenu("");
		MenuMgr.getInstance().PushMenu("MigrateDialog", {"type":0,"time":migrateTime}, "trans_zoomComp");
	}
	

	
	public function OnCloseClick()
	{
	
 	}
}

