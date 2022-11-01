using UnityEngine;
using System;
using System.Collections;

using _Global = KBN._Global;
using GestureManager = KBN.GestureManager;

public class GearGachaSkillButton : Button, ITouchable {

	public Arm TheArm {get; set;}
	public int SkillID {get; set;}
	public int Position {get; set;}

	[SerializeField]
	private SimpleLabel lblHighlight;

	public bool Highlight {
		get {
			return lblHighlight.isVisible();
		}
		set {
			lblHighlight.SetVisible(value);
			if (value) {
			}
		}
	}

	public override void Init ()
	{
		base.Init ();
		lblHighlight.Init();
		lblHighlight.mystyle.normal.background = TextureMgr.instance().LoadTexture("kuang1", TextureType.DECORATION);
		lblHighlight.SetVisible(false);
	}

	public override int Draw ()
	{
		lblHighlight.Draw();
		return base.Draw ();
	}

	public void RegisterTouchable() {
		GestureManager.singleton.RegistTouchable(this);
	}

	public void RemoveTouchable() {
		GestureManager.singleton.RemoveTouchable(this);
	}

	public override int GetZOrder ()
	{
		return 1;
	}

	public override string GetName ()
	{
		return "GearGachaSkillButton";
	}

}
