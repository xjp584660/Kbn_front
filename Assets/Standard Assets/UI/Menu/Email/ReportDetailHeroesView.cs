using UnityEngine;
using System.Collections;
using System.Text;
using System.Collections.Generic;

using Datas = KBN.Datas;
using _Global = KBN._Global;

public class ReportDetailHeroesView : ListItem
{
    public class Data
    {
		public class ReportHeroInfo
		{
	        public string name = string.Empty;
	        public string might = string.Empty;
			public string mightLost = string.Empty;
		}

		public List<ReportHeroInfo> heroInfos = new List<ReportHeroInfo>();
        public bool hasValue = false;

        public static Data Create(string nodeKey, HashObject parentNode)
        {
            Data ret = new Data();
            
            var herosObj = parentNode[nodeKey];
            if (herosObj == null)
            {
                return ret;
            }
            
            var keys = _Global.GetObjectKeys(herosObj);
            ret.hasValue = keys.Length > 0;

            for (int a = 0; a < keys.Length; a++)
            {
                string key = keys[a];
                var heroObj = herosObj[key];

				ReportHeroInfo info = new ReportHeroInfo();
       
				info.name = Datas.getArString(_Global.GetString(heroObj["NAME"]));

				if (heroObj["newDetail"]!=null)
				{
					info.might = Datas.getArString(_Global.GetString(heroObj["newDetail"]["totalMight"]));
					info.mightLost = Datas.getArString(_Global.GetString(heroObj["newDetail"]["remainMightPercentage"]))+"%";
				}
				
				ret.heroInfos.Add(info);
            }

            return ret;
        }
    }
    
    [SerializeField]
    private Label bgHero;
	[SerializeField]
	private Label titleBg;
	[SerializeField]
	private Label titleFlowerBg;
	[SerializeField]
	private Label line;
    [SerializeField]
    private Label titleHeroName;
    [SerializeField]
    private Label titleHeroMight;
	[SerializeField]
	private Label titleHeroMightLost;
    [SerializeField]
	private ReportHeroInfoItem item;

	private List<ReportHeroInfoItem> reportHeroInfoItems = new List<ReportHeroInfoItem>();
	public int BottomPadding = 10;

    public override void Init()
    {
        base.Init();
		titleBg.txt = Datas.getArString("BattleReport.Details_CombatHero");
        titleHeroName.txt = Datas.getArString("Report.HeroName");
        titleHeroMight.txt = Datas.getArString("Report.Might");
		titleHeroMightLost.txt = Datas.getArString("BattleReport.Details_TroopRemaining");
		rect.height = 8;
    }

	public override void DrawItem() 
	{
		base.DrawItem();

		bgHero.Draw();
		titleBg.Draw();
		titleFlowerBg.Draw();
		titleHeroName.Draw();
		titleHeroMight.Draw();
		titleHeroMightLost.Draw();
		line.Draw();

		for(int i = 0; i < reportHeroInfoItems.Count;++i)
		{
			reportHeroInfoItems[i].Draw();
		}
	}

    public override void SetUIData(object data)
    {
        base.SetUIData(data);

		AddItem(titleBg);
		titleFlowerBg.rect.y = titleBg.rect.y;

		AddItem(titleHeroName);
		titleHeroMight.rect.y = titleHeroName.rect.y;
		titleHeroMightLost.rect.y = titleHeroName.rect.y;

		rect.height += 4;
		AddItem(line);
		rect.height += 8;

        var myData = data as Data;
		reportHeroInfoItems.Clear();

		for(int i = 0; i < myData.heroInfos.Count;++i)
		{
			ReportHeroInfoItem temp = Instantiate(item) as ReportHeroInfoItem;
			temp.Init();
			temp.SetUIData(myData.heroInfos[i]);

			reportHeroInfoItems.Add(temp);

			AddItem(temp);
		}

		bgHero.rect.height = this.rect.height;

		this.rect.height += BottomPadding;
    }

	public void Clear()
	{
		if (reportHeroInfoItems == null) {
			return;
		}
		for (int i = 0; i < reportHeroInfoItems.Count;++i) {
			if (reportHeroInfoItems[i] == null) {
				continue;
			}
			UnityEngine.Object.Destroy(reportHeroInfoItems[i].gameObject);
		}
		reportHeroInfoItems.Clear();
	}
}
