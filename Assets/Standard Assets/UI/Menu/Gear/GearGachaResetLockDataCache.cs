using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class GearGachaResetLockDataCache {

	private static Dictionary<string, bool> cache = new Dictionary<string, bool>();

	private static string Key(Arm gear, int skillId)
	{
		if (null == gear || gear.PlayerID <= 0 || gear.PlayerID == Constant.Gear.InValidArmID)
			return null;
		if (skillId <= 0 || skillId == Constant.Gear.NullSkillID)
			return null;
		for (int i = 0; i < gear.Skills.Count; i++) {
			if (gear.Skills[i].ID == skillId)
				return gear.PlayerID + "#" + skillId;
		}
		return null;
	}

	public static bool SetLock(Arm gear, int skillId, bool locked)
	{
		string key = Key(gear, skillId);
		if (string.IsNullOrEmpty(key))
			return false;

		cache[key] = locked;
		return cache[key];
	}

	public static bool IsLocked(Arm gear, int skillId)
	{
		string key = Key(gear, skillId);
		if (string.IsNullOrEmpty(key))
			return false;

		if (!cache.ContainsKey(key))
			return false;
		return cache[key];
	}

	public static void Clear()
	{
		cache = new Dictionary<string, bool>();
	}
}
