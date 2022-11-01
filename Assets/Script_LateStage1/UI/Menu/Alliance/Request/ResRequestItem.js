public class ResRequestItem extends UIObject
{
	public var Type:int = 0;
	public var resourceBar:ResourceBar;
	public var lblIcon:Label;
	public var lblK:Label;
	public var txt:InputText;
	public var com:ComposedUIObj;
	
	public var ResourceBarChangingFunc:Function;
	private static var values:int[] = [0,500000,1000000,2000000,3000000];
	public function GetValue():long
	{
		return _Global.INT64(txt.txt);
	}
	
	
	public function Init(type:int)
	{
		this.Type = type;
		com.rect = this.rect;
		resourceBar.Init(4);
		resourceBar.sliderStyle.normal.background = TextureMgr.instance().LoadTexture("ScaleBarIndex_Resource", TextureType.DECORATION);
		lblK.txt = "";
		lblK.mystyle.normal.textColor = _Global.RGB(101,76,44);
		txt.type = TouchScreenKeyboardType.NumberPad;
		txt.filterInputFunc = InputText.FilterInputForNumber;
		txt.maxChar = 9;
		txt.hidInput = false;
		txt.Init();
		lblIcon.mystyle.normal.background = Resource.getResourceTexure(Type);
		resourceBar.valueChangingFunc = resBarChanging;
	}
	
	public function InitValue(val:int)
	{
		resourceBar.SetCurValue(val);
		txt.txt = values[val] + "";
	}
	
	public function Update()
	{
	
	}
	
	private function resBarChanging(val:int)
	{
		txt.txt = values[val] + "";
		if(ResourceBarChangingFunc != null)
		{
			ResourceBarChangingFunc(val);
		}
	}
	public function Draw()
	{
		com.Draw();
		/*
		resourceBar.Draw();
		lblIcon.Draw();
		lblK.Draw();
		txt.Draw();
		*/
	}
}

