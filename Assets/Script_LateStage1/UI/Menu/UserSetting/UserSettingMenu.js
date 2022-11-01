class UserSettingMenu extends KBNMenu implements IEventHandler
{
	public var scrollList:ScrollList;
	public var clone_menuHead : MenuHead;
	public var menuHead:MenuHead;
	public var toolBar:ToolBar;
	public var userSettingItem:UserSettingItem;
	public var bgMiddleBodyTop:Label;
//	public var bgBottom:Label;
	public var noUserSetting:Label;
	public var invitation:ComposedUIObj;
	public var invitationBg:Label;
	public var invitationRecvEnable:SoundItem;
	
	private var barIndex:int = 0;
	private var isDisPlay:boolean;

	public var frameList : ScrollList;
	public var userSettingFrameItem : UserSettingFrameItem;
	private var selectedFrame : String;
	private var initialFrame : String;
	public var  btnOK      : SimpleButton;
	
	function Init()
	{
		menuHead = GameObject.Instantiate(clone_menuHead);
		menuHead.Init();
		toolBar.Init();
		bgMiddleBodyTop.Init();
//		bgBottom.Init();
		
		scrollList.Init(userSettingItem);
		frameList.Init(userSettingFrameItem);
		frameList.itemDelegate = this;
		btnOK.OnClick = OnOKClicked;
		btnOK.txt = Datas.getArString("Common.OK_Button");

		noUserSetting.txt = Datas.getArString("Settings.UserBlockNone");
		
		toolBar.indexChangedFunc = indexChangeFunction;
		toolBar.toolbarStrings = [Datas.getArString("Settings.UserBlock"), Datas.getArString("Settings.UserChat"), Datas.getArString("UserSetting.ChatBox")];	
	
		bgMiddleBodyTop.useTile = false;

		bgMiddleBodyTop.mystyle.normal.background = TextureMgr.instance().LoadTexture("frame_metal_top",TextureType.DECORATION);
		bgMiddleBodyTop.mystyle.border = new RectOffset(27, 27, 0, 0);
		
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottom");
		repeatTimes = (rect.height - 1) / bgMiddleBodyPic.rect.height + 1;

		invitationBg.useTile = false;
		invitationBg.setBackground("tool bar_bottom",TextureType.BACKGROUND);
		invitationBg.drawTileByGraphics = true;
		invitationRecvEnable.l_text.txt = Datas.getArString("Alliance.AllowInvitations");
		invitationRecvEnable.b_switch.OnClick = RecvEnable_Click;
		invitationRecvEnable.Init(true);
	}

	private function OnOKClicked(param : Object)
    {
		if(initialFrame == this.selectedFrame)
			return;

		FrameMgr.instance().decorationUpdate("chat", selectedFrame);
	}
	
	private function indexChangeFunction(_value:int):void
	{
		barIndex = _value;
		displayInfor();
	}
	
	static function IsAllianceAllowInvitations():boolean 
	{
		var seed:HashObject = GameMain.instance().getSeed();
		return !_Global.ToBool(seed["playerSettings"]["s"+Constant.BlockSettings.AllianceBlockInvitations]);
	}

	public function OnPop()
	{
		if (IsAllianceAllowInvitations() != invitationRecvEnable.b_switch.on) {
			var seed:HashObject = GameMain.instance().getSeed();
			seed["playerSettings"]["s"+Constant.BlockSettings.AllianceBlockInvitations] = new HashObject(_Global.Bool2INT(!invitationRecvEnable.b_switch.on));
			UnityNet.ChangeUserSetting(Constant.BlockSettings.AllianceBlockInvitations, IsAllianceAllowInvitations() ? "0" : "1", function(data:HashObject){
				if(data["ok"].Value) {
					//MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.SentMailSuccess"));
					return;
				}
			}, null);
		}
		super.OnPop();
	}
	
	public function OnPopOver():void {
		scrollList.Clear();
		TryDestroy(menuHead);
		menuHead = null;
	}
		
	public function OnPush(param:Object)
	{	
		super.OnPush(param);
		
		barIndex = (param as Hashtable)["barIndex"];
		isDisPlay = false;
		
		menuHead.setTitle(Datas.getArString("Settings.UserSettings"));
		
		toolBar.selectedIndex = barIndex;
		displayInfor();
		indexChangeFunction(barIndex);
		
		invitationRecvEnable.b_switch.SetOn(IsAllianceAllowInvitations());
		setOKEnable(false);
	}
	
	public function getListType():int
	{
		return barIndex;
	}
	
	public function displayInfor():void
	{	
		scrollList.Clear();
		
		if(barIndex == Constant.UserSetting.BLOCK_USER)
		{
			UserSetting.getInstance().getBlockUserList(successGetDataList);
			scrollList.rect.height = invitation.rect.y - scrollList.rect.y;
		}
		else if(barIndex == Constant.UserSetting.IGNORE_USER)
		{
			UserSetting.getInstance().getIgnoreUserList(successGetDataList);
			scrollList.rect.height = 960 - scrollList.rect.y;
		}
		else if(barIndex == Constant.UserSetting.CHAT_BOX)
		{
			updateFrameList();
		}
	}

	private function updateFrameList() {
		var list : List.<String> = FrameMgr.instance().GetChatFrames();
		initialFrame = FrameMgr.instance().PlayerChatFrame;
		selectedFrame = initialFrame;
		
		frameList.Clear();
		frameList.SetData(list);
		frameList.MoveToTop();
		setFrameHighlight(selectedFrame);
		setOKEnable(selectedFrame != initialFrame);
	}

	private function setFrameHighlight(frameName : String) {
		frameList.ForEachItem( function ( item : ListItem ) : boolean {
			var frameItem : UserSettingFrameItem = item as UserSettingFrameItem;
			if (null == frameItem)
				return true;
			frameItem.Highlight = (frameItem.FrameName == frameName);
			return true;
		} );
	}

	private function setOKEnable(enable : boolean) {
		if (enable) {
			btnOK.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew", TextureType.BUTTON);
		} else {
			btnOK.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew", TextureType.BUTTON);
		}
		btnOK.SetDisabled(!enable);
	}

	function handleItemAction(action : String, params : Object) {	
		var frameItem : UserSettingFrameItem = params as UserSettingFrameItem;
		if (null == frameItem)
			return;
			
		if (action == "OnFrameUpdateData") {
			frameItem.Highlight = (frameItem.FrameName == selectedFrame);
		} else if (action == "OnFrameClick") {
			selectedFrame = frameItem.FrameName;
			setFrameHighlight(selectedFrame);
			setOKEnable(selectedFrame != initialFrame);
		}		
	}

	public function handleNotification(type : String, body : Object) : void {
		if(type == Constant.FrameType.DECORATION_UPDATE)
		{
			initialFrame = FrameMgr.instance().PlayerChatFrame;
			setOKEnable(selectedFrame != initialFrame);
		}
	}
	
	private function successGetDataList(arr:Array):void
	{	
		if(arr.length == 0)
		{
			isDisPlay = true;
		}
		else
		{
			isDisPlay = false;
			
			scrollList.SetData(arr);
			scrollList.ResetPos();
		}
	}
			
	function Update()
	{
		if(barIndex == Constant.UserSetting.CHAT_BOX)
		{
			frameList.Update();
		}
		else
		{
			scrollList.Update();
		}		
	}
	
	function DrawItem()
	{	
		toolBar.Draw();
		if (barIndex == Constant.UserSetting.BLOCK_USER) 
		{			
			if(isDisPlay)
			{
				noUserSetting.Draw();	
			}else{
				scrollList.Draw();
			}
			invitation.Draw();
		}
		else if(barIndex == Constant.UserSetting.IGNORE_USER)
		{
			if(isDisPlay)
			{
				noUserSetting.Draw();	
			}else{
				scrollList.Draw();
			}
		}
		else if(barIndex == Constant.UserSetting.CHAT_BOX)
		{
			frameList.Draw();
			btnOK.Draw();
		}
	}
	
	function DrawBackground()
	{
		if(Event.current.type != EventType.Repaint)
		{
			return;
		}
		
		DrawMiddleBg();
		bgMiddleBodyTop.Draw();
	}
	
	function DrawTitle()
	{
		menuHead.Draw();
	}
	
	function RecvEnable_Click(param:Object):void 
	{

	}
}
