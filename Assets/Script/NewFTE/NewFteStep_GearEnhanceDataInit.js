#pragma strict
import JasonReflection;
class NewFteStep_EnhanceDataInit extends StepAction
{
	private var m_gearDataInList : NewFteRewards.GearData;
	private var m_gearDatasInScroll : System.Collections.Generic.Dictionary.<int, NewFteRewards.ItemData> = new System.Collections.Generic.Dictionary.<int, NewFteRewards.ItemData>();
	@JasonData("InList")
	public function set GearDataInList(value : NewFteRewards.GearData)
	{
		m_gearDataInList = value;
	}
	public function get GearDataInList() : NewFteRewards.GearData
	{
		return m_gearDataInList;
	}
	public function get GearDataInScroll() : System.Collections.Generic.Dictionary.<int, NewFteRewards.ItemData>
	{
		return m_gearDatasInScroll;
	}

	@JasonData("InScroll")
	public function set GearDataInScroll(value : System.Collections.Generic.Dictionary.<int, NewFteRewards.ItemData>)
	{
		m_gearDatasInScroll = value;
	}

	public function NewFteStep_EnhanceDataInit(data:NewFteDisplayData)
	{
		super(data);
	}

	public function Begin(fteID : int, fteStep : NewFteStep) 
	{
		var fteStepData : HashObject = fteStep.StepData.OrgData;
		var initData : HashObject = fteStepData[".Init"];
		var datas : HashObject = initData["Datas"];
		if ( !JasonConvertHelper.ParseToObjectOnce(this, datas) )
			return;

		var gearData : GearData = GearData.Instance();
		var gearArm : Arm = NewFteRewards.FakeGearArm(m_gearDataInList);
		gearArm.belongFteId = fteID;
		gearData.Arms = [gearArm];
		gearData.CurrentArmIndex = 0;
		GearManager.Instance().GearWeaponry.AddArm(gearArm);

		var menuMgr : MenuMgr = MenuMgr.getInstance();
		var armMenu : ArmMenu = menuMgr.getMenu("ArmMenu");
		if ( !armMenu )
		{
			super.Begin(fteID, fteStep);
			return;
		}
		
		var skillEnhancement : GearSkillEnhancement = null;
		for ( var iPos : int = 0; iPos != armMenu.tabControl.Items.Length && skillEnhancement == null; ++iPos )
		{
			skillEnhancement = armMenu.tabControl.Items[iPos] as GearSkillEnhancement;
		}
		
		if ( skillEnhancement != null )
		{
			for (var id : int in m_gearDatasInScroll.Keys)
			{
				var itemData : NewFteRewards.ItemData = m_gearDatasInScroll[id];
				MyItems.instance().AddFteFakeItem(itemData.itemId, itemData.itemCount, fteID);
			}
			
			var stoneSelect : GearStoneSelect = skillEnhancement.StoneSelect;
			stoneSelect.UpdateCurrent();
			
			if(skillEnhancement.armInformationItem != null)
			{
				skillEnhancement.armInformationItem.Data = (GearData.Instance().CurrentArm);
			}
		}
		super.Begin(fteID, fteStep);
	}

	// 
	protected function OnBeginDone()
	{
		this.Done();
	}
	
	protected function Done() 
	{
		super.Done();
	}

	public virtual function Active(active:boolean)
	{
		super.Active(active);
	}
}
