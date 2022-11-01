
import System.Collections.Generic;

public class GearInformationTip extends TipBar
{
	public var labelTemplate:Label;
	public var skillLabel:ArmSkillLabel;
	public var star:StarLevel;
	public var targetLabel:TargetLabel;
	
	private var arm:Arm;
	
	public var image:Label;
	public var back:Label;
	public var armname:Label;
	public var attack:Label;
	public var attackText:Label;
	public var life:Label;
	public var lifeText:Label;
	public var trooplimit:Label;
	public var trooplimitText:Label;

	public var skills:ArmSkillLabel[];
	public var ringSkills:Button[];
	public var skillTexts:Label[];
	public var skillDirections:Label[];
	public var armDirections:Label[];
	
	
	public var description:Label;
	public var require:Label;
	
	private var created:List.<UIObject>;
	
	private var middle:int;
	private var isCompareRequire:boolean;
	private var isShowCompare:boolean;
	
	//yyyyy
	public var rampageCount:Label;
	
	public var rampageSword:Label;
	public var rampageGreaves:Label;
	public var rampageHelmet:Label;
	public var rampageShield:Label;
	public var rampageBreastplate:Label;
	
	public var rampageThree:Label;
	public var rampageThreeResult:Label;
	public var rampageThreeMark:Label;
	public var rampageThreeResultPoint:Label;
	public var rampageThreeMarkPoint:Label;
	
	public var rampageFive:Label;
	public var rampageFiveResult:Label;
	public var rampageFiveMark:Label;
	public var rampageFiveResultPoint:Label;
	public var rampageFiveMarkPoint:Label;

	public var knightName:Label;  //????

	public var closeBtn:SimpleButton;
	//yyyyy
	protected function CreateRect():Rect
	{
		return new Rect(0,190,640,630);
	}
	
	public function Init()
	{
		super.Init();
		created = new List.<UIObject>();
		attack.mystyle.normal.background = ItemPropertyKind.GetTextureByKind(ItemPropertyKind.Attack);
		life.mystyle.normal.background = ItemPropertyKind.GetTextureByKind(ItemPropertyKind.Life);
		trooplimit.mystyle.normal.background = ItemPropertyKind.GetTextureByKind(ItemPropertyKind.TroopsLimit);
		CreateBackground();
		for(var i:int = 0;i<skills.length;i++)
		{
//			skillDirections[i].mystyle.active.background = TextureMgr.instance().LoadTexture("Rise",TextureType.GEAR);
//			skillDirections[i].mystyle.hover.background = TextureMgr.instance().LoadTexture("Decline",TextureType.GEAR);
			skills[i].Init();
			skillTexts[i].Init(); 
			skillDirections[i].Init();
			skills[i].SetVisible(true);
		}
		for (var k = 0; k < ringSkills.length; k++) {
			ringSkills[k].Init();
			ringSkills[k].SetVisible(false);
			ringSkills[k].OnClick=OnGearInfoButton;

		}
		for(var j = 0;j<armDirections.length;j++)
		{
//			armDirections[j].mystyle.active.background = TextureMgr.instance().LoadTexture("Rise",TextureType.GEAR);
//			armDirections[j].mystyle.hover.background = TextureMgr.instance().LoadTexture("Decline",TextureType.GEAR);
			armDirections[j].Init();
		}
		
		isShowCompare = true;
		arm = null;
		closeBtn.OnClick=CloseShowGearTip;
	}	

	private function CloseShowGearTip(){
		MenuMgr.getInstance().sendNotification("CloseShowGearTip",null);
	}
		
