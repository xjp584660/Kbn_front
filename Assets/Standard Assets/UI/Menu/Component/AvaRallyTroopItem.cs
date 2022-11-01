using UnityEngine;
using System.Collections;
using KBN;

public class AvaRallyTroopItem : ListItem
{
	public Label l_img;
	public Label l_content;
	public Label l_title;
	public Label l_bg;
	
	public override int Draw()
	{
		GUI.BeginGroup(rect);
		
		l_bg.Draw();
		l_title.Draw();		
		l_img.Draw();	
		l_content.Draw();
		
		GUI.EndGroup();
		return -1;
	}
	
	public override void SetRowData(object data)
	{
		PBMsgAvaTileTroops.PBMsgAvaTileTroops.Unit info = data as PBMsgAvaTileTroops.PBMsgAvaTileTroops.Unit;	
		if(info!=null)
		{	
			l_content.txt =  "" + info.count;
			l_title.SetFont(FontSize.Font_20,FontType.TREBUC);
			l_title.txt = Datas.getArString("unitName."+"u" + info.unitId);
			l_img.useTile = true;
			l_img.tile = TextureMgr.instance().UnitSpt().GetTile("ui_" + info.unitId);
		}
		else
		{
			PBMsgAvaTileTroops.PBMsgAvaTileTroops.HeroInfo infoHero = data as PBMsgAvaTileTroops.PBMsgAvaTileTroops.HeroInfo;	
			if(infoHero != null)
			{
				HeroInfo heroInfo = HeroManager.Instance.GetHeroInfo(infoHero.heroId);
				if (heroInfo==null)
				{
					heroInfo = new HeroInfo(0,0);
					heroInfo.Might=_Global.INT32(heroInfo.CalculateMight(infoHero.level, infoHero.heroTypeId));
				}

				heroInfo.Type = infoHero.heroTypeId;
				l_img.useTile = true;
				l_img.tile = TextureMgr.instance().ItemSpt().GetTile(null);
				l_img.tile.name = heroInfo.HeadSmall;
				l_title.SetFont(FontSize.Font_20, FontType.TREBUC);
				l_title.txt = heroInfo.Name;
				//l_content.txt = string.Format(Datas.getArString("HeroHouse.Detail_Might"), heroInfo.CalculateMight(infoHero.level).ToString());
				l_content.txt = string.Format(Datas.getArString("HeroHouse.Detail_Might"), heroInfo.Might.ToString());
			}
		}
	}
	
}
