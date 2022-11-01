
using System.Collections.Generic;
using UnityEngine;
using KBN;

public class StonePanel : UIObject, ITouchable
{
	public Label back;
	public ArmSkillButton skillButton;
	public ArmSkillLabel skillback;
	
	public Label percentage;
	//public Label showName;
			
	public Label addition;
	public Label benifit;
	public TargetLabel target;
	public Label circle;
	
	
	private List<TargetLabel> targetlabels;
	private bool isActive;
	private ArmSkill skill;
	private OcupiedTouchable ocupiedTouchable;
	private bool isnull;
	
	public ArmSkill Skill
	{
		get
		{
			return skill;
		}
		set
		{
			skill = value;
			skillButton.Skill = value;
			skillButton.IsNull = false;
			skillButton.IsDefault = false;
			skillback.Skill = value;
			DestroyResource();
			if(skill.ID == Constant.Gear.NullSkillID)
			{
				skillButton.IsDefault = true;
				if(mountItem != null)
				{
					mountItem.OnPopOver();
					mountItem = null;
				}
				percentage.txt = "";
				Active = false;
				SkillActive = false;
				isnull = true;
				return;
			}
			isnull = false;
	//		back.mystyle.hover.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillColorImageName(skill,true),TextureType.GEAR);		
	//		back.mystyle.focused.background = TextureMgr.instance().LoadTexture(GearManager.Instance().GetSkillColorImageName(skill,false),TextureType.GEAR);		
			
			percentage.txt = GearManager.Instance().GetSkillData(GearData.singleton.CurrentArm,skill);
			addition.txt = GearManager.Instance().GetSkillData(GearData.singleton.CurrentArm,skill);
			//showName.txt = GearManager.Instance().GetSkillShowName(skill);

			CreateTargets(skill);
			if(mountItem != null)
			{
				mountItem.OnPopOver();
				mountItem = null;
			}
			
			Mount(skill.TheArm,skill.Stone,1);
			SkillActive = isActive;
			Active = skillback.Active;
			//GearManager.Instance().SetAdditionText(this);
		}
	}
	
	private void CreateTargets(ArmSkill skill)
	{
		if(skill == null) return;
		int[] targets = GearManager.Instance().GetTargets(skill);
		if(targets == null) return;
		var num = targets.Length;
		
		targetlabels.Clear();
		for(int j = 0; j < num; j++)
		{
			TargetLabel t = (TargetLabel)GameObject.Instantiate(target); 
			targetlabels.Add(t);
			t.rect = new Rect(benifit.rect.x,benifit.rect.y + benifit.rect.height + j * 32,115,38);
			t.Init(); 
			t.DrawName = false;
			t.ID = targets[j];
		}
	}
	
	public bool SkillActive
	{
		get
		{
			return isActive;
		}
		set
		{
			OnSkillActiveChanged(isActive,value);
			isActive = value;
			GearManager.Instance().SetAdditionText(this);
		}
	}

	public bool Active
	{
		get
		{
			if(skillback == null) 
				return false;
			return skillback.Active;
		}

		set
		{
			if(skillback == null) 
				return;
			skillback.Active = value;
			GearManager.Instance().SetAdditionText(this);
		}
	}
	
	private void OnSkillActiveChanged(bool wasActive,bool isActive)
	{
		if (isActive) {
			string activeName = GearManager.Instance ().GetSkillColorImageName (skill, true);
			back.mystyle.normal.background = TextureMgr.instance().LoadTexture(activeName, TextureType.BACKGROUND);
			//back = GearManager.Instance ().SetImage (back, GearManager.Instance ().GetSkillColorImageName (skill, true));	
		} else {
			string unActiveName = GearManager.Instance ().GetSkillColorImageName (skill, false);
			back.mystyle.normal.background = TextureMgr.instance().LoadTexture(unActiveName, TextureType.BACKGROUND);
			//back = GearManager.Instance ().SetImage (back, GearManager.Instance ().GetSkillColorImageName (skill, false));
		}
	}
	
	public override void Init()
	{
		
		targetlabels = new List<TargetLabel>();
		skillButton.Init();
		back.Init();
		percentage.Init();

		skillback.Init();
		skillback.Active = false;
		isActive = false;
		addition.Init();
		benifit.Init();
		circle.Init();
		circle.SetVisible(false);
	//	circle.mystyle.normal.background = TextureMgr.instance().LoadTexture("Round_CheckBox",TextureType.GEAR);
		circle = GearManager.Instance().SetImage(circle,"Round_CheckBox");	
		InitOcupied();
		benifit.txt = Datas.getArString("Gear.EquipmentBenefitDesc");
		InitHilight();
	}
	
	
	public void ShowCircle()
	{
		circle.SetVisible(true);
	}
	public void HideCircle()
	{
		circle.SetVisible(false);
	}
	
	public override void Update()
	{
		UpdateHilight();
	}
	
	private StoneItem mountItem;
	
