class SwitchTips extends UIObject
{
	@SerializeField private var curTips :SimpleLabel;
	@SerializeField private var topRiseTips:RiseTips;
	@SerializeField private var bottomRiseTips:RiseTips;
	
	public function Init()
	{
		visible = true;
		curTips.txt = "";
		topRiseTips.txt = "";
		bottomRiseTips.txt = "";
		curTips.rect.y = rect.height/2 - curTips.rect.height/2;
		topRiseTips.Init(RiseTips.ALPHA_TYPE.START_WHITH_FULL, OnTopTipsEnd);
		topRiseTips.rect.x = 0;
		topRiseTips.rect.y = 0;
		topRiseTips.rect.width = rect.width;
		topRiseTips.rect.height = rect.height/2 + curTips.rect.height/2;
		topRiseTips.bottomDesc.rect.height = curTips.rect.height;
		bottomRiseTips.Init(RiseTips.ALPHA_TYPE.START_WHITH_ZERO, OnBottomTipsEnd);
		bottomRiseTips.rect.x = 0;
		bottomRiseTips.rect.y = rect.height/2 - curTips.rect.height/2;
		bottomRiseTips.rect.width = rect.width;
		bottomRiseTips.rect.height = rect.height/2 + curTips.rect.height/2;
		bottomRiseTips.bottomDesc.rect.height = curTips.rect.height;
	}
	public function get txt() :String {
		if(curTips!=null)
			return curTips.txt;
		return null;
	}
	
	public function set txt(value : String) {
		if(curTips!=null)
		{
			if(curTips.txt != "")
			{
				topRiseTips.txt = curTips.txt;
				topRiseTips.Begin();
				bottomRiseTips.txt = value;
				curTips.SetVisible(false);
				bottomRiseTips.Stop();
			}
			else
			{
				bottomRiseTips.txt = value;
				bottomRiseTips.Begin();
				curTips.SetVisible(false);
			}
			curTips.txt = value;
		}
	}
	
	private function OnTopTipsEnd():void
	{
		bottomRiseTips.Begin();
	}
	
	private function OnBottomTipsEnd():void
	{
		curTips.SetVisible(true);
	}
	
	public function Draw()
	{
		if(!visible)return;
		GUI.BeginGroup(rect);
			curTips.Draw();
			topRiseTips.Draw();
			bottomRiseTips.Draw();
		GUI.EndGroup();
	}
}