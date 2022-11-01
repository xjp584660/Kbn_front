

public class ChatBalloon extends FoldablePanel {
	@SerializeField private var balloon:Label;
	@SerializeField private var buttonDetail:Button;
	@SerializeField private var head:Button;
	@SerializeField private var headImage:Label;
	@SerializeField private var arrow:Label;
	@SerializeField private var headMask:Label;
	@SerializeField private var textLabel:SwitchTips;
	@SerializeField private var maxLength:int;
	
	private var leftArrow:Texture;
	private var rightArrow:Texture;
	private var buttonForbiden:boolean = false;
	private var keyboard:TouchScreenKeyboard;
	private var onInputFunction :System.Action.<String> = null;
	
	public function setOnInputFunction(_onInputFunction:System.Action.<String>):void
	{
		onInputFunction = _onInputFunction;
	}

	public function Init() {
		super.Init();
		textLabel.Init();
		head.OnClick = OnHeadClick;
//		balloon.OnClick = OnBallonClick;
		buttonDetail.OnClick = OnDetailBtnClick;
		
		rightArrow = TextureMgr.instance().LoadTexture("quest_Arrow1", TextureType.DECORATION);
		leftArrow = TextureMgr.instance().LoadTexture("quest_Arrow2", TextureType.DECORATION);
		arrow.mystyle.normal.background = (status == Status.FOLDED) ? rightArrow : leftArrow;
		KBHook.getInstance();
//		setIconForAlliance();
		headMask.SetVisible(false);
		
//		headImage.useTile = true;
//		headImage.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(AvatarMgr.instance().PlayerAvatar));
	}
	
	public function ShowDetailBtn(isShow:boolean)
	{
		buttonDetail.SetVisible(isShow);
	}
	
	public function get txt() :String {
		if(textLabel!=null)
			return textLabel.txt;
		return null;
	}
	
	public function set txt(value : String) {
		if(textLabel!=null)
			textLabel.txt = value;
	}
	
	public function set HeadTile(value : String) {
		headImage.useTile = true;
		if(headImage!=null)
			headImage.tile = TextureMgr.instance().ElseIconSpt().GetTile(AvatarMgr.instance().GetAvatarTextureName(value));
	}
	
	public function Update() {
		super.Update();
	}
	
	public function Draw() {
//		if( !visible )
//		{
//			return;
//		}
		if(Event.current.type != EventType.Repaint && disabled )
		{
			return;
		}
		super.Draw();
		GUI.BeginGroup(rect);
		head.Draw();
		headImage.Draw();
		headMask.Draw();
		arrow.Draw();
		GUI.EndGroup();
		
		var keyboard_done:boolean = KBHook.getInstance().isKeyBoardDone();
		if (keyboard != null && keyboard_done)
		{
			OnKeyboardDone(keyboard.text);
		}
		if (keyboard != null && keyboard.active)
		{
			if(keyboard.text.Length>maxLength)
				keyboard.text = keyboard.text.Substring(0,maxLength);
		}
	}
	
	private function OnHeadClick()
	{
		if (buttonForbiden) return;
		Toggle(FoldingDirection.LEFT);
	}
	
		protected function OnFold() {
		super.OnFold();
		arrow.SetVisible(false);
	}
	
	protected function OnUnfold() {
		super.OnUnfold();
		arrow.SetVisible(false);
	}
	
	protected function OnFolded() {
		super.OnFolded();
		arrow.SetVisible(true);
		arrow.mystyle.normal.background = rightArrow;
		buttonForbiden = false;
	}
	
	protected function OnUnfolded() {
		super.OnUnfolded();
		arrow.SetVisible(true);
		arrow.mystyle.normal.background = leftArrow;
		buttonForbiden = false;
	}
	
	private function OnBallonClick()
	{
//		if(onInputFunction != null)
//			onInputFunction("new message!"+GameMain.instance().unixtime());
	}
	
	private function OnKeyboardDone(_text:String)
	{
		if(onInputFunction != null)
			onInputFunction(_text);
		keyboard = null;
		KBHook.getInstance().setKeyBoard(null);
	}
	
	private function OnDetailBtnClick()
	{
//		if(onInputFunction != null)
//			onInputFunction(txt);
		var type:TouchScreenKeyboardType = TouchScreenKeyboardType.Default;
		if( keyboard == null || !keyboard.active)
		{
			TouchScreenKeyboard.hideInput = false;
			if(type == TouchScreenKeyboardType.NumberPad)
			{
				type = TouchScreenKeyboardType.NumbersAndPunctuation;
			}

			keyboard = TouchScreenKeyboard.Open(txt, type, true, false);
			
			KBHook.getInstance().setKeyBoard(keyboard);
		}
		else
		{
			keyboard.text = "";
		}
		
		if(RuntimePlatform.Android == Application.platform)
		{
			TouchScreenKeyboard.hideInput = false;				
			Debug.Log("ming android inner click hide input = true");
		}
	}
	
	public function OnPopOver()
	{
		KBHook.getInstance().setKeyBoard(null);
		if (keyboard!=null && !keyboard.done)
		{
			keyboard.active = false;
		}
		keyboard = null;
	}
	
	private function setIconForAlliance() : void {
		var title : int = Alliance.getInstance().MyOfficerType();
		if (title == Constant.Alliance.Chancellor) {
			headMask.SetVisible(true);
			headMask.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_chief", TextureType.ICON);
		} else if (title == Constant.Alliance.ViceChancellor) {
			headMask.SetVisible(true);
			headMask.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_deputy_chief", TextureType.ICON);
		} else if (title == Constant.Alliance.Officer || title == Constant.Alliance.DefenseMinister || title == Constant.Alliance.DeputyDefenseMinister) {
			headMask.SetVisible(true);
			headMask.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_officer", TextureType.ICON);
		} else {
			headMask.SetVisible(false);
		}
	}
	
	public function SetMaxLength(_maxLength:int)
	{
		maxLength = _maxLength;
	}
}