	public function set TheArm(value:Arm)
	{
		arm = value;
		OnArmChanged();
	
	}
	private function SetText(arm:Arm)
	{
		if(arm == null) return;
		image = GearManager.Instance().SetImage(image,GearManager.Instance().GetImageName(arm));
		this.knightName.txt=arm.GetKightNameString(this.knightName);
		//var r:Rect = image.tile.spt.GetFullRect(image.tile.name);
		var r:Rect = image.tile.prop.LogicRect;
		image.rect = WithinRect(new Rect(10,40,220,220),r.width,r.height);

		middle = image.rect.x + image.rect.width;
		
		armname.txt = GearManager.Instance().GetArmName(arm).ToString();
		attackText.txt = GearManager.Instance().GetShowData(GearManager.Instance().GetArmAttack(arm.GDSID,arm.StarLevel,arm.TierLevel)).ToString();
		lifeText.txt = GearManager.Instance().GetShowData(GearManager.Instance().GetArmLife(arm.GDSID,arm.StarLevel,arm.TierLevel)).ToString();
		trooplimitText.txt = GearManager.Instance().GetArmTroop(arm.GDSID,arm.StarLevel).ToString();
		description.txt = String.Format(GearManager.Instance().GetArmDescription(arm),arm.ToExperence);
		star.Level = arm.StarLevel;
		var fmtLevelStrWithStar : String = "*Lv{0}";
		var armReqLevel:int = GearManager.Instance().GetArmReqLevel(arm);
		var armReqLevelStr : String = Knight.GetShowerLevel(armReqLevel);
		if ( Knight.IsStarLevel(armReqLevel) )
		{
			armReqLevelStr = String.Format(fmtLevelStrWithStar, armReqLevelStr);
		}
		var curKnight : Knight = GearData.Instance().CurrentKnight;
		SetSuit(curKnight,arm);
		if(isCompareRequire)
		{
			
			var curKnightLevel : String = curKnight.ShowerLevel;
			if ( curKnight.IsHaveStar )
				curKnightLevel = String.Format(fmtLevelStrWithStar, curKnightLevel);

			var fmtRequire : String = "{0}    {1}/{2}";
			require.txt = String.Format(fmtRequire, Datas.getArString("Gear.EquipmentRequireLevel"), curKnightLevel, armReqLevelStr);
			if(arm.Tag.isRed)
				require.normalTxtColor = FontColor.Red;
			else
				require.normalTxtColor = FontColor.Description_Dark;
		}
		else
		{
			var fmtLev : String = "{0}    {1}";
			require.txt = String.Format(fmtLev, Datas.getArString("Gear.EquipmentRequireLevel"), armReqLevelStr);
			require.normalTxtColor = FontColor.Description_Dark;
		}
		
		
	}
	
	
//var suitOne:String[] = ["1057307","2057307","3057307","4057307","5057307"];
//var suitTwo:String[] = ["1057407","2057407","3057407","4057407","5057407"];
var rampageArray:Label[] = [rampageSword,rampageGreaves,rampageHelmet,rampageShield,rampageBreastplate];

public function  SetSuit(knight:Knight,arm:Arm)
{
	
	var suitOne:String[] = ["1111057407","21111057407","31111057407","41111057407","51111057407"];
	if(arm.Setid!="0")
	{
		var _id:String = arm.GDSID.ToString().Substring(1,6);
		for(var _i:int=1;_i<=5;_i++)
		{
			 var _subID:String=_i.ToString()+_id;
			suitOne[_i-1]=_subID;
		}
	}
	for(var i:int =0;i<5;i++)
	{
		if(suitOne[i]==arm.GDSID.ToString())
		{
			SetCurrentSuit(knight,suitOne,arm);
			break;
		}
//		else if(suitTwo[i]==arm.GDSID.ToString())
//		{
//			SetCurrentSuit(knight,suitTwo,arm);
//			break;
//		}
		else
		{
			rampageCount.txt = Datas.getArString("GearInfo.NoSetAttribute");
			SetSuitVisible(false);
			
		}
	}
}
public function  SetCurrentSuit(knight:Knight,currentSuit:String[],currentArm:Arm)
{
	SetSuitVisible(true);
	var suitCount:int=0;
	var arms:Arm[] = knight.Arms;
	var isSuitClick:boolean = false;
	
//	for(var _j:int =0 ;_j<5;_j++)
//	{
//		if(null!=currentArm&&null!=arms[_j]&&arms[_j].GDSID.ToString()==currentArm.GDSID.ToString())
//		{
//			isSuitClick=true;
//		}
//	}
	if(currentArm.IsArmed)
		{
			for(var _i:int =0 ;_i<5;_i++)
			{
				if(null!=arms[_i]&&currentSuit[_i]==arms[_i].GDSID.ToString())
				{
					if(String.IsNullOrEmpty(arms[_i].RemarkName))
					{
					  rampageArray[_i].txt = Datas.getArString("gearName.g"+arms[_i].GDSID);
				    }else{
				      rampageArray[_i].txt = arms[_i].RemarkName;
				    }
					rampageArray[_i].normalTxtColor = FontColor.BEGIN;
					suitCount++;
				}
				else
				{
					// if(arms[_i]!=null)
 					// {
	                //     // if(String.IsNullOrEmpty(arms[_i].RemarkName))
					// 	// {
					// 	  rampageArray[_i].txt = Datas.getArString("gearName.g"+currentSuit[_i]);
					//     // }else{
					//     //   rampageArray[_i].txt = arms[_i].RemarkName;
					//     // }
					// }
					// else
					// {
					rampageArray[_i].txt = Datas.getArString("gearName.g"+currentSuit[_i]);
				  //  }
					rampageArray[_i].normalTxtColor = FontColor.Grey;
				}
			}
		}
		else
		{
			for(var _k:int =0 ;_k<5;_k++)
			{
				if(currentSuit[_k]==currentArm.GDSID.ToString())
				{
					if(String.IsNullOrEmpty(currentArm.RemarkName))
					{
					   rampageArray[_k].txt = Datas.getArString("gearName.g"+currentArm.GDSID);
					}
					else
					{
                       rampageArray[_k].txt = currentArm.RemarkName;
					}
					rampageArray[_k].normalTxtColor = FontColor.BEGIN;
					suitCount++;
				}
				else
				{
					rampageArray[_k].txt = Datas.getArString("gearName.g"+currentSuit[_k]);
					rampageArray[_k].normalTxtColor = FontColor.Grey;
				}
			}
		}
//		if(isSuitClick)
//		{	for(var _i:int =0 ;_i<5;_i++)
//			{
//				if(null!=arms[_i]&&currentSuit[_i]==arms[_i].GDSID.ToString())
//				{
//					rampageArray[_i].txt = Datas.getArString("gearName.g"+arms[_i].GDSID);
//					rampageArray[_i].normalTxtColor = FontColor.BEGIN;
//					suitCount++;
//				}
//				else
//				{
//					rampageArray[_i].txt = Datas.getArString("gearName.g"+currentSuit[_i]);
//					rampageArray[_i].normalTxtColor = FontColor.Grey;
//				}
//			}
//		}
//		else
//		{
//			for(var _k:int =0 ;_k<5;_k++)
//			{
//				if(currentSuit[_k]==currentArm.GDSID.ToString())
//				{
//					rampageArray[_k].txt = Datas.getArString("gearName.g"+currentArm.GDSID);
//					rampageArray[_k].normalTxtColor = FontColor.BEGIN;
//					suitCount++;
//				}
//				else
//				{
//					rampageArray[_k].txt = Datas.getArString("gearName.g"+currentSuit[_k]);
//					rampageArray[_k].normalTxtColor = FontColor.Grey;
//				}
//			}
//		}
	
	rampageCount.txt = String.Format(Datas.getArString("GearInfo.Set_Name"+currentArm.Setid),suitCount.ToString());

	rampageThree.txt =Datas.getArString("GearInfo.3Set");
	rampageFive.txt = Datas.getArString("GearInfo.5Set");
	
	
	rampageFive.rect.y=rampageThreeResult.rect.y+60;
	rampageFiveResult.rect.y=rampageThreeResult.rect.y+90;
	rampageFiveMark.rect.y=rampageThreeResult.rect.y+120;

	rampageThreeMark.SetVisible(true);
	rampageFiveMark.SetVisible(true);
	
	if(currentArm.Threesetattribute.ToString().Contains(":"))
	{
		SetSuitTwoAttibute(rampageThreeResult,rampageThreeMark,currentArm.Threesetattribute.ToString());	
	}
	else
	{
		SetSuitOneAttibute(rampageThreeResult,rampageThreeMark,currentArm.Threesetattribute.ToString());
	}
		
	if(currentArm.Fivesetattribute.ToString().Contains(":"))
	{
		SetSuitTwoAttibute(rampageFiveResult,rampageFiveMark,currentArm.Fivesetattribute.ToString());	
	}
	else
	{
		SetSuitOneAttibute(rampageFiveResult,rampageFiveMark,currentArm.Fivesetattribute.ToString());
	}
//	rampageThreeResult.txt = String.Format(Datas.getArString("GearInfo.Set1_3Attribute1"),currentArm.Threesetattribute.ToString());
//	rampageThreeMark.txt = String.Format(Datas.getArString("GearInfo.Set1_3Attribute1"),currentArm.Threesetattribute.ToString());
//
//	
//	rampageFiveResult.txt = String.Format(Datas.getArString("GearInfo.Set1_5Attribute1"),currentArm.Fivesetattribute.ToString());
//	rampageFiveMark.txt = String.Format(Datas.getArString("GearInfo.Set1_5Attribute1"),currentArm.Fivesetattribute.ToString());

	if(suitCount>2)
	{
		rampageThreeResult.normalTxtColor = FontColor.Green;
		rampageThreeMark.normalTxtColor = FontColor.Green;
			rampageThreeResultPoint.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_setpoint2",TextureType.BUTTON); 
			rampageThreeMarkPoint.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_setpoint2",TextureType.BUTTON); 
		
	}
	else
	{
		rampageThreeResult.normalTxtColor = FontColor.Grey;
		rampageThreeMark.normalTxtColor = FontColor.Grey;
			rampageThreeResultPoint.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_setpoint1",TextureType.BUTTON); 
			rampageThreeMarkPoint.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_setpoint1",TextureType.BUTTON); 
		
	}
	if(suitCount>4)
	{
		
		rampageFiveResult.normalTxtColor = FontColor.Green;
		rampageFiveMark.normalTxtColor = FontColor.Green;
			rampageFiveResultPoint.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_setpoint2",TextureType.BUTTON); 
			rampageFiveMarkPoint.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_setpoint2",TextureType.BUTTON); 
		
	}
	else
	{
		rampageFiveResult.normalTxtColor = FontColor.Grey;
		rampageFiveMark.normalTxtColor = FontColor.Grey;
			rampageFiveResultPoint.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_setpoint1",TextureType.BUTTON); 
			rampageFiveMarkPoint.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_setpoint1",TextureType.BUTTON); 
		
	}

}
public function  SetSuitVisible(visible:boolean)
{
	//back.rect = new Rect(0,0,640,570);

	rampageThree.SetVisible(visible);
	rampageThreeResult.SetVisible(visible);
	rampageThreeMark.SetVisible(visible);
	rampageThreeResultPoint.SetVisible(visible);
	rampageThreeMarkPoint.SetVisible(visible);
	
	rampageFive.SetVisible(visible);
	rampageFiveResult.SetVisible(visible);
	rampageFiveMark.SetVisible(visible);
	rampageFiveResultPoint.SetVisible(visible);
	rampageFiveMarkPoint.SetVisible(visible);
	for(var _i:int =0 ;_i<5;_i++)
	{
		rampageArray[_i].SetVisible(visible);
	}

}
public function SetSuitOneAttibute(_rampageResult:Label,_rampageMark:Label,currentArm:String)
{
//	back.rect = new Rect(0,0,640,570);
//	rampageFive.rect.y=rampageThreeResult.rect.y+30;
//	rampageFiveResult.rect.y=rampageThreeResult.rect.y+60;
//
//	rampageThreeMark.SetVisible(false);
//	rampageFiveMark.SetVisible(false);
//	_rampageResult.txt = Datas.getArString("GearInfo.Set_Attribute"+currentArm.Split('_'[0])[0]) +currentArm.Split('_'[0])[1];
	if(currentArm.Split('_'[0])[0]=="3")
	{
		_rampageResult.txt = Datas.getArString("GearInfo.Set_Attribute"+currentArm.Split('_'[0])[0]) +currentArm.Split('_'[0])[1];

	}
	else
	{
		var d:double = _Global.INT32(currentArm.Split('_'[0])[1]);
		_rampageResult.txt = Datas.getArString("GearInfo.Set_Attribute"+currentArm.Split('_'[0])[0]) +(d/100)+"%";
	
	}
	_rampageMark.txt = Datas.getArString("GearInfo.NoSet");
	
}
public function SetSuitTwoAttibute(_rampageResult:Label,_rampageMark:Label,currentArm:String)
{
	back.rect = new Rect(0,0,640,634);
//currentArm:1_5000:4_7000
	var oneAttribute:String=currentArm.Split(":"[0])[0];//1_5000
	var twoAttribute:String=currentArm.Split(":"[0])[1];//4_7000
	
	//var oneTypeName:String= oneAttribute.Split(‘_’[0])[0];//1
	//var oneTypeName:String= oneAttribute.Split(‘_’[0])[1];//5000
//	_rampageResult.txt = Datas.getArString("GearInfo.Set_Attribute"+oneAttribute.Split('_'[0])[0]) +oneAttribute.Split('_'[0])[1];
//	_rampageMark.txt = Datas.getArString("GearInfo.Set_Attribute"+twoAttribute.Split('_'[0])[0]) +twoAttribute.Split('_'[0])[1];
	if(oneAttribute.Split('_'[0])[0]=="3")
	{
		_rampageResult.txt = Datas.getArString("GearInfo.Set_Attribute"+oneAttribute.Split('_'[0])[0]) +oneAttribute.Split('_'[0])[1];
	}
	else
	{
		var d:double = _Global.INT32(oneAttribute.Split('_'[0])[1]);
		_rampageResult.txt = Datas.getArString("GearInfo.Set_Attribute"+oneAttribute.Split('_'[0])[0]) +(d/100)+"%";
	}
	if(twoAttribute.Split('_'[0])[0]=="3")
	{
		_rampageMark.txt = Datas.getArString("GearInfo.Set_Attribute"+twoAttribute.Split('_'[0])[0]) +twoAttribute.Split('_'[0])[1];
	}
	else
	{
	var dd:double = _Global.INT32(twoAttribute.Split('_'[0])[1]);
		_rampageMark.txt = Datas.getArString("GearInfo.Set_Attribute"+twoAttribute.Split('_'[0])[0]) +(dd/100)+"%";
	}
}


	
	public function set CompareRequire(value:boolean)
	{
		isCompareRequire = value;
	}
	
