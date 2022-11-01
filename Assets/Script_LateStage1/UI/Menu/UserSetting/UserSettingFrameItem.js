#pragma strict

public class UserSettingFrameItem extends ListItem {

	public var  btnWhole    : SimpleButton;
	public var  frame      : SimpleLabel;
	public var  lbLock      : SimpleLabel;
    public var  highlight   : SimpleLabel;
    public var  chat        : SimpleLabel;
	
	private var frameName  : String;
	private static var whiteColor = new Color(1f, 1f, 1f, 1f);
	private static var grayColor = new Color(0.5f, 0.5f, 0.5f, 1f);
	
	public function get FrameName() : String {
		return frameName;
	}
	
	public function get Locked() : boolean {
		return lbLock.isVisible();
	}
	
	public function get Highlight() : boolean {
		highlight.isVisible();
	}
	
	public function set Highlight(value : boolean) {
		if (Locked) {
			return;
		}
		highlight.SetVisible(value);
	}

	public function Init() {
		frame.mystyle.normal.background = TextureMgr.instance().LoadTexture("img47300", TextureType.DECORATION);
		
		lbLock.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_pve_lock", TextureType.DECORATION);
		lbLock.SetVisible(false);
		
		btnWhole.rect = frame.rect;
		btnWhole.OnClick = OnFrameClick;
		
		highlight.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_satisfactory", TextureType.ICON);
        highlight.SetVisible(false);

        chat.txt = Datas.getArString("UserSetting.ChatBox_Example");
	}
	
	public function SetRowData(_data : Object) {
		frameName = _data as String;
		frame.mystyle.normal.background = TextureMgr.instance().LoadTexture(frameName, TextureType.DECORATION);
		if(this.frameName == "img0")
			frame.mystyle.border = new RectOffset(25, 25, 25, 25);
		else
			frame.mystyle.border = new RectOffset(50, 50, 50, 50);
		UpdateData();
	}
	
	function UpdateData() {
		if (String.IsNullOrEmpty(frameName))
			return;
			
		var unlocked : boolean = FrameMgr.instance().ChatFrameLock(frameName);
		lbLock.SetVisible(!unlocked);
		btnWhole.SetVisible(unlocked);
		frame.SetColor(unlocked ? whiteColor : grayColor);
		if (!unlocked) highlight.SetVisible(false);
		
		handlerDelegate.handleItemAction("OnFrameUpdateData", this);
	}
	
	public function Draw() {
		GUI.BeginGroup(rect);
		
		btnWhole.Draw();
        frame.Draw();
        chat.Draw();
        lbLock.Draw();     
        highlight.Draw();

		GUI.EndGroup();
	}
	
	public function OnFrameClick() {
		handlerDelegate.handleItemAction("OnFrameClick", this);
	}
}
