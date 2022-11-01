using UnityEngine;
using System.Collections;
using KBN;

public class AllianceSkillBottomItem : UIObject 
{
	[SerializeField] private SimpleLabel backImage;
	[SerializeField] private SimpleLabel points;
	[SerializeField] private SimpleLabel pointsValue;
	[SerializeField] private SimpleLabel descTxt;

	public override void Init()
	{
		base.Init();
		backImage.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("tool bar_bottom", TextureType.BACKGROUND);
		pointsValue.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("AP_icon", TextureType.DECORATION);
		points.txt = Datas.getArString ("Alliance.allianceskill_permanent_homeskill_Allianceeap");
		pointsValue.txt = "";
		descTxt.txt = "";
		Vector2 _size = points.mystyle.CalcSize(new GUIContent (points.txt));
		pointsValue.rect.x = points.rect.x + _size.x + 5;
	}
	
	public override int Draw()
	{
		GUI.BeginGroup(rect);
		backImage.Draw ();
		if(pointsValue.txt != "")
		{
			points.Draw ();
			pointsValue.Draw ();
		}

		descTxt.Draw ();
		GUI.EndGroup();
		return -1;
	}

	public string txt
	{
		set{
			pointsValue.txt = value;
		}
		
		get{
			return pointsValue.txt;
		}
	}

	public string desc
	{
		set{
			descTxt.txt = value;
		}
		
		get{
			return descTxt.txt;
		}
	}
}