	private function SetArmCompare()
	{
		if(!isShowCompare) 
		{
			for(var i:int = 0; i < 3; i++)
			{
				//armDirections[i].mystyle.normal.background = null;
				GearManager.Instance().SetImageNull(armDirections[i]);
			}
			return;
		}
		
		var armCompare:double[] = GearManager.Instance().CompareArm(GearData.Instance().CurrentKnight.GetArm(arm.Category),arm);
		for(var k:int = 0;k<3;k++)
		{
			if(armCompare == null || armCompare.Length <= 0)
			{
				armDirections[k] = GearManager.Instance().SetImage(armDirections[k],"Rise");
			}
			else
			{
				if(armCompare[k] > 0.0f) armDirections[k] = GearManager.Instance().SetImage(armDirections[k],"Rise");
				else if(armCompare[k] < 0.0f) armDirections[k] = GearManager.Instance().SetImage(armDirections[k],"Decline");
				else armDirections[k] = GearManager.Instance().SetImageNull(armDirections[k]);
			}
		}
		
	}
	
	private function DealWithNullSkill(skill:ArmSkill,i:int)
	{
		if(skill == null) return;
		
		skillTexts[i].txt = "";
		//skillDirections[i].mystyle.normal.background = null;
		skills[i].SetVisible(false);
		GearManager.Instance().SetImageNull(skillDirections[i]);
	}
	private function SetActiveText(isActive:boolean,i:int)
	{
		var l:Label = GameObject.Instantiate(labelTemplate);
		created.Add(l);
		l.rect.y = skills[i].rect.y - 20;
		l.rect.x = 280+i*90;
		l.rect.width = skills[i].rect.width;
		l.rect.height = 20;
		l.mystyle.normal.background = null;
		l.mystyle.alignment = TextAnchor.MiddleCenter;
		l.txt = "";
		l.useTile = false;
		skills[i].Alpha = 1.0f;
		if(!isActive)
		{
			l.txt = Datas.getArString("Gear.EquipmentInactiveDesc");
			l.normalTxtColor = FontColor.Red;
		}
		else
		{
			l.txt = Datas.getArString("Gear.EquipmentActiveDesc");
			l.normalTxtColor = FontColor.Green;			
		}
		
	}
	
