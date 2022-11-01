using UnityEngine;
using System.Collections;
using KBN;
public class AllianceLevelUpMenu : KBNMenu 
{
	[SerializeField] private SimpleLabel light;
	[SerializeField] private SimpleLabel allianceIcon;
	[SerializeField] private NormalTipsBar tip;
	[SerializeField] private SimpleLabel blackBack;
	[SerializeField] private SimpleLabel redBack;
	[SerializeField] private SimpleLabel levelUpTitle;
	[SerializeField] private SimpleLabel levelUpDesc;
	public override void Init ()
	{
		light.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("payment_light", TextureType.DECORATION);
		allianceIcon.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("icon_alliance_Invite", TextureType.ICON);
		blackBack.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("square_black", TextureType.BACKGROUND);
		redBack.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("redHalo", TextureType.DECORATION);
		tip.Init();
		levelUpTitle.txt = Datas.getArString("Common.LevelUp_title");
	}
	
	public override int Draw ()
	{
//		tip.Draw ();
		GUI.BeginGroup(rect);
		blackBack.Draw ();
		redBack.Draw ();
		light.Draw ();
		allianceIcon.Draw ();
		levelUpTitle.Draw ();
		levelUpDesc.Draw ();
		GUI.EndGroup();
		return -1;
	}
	
	public override void Update ()
	{
		tip.Update();
		rect = tip.rect;
		rect.y = tip.animationRect.y + (tip.animationRect.height - rect.height) / 2f;
		if(!tip.IsShow())
		{
			MenuMgr.instance.PopMenu("AllianceLevelUpMenu");
		}
	}

	public override void OnPush(object param)
	{
		tip.Show();
		levelUpDesc.txt = _Global.ToString(param);
	}
}
