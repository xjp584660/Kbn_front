
public class TechnologySkillPanel extends UIObject
{
	public var skillPanelItem : TechnologyTreeSkillPanel;
	public var skillPanelItemClone : TechnologyTreeSkillPanel;
	public var scrollView : ScrollView;
	public var troopSubTab:ToolBar;

	public function GetSkillPanel() : TechnologyTreeSkillPanel
	{
		return skillPanelItemClone;
	}
	
	public function GetSkillPanelTabIndex() : int
	{
		//_Global.Log("TechnologySkillPanel.GetSkillPanelTabIndex index : " + (troopSubTab.selectedIndex + 1));
		return troopSubTab.selectedIndex + 1;
	}

	public function Init()
	{		
		troopSubTab.Init();
		troopSubTab.toolbarStrings = [Datas.getArString("DivinationLab.Mode_Text1"),Datas.getArString("DivinationLab.Mode_Text2")];
		troopSubTab.indexChangedFunc = TroopSubTabChanged;
		troopSubTab.selectedIndex = 0;
	}

	public function Update()
	{
		scrollView.Update();
	}

	public function Draw()
	{
		GUI.BeginGroup(rect);
		scrollView.Draw();
		troopSubTab.Draw();
		GUI.EndGroup();
	}

	public function TroopSubTabChanged(index:int)
	{
		Clear();
		
		troopSubTab.selectedIndex = index;
		
		switch(index)
		{
			case 0:
				updateData(1);
			break;
			case 1:
				updateData(2);
			break;
		}
	}

	public function updateData(param:Object)
	{
		completeResearch(param);
		scrollView.MoveToTop();    
	}
	
	public function completeResearch(param:Object)
	{
		Clear();
	
		var sort : int = _Global.INT32(param);

		troopSubTab.selectedIndex = sort - 1;

		scrollView.Init();
		skillPanelItemClone = Instantiate(skillPanelItem);
		skillPanelItemClone.Init();

		skillPanelItemClone.updateData(sort);

		scrollView.addUIObject(skillPanelItemClone);
		scrollView.AutoLayout();   
	}

	function FixedUpdate()
	{
		
	}

	public function Clear()
	{
		if(skillPanelItemClone != null)
		{
			skillPanelItemClone.Clear();
			UnityEngine.Object.Destroy(skillPanelItemClone.gameObject);
		}
	}
}