	private function DealWithNotNullSkill(skill:ArmSkill,i:int)
	{
		if(skill == null) return;
		skills[i].SetVisible(true);
		skills[i].Active = true;
		skills[i].Alpha = 1.0f;
		skillTexts[i].txt = GearManager.Instance().GetSkillData(arm,skill);
	}
	private function DealWithNotNullSkill(isActive:boolean,skill:ArmSkill,i:int)
	{
		if(isActive)
		{
			skillTexts[i].normalTxtColor = FontColor.Green;
		}
		else
		{
			skillTexts[i].normalTxtColor = FontColor.Grey;			
		}
		if(skill == null) return;
		skills[i].SetVisible(true);
		skills[i].Active = true;
		skills[i].Alpha = 1.0f;
		skillTexts[i].txt = GearManager.Instance().GetSkillData(arm,skill);
	}
	private function SetTargets(skill:ArmSkill,i:int)
	{
		var targets:int[] = GearManager.Instance().GetTargets(skill);
		for(var j:int = 0; j < targets.length; j++)
		{
			if(targets[j]!=99)
			continue;
			var tl:TargetLabel = GameObject.Instantiate(targetLabel);
			created.Add(tl);
			//tl.rect = new Rect(j/2 * 120 + 370,j%2 * 40 + skills[i].rect.y,115,38);
			tl.rect = new Rect(i* 90 + 265,210,86,38);
			
			tl.Init();
			tl.ID = targets[j];
		}
	}
	
