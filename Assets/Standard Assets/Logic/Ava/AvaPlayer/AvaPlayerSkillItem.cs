using System;
using System.Collections.Generic;

public class AvaPlayerSkillItem
{
    private AvaPlayerSkill m_AvaPlayerSkill;
    private IDictionary<int, KBN.DataTable.AvaSkill> m_GdsItems;

    public AvaPlayerSkillItem(AvaPlayerSkill avaPlayerSkill, int type)
    {
        if (avaPlayerSkill == null)
        {
            throw new ArgumentNullException("avaPlayerSkill");
        }

        m_AvaPlayerSkill = avaPlayerSkill;
        Type = type;
        KBN.GDS_AvaSkill gds = KBN.GameMain.GdsManager.GetGds<KBN.GDS_AvaSkill>();
        if (gds == null)
        {
            throw new NullReferenceException("GDS AvaSkill is invalid.");
        }

        m_GdsItems = new Dictionary<int, KBN.DataTable.AvaSkill>();
        Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection dataItems = gds.GetItems();
        foreach (KBN.DataTable.AvaSkill dataItem in dataItems)
        {
            if (dataItem.TYPE == type)
            {
                m_GdsItems.Add(dataItem.LEVEL, dataItem);
            }
        }

        HashObject data = KBN.GameMain.singleton.getSeed();
        if (data == null)
        {
            throw new NullReferenceException("seed is invalid.");
        }

        data = data["player"];
        if (data == null)
        {
            throw new NullReferenceException("seed[\"player\"] is invalid.");
        }

        data = data["avaSkillLevels"];
        if (data == null)
        {
            throw new NullReferenceException("seed[\"player\"][\"avaSkillLevels\"] is invalid.");
        }

        data = data[Type.ToString()];
        if (data == null)
        {
            throw new NullReferenceException(string.Format("seed[\"player\"][\"avaSkillLevels\"][{0}] is invalid.", Type.ToString()));
        }

        Level = KBN._Global.INT32(data);
    }
    
    public int Type
    {
        get;
        private set;
    }
    
    public string Name
    {
        get
        {
            return KBN.Datas.getArString(string.Format("AVA.Outpost_detail_AvASkill{0}_title", Type.ToString()));
        }
    }

    public string Description
    {
        get
        {
            IDictionary<int, int> effects = GetEffects();
            object[] args = new object[effects.Count];
            int index = 0;
            foreach (int value in effects.Values)
            {
                args[index++] = value;
            }

            return string.Format(KBN.Datas.getArString(string.Format("AVA.Outpost_detail_AvASkill{0}_desc", Type.ToString())), args);
        }
    }

    public string NextLevelDescription
    {
        get
        {
            IDictionary<int, int> effects = GetLevelUpEffects();
            object[] args = new object[effects.Count];
            int index = 0;
            foreach (int value in effects.Values)
            {
                args[index++] = value;
            }

            return string.Format(KBN.Datas.getArString(string.Format("AVA.Outpost_detail_AvASkill{0}_desc", Type.ToString())), args);
        }
    }

    public Tile Icon
    {
        get
        {
			return TextureMgr.instance().IconSpt().GetTile("ava_icon_skill" + Type.ToString());
        }
    }

    public int Level
    {
        get;
        set;
    }

    public int NextLevel
    {
        get
        {
            return Level + 1;
        }
    }

    public bool IsMaxLevel
    {
        get
        {
            KBN.DataTable.AvaSkill gdsItem = GetGdsItem(NextLevel);
            return gdsItem == null;
        }
    }

    public bool CanLevelUp
    {
        get
        {
            if (IsMaxLevel)
            {
                return false;
            }

            if (m_AvaPlayerSkill.AvaEntry.Player.ExpendablePoint < LevelUpRequireExpendablePoint)
            {
                return false;
            }

            if (m_AvaPlayerSkill.AvaEntry.Alliance.Level < LevelUpRequireAllianceLevel)
            {
                return false;
            }

            int currentCityId = KBN.GameMain.singleton.getCurCityId();
            for (int i = 0; i < 5; i++)
            {
                int requireResource = GetLevelUpRequireResource(i);
                if (requireResource <= 0)
                {
                    continue;
                }

                long ownResource = (long)KBN.Resource.singleton.getCountForTypeInSeed(i, currentCityId);
                if (ownResource < requireResource)
                {
                    return false;
                }
            }

            IDictionary<int, int> requireItems = GetLevelUpRequireItems();
            foreach (KeyValuePair<int, int> requireItem in requireItems)
            {
                if (KBN.MyItems.singleton.GetItemCount(requireItem.Key) < requireItem.Value)
                {
                    return false;
                }
            }

            return true;
        }
    }

    public Requirement[] GetLevelUpRequirement()
    {
        List<Requirement> requirements = new List<Requirement>();

        if (LevelUpRequireAllianceLevel > 0)
        {
            Requirement requirement = new Requirement()
            {
                type = KBN.Datas.getArString("Alliance.allianceskill_permanent_homeskill_Alliancelevel"),
                typeId = -1,
                required = LevelUpRequireAllianceLevel.ToString(),
                own = m_AvaPlayerSkill.AvaEntry.Alliance.Level.ToString(),
                ok = m_AvaPlayerSkill.AvaEntry.Alliance.Level >= LevelUpRequireAllianceLevel,
            };

            requirements.Add(requirement);
        }

        int currentCityId = KBN.GameMain.singleton.getCurCityId();
        for (int i = 0; i < 5; i++)
        {
            int requireResource = GetLevelUpRequireResource(i);
            if (requireResource <= 0)
            {
                continue;
            }

            long ownResource = (long)KBN.Resource.singleton.getCountForTypeInSeed(i, currentCityId);
            Requirement requirement = new Requirement()
            {
                type = KBN.Datas.getArString("ResourceName.a" + i.ToString()),
                typeId = i,
                required = KBN._Global.NumFormat(requireResource),
                own = KBN._Global.NumOnlyToMillion(ownResource),
                ok = ownResource >= requireResource,
            };

            requirements.Add(requirement);
        }

        IDictionary<int, int> requireItems = GetLevelUpRequireItems();
        foreach (KeyValuePair<int, int> requireItem in requireItems)
        {
            Requirement requirement = new Requirement()
            {
                type = KBN.Datas.getArString("itemName.i" + requireItem.Key),
                typeId = requireItem.Key,
                required = requireItem.Value.ToString(),
                own = KBN.MyItems.singleton.GetItemCount(requireItem.Key).ToString(),
                ok = KBN.MyItems.singleton.GetItemCount(requireItem.Key) >= requireItem.Value,
            };
            
            requirements.Add(requirement);
        }

        return requirements.ToArray();
    }

