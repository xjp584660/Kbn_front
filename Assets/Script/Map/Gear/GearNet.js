
import System.Collections.Generic;

public class GearNet
{
	private static var sInstance:GearNet = new GearNet();
	private var knights:Queue.<Knight> = new Queue.<Knight>();
	private var time:double = 0.0f;
	private var mounts:Queue.<Arm> = new Queue.<Arm>();
	
	public static function Instance()
	{
		return sInstance;
	}
		
	public function Update()
	{
		time += Time.deltaTime;
		if(time >= Constant.Gear.NetInterval)
		{
			time = 0.0f;
			if(knights != null && knights.Count > 0)
			{
				var knight:Knight = knights.Dequeue();
				if(knight != null)
				{
					KnightGearSave(knight);
				}
			}
			if(mounts != null && mounts.Count > 0)
			{
				var arm:Arm = mounts.Dequeue();
				if(arm != null)
				{
					knightGearMount(arm);
				}
				
			}
		}
	}
	
	public function EnKnightQueue(knight:Knight)
	{
		if(!knights.Contains(knight))
			knights.Enqueue(knight);
	}
	public function EnMountQueue(arm:Arm)
	{
		if(!mounts.Contains(arm))
			mounts.Enqueue(arm);
	}
	public function knightGearList()
	{
		GearManager.Instance().GearWeaponry.Clear();
		UnityNet.knightGearList(getArmsListOK);
	}
	
	private function getArmsListOK(seed:HashObject)
	{
		
		GearManager.Instance().GearWeaponry.Parse(seed);
		GearReport.Instance().Init();
	}
	
	
	public function KnightGearSave(knight:Knight)
	{
		UnityNet.KnightGearSave(knight,gearKnightSave,gearKnightUnSave);
	}
	private function gearKnightSave(seed:HashObject)
	{
		GearManager.Instance().GearWeaponry.SynSeed();
	}
	private function gearKnightUnSave(msg:String, errorCode:String)
	{
		ErrorMgr.instance().PushError("",Datas.getArString("Error.err_3121"),false,Datas.getArString("Common.OK"),ClickError);
	}
	private function ClickError()
	{
		GearManager.Instance().GearWeaponry.Parse();
		if(OnAfterKnightError != null)
			OnAfterKnightError();
	}
	
	public function knightGearMount(arm:Arm)
	{
		if(arm == null) return;
		if(arm.Skills == null) return;
		var uniqId:int = arm.PlayerID;
		var ids:int[] = new int[arm.Skills.Count];
		
		for(var i:int = 0;i<arm.Skills.Count;i++)
		{
			ids[i] = arm.Skills[i].Stone;
		}
		
		knightGearMount(uniqId,ids);
	}
	
	private function knightGearMount(uniqId:int,ids:int[])
	{
		UnityNet.knightGearMount(uniqId,ids,MountOK, MountError);
	}
	
	private function MountOK(seed:HashObject)
	{	
		GearManager.Instance().GearWeaponry.SynSeed();
	}
	
	private function MountError(msg:String, errorCode:String)
	{	
		GearManager.Instance().GearWeaponry.Parse();
		ErrorMgr.instance().PushError("",Datas.getArString(String.Format("Error.err_{0}", errorCode)));
	}
	
	public function knightGearUnlockSkill(uniqId:int,ids:int[])
	{
		UnityNet.knightGearUnlockSkill(uniqId,ids,UnlockOK,OnUnLockNotOK);
	}
	private function UnlockOK(seed:HashObject)
	{
		if(seed["uniqId"] == null) return;
		if(seed["currentExp"] == null) return;
		
		var id:int = _Global.INT32(seed["uniqId"]);
		var arm:Arm = GearManager.Instance().GearWeaponry.GetArm(id);
		if(arm == null) return; 
		var exp:double = _Global.INT32(seed["currentExp"]);
		if(OnUnLockOK != null) 
			OnUnLockOK(id,arm.Experence,exp);
		arm.StarLevel = _Global.INT32(seed["currentLevel"]);
		arm.Experence = _Global.INT32(seed["currentExp"]);
		arm.ToExperence = _Global.INT32(seed["toExp"]);
		arm.SynSeed();
	}
	public var OnUnLockOK:Function;
	public var OnUnLockNotOK:Function;
	
	public var OnAfterKnightError:Function;
}