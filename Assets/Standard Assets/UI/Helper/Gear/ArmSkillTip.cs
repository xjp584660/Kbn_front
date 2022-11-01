using UnityEngine;
using System;
using System.Collections.Generic;


public class ArmSkillTip : TipBar
{
	private List<UIObject> created;
	
	public ArmSkillLabel skillLabel;
	public TargetLabel targetLabel;
	public Label label;

	public float imageLeft = 30.0f;
	public float targetLeft = 160.0f;
	public float actLeft = 435.0f;
	public float rateLeft = 550.0f;

	private ArmSkill skill;
	public ArmSkill Skill
	{
		set {
			OnSkillChanged(skill,value);
			skill = value;
		}
	}
	
	private Arm arm;
	public Arm TheArm
	{
		set {
			arm = value;
		}
	}
	
	private int num;
	private void OnSkillChanged(ArmSkill o,ArmSkill n)
	{
		if(o == n) return;
		int[] targets = GearManager.Instance().GetTargets(n);
		num = targets.Length;
		ArmSkillLabel image;
		Label back;
		Rect r = CreateRect();
		back = GameObject.Instantiate(label) as Label;
		back.rect = new Rect(0,0,r.width,r.height);
		//back = GearManager.Instance().SetImage(back,"black_Translucent");
		back.mystyle.normal.background = TextureMgr.instance().LoadTexture("black_Translucent",TextureType.DECORATION);
		image = GameObject.Instantiate(skillLabel) as ArmSkillLabel;
		
		created.Add(back);
		created.Add(image);
		
		back.mystyle.border.left = 8;
		back.mystyle.border.right = 8;
		back.mystyle.border.top = 8;
		back.mystyle.border.bottom = 8;

		
		image.Skill = n;
		image.Active = true;
		image.rect =  new Rect(imageLeft,30,115,115);
		image.Init();
		
		for(int j = 0; j < num; j++)
		{
			TargetLabel tl = GameObject.Instantiate(targetLabel) as TargetLabel;
			created.Add(tl);
			tl.rect = new Rect(targetLeft,50 + j * 40,115,38);
			tl.Init(); 
			tl.DrawName = true;
			tl.ID = targets[j];
			
			Label act = GameObject.Instantiate(label) as Label;
			created.Add(act);
			act.mystyle.normal.background = null; 
			act.mystyle.normal.textColor = new Color(1.0f,1.0f,1.0f,1.0f);
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
			else if(str == "Atkdebuff")
			{
				str = "Gear.EquipmentAttributeDeAttack";
			}
			else if(str == "Lifdebuff")
			{
				str = "Gear.EquipmentAttributeDeLife";
			}
		
			act.txt = KBN.Datas.getArString(str);
			act.rect = new Rect(425.0f,50 + j * 40,60,40);
			act.mystyle.alignment = TextAnchor.MiddleLeft;
			
			Label rate = GameObject.Instantiate(label) as Label;
			created.Add(rate);
			rate.mystyle.normal.background = null;
			rate.mystyle.normal.textColor = new Color(1.0f,1.0f,1.0f,1.0f);
			if(arm != null)
				rate.txt = GearManager.Instance().GetSkillData(arm,n,n.Stone);
			rate.rect = new Rect(550.0f,50 + j * 40,30,40);	
			rate.mystyle.alignment = TextAnchor.MiddleLeft;	
		}
		
		
	}
	
	protected override Rect CreateRect()
	{
		return new Rect(0,330,640,300);
	}
	
	
	public override void Init()
	{
		base.Init();
		created = new List<UIObject>();
		visible = false;
		
		OnLineOutFinish = OnOutFinish;
		
	}
	public void Draw()
	{ 
		if(!visible) return; 
		if(created == null) return;
		GUI.BeginGroup(rect);
		
		for(int i = 0;i<created.Count;i++)
		{
			if(created[i] != null)
				created[i].Draw();
		}
		GUI.EndGroup();
	} 
	
	public override void Show()
	{
		base.Show();
		visible = true;
	} 
	public override void Hide()
	{
		base.Hide();
	}
	protected override void OnOutFinish()
	{
		visible = false;
		DestroyResource();
	}
				
	private void DestroyResource()
	{	
		if(created == null) return;
		skill = null;
		for(int i = 0;i<created.Count;i++)
		{
			if(created[i] != null)
			{
				created[i].OnPopOver();
				UIObject.TryDestroy(created[i]);
			}
		}
		created.Clear();
	}
	public override void OnPopOver()
	{
		base.OnPopOver();

		DestroyResource();
	}
	
}
