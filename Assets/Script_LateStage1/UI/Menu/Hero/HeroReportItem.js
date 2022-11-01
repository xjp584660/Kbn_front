public class HeroReportItem extends ListItem
{
	@SerializeField
	private var heroName : Label;
	@SerializeField
	private var headBackground : Label;
	@SerializeField
	private var head : Label;
    @SerializeField
    private var frame : Label;
	@SerializeField
	private var attack : Label;
	@SerializeField
	private var health : Label;
	@SerializeField
	private var load : Label;
	@SerializeField
	private var level : Label;
	@SerializeField
	private var skillName : Label[];
	@SerializeField
	private var line : Label;
	
	public function Init() : void
	{
        attack.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_attack");
	    health.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_health");
	    load.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_load");
	}
	
	public function Update() : void
	{
	}
	
	public function Draw() : int
	{
	    GUI.BeginGroup(rect);
		heroName.Draw();
		headBackground.Draw();
		frame.Draw();
		head.Draw();
		attack.Draw();
		health.Draw();
		load.Draw();
		level.Draw();
		for (var i : Label in skillName)
		{
			i.Draw();
		}
		line.Draw();
		GUI.EndGroup();
		
		return -1;
	}
	
	public function SetRowData(data : Object) : void
	{
	    var hero : HashObject = data as HashObject;
	    if (hero == null)
	    {
	    	return;
	    }
	    
	    headBackground.tile = TextureMgr.instance().GetHeroSpt().GetTile(_Global.GetString(hero["HEADBACKGROUND_ICON"]));
	    head.tile = TextureMgr.instance().GetHeroSpt().GetTile(_Global.GetString(hero["HEAD_ICON"]));
	    heroName.txt = Datas.getArString(_Global.GetString(hero["NAME"]));
	    attack.txt =  _Global.GetString(hero["levelInfo"]["ATTACK"]);
	    health.txt = _Global.GetString(hero["levelInfo"]["LIFE"]);
	    load.txt = _Global.GetString(hero["levelInfo"]["WISE"]);
	    level.txt = String.Format(Datas.getArString("HeroHouse.Collection_Level"), _Global.GetString(hero["levelInfo"]["RENOWN_LEVEL"]));

        var skillIndex : int = 0;
        var fateIndex : int = 0;
        var skillIds : Array = _Global.GetObjectKeys(hero["skillInfo"]);
        var fateIds : Array = _Global.GetObjectKeys(hero["fateInfo"]);
		for (var i : Label in skillName)
		{
            if (skillIndex < skillIds.length)
		    {
                i.txt = Datas.getArString(_Global.GetString(hero["skillInfo"][skillIds[skillIndex]]["NAME"].Value));
                skillIndex++;
		    }
            else if (fateIndex < fateIds.length)
            {
                i.txt = Datas.getArString(_Global.GetString(hero["fateInfo"][fateIds[fateIndex]]["NAME"].Value));
                fateIndex++;
            }
	        else
	        {
                i.txt = String.Empty;
            }
		}
	}
}