	private function OnArmChanged()
	{ 
		if(arm == null) return;  
		
		if(arm.ArmSkills.Count==0)
		isShowCompare = false;
		else
    		isShowCompare = true;
    		
    	if(arm.IsArmed)
		isShowCompare = false;
		else
    		isShowCompare = true;
    	
    	if(!isShowCompare) 
		{
			for( var _i:int = 0;_i<skillDirections.length;_i++ )
			{
			//skillDirections[i].mystyle.normal.background = null;
			GearManager.Instance().SetImageNull(skillDirections[_i]);
			
			}
		}
		
		DestroyResource();
		SetText(arm);
		
		SetArmCompare();
		if (arm.IsShowBase) {
			DealWithDefultSkill();
			return;
		}else{
			DealWithNoDefultSkill();
		}
		
		var skillCompare:double[] = GearManager.Instance().CompareSkill(GearData.Instance().CurrentKnight.GetArm(arm.Category),arm);
		for( var i:int = 0;i<arm.ArmSkills.Count;i++ )
		{
			var isActive = arm.StarLevel > i;
			if( arm.ArmSkills[i] != null)
			{
				skills[i].Skill = arm.ArmSkills[i]; 
				if(arm.ArmSkills[i].ID== Constant.Gear.NullSkillID)
				{
					DealWithNullSkill(arm.ArmSkills[i],i);
				}
				else
				{
					//SetActiveText(isActive,i);
					DealWithNotNullSkill(isActive,arm.ArmSkills[i],i);
 					SetTargets(arm.ArmSkills[i],i);
					SetSkillCompare(arm.ArmSkills[i],skillCompare,i,arm,isActive);
				}
			}
		}
	}

