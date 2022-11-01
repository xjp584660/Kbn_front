using UnityEngine;
using _Global = KBN._Global;
using Datas = KBN.Datas;

public class SkillInformationItem : ListItem
{
	public ArmSkillLabel skillLabel;
	public TargetLabel[] targetLabels;
	public Label[] labels;
	public Label line;
	
	private int skill;
	public int Skill
	{	
		set {
			OnSkillChanged(skill,value);
			skill = value;
		}
	}
	private void OnSkillChanged(int o,int n)
	{
		if(n <= 0) return;
		
		skillLabel.Init();
		skillLabel.SkillID = n;
		
		int[] targets = GearManager.Instance().GetTargets(n);
		if(targets == null) return;
		int num = targetLabels.Length;
		for(int j = 0; j < num; j++)
		{
			if(targets.Length <= j) 
			{
				targetLabels[j].SetVisible(false);
				labels[j].SetVisible(false);
			}
			else
			{
				targetLabels[j].SetVisible(true);
				labels[j].SetVisible(true);
				
				targetLabels[j].DrawName = true;
				targetLabels[j].ID = targets[j];
				string str = GearManager.Instance().GetIconSkill(n);
				if(str == "Attack")
				{
					str = "Gear.EquipmentAttributeAttack";
				}
				else if(str == "Life")
				{
					str = "Gear.EquipmentAttributeLife";
				}
				else if(str == "Speed")
				{
					str = "Gear.EquipmentAttributeSpeed";
				}
				else if(str == "Load")
				{
					str = "Gear.EquipmentAttributeLoad";
				}
				else if(str == "TroopLimit")
				{
					str = "Gear.EquipmentAttributeTroopLimit";
				}
				
				labels[j].txt = Datas.getArString(str);
			}
		}		
	}
	
	
	public override void Init()
	{	 
		base.Init();
		line.Init(); 
		for(int i = 0;i<targetLabels.Length;i++)
			targetLabels[i].Init();
		line.setBackground("between line_list_small",TextureType.DECORATION);
	}
	
	public override int Draw()
	{
		GUI.BeginGroup(rect);
		skillLabel.Draw();
		for(int i = 0;i<targetLabels.Length;i++)
		{
			if(targetLabels[i] == null) continue;
			targetLabels[i].Draw();
		}
		for(int j = 0;j<labels.Length;j++)
		{
			if(labels[j] == null) continue;
			labels[j].Draw();
		} 
		line.Draw();
		GUI.EndGroup();

		return 0;
	}	
	
	public override void OnPopOver()
	{ 
		
		skillLabel.OnPopOver();
		for(int i = 0;i<this.targetLabels.Length;i++)
		{
			targetLabels[i].OnPopOver();
			labels[i].OnPopOver();
		}
		
		UIObject.TryDestroy(this);
	}
	
	public override void SetRowData(object data)
	{
		int id = _Global.INT32(data);
		
		if(id > 0)
		{
			Skill = id;
		}
	}
	
}
