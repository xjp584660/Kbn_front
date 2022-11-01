class DetialPopUpMenu extends PopMenu
{
	public var desc:Label;
	public var toumamentInfoDescList:ScrollList;
	public var toumamentInfoDescTemplate:ToumamentInfoDescItem;
	public function Init():void
	{
		super.Init();
		toumamentInfoDescList.Init(toumamentInfoDescTemplate);
		//desc.txt=PvPToumamentInfoData.instance().labelIntroduction;
		btnClose.txt="";
		btnClose.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_popup1_close_normal",TextureType.BUTTON);
		btnClose.mystyle.active.background=TextureMgr.instance().LoadTexture("button_popup1_close_down",TextureType.BUTTON);
		title.txt=Datas.getArString("Desc");
		var a : Array = new Array();
		//a.Add(PvPToumamentInfoData.instance().labelIntroduction);
		a.Add(Datas.getArString("IngameHelp.PVP_Text"));
		toumamentInfoDescList.SetData( a );
		desc.txt = Datas.getArString("Event.AllianceTournament_Information_Desc");
		//toumamentInfoDescList.rect=desc.rect;
	}
	
	function Update() 
	{
		super.Update();
		toumamentInfoDescList.Update();
	}
	
	public function OnPush(param:Object)
	{
		super.OnPush( param );
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		toumamentInfoDescList.Clear();
	}
	
	public function DrawItem()
	{
		super.DrawItem();
		//btnClose.Draw();
		toumamentInfoDescList.Draw();
		//desc.Draw();
	}
}