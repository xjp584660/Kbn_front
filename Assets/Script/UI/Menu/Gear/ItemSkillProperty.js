#pragma strict

class ItemSkillProperty extends UIObject
{
	public var apertureStarLabel:Label; // Aperture 0 1 2 3 4 5
	public var propLabel:Label; // Attack Life TroopLimit
	public var jobLabel:Label; // Archers Infantry Cavalry Troops
	
	public var valLabel:Label;
	
	//--------------------------------------------------
	private final var BaseRect:Rect = new Rect(0, 0, 105, 105);
	private final var ApStarBaseRect:Rect = new Rect(0, 0, 105, 105);
	private final var PropBaseRect:Rect = new Rect(18.59f, 18.27f, 70, 70);
	private final var JobBaseRect:Rect = new Rect(70.63f, 56.78f, 38, 38);
	private final var ValBaseRect:Rect = new Rect(52.5f, 125, 38, 38); // x = 0.5 * (105 - 21)
	
	private var lastRect:Rect; 
	private var lastValText:String;
	//--------------------------------------------------
	
	private var armData = null;
	private var armSkillData:ArmSkill = null;
	
	//--------------------------------------------------
	public function Awake()
	{
		super.Awake();
		lastRect = BaseRect; 
		lastValText = "";
		
		armData = null;
		armSkillData = null;
		valLabel.mystyle.normal.textColor = Constant.ColorValue.ToRGBA(209, 192, 165);
	}
	
	public override function Draw()
	{
		if (!super.visible)
			return;
		
		GUI.BeginGroup(super.rect);
		
		if (!lastRect.width.Equals(super.rect.width)
			|| !lastRect.height.Equals(super.rect.height)
			|| !lastRect.x.Equals(super.rect.x)
			|| !lastRect.y.Equals(super.rect.y) 
			|| !lastValText.Equals(valLabel.txt)
			)
		{  
			lastRect = super.rect;
			lastValText = valLabel.txt; 
			
			AdjustChildrenRect(super.rect);
		}
		
		apertureStarLabel.Draw();
		propLabel.Draw();
		jobLabel.Draw();
		
		GUI.EndGroup();
		
		// Value is out of the super.rect
		valLabel.Draw();
	}
	
	private function AdjustChildrenRect(newRect:Rect)
	{
		// Unity GUI draw alignment is Left-Top
		var wScale:float = newRect.width / BaseRect.width;
		var hScale:float = newRect.height / BaseRect.height;
		
		super.rect = newRect;
		
		// Local scale
		apertureStarLabel.rect = new Rect(ApStarBaseRect.x * wScale, ApStarBaseRect.y * hScale
										, ApStarBaseRect.width * wScale, ApStarBaseRect.height * hScale);
										
		propLabel.rect = new Rect(PropBaseRect.x * wScale, PropBaseRect.y * hScale
										, PropBaseRect.width * wScale, PropBaseRect.height * hScale);
		
		jobLabel.rect = new Rect(JobBaseRect.x * wScale, JobBaseRect.y * hScale
										, JobBaseRect.width * wScale, JobBaseRect.height * hScale);
		
		// Text label only adjust the postion, but need think about the font size					
		valLabel.rect.x = newRect.x + (ValBaseRect.x - BaseRect.x) * wScale;
		valLabel.rect.y = newRect.y + (ValBaseRect.y - BaseRect.y) * hScale;
		
		// Care the style font size, cann't scale the font, so we adjust the position  
		// Change the text to UpperLeft
		valLabel.mystyle.alignment = TextAnchor.UpperLeft;
		var valRealRect:Vector2 = valLabel.mystyle.CalcSize(GUIContent(valLabel.txt));
		valLabel.rect.x = apertureStarLabel.rect.center.x - wScale * valRealRect.x; 
		valLabel.rect.x += newRect.x; // Text is out of the super.rect clamp
			
		if (hScale < 1.0f)
			valLabel.rect.y -= valRealRect.y * hScale;
		else if (hScale > 1.0f)
			valLabel.rect.y += valRealRect.y * hScale;
	}
	
	public function set Data(value:ArmSkill)
	{
		armSkillData = value as ArmSkill;
		if (null == armSkillData || armSkillData.ID == Constant.Gear.NullSkillID)
		{
			NullItemPropData();
		}
		else
		{
			SetItemPropData(armSkillData);
		}
	}
	
