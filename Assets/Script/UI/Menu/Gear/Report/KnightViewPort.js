

public class KnightViewPort extends UIObject
{
	public var panel:KnightPanel;
	public var back:Label;
	public var imageName:String;
	
	public var backlight:Label;
	public var backlightName:String;
	
	public function set TheKnight(value:Knight)
	{
		panel.TheKnight = value;
	}
	
	
	public function Init()
	{
		super.Init();
		panel.Init();
		backlight.Init();
		//backlight.mystyle.normal.background = TextureMgr.instance().LoadTexture(backlightName,TextureType.GEAR);
		backlight = GearManager.Instance().SetImage(backlight,backlightName);
		
		back.Init();
		back.mystyle.normal.background = TextureMgr.instance().LoadTexture(imageName,TextureType.DECORATION);
		back.rect = new Rect(0,0,rect.width,rect.height);
	}
	
	public function Update()
	{
		super.Update();
		back.Update();
		panel.Update(); 
		backlight.Update();
	}
	
	public function Draw()
	{
		super.Draw();
		GUI.BeginGroup(rect);
		back.Draw(); 
		backlight.Draw();
		panel.Draw(); 
		GUI.EndGroup();
	}

	
}