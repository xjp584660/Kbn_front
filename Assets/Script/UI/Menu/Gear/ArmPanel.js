

public class ArmPanel extends UIObject
{
	public var centerArm:GearScrollViewItem;
	
	public var centerBack:Label;
	public var centerFore:Label;
		
	public var skills: ArmSkillButton[];
	//public var stars: Label[];
	//public var starActives:Label[];
	
	public var LevelExperence:int[];
	
	private var canShowArm:boolean;
	
	private var m_ringPercent : RingPercentPainter;
	public var m_ringRect : Rect;	//	158,278,320,280
	
	private var levels:double[];
	public var tip:ArmSkillTip;
	public var armtip:GearArmTip;
	
	public var blocks:Label[];
	public var connectors:Label[];
	public var experenceLabel:Label;
	public var star:StarLevel;
	//======================================================================================================
	//init
	public function Init()
	{
		InitMain();
		//InitStar();
		InitSkill();
		InitRing();
		InitLevels();
		tip.Init();
		InitBlocks();
		InitConnectors();
		maxSkillNumber = Constant.Gear.ArmSkillNumber;
	}
	
	private function InitExperence()
	{
		experenceLabel.Init();
		
	}
	
	private function InitStar()
	{
		star.Init();
	}
	private function InitRing()
	{
		m_ringPercent = new RingPercentPainter();
		m_ringPercent.Percent = 0.0f; //default is zero
		m_ringPercent.Tex = TextureMgr.instance().LoadTexture("progress_rate_red", TextureType.GEAR);
		
	}
	
	private function InitMain()
	{
		centerBack.Init();
		centerFore.Init();
		
		centerBack = GearManager.Instance().SetImage(centerBack,"Forging_disc_bg");
		centerFore = GearManager.Instance().SetImage(centerFore,"Forging_disc");
		
		canShowArm = true;
	}
	
	private function InitBlocks()
	{
		if(blocks == null) return;
		for(var i:int = 0;i<blocks.length;i++)
		{
			blocks[i].Init();
			blocks[i] = GearManager.Instance().SetImage(blocks[i],"Forging_disc_stuck"+i);
		}
		
	}
	
	private function InitConnectors()
	{
		if(connectors == null) return;
		for(var i:int = 0;i<connectors.length;i++)
		{
			connectors[i].Init();
			connectors[i] = GearManager.Instance().SetImage(connectors[i],"Forging_out_" + i);
		}
		
	}
	
	private function DrawBlocks()
	{
		if(blocks == null) return;
		for(var i:int = 0;i<blocks.length;i++)
		{
			blocks[i].Draw();
		}
		
	}
	private function DrawConnectors()
	{
		if(connectors == null) return;
		for(var i:int = 0;i<connectors.length;i++)
		{
			connectors[i].Draw();
		}
		
	}
	
	
	private function InitSkill()
	{ 
		for(var skill:ArmSkillButton in skills) 
		{
			skill.Init();
			skill.IsShowSkill = true;
			GestureManager.Instance().RegistTouchable(skill);
		}
	}



	public function set CanShowArm(value:boolean)
	{
		canShowArm = value;	
	}
	//======================================================================================================
	//levels
	private function InitLevels()
	{
		levels = new double[5];
		levels[0] = 0.0f;
		levels[1] = 0.165f;
		levels[2] = 0.297f;
		levels[3] = 0.492f;
		levels[4] = 0.765f;
	}
	//======================================================================================================
	//update	

	public function Update()
	{

		star.Update();
	} 
	//======================================================================================================
	 
	//======================================================================================================
	//draw 
	
	//LevelExperence
	public function Draw()
	{
	
		GUI.BeginGroup(rect);
		
		centerBack.Draw();
		
		centerFore.Draw();
		DrawConnectors();
		m_ringPercent.DrawTexture(m_ringRect);
		
		
		DrawProgress();
		
		DrawBlocks();
		experenceLabel.Draw();
		star.Draw();
		
		GUI.EndGroup();
		
		if(canShowArm && centerArm != null)
			centerArm.Draw();
			
		tip.Draw();
		
	}
	
	private function CalculateMaxSkillNumber(arm:Arm)
	{
		if(arm == null) return;
		var drawBlock:boolean = false;
		for(var k:int =0;k < skills.length;k++) 
		{
			blocks[k].SetVisible(false);
			if(skills[k].Skill.ID == Constant.Gear.NullSkillID)
			{
				if(!drawBlock) 
				{
					drawBlock = true;
					if(k >= 1)
					{
						blocks[k-1].SetVisible(true);
					}
					maxSkillNumber = k;
				}
				
			}
			
		}
		if(!drawBlock)
		{
			maxSkillNumber = Constant.Gear.ArmSkillNumber;
			if(maxSkillNumber-1 < blocks.length)
				blocks[maxSkillNumber-1].SetVisible(true);
		}
		
	}
	
