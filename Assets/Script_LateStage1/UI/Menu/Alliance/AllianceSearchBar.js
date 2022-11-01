public class AllianceSearchBar extends UIObject
{
	public var it_search	:InputText;
	public var btn_x		:Button;
	public var btn_search	:Button;
	
	public var callback_x:Function;
	public var callback_search:Function;
	
	public function Init():void
	{
		super.Init();
		btn_x.OnClick = click_x;
		btn_search.OnClick = click_search;
		it_search.SetNormalTxtColor(FontColor.Description_Light);
		it_search.maxChar = 20;
		btn_search.txt = Datas.getArString("Common.Search");
		it_search.txt = "";
	}
	
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		it_search.Draw();
		btn_x.Draw();
		btn_search.Draw();
		
		GUI.EndGroup();
	}
	
	public function getSearchText():String
	{
		return it_search.txt;
	}
	///
	private function click_x(cparam:Object):void
	{	
		it_search.setKeyboardTxt("");	
		it_search.txt = "";	
		if(callback_x != null)
			callback_x();
	}
	
	private function click_search(cparam:Object):void
	{
		var str:String = this.getSearchText();
		InputText.closeActiveInput();
		if ( str == null || str.Length == 0 )
			return;
		//if(str == null || str.Length < 3)
		//{
		//	ErrorMgr.instance().PushError("",Datas.getArString("GetAllianceSearchResults.EntryAtleast") );
		//	return;
		//}
		if(callback_search != null)
			callback_search();
	}
}
