public class CraftCostItem extends ListItem
{
	public var l_name : Label;
	public var l_right :Label;
	public var l_wrong :Label;
	public var l_Owned : Label;
	public var l_line : Label;
	public var itemPic:ItemPic;
	
	private var m_data:HashObject;
	
	public function Init()
	{
		super.Init();
	}
	
	public function Draw()
	{
		//super.Draw();
		GUI.BeginGroup(rect);			
		itemPic.Draw();
		l_name.Draw();	
		l_right.Draw();
		l_wrong.Draw();
		l_line.Draw();
		l_Owned.Draw();
		GUI.EndGroup();
	}
	public function SetRowData(data:Object)
	{
		m_data = data as HashObject;
		var itemId:int = _Global.INT32(m_data["id"]);
		var needNum:int = _Global.INT32(m_data["num"]);
		var hasNum:int = MyItems.instance().countForItem(itemId);
		
		l_name.SetFont(FontSize.Font_18, FontType.TREBUC);
		l_name.txt = Datas.getArString("itemName.i" + itemId);
		//icon.tile.name = "i" + itemId;
		itemPic.SetId(itemId);
		l_Owned.txt = Datas.getArString("Common.Owned") + ": " + hasNum + "/" + needNum;
		
		var nameWidth:float = l_name.GetWidth();

		l_right.rect.x = l_name.rect.x + nameWidth + 10; 
		l_wrong.rect.x = l_right.rect.x;

		l_right.SetVisible(hasNum >= needNum);
		l_wrong.SetVisible(hasNum < needNum);
	}
	
}