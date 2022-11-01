using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

public class AvaPlayerSkill : AvaModule
{
    private IDictionary<int, AvaPlayerSkillItem> m_AvaPlayerSkillItems;

    public AvaPlayerSkill(AvaManager avaEntry)
        : base(avaEntry)
    {
        m_AvaPlayerSkillItems = new Dictionary<int, AvaPlayerSkillItem>();
    }

    public override void Init()
    {
        KBN.GDS_AvaSkill gds = KBN.GameMain.GdsManager.GetGds<KBN.GDS_AvaSkill>();
        if (gds == null)
        {
            throw new NullReferenceException("GDS AvaSkill is invalid.");
        }

        Dictionary<string, KBN.DataTable.IDataItem>.ValueCollection dataItems = gds.GetItems();
        foreach (KBN.DataTable.AvaSkill dataItem in dataItems)
        {
            if (m_AvaPlayerSkillItems.ContainsKey(dataItem.TYPE))
            {
                continue;
            }

            m_AvaPlayerSkillItems.Add(dataItem.TYPE, new AvaPlayerSkillItem(this, dataItem.TYPE));
        }
    }

	public AvaPlayerSkillItem GetPlayerSkill(int type)
	{
		AvaPlayerSkillItem avaPlayerSkillItem = null;
		if (m_AvaPlayerSkillItems.TryGetValue(type, out avaPlayerSkillItem))
		{
			return avaPlayerSkillItem;
		}

		return null;
	}

    public AvaPlayerSkillItem[] GetPlayerSkills()
    {
        List<AvaPlayerSkillItem> playerSkills = new List<AvaPlayerSkillItem>();
        foreach (AvaPlayerSkillItem playerSkill in m_AvaPlayerSkillItems.Values)
        {
            playerSkills.Add(playerSkill);
        }
        
        return playerSkills.ToArray();
    }

    public void SkillLevelUp(int type, int nextLevel)
    {
        Hashtable request = new Hashtable
        {
            { "skillType", type },
            { "skillNextLevel", nextLevel },
            { "cityId", KBN.GameMain.singleton.getCurCityId() },
        };

        KBN.UnityNet.reqWWW("avaSkillUpgrade.php", request, new Action<HashObject>(OnSkillLevelUpOK), null);
    }

    private void OnSkillLevelUpOK(HashObject result)
    {
        int skillType = KBN._Global.INT32(result["skillType"]);
        int newLevel = KBN._Global.INT32(result["level"]);
        m_AvaPlayerSkillItems[skillType].Level = newLevel;

        AvaEntry.Player.ExpendablePoint -= KBN._Global.INT32(result["deduct"]["eap"]);

        HashObject items = result["deduct"]["items"];
        if (items != null)
        {
            string[] keys = KBN._Global.GetObjectKeys(items);
            for (int i = 0; i < keys.Length; i++)
            {
                int itemId = KBN._Global.INT32(keys[i]);
                int count = KBN._Global.INT32(items[keys[i]]);
                KBN.MyItems.singleton.subtractItem(itemId, count);
            }
        }

        if (result["updateSeed"] != null)
        {
            KBN.UpdateSeed.singleton.update_seed(result["updateSeed"]);
        }

        KBN.Game.Event.Fire(this, new KBN.AvaPlayerSkillLevelUpEventArgs(skillType, newLevel));
    }
}
