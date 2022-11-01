
class SwitchButton extends Button {
	
	public var textureOn:Texture2D;
	public var textureOff:Texture2D;
	public var styleOn:GUIStyle;
	public var styleOff:GUIStyle;
	public var textRectOn:Rect;
	public var textRectOff:Rect;
	public var textOn:String;
	public var textOff:String;
	public var on:boolean;

	public var canNotClick = false;
	//public	function	Awake(){
	//	super.Awake();
	//}
	
	
	// Update is called once per frame
	
	public function SetDefaultInfo() : void
	{
		var texMgr : TextureMgr = TextureMgr.singleton;
		this.textureOn = texMgr.LoadTexture("button_switch_small_L", TextureType.BUTTON);
		this.textureOff = texMgr.LoadTexture("button_switch_small_R", TextureType.BUTTON);
		this.textOn = Datas.getArString("Settings.On");
		this.textOff = Datas.getArString("Settings.Off");
	}
	
	function SetOn(b:boolean):void
	{
		on = b;
		if(on)
			mystyle.normal.background = textureOn;
		else 	
			mystyle.normal.background = textureOff;
	}
	

	public function Draw()
	{					
		if( !visible ){
			return;
		}
		
		if(Event.current.type != EventType.Repaint && disabled ){
			return;
		}
		
//		FontMgr.SetStyleFont(mystyle, font,FontType.TREBUC);
//		FontMgr.SetStyleFont(styleOn, font,FontType.TREBUC);
//		FontMgr.SetStyleFont(styleOff, font,FontType.TREBUC);
		if( GUI.Button ( rect, "", mystyle) )
			Click();	
		GUI.BeginGroup(rect);	
		
		if(on)	
		{
			//GUI.Label(textRectOn, textOn, styleOn);
			GUI.Label(textRectOn, textOn, styleOn);
			
		}
		else
		{
			GUI.Label(textRectOff, textOff, styleOff);
			//GUI.Label(textRectOff, textOff, styleOn);
		}
		
		GUI.EndGroup();
	}
	
	function Click()
	{
		if(canNotClick)
		{
			return;
		}
		this.SetOn(!on);
		if(m_onClick)
		{
			Click(on);
		}
	}
	
}
