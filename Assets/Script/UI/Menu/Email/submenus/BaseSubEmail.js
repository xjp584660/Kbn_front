class BaseSubEmail extends SubMenu
{	
	public var btnPre:Button;
	public var btnNext:Button;
	public var btnDelete:Button;
	public var btnBlock:Button;
	public var btnReply:Button;
	public var btnAccept:Button;
	public var btnRefuse:Button;
	public var btnInviteBlock:Button;
	protected var _MessageType:int;
	
	public var btnFwd:Button;
	
	protected var g_header:HashObject;
	protected var g_index:int;
	protected var g_type:int;

	//setting of layout
	private var g_originalTopY:int = 40;
	private var g_btnTopWight:int = 50;
	private var g_btnTopHeight:int = 50;
	
	private var g_originalBottomY:int = 880;
	private var g_btnBottomWight:int = 70;
	private var g_btnBottomHeight:int = 60;
	
	protected var seed:Object;
	protected var arString:Object;
	protected var g_userId:int;
	protected var g_messageId:String;
	private var g_hasDeleteMessage:boolean;
	
	
	public function Init()
	{
		btnPre.Init();
		btnNext.Init();		
		btnDelete.Init();
		btnBlock.Init();
		
		if (KBN._Global.IsLargeResolution ()) 
		{
			btnPre.rect.width = 62;
			btnNext.rect.width = 62;
			btnBack.rect.width = 62;
		} 
		else if (KBN._Global.isIphoneX ()) 
		{
			btnPre.rect.width = 85;
			btnNext.rect.width = 85;
			btnBack.rect.width = 85;
		}
		else
		{
			btnPre.rect.width = 75;
			btnNext.rect.width = 75;
			btnBack.rect.width = 75;
		}
		btnPre.rect.height = 64;
		btnNext.rect.height = 64;
		btnBack.rect.height = 64;
		//frameTop.rect = Rect( 0, bgStartY - 2, frameTop.rect.width, frameTop.rect.height);

		if(btnFwd)
		{
			btnFwd.Init();
		}
		if(btnReply)
		{
			btnReply.Init();
		}
		if(btnAccept) { btnAccept.Init(); }
		if(btnRefuse) { btnRefuse.Init(); }
		if(btnInviteBlock) { btnInviteBlock.Init(); }

		btnBack.Init();

		//titleBack = TextureMgr.instance().LoadTexture("bg_ui_second_layer", TextureType.BACKGROUND);
		titleBack  = TextureMgr.instance().BackgroundSpt().GetTile("bg_ui_second_layer");
		//titleBack.rect = titleBack.spt.GetTileRect("bg_ui_second_layer");
		//titleBack.name = "bg_ui_second_layer";
		titleBack.rect.x = 0;
		titleBack.rect.y = 0;
		_MessageType = 0;
	}

	protected function handleBackBtn()
	{
		if(g_hasDeleteMessage)
		{
			EmailMenu.getInstance().resetPageInfor();
		}
	
		EmailMenu.getInstance().PopSubMenu();
	}
	
	protected function handleReplyBtn()
	{
		var data:Object = {"name":g_header["displayName"].Value,"subject":Datas.getArString("Common.Rep") + ":" + g_header["subject"].Value};
		EmailMenu.getInstance().clickCompose(data);
	}
						
	function DrawItem()
	{
		btnBack.Draw();		
		btnPre.Draw();
		btnNext.Draw();
		if (_MessageType != Constant.MessageType.AllianceInvite)
		{
			btnDelete.Draw();
		}
		
		if(btnReply && _MessageType != Constant.MessageType.AllianceInvite)
		{
			btnReply.Draw();
		}
		
		if(g_type != EmailMenu.REPORT_TYPE)
		{
			if (_MessageType == Constant.MessageType.AllianceInvite)
			{
				btnAccept.Draw();
				btnRefuse.Draw();
				btnInviteBlock.Draw();
			}
			else
			{
				btnBlock.Draw();
				btnFwd.Draw();				
			}
		}

		frameTop.Draw();
	}
	
	function DrawBackground()
	{
	}
	
	function DrawTitle()
	{
	//	GUI.Label(Rect(0, 0, titleBack.width, titleBack.height), titleBack);
		titleBack.Draw();
		DrawMiddleBg();
//		GUI.Label(Rect(0, bgStartY - 2, frameTop.width, frameTop.height), frameTop);

		//frameTop.Draw();

		bgBottomBodyPic.rect = Rect(0, 980 - bgBottomBodyPic.rect.height, bgBottomBodyPic.rect.width, bgBottomBodyPic.rect.height);
		bgBottomBodyPic.Draw(true);
		//GUI.Label(Rect(0, 960 - bgBottomBodyPic.rect.height, bgBottomBodyPic.rect.width, bgBottomBodyPic.rect.height), bgBottomBodyPic);	
	}
	
	protected function nextEmail()
	{
		g_index++;				
		var count:int = Message.getInstance().getHeadersCount(g_type);
		
		if(g_index >= count)
		{
			g_index = 0;
		}
		else if(g_index < 0)
		{
			g_index = count - 1;
		}
		if (Message.getInstance().getMessageHeader(g_type,g_index)==null) {
			nextEmail();
		}
		
		EmailMenu.getInstance().setEmailItemRead(g_type, g_index);
	}
	
	protected function preEmail()
	{
		g_index--;
		var count:int = Message.getInstance().getHeadersCount(g_type);
		
		if(count == 0)
		{
			EmailMenu.getInstance().resetPageInfor();
			EmailMenu.getInstance().PopSubMenu();
			return;
		}
		
		if(g_index >= count)
		{
			g_index = 0;
		}
		else if(g_index < 0)
		{
			g_index = count - 1;
		}
		if (Message.getInstance().getMessageHeader(g_type,g_index)==null) {
			// nextEmail();
			preEmail();
		}
		
		EmailMenu.getInstance().setEmailItemRead(g_type, g_index);				
	}

	private function deleteMessage()
	{
		//use the function in the class of NewEmailMenu
		g_hasDeleteMessage = true;
		preEmail();
	}
	
	private function backToMenu()
	{
		EmailMenu.getInstance().PopSubMenu();
	}
	
	public function OnPop()
	{
		super.OnPop();
		
		var _obj:HashObject = new HashObject();
		EmailMenu.getInstance().resetTipAndAlert();
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush(param);
	
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");//
	//	bgMiddleBodyPic.spt = TextureMgr.instance().BackgroundSpt();
		//bgMiddleBodyPic.rect = bgMiddleBodyPic.spt.GetTileRect("ui_paper_bottom");
		//bgMiddleBodyPic.name = "ui_paper_bottom";
		//bgMiddleBodyPic.spt.edge = 2;
		//repeatTimes = (rect.height - 1) / bgMiddleBodyPic.rect.height + 1;	
		
//		frameTop.spt = TextureMgr.instance().BackgroundSpt();
//		frameTop.rect = frameTop.spt.GetTileRect("frame_metal_top");
//		frameTop.name = "frame_metal_top";
		
		bgBottomBodyPic = TextureMgr.instance().BackgroundSpt().GetTile("tool bar_bottomnew");
		bgBottomBodyPic.rect.width = 640;
		//bgBottomBodyPic.rect = titleBack.spt.GetTileRect("tool bar_bottom");
		//bgBottomBodyPic.name = "tool bar_bottom";
		if(param as Hashtable)
		{
			g_type = _Global.INT32((param as Hashtable)["type"]);
			g_index = _Global.INT32((param as Hashtable)["index"]);
		}
		else
		{
			g_type = _Global.INT32((param as HashObject)["type"]);
			g_index = _Global.INT32((param as HashObject)["index"]);
		}
		
		EmailMenu.getInstance().setEmailItemRead(g_type, g_index);
		
		g_hasDeleteMessage = false;
		
//		arString = Datas.instance().arStrings();
		
		btnDelete.txt = Datas.getArString("Common.Delete");
		btnBlock.txt = Datas.getArString("Common.Block");//
		if(btnFwd)
		{
			btnFwd.OnClick = Forward;
			btnFwd.txt = Datas.getArString("MessagesModal.FWD");//MessagesModal^FWD	
		}
		
		if(btnReply)
		{
			btnReply.txt = Datas.getArString("Common.Reply");	
			btnReply.OnClick = handleReplyBtn;
		}
		
		btnBlock.OnClick = handleBlock;
		btnDelete.OnClick = handleDelete;
		btnBack.OnClick = handleBackBtn;
		btnNext.OnClick = nextEmail;
		btnPre.OnClick = preEmail;
		
		if (btnAccept)
		{
			btnAccept.txt = Datas.getArString("Alliance.InviteAccept");
			btnAccept.OnClick = OnAccept;
		}
		if (btnRefuse)
		{
			btnRefuse.txt = Datas.getArString("Alliance.InviteRefuse");
			btnRefuse.OnClick = OnRefuse;
		}
		if (btnInviteBlock)
		{
			btnInviteBlock.txt = Datas.getArString("Alliance.InviteBlock");
			btnInviteBlock.OnClick = handleBlock;
		}
	}
	
	protected function handleDelete()
	{
	
	}
	
	protected function Forward():void
	{
		
	}
	
	protected function OnAccept():void {}
	protected function OnRefuse():void {}

	protected function handleBlock():void
	{
		if(g_userId == Datas.instance().tvuid())
		{
			return;
		}

		var confirmDialog : ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
		confirmDialog.setLayout(600,360);
		confirmDialog.setTitleY(60);
		confirmDialog.setContentRect(70,140,0,260);
		confirmDialog.setDefaultButtonText();		
		MenuMgr.getInstance().PushConfirmDialog(Datas.getArString("Common.BlockUser"), "", sureToBlockUser, null);
	}
	
	private function sureToBlockUser():void
	{
//		var idsArray:Array = new Array();
//		idsArray.push(g_messageId);		
//		var _boxType:String = "inbox";
//		Message.getInstance().Action("blockUser", idsArray, _boxType, successBlock, failBlock);	

		UserSetting.getInstance().BlockUser(g_messageId, g_userId, g_header["displayName"].Value as String, successBlock, null);
	}
	
	protected function successBlock(data:Object):void
	{
		EmailMenu.getInstance().PopSubMenu();
		MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.BlockSuccess"));
		MenuMgr.getInstance().PopMenu("");		
		EmailMenu.getInstance().resetPageInfor();
		EmailMenu.getInstance().resetMessageCurPage();
	}
	
	protected function GetDetailContent():String
	{
		return "";
	}
	
	protected function UpdateButtonState():void {
		if (_MessageType == Constant.MessageType.AllianceInvite) {
			btnAccept.EnableBlueButton(g_type == EmailMenu.INBOX_TYPE2);
			btnRefuse.EnableBlueButton(g_type == EmailMenu.INBOX_TYPE2);
			btnInviteBlock.EnableBlueButton(g_type == EmailMenu.INBOX_TYPE2);
		}
	}
}
