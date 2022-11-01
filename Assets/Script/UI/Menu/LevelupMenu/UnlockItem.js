class UnlockItem extends ListItem
{
	public var backLabel:Label;
	public function SetRowData(data:Object)
	{
		icon.useTile = true;
		var type:String  = (data as LevelUp.UnlockItem).type;
		var textName : String = (data as LevelUp.UnlockItem).texturePath;
		if( type == TextureType.ICON_BUILDING)
			icon.tile = TextureMgr.instance().BuildingSpt().GetTile(textName);
		else if(type == TextureType.ICON_UNIT)
			icon.tile = TextureMgr.instance().UnitSpt().GetTile(textName);
		else if(type == TextureType.ICON_ELSE)
			icon.tile = TextureMgr.instance().ElseIconSpt().GetTile(textName);
			
		//icon.tile.name = (data as LevelUp.UnlockItem).texturePath;	

		title.SetFont(FontSize.Font_20,FontType.TREBUC);
//		if(data.type == -1)
//			icon.mystyle.normal.background = Resources.Load(data.texturePath);
//		else
//			icon.mystyle.normal.background = TextureMgr.instance().LoadTexture(data.texturePath, data.type);	
	}	
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		backLabel.Draw();
		title.Draw();
		icon.Draw();
		description.Draw();
		if(btnSelect)
			btnSelect.Draw();
		GUI.EndGroup();
	}
	
	public function setHelpFunc()
	{
		btnSelect.OnClick = function(param:Object)
		{
			var setting:InGameHelpSetting = new InGameHelpSetting();
			setting.type = "building";
			setting.key = ConquerContent.CONQUESTHELP;
			setting.name = ConquerContent.CONQUESTHELP;
			
			MenuMgr.getInstance().PushMenu("InGameHelp", setting, "trans_horiz");
		};
	}
}


