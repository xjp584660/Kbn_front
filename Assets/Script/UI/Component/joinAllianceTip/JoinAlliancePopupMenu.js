class JoinAlliancePopupMenu extends PopMenu
{
	public var createAllianceBtn:Button;
	public var joinAllianceBtn:Button;
	public var joinAllianceObj:JoinAllianceDes;
	
	function Init()
	{
		super.Init();
	
		createAllianceBtn.Init();
		joinAllianceBtn.Init();
		joinAllianceObj.Init();
		
		createAllianceBtn.txt = Datas.getArString("AllianceJoiner.CreateAllianceBtn");
		joinAllianceBtn.txt = Datas.getArString("AllianceJoiner.JoinAllianceBtn");
		
		createAllianceBtn.OnClick = handleCreateBtn;
		joinAllianceBtn.OnClick = handleJoinsBtn;
	}

	private function handleCreateBtn():void	
	{
		this.close();
		
		JoinAllianceTip.getInstance().handleOperation("createAlli");
	}
	
	private function handleJoinsBtn():void	
	{
		this.close();
		
		JoinAllianceTip.getInstance().handleOperation("joinAlli");
	}	
	
	function DrawItem()
	{
		createAllianceBtn.Draw();
		joinAllianceBtn.Draw();
		joinAllianceObj.Draw();
	}
	
	function OnPush(param:Object)
	{			
		super.OnPush(param);
		joinAllianceObj.rect.x = 0;
		joinAllianceObj.rect.y = 0;
		joinAllianceObj.rect.width = this.rect.width;
		joinAllianceObj.SetLayout("PopMenu");
	}
	
	function OnPopOver()
	{
		joinAllianceObj.Clear();
	}
}