	private function DealWithDefultSkill()
	{
		for (var i = 0; i < ringSkills.length; i++) {	
			if (arm.IsShowBase) {
				ringSkills[i].SetVisible(true);
				ringSkills[i].rect=skills[i].rect;
				skillTexts[i].SetVisible(true);
				skills[i].SetVisible(false);
				skillTexts[i].txt = "???";
			}else{
				ringSkills[i].SetVisible(false);
			}
		}	
	}
	private function DealWithNoDefultSkill()
	{
		for (var i = 0; i < ringSkills.length; i++) {	
			ringSkills[i].SetVisible(false);	
		}	
	}

	private function OnGearInfoButton() {
		Debug.Log("kaishi ");
		var ids:int[] = GearManager.Instance().GetShowSkill(arm.Category, arm.TierLevel);
		Debug.Log("kaishi "+ids);

		if (null == ids || 0 == ids.Length)
			return;

		MenuMgr.instance.PushMenu("GearTierSkillPopup", new List.<int>(ids), "trans_zoomComp");
	}

	private function SetSkillCompare(skill:ArmSkill,skillCompare:double[],i:int,arm:Arm,isActive:boolean)
	{ 
		if(skill == null) return; 
		if(skillCompare == null) return; 
		
		if(isActive)
		isShowCompare = true;
		else
    	isShowCompare = false;
    		
		if(!isShowCompare) 
		{
			//skillDirections[i].mystyle.normal.background = null;
			GearManager.Instance().SetImageNull(skillDirections[i]);
			return;
		}
		
		if(skill.ID != Constant.Gear.NullSkillID)
		{
			if(skillCompare == null || skillCompare.Length <= 0)
				skillDirections[i] = GearManager.Instance().SetImage(skillDirections[i],"Rise");
			else
			{
				if(isActive && GearData.Instance().CurrentKnight.GetArm(arm.Category) != arm)
				{
					if(skillCompare[i] > 0.0f) skillDirections[i] = GearManager.Instance().SetImage(skillDirections[i],"Rise");
					else if(skillCompare[i] < 0.0f) skillDirections[i] = GearManager.Instance().SetImage(skillDirections[i],"Decline");
					else skillDirections[i] = GearManager.Instance().SetImageNull(skillDirections[i]);
				}
			}
		}				
	}
	
