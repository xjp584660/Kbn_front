


public class GearArmTip
{
	public var tip:GearInformationTip; 
	
	private var isInFinish:boolean = false;
	public function Init()
	{
		tip.Init();
		tip.SetVisible(false);
		tip.OnLineInFinish = OnInFinish;
		tip.OnLineOutFinish = OnOutFinish;
		
		isInFinish = false;
	}
	
	
	public function IsShowTip():boolean
	{
		return tip.isVisible();
	}
	
	public function ShowTip(arm:Arm)
	{
		tip.Show();
		tip.SetVisible(true);
		tip.TheArm = arm;
		
		isInFinish = false;
	}
	
	public function SetIsShowCompare(show:boolean)
	{
		tip.SetIsShowCompare(show);
	}
	
	public function CloseTip()
	{
		tip.Hide();
		
		isInFinish = false;
	}
	
	
	public function IsInFinish():boolean
	{
		return isInFinish;
	}
	
	protected function OnInFinish()
	{
		isInFinish = true;
	}
	
	protected function OnOutFinish()
	{
		tip.SetVisible(false);
		tip.DestroyResource();
	}
	
	
	public function Draw()
	{
		tip.Draw();
	}
	
	public function OnPopOver()
	{
		tip.OnPopOver();
	}

	public function get IsShowRingBase()
	{
		return tip.IsShowRingBase;
	}
	
	
	
}