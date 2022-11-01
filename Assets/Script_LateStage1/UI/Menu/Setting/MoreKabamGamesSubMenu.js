

public class MoreKabamGamesSubMenu extends SubMenu
{

	public var GamesList:ScrollView;
	public var MoreGamesItem:MoreKabamGamesItem;
	//public var Line:Label;
	
	public function Init(parent:ComposedMenu)
	{
		super.Init(parent);
		MoreGamesItem.Init();
		GamesList.addUIObject(MoreGamesItem);
		this.title.txt = Datas.getArString("Settings.MoreKabamGames");
	}
	public function Update()
	{
		GamesList.Update();
	}
	function DrawItem()
	{
		GamesList.Draw();
		btnBack.Draw();
	}
	
	public function OnPush(param:Object):void
	{

	}	
}

