public class Info_Button extends UIObject
{
	public var l_title 	:Label;
	public var l_content:Label;
	public var btn_next :Button;
	public var texture_line :Texture2D;
	public var nextHandler : Function;
	public var clickParam :Object;
	public var area_Btn:SimpleButton;
	public var new_Icon:SimpleButton;
	
	public function Init()
	{
		area_Btn.OnClick = onClick;
		btn_next.OnClick = onClick;		
		area_Btn.rect.height = this.rect.height - 5;
		area_Btn.rect.x = 10;
		area_Btn.rect.y = -5;
		area_Btn.rect.width = rect.width - area_Btn.rect.x;
		
		if(area_Btn.mystyle.active.background == null)
		{
			area_Btn.mystyle.normal.background = TextureMgr.instance().LoadTexture("a_0_square",TextureType.BACKGROUND);
			area_Btn.mystyle.active.background = TextureMgr.instance().LoadTexture("square_black",TextureType.BACKGROUND);
			area_Btn.mystyle.border.left = 14;
			area_Btn.mystyle.border.right = 14;
			area_Btn.mystyle.border.top = 14;
			area_Btn.mystyle.border.bottom = 14;			
		}
		new_Icon.SetVisible(false);
		new_Icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("NewFeatures_icon",TextureType.DECORATION);
	}
	public function Draw()
	{
		GUI.BeginGroup(rect);
		drawTexture(texture_line,13,87,620,4);
		
		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0, 0.4);	
		area_Btn.Draw();
		GUI.color = oldColor;
		
		l_title.Draw();
		l_content.Draw();
		btn_next.Draw();
		new_Icon.Draw();
		GUI.EndGroup();
	}
	
	public function  setStrings(title:String,content:String):void
	{
		l_title.txt = title;
		l_content.txt = content;
		
		l_title.SetFont();
		var _size:Vector2 = l_title.mystyle.CalcSize(GUIContent(l_title.txt));
		new_Icon.rect.x = l_title.rect.x + _size.x + 5;
	}
	
	private function onClick(obj:Object):void
	{
		if(nextHandler!= null)
			nextHandler(clickParam);
	}
	
	public function ShowNewIcon(isShow:boolean)
	{
		new_Icon.SetVisible(isShow);
	}
}