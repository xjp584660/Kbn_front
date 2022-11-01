public class HeroSkillViewItem extends ListItem
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
    private var iconPositionX : float[];

	private var heroSkill : KBN.HeroSkill = null;

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
	}

	public function Update() : void
	{

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
		GUI.EndGroup();

	   	return -1;
	}

	public function SetRowData(data : Object) : void
	{
	    heroSkill = data as KBN.HeroSkill;
	    if (heroSkill == null)
	    {
	    	return;
	    }
	    
	    caption.txt = heroSkill.Name;
	    caption.SetNormalTxtColor(heroSkill.Actived ? FontColor.Light_Yellow : FontColor.SmallTitle);
	    content.txt = heroSkill.Description;
	    affect.SetNormalTxtColor(heroSkill.Actived ? FontColor.Light_Yellow : FontColor.SmallTitle);
	    content.SetNormalTxtColor(heroSkill.Actived ? FontColor.Light_Yellow : FontColor.SmallTitle);
	    if (!heroSkill.Actived || heroSkill.ConditionType == KBN.HeroSkillConditionType.Hero || heroSkill.ConditionType == KBN.HeroSkillConditionType.Gear)
	    {
	    	comment.txt = heroSkill.ActiveMessage;
	    	comment.SetNormalTxtColor(heroSkill.Actived ? FontColor.Light_Yellow : FontColor.Red);
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
}
