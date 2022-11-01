using UnityEngine;
using System.Collections;
using KBN;
public class AvaBuffInfoItem : FullClickItem
{
	public class DataStruct
	{
		public string buffIcon;
		public string HomePercent;
		public string TilePercent;
		public DataStruct(string _buffIcon, string _HomePercent, string _TilePercent)
		{
			buffIcon = _buffIcon;
			HomePercent = _HomePercent;
			TilePercent = _TilePercent;
		}
	}
	private DataStruct itemData;

    public Label l_buffIcon;
    public Label l_skillDesc;
    public Label l_tileDesc;
    public Label l_skillAmount;
    public Label l_tileAmount;
//	public Label l_buffName;

    public override void Init()
    {
        base.Init();

        btnDefault.alpha = 0.3f;
    }

    public override void SetRowData(object data)
    {
		itemData = data as DataStruct;

        TileSprite iconSpt = TextureMgr.instance().IconSpt();

        l_buffIcon.useTile = true;
		l_buffIcon.tile = iconSpt.GetTile(itemData.buffIcon);

		l_skillDesc.txt = Datas.getArString("AVA.stats_bufffromallianceskills");
		l_tileDesc.txt = Datas.getArString("AVA.stats_bufffromtiles");

		l_skillAmount.txt = itemData.HomePercent+"%";
		l_tileAmount.txt = itemData.TilePercent+"%";
//		l_buffName.txt = ;
    }

    public override int Draw()
    {
        base.Draw();

        GUI.BeginGroup(rect);
        l_buffIcon.Draw();
        l_skillDesc.Draw();
        l_tileDesc.Draw();
        l_skillAmount.Draw();
        l_tileAmount.Draw();
//		l_buffName.Draw();
        GUI.EndGroup();

        return -1;
    }
}
