class PlainItem extends ListItem
{

	public var labelTypeAndCoor:Label;
	public var labelLevel:Label;
	public var labelPosition:Label;
	public var arrow:Button;
	private var g_id:int;
	private var g_xCoor:int;
	private var g_yCoor:int;
	private var g_level:int;
	private var g_type:int;
	
	function Init()
	{
		super.Init();
		//var imagePath:String = "Textures/UI/map/w_50_1_1";
		icon.Background = TextureMgr.instance().LoadTexture("w_50_1_1",TextureType.MAP17D3A_TILE);
	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);	
		btnSelect.Draw();
		labelTypeAndCoor.Draw();
//		labelPosition.Draw();
//		labelLevel.Draw();
		icon.Draw();
		arrow.Draw();
		GUI.EndGroup();	
	}
	
	function SetRowData(_data:Object)
	{
//		var arString:Object = Datas.instance().arStrings();
		var m_data:Hashtable = _data as Hashtable;
		g_id = _Global.INT32(m_data["id"]);
		g_xCoor = _Global.INT32(m_data["xCoor"]);
		g_yCoor = _Global.INT32(m_data["yCoor"]);
		g_level = _Global.INT32(m_data["level"]);
		
		
		var tileName:String;
		tileName = Datas.getArString("Common.Plain");

		labelTypeAndCoor.txt = tileName + "(" +Datas.getArString("Common.Lv") + " " + m_data["level"] + ")" + " " + "(" + g_xCoor +","+ g_yCoor + ")";
//		labelPosition.txt = "(" + g_xCoor +","+ g_yCoor + ")";
	//	labelLevel.txt = "(" +Datas.getArString("Common.Lv"] + " " + _data["level"] + ")";
//		labelPosition.Left = labelTypeAndCoor.Region.x + labelTypeAndCoor.GetWidth() + 20;
		
		btnSelect.txt = "";
		btnSelect.OnClick = function()
		{
			CreatNewCity.Instance().SetCityName(g_id);
		};
		arrow.OnClick = btnSelect.OnClick;
	}
}

