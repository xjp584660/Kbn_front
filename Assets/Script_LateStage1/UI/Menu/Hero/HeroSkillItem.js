public class HeroSkillItem extends ListItem
{
	@SerializeField
	private var panelBackground : Label;
	@SerializeField
	private var captionBackground : Label;
	@SerializeField
	private var caption : Label;
	@SerializeField
	private var comment : Label;
	@SerializeField
	private var content : Label;
    @SerializeField
	private var affect : Label;
    @SerializeField
    private var level : Label;
    @SerializeField
    private var levelGrey : Label;
    @SerializeField
    private var attack : Label;
    @SerializeField
    private var attackGrey : Label;
    @SerializeField
    private var health : Label;
    @SerializeField
    private var healthGrey : Label;
    @SerializeField
    private var load : Label;
    @SerializeField
    private var loadGrey : Label;
    @SerializeField
	private var btnLevelUp : Button;
	
	@SerializeField
	private var btnTips : Button;

    @SerializeField
    private var iconPositionX : float[];

	private var heroSkill : KBN.HeroSkill = null;
	private var heroInfo : KBN.HeroInfo = null;
	private var m_OldLevel : int = 0;
	private var m_deltaTime : double = 0;
	private var m_bStartAnim : boolean = false;
	private var m_bIsInit:boolean = false;
	@SerializeField private var ANIMATION_DURATION:float;

	public function Init() : void
	{
	    level.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_level");
	    levelGrey.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_level_grey");
	    attack.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_attack");
	    attackGrey.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_attack_grey");
	    health.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_health");
	    healthGrey.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_health_grey");
	    load.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_load");
	    loadGrey.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_load_grey");
	    btnLevelUp.setNorAndActBG("button_skillup_normal","button_skillup_down");
	    btnLevelUp.OnClick = OnLevelUp;
	}

	public function Update() : void
	{
		UpdateLevelAnimation();
	}
	
	public function Draw() : int
	{
		if (heroSkill == null)
		{
			return;
		}
		
		GUI.BeginGroup(rect);
		panelBackground.Draw();
		captionBackground.Draw();
		caption.Draw();
		comment.Draw();
		content.Draw();
		affect.Draw();
		btnLevelUp.Draw();
		if (heroSkill.AffectByLevel)
		{
		    if (heroSkill.Actived)
		    {
		        level.Draw();
		    }
		    else
		    {
		        levelGrey.Draw();
		    }
		}
		if (heroSkill.AffectByAttack)
		{
		    if (heroSkill.Actived)
		    {
		        attack.Draw();
		    }
		    else
		    {
		        attackGrey.Draw();
		    }
		}
		if (heroSkill.AffectByHealth)
		{
		    if (heroSkill.Actived)
		    {
		        health.Draw();
		    }
		    else
		    {
		        healthGrey.Draw();
		    }
		}
		if (heroSkill.AffectByLoad)
		{
		    if (heroSkill.Actived)
		    {
		        load.Draw();
		    }
		    else
		    {
		        loadGrey.Draw();
		    }
		}
		btnTips.Draw();
		GUI.EndGroup();

	   	return -1;
	}

	public function SetRowData(data : Object) : void
	{
	    heroSkill = data as KBN.HeroSkill;
	    heroInfo = KBN.HeroManager.Instance.GetHeroInfoByType(heroSkill.Type/100);
	    if (heroSkill == null )
	    {
	    	return;
	    }
	    m_OldLevel = heroSkill.Level;
	    UpdateData();
	    UpdateLevel();
	}
	
	private function UpdateLevelAnimation()
	{
		if(m_bStartAnim)
		{
			m_deltaTime += Time.deltaTime;
			caption.SetNormalTxtColor(FontColor.Button_White);
			if(m_deltaTime > ANIMATION_DURATION && m_deltaTime <= 2*ANIMATION_DURATION)
			{
				caption.SetNormalTxtColor(FontColor.Description_Dark);
			}
			else if (m_deltaTime > 2*ANIMATION_DURATION && m_deltaTime <= 3*ANIMATION_DURATION)
			{
				caption.SetNormalTxtColor(FontColor.Button_White);
			}
			else if(m_deltaTime > 3*ANIMATION_DURATION)
			{
				m_deltaTime = 0;
				m_bStartAnim = false;
				caption.SetNormalTxtColor(FontColor.Description_Dark);
				UpdateLevel();
			}
			
		}
		
	}
	
	public function UpdateData()
	{
		if(m_OldLevel != heroSkill.Level)
		{
			m_OldLevel = heroSkill.Level;
			m_bStartAnim = true;
			m_deltaTime = 0;
		}
		 if(heroSkill.IsMaxLevel 
	    	|| (heroInfo!=null &&heroSkill.Level >= heroInfo.ElevateMaxSkillLevel(heroInfo.Elevate) ) 
	    	|| !GameMain.singleton.IsHeroSkillLevelUpOpened() )
	    {
	    	btnLevelUp.SetVisible(false);
	    }
	    else if(heroInfo == null || heroInfo.Status == KBN.HeroStatus.Locked)
	    {
	    	btnLevelUp.SetVisible(false);
	    }
	    else
	    {
	    	btnLevelUp.SetVisible(true);
	    }
	
	    caption.SetNormalTxtColor(heroSkill.Actived ? FontColor.Light_Yellow : FontColor._Title2_);
	    content.txt = heroSkill.Description;
	    affect.SetNormalTxtColor(heroSkill.Actived ? FontColor.Light_Yellow : FontColor._Title2_);
		content.SetNormalTxtColor(heroSkill.Actived ? FontColor.Light_Yellow : FontColor._Title2_);
		
		//if(!this.m_bIsInit)
		if(!this.m_bIsInit&&this.heroSkill.ShowTips)
		{
			var minwidth:float = 0;
			var maxwidth:float = 0;
			var offset:float =  -4.5f; 
			content.mystyle.CalcMinMaxWidth(GUIContent(heroSkill.Description), minwidth, maxwidth);
			var offsetNum:int = Math.Ceiling(maxwidth/100);
			if(maxwidth > content.rect.width)
			{
				var perNum:int = Math.Ceiling(maxwidth/content.rect.width);
				var xlength:float = maxwidth - ((perNum - 1) *this.content.rect.width );
				this.btnTips.rect = new Rect( content.rect.x + xlength + 15 , this.content.rect.y +((perNum-1)*this.content.mystyle.lineHeight),25,25);
			}
			else{
				this.btnTips.rect = new Rect(content.rect.x + maxwidth + (offset*offsetNum),content.rect.y,25,25);
			}
			this.btnTips.SetVisible(true);
			this.btnTips.OnClick = this.OnCLickTips;
			this.m_bIsInit = true;
		}
	

	    if (!heroSkill.Actived || heroSkill.ConditionType == KBN.HeroSkillConditionType.Hero || heroSkill.ConditionType == KBN.HeroSkillConditionType.Gear)
	    {
	    	comment.txt = heroSkill.ActiveMessage;
	    	comment.SetNormalTxtColor(heroSkill.Actived ? FontColor.Milk_White : FontColor.Red);
	    }
	    else
	    {
	    	comment.txt = String.Empty;
	    }
	    
	    var index : int = 0;
	    if (heroSkill.AffectByLevel)
		{
			level.rect.x = iconPositionX[index];
			levelGrey.rect.x = iconPositionX[index];
			index++;
		}
		if (heroSkill.AffectByAttack)
		{
		    attack.rect.x = iconPositionX[index];
			attackGrey.rect.x = iconPositionX[index];
			index++;
		}
		if (heroSkill.AffectByHealth)
		{
		    health.rect.x = iconPositionX[index];
			healthGrey.rect.x = iconPositionX[index];
			index++;
		}
		if (heroSkill.AffectByLoad)
		{
		    load.rect.x = iconPositionX[index];
			loadGrey.rect.x = iconPositionX[index];
			index++;
		}
		affect.txt = Datas.getArString(index <= 0 ? "HeroHouse.Detail_SkillAffectNone" : "HeroHouse.Detail_SkillAffect");
	}
	
	private function UpdateLevel()
	{
		if(heroSkill.IsMaxLevel 
	    	|| (heroInfo!=null &&heroSkill.Level >= heroInfo.ElevateMaxSkillLevel(heroInfo.Elevate) ) 
	    	|| !GameMain.singleton.IsHeroSkillLevelUpOpened() )
	    {
	    	caption.txt = heroSkill.Name + " " + Datas.getArString("HeroSkill.LevelUp_MaxLv");
	    	btnLevelUp.SetVisible(false);
	    }
	    else if(heroInfo == null || heroInfo.Status == KBN.HeroStatus.Locked)
	    {
	    	var strUnlockSkillLevel:String = String.Format(Datas.getArString("HeroSkill.Level"),heroSkill.Level);
	    	caption.txt = heroSkill.Name + " " + strUnlockSkillLevel;
	    	btnLevelUp.SetVisible(false);
	    }
	    else
	    {
	    	var strSkillLevel:String = String.Format(Datas.getArString("HeroSkill.Level"),heroSkill.Level);
	    	caption.txt = heroSkill.Name + " " + strSkillLevel;
	    	btnLevelUp.SetVisible(true);
	    }
	    
	    caption.SetNormalTxtColor(heroSkill.Actived ? FontColor.Light_Yellow : FontColor._Title2_);
	}
	
	private function OnLevelUp()
	{
		if(heroInfo == null) return;
		if(heroInfo.Status == KBN.HeroStatus.Marching)
		{
			if( handlerDelegate)
			{
				handlerDelegate.handleItemAction(Constant.Action.HERO_MARCHING,null);
			}
			return;
		}
		MenuMgr.getInstance().PushMenu("HeroSkillLevelUpMenu", heroSkill, "trans_zoomComp");
	}

	private function OnCLickTips()
	{
		var temprect:Rect = this.btnTips.GetAbsoluteRect();
		if (temprect!=null)
		{
		    var x:float = temprect.x + (temprect.width/2);
			var y:float = temprect.y + (temprect.height/2);

			var msg:String = String.Format(Datas.getArString("HeroSkill.Tips_Effect1005"),getTroopNum(1),getTroopNum(2),getTroopNum(3),getTroopNum(4),getTroopNum(5),getTroopNum(6));
			MenuMgr.getInstance().PushTips(msg, x,y);
		}
	
	}

	@Space(30) @Header("----------英雄技能等级数值系数----------") 
	@SerializeField private var paramsArr: float[] = [1.0f, 2.0f, 4.0f, 6.0f, 9.0f, 11.0f, 13.0f, 15.0f, 17.0f];
	
	private function getTroopNum(num:int):int
	{
		if(this.heroInfo==null||this.heroSkill==null)
		  return 0;
		if(num > this.heroSkill.Level&&(!this.IsEffectSkill(this.heroSkill.SkillId)||this.heroSkill.Level == 1 ) )
		{
			return 0;
		}
		else if(this.IsEffectSkill(this.heroSkill.SkillId))
		{
			if(num >this.heroSkill.Level + 1)
			return 0;
		}
		var tempParam:float = 1f;
		if(this.heroSkill.Level == 6 &&IsEffectSkill(this.heroSkill.SkillId)){
			
			tempParam = 1.22f;
		}else if(this.heroSkill.Level >= 7)
		{
			if(IsEffectSkill(this.heroSkill.SkillId))
			    tempParam = 1.22f * 1.22f;
			else{
				tempParam = 1.22f;
			}
		}
		// _Global.LogWarning("tempParam"+tempParam);
		var arr1:String[] = this.heroInfo.Troop_Type[0].Split('_'[0]);
		// _Global.LogWarning("tempParam"+int.Parse(arr1[1])+" "+int.Parse(arr1[2]));

		var num1:float = (int.Parse(arr1[1]) + int.Parse(arr1[2])*this.heroInfo.Attack) * tempParam;
		var arr2:String[] = this.heroInfo.Troop_Type[1].Split('_'[0]);
		var num2:float = (int.Parse(arr2[1]) + int.Parse(arr2[2])*this.heroInfo.Health) * tempParam;
		var arr3:String[] = this.heroInfo.Troop_Type[2].Split('_'[0]);
		var num3:float = (int.Parse(arr3[1]) + int.Parse(arr3[2])*this.heroInfo.Load) * tempParam;
		var numTotal:float = num1 + num2 + num3;
		var tempParam2:int = IsEffectSkill(this.heroSkill.SkillId) && this.heroSkill.Level != 1? this.heroSkill.Level + 1: this.heroSkill.Level;
		if(tempParam2 > this.paramsArr.length){
			tempParam2 = 6;
		}
		// _Global.LogWarning("arr1"+numTotal);
		return  numTotal * ((this.paramsArr[tempParam2-1]/this.paramsArr[num-1]));
	}

	private function IsEffectSkill(skillId:int):Boolean
	{
       return skillId == 10701||skillId == 10702||skillId == 10801||skillId == 10802;
	}
}