	private function ProgressOnArmChanged(experence:int)
	{
		
		
		for(var k:int =0;k < skills.length;k++) 
		{ 
			if(skills[k] == null) continue;
			if(skills[k].Skill == null) continue;
			if(skills[k].Skill.ID == Constant.Gear.NullSkillID)
			{
				skills[k].IsDefault = true;
				skills[k].IsShowSkill = false;
				connectors[k].SetVisible(false);
			}
			else
			{
				skills[k].IsDefault = false;
				skills[k].IsShowSkill = true;
				connectors[k].SetVisible(true);
				
				if(LevelExperence.length > k + 1)
				{
					if(experence >= LevelExperence[k+1]) 
						skills[k].Active = true; 
					else 
						skills[k].Active = false; 
				}
				else 
					skills[k].Active = false; 
			}
		}

	}
	private function DrawProgress()
	{
		for(var k:int =0;k < skills.length;k++) 
		{ 
			skills[k].Draw();
		}		
	}
	//======================================================================================================
	//destroy
	public function OnPopOver()
	{
		
	}
	//======================================================================================================
	//arm
	private var arm:Arm;
	public function OnCurrentArmChanged(o:Arm,n:Arm)
	{
		if(n == null) return;

		CalculateCenterArm(n);
		CalculateLevelExperence(n);
		CalculateMaxSkillNumber(n); 
		ProgressOnArmChanged(n.Experence);
		Experence = n.Experence;
		
	}
	private function CalculateCenterArm(arm:Arm)
	{
		if(arm == null) return;
		if(centerArm != null)
		{
			
			centerArm.OnPopOver();
		}	
		centerArm = KBN.GearItems.Instance().CreateKnightArmItem(arm);
		centerArm.rect = new Rect(centerFore.rect);

		centerArm.rect.width = centerFore.rect.width / 4 * 3;
		centerArm.rect.height = centerFore.rect.height / 4 * 3;
		
		centerArm.rect.x = centerFore.rect.x + centerFore.rect.width / 2.0f - centerArm.rect.width / 2.0f;
		centerArm.rect.y = centerFore.rect.y + centerFore.rect.height / 2.0f - centerArm.rect.height / 2.0f;
		centerArm.rect.x += rect.x;
		centerArm.rect.y += rect.y; 

		centerArm.WithinRect(centerArm.rect);		
	}
	private function CalculateLevelExperence(arm:Arm)
	{
		if(arm == null) return; 
		if(arm.Skills == null) return;
		
		LevelExperence = new int[arm.Skills.Count + 1];
		for(var i:int = 0;i<arm.Skills.Count;i++)
		{
			skills[i].Skill = arm.Skills[i];
			LevelExperence[i] = GearManager.Instance().GetArmExperence(arm.GDSID,i);
		}
		LevelExperence[i] = GearManager.Instance().GetArmExperence(arm.GDSID,i);		
	}
	private var maxSkillNumber:int = 4;
	private function SetExperenceLabel()
	{
		if(arm == null) return;
		//l:0--4
		var l:int = Mathf.Min(arm.StarLevel,maxSkillNumber);
		if(arm == null) return;
		star.Level = l;
	
		if(l >= maxSkillNumber)
			experenceLabel.txt = Datas.getArString("Gear.EquipmentMaxAttribute");
		else
			experenceLabel.txt = Datas.getArString("Gear.EquipmentEXP") + "   " + Experence + "/" + LevelExperence[l+1];
	}
	
	public function OnExperenceChanged(e:int)
	{
		Experence = e;
		ProgressOnArmChanged(e);		
	}
	private function CalculateRate(experence:int):double
	{
		var l:int = GetLevel(experence);
		
		if(l == -1) return 0.0f;
		if(l == LevelExperence.length - 1) return levels[levels.length - 1];
		if(LevelExperence.length <= l+1) return 0.0f;
		var exp:double = experence - LevelExperence[l];
		var total:double = LevelExperence[l + 1] - LevelExperence[l];
		var total2:double = levels[l+1] - levels[l];
		return exp / total * total2 + levels[l];
	}
	
	private function GetLevel(experence:int):int
	{
		if(LevelExperence == null) return -1;
		for(var i:int = 0; i<LevelExperence.length; i++)
			if(experence < LevelExperence[i]) return i - 1;
		return LevelExperence.length - 1;
	}
	
	
	public function set TheArm(value:Arm)
	{
		if(value == null) return;
		
		OnCurrentArmChanged(arm,value);
		arm = value;
		SetExperenceLabel();
		UpdateRing();
	}
	
	private var experence:int;
	private var maxExperence:int;
	public function get Experence()
	{
		return experence;
	}
	private function set Experence(value:int)
	{
		experence = value;
		if(maxSkillNumber < LevelExperence.Length)
		{
			if(experence > LevelExperence[maxSkillNumber])
			{
				experence = LevelExperence[maxSkillNumber];
			}
		}
		SetExperenceLabel();
		UpdateRing();
		
	}
	private function UpdateRing()
	{
		m_ringPercent.Percent = CalculateRate(Experence);
	}
	public function CanEat():boolean
	{
		return (experence < LevelExperence[maxSkillNumber]);
	}
	
	public function GetLevelUpIndex(from:int,to:int):List.<int>
	{
		var list:List.<int> = new List.<int>();
		
		if(LevelExperence == null) return list;
		if(arm == null) return list;
		if(arm.Skills == null) return list;
		
		for(var i:int = 1;i<LevelExperence.length;i++)
		{
			if(LevelExperence[i] > from && LevelExperence[i] <= to && i > 0 && arm.Skills[i-1].ID != Constant.Gear.NullSkillID)
				list.Add(i-1);
		}
		
		return list;
	}
	
}