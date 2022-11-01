class ConversationItem extends ListItem
{ 
	public var bgBorder:SimpleLabel;
	public var avatar:SimpleLabel;
	public var userName:Label;
	public var message:Label;
	public var msgDateTime:Label;
	public var userAllianceicon:Label;
	public var userAllianceName:Label;
	
//	public var newMsgLabel:Label;
	
//	public var btnUserInfo:Button;
	public var btnBackground:Button; 
	
	public var gotoDetailChatBtn:Button;
	
	public var opSelectCheckBox:CheckBox;
	
	// Private variables
	private var picAlliance:Texture2D = null;
	private var picChancellor:Texture2D = null;
	private var picViceChancellor:Texture2D = null;
	
	public static final var colorUserName:Vector3 = new Vector3(69.0f, 44.0f, 3.0f);
	public static final var colorUserNameFlash:Vector3 = new Vector3(255.0f, 255.0f, 60.0f);
	
	private var isFirstIn:boolean = true;
	private var checkboxLastVisible:boolean = true;
	private var data:SingleConvData = null;
	private var onGotoDetailDel:Function;
	
	private var flashAni:FlashAnimation = null;
	
	public function Init()
	{
		super.visible = true;	
		super.Init();
		
		picAlliance = null;
		picChancellor = null;
		picViceChancellor = null;
		
		isFirstIn = true;
		checkboxLastVisible = true;
		data = null;
		onGotoDetailDel = null;
		
		initLayout();
	}
	
	private function initLayout()
	{
		gotoDetailChatBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_moreinfo_small2_normal", TextureType.BUTTON);
		gotoDetailChatBtn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_moreinfo_small2_down", TextureType.BUTTON);
		bgBorder.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_chat_white1", TextureType.DECORATION);
		
		//
		avatar.useTile = true;
		avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile("player_avatar_defualt");
		
		userName.normalTxtColor = FontColor.Grey;
		message.normalTxtColor = FontColor.SmallTitle;
		
		if (KBN._Global.IsLargeResolution ()) 
		{ 
			rect = new Rect(20, 0, 604, 135);
			avatar.rect = new Rect(12, 12, 90, 94);
			bgBorder.mystyle.border = new RectOffset(15, 22, 15, 20);
			bgBorder.rect = new Rect(0, 0, rect.width, 117);
			btnBackground.rect = bgBorder.rect;
			gotoDetailChatBtn.rect.y = 35;
			gotoDetailChatBtn.rect.width = 43;
			gotoDetailChatBtn.rect.height = 50;
		}
		else 
		{
			rect = new Rect(20, 0, 604, 100);
			avatar.rect = new Rect(12, 9, 82, 70);
			bgBorder.mystyle.border = new RectOffset(15, 22, 15, 20);
			bgBorder.rect = new Rect(0, 0, rect.width, 86);
			btnBackground.rect = bgBorder.rect;
			gotoDetailChatBtn.rect.y = 27;
			gotoDetailChatBtn.rect.width = 40;
			gotoDetailChatBtn.rect.height = 37;
			
		}
		userName.rect.x = 110;
		userName.rect.y = 5;
		userName.SetFont(FontSize.Font_18);
		
		message.rect.x = 110;
		message.rect.y = 30;
		
		msgDateTime.rect.x = 375;
		
		gotoDetailChatBtn.rect.x = 540;
		
		opSelectCheckBox.rect.y = 54;
		
//		bgBorder.mystyle.border = new RectOffset(15, 22, 15, 20);
//		bgBorder.rect = new Rect(0, 0, rect.width, 86);
//		btnBackground.rect = bgBorder.rect;
	}
	
	public function Draw()
	{
		if (!super.visible)
			return;
			
		GUI.BeginGroup(super.rect);
		
		// Notice the draw sequence, can treat as layers
		btnBackground.Draw();
//		btnUserInfo.Draw();
		
		bgBorder.Draw();
		avatar.Draw();
		userName.Draw();
		message.Draw();
		msgDateTime.Draw();
		
//		userAllianceicon.Draw();
//		userAllianceName.Draw();
		
		//newMsgLabel.Draw();
		
		gotoDetailChatBtn.Draw();
		
		opSelectCheckBox.Draw();
		
		GUI.EndGroup();
		
		// Temporary position here
		if (null != flashAni)
			flashAni.Update();
	}
	
	public override function SetRowData(object:Object):void
	{
		Init();
		
		// Make the Active texture beautiful
		//btnBackground.rect.y = userName.rect.y - 5;
		//btnBackground.rect.height = splitUnderLine.rect.y + 5;
		
		btnBackground.OnClick = OnClickGotoDetailChatBtn;
		//btnUserInfo.OnClick = OnClickGotoDetailChatBtn; // Not need
		//gotoDetailChatBtn.OnClick = OnClickGotoDetailChatBtn;
		
		// Value setting
		data = object as SingleConvData;
		
		SetDisplayData();
		ShowSelect(false);
	}
	
	private function SetDisplayData()
	{
		if (null != data && data.Count != 0)
		{
			avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(data.targetAvatar));
			
			userName.txt = data.targetName; // Display the target userName
			userName.ClipText();
			
			var lastestData:ChatItemData = data.GetChatData(data.Count - 1);
			var finalString:String = lastestData.msgContent;
			if(!String.IsNullOrEmpty(lastestData.shareReport))
			{
			   var tempStr:String = lastestData.msgContent.ToString();
			   var arr:Array = tempStr.Split(":"[0]);
			   if(arr.length>2){
		           var defName:String = arr[0].ToString();
		           var attackName:String = arr[1].ToString();
		           var isWin:boolean = _Global.INT32(arr[2])==1;
		            if(String.IsNullOrEmpty(attackName))
				   {
				     attackName = Datas.getArString("Common.Enemy");
				   }
				   if(String.IsNullOrEmpty(defName)){
				     defName = Datas.getArString("Common.Enemy");
				   }
		           if(isWin)
		           {
		             finalString = String.Format(Datas.getArString("BattleReprotShare.Text"),attackName,defName);
		           }
		           else
		           {
		           	 finalString = String.Format(Datas.getArString("BattleReprotShare.Text"),defName,attackName);
		           }
	           }
			}
			message.txt = finalString;
			message.ClipText();
			
			msgDateTime.txt = lastestData.msgDateTime;
			
			// Show target alliance data
			userAllianceName.txt = data.targetAllianceName;
			userAllianceName.ClipText();
			
			SetIconForAlliance(0);
			userAllianceicon.SetVisible(!String.IsNullOrEmpty(data.targetAllianceName));
			
			//newMsgLabel.SetVisible(lastestData.chatState == ChatItemData.ChatStateUnread);
			var isNewMsg:boolean = lastestData.chatState == ChatItemData.ChatStateUnread;
			if (isNewMsg)
			{
				if (null == flashAni) flashAni = new FlashAnimation();
				flashAni.StartFlash(userName, Constant.ColorValue.ToRGBA(colorUserName)
									, Constant.ColorValue.ToRGBA(colorUserNameFlash), 2, -1);
			}
			else
			{
				if (null != flashAni)
				{
					flashAni.StopFlash(userName);
					userName.normalTxtColor = FontColor.Grey;
				}
			}
		}	
	}
	
	public function SetGotoDetailDelegate(del:Function)
	{
		onGotoDetailDel = del;
	}
	
	public function set Data(value:SingleConvData)
	{	
		data = value;
		SetDisplayData();
	}
	
	public function get Data():SingleConvData
	{
		return data;
	}
	
	public function ShowSelect(select:boolean)
	{
		if (select == opSelectCheckBox.isVisible())
			return;
		
		checkboxLastVisible = opSelectCheckBox.isVisible();
		opSelectCheckBox.SetVisible(select);
		gotoDetailChatBtn.SetVisible(!select);
		
		// First in, not move the position
		if (!isFirstIn)
		{
			ReCalculateRects();
		} 
		isFirstIn = false;
	}
	
	public function SetSelect(select:boolean)
	{
		if (opSelectCheckBox.isVisible())
			opSelectCheckBox.IsSelect = select;
	}
	
	public function IsSelected():boolean
	{
		if (null == opSelectCheckBox)
			return false;
			
		return opSelectCheckBox.isVisible() && opSelectCheckBox.IsSelect;
	}
	
	private function ReCalculateRects()
	{
		var checkBoxVisible = opSelectCheckBox.isVisible();
		
		// Move right or reset position
		if (checkboxLastVisible != checkBoxVisible)
		{
			var moveDis:int = opSelectCheckBox.rect.x + 10;
			var xOffset:int = checkBoxVisible ? moveDis : -moveDis;
			
			userName.rect.x += xOffset;
			message.rect.x += xOffset;
//			msgDateTime.rect.x += xOffset;
			
//			newMsgLabel.rect.x += xOffset;
			
//			userAllianceicon.rect.x += xOffset;
//			userAllianceName.rect.x += xOffset;
			
//			btnUserInfo.rect.x += xOffset;
			avatar.rect.x += xOffset;
		}
	}
	
	private function OnClickUserInfoBtn():void
	{
		// If the checkbox is visible, we use it as a checkbox collide
		if (opSelectCheckBox.isVisible())
		{
			opSelectCheckBox.IsSelect = true; // set property
			return;
		}
		
		if (null == data || data.Count == 0) return;
		
		var userInfo = new UserDetailInfo();
		userInfo.userId = data.targetId.ToString();
		userInfo.userName = data.targetName;
		userInfo.allianceId = data.targetAllianceId.ToString();
 		userInfo.viewFrom = UserDetailInfo.ViewFromChat;
 		
 		MenuMgr.getInstance().PushMenu("PlayerProfile", userInfo, "trans_zoomComp");
	}
	
	private function OnClickGotoDetailChatBtn():void
	{
		// If the checkbox is visible, we use it as a checkbox collide
		if (opSelectCheckBox.isVisible())
		{
			opSelectCheckBox.IsSelect = !opSelectCheckBox.IsSelect; // set property
			return;
		}
		
		if (null != onGotoDetailDel)
			onGotoDetailDel(this);
			
		if (null != flashAni)
		{
			flashAni.StopFlash(userName);
		}
	}
	
	public function SetIconForAlliance(title:int):void
	{
		if(title == Constant.Alliance.Chancellor)
		{
			picChancellor = TextureMgr.instance().LoadTexture("icon_Chancellors", TextureType.ICON);
			SetIconNormal(userAllianceicon, picChancellor);
		}
		else if(title == Constant.Alliance.ViceChancellor)
		{ 
			picViceChancellor = TextureMgr.instance().LoadTexture("icon_Vice_Chancellors", TextureType.ICON);
			SetIconNormal(userAllianceicon, picViceChancellor);
		}
		else
		{ 
			picAlliance = TextureMgr.instance().LoadTexture("icon_alliance", TextureType.ICON);
			SetIconNormal(userAllianceicon, picAlliance);
		}		
	}
	
	private function SetIconNormal(icon:Label, tex2D:Texture2D) 
	{
		icon.mystyle.normal.background = tex2D;
	}
	
	private function SetTextColor(text:Label, color:Color) 
	{
		var isSame:boolean = Color.Equals(text.mystyle.normal.textColor, color);
		if (!isSame)
		{
			text.mystyle.normal.textColor = color;
		}
	}
	
	//protected function SetTextColor(colorName:Color, colorMessage:Color) 
	//{
	//	userName.mystyle.normal.textColor = colorName;
	//	message.mystyle.normal.textColor = colorMessage;
	//	time.mystyle.normal.textColor = colorName;
	//}
}
