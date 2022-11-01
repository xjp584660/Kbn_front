
import System.Collections.Generic;
import System.Reflection;

public class GearData extends KBN.GearData
{
	//private static var sInstance = new GearData();
	
	private var armListeners:List.<UIObject> = new List.<UIObject>();
	
	private var m_gearPreMenu:String = null;
	private var m_gearNextMenu:String = null;
	private var m_armPreMenu:String = null;
	private var m_GearLastTab:int = 0; 
	private var m_ArmLastTab:int = 0; 
	private var m_BlackSmithLastTab:int = 0; 
	
	
	public static function Instance():GearData
	{
		if ( singleton == null )
			singleton = new GearData();
		return singleton;
	}
	
	public function Init()
	{
		SetKnightSequence();
		
	}
	
	//------------------------------------------------------------------
	
	public function set GearLastTab(value:int)
	{
		m_GearLastTab = value;
	}
	
	public function get GearLastTab():int
	{
		return m_GearLastTab;
	}
	
	public function set ArmLastTab(value:int)
	{
		m_ArmLastTab = value;
	}
	
	public function get ArmLastTab():int
	{
		return m_ArmLastTab;
	}
	
	public function set BlackSmithLastTab(value:int)
	{
		m_BlackSmithLastTab = value;
	}
	
	public function get BlackSmithLastTab():int
	{
		return m_BlackSmithLastTab;
	}
	
	public function SetGearPreMenu(menu:String)
	{
		m_gearPreMenu = menu;
	}
	
	public function GetGearPreMenu():String
	{
		return m_gearPreMenu;
	}
	
	public function SetGearNextMenu(menu:String)
	{
		m_gearNextMenu = menu;
	}
	
	public function GetGearNextMenu():String
	{
		return m_gearNextMenu;
	}
	
	public function SetArmPreMenu(menu:String)
	{
		m_armPreMenu = menu;
	}
	
	public function GetArmPreMenu():String
	{
		return m_armPreMenu;
	}
	//------------------------------------------------------------------
	//=======================================================================================================================================
	//Arm
	public function SetKnightSequence()
	{
		knightSequence = General.instance().GetGeneralIDs();
		if ( knightSequence == null )
			return;
		var n:int = knightSequence.length;
		var l:System.Collections.Generic.List.<int> = new System.Collections.Generic.List.<int>();
		for(var i:int = 0;i<n;i++)
		{
			if(knightSequence[i] > 0)
				l.Add(knightSequence[i]);
		}

		knightSequence = l.ToArray();
	}
	private function GetKnightSequence()
	{
		if(knightSequence == null)
			SetKnightSequence();
		return knightSequence;
	}
	
	private var armSequence:Arm[];
	private var armIndex:int;
	
	public function AddArmListener(uiobject:UIObject)
	{ 
		if(!armListeners.Contains(uiobject))
			armListeners.Add(uiobject);
	}
	
	public function RemoveArmListener(uiobject:UIObject)
	{
		armListeners.Remove(uiobject);	
	}
	public function ClearArmListener()
	{
		armListeners.Clear();
	}
	

	
	
	public function get Experence():int
	{ 
		if(CurrentArm == null) return 0;
		return CurrentArm.Experence;
	}
	
	public function set Experence(value:int)
	{
		if(CurrentArm == null) return;
		OnExperenceChanged(CurrentArm.Experence,value);
		CurrentArm.Experence = value;
	}
	
	public function set Arms(value:Arm[])
	{
		if(value == null) return; 
		var arms:Arm[] = value as Arm[];
		if(arms.length <= 0) return;
		
		armSequence = new Arm[arms.length];
		for(var i:int = 0;i< armSequence.length;i++)
		{
			armSequence[i] = arms[i];
		}
		armIndex = 0;
	}
	
	public function RemoveArm(arm:Arm)
	{
		if(arm == null) return;
		if(CurrentArm == null) return;
		if(CurrentArm == arm) return;
		if(armSequence == null) return;
		
		var a:Arm = CurrentArm;
		var index:int = Find(arm);
		if(index == -1) return;
		
		var temp:Arm[] = armSequence;
		var j:int = 0;
		armSequence = new Arm[temp.length - 1];
		for(var i:int = 0;i<temp.length;i++)
		{
			if(i != index)
				armSequence[j++] = temp[i];
		}
		index = -1;
		for(var k:int = 0;k < armSequence.length;k++)
		{
			if(a == armSequence[k])
			{
				index = k;
				break;
			}
		}
		if(index != -1)
			armIndex = index;
	}
	
	private function Find(arm:Arm):int
	{
		if(armSequence == null) return;
		for(var i:int = 0;i<armSequence.length;i++)
			if(arm == armSequence[i])
				return i;
		return -1;
	}
	
	
	
	
	public function GetArmArray():Array
	{
		if (null == armSequence) return null;
		
		var arms:Array = new Array(armSequence.length);
		for(var i:int = 0;i< armSequence.length;i++)
		{
			arms[i] = armSequence[i];
		}
		
		return arms;
	}
	
