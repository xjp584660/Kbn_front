


public class GearArmSort
{

	public var sequenceButton:Button; 
	
	private var mCurrentSortFunction:Comparison.<Arm> = SortAcc; 
	private var mIsAcc = false;

	
	public var OnSortChanged:Function;
	
	public function Init()
	{
		sequenceButton.Init();
		sequenceButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("Sequence_button_high",TextureType.BUTTON);
		sequenceButton.mystyle.active.background = TextureMgr.instance().LoadTexture("Sequence_button_high_down",TextureType.BUTTON);
		//sequenceButton.OnClick = OnSequenceClick;
		sequenceButton.SetZOrder(2000);
		sequenceButton.SetName("seq");
		GestureManager.Instance().RegistTouchable(sequenceButton);
		mCurrentSortFunction = SortAcc;
		mIsAcc = true;
	}
	
	public function RemoveTouchable()
	{
		GestureManager.Instance().RemoveTouchable(sequenceButton);
	}
	
	
	public function get SortFunction():Comparison.<Arm>
	{
		if(mIsAcc)
		{
			if (IsUseFteSort())
				mCurrentSortFunction =  SortAccByFte; 
			else
			{
				mCurrentSortFunction =  SortAcc; 
			}
		} 
		else 
		{ 
			if (IsUseFteSort())
				mCurrentSortFunction =  SortDesByFte; 
			else
			{
				mCurrentSortFunction =  SortDes; 
			}
		}
			
		return mCurrentSortFunction;
	}
	

	
	public function OnSequenceClick()
	{
		
		mIsAcc = !mIsAcc;
		if(mIsAcc)
		{
			sequenceButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("Sequence_button_high",TextureType.BUTTON);
			sequenceButton.mystyle.active.background = TextureMgr.instance().LoadTexture("Sequence_button_high_down",TextureType.BUTTON);
			mCurrentSortFunction =  SortAcc; 
		} 
		else 
		{ 
			sequenceButton.mystyle.normal.background = TextureMgr.instance().LoadTexture("Sequence_button_Low",TextureType.BUTTON);
			sequenceButton.mystyle.active.background = TextureMgr.instance().LoadTexture("Sequence_button_Low_down",TextureType.BUTTON);
			mCurrentSortFunction =  SortDes; 
			
		} 
		if(OnSortChanged != null)
			OnSortChanged();
	}
	
/*	
	private function SortAcc(item1:GearScrollViewItem,item2:GearScrollViewItem):int
	{
		return Sort(item1,item2,-1);
	}
	private function SortDes(item1:GearScrollViewItem,item2:GearScrollViewItem):int
	{
		return Sort(item1,item2,1);
	}
	
	private function Sort(item1:GearScrollViewItem,item2:GearScrollViewItem,direction:int):int
	{
		if(item1 == null) return direction;
		if(item2 == null) return -1 * direction;
		var arm1:Arm = item1.TheArm;
		var arm2:Arm = item2.TheArm;
		if(arm1 == null) return direction;
		if(arm2 == null) return -1 * direction;
		
		if(arm1.StarLevel < arm2.StarLevel) return direction;
		if(arm1.StarLevel > arm2.StarLevel) return -1 * direction;
		
		var total1:int = arm1.Attack + arm1.HP + arm1.TroopLimit;
		var total2:int = arm2.Attack + arm2.HP + arm2.TroopLimit;
		
		if(total1 < total2) return direction;
		if(total1 > total2) return -1 * direction;
		return 0;
	} 
	*/
	private function SortAcc(item1:Arm,item2:Arm):int
	{
		return Sort(item1,item2,-1);
	}
	private function SortDes(item1:Arm,item2:Arm):int
	{
		return Sort(item1,item2,1);
	}
	
	private function Sort(arm1:Arm,arm2:Arm,direction:int):int
	{
		if(arm1 == null) return direction;
		if(arm2 == null) return -1 * direction;
		
		if(arm1.StarLevel < arm2.StarLevel) return direction;
		if(arm1.StarLevel > arm2.StarLevel) return -1 * direction;
		

		var total1:int = arm1.Rare;
		var total2:int = arm2.Rare;

		
		if(total1 < total2) return direction;
		if(total1 > total2) return -1 * direction;
		
		total1 = 0;
		total2 = 0;
		total1 = arm1.SkillsRare;
		total2 = arm2.SkillsRare;

		if(total1 < total2) return direction;
		if(total1 > total2) return -1 * direction;
		
				
		var gdsid1:int = arm1.GDSID;
		var gdsid2:int = arm2.GDSID;
		
		if(gdsid1 < gdsid2) return direction;
		if(gdsid1 > gdsid2) return -1 * direction;
		
		return 0;
	} 
	
	
	public function Draw()
	{
		sequenceButton.Draw();
	}
	
	
	private function IsUseFteSort():boolean
	{
		var hasFteArm:boolean = false;
		var armList:List.<Arm> = GearManager.Instance().GearWeaponry.GetArms();
		for (var i:int = 0; i < armList.Count; i++)
		{
			if (armList[i].belongFteId > 0)
			{
				hasFteArm = true;
				break;
			}
		}
		
		return hasFteArm;
	}
	
	private function SortAccByFte(item1:Arm,item2:Arm):int
	{
		return SortByFte(item1,item2,-1);
	}
	private function SortDesByFte(item1:Arm,item2:Arm):int
	{
		return SortByFte(item1,item2,1);
	}
	
	private function SortByFte(arm1:Arm, arm2:Arm, direction:int):int
	{
		// ascending order or descending order
		if(arm1 == null) return direction;
		if(arm2 == null) return -1 * direction;
		
		if (arm1.belongFteId > 0 && arm2.belongFteId < 0) return -1;
		if (arm2.belongFteId > 0 && arm1.belongFteId < 0) return 1;
		// Both fte arm, sort it as 
		
		if(arm1.StarLevel < arm2.StarLevel) return direction;
		if(arm1.StarLevel > arm2.StarLevel) return -1 * direction;
		
		var total1:int = GearManager.Instance().GetTotalArmRare(arm1);
		var total2:int = GearManager.Instance().GetTotalArmRare(arm2);
		
		if(total1 < total2) return direction;
		if(total1 > total2) return -1 * direction;
		
		var gdsid1:int = arm1.GDSID;
		var gdsid2:int = arm2.GDSID;
		
		if(gdsid1 < gdsid2) return direction;
		if(gdsid1 > gdsid2) return -1 * direction;
		
		return 0;
	}
	public function OnPopOver()
	{
		sequenceButton = null;
	}
	
}