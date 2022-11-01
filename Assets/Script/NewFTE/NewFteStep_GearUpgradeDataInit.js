#pragma strict
import JasonReflection;
class NewFteStep_UpgradeDataInit extends StepAction
{
	private var m_gearDataInList : NewFteRewards.GearData;
	private var m_gearDatasInScroll : System.Collections.Generic.Dictionary.<int, NewFteRewards.GearData> = new System.Collections.Generic.Dictionary.<int, NewFteRewards.GearData>();
	@JasonData("InList")
	public function set GearDataInList(value : NewFteRewards.GearData)
	{
		m_gearDataInList = value;
	}
	public function get GearDataInList() : NewFteRewards.GearData
	{
		return m_gearDataInList;
	}
	public function get GearDataInScroll() : System.Collections.Generic.Dictionary.<int, NewFteRewards.GearData>
	{
		return m_gearDatasInScroll;
	}

	@JasonData("InScroll")
	public function set GearDataInScroll(value : System.Collections.Generic.Dictionary.<int, NewFteRewards.GearData>)
	{
		m_gearDatasInScroll = value;
	}

	public function NewFteStep_UpgradeDataInit(data:NewFteDisplayData)
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
		var gearArmLevelUpgrade : GearArmLevelUpgrade = null;
		for ( var iPos : int = 0; iPos != armMenu.tabControl.Items.Length && gearArmLevelUpgrade == null; ++iPos )
		{
			gearArmLevelUpgrade = armMenu.tabControl.Items[iPos] as GearArmLevelUpgrade;
		}
		if ( gearArmLevelUpgrade != null )
		{
			var gearArmSelect : GearArmSelect = gearArmLevelUpgrade.ArmSelect;
			for (var id : int in m_gearDatasInScroll.Keys)
			{
				var gData : NewFteRewards.GearData = m_gearDatasInScroll[id];
				var gArm : Arm = NewFteRewards.FakeGearArm(gData);
				gArm.belongFteId = fteID;
				GearManager.Instance().GearWeaponry.AddArm(gArm);
			}
			gearArmSelect.GearListDelegate = function() : System.Collections.Generic.List.<Arm>
			{
				var rt : System.Collections.Generic.List.<Arm> = new System.Collections.Generic.List.<Arm>();
				for (var arm : Arm in GearManager.Instance().GearWeaponry.GetArms())
				{
					if ( arm.PlayerID < 0 && arm.PlayerID != gearArm.PlayerID )
						rt.Add(arm);
				}

				return rt;
			};
			gearArmSelect.UpdateCurrent();
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
