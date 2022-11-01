using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

public class PopupQueue {

	private const string prefix = "LASTPOPTIME_";

	private static PopupQueue instance = null;
	public static PopupQueue singleton { 
		get {
			if (null == instance) instance = new PopupQueue();
			return instance;
		}
	}

	private class Popup {
		public string name;
		public object param;
	}

	private Queue<Popup> queue = null;
	private Dictionary<string, long> config = null;

	private PopupQueue() {
		queue = new Queue<Popup>();
		config = new Dictionary<string, long>();

		config.Add("PaymentOfferMenu", 0);
		config.Add("PlayerSetting", 0);
		config.Add("GambleMenu", 3600);
		config.Add("DailyLoginRewardMenu", 0);
		config.Add("LevelupMenu", 0);
		config.Add("LevelRewards", 0);
		config.Add("JoinAlliancePopupMenu", 1800);
		config.Add("SharePopup", 0);
		config.Add("PveFteMenu", 0);
		config.Add("HeroOpened", 0);
//		config.Add("GameCenterPopup", 0); // Issue: this popup block when click "Bind GameCenter ID" button in PlayerSetting
		config.Add("BuyPeacePopMenu", 0);
		config.Add("StartupPopDialog", 0);
		config.Add("TosPopDialog", 0);
		config.Add("TournamentCompleteMenu", 0);
		config.Add("TournamentLostTileMenu", 0);
		config.Add("TournamentBonusMenu", 0);

		KBN.GameMain.singleton.resgisterRestartFunc(new Action(delegate(){
			if (null == this) return;
			queue = null;
			config = null;
			instance = null;
		}));
	}

	public bool IsDisabled() {
		HashObject seed = KBN.GameMain.singleton.getSeed();
        return (null != seed && null != seed["serverSetting"] && null != seed["serverSetting"]["disablePopupQueue"] && KBN._Global.INT32(seed["serverSetting"]["disablePopupQueue"]) == 1);
	}

	public bool IsCooledDown(string name) {
		if (!config.ContainsKey(name) || config[name] == 0) return true;
		long lasttime = (uint)PlayerPrefs.GetInt(prefix + name, 0);
		if (KBN.GameMain.unixtime() - lasttime > config[name]) return true;
		return false;
	}

	public bool TryPopup(string name, bool needCoolDown) {
		if (!config.ContainsKey(name)) return true;
		if (needCoolDown && !IsCooledDown(name)) return false;

		if (queue.Count == 0) {
			Popup popup = new Popup();
			popup.name = name;
			queue.Enqueue(popup);
			
			if (config[name] > 0) 
				PlayerPrefs.SetInt(prefix + name, (int)KBN.GameMain.unixtime());

			return true;
		}

		return false;
	}

	public IEnumerator WaitForPopup(string name, bool needCoolDown) {
		if (!config.ContainsKey(name)) yield break;
		if (needCoolDown && !IsCooledDown(name)) yield break;

		Popup popup = new Popup();
		popup.name = name;

		queue.Enqueue(popup);

		while (queue.Peek() != popup) {
			yield return null;
		}

		if (config[name] > 0) 
			PlayerPrefs.SetInt(prefix + name, (int)KBN.GameMain.unixtime());
	}

	public void Dequeue(string name) {
		if (queue.Count == 0) return;
		if (queue.Peek().name == name) queue.Dequeue();
	}
}
