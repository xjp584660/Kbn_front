
//class	DetailListItem extends	ListItem{
//
//	public var backLabel:Label;
//	private var m_data:Object;
//	function Draw()
//	{	
//		GUI.BeginGroup(rect);
//		backLabel.Draw();
//		title.Draw();			
//		icon.Draw();	
//		description.Draw();
//		GUI.EndGroup();
//	}
//	
//	public function SetRowData(data:Object)
//	{
//		m_data = data;
//		var arStrings:Object = Datas.instance().arStrings();
//		title.txt =arStrings["itemName"]["i" + data.id]; 
//		description.txt = "" + data.quant;
//	//	icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("i"+ data.id, TextureType.ICON_ITEM);//Resources.Load("Textures/UI/icon/icon_item/i"+ data.id);
//		icon.tile.name = "i"+ data.id;
//	}
//	
//	public function Init()
//	{
//		icon.useTile = true;
//		icon.tile.spt = TextureMgr.instance().ItemSpt();
//	}
//}