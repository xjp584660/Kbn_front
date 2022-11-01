using UnityEngine;
using System.Collections;
using System.Collections.Generic;

using Datas = KBN.Datas;

public class AvaIncomingAttackDetailData
{
    public class ResearchOrSkill
    {
        public enum Category
        {
            Default,
            AvaPlayerSkill,
        }

        public Category ItsCategory { get; set; }
        public int Id { get; set; }
        public int Level { get; set; }
    }

    public class Hero
    {
        public int TypeId { get; set; }
        public int Level { get; set; }
    }

    public class Troop
    {
        public int Id { get; set; }
        public long Count { get; set; }
    }

    public int Id { get; set; }
    public int CoordX { get; set; }
    public int CoordY { get; set; }
    public string ToTileName { get; set; }
    public string AttackerName { get; set; }
    public string AttackerAlliance { get; set; }
    public long ArmySize { get; set; }
    public long KnightLevel { get; set; }
    public long? ArrivalTime { get; set; }

    public List<ResearchOrSkill> Researches { get; private set; }
    public List<Hero> Heros { get; private set; }
    public List<Troop> Troops { get; private set; }

    public AvaIncomingAttackDetailData(PBMsgAvaIncommingAttackList.PBMsgAvaIncommingAttackList.MarchInfo rawData)
    {
        Researches = new List<ResearchOrSkill>();
        Heros = new List<Hero>();
        Troops = new List<Troop>();

        Id = rawData.marchId;
        CoordX = rawData.toXCoord;
        CoordY = rawData.toYCoord;
        ToTileName = Datas.getArString(AvaUtility.GetTileNameKey(rawData.toTileType));
        AttackerName = rawData.fromPlayerName;
        AttackerAlliance = "";
        KnightLevel = rawData.knightLevel;
        ArrivalTime = rawData.destinationEtaSpecified ? (long?)rawData.destinationEta : null;

        ArmySize = 0;
        for (int i = 0; i < rawData.unitlist.Count; ++i)
        {
            var troop = new Troop
            {
                Id = rawData.unitlist[i].unitId,
                Count = (long)rawData.unitlist[i].count,
            };
            ArmySize += troop.Count;
            Troops.Add(troop);
        }

        for (int i = 0; i < rawData.techlist.Count; ++i)
        {
            var tech = new ResearchOrSkill
            {
                Id = rawData.techlist[i].Id,
                Level = rawData.techlist[i].level,
                ItsCategory = ResearchOrSkill.Category.Default,
            };
            Researches.Add(tech);
        }

        for (int i = 0; i < rawData.avaPlayerSkillList.Count; ++i)
        {
            var skill = new ResearchOrSkill
            {
                Id = rawData.avaPlayerSkillList[i].Id,
                Level = rawData.avaPlayerSkillList[i].level,
                ItsCategory = ResearchOrSkill.Category.AvaPlayerSkill,
            };
            Researches.Add(skill);
        }

        for (int i = 0; i < rawData.herolist.Count; ++i)
        {
            var hero = new Hero
            {
                TypeId = rawData.herolist[i].heroTypeId,
                Level = rawData.herolist[i].level,
            };
            Heros.Add(hero);
        }
    }
}
