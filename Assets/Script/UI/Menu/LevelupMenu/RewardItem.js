class RewardItem extends ListItem
{
	public var backLabel:Label;
	public var frame:Label;
	
	public function SetRowData(data:Object)
	{
		var textureName : String = (data as LevelUp.Reward).texturePath;
		icon.useTile = true;
		var type:String  = (data as LevelUp.Reward).type;
		if( type == TextureType.ICON_ELSE)
			icon.tile = TextureMgr.instance().ElseIconSpt().GetTile(textureName);
		else if(type == TextureType.ICON_ITEM)
			icon.tile = TextureMgr.instance().ItemSpt().GetTile(textureName);
		//icon.tile.name = (data as LevelUp.Reward).texturePath;
		
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
	//	icon.mystyle.normal.background = TextureMgr.instance().LoadTexture(data.texturePath, data.type);//Resources.Load(data.texturePath);
	}
	
	function Draw()
	{
		GUI.BeginGroup(rect);
		backLabel.Draw();
		title.Draw();
		icon.Draw();
		frame.Draw();
		description.Draw();
		GUI.EndGroup();
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		icon.tile.name = null;
		icon.tile = null;
	}
}