    public int LevelUpRequireExpendablePoint 
    {
        get
        {
            KBN.DataTable.AvaSkill gdsItem = GetGdsItem(NextLevel);
            if (gdsItem == null)
            {
                throw new NullReferenceException();
            }
            
            return gdsItem.REQ_EAP;
        }
    }

    private int LevelUpRequireAllianceLevel
    {
        get
        {
            KBN.DataTable.AvaSkill gdsItem = GetGdsItem(NextLevel);
            if (gdsItem == null)
            {
                throw new NullReferenceException();
            }

            return gdsItem.REQ_ALLIANCE_LEVEL;
        }
    }

    private int GetLevelUpRequireResource(int resourceType)
    {
        KBN.DataTable.AvaSkill gdsItem = GetGdsItem(NextLevel);
        if (gdsItem == null)
        {
            throw new NullReferenceException();
        }

        switch (resourceType)
        {
            case Constant.ResourceType.GOLD:
                return gdsItem.GOLD;
            case Constant.ResourceType.FOOD:
                return gdsItem.FOOD;
            case Constant.ResourceType.LUMBER:
                return gdsItem.WOOD;
            case Constant.ResourceType.STONE:
                return gdsItem.STONE;
            case Constant.ResourceType.IRON:
                return gdsItem.IRON;
            default:
                throw new NotSupportedException();
        }
    }

    private IDictionary<int, int> GetLevelUpRequireItems()
    {
        IDictionary<int, int> requireItems = new Dictionary<int, int>();
        KBN.DataTable.AvaSkill gdsItem = GetGdsItem(NextLevel);
        if (gdsItem != null)
        {
            string[] itemPairs = gdsItem.REQ_ITEM.Split(new char[] { ':' }, StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < itemPairs.Length; i++)
            {
                if (itemPairs[i] == "0")
                {
                    continue; // Skip string "0"
                }

                string[] itemPair = itemPairs[i].Split(new char[] { '_' }, StringSplitOptions.RemoveEmptyEntries);
                if (itemPair.Length != 2)
                {
                    throw new ApplicationException(string.Format("Type '{0}' Level '{1}' Column REQ_ITEM in GDS AvaSkill is invalid.", Type.ToString(), NextLevel.ToString()));
                }

                requireItems.Add(int.Parse(itemPair[0]), int.Parse(itemPair[1]));
            }
        }

        return requireItems;
    }

    public IDictionary<int, int> GetEffects()
    {
        IDictionary<int, int> effects = new Dictionary<int, int>();
        KBN.DataTable.AvaSkill gdsItem = GetGdsItem(Level);
        if (gdsItem != null)
        {
            string[] itemPairs = gdsItem.EFFECT.Split(new char[] { ':' }, StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < itemPairs.Length; i++)
            {
                if (itemPairs[i] == "0")
                {
                    continue; // Skip string "0"
                }

                string[] itemPair = itemPairs[i].Split(new char[] { '_' }, StringSplitOptions.RemoveEmptyEntries);
                if (itemPair.Length != 2)
                {
                    throw new ApplicationException(string.Format("Type '{0}' Level '{1}' Column EFFECT in GDS AvaSkill is invalid.", Type.ToString(), NextLevel.ToString()));
                }

                effects.Add(int.Parse(itemPair[0]), int.Parse(itemPair[1]));
            }
        }
        
        return effects;
    }

    private IDictionary<int, int> GetLevelUpEffects()
    {
        IDictionary<int, int> effects = new Dictionary<int, int>();
        KBN.DataTable.AvaSkill gdsItem = GetGdsItem(NextLevel);
        if (gdsItem != null)
        {
            string[] itemPairs = gdsItem.EFFECT.Split(new char[] { ':' }, StringSplitOptions.RemoveEmptyEntries);
            for (int i = 0; i < itemPairs.Length; i++)
            {
                if (itemPairs[i] == "0")
                {
                    continue; // Skip string "0"
                }
                
                string[] itemPair = itemPairs[i].Split(new char[] { '_' }, StringSplitOptions.RemoveEmptyEntries);
                if (itemPair.Length != 2)
                {
                    throw new ApplicationException(string.Format("Type '{0}' Level '{1}' Column EFFECT in GDS AvaSkill is invalid.", Type.ToString(), NextLevel.ToString()));
                }
                
                effects.Add(int.Parse(itemPair[0]), int.Parse(itemPair[1]));
            }
        }
        
        return effects;
    }

    private KBN.DataTable.AvaSkill GetGdsItem(int level)
    {
        KBN.DataTable.AvaSkill gdsItem = null;
        if (m_GdsItems.TryGetValue(level, out gdsItem))
        {
            return gdsItem;
        }

        return null;
    }
}
