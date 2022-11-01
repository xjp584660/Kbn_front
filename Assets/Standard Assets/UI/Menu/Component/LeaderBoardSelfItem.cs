using UnityEngine;
using System.Collections;

public class LeaderBoardSelfItem : UIObject 
{
	[SerializeField] private SimpleLabel rank;
	[SerializeField] private SimpleLabel name;
	[SerializeField] private SimpleLabel score;
	[SerializeField] private SimpleLabel backImage;
	public override void Init()
	{
		base.Init ();
		backImage.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("ui_hero_tiao", TextureType.DECORATION);
	}

	public override int Draw()
	{
		GUI.BeginGroup(rect);
		backImage.Draw ();
		rank.Draw ();
		name.Draw ();
		score.Draw ();
		GUI.EndGroup();
		return -1;
	}

	public override void Update()
	{
	}

	public int Rank
	{
		set{
			rank.txt = value+"";
		}
	}

	public string Name
	{
		set{
			name.txt = value;
		}
	}

	public long Score
	{
		set{
			score.txt = value+"";
		}
	}
}
