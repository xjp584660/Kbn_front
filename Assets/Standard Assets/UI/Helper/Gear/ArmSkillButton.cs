
using UnityEngine;

public class ArmSkillButton : Button , ITouchable
{
	private ArmSkill skill;
	private bool isActive;


	public ArmSkillLabel back;
	
	public override void Init()
	{
		base.Init();	
		mystyle.normal.background = TextureMgr.instance().LoadTexture("Properties_box",TextureType.BUTTON);
		mystyle.active.background = null;
		mystyle.hover.background = null;
		Active = false;
		isDefault = false;
		isShowSkill = false;
		
		rect.width = 135;
		rect.height = 135;
		if(back != null)
		{
			back.rect.x = 27.5f;
			back.rect.y = 27.5f;
			back.rect.width= 80;
			back.rect.height = 80; 
			back.Init();
		}
		InitHilight();
	}
	public ArmSkill Skill
	{
		get
		{
			return skill;
		}
			
		set
		{
			skill = value;
			if(back == null) return;
			if(back != null)
				back.Skill = value;
		}
	}
	
	private bool isShowSkill;
	public bool IsShowSkill
	{
		set
		{
			isShowSkill = value;
		}
	}
	
	public bool Active
	{
		get
		{
			return isActive;
		}
		set
		{
			isActive = value;
			if(back != null)
				back.Active = value;
		}
	}
	private bool isDefault;
	public bool IsDefault
	{
		get
		{
			return isDefault;
		}

		set
		{
			isDefault = value;
			if(isDefault)
				mystyle.normal.background = TextureMgr.instance().LoadTexture("Properties_box_default",TextureType.BUTTON);
			else
				mystyle.normal.background = TextureMgr.instance().LoadTexture("Properties_box",TextureType.BUTTON);
		}
	}
	
	private bool isNull;
	public bool IsNull
	{
		set
		{
			isNull = value;
			if(isNull)
				mystyle.normal.background = TextureMgr.instance().LoadTexture("skillbg_default",TextureType.BUTTON);
			else
				mystyle.normal.background = TextureMgr.instance().LoadTexture("Properties_box",TextureType.BUTTON);
		}
	}
	
	public override void Update()
	{
		UpdateHilight();
	}
	public override int Draw()
	{
		if(!visible) return -1;
		base.Draw();
		if(isDefault) return 0;
		UpdateAbsoluteVector();
		GUI.BeginGroup(rect); 
		
		DrawInterface();
		if(back != null && isShowSkill)
			back.Draw(); 
		DrawHilight();	
		GUI.EndGroup();
		return 0;
	}
	//======================================================================================================
	//ITouchable interface
	public override string GetName()
	{
		return "";
	}
/*	public bool IsVisible()
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
*/
	public override int GetZOrder()
	{
		return 5;
	}	
/*	protected void UpdateAbsoluteVector()
	{
		mAbsoluteVector = GUIUtility.GUIToScreenPoint(new Vector2(0 ,0));
	}
	
	public void SetTouchableActiveFunction(System.Action. Activated<ITouchable>)
	{
		mActivated = Activated;
	}
	
	protected void DrawInterface()
	{	
		if(mActivated != null)
			mActivated(this);
	}
*/	
	public override void OnPopOver() 
	{
		if(back != null)
			this.back.OnPopOver();
		UIObject.TryDestroy(this);
	}
	//======================================================================================================
	//hilight
	public FlashLabel hilight;
	
	private void InitHilight()
	{
		if(hilight == null) return;
		hilight.Init();
		
		hilight.rect = new Rect(0,0,rect.width,rect.height);
		hilight = (FlashLabel)GearManager.Instance().SetImage(hilight,"Round_CheckBox");
		
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
