class AllianceWallItem extends ListItem
{
	public var lableLine1:Label;
	public var lableLine2:Label;
	public var userName:Label;
	public var message:Label;
	public var time:Label;
	public var month:Label;
	public var iconType:Label;
	public var allianceName:Label;
	public var lEdge:Label;
	public var btnEdit:Button;
	public var btnDelete:Button;
	public var mystyle:GUIStyle;
	public var picAlliance:Texture2D;
	public var picChancellor:Texture2D;
	public var picViceChancellor:Texture2D;
	
	public var messageType:byte;
	public var msgUserName:String;
	public var msgUserId:int;
	public var messageId:int;
	public var msgAllianceTitle:byte;
	public var bIsAdmin:boolean = false;
	public var bDeleteVisible = false;
	public var bEditVisible = false;
	
	//green
	public var colorSelfName:Color = new Color(0, 0.337, 0.129, 1);
	public var colorSelfMessage:Color = new Color(0.286 , 0.416, 0.004, 1);
	
	//brown
	public var colorOtherName:Color = new Color(0.510, 0.263, 0, 1);
	public var colorOtherMessage:Color = new Color(0.569, 0.388, 0.082, 1);
	
	//origine
	public var colorWhisperName:Color = new Color(0.929 , 0.322, 0, 1);
	public var colorWhisperMessage:Color = new Color(0.929 , 0.459, 0.122,1);
	
	//red
	public var colorAllianceNoticeBoard:Color = new Color(0.922 , 0.071, 0.106, 1);
	public var colorAllianceNotice:Color = new Color(0.492 , 0.06, 0.036, 1);
	
	//gray
	public var colorNoUser:Color = new Color(0.49, 0.49, 0.49, 1);
	public var colorException:Color;
	
	public function Init():void
	{
		btnDelete.setNorAndActBG("alliancewall_Delete", "alliancewall_Delete2");
		lEdge.setBackground("chat_help_DialogBox", TextureType.DECORATION);
		
		lableLine1.setBackground("between line", TextureType.DECORATION);
		lableLine2.setBackground("between line", TextureType.DECORATION);
				
		picChancellor = TextureMgr.instance().LoadTexture("icon_Chancellors", TextureType.ICON);
		picViceChancellor = TextureMgr.instance().LoadTexture("icon_Vice_Chancellors", TextureType.ICON);		
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		btnEdit.Draw();
		btnDelete.Draw();
		lableLine1.Draw();
		
		lEdge.Draw();
		userName.Draw(); 
		time.Draw();
 		message.Draw();	
 		lableLine2.Draw();
 		iconType.Draw();
 		btnEdit.Draw();
 		btnDelete.Draw();
		GUI.EndGroup();
	}
	
	public function Update()
	{
	/*
		if(bIsAdmin) 
		{
			if(1 == messageType)
			{	
				btnDelete.SetVisible(true);
			}
			else if(2 == messageType)
			{
				btnEdit.SetVisible(true);	
			}
		}
	*/
	}
	
	public function setAdmin(value:boolean)
	{
		bIsAdmin = value;
	}
	
	public function isAdmin():boolean
	{
		return bIsAdmin;
	}
	
	public function SetRowData(data:Object):void
	{
		var selfUserId:int = Datas.instance().tvuid();
		var _height:float;
		var rectAlliance:Vector2;
		var _data:Hashtable =  data as Hashtable;
		
		messageId = _Global.INT32(_data["messageId"]);
		msgUserId = _Global.INT32(_data["userId"]);
		messageType = _Global.INT32(_data["type"]);
		msgAllianceTitle = _Global.INT32(_data["officerType"]);
		userName.txt = _Global.GetString(_data["displayName"]);
		time.txt = _Global.GetString(_data["lastUpdatedTime"]);
		message.txt = _Global.GetString(_data["message"]);
		bDeleteVisible = _Global.GetBoolean(_data["delete"]);
		bEditVisible = _Global.GetBoolean(_data["modify"]);
	
		btnDelete.SetVisible(false);
		btnEdit.SetVisible(false);
		lableLine1.SetVisible(false);
		lableLine2.SetVisible(false);
		lEdge.SetVisible(true);
		message.rect.x = 100;
		message.rect.width = 455;
		
		if(Alliance.getInstance() != null && Alliance.getInstance().myAlliance != null)
		{
			bIsAdmin = Alliance.getInstance().myAlliance.isAdmin();
		}
	
		switch(messageType)
		{
			case 1:
				if(msgUserId == selfUserId)
				{
					userName.SetNormalTxtColor(FontColor.Green);
					message.SetNormalTxtColor(FontColor.Green);
				}
				else
				{
					userName.SetNormalTxtColor(FontColor.Description_Light);
					message.SetNormalTxtColor(FontColor.Description_Light);
				}
				if(bDeleteVisible)
				{
					btnDelete.SetVisible(true);
				}
				btnDelete.OnClick = handleDelete;
				changeIconForAlliance(msgAllianceTitle);
				break;
			case 2:
				iconType.mystyle.normal.background = picChancellor;
				message.SetNormalTxtColor(FontColor.Dark_Red);
				userName.SetNormalTxtColor(FontColor.Red);
				userName.txt = Datas.getArString("Alliance.NoticeBoard");
				lableLine1.SetVisible(true);
				lableLine2.SetVisible(true);
				if(bEditVisible)
				{
					btnEdit.SetVisible(true);
				}
				btnEdit.OnClick = handleEdit;
				lEdge.SetVisible(false);
				break;
			
		}
			
		time.SetNormalTxtColor(FontColor.Grey);
		
		FontMgr.SetStyleFont(mystyle, FontSize.Font_18,FontType.TREBUC);
		mystyle.wordWrap = true;
		

		_height = mystyle.CalcHeight(GUIContent(userName.txt), userName.rect.width);
		
		userName.rect.height = _height;
		message.rect.y = userName.rect.y + userName.rect.height + 10;		
		lEdge.rect.y = message.rect.y - 10;
		
		
		FontMgr.SetStyleFont(mystyle, FontSize.Font_18,FontType.TREBUC);
		mystyle.wordWrap = true;		
		
		_height = mystyle.CalcHeight(GUIContent(message.txt), message.rect.width);
		message.rect.height = _height + 10;
		
		if(message.rect.height < 50)
		{
			message.rect.height = 50;
		}
		
		btnDelete.rect.y = message.rect.y + message.rect.height -65;
		btnEdit.rect.y = message.rect.y + message.rect.height -65;
		lEdge.rect.height = message.rect.height + 10;
		lableLine2.rect.y = message.rect.y + message.rect.height + 2;
		if(lableLine2.isVisible())
			rect.height = lableLine2.rect.y + lableLine2.rect.height + 5;
		else
			rect.height = lEdge.rect.y + lEdge.rect.height + 5;	
	}
	
	public function changeIconForAlliance(title:int):void
	{	
		if(title == Constant.Alliance.Chancellor)
		{
			iconType.mystyle.normal.background = picChancellor;
		}
		else if(title == Constant.Alliance.ViceChancellor)
		{
			iconType.mystyle.normal.background = picViceChancellor;
		}
		else
		{
			iconType.mystyle.normal.background = picAlliance;
		}		
	}
	
	private function handleDelete():void
	{
		if(handlerDelegate)
			handlerDelegate.handleItemAction(Constant.Action.ALLIANCEWALL_DELETE_ITEM,this);
	}
	
	private function handleEdit():void
	{
		if(messageType == 2 && handlerDelegate)
			handlerDelegate.handleItemAction(Constant.Action.ALLIANCEWALL_EDIT_ITEM,this);
	}
}