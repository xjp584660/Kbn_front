class ToumamentInfoItem extends ListItem
{
	public var titleFirst:Label;
	public var betweenline:Label;
	//public var titleDesc:Label;
	//public var chestBox:Label;
	public var m_bonus : HashObject;
	public function Init()
	{
		
	}
	
	public function SetRowData(data:Object)
	{
		var tmpdata : ToumamentInfoItemData = data as ToumamentInfoItemData;
		
		title.txt = tmpdata.itemDataTitle;
		//titleDesc.txt=tmpdata.itemDataDescTitle;
		titleFirst.setBackground(tmpdata.itemDataRankTexName,TextureType.DECORATION);
		if(tmpdata.index>=5)
		{
			titleFirst.txt=tmpdata.index+"";
		}
		else
		{
			titleFirst.txt="";
		}
		//icon.setBackground("infor_icon",TextureType.DECORATION);
		betweenline.setBackground("bg_line_bright",TextureType.DECORATION);
		btnSelect.txt=Datas.getArString("Common.View");
		btnSelect.changeToBlueNew();
		
		/*
		chestBox.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		chestBox.useTile = true; 
		chestBox.tile.name  = "i501";
		*/
		
		m_bonus = tmpdata.m_bonus;
		
		btnSelect.OnClick=function(param:Object)//64300,30001
		{
			var id:HashObject = new HashObject({"Category":"Chest",
												"inShop":false,
												"hasReward":false,
												"bonus":m_bonus,
												"isAlliance":NoticePadMenu.isAllianRank
												});
			MenuMgr.getInstance().PushMenu("ChestDetail4IndividualProps", id, "trans_zoomComp");
		};
	}
	
	public function Draw()
	{
		if(!visible)
			return;
		GUI.BeginGroup(rect);
		title.Draw();
			
		if ( description != null )	
			description.Draw();
		if(btnSelect)
			btnSelect.Draw();
		titleFirst.Draw();
		//titleDesc.Draw();
		betweenline.Draw();
		//chestBox.Draw();
		//icon.Draw();
		GUI.EndGroup();
	   	return -1;
	}
}
