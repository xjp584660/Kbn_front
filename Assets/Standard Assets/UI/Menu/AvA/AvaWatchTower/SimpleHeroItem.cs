using UnityEngine;
using System.Collections;

using _Global = KBN._Global;
using HeroInfo = KBN.HeroInfo;

public class SimpleHeroItem : ListItem
{
    [SerializeField]
    private Label bg;
    [SerializeField]
    private Label frame;

    public override void Init()
    {
        base.Init();
        frame.setBackground("ui_hero_frame", TextureType.DECORATION);
    }

    public override void SetRowData(object data)
    {
        var rawData = data as AvaIncomingAttackDetailData.Hero;
        var heroInfo = new HeroInfo(0, 0);
        heroInfo.Type = rawData.TypeId;
        this.icon.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.Head);
        bg.tile = TextureMgr.instance().GetHeroSpt().GetTile(heroInfo.HeadBack);
        this.description.txt = "Lv " + rawData.Level;
    }

    public override int Draw()
    {
        if (!this.isVisible())
        {
            return -1;
        }
        GUI.BeginGroup(this.rect);
        frame.Draw();
        bg.Draw();
        GUI.EndGroup();
        base.Draw();
        return -1;
    }
}
