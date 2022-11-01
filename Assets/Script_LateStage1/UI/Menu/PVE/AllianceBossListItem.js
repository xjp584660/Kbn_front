
class AllianceBossListItem extends ListItem
{
	@SerializeField private var iconSelect :SimpleLabel;
	@SerializeField private var iconUnlock :SimpleLabel;
	@SerializeField private var iconLock :SimpleLabel;
	@SerializeField private var iconCurrent :SimpleLabel;
	
	public function OnPopOver()
	{
		super.OnPopOver();
	}
	
	public function Init()
	{
		super.Init();
		iconSelect.mystyle.normal.background = TextureMgr.instance().LoadTexture("Scroll-point-Select",TextureType.DECORATION);
		iconUnlock.mystyle.normal.background = TextureMgr.instance().LoadTexture("Scroll-point-normal",TextureType.DECORATION);
		iconCurrent.mystyle.normal.background = TextureMgr.instance().LoadTexture("Scroll-point-blue",TextureType.DECORATION);
		iconLock.mystyle.normal.background = TextureMgr.instance().LoadTexture("Scroll-point-grey",TextureType.DECORATION);
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		iconSelect.Draw();
		iconUnlock.Draw();
		iconCurrent.Draw();
		iconLock.Draw();
		GUI.EndGroup();
		return -1;
	}
	
	public function Update()
	{
	}
	
	public function SetRowData(data:Object):void
	{
		Clear();
		var dataHash:Hashtable = data as Hashtable;
		var nIndex:int = _Global.INT32(dataHash["index"]);
		var curAttackLevelIndex:int = _Global.INT32(dataHash["curAttackLevelIndex"]);
		var totalLevelCount:int = _Global.INT32(dataHash["totalLevelCount"]);
		var curSelectLevelIndex:int = _Global.INT32(dataHash["curSelectLevelIndex"]);
		if(nIndex == curSelectLevelIndex)
		{
			iconSelect.SetVisible(true);
		}
		if(nIndex < curAttackLevelIndex)
		{
			iconUnlock.SetVisible(true);
		}
		if(nIndex == curAttackLevelIndex)
		{
			iconCurrent.SetVisible(true);
		}
		if(nIndex > curAttackLevelIndex)
		{
			iconLock.SetVisible(true);
		}
	}
	
	private function Clear():void
	{
		iconSelect.SetVisible(false);
		iconUnlock.SetVisible(false);
		iconCurrent.SetVisible(false);
		iconLock.SetVisible(false);
	}
}