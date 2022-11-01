
using UnityEngine;

public class ArmSkillLabel : UIObject
{
	private ArmSkill skill;
	
	public Label level;
	public Label target;
	public Label back;
	
	
	
	public override void Init()
	{
		base.Init();
		
		level.rect = new Rect(rect.width * 0.04348f,rect.height * 0.04348f,rect.width * 0.913043f,rect.height * 0.913043f);
		back.rect = new Rect(rect.width * 0.19565f,rect.height * 0.19565f,rect.width * 0.60870f,rect.height * 0.60870f);
		target.rect = new Rect(rect.width * 0.69565f,rect.height * 0.60870f,rect.width * 0.33043f,rect.height * 0.33043f);
		Alpha = 1.0f;
		isActive = true;
		backActiveName = "";
		levelActiveName = "";
		targetActiveName = "";
	
		backUnActiveName = "";
		levelUnActiveName = "";
		targetUnActiveName = "";	
		
	}
	private string backActiveName;
	private string levelActiveName;
	private string targetActiveName;
	
	private string backUnActiveName;
	private string levelUnActiveName;
	private string targetUnActiveName;	
	
	public ArmSkill Skill
	{
		set
		{
			skill = value;
		
			if(back != null)
			{
	//			back.mystyle.hover.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillImageName(skill,true),TextureType.GEAR);
	//			back.mystyle.focused.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillImageName(skill,false),TextureType.GEAR);		
				backActiveName = GearManager.Instance().GetSkillImageName(skill,true);
				backUnActiveName = GearManager.Instance().GetSkillImageName(skill,false);
			}
			if(level != null)
			{
	//			level.mystyle.hover.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillLevelImage(skill,true),TextureType.GEAR);
	//			level.mystyle.focused.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillLevelImage(skill,false),TextureType.GEAR);		
				levelActiveName = GearManager.Instance().GetSkillLevelImage(skill,true);
				levelUnActiveName = GearManager.Instance().GetSkillLevelImage(skill,false);
			}
			if(target != null)
			{
	//			target.mystyle.hover.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillTargetImage(skill,true),TextureType.GEAR);
	//			target.mystyle.focused.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillTargetImage(skill,false),TextureType.GEAR);		
				
				targetActiveName = GearManager.Instance().GetSkillTargetImage(skill,true);
				targetUnActiveName = GearManager.Instance().GetSkillTargetImage(skill,false);
			}
			
			back.SetVisible(Constant.Gear.NullSkillID != skill.ID);
			target.SetVisible(Constant.Gear.NullSkillID != skill.ID);
			if(Constant.Gear.NullSkillID == skill.ID)
			{
				levelActiveName = "Mysterious_property";
				levelUnActiveName = "Mysterious_property";			
			}
				
			Active = isActive;
		}
	}
	public int SkillID
	{
		set
		{
			int id = value;
			
			
			if(back != null)
			{
	//			back.mystyle.hover.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillImageName(id,true),TextureType.GEAR);
	//			back.mystyle.focused.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillImageName(id,false),TextureType.GEAR);	
				
				backActiveName = GearManager.Instance().GetSkillImageName(id,true);
				backUnActiveName = GearManager.Instance().GetSkillImageName(id,false);
						
			}
			if(level != null)
			{
	//			level.mystyle.hover.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillLevelImage(id,true),TextureType.GEAR);
	//			level.mystyle.focused.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillLevelImage(id,false),TextureType.GEAR);		
				levelActiveName = GearManager.Instance().GetSkillLevelImage(id,true);
				levelUnActiveName = GearManager.Instance().GetSkillLevelImage(id,false);
				
			}
			if(target != null)
			{
	//			target.mystyle.hover.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillTargetImage(id,true),TextureType.GEAR);
	//			target.mystyle.focused.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillTargetImage(id,false),TextureType.GEAR);	

				targetActiveName = GearManager.Instance().GetSkillTargetImage(id,true);
				targetUnActiveName = GearManager.Instance().GetSkillTargetImage(id,false);
			
			}
	/**/		
			Active = isActive;
		}
	}
	
	private bool isActive;
	public bool Active
	{
		get
		{
			return isActive;
		}

		set
		{
			isActive = value;
			SetActive(back,value,backActiveName,backUnActiveName);
			SetActive(level,value,levelActiveName,levelUnActiveName);
			SetActive(target,value,targetActiveName,targetUnActiveName);
		}
	}

	public float Alpha
	{
		set
		{
			if(value == 1.0f) 
			{
				back.alphaEnable = false;
				level.alphaEnable = false;
				target.alphaEnable = false;
			}
			else
			{
				back.alphaEnable = true;
				level.alphaEnable = true;
				target.alphaEnable = true;			
			}
			back.alpha = value;
			level.alpha = value;
			target.alpha = value;
		}
	}
	
	
	private void SetActive(Label label,bool active,string activeName,string UnActiveName)
	{
		if(label == null) return;
		if(activeName == null) activeName = "";
		if(UnActiveName == null) UnActiveName = "";
		if(active)
			label = GearManager.Instance().SetImage(label,activeName);
		else
			label = GearManager.Instance().SetImage(label,UnActiveName);
	}
	
	
	public override int Draw()
	{
		if(!visible) return -1;

		if (null != background) {
			GUI.DrawTexture(rect, background);
		}

		base.Draw();
		GUI.BeginGroup(rect);
		level.Draw();
		target.Draw();
		back.Draw();
		GUI.EndGroup();
		return 0;
	}
	
	public override void OnPopOver() 
	{
		this.level.OnPopOver();
		this.target.OnPopOver();
		this.back.OnPopOver();
		UIObject.TryDestroy(this);
	}
	
}
