using UnityEngine;
using System.Collections;
using System.Text;
using System.Collections.Generic;

using Datas = KBN.Datas;
using _Global = KBN._Global;

public class ReportTroopInfoItem : UIObject 
{

	[SerializeField]
	private Label titleFought;
	[SerializeField]
	private Label titleSurvived;
	[SerializeField]
	private Label titleInjured;
	[SerializeField]
	private Label titleDeath;
	[SerializeField]
	private Label FoughtNum;
	[SerializeField]
	private Label SurvivedNum;
	[SerializeField]
	private Label InjuredNum;
	[SerializeField]
	private Label DeathNum;
	[SerializeField]
	private Label UnitIcon;
	[SerializeField]
	private Label UnitName;
	[SerializeField]
	private Label Line;
	
	public void Draw()
	{
		if (!visible) return;
		GUI.BeginGroup(this.rect);
		
		titleFought.Draw();
		titleSurvived.Draw();
		titleInjured.Draw();
		titleDeath.Draw();
		FoughtNum.Draw();
		SurvivedNum.Draw();
		InjuredNum.Draw();
		DeathNum.Draw();
		UnitIcon.Draw();
		UnitName.Draw();
		Line.Draw();
		
		GUI.EndGroup();
	}
	
	public override void Init()
	{
		base.Init();
	}
	
	public void SetUIData(object data,bool isFirst)
	{
		var myData = data as ReportDetailTroopsView.Data.ReportTroopsInfo;
		if(isFirst)
		{
			Line.SetVisible(false);
		}

		if(myData.isWorldBoss)
		{
			titleFought.txt = Datas.getArString("WorldBoss.Report_Text10");
			titleSurvived.txt = string.Empty;
			titleInjured.txt = Datas.getArString("WorldBoss.Report_Text11");
			titleDeath.txt = string.Empty;
			
			FoughtNum.txt = _Global.NumFormat(long.Parse(myData.foughtNum.ToString()));
			FoughtNum.rect.x = 190;
			SurvivedNum.txt = string.Empty;
			InjuredNum.txt = _Global.NumFormat(long.Parse(myData.survivedNum.ToString()));
			InjuredNum.rect.x = 245;
			DeathNum.txt = string.Empty;

			titleFought.mystyle.fontSize = 14;
			titleSurvived.mystyle.fontSize = 14;
			titleInjured.mystyle.fontSize = 14;
			titleDeath.mystyle.fontSize = 14;
			FoughtNum.mystyle.fontSize = 14;
			SurvivedNum.mystyle.fontSize = 14;
			InjuredNum.mystyle.fontSize = 14;
			DeathNum.mystyle.fontSize = 14;
		}
		else
		{
			titleFought.txt = Datas.getArString("BattleReport.Fought");
			titleSurvived.txt = Datas.getArString("BattleReport.Survived");
			titleInjured.txt = Datas.getArString("BattleReport.Injured");
			titleDeath.txt = Datas.getArString("BattleReport.Death");

			FoughtNum.txt = _Global.NumFormat(long.Parse(myData.foughtNum.ToString()));
			SurvivedNum.txt = _Global.NumFormat(long.Parse(myData.survivedNum.ToString()));
			InjuredNum.txt = _Global.NumFormat(long.Parse(myData.InjuredNum.ToString()));
			DeathNum.txt = _Global.NumFormat(long.Parse(myData.deathNum.ToString()));

			InjuredNum.rect.x = 190;
			FoughtNum.rect.x = 190;

			titleFought.mystyle.fontSize = 14;
			titleSurvived.mystyle.fontSize = 14;
			titleInjured.mystyle.fontSize = 14;
			titleDeath.mystyle.fontSize = 14;
			FoughtNum.mystyle.fontSize = 14;
			SurvivedNum.mystyle.fontSize = 14;
			InjuredNum.mystyle.fontSize = 14;
			DeathNum.mystyle.fontSize = 14;

		}

		UnitName.txt = myData.unitName;
		UnitIcon.useTile = true;
		UnitIcon.tile = TextureMgr.instance().UnitSpt().GetTile(myData.unitIcon);
	}
}