	public void Mount(int id,int count)
	{
		Mount(GearData.singleton.CurrentArm,id,count);
	}
	public void Mount(Arm arm,int id,int count)
	{
		if(arm == null) return;
		if(!GearManager.Instance().CanMount(arm,Skill,id)) return;
		
		SoundMgr.instance().PlayRelativeToGear(Constant.GearSoundName.EmbedGearStone);
		
		mountItem = GearItems.singleton.CreateMountStoneItem(id,count);
		if(mountItem == null) return;
		mountItem.rect.x = skillButton.rect.x + skillButton.rect.width * 0.06f;
		mountItem.rect.y = skillButton.rect.y + skillButton.rect.height * 0.06f;
		mountItem.tagItem.mountPanel = this;
		//mountItem.rect.width = skillButton.rect.width;
		//mountItem.rect.height = skillButton.rect.height;
		Skill.Stone = id;
		percentage.txt = GearManager.Instance().GetSkillData(GearData.singleton.CurrentArm,skill);
	}

	public int Drop()
	{
		if(mountItem == null) return -1;
		
		Skill.Stone = 0;

		int id = mountItem.Id;
		mountItem.OnPopOver();
		mountItem = null;
		percentage.txt = GearManager.Instance().GetSkillData(GearData.singleton.CurrentArm,skill);
		return id;
	}
	
	public override int Draw()
	{
		if(skill == null) return -1;
		
		GUI.BeginGroup(rect);
		
		
		
		//showName.Draw();
		

		if(!isnull)
		{	
			back.Draw();
			percentage.Draw();
			addition.Draw();
			benifit.Draw();
			DrawOcupied();
			UpdateAbsoluteVector();
			DrawInterface();
		}
		skillButton.Draw();		
		if(mountItem != null)
			mountItem.Draw();
		skillback.Draw();			
		circle.Draw();
		
		if(!isnull)
		{
			foreach(TargetLabel t in targetlabels)
			{
				t.Draw();
			}
		}
		DrawHilight();
		GUI.EndGroup();
		return 0;
	}
	//======================================================================================================
	//ITouchable interface
	private Vector2 mAbsoluteVector;
	private Rect mAbsoluteRect;
	private System.Action<ITouchable> mActivated;
	public string GetName()
	{
		return "";
	}
	public bool IsVisible()
	{
		return visible;
	}
	
	public Rect GetAbsoluteRect()
	{
		mAbsoluteRect.x = mAbsoluteVector.x;
		mAbsoluteRect.y = mAbsoluteVector.y;
		mAbsoluteRect.width = rect.width;
		mAbsoluteRect.height = rect.height;
		return mAbsoluteRect;
	}

	public int GetZOrder()
	{
		return 20;
	}	
	private void UpdateAbsoluteVector()
	{
		//GUI.BeginGroup(skillButton.rect);
		mAbsoluteVector = GUIUtility.GUIToScreenPoint(new Vector2(0,0));
		//GUI.EndGroup();
	}
	public void SetTouchableActiveFunction(System.Action<ITouchable> Activated)
	{
		mActivated = Activated;
	}
	private void DrawInterface()
	{	
		if(mActivated != null)
			mActivated(this);
	}
	public override void OnPopOver() 
	{
		DestroyResource();
		this.skillButton.OnPopOver();
		this.skillback.OnPopOver();
		this.percentage.OnPopOver();
		this.addition.OnPopOver();
		this.benifit.OnPopOver();
		
		UIObject.TryDestroy(this);
	}
	
	public void DestroyResource()
	{
		if(mountItem != null)
			mountItem.OnPopOver();
	
		if ( targetlabels != null )
		{
			foreach(TargetLabel t in targetlabels)
			{
				t.OnPopOver();
				UIObject.TryDestroy(t);
			}
		}
	}
	//======================================================================================================
	private void InitOcupied()
	{
		ocupiedTouchable = new OcupiedTouchable(); 
		ocupiedTouchable.rect = new Rect(0,0,rect.width,skillButton.rect.y);
		GestureManager.singleton.RegistTouchable(ocupiedTouchable);
		ocupiedTouchable.tag = this;
		ocupiedTouchable.SetZOrder(10);
	}
	private void DrawOcupied()
	{
		ocupiedTouchable.Draw();
	}
	//======================================================================================================
	//hilight
	public FlashLabel hilight;
	
	private void InitHilight()
	{
		if(hilight == null) return;
		hilight.Init();
		
		hilight.rect = new Rect(0,0,rect.width,rect.height);
		//hilight.mystyle.normal.background = TextureMgr.instance().LoadTexture("kuang",TextureType.GEAR);
		GearManager.Instance().SetImageNull(hilight);
		hilight.mystyle.normal.background = TextureMgr.instance().LoadTexture("kuang",TextureType.DECORATION);
		hilight.mystyle.border.top = 8;
		hilight.mystyle.border.bottom = 8;
		Darken();
		
		hilight.Screenplay.OnPlayFinish = OnFlashFinish;
		hilight.From = 1.0f;
		hilight.To = 1.0f;
		hilight.Times = 0;
		
	}
	
	private void OnFlashFinish(IScreenplay screenplay)
	{
	/*
		if(hilight.isVisible())
		{
			hilight.Begin();
		}
	*/
	}
	
	private void DrawHilight()
	{
		if(hilight == null) return;
		hilight.Draw();
	}
	private void UpdateHilight()
	{
		if(hilight == null) return;
		hilight.Update();
	}
	
	public void Hilighten()
	{
		if(hilight == null) return;
		hilight.SetVisible(true);
		hilight.Begin();
	}
	
	public void Darken()
	{
		if(hilight == null) return;
		hilight.SetVisible(false);

	}
	
	
	
}
