#pragma strict

public class FrameListItem extends ListItem {

	public var  btnWhole    : SimpleButton;
	public var  avatar      : SimpleLabel;
	public var  frame       : SimpleLabel;
	public var  lbLock      : SimpleLabel;
    public var  highlight   : SimpleLabel;
	
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
		frame.useTile = true;
		frame.tile = TextureMgr.instance().ElseIconSpt().GetTile("ui_chat_npc");
		avatar.useTile = true;
		
		lbLock.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_pve_lock", TextureType.DECORATION);
		lbLock.SetVisible(false);
		
		btnWhole.rect = frame.rect;
		btnWhole.OnClick = OnFrameClick;
		
		highlight.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_satisfactory", TextureType.ICON);
        highlight.SetVisible(false);
	}
	
	public function SetRowData(_data : Object) {
		frameName = _data as String;
        //var texName : String = AvatarMgr.instance().GetAvatarTextureName(frameName);
		
		if(frameName != "img0")
		{
			frame.useTile = true;
			frame.tile = TextureMgr.instance().ElseIconSpt().GetTile(frameName);
		}
		else
		{
			frame.useTile = false;
		}
		
		avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(AvatarMgr.instance().PlayerAvatar));
		
		UpdateData();
	}
	
	function UpdateData() {
		if (String.IsNullOrEmpty(frameName))
			return;
			
		var unlocked : boolean = FrameMgr.instance().HeadFrameLock(frameName);
		lbLock.SetVisible(!unlocked);
		btnWhole.SetVisible(unlocked);
		frame.SetColor(unlocked ? whiteColor : grayColor);
		avatar.SetColor(unlocked ? whiteColor : grayColor);
		if (!unlocked) highlight.SetVisible(false);
		
		handlerDelegate.handleItemAction("OnFrameUpdateData", this);
	}
	
	public function Draw() {
		GUI.BeginGroup(rect);		
		btnWhole.Draw();
		avatar.Draw();
		frame.Draw();
        lbLock.Draw();
        highlight.Draw();
		GUI.EndGroup();
	}
	
	public function OnFrameClick() {
		handlerDelegate.handleItemAction("OnFrameClick", this);
	}
}
