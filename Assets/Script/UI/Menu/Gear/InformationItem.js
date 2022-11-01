


public class InformationItem extends ListItem
{
	public var line:Label;
	public var target:TargetLabel;
	public var skilllabel:ArmSkillLabel;
	public var attack:Label;
	
	
	private var skill:ArmSkill; 
	private var targetlabels:List.<TargetLabel> = null; 
	private var attacks:List.<Label> = null; 
	
	public function get Skill():ArmSkill
	{
		return skill;
	} 
	
	public function set Skill(value:ArmSkill)
	{
		skill = value;
		OnChanged(skill);
	}
	private function OnChanged(skill:ArmSkill)
	{
		CreateTargets(skill);
		
		
		
	}
	private function CreateTargets(skill:ArmSkill)
	{
		if(skill == null) return;
		var targets:int[] = GearManager.Instance().GetTargets(skill);
		if(targets == null) return;
		var num = targets.length;
		DestroyResource();
		targetlabels.Clear();
		for(var j:int = 0; j < num; j++)
		{
			var t:TargetLabel = GameObject.Instantiate(target); 
			targetlabels.Add(t);
			t.rect = new Rect(150,20 + j * 32,115,38);
			t.Init(); 
			t.DrawName = true;
			t.ID = targets[j];
		}
	}
	
	public function Init()
	{
		line.Init();
		line.rect.x = 0; 
		line.rect.height = 5;
		line.rect.y = rect.height - line.rect.height;
		line.rect.width = rect.width;
		
		targetlabels = new List.<TargetLabel>();
	}
	
	public function Update()
	{
		line.Update();
	}
	
	public function Draw()
	{
		line.Draw();
	} 
	
	private function DestroyResource()
	{
		if(targetlabels != null)
		{
			var n:int = targetlabels.Count;
			for(var i:int = 0;i<n;i++)
			{
				UIObject.TryDestroy(targetlabels[i]);
			}
		}
		
	}
	
	public function OnPopOver()
	{
		DestroyResource();
	}
	
	
	
	
}