	public function get TheArm()
	{
		return arm;
	}
	
	public function SetIsShowCompare(show:boolean)
	{
		if (isShowCompare == show)
			return;
			
		isShowCompare = show;
		TheArm = this.arm;
	}
	
	private function CreateBackground()
	{
		back.txt = "";
		GearManager.Instance().SetImageNull(back);
		back.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black",TextureType.FTE); 
	//	back = GearManager.Instance().SetImage(back,"black_Translucent");
	} 
	
	public function DestroyResource()
	{
		if(created == null) return;
		star.OnPopOver();
		for(var o:UIObject in created)
		{
			o.OnPopOver();
			UIObject.TryDestroy(o);
		}
		created.Clear();
	}
	
	public function OnPopOver()
	{
		DestroyResource();
	}

	public var IsShowRingBase:boolean=false;
	public function Draw()
	{ 	
		if(!this.visible) return;
		if(arm == null) return;
		if(arm.ArmSkills == null) return;
		
		GUI.BeginGroup(rect);
		back.Draw();
		image.Draw();
		knightName.Draw();

		star.Draw();
		armname.Draw();
		attack.Draw();
		attackText.Draw();
		life.Draw();
		lifeText.Draw();
		trooplimit.Draw();
		trooplimitText.Draw();
		description.Draw();
		require.Draw();
		
		rampageCount.Draw();
	
		rampageSword.Draw();
		rampageGreaves.Draw();
	 	rampageHelmet.Draw();
	 	rampageShield.Draw();
	 	rampageBreastplate.Draw();
	
	 	rampageThree.Draw();
	 	rampageThreeResult.Draw();
	 	rampageThreeMark.Draw();
		rampageThreeResultPoint.Draw();
	 	rampageThreeMarkPoint.Draw();
	 	
		rampageFive.Draw();
		rampageFiveResult.Draw();
		rampageFiveMark.Draw();
		rampageFiveResultPoint.Draw();
		rampageFiveMarkPoint.Draw();
		
		if (arm.IsShowBase) {
			for (var m = 0; m < skillTexts.length; m++) {
				if(skillTexts[m] != null)
					skillTexts[m].Draw();
			}
			IsShowRingBase=true;
			
		}else{
			IsShowRingBase=false;
			for( var i:int = 0;i<arm.ArmSkills.Count;i++)
			{
				if(skills[i] != null)
					skills[i].Draw();
				if(skillTexts[i] != null)
					skillTexts[i].Draw(); 
				if(skillDirections[i] != null)
					skillDirections[i].Draw();
			}
		}
		for (var k = 0; k < ringSkills.length; k++) {
			ringSkills[k].Draw();
		}
		if (arm.IsShowBase) {
			closeBtn.Draw();
		}
		for(var j:int =0;j< 3;j++)
		{
			armDirections[j].Draw();
		}
		
		for(var o:UIObject in created)
		{
			if(o != null)
				o.Draw();
		}
		
						
		GUI.EndGroup();
	}
	private function WithinRect(r:Rect,texture2d:Texture2D):Rect
	{
		var rt:Rect = new Rect();
		if(texture2d == null) return rt;
		return WithinRect(r,texture2d.width,texture2d.height);
	}
	private function WithinRect(r:Rect,width:double,height:double):Rect
	{
		var rect:Rect = new Rect();
		
		var dw:double = width;
		var dh:double = height;
		
		var bw:double = r.width;
		var bh:double = r.height;
		
		var dp:double = dh / dw;
		var bp:double = bh / bw;
		
		if(dp > bp)
		{
			dh = bh;
			dw = dh / dp;
		}
		else if(dp < bp)
		{
			dw = bw;
			dh = dw * dp;
		}
		else
		{
			dw = bw;
			dh = bh;
		}
		
		rect.width = dw;
		rect.height = dh;
		rect.x = r.x + bw / 2 - dw / 2;
		rect.y = r.y + bh / 2 - dh / 2;
		
///		rect.x = r.x + bw / 2 - dw / 2;
//		rect.y = r.y + bh / 2 - dh / 2;
//		rect.width = dw;
//		rect.height = dh;
		return rect;
	}
	
}
