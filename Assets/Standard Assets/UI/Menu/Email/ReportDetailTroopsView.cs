using UnityEngine;
using System.Collections;
using System.Text;
using System;
using System.Collections.Generic;

using MenuMgr = KBN.MenuMgr;
using Datas = KBN.Datas;
using _Global = KBN._Global;

public class ReportDetailTroopsView : ListItem
{
    public class Data
    {
        public class ReportTroopsInfo
		{
			public string foughtNum;
			public string survivedNum;
			public string InjuredNum;
			public string deathNum;
			public string unitIcon;
			public string unitName;

			public bool isWorldBoss = false;
		}

		public List<ReportTroopsInfo> reportTroopsInfos = new List<ReportTroopsInfo>();
        public bool IsWorldBossEmail=false;

        public int cityId;
        public bool tooWeakToInspect;

        public Data()
        {
            this.tooWeakToInspect = true;
        }

        public static Data CreateWithMarchType(HashObject cityIdNode, HashObject data,object marchTypeData, bool tooWeakToInspect){

			string troopsKey = "fght";
			if (data[troopsKey] == null)
				troopsKey = "unitsJS";/*迷雾远征*/

			HashObject troops=(data[troopsKey]["s0"]) as HashObject;
            int marchType=_Global.INT32(marchTypeData);

			var ret = new Data();
			ret.tooWeakToInspect = tooWeakToInspect;
			
			ret.cityId = _Global.INT32(cityIdNode);
			
			var arr1 = _Global.GetObjectKeys(troops);
			for (int a = 0; a < arr1.Length; a++)
			{
				var key = arr1[a];
				
				long foughtNum = _Global.INT64(troops[key][_Global.ap + "0"]);
				
				if (foughtNum == 0)
				{
					continue;
				}
				
				ReportTroopsInfo troopInfo = new ReportTroopsInfo();
				string id = key.Substring(1, key.Length - 1);
				
				string name = string.Empty;
				if(marchType==Constant.MarchType.EMAIL_WORLDBOSS)
				{					
					name = Datas.getArString("WorldBoss.BossUnit_Text1");
                    ret.IsWorldBossEmail = true;
					troopInfo.unitIcon = "Dragon_Avatar";
                }else
				{                   
                    ret.IsWorldBossEmail = false;
					if (_Global.INT32(id) >= 50)
					{
						name = Datas.getArString("fortName.f" + id);
					}
					else
					{
						name = Datas.getArString("unitName.u" + id);
					}
					troopInfo.unitIcon = "ui_" + id;
				}

				troopInfo.unitName = name;
				troopInfo.foughtNum = foughtNum.ToString();
				
				long surviveNum = _Global.INT64(troops[key][_Global.ap + "1"]);
				troopInfo.survivedNum = surviveNum.ToString();
				
				long InjuredNum = _Global.INT64(troops[key][_Global.ap + "3"]);
				troopInfo.InjuredNum = InjuredNum.ToString();
				
				long deathNum = foughtNum - surviveNum - InjuredNum;
				troopInfo.deathNum = deathNum.ToString();
				
				troopInfo.isWorldBoss = ret.IsWorldBossEmail;
				
				ret.reportTroopsInfos.Add(troopInfo);
			}
			
			return ret;
        }

        public static Data Create(HashObject cityIdNode, HashObject troops, bool tooWeakToInspect)
        {
            var ret = new Data();
            ret.tooWeakToInspect = tooWeakToInspect;

            ret.cityId = _Global.INT32(cityIdNode);
            
            var arr1 = _Global.GetObjectKeys(troops);
            for (int a = 0; a < arr1.Length; a++)
            {
                var key = arr1[a];
                
                long foughtNum = _Global.INT64(troops[key][_Global.ap + "0"]);
                
				if (foughtNum == 0)
                {
                    continue;
                }
                
				ReportTroopsInfo troopInfo = new ReportTroopsInfo();
                string id = key.Substring(1, key.Length - 1);
                
                string name = string.Empty;
                if (_Global.INT32(id) >= 50)
                {
					name = Datas.getArString("fortName.f" + id);
                }
                else
                {
					name = Datas.getArString("unitName.u" + id);
                }
                
				troopInfo.unitName = name;
                troopInfo.unitIcon = "ui_" + id;
				troopInfo.foughtNum = foughtNum.ToString();
                
				long surviveNum = _Global.INT64(troops[key][_Global.ap + "1"]);
				troopInfo.survivedNum = surviveNum.ToString();
                
				long InjuredNum = _Global.INT64(troops[key][_Global.ap + "3"]);
				troopInfo.InjuredNum = InjuredNum.ToString();

				long deathNum = _Global.INT64(troops[key][_Global.ap + "2"]) - InjuredNum;
				troopInfo.deathNum = deathNum.ToString();

				troopInfo.isWorldBoss = false;

				ret.reportTroopsInfos.Add(troopInfo);
            }
            
            return ret;
        }
    }

