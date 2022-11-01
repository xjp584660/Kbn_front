class BossTroopItem extends ListItem
{
	@SerializeField private var troopName :SimpleLabel;
	@SerializeField private var troopNum :SimpleLabel;
	@SerializeField private var line :SimpleLabel;
	
	public function Init():void
	{
		super.Init();
		if(line.mystyle.normal.background == null)
		{
			line.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line_list_small",TextureType.DECORATION);
		}
	}
	
	public function OnPopOver()
	{
		super.OnPopOver();
		
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		troopName.Draw();
		troopNum.Draw();
		line.Draw();
		GUI.EndGroup();
		return -1;
	}
	
	public function Update()
	{
	}
	
	public function SetRowData(data:Object):void
	{
		var itemData:KBN.BossTroopInfo = data as KBN.BossTroopInfo;
		troopName.txt = Datas.instance().getArString("unitName."+"u" + itemData.troopID);
		troopNum.txt = itemData.troopAmount+"";
	}
}