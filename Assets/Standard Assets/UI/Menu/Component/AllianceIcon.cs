using UnityEngine;
using System.Collections;
using KBN;

public class AllianceIcon : UIObject
{
	[SerializeField] private Label roundBack;
	[SerializeField] private Label allianceIcon;
	[SerializeField] private Label topLabel;
	[SerializeField] private Label lvLabel;
	[SerializeField] private Label txtLabel;

	public string txt
	{
		set{
			txtLabel.txt = value;
		}

		get{
			return txtLabel.txt;
		}
	}

	public override void Init()
	{
		base.Init();
		roundBack.setBackground("button-pve-bg",TextureType.DECORATION);
		allianceIcon.setBackground("icon_alliance_Invite",TextureType.ICON);
		topLabel.setBackground("Points_collected",TextureType.MAP17D3A_UI);
		lvLabel.setBackground("Button_UserInfo_lv_HD",TextureType.DECORATION);
	}

	public override int Draw()
	{
		GUI.BeginGroup(rect);
		roundBack.Draw ();
		allianceIcon.Draw ();
		topLabel.Draw ();
		lvLabel.Draw ();
		txtLabel.Draw ();
		GUI.EndGroup();
		return -1;
	}
}