    [SerializeField]
    private Label bg;
    [SerializeField]
    private Label titleBg;
    [SerializeField]
    private Label titleFlower;
	[SerializeField]
	private Label tooWeakToInspectLabel;
	[SerializeField]
	private ReportTroopInfoItem item;
	
	private List<ReportTroopInfoItem> reportTroopsInfoItems = new List<ReportTroopInfoItem>();

    private const int ContentWidth = 350;
    private const int ContentMinHeight = 0;
    private const int BottomPadding = 10;
    private const int BgBottomPadding = 5;

    public override void Init()
    {
        base.Init();

		rect.height = 8;
        bg.setBackground("contentBack", TextureType.DECORATION);
    }

	public override void DrawItem() 
	{
		base.DrawItem();
		
		bg.Draw();
		titleBg.Draw();
		titleFlower.Draw();
		tooWeakToInspectLabel.Draw();

		for(int i = 0; i < reportTroopsInfoItems.Count;++i)
		{
			reportTroopsInfoItems[i].Draw();
		}
	}

	public void SetTitleNane(string name)
	{
		titleBg.txt = name;
	}

    public override void SetUIData(object data)
    {
        base.SetUIData(data);

		AddItem(titleBg);
		titleFlower.rect.y = titleBg.rect.y;

		var info = data as Data;

		if (info.tooWeakToInspect)
		{
			tooWeakToInspectLabel.txt = Datas.getArString("Report.UnrevealTips");
			AddItem(tooWeakToInspectLabel);
		}
		else
		{
			tooWeakToInspectLabel.SetVisible(false);
		}

		if(info.reportTroopsInfos.Count == 0)
		{
			rect.height += 8;
		}
		      
		reportTroopsInfoItems.Clear();

		for(int i = 0; i < info.reportTroopsInfos.Count;++i)
		{
			ReportTroopInfoItem temp = Instantiate(item) as ReportTroopInfoItem;
			temp.Init();
			temp.SetUIData(info.reportTroopsInfos[i], i == 0);
			
			reportTroopsInfoItems.Add(temp);
			
			AddItem(temp);
		}
		
		bg.rect.height = this.rect.height;
		
		this.rect.height += BottomPadding;

        if(info.IsWorldBossEmail){
//            titleTroop.txt = Datas.getArString("WorldBoss.Report_Text9");
//            titleFought.txt = Datas.getArString("WorldBoss.Report_Text10");
//            titleSurvive.txt = Datas.getArString("WorldBoss.Report_Text11");
			titleBg.txt = Datas.getArString("WorldBoss.Report_Text8");
        }else{
//            titleTroop.txt = Datas.getArString("Common.Troops");
//            titleFought.txt = Datas.getArString("Common.Fought");
//            titleSurvive.txt = Datas.getArString("Common.Survived");
			titleBg.txt = Datas.getArString("Report.TroopInfo");
        }
    }

	public void Clear()
	{
		if (reportTroopsInfoItems == null) {
			return;
		}
		for (int i = 0; i < reportTroopsInfoItems.Count;++i) {
			if (reportTroopsInfoItems[i] == null) {
				continue;
			}
			UnityEngine.Object.Destroy(reportTroopsInfoItems[i].gameObject);
		}
		reportTroopsInfoItems.Clear();
	}

    private void OnOpenHeal(object param)
    {
        var cityDat = CityQueue.instance();
        City ct = cityDat.GetCreatedCityByIdx(4);
        if (ct == null)
        {
            return;
        }
        var menuMgr = MenuMgr.instance;
        menuMgr.PushMenu("HospitalHealPopMenu", ct.cityId, "trans_zoomComp");
    }
}