	// MUST call it before call Data method
	public function set ArmData(value:Arm)
	{
		armData = value;
	}
	
	private function NullItemPropData()
	{
		jobLabel.SetVisible(false);
		propLabel.SetVisible(false);
		apertureStarLabel.SetVisible(false);
		// GearSysHelpUtils.SetLabelTexture(jobLabel, null);
		// GearSysHelpUtils.SetLabelTexture(propLabel, null);
		// GearSysHelpUtils.SetLabelTexture(apertureStarLabel, null);
		
		valLabel.txt = "";
	}
	
	private function SetItemPropData(data:ArmSkill)
	{ 
		jobLabel.SetVisible(true);
		propLabel.SetVisible(true);
		apertureStarLabel.SetVisible(true);
		
		// Search the 3 image from GearGDS
		var jobImageName:String = GameMain.GdsManager.GetGds.<KBN.GDS_GearSkill>().GetIconTarget(data.ID, false); // "Archers";
		var propImageName:String = GameMain.GdsManager.GetGds.<KBN.GDS_GearSkill>().GetIconSkill(data.ID, false); // "TroopsLimit";
		var apertureStarImageName:String = GameMain.GdsManager.GetGds.<KBN.GDS_GearSkill>().GetIconLevel(data.ID, false);
		
//		var isLight:boolean = false; //data.IsOpened; // arm.xxx;
//		if (isLight)
//		{
//			jobImageName += ("_" + GearSysHelpUtils.LightString);
//			propImageName += ("_" + GearSysHelpUtils.LightString);
//			apertureStarImageName += ("_" + GearSysHelpUtils.LightString);
//		}
//		else
//		{
//			jobImageName += ("_" + GearSysHelpUtils.DarkString);
//			propImageName += ("_" + GearSysHelpUtils.DarkString);
//			apertureStarImageName += ("_" + GearSysHelpUtils.DarkString);
//		}
		//apertureStarImageName += GameMain.GdsManager.GetGds.<KBN.GDS_GearSkill>().GetIconLevel(data.ID);
		GearSysHelpUtils.ChangeLabelToTile(jobLabel, jobImageName);
		GearSysHelpUtils.ChangeLabelToTile(propLabel, propImageName);
		GearSysHelpUtils.ChangeLabelToTile(apertureStarLabel, apertureStarImageName);
		
		if (null != armData)
			valLabel.txt = GearManager.Instance().GetSkillData(armData, data);
		else
			valLabel.txt = "";
	}
	
	public function ShowValLabel(show:boolean)
	{
		valLabel.SetVisible(show);
	}
	
	public function SetPropLabelLight(light:boolean)
	{
		// Search the 3 image from GearGDS
		var jobImageName:String = GameMain.GdsManager.GetGds.<KBN.GDS_GearSkill>().GetIconTarget(armSkillData.ID, light); // "Archers";
		var propImageName:String = GameMain.GdsManager.GetGds.<KBN.GDS_GearSkill>().GetIconSkill(armSkillData.ID, light); // "TroopsLimit";
		var apertureStarImageName:String = GameMain.GdsManager.GetGds.<KBN.GDS_GearSkill>().GetIconLevel(armSkillData.ID, light);
		
		
//		if (light)
//		{
//			jobImageName += ("_" + GearSysHelpUtils.LightString);
//			propImageName += ("_" + GearSysHelpUtils.LightString);
//			apertureStarImageName += ("_" + GearSysHelpUtils.LightString);
//		}
//		else
//		{
//			jobImageName += ("_" + GearSysHelpUtils.DarkString);
//			propImageName += ("_" + GearSysHelpUtils.DarkString);
//			apertureStarImageName += ("_" + GearSysHelpUtils.DarkString);
//		}
		
		//var star:int = GameMain.GdsManager.GetGds.<KBN.GDS_GearSkill>().GetIconLevel(data.ID);
		//apertureStarImageName += star.ToString();
		//apertureStarImageName += GameMain.GdsManager.GetGds.<KBN.GDS_GearSkill>().GetIconLevel(armSkillData.ID);
		GearSysHelpUtils.ChangeLabelToTile(jobLabel, jobImageName);
		GearSysHelpUtils.ChangeLabelToTile(propLabel, propImageName);
		GearSysHelpUtils.ChangeLabelToTile(apertureStarLabel, apertureStarImageName);
	}
}