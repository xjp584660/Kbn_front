
using UnityEngine;
using KBN;

public class SubItem : ListItem
{
	public Label backLabel;
	protected InventoryInfo m_data;
	public Label frame;

	public override void DrawItem()
	{
		base.DrawItem();
		//GUI.BeginGroup(rect);
		backLabel.Draw();
		title.Draw();
		if(icon != null)
		{
			icon.Draw();				
		}
		description.Draw();
		frame.Draw();
		//GUI.EndGroup();
		//return -1;
	}
	
	public override void SetRowData(object data)
	{
		m_data = data as InventoryInfo;
//		Object arStrings = Datas.instance().arStrings();
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		title.txt =Datas.getArString("itemName.i" + m_data.id.ToString()); 
		description.txt = "" + m_data.quant;
		
		frame.SetVisible(false);
		
	//	icon.mystyle.normal.background = TextureMgr.instance().LoadTexture("i"+ data.id, TextureType.ICON_ITEM);//Resources.Load("Textures/UI/icon/icon_item/i"+ data.id);
		if(MystryChest.singleton.IsMystryChest(m_data.id))
		{
			string imageName = MystryChest.singleton.GetChestImage(m_data.id);
			if(!icon.tile.TryChangeImage(imageName, false))
			//	icon.TileName = imageName;	
			//else
				icon.TileName = Constant.DefaultChestTileName;
		}
		else if(MystryChest.singleton.IsLevelChest(m_data.id))
		{
			string imageName1 = MystryChest.singleton.GetLevelChestImage(m_data.id);
			icon.TileName = imageName1;			
			frame.SetVisible(true);	
		}		
		else
		{
			if( Datas.singleton.getImageName(m_data.id) == "" )
				icon.TileName = "i"+ m_data.id;
			else
				icon.TileName =	Datas.singleton.getImageName(m_data.id);
		}
	}
	
	public override void Init()
	{
		icon.useTile = true;
		icon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
	}
}

