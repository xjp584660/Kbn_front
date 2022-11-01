
public class InputBox extends SimpleUIObj
{
	protected var activeBackground:String = "Textures/UI/decoration/type_box2";
	protected var normalBackground:String = "Textures/UI/decoration/type_box";
	
	public var button:Button;
	
	public var ActiveClick:Function;
	public static var OnOutInputBox:Function;
	
	public var Guid:int = 0;
	
	protected var onfocus:boolean;
	
	private static var currentInputBox:InputBox;
		
	public static function OutInputBox_OnPop()
	{
		if(currentInputBox != null)
		{
			currentInputBox.Done();
			if(currentInputBox.OnOutInputBox != null)
			{
				currentInputBox.OnOutInputBox();
			}
		}
		
	}
	
	public function Init()
	{
		onfocus = false;
		
		button.SetDisabled(false);
		button.OnClick = inner_Click;	
		
		button.SetFont(FontSize.Font_25, FontType.TREBUC);
	}
	
	public function get OnFocus():boolean
	{
		return onfocus;
	}
	
	public function Draw()
	{					
		if( !visible )
		{
			return;
		}
		
		if(Event.current.type != EventType.Repaint && disabled )
		{
			return;
		}		
//		FontMgr.SetStyleFont(mystyle, font,FontType.TREBUC);
//		FontMgr.SetStyleFont(button.mystyle, font,FontType.TREBUC);
		SetFont();
		SetNormalTxtColor();
		button.rect = rect;
		
		if(Application.platform != RuntimePlatform.Android)
			button.Draw();
	}
	
	public function GetText():String
	{
		if(onfocus)
		{
			return NativeCaller.GetInputBoxText();
		}
		else
		{
			return button.txt;
		}
	}
	
	public function SetText(txt:String):void
	{
		if(onfocus)
		{
			NativeCaller.SetInputBoxText(txt);
		}
		else
		{
			button.txt = txt;
		}
	}
	
	private function inner_Click()
	{
		
		currentInputBox = this;
		onfocus = true;
		button.mystyle.normal.background = TextureMgr.instance().LoadTexture("type_box2",TextureType.DECORATION);
		button.SetDisabled(true);

		var inputRect:Rect = _Global.UnitySizeToReal(this.rect);
		
		NativeCaller.ShowInputBoxAt(inputRect.x,inputRect.y,inputRect.width,inputRect.height,this.Guid);
		NativeCaller.SetInputBoxText(button.txt);
		button.txt = "";
		
		if(ActiveClick != null)
		{
			ActiveClick.Call(null);
		}
	}
	
	public function SetVisible(visible:boolean)
	{
		super.SetVisible(visible);
		
		if (!visible)
		{
			Done();
		}
	}
	
	public function Done()
	{
		currentInputBox = null;
		button.txt = GetText();
		onfocus = false;
		button.mystyle.normal.background = TextureMgr.instance().LoadTexture("type_box",TextureType.DECORATION);
		button.SetDisabled(false);
		

		NativeCaller.HideInputBox();
	}
	public function ChangeInputBoxAt(x:float,y:float,width:float,height:float)
	{
		NativeCaller.ChangeInputBoxAt(x,y,width,height);
	}
	
	public function SetFocus()
	{
		inner_Click();
	}
	
	public function SetInputBoxMaxChars(max:int)
	{
		NativeCaller.SetInputBoxMaxChars(max);
	}
	
}
