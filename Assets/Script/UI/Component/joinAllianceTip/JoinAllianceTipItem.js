class JoinAllianceTipItem extends UIObject
{
	public var tip:Label;
	public var line:Label;
	public var borderXTip:int = 30;
	public var borderXLine:int = 60;

	function Init()
	{
		tip.Init();
		line.Init();
	}

	function Draw()
	{
		GUI.BeginGroup(rect);
		tip.Draw();
		line.Draw();
		GUI.EndGroup();
	}
	
	function resetDisplay(str:String)
	{
		tip.txt = str;
	}
	
	public function SetNormalTxtColor(color:FontColor)
	{
		tip.SetNormalTxtColor(color);
	}
	
	public function SetWidth(_width:int):void
	{
		tip.rect = new Rect(borderXTip, 0, _width - 2 * borderXTip, this.rect.height - line.rect.height);
		tip.mystyle.overflow.right = 30 - tip.rect.width;
		
		line.rect = new Rect(borderXLine, this.rect.height - line.rect.height, _width - 2 * borderXLine, line.rect.height);	
	}	
}