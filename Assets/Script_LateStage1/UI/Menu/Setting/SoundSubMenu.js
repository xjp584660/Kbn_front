public class SoundSubMenu extends SubMenu
{
	public var scrollView : ScrollView;
	public var generalSetting : GeneralSetting;
	
	function Init(parent:ComposedMenu)
	{
		super.Init(parent);		
							
		title.txt = Datas.getArString("Settings.GeneralSetting");
		scrollView.Init();
	}
	
	public function OnPush(param:Object):void
	{
		generalSetting.Init();
		generalSetting.SetUIData(null);
		scrollView.addUIObject(generalSetting);
		scrollView.AutoLayout();
		scrollView.MoveToTop();
	}

	public function OnPop():void
	{
		scrollView.clearUIObject();
	}

	function Update()
	{
		scrollView.Update();
	}
	
	function DrawItem()
	{
		title.Draw();
		btnBack.Draw();

		scrollView.Draw();
	}
	
	function DrawBackground()
	{
		
	}
}