	public function set CurrentArmIndex(value:int)
	{
		if(armSequence == null) return;
		if(armIndex < 0 || armIndex >= armSequence.length) return;
		if(value < 0 || value >= armSequence.length) return;
		
		var o:Arm = armSequence[armIndex];
		var n:Arm = armSequence[value];
		armIndex = value;
		
		OnArmChanged(o,n);
	}
	
	public function get CurrentArmIndex():int
	{
		return armIndex;
	}
	
	public function get CurrentArm():Arm
	{
		if(armSequence == null) return null;
		return armSequence[armIndex];
	}	
	public function OnArmChanged(o:Arm,n:Arm)
	{
		if(n == null) return;
		var ps:Object[] = [o,n];
		Action(ps,"OnCurrentArmChanged",armListeners);
	}
	
	public function OnExperenceChanged(o:int,n:int)
	{
		var ps:Object[] = [o,n];
		Action(ps,"OnExperenceChanged",armListeners);
	}
	
	private function Action(ps:Object[],methodName:String,collection:ICollection)
	{
		var method:MethodInfo = null;	
		if(ps == null) ps = [];
		for(var obj:UIObject in collection)
		{
			if(obj == null) continue;
			var type = obj.GetType();
			method = type.GetMethod(methodName);
			if(method == null) continue;
			method.Invoke(obj,ps);
		}
		
	}
	
	public function ShiftNextArm():boolean
	{
		var pos:int = CurrentArmIndex;
		if(armSequence == null) return false;
		if(armIndex < 0 || armIndex >= armSequence.length) return false;
		CurrentArmIndex = CurrentArmIndex + 1;
		return true;
	}
	public function ShiftPreviousArm():boolean
	{
		var pos:int = CurrentArmIndex;
		if(armSequence == null) return false;
		if(armIndex < 0 || armIndex >= armSequence.length) return false;
		CurrentArmIndex = CurrentArmIndex - 1;
		return true;	
	}
	
	public function get NextArm():Arm
	{
		if(armIndex + 1 < 0 || armIndex + 1 >= armSequence.length) return null;
		return armSequence[armIndex + 1];
	}
	public function get PreviousArm():Arm
	{
		if(armIndex - 1 < 0 || armIndex - 1 >= armSequence.length) return null;
		return armSequence[armIndex - 1];		
	}
	//=======================================================================================================================================
	//knight
	private var knightSequence:int[];
	private var currentKnightIndex:int = 0;
	
	private var knightListeners:List.<UIObject> = new List.<UIObject>();
	
	
	public function AddKnightListener(uiobject:UIObject)
	{ 
		if(!knightListeners.Contains(uiobject))
			knightListeners.Add(uiobject);
	}
	
	public function RemoveKnightListener(uiobject:UIObject)
	{
		knightListeners.Remove(uiobject);	
	}
	public function ClearKnightListener()
	{
		knightListeners.Clear();
	}
	
	
	public function get CurrentKnight():Knight
	{
		
		if( currentKnightIndex < 0 || currentKnightIndex >= GetKnightSequence().Length) return null;
		return GearManager.Instance().GearKnights.GetKnight(GetKnightSequence()[currentKnightIndex]);
	}

	public function OnKnightChanged(o:Knight,n:Knight)
	{
		var method:MethodInfo = null;
		var params:Object[] = [o,n];
		
		for(var obj:UIObject in knightListeners)
		{
			var type = obj.GetType();
			method = type.GetMethod("OnCurrentKnightChanged");
			if(method == null) continue;
			method.Invoke(obj,params);
		}
		
	
	}
	
	public function SetCurrentKnightID(id:int)
	{
		var index = _Global.IndexOf(GetKnightSequence(),id); 
		if(index == -1) index = 0;
		
		SetCurrentIndex(index);
	}
	
	public function SetCurrentIndex(index:int):boolean
	{   
		if( GetKnightSequence() == null) return false;
		if( index < 0 || index >= GetKnightSequence().Length) return false;
		var o:Knight = CurrentKnight;
		currentKnightIndex = index;
		var n:Knight = CurrentKnight;
		
		OnKnightChanged(o,n);
	}
	public function set CurrentKnight(value:Knight)
	{
		if(value == null) return;
		var knight:Knight = value as Knight;
		if(knight == null) return;
		var id:int = knight.KnightID;
		var index:int = _Global.IndexOf(GetKnightSequence(),id);
		if(index < 0) return;
		SetCurrentIndex(index);
	}
	public function ShiftNextKnight():boolean
	{
		if(currentKnightIndex >= GetKnightSequence().Length) return false;
		SetCurrentIndex(currentKnightIndex + 1);
		return true;
	}
	
	public function ShiftPreviousKnight():boolean
	{
		if(currentKnightIndex < 0) return false;
		SetCurrentIndex(currentKnightIndex - 1);
		return true;
	}
	
	public function get NextKnight():Knight
	{
		var next = currentKnightIndex + 1;
		if( next < 0 || next >= GetKnightSequence().Length) return null;
		return GearManager.Instance().GearKnights.GetKnight(GetKnightSequence()[next]);
	}
	
	public function get PreviousKnight():Knight
	{
		var next = currentKnightIndex - 1;
		if( next < 0 || next >= GetKnightSequence().Length) return null;
		return GearManager.Instance().GearKnights.GetKnight(GetKnightSequence()[next]);		
	}
	
	
	
}