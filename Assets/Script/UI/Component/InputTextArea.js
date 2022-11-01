public class InputTextArea extends UIObject
{
	public var lblFrame:Label;
	public var scroll:ScrollView;
	public var Text:InputText;
	
	protected var activeBackground:String = "Textures/UI/decoration/type_box2";
	protected var normalBackground:String = "Textures/UI/decoration/type_box";
	public var inputDoneFunc:Function;
	
	private var originalHeight:int = 0;
	
	private static var additionalHeight:int = 100;
	public function Update()
	{
		super.Update();
		scroll.Update();
	}
	
	public function Init()
	{
		super.Init();
		Text.Init();
		scroll.rect = new Rect(rect.x +10,rect.y +10,rect.width - 15,rect.height - 20);
		lblFrame.rect = rect;
		Text.rect = new Rect(0,0,rect.width - 20,rect.height - 20);
		Text.AutoChangeStatus = false;
		originalHeight = Text.rect.height;
		Text.inputDoneFunc = inputDoneInternal;
		Text.startInput = StartInput;
		Text.endInput = EndInput;
		scroll.clearUIObject();
		scroll.addUIObject(Text);
		scroll.scrollAble = false;
		scroll.AutoLayout();
	}
	
	public function Draw()
	{
		lblFrame.Draw();
		scroll.Draw();
	}
	
	private function inputDoneInternal(str:String):String
	{
		if(inputDoneFunc)
		{
			return inputDoneFunc(str);
		}
		return str;
	}
	
	private function scrollSetting(content:String)
	{
		//change scroll and text's height
		var height:int = Text.GetTxtHeight() + additionalHeight;
		if(height <= scroll.rect.height)
		{
			scroll.scrollAble = false;
			Text.rect.height = originalHeight;
		}
		else
		{
			Text.rect.height = height;
			scroll.AutoLayout();
			scroll.scrollAble = true;
		}
		
	}
	
	public function SetTextContent(content:String)
	{
		scrollSetting(content);
		Text.txt = content;
		scroll.MoveToTop();
	}
	
	private function StartInput()
	{
		lblFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("type_box2",TextureType.DECORATION);
	}
	private function EndInput(content:String)
	{
		scrollSetting(content);
		lblFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("type_box",TextureType.DECORATION);
	}
	
}
