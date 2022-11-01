


public class TapJoyItem extends UIObject
{

	public var CenterContent:Label;
	public var DefaultButton:Button;
	
	
	public function Init():void
	{
		
		CenterContent.Init();
		CenterContent.txt = Datas.getArString("Temple_BuyGoldModal.EarnGold_Button");
		DefaultButton.Init();
		DefaultButton.OnClick = selectClick;
		
		super.Init();
	}
	
	protected function selectClick(clickParam:Object):void
	{
		NativeCaller.ShowTapJoyOffers();
	}
	



	public function Draw()
	{
		super.Draw();
		GUI.BeginGroup(rect);
		DefaultButton.Draw();
		CenterContent.Draw();
		GUI.EndGroup();
	}
		
}