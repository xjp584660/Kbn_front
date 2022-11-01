


public class MountPanel extends UIObject
{
	public var item:KnightInfoEquipItem;
	@SerializeField
	private var panels:StonePanel[];
	
	public override function Init()
	{
		item.Init();
		InitPanel();
	}
	public function Init(p : StonePanel[])
	{
		item.Init();
		panels = p;
		InitPanel();
	}
	private function InitPanel()
	{
		for(var i:int = 0; i < panels.length;i++)
		{
			panels[i].Init();
			GestureManager.Instance().RegistTouchable(panels[i]);
		}	
	}
	private function UpdatePanels()
	{	
		for(var i:int = 0; i < panels.length;i++)
		{
			panels[i].Update();
		}
		
	}
	private function DrawPanels()
	{
		for(var i:int = 0; i < panels.length;i++)
		{
			panels[i].Draw();
		}		
	}

	public function Update()
	{
		UpdatePanels();
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		DrawArmInformation();
		DrawPanels();
		GUI.EndGroup();
	}
	
	private function DrawArmInformation()
	{
		item.Draw();
	}
	
	public function SetUIData(data:System.Object)
	{
		var d:KnightInfoEquipItem.UIData = data as KnightInfoEquipItem.UIData;
		if(data == null) return;
		item.SetUIData(data);
		SetPanels(d.arm);
	}
	
	public function OnPopOver():void 
	{
		this.item.OnPopOver();
		if(this.panels != null)
		{
			for(var i:int = 0;i<this.panels.length;i++)
			{
				this.panels[i].OnPopOver();
			}
		}
		UIObject.TryDestroy(this);
	}
	
	public function OnPush(param:Object)
	{
		var arm:Arm = GearData.Instance().CurrentArm;
		SetPanels(arm);
	}
	public function SetPanels(arm:Arm)
	{
		if(arm != null)
		{
			var n:int = Mathf.Min(arm.Skills.Count,panels.length);
			for(var i:int = 0; i < n;i++)
			{
				panels[i].Skill = arm.Skills[i];
				panels[i].Active = GearManager.Instance().IsReadyForMount(arm,arm.Skills[i]);
				panels[i].SkillActive = false;			
				//GearManager.Instance().SetAdditionText(panels[i]);
			}
			
		}
		
	}
	
	
}