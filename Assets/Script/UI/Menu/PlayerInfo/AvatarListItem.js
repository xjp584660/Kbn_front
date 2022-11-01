#pragma strict

public class AvatarListItem extends ListItem {

	public var  btnWhole    : SimpleButton;
	public var  avatar      : SimpleLabel;
	public var  lbLock      : SimpleLabel;
	public var  highlight   : SimpleLabel;
	
	private var avatarName  : String;
	private static var whiteColor = new Color(1f, 1f, 1f, 1f);
	private static var grayColor = new Color(0.5f, 0.5f, 0.5f, 1f);
	
	public function get AvatarName() : String {
		return avatarName;
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
		avatar.useTile = true;
		avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile("ui_chat_npc");
		
		lbLock.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_pve_lock", TextureType.DECORATION);
		lbLock.SetVisible(false);
		
		btnWhole.rect = avatar.rect;
		btnWhole.OnClick = OnAvatarClick;
		
		highlight.mystyle.normal.background = TextureMgr.instance().LoadTexture("DailyLoginHighlight1", TextureType.DECORATION);
		highlight.SetVisible(false);
	}
	
	public function SetRowData(_data : Object) {
		avatarName = _data as String;
		var texName : String = AvatarMgr.instance().GetAvatarTextureName(avatarName);
		
		avatar.tile = TextureMgr.instance().ElseIconSpt().GetTile(texName);
		
		UpdateData();
	}
	
	function UpdateData() {
		if (String.IsNullOrEmpty(avatarName))
			return;
			
		var unlocked : boolean = AvatarMgr.instance().AvatarAvailable(avatarName);
		lbLock.SetVisible(!unlocked);
		btnWhole.SetVisible(unlocked);
		avatar.SetColor(unlocked ? whiteColor : grayColor);
		if (!unlocked) highlight.SetVisible(false);
		
		handlerDelegate.handleItemAction("OnUpdateData", this);
	}
	
	public function Draw() {
		GUI.BeginGroup(rect);
		highlight.Draw();
		btnWhole.Draw();
		avatar.Draw();
		lbLock.Draw();
		GUI.EndGroup();
	}
	
	public function OnAvatarClick() {
		handlerDelegate.handleItemAction("OnClick", this);
	}
}
