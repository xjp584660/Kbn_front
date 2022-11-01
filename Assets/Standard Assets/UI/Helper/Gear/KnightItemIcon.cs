using UnityEngine;
using System;

public class KnightItemIcon : UIObject
{
	public Button itemBackgroundBtn;
	public SimpleLabel m_gearFrame = new SimpleLabel();
	public Label itemIcon;
	public Label itemStar;
	public Label itemIsInKnight;
	
	public FlashLabel hilight;
	
	//------------------------------------------------------------
	private Arm data;
	
	//------------------------------------------------------------
	public override void Init()
	{
		InitItemBackground();
		InitLabels();
		InitHilight();
		
		itemIsInKnight.txt = "";
	}
	
	private void InitItemBackground()
	{
		itemBackgroundBtn.rect.x = 0;
		itemBackgroundBtn.rect.y = 0;
		itemBackgroundBtn.rect.width = base.rect.width;
		itemBackgroundBtn.rect.height = base.rect.height;
		
		string bgNormalName = "Equipment_bg";
		string bgActiveName = "Equipment_bg2";
		itemBackgroundBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture(bgNormalName, TextureType.BUTTON);
		itemBackgroundBtn.mystyle.active.background = TextureMgr.instance().LoadTexture(bgActiveName, TextureType.BUTTON);
		
		m_gearFrame.rect = itemBackgroundBtn.rect;
		m_gearFrame.inScreenAspect = true;
		m_gearFrame.lockWidthInAspect = true;
	}
	
	public override int Draw()
	{
		if (!base.visible)
			return 0;
			
		GUI.BeginGroup(base.rect); 
		
		itemBackgroundBtn.Draw();
		m_gearFrame.Draw();
		DrawHilight();
		
		itemIcon.Draw();
		itemStar.Draw();
		itemIsInKnight.Draw();
		
		GUI.EndGroup();

		return 0;
	}
	
	public override void Update()
	{
		UpdateHilight();
	}
	
	public override void OnClear()
	{
		base.OnClear();
	}
	
	public Arm Data
	{	
		set {
			data = value;
			
			if (null == value)
				NullItemIconData();
			else
				SetItemIconData(value);
		}
		get {
			return data;
		}
	}
	
	public void SetOnClickDelegate(MulticastDelegate del)
	{
		itemBackgroundBtn.clickParam = this;
		itemBackgroundBtn.OnClick = del;
	}
	
	public void SetNullItemIcon(string imageName)
	{
		Vector2 center = new Vector2(0.5f * base.rect.width, 0.5f * base.rect.height);
		itemIcon.rect.x = center.x - 0.5f * itemIcon.rect.width;
		itemIcon.rect.y = center.y - 0.5f * itemIcon.rect.height;
			
		GearSysHelpUtils.ChangeLabelToTile(itemIcon, imageName);
	}
	
	private void NullItemIconData()
	{
		GearSysHelpUtils.SetLabelTexture(itemIcon, null);
		GearSysHelpUtils.SetLabelTexture(itemStar, null);
		GearSysHelpUtils.SetLabelTexture(itemIsInKnight, null);
		
		itemBackgroundBtn.mystyle.active.background = null;
		m_gearFrame.mystyle.normal.background = null;
	}
	
	private void SetItemIconData(Arm arm)
	{
		GearSysHelpUtils.SetEquipItemIcon(itemIcon, arm);
		
		GearManager gearMgr = GearManager.Instance();
		string bgNormalName = gearMgr.GetBackgroundName(data);
		string bgActiveName = gearMgr.GetBackgroundActiveName(data);
		itemBackgroundBtn.mystyle.normal.background = TextureMgr.instance().LoadTexture(bgNormalName, TextureType.BUTTON);
		itemBackgroundBtn.mystyle.active.background = TextureMgr.instance().LoadTexture(bgActiveName, TextureType.BUTTON);
		m_gearFrame.mystyle.normal.background = gearMgr.GetGearFrameLabel(data);
		GearSysHelpUtils.ChangeLabelToTile(itemStar, GearSysHelpUtils.GetStarNameByArm(arm));

		// Not use SetVisible,maybe is operated by others code
		if (arm.IsArmed)
			GearSysHelpUtils.ChangeLabelToTile(itemIsInKnight, GearSysHelpUtils.ImageNameIsDressed);
		else
			GearSysHelpUtils.SetLabelTexture(itemIsInKnight, null);
	}
	
	private void InitHilight()
	{
		if(hilight == null) return;
		hilight.Init();
		
		if(itemBackgroundBtn != null)
			hilight.rect = new Rect(0, 0, itemBackgroundBtn.rect.width, itemBackgroundBtn.rect.height);
		else
			hilight.rect = new Rect(0, 0, rect.width, rect.height);
		GearManager.Instance().SetImageNull(hilight);
		hilight.mystyle.normal.background = TextureMgr.instance().LoadTexture("kuang1",TextureType.DECORATION);
		hilight.mystyle.border.left = 8;
		hilight.mystyle.border.right = 8;
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
		// if(hilight.isVisible())
		// {
		// 	hilight.Begin();
		// }
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
	
	public override void OnPopOver() 
	{
		this.itemBackgroundBtn.OnPopOver();
		this.itemIcon.OnPopOver();
		this.itemStar.OnPopOver();
		this.itemIsInKnight.OnPopOver();
		
		UIObject.TryDestroy(this);
	}
	
	private void InitLabels()
	{
		itemIcon.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		itemIcon.useTile = true;
		itemStar.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		itemStar.useTile = true;
		itemIsInKnight.tile = TextureMgr.instance().ItemSpt().GetTile(null);
		itemIsInKnight.useTile = true;
	}
}
