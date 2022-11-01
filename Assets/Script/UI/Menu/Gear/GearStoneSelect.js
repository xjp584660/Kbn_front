

public class GearStoneSelect
{
	
	private var mCurrentType:int = 0;
	private var mArcIndexToCategory:int[];
	
	public var arcSelectControl:ArcSelectControl;
	public var stonesView:ScrollList;
	public var sortFunction:Comparison.<InventoryInfo>;
	public var OnSelect:Function;
	private var willToTop:boolean;
	private var disableInput:boolean;
	
	public function Init()
	{
		InitArcIndexToCategory();
		InitArcControl();
		willToTop = false;
	}
	
	private function InitArcIndexToCategory()
	{
		var n :int = 5;
		mArcIndexToCategory = new int[n];
		mArcIndexToCategory[3] = Constant.StoneType.Red;
		mArcIndexToCategory[1] = Constant.StoneType.Blue;
		mArcIndexToCategory[2] = Constant.StoneType.Green;
		mArcIndexToCategory[0] = Constant.StoneType.Grey;
		mArcIndexToCategory[4] = Constant.StoneType.All;
	}
	
	public function UpdateCurrent()
	{
		var stones:System.Collections.Generic.List.<InventoryInfo> = GearManager.Instance().GetStonesByType(mCurrentType);
		
		if(stonesView == null) return;
		if(sortFunction != null)
			stones.Sort(sortFunction);
		var minus:int = 0;
		if(stones.Count > 4)
			minus = stones.Count +1;
		else
			minus = 5;
		
		for(var i:int = stones.Count;i<minus;i++)
		{
			var inf:InventoryInfo = new InventoryInfo();
			inf.id = Constant.Gear.InValidStoneID;
			stones.Add(inf);
		}
		if(willToTop)
		{
			stonesView.ResetPos();
			willToTop = false;
		}
		stonesView.SetData(stones);
		stonesView.Update();
	}
	public function get CurrentType():int
	{
		return mCurrentType;
	}
	
	public function set Reset(value:boolean)
	{
		willToTop = value;
	}
	
	public function SetStoneType(type:int)
	{
		mCurrentType = type;
		for(var i:int = 0;i<mArcIndexToCategory.length;i++)
		{
			if(	mArcIndexToCategory[i] == type)
			{
				arcSelectControl.SetCurrentItem(i);
				break;
			}
		}
		
		//UpdateCurrent();
	} 
	
	
	private function OnTouchEnd(index:int)
	{
		var type:int = mArcIndexToCategory[index];
		if(type == mCurrentType) return;
		this.SetStoneType(type);
		if(OnSelect != null)
			OnSelect(index);

	}
	
	private function InitArcControl()
	{
		arcSelectControl.Init();
		arcSelectControl.OnTouchEnd = OnTouchEnd;
		arcSelectControl.SPT = TextureMgr.instance().ItemSpt();
		arcSelectControl.UseTile = true;
	}
	public function Update()
	{
		arcSelectControl.Update();
	}
	public function Draw()
	{
		arcSelectControl.DisableInput = NewFteMgr.Instance().IsDoingFte || disableInput;
		arcSelectControl.Draw();
	}
	
	public function set DisableInput(value:boolean)
	{
		disableInput = value;
	}
	public function OnPopOver()
	{
		stonesView = null;
		arcSelectControl.OnPopOver();
		KBN.GearItems.Instance().DestroyBackStoneItem();
	}
	public function Stop()
	{
		arcSelectControl.Stop();
	}
	
	
	
}