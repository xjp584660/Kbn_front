using UnityEngine;
using System.Collections;

public class GearGacha : TabContentUIObject
{
	public TabControl tabControl;

	public override void Init()
	{
		InitTabControl();
	}

	private void InitTabControl()
	{
		tabControl.Init();
		string[] toolBarNames = new string[2];
		toolBarNames[0] = KBN.Datas.getArString("Common.EquipmentReset_Sub1");
		toolBarNames[1] = KBN.Datas.getArString("Common.EquipmentReset_Sub2");
		tabControl.ToolBarNames = toolBarNames;

		tabControl.toolBar.styles[0].normal.background = TextureMgr.instance().LoadTexture("tab_big_normal",TextureType.BUTTON);
		tabControl.toolBar.styles[0].onNormal.background = TextureMgr.instance().LoadTexture("tab_big_down",TextureType.BUTTON);

		tabControl.toolBar.styles[1].normal.background = TextureMgr.instance().LoadTexture("tab_big_normal",TextureType.BUTTON);
		tabControl.toolBar.styles[1].onNormal.background = TextureMgr.instance().LoadTexture("tab_big_down",TextureType.BUTTON);
 

	}


	public override void Update()
	{
		tabControl.Update();
	}
	public override int Draw()
	{
		tabControl.Draw();
		return 0;
	}

	public override void OnPush(object param)
	{
		tabControl.OnPush(param);
	}

	public override void OnPop()
	{
		tabControl.OnPop();
	}
	public override void OnPopOver()
	{
		tabControl.OnPopOver();
	}
    
	public override void OnInActive ()
	{
		base.OnInActive ();
		tabControl.Items[tabControl.MappingIndex].OnInActive();
	}

	public override void OnSelect ()
	{
		base.OnSelect ();
		tabControl.Items[tabControl.MappingIndex].OnSelect();
	}

	public override bool RefuseTabSwitch ()
	{
		for (int i = 0; i < tabControl.Items.Length; i++) {
			if (tabControl.Items[i].RefuseTabSwitch())
				return true;
		}
		return base.RefuseTabSwitch();
	}

	public bool RefuseBackButton()
	{
		for (int i = 0; i < tabControl.Items.Length; i++) {
			var gachaReset = tabControl.Items[i] as GearGachaReset;
			if (null != gachaReset && gachaReset.RefuseBackButton())
				return true;
		}
		return false;
	}
}
