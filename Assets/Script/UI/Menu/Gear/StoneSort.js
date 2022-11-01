


public class StoneSort
{
	public var sequenceButton:Button; 
	
	private var mCurrentSortFunction:Comparison.<InventoryInfo> = SortAcc;
	private var mIsAcc = false;
	public var OnSortChanged:Function;
	
	public function Init()
	{
		sequenceButton.Init();
		sequenceButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("Sequence_button_high",TextureType.BUTTON);
		sequenceButton.mystyle.active.background = TextureMgr.instance().LoadTexture("Sequence_button_high_down",TextureType.BUTTON);
		//sequenceButton.OnClick = OnSequenceClick;
		mCurrentSortFunction = SortAcc;
		sequenceButton.SetZOrder(2000);
		sequenceButton.SetName("seq");
		GestureManager.Instance().RegistTouchable(sequenceButton);
		mIsAcc = true;
	}
	
	
	public function get SortFunction():Comparison.<InventoryInfo>
	{
		if(!mIsAcc)
		{
			if (IsUseFteSort)
			{
				mCurrentSortFunction = SortDesByFte;
			}
			else
			{
				mCurrentSortFunction = SortDes;
			}
		} 
		else 
		{ 
			if (IsUseFteSort)
			{
				mCurrentSortFunction = SortAccByFte;
			}
			else
			{
				mCurrentSortFunction = SortAcc;
			}
		}
		
		return mCurrentSortFunction;
	}
	
	public function OnSequenceClick()
	{
		mIsAcc = !mIsAcc;
		if(!mIsAcc)
		{
			mCurrentSortFunction = SortDes;
			sequenceButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("Sequence_button_Low",TextureType.BUTTON);
			sequenceButton.mystyle.active.background = TextureMgr.instance().LoadTexture("Sequence_button_Low_down",TextureType.BUTTON);
		} 
		else 
		{ 
			sequenceButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("Sequence_button_high",TextureType.BUTTON);
			sequenceButton.mystyle.active.background = TextureMgr.instance().LoadTexture("Sequence_button_high_down",TextureType.BUTTON);
			mCurrentSortFunction = SortAcc;
		} 
		if(OnSortChanged != null) 
			OnSortChanged();
		
	}
	private function SortAcc(item1:InventoryInfo,item2:InventoryInfo):int
	{
		return Sort(item1,item2,-1);
	}
	private function SortDes(item1:InventoryInfo,item2:InventoryInfo):int
	{
		return Sort(item1,item2,1);
	}
	
	private function Sort(item1:InventoryInfo,item2:InventoryInfo,direction:int):int
	{
		if(item1 == null) return direction;
		if(item2 == null) return -1 * direction;
		var s1:int = item1.id % 100;
		var s2:int = item2.id % 100;
		
		if(s1 < s2) return direction;
		if(s1 > s2) return -1 * direction;	
		
		s1 = item1.id / 100;
		s2 = item2.id / 100;

		if(s1 < s2) return direction;
		if(s1 > s2) return -1 * direction;	
								
		return 0;
	} 
	
	public function Draw()
	{
		sequenceButton.Draw();
	}
	
	private function IsUseFteSort():boolean
	{
		var hasFteItem:boolean = false;
		var itemList:System.Collections.Generic.List.<InventoryInfo> = MyItems.instance().GetList(MyItems.Category.TreasureItem);
		for (var i:int = 0; i < itemList.Count; i++)
		{
			var item:InventoryInfo = itemList[i];
			if (item.belongFteId > 0)
			{
				hasFteItem = true;
				break;
			}
		}
		
		return hasFteItem;
	}
	
	private function SortAccByFte(item1:InventoryInfo,item2:InventoryInfo):int
	{
		return SortByFte(item1,item2,-1);
	}
	private function SortDesByFte(item1:InventoryInfo,item2:InventoryInfo):int
	{
		return SortByFte(item1,item2,1);
	}
	
	private function SortByFte(item1:InventoryInfo,item2:InventoryInfo,direction:int):int
	{
		if(item1 == null) return direction;
		if(item2 == null) return -1 * direction;
		
		if (item1.belongFteId > 0 && item2.belongFteId < 0) return -1;
		if (item1.belongFteId > 0 && item2.belongFteId < 0) return 1;
		
		var s1:int = item1.id % 100;
		var s2:int = item2.id % 100;
		
		if(s1 < s2) return direction;
		if(s1 > s2) return -1 * direction;	
		
		s1 = item1.id / 100;
		s2 = item2.id / 100;

		if(s1 < s2) return direction;
		if(s1 > s2) return -1 * direction;	
								
		return 0;
	}
}