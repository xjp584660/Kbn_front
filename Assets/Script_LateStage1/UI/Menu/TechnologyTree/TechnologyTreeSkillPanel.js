import System.Collections.Generic;

public class TechnologyTreeSkillPanel extends ListItem
{
	public var rowItem : TechnologyTreeRowItem;

	private var regions : List.<TechnologyTreeRowItem>;	

	public function SetPreposeSkillDownLine(skillID : int, isUnlock : boolean) : void
	{
		for(var j : int = 0; j < regions.Count;++j)
		{
			regions[j].SetPreposeSkillDownLine(skillID,isUnlock);
		}
	}

	public function Init()
	{
		rowItem.Init();
		regions = new List.<TechnologyTreeRowItem>();
	}

	public function Update()
	{

	}

	public function Draw()
	{
		GUI.BeginGroup(rect);
		for(var i : int = 0; i < regions.Count;i++)
		{
			regions[i].Draw();
		}
		GUI.EndGroup();
	}

	public function updateData(param:Object)
	{
		regions = new List.<TechnologyTreeRowItem>();
		var skillType : int = _Global.INT32(param);
		var skills : System.Collections.Generic.List.<OneRowSkill> = GameMain.GdsManager.GetGds.<GDS_TechnologyShow>().GetRowSkills(skillType);
		var count : int = skills.Count;
		
		var mScaleX:float = GetScreenScale().x;
		var mScaleY:float = GetScreenScale().y;
		
		
		for(var i : int = 0; i < count ;i++)
		{			
			var skillItem : TechnologyTreeRowItem = Instantiate(rowItem);
			var gameObj : GameObject = skillItem.gameObject;
			gameObj.transform.parent = this.gameObject.transform;
			
			if(i == 0)
			{
				skillItem.Init(skills[i],1);
			}
			else if(i == count - 1)
			{
				skillItem.Init(skills[i],999);
			}
			else
			{
				skillItem.Init(skills[i],0);
			}
			
			AddItem(skillItem);
			regions.Add(skillItem);
		}
	}

	function FixedUpdate()
	{
		
	}

	public function Clear()
	{
		if (regions == null) {
    		return;
    	}
    	for (var region : TechnologyTreeRowItem in regions) {
    		if (region == null) {
    			continue;
    		}
    		UnityEngine.Object.Destroy(region.gameObject);
    	}
    	regions.Clear();
	}
}