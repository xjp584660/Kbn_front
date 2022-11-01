using UnityEngine;
using System.Collections;
using KBN;

public static class DailyQuestHelper
{
    private class FightWorldMapWinLoseData
    {
        public int fightPlayerWins = 0;
        public int fightPlayerLosses = 0;
        public int fightPictWins = 0;
        public int fightPictLosses = 0;
    }

    public static void CheckForgeGearProgress(HashObject forgeGearResult)
    {
#if DEBUG_DAILY_QUEST
        forgeGearResult = DailyQuestManager.Instance.FakeData["forgeGearResult"];
#endif

        if (forgeGearResult == null)
        {
            return;
        }

		if (_Global.GetBoolean(forgeGearResult["ByNewFte"]))
		{
			return;
		}

        int gearType = _Global.INT32(forgeGearResult["gearType"]);
        int currentLevel = _Global.INT32(forgeGearResult["currentLevel"]);

        DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.ForgeGear, new Hashtable {
            {"gearType", gearType},
            {"currentLevel", currentLevel},
        });
    }

    public static void CheckFightWorldMapQuestProgress(HashObject updateMarchNode)
    {
#if DEBUG_DAILY_QUEST
        updateMarchNode = DailyQuestManager.Instance.FakeData["updateMarch"];
#endif

        if (updateMarchNode == null)
        {
            return;
        }

        var data = new FightWorldMapWinLoseData();

        string[] cityKeys = _Global.GetObjectKeys(updateMarchNode);
        foreach (var cityKey in cityKeys)
        {
            if (!cityKey.StartsWith("c"))
            {
                continue;
            }
            var cityNode = updateMarchNode[cityKey];
            if (cityNode == null)
            {
                continue;
            }
            
            string[] marchKeys = _Global.GetObjectKeys(cityNode);
            foreach (var marchKey in marchKeys)
            {
                if (!marchKey.StartsWith("m"))
                {
                    continue;
                }
                var marchNode = cityNode[marchKey];
                if (marchNode == null)
                {
                    continue;
                }

                DealWithMarchNode(marchNode, data);
            }
        }

        DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.FightPict, new Hashtable {
            {"wins", data.fightPictWins},
            {"losses", data.fightPictLosses},
        });

        DailyQuestManager.Instance.CheckQuestProgress(DailyQuestType.FightPlayer, new Hashtable {
            {"wins", data.fightPlayerWins},
            {"losses", data.fightPlayerLosses},
        });
    }

    private static void DealWithMarchNode(HashObject marchNode, FightWorldMapWinLoseData data)
    {
        // If the node doesn't contain a 'winner' child node, this march should be considered incomplete.
        if (marchNode["winner"] == null)
        {
            return;
        }
        
        int targetTileType = _Global.INT32(marchNode["s0TileType"]);
        int targetPlayerId = _Global.INT32(marchNode["s0PlayerId"]);
        int marchType = _Global.INT32(marchNode["marchType"]);
        bool hasWon = _Global.INT32(marchNode["winner"]) > 0;
        
        if (targetTileType != Constant.TileType.CITY || marchType != Constant.MarchType.ATTACK)
        {
            return;
        }
        
        if (targetPlayerId == 0) // Target is pictish camp
        {
            if (hasWon)
            {
                data.fightPictWins++;
            }
            else
            {
                data.fightPictLosses++;
            }
        }
        else
        {
            if (hasWon)
            {
                data.fightPlayerWins++;
            }
            else
            {
                data.fightPlayerLosses++;
            }
        }
    }
}
