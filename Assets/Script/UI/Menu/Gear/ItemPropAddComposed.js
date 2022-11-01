#pragma strict

/****************************************************
* A composed UIObject which include equipment item's
* additive properies.
****************************************************/
class ItemPropAddComposed extends UIObject
{
	public var itemPropAdditives:Label[]; 
	
	//--------------------------------------------
	private var data:Arm;
	
	//--------------------------------------------
	public function Awake()
	{
		super.Awake();
		data = null;
	}
	
	public override function Init()
	{
		super.Init();
	}
	
	public override function Draw()
	{
		if (!super.visible) return;
		
		GUI.BeginGroup(super.rect); 
		
		if (null != itemPropAdditives) 
		{
			for (var i:int = 0; i < itemPropAdditives.Length; i++)
			{
				itemPropAdditives[i].Draw();
			}
		}
		
		GUI.EndGroup();
	}
	
	public function set Data(value:Arm)
	{
		data = value;
		if (null == data)
			NullAdditiveData();
		else
			SetAdditiveData(data);
	}
	
	public function get Data():Arm
	{
		return data;
	}
	
	public function SetVisible(visible:boolean)
	{
		super.visible = visible;
	}
	
	public function SetPosition(pos:Vector2)
	{
		super.rect.x = pos.x;
		super.rect.y = pos.y;
	}
	
	private function NullAdditiveData()
	{
		for (var i:int = 0; i < itemPropAdditives.Length; i++)
		{
			GearSysHelpUtils.SetKnightProp(itemPropAdditives[i], ItemPropertyKind.Null, 0);
		}
	}
	
	private function SetAdditiveData(data:Arm)
	{  
		//for (var key:int in data.ArmSkills.Keys)
		//for (var j:int = 0; j < data.ArmSkills.Values.Count; j++)
		
		var index:int = 0;
		for (var keyVal:KeyValuePair.<int, ArmSkill> in data.ArmSkills)
		{ 
			if (index >= itemPropAdditives.Length)
				break;
			
			GearSysHelpUtils.SetKnightProp(itemPropAdditives[index++], ItemPropertyKind.Life, 0);
		} 
	}
}