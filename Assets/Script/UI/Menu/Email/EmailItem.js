class EmailItem extends ListItem
{
	public var userName:Label;
	public var date:Label;
	public var subject:Label;	
	public var reportMes:Label;
	public var reportSub:Label;
	public var iconGoto:Label;
	public var btnNewMultiSelect:ToggleButton;
	public var frame:Label;
	
	public var envelopeIcon:Label;
	private var textOpenEnvelope:Texture2D;
	private var textCloseEnvelope:Texture2D;
	public var bgClick:Label;
	public var bgUnread:Label;
	public var clickBtn:SimpleButton;
	
	public var isSysBox:boolean = false;
	
	private var count:int = 0;
	private var maxtimes:int = 10;
	private var minTimes:int = 0;
	private var moveSpeed:int = 5;
	private var isMove:boolean = false;
	
	private var messageType:int;
	private var index:int;	
	private var isRead:boolean = false ;
	private var g_id:int;
	private var g_isAllSelect:boolean;
	private var g_isClicked:boolean;
	
	private	var g_originalColor:Color = new Color(0.424, 0.282, 0.149,1);
	private var g_clickColor:Color = new Color(1,1,1,1);
	
//	public function get itemIndex():int
//	{
//		return index;
//	}
	
	public function get isSelect():boolean
	{
		if(EmailMenu.getInstance().isListItemSelectAll())
		{
			return true;
		}
		
		return btnNewMultiSelect.selected;
	}
	
	public function DrawItem()
	{
//		GUI.BeginGroup(rect);
		
		if(!isRead)
		{
			bgUnread.Draw();
		}
		else
		{
			frame.Draw();
		}
		
		if(g_isClicked)
		{
			bgClick.Draw();
		}
		
		if(EmailMenu.getInstance().isEditable())
		{
			if(count < maxtimes)
			{
				count++;
				isMove = true;
			}
			else
			{
				isMove = false;
			}
		}
		else
		{
			if(count > 0)
			{
				count--;
				isMove = true;
			}
			else
			{
				isMove = false;
			}
				
			clickBtn.Draw();
			
		}
		
		envelopeIcon.Draw();

 		if(messageType != EmailMenu.REPORT_TYPE)
		{
			userName.Draw();
			subject.Draw();
	
			date.Draw();
			
			if(isMove)
			{
				if(EmailMenu.getInstance().isEditable())
				{
					userName.rect.x += moveSpeed;
					subject.rect.x += moveSpeed;
					envelopeIcon.rect.x += moveSpeed;
				}
				else
				{
					userName.rect.x -= moveSpeed;
					subject.rect.x -= moveSpeed;
					envelopeIcon.rect.x -= moveSpeed;
				}
			}
		}
		else
		{
			reportSub.Draw();
			reportMes.Draw();
			
			if(isMove)
			{
				if(EmailMenu.getInstance().isEditable())
				{
					reportSub.rect.x += moveSpeed;
					envelopeIcon.rect.x += moveSpeed;
				}
				else
				{
					reportSub.rect.x -= moveSpeed;
					envelopeIcon.rect.x -= moveSpeed;	
				}
			}
		}

		if(count == 10)
		{
			btnNewMultiSelect.Draw();
			if(g_isAllSelect != EmailMenu.getInstance().isListItemSelectAll())
			{
				btnNewMultiSelect.selected = EmailMenu.getInstance().isListItemSelectAll();
				g_isAllSelect = EmailMenu.getInstance().isListItemSelectAll();
			}
		}

		iconGoto.Draw();
//		GUI.EndGroup();
	}
	
	public function get itemIndex():int
	{
		return index;
	}
	
	public function setReaded( updateIcon : boolean ):void
	{
		if(!isRead)
		{
			if(messageType == EmailMenu.REPORT_TYPE)
			{
				reportSub.font = FontSize.Font_20;
				reportMes.font = FontSize.Font_20;			
			}
			else
			{
				userName.font = FontSize.Font_22;
				subject.font = FontSize.Font_18;
				date.font = FontSize.Font_20;
			}
			if( updateIcon ) {
				envelopeIcon.mystyle.normal.background = textOpenEnvelope;
			}
			
			isRead = true;
		}
	}

	private function handleGoto()
	{
		setClicked(true);
	
		var data = {"type": messageType, "index":index,"isSys":isSysBox};
		
		
		if(messageType == EmailMenu.REPORT_TYPE)
		{
			EmailMenu.getInstance().clickReport(data);
		}
		else
		{
			EmailMenu.getInstance().clickInbox(data);
		}
		
		if(!isRead)
		{
			if(messageType == EmailMenu.REPORT_TYPE)
			{
				reportSub.font = FontSize.Font_20;
				reportMes.font = FontSize.Font_20;
							
			}
			else
			{
				userName.font = FontSize.Font_22;
				subject.font = FontSize.Font_18;
				date.font = FontSize.Font_20;
			}
			
			envelopeIcon.mystyle.normal.background = textOpenEnvelope;
			
			isRead = true;
		}
	}
	
	public function resetData(_type:int,_index:int)
	{
		useGroupDraw = false;
		bgUnread.setBackground("Brown_Gradients2",TextureType.DECORATION);
		frame.setBackground("Brown_Gradients_normal",TextureType.DECORATION);
		textOpenEnvelope = TextureMgr.instance().LoadTexture("fuction_icon_smallMail2", TextureType.DECORATION);
		textCloseEnvelope = TextureMgr.instance().LoadTexture("fuction_icon_smallMail1", TextureType.DECORATION);	
		
		messageType = _type;
		index = _index;	
		count = 0;
		g_isClicked = false;
		
		clickBtn.OnClick = handleGoto;
		
		g_isAllSelect = EmailMenu.getInstance().isListItemSelectAll();
		
		var data:HashObject = Message.getInstance().getMessageHeader(messageType, index);		
		
		var MsgType:int = _Global.INT32(data["messageType"]);
		if(messageType == EmailMenu.INBOX_TYPE||messageType == EmailMenu.INBOX_TYPE2){
			if(data["isSys"] != null){
				isSysBox = (_Global.INT32(data["isSys"].Value) == 1);
			}else{
				isSysBox = false;
			}
			if (MsgType == Constant.MessageType.AllianceInvite) {
				textOpenEnvelope = TextureMgr.instance().LoadTexture("Invitations_small2", TextureType.DECORATION );
				textCloseEnvelope = TextureMgr.instance().LoadTexture("Invitations_small1", TextureType.DECORATION );
			}
		}
		
		if(messageType != EmailMenu.REPORT_TYPE)
		{
			isRead = _Global.INT32(data["messageRead"].Value) == 1 ? true : false;
			envelopeIcon.rect.y = 0;
			envelopeIcon.rect.width = 55;
			envelopeIcon.rect.height = 53;
			if(isRead)
			{
				userName.font = FontSize.Font_22;
				subject.font = FontSize.Font_18;
				date.font = FontSize.Font_20;
				envelopeIcon.mystyle.normal.background = textOpenEnvelope;
			}
			else
			{
				userName.font = FontSize.Font_22;
				subject.font = FontSize.Font_18;
				date.font = FontSize.Font_20;
				envelopeIcon.mystyle.normal.background = textCloseEnvelope;
			}

			if ( MsgType == Constant.MessageType.AllianceSys && data["allianceName"] != null && data["allianceName"].Value as String != null )
			{
				var allianceName : String = data["allianceName"].Value as String;
				var fmtString : String = Datas.getArString("Alliance.MessageSender");
				var showName : String = String.Format(fmtString, allianceName);
				userName.txt = showName;
			}
			else
			{
				userName.txt = data["displayName"].Value;
			}
			subject.txt = data["subject"].Value;
			date.txt = _Global.DateTime(_Global.INT64(data["unixTime"]));
			g_id = _Global.INT32(data["messageId"]);	
		}
		else
		{
			isRead = _Global.INT32(data["messageRead"].Value) == 1 ? true : false;
			if(isRead)
			{
				reportSub.font = FontSize.Font_20;
				reportMes.font = FontSize.Font_20;
			}
			else
			{
				reportSub.font = FontSize.Font_20;
				reportMes.font = FontSize.Font_20;
			}
			
			reportSub.txt = data["subject"].Value;
			reportMes.txt = data["date"].Value;
			g_id = _Global.INT32(data["rid"]);
		}	
	}
	
	public function setReportIconBySuccessState( successful : boolean ) {
		var icon : Texture2D;
		if( successful ) {
			icon = TextureMgr.instance().LoadTexture("icon_reports_win", TextureType.DECORATION);
		} else {
			icon = TextureMgr.instance().LoadTexture("icon_reports_lose", TextureType.DECORATION);
		}
		
		envelopeIcon.mystyle.normal.background = icon;
		envelopeIcon.rect.y = 33;
		envelopeIcon.rect.width = 45;
		envelopeIcon.rect.height = 53;
	}
	
	public function get hasRead():boolean
	{
		return isRead;
	}

	public function SetRead()
	{
		this.isRead = true;
	}
	
	public function get id():int
	{
		return g_id;
	}
	
	public function setClicked(_click:boolean):void
	{
		g_isClicked = _click;
		
		if(_click)
		{
			userName.mystyle.normal.textColor = g_clickColor;
			date.mystyle.normal.textColor = g_clickColor;
			subject.mystyle.normal.textColor = g_clickColor;
			reportMes.mystyle.normal.textColor = g_clickColor;
			reportSub.mystyle.normal.textColor = g_clickColor;
		}
		else
		{
			userName.mystyle.normal.textColor = g_originalColor;
			date.mystyle.normal.textColor = g_originalColor;
			subject.mystyle.normal.textColor = g_originalColor;
			reportMes.mystyle.normal.textColor = g_originalColor;
			reportSub.mystyle.normal.textColor = g_originalColor;			
		}
	}
	
	public function Init():void
	{
		userName.Init();
		date.Init();
		subject.Init();	
		reportMes.Init();
		reportSub.Init();
	}
}
