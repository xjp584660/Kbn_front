using UnityEngine;
using System;
using System.Collections;

[Serializable]
public class AllianceBubbleTips : BubbleFrame {

	[SerializeField]
	private SimpleLabel lblTips;

	public string Text {
		get {
			return lblTips.txt;
		}
		set {
			lblTips.txt = value;
		}
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();

		lblTips.Draw();
	}
}
