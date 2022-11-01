public class Info2_DipSet extends ComposedUIObj
{
	
	public var l_t1:Label;
	public var l_t2:Label;
	public var it_in:InputText;
	public var btn_search:Button;
	
	public var rcon:ComposedUIObj;
	public var check_all:ToggleButton;	
	public var tl_1:Label;
	public var tl_2:Label;
	public var tl_3:Label;
	public var tl_4:Label;
	public var scroll_list:ScrollList;
	public var rl_bg1:Label;
	public var rl_bg2:Label;
	
	public var ins_setItem:ListItem;
	
	public var b4g:Button4Page;
	public var btn_friendly :Button;
	public var btn_neutral  :Button;
	public var btn_hostile  :Button;
	
	//data
	protected var all_list :Array;
	protected var show_list :Array;
	public var PAGE_NUM:int = 10;
	
	public var frameTop:Label;
	public var bgMiddleBodyPic:Label;
	public var bottomTile :Tile;
	
	protected var repeatTimes:int;
	public function Init():void
	{

		scroll_list.Init(ins_setItem);
		
		btn_friendly.OnClick = buttonHandler;
		btn_friendly.clickParam = "FRIEND";
		btn_friendly.txt = Datas.getArString("Alliance.relationFriendly");
		
		btn_neutral.OnClick = buttonHandler;
		btn_neutral.clickParam = "NEUTRAL";
		btn_neutral.txt = Datas.getArString("Alliance.relationNeutral");
		
		btn_hostile.OnClick = buttonHandler;
		btn_hostile.clickParam = "HOSTILE";
		btn_hostile.txt = Datas.getArString("Alliance.relationHostile");
		
		btn_search.OnClick = buttonHandler;
		btn_search.clickParam = "SEARCH";
		btn_search.txt = Datas.getArString("Common.Search");
		
		l_t1.txt = Datas.getArString("Common.Search");
		l_t2.txt = Datas.getArString("Common.SearchResults");
		
		b4g.Init();
		b4g.pageChangedHandler = pageChangedHandler;
		check_all.valueChangedFunc = checkChange;
		
		//background = TextureMgr.instance().LoadTexture("ui_bg_wood", TextureType.BACKGROUND);
		
		tl_1.txt = Datas.getArString("Alliance.AllianceNameAndOwner");	//"Name";
		tl_2.txt = "";	//Datas.getArString("Common.Owner");	//"Master";
		tl_3.txt = Datas.getArString("Common.Ranking");	//"Ranking";
		tl_4.txt = Datas.getArString("Common.Might");	//;

		it_in.type = TouchScreenKeyboardType.Default;
		
		bottomTile = TextureMgr.instance().BackgroundSpt().GetTile("tool bar_bottom");
		bottomTile.rect.x=  0 ;
		bottomTile.rect.y = 775;
		bottomTile.rect.width = 640;
		//bottomTile.name = "tool bar_bottom";
	}
	
	public function show():void
	{
//		it_in.txt = "A00";
	
	}
	
	public function Update()
	{
		scroll_list.Update();	
	}
	
	protected function resultLoaded(list:DipAllianceVO[]):void
	{
		all_list = list;
		pageChangedHandler(1);
		b4g.setPages(1, (all_list.length -1 ) / PAGE_NUM + 1 );
		//
		
	}
	
	protected function pageChangedHandler(page:int):void
	{	
		var min:int = page* PAGE_NUM - PAGE_NUM;
		var max:int = min + PAGE_NUM;	
		if(max > all_list.length)
			max = all_list.length;
		
		scroll_list.ResetPos();
		show_list = all_list.slice(min,max);		
		scroll_list.SetData(show_list);
		ins_setItem.SetRowData(show_list[0]);
	}	
	
	protected function checkChange(b:boolean):void
	{
		changeListSelected(show_list,b);
//		vbox.updateItemData();
	}
	
	protected function changeListSelected(list:Array,selected:boolean):void
	{
		if(list)
		{
			for(var i:int=0; i<list.length; i++)
			{
				(list[i] as DipAllianceVO).selected = selected;	
			}
		}
	}
	
	protected function buttonHandler(clickParam:Object):void
	{
		var st:int = -1;
		
		switch(clickParam)
		{
			case "SEARCH":
				var s:String = it_in.txt;
				if(!s || s.Trim().Length <1)
				{
//					ErrorMgr.instance().PushError("",Datas.getArString("GetAllianceSearchResults.EntryAtleast") );
				}
				else
				{				
					Alliance.getInstance().reqAllianceSearch(it_in.txt,resultLoaded);
				}
				break;	
			case "FRIEND":
				st = 1;
				break;
			case "NEUTRAL":
				st = 0;
				break;
			case "HOSTILE":
				st = 2;
				break;
		}
		if(st >= 0)
		{
			var list:Array = getSelectedIDs();
			if(list.length  == 0)
			{
				ErrorMgr.instance().PushError("",Datas.getArString("SetAllianceDiplomacies.SelectAtLeastOne") );
			}
			else
				Alliance.getInstance().reqSetAllianceDiplomacies(list.ToBuiltin(typeof(int)),st,dip_result);
		}
	}
	public function getSelectedIDs():Array
	{
		var list:Array = [];
		if(show_list )
		{		
			for(var i:int=0;i<show_list.length; i++)
				if(( show_list[i] as DipAllianceVO).selected)
					list.push(( show_list[i] as DipAllianceVO).allianceId);
		}
		return list;
	}
	protected function dip_result():void
	{
		//called ok.
//		nav_head.controller.pop(this);
	}
	
	function DrawBackGround()
	{
		bgMiddleBodyPic.Draw();
		frameTop.Draw();
		if(bottomTile.IsValid)
			bottomTile.Draw(true);	
	}
	
	public	function	Clear()
	{
		scroll_list.Clear();
	}
}
