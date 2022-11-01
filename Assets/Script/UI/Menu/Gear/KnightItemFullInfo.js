import System.Collections;
import System.Collections.Generic;

class KnightItemFullInfo extends UIObject
{ 
	public var backgroundBtn:Button;
	public var backgroundLabel:Label;
	
	public var itemIcon:KnightItemIcon;
	public var itemName:Label;
	
	// Base property
	public var itemPropLife:Label;
	public var itemPropAttack:Label;
	public var itemPropTroopsLimit:Label;
	
	// Composed UIObject
	public var skillProps:ItemSkillProperty[];
	
	//------------------------------------------------------------
	private var hasItemIconInited:boolean = false;
	private var data:Arm = null; 
	
	public override function Init()
	{ 
		super.Init();
		
		InitBackground();
		RegisterGUIEvents();
		
		InitVariables(); 
	}
	
	private function InitBackground()
	{ 
		backgroundBtn.rect.width = super.rect.width;
		backgroundBtn.rect.height = super.rect.height;
		
		backgroundLabel.rect.width = super.rect.width;
		backgroundLabel.rect.height = super.rect.height;
	}
	
	private function InitVariables()
	{ 
		hasItemIconInited = false;  
	}
	
	private function RegisterGUIEvents()
	{
		backgroundBtn.OnClick = OnClickBackgroundBtn;
	}
	
	//------------------------------------------------
	public function Draw()
	{
		if (!super.visible)
			return;
			
		GUI.BeginGroup(super.rect); 
		
		backgroundBtn.Draw();
		backgroundLabel.Draw();
		
		itemIcon.Draw(); 
		itemName.Draw(); 
		
		itemPropLife.Draw();
		itemPropAttack.Draw();
		itemPropTroopsLimit.Draw(); 
		
		// Arm skill 
		if (null != skillProps)
		{
			for (var i:int = 0; i < skillProps.Length; i++)
			{
				skillProps[i].Draw();
			}
		}
		
		GUI.EndGroup();
	}
	
	public override function OnClear()
	{
		super.OnClear();
	}
	
	public function set Data(value:Object)
	{	
		data = value as Arm;
		if (null == data)
			NullEquipItemData();
		else
			SetEquipItemData(data);
	}
	
	public function get Data():Object
	{
		return data;
	} 
	
	private function NullEquipItemData()
	{
		itemIcon.Data = null;
		itemName.txt = "";
		
		ShowBaseData(false);
		ShowSkillsData(false);
	}
	
	private function SetEquipItemData(data:Arm)
	{
		// Icon
		if (!hasItemIconInited)
		{
			itemIcon.Init();
			hasItemIconInited = true;
		}
		itemIcon.Data = data;
		
		// Name
		if(String.IsNullOrEmpty(data.RemarkName))
		{
		   itemName.txt = Datas.getArString("gearName.g" + data.GDSID.ToString());
	    }else{
		   itemName.txt = data.RemarkName;
		   itemName.SetNormalTxtColor(FontColor.New_KnightName_Blue);
	    }
		
		// Property1 // Property2 // Property3
		// According GDS to calculate the necessary value
		GearSysHelpUtils.SetItemProp(itemPropLife, ItemPropertyKind.Life, data.HP);
		GearSysHelpUtils.SetItemProp(itemPropAttack, ItemPropertyKind.Attack, data.Attack);
		GearSysHelpUtils.SetItemProp(itemPropTroopsLimit, ItemPropertyKind.TroopsLimit, data.TroopLimit);
		
		ShowSkillsData(true);
		SetSkillData(data);
	}
	
	private function SetSkillData(data:Arm)
	{ 
		if (null == skillProps)
			return;
		
		// Null it first
		var i:int = 0;
		for (i = 0; i < skillProps.Length; i++)
		{
			skillProps[i].Data = null;
		}
			
		if (null != data)
		{
			i = 0;
			for (var keyVal:KeyValuePair.<int, ArmSkill> in data.ArmSkills)
			{ 
				if (i >= skillProps.Length)
					break;
					
				skillProps[i].Data = keyVal.Value;
				i++;
			}
		}
	}
	
	private function ShowBaseData(show:boolean)
	{
		itemPropLife.SetVisible(show); 
		itemPropAttack.SetVisible(show);
		itemPropTroopsLimit.SetVisible(show);
	}
	
	private function ShowSkillsData(show:boolean)
	{ 
		if (null != skillProps)
		{
			for (var i:int = 0; i < skillProps.Length; i++)
			{
				skillProps[i].SetVisible(show);
			}
		}
	}
	
	private function OnClickBackgroundBtn()
	{
		// Hide self
		super.visible = false;
	}
}