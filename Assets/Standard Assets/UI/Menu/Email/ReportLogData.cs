using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class ReportLogData
{
	public class Data
	{
		public string title;
		public string content;
	}

	public List<Data> logDatas;

	//橙色 #5c2fa6
	public static string orangeColor = "<color=#5c2fa6>{0}</color>";
	//红色 #FF0000
	public static string redColor = "<color=#FF0000>{0}</color>";
	//绿色 #006400
	public static string greenColor = "<color=#006400>{0}</color>";

	public static ReportLogData CreateReportLogData(HashObject logInfo)
	{
		ReportLogData reportLogData = new ReportLogData();
		reportLogData.logDatas = new List<Data>();

		HashObject roundLog = logInfo["roundLog"];

		// 名字
		string attackerName = string.Format(greenColor, _Global.GetString(logInfo["s1PlayerName"]));
		string defenderName = string.Empty;
		if(string.IsNullOrEmpty(_Global.GetString(logInfo["s0PlayerName"])))
		{
			int tileType = _Global.INT32(logInfo["s0TileType"]);
			int tileKind = _Global.INT32(logInfo["tileKind"]);
			int ava = _Global.INT32(logInfo["ava"]);
			if(_Global.ToBool(ava))
			{
				defenderName = string.Format(redColor, Datas.getArString(AvaUtility.GetTileNameKey(tileType)));
			}
			else
			{
				int marchType = _Global.INT32(logInfo["marchType"]);
				string pveNmae = _Global.GetString(logInfo["s0LevelName"]);
				int tileLevel = _Global.INT32(logInfo["s0TileLevel"]);
				defenderName = string.Format(redColor, AvaUtility.GetDefaultTileNameKey(marchType, tileType, pveNmae, tileLevel, tileKind));
			}			
		}
		else
		{
			defenderName = string.Format(redColor, _Global.GetString(logInfo["s0PlayerName"]));
		}

		// Attacker
		Data attackerData = new Data();
		attackerData.title = Datas.getArString("BattleReport.BattleLog_Attacker");
		// 等级
		string attackerLevel = _Global.GetString(logInfo["s1Title"]);
		// 总兵数
		string attackerUnit = string.Format(orangeColor, _Global.GetString(logInfo["s1Unit"]));

		string attackerContent = string.Empty;
		if(string.IsNullOrEmpty(_Global.GetString(logInfo["s1AllianceName"])))
		{
			attackerContent = string.Format(Datas.getArString("BattleReport.BattleLog_Detail2"), attackerName, attackerLevel
				, attackerUnit);
		}
		else
		{
			string attackerAllianceName = string.Format(greenColor, 
				string.Format("[{0}]", _Global.GetString(logInfo["s1AllianceName"])));

			attackerContent = string.Format(Datas.getArString("BattleReport.BattleLog_Detail1"), attackerAllianceName 
				,attackerName, attackerLevel, attackerUnit);
		}

		// 英雄转换部队
		string attackerHeroTroopContent = HeroTroops(attackerName, greenColor, logInfo["s1HeroTroops"]);
		if(!string.IsNullOrEmpty(attackerHeroTroopContent))
		{
			attackerContent += "\n";
			attackerContent += attackerHeroTroopContent;
		}
		attackerData.content = attackerContent;
		reportLogData.logDatas.Add(attackerData);

		// Defender
		Data defenderData = new Data();
		defenderData.title = Datas.getArString("BattleReport.BattleLog_Defender");
		// 等级
		string defenderLevel = _Global.GetString(logInfo["s0Title"]);
		// 总兵数
		string defenderUnit = string.Format(orangeColor, _Global.GetString(logInfo["s0Unit"]));

		string defenderContent = string.Empty;
		if(string.IsNullOrEmpty(_Global.GetString(logInfo["s0AllianceName"])))
		{
			defenderContent = string.Format(Datas.getArString("BattleReport.BattleLog_Detail2"), defenderName, defenderLevel
				, defenderUnit);
		}
		else
		{
			string defenderAllianceName = string.Format(redColor, 
				string.Format("[{0}]", _Global.GetString(logInfo["s0AllianceName"])));

			defenderContent = string.Format(Datas.getArString("BattleReport.BattleLog_Detail1"), defenderAllianceName 
				,defenderName, defenderLevel, defenderUnit);
		}

		// 英雄转换部队
		string defenderHeroTroopContent = HeroTroops(defenderName, redColor, logInfo["s0HeroTroops"]);
		if(!string.IsNullOrEmpty(defenderHeroTroopContent))
		{
			defenderContent += "\n";
			defenderContent += defenderHeroTroopContent;
		}
		defenderData.content = defenderContent;
		reportLogData.logDatas.Add(defenderData);
		
		// Turn
		int round = _Global.GetObjectValues(roundLog).Length;

		for( int i = 1; i <= round; i ++ )
		{
			string key = i.ToString();
			HashObject roundInfo = roundLog[key];

			Data data = new Data();
			data.title = string.Format(Datas.getArString("BattleReport.BattleLog_RoundNumber"), key);

			string content = string.Empty;
			if(roundInfo["1"] != null)
			{
				if(roundInfo["1"]["kill"] != null)
				{
					string attackerKillCount = string.Format(orangeColor, _Global.GetString(roundInfo["1"]["kill"]));
					content += string.Format(Datas.getArString("BattleReport.BattleLog_KillNumBer"), attackerName, defenderName, attackerKillCount);
					content += "\n";
				}

				// 技能
				HashObject attackSkill = roundInfo["1"]["hero"];
				if(attackSkill != null)
				{
					content += SkillContent(attackerName, greenColor, attackSkill);
					content += "\n";
				}
				
				HashObject defenderSkill = roundInfo["0"]["hero"];
				if(roundInfo["0"]["kill"] != null)
				{
					string defenderKillCount = string.Format(orangeColor, _Global.GetString(roundInfo["0"]["kill"]));
					content += string.Format(Datas.getArString("BattleReport.BattleLog_KillNumBer"), defenderName, attackerName, defenderKillCount);
					if(defenderSkill != null)
					{
						content += "\n";
					}					
				}
				content += SkillContent(defenderName, redColor, defenderSkill);
			}
			data.content = content;

			reportLogData.logDatas.Add(data);
		}

		// Result of battle
		Data resultData = new Data();
		resultData.title = Datas.getArString("BattleReport.BattleLog_ResultOfBattle");

		// 剩余兵数
		string attackerUnitRemain = string.Format(orangeColor, _Global.GetString(logInfo["s1UnitRemain"]));
		string defenderUnitRemain = string.Format(orangeColor, _Global.GetString(logInfo["s0UnitRemain"]));

		string resultContent = string.Empty;
		int winner = _Global.INT32(logInfo["winner"]);
		if(winner == 1)
		{
			resultContent += string.Format(Datas.getArString("BattleReport.BattleLog_WinrResult"), attackerName, attackerUnitRemain);
			resultContent += "\n";
			resultContent += string.Format(Datas.getArString("BattleReport.BattleLog_LoseResult"), defenderName, defenderUnitRemain);
		}
		else
		{
			resultContent += string.Format(Datas.getArString("BattleReport.BattleLog_LoseResult"), attackerName, attackerUnitRemain);
			resultContent += "\n";
			resultContent += string.Format(Datas.getArString("BattleReport.BattleLog_WinrResult"), defenderName, defenderUnitRemain);
		}
		resultData.content = resultContent;

		reportLogData.logDatas.Add(resultData);

		return reportLogData;
	}

	private static string HeroTroops(string playerName, string color, HashObject heroTroops)
	{
		string[] heroIds = _Global.GetObjectKeys(heroTroops);
		if(heroIds.Length <= 0)
		{
			return string.Empty;
		}

		string content = string.Empty;
		for(int i = 0; i < heroIds.Length; ++i)
		{
			HashObject troopsDatas = heroTroops[heroIds[i]];

			int heroId = _Global.INT32(troopsDatas["ID"]);
			GDS_HeroBasic heroBasic = GameMain.GdsManager.GetGds<GDS_HeroBasic>();
			string heroBasicName = heroBasic.GetItemById(heroId).NAME;
			// 英雄名字
			string heroName = string.Format(color, string.Format("[{0}]", Datas.getArString(heroBasicName)));

			string total = string.Format(orangeColor, _Global.GetString(troopsDatas["total"]));

			content += string.Format(Datas.getArString("BattleReport.BattleLog_HeroTroops"), 
											playerName, heroName, total);

			if(i != heroIds.Length - 1)
			{
				content += "\n";
			}				
		}

		return content;
	}

	private static string SkillContent(string playerNmae, string color, HashObject hero)
	{
		string content = string.Empty;
		// 技能
		if(hero != null)
		{
			string[] heroIds = _Global.GetObjectKeys(hero);
			for(int j = 0; j < heroIds.Length; j++)
			{
				int heroId = _Global.INT32(heroIds[j]);
				GDS_HeroBasic heroBasic = GameMain.GdsManager.GetGds<GDS_HeroBasic>();
				string heroBasicName = heroBasic.GetItemById(heroId).NAME;
				// 英雄名字
				string heroName = string.Format(color, string.Format("[{0}]", Datas.getArString(heroBasicName)));

				HashObject skills = hero[heroIds[j]];
				int skillsCount = _Global.GetObjectValues(skills).Length;
				for( int i = 0; i < skillsCount; i ++ )
				{
					HashObject skill = skills[_Global.ap + i];

					int skillId = _Global.INT32(skill["skillId"]);
					string skillDataName = GameMain.GdsManager.GetGds<GDS_HeroSkillFate>().GetItemById(skillId).NAME;
					// 技能名字
					string skillName = Datas.getArString(skillDataName);
					// 技能数值
					string skillValue = _Global.GetString(skill["value"]);
					// 技能类型
					int skillType = _Global.INT32(skill["type"]);

					// 魔法伤害
					if(skillType >= 40001 && skillType <= 40004)
					{
						content += string.Format(Datas.getArString("BattleReport.BattleLog_HeroSkillMagic"), 
							playerNmae, heroName, skillName, skillValue);
					}// 治疗
					else if(skillType >= 40008 && skillType <= 40010)
					{
						content += string.Format(Datas.getArString("BattleReport.BattleLog_HeroSkillCure"), 
												playerNmae, heroName, skillName, skillValue);
					}	

					if(i != skillsCount - 1)
					{
						content += "\n";
					}				
				}

				if(j != heroIds.Length - 1)
				{
					content += "\n";
				}
			}
		}

		return content;
	}
}
