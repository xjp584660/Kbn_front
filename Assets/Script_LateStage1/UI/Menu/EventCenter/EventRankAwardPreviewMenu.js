class EventRankAwardPreviewMenu extends PopMenu
{
	public var bg_Line:Label;
	public var description:Label;
	public var prizeList:ScrollList;
	public var subItem:NewSubItem;
	private var m_prizeDataList:Array = new Array();

	public function Init()
	{
		super.Init();
		prizeList.Init(subItem);
		title.txt = Datas.getArString("EventCenter.Awards");
		btnClose.OnClick = CloseMenu;
	}
	
	public function DrawItem()
	{
		bg_Line.Draw();
		prizeList.Draw();
		btnClose.Draw();
		description.Draw();
	}
	
	function OnPush(param:Object)
	{
		var data:HashObject = param as HashObject;
		m_prizeDataList.Clear();
		if(data["reward"] != null)
		{
			var tempArr:Array = _Global.GetObjectValues(data["reward"]);
			if(tempArr.length > 0)
			{
				var strDesc:String = Datas.getArString("EventCenter.RankRewards");
				description.txt = strDesc.Replace("{0}",data["rank"].Value);
				
				var hashItem:HashObject;
				for(var i:int=0;i<tempArr.length;i++)
				{
					hashItem = tempArr[i] as HashObject;
					var item:InventoryInfo = new InventoryInfo();
					item.id = _Global.INT32(hashItem["id"]);
					item.quant = _Global.INT32(hashItem["num"]);
					m_prizeDataList.Push(item);
				}
				prizeList.SetData(m_prizeDataList);
			}
			else
			{
				description.txt = Datas.getArString("EventCenter.AwardsNotYetDetermined");
			}
			
		}
	}
	
	public	function	OnPopOver()
	{
		prizeList.Clear();
	}
	
	public function Update()
	{
		prizeList.Update();
	}
	
	public function CloseMenu():void
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
}