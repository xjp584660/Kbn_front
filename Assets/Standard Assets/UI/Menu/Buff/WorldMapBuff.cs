using UnityEngine;
using System;
using System.Collections;
using KBN;

[Serializable]
public class WorldMapBuff : SimpleUIElement {

	[SerializeField]
	private SimpleLabel icon;
	[SerializeField]
	private SimpleLabel time;
	[SerializeField]
	private SimpleButton btn;

	private long timestamp;

	public override void Init ()
	{
		base.Init ();
		icon.useTile = true;
		icon.tile = TextureMgr.singleton.ElseIconSpt().GetTile("buff_icon_luck_world");

		btn.OnClick = new System.Action(OnButtonClick);
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		base.Draw ();

		GUI.BeginGroup(rect);

		btn.Draw();
		icon.Draw();
		time.Draw();

		GUI.EndGroup();

		return -1;
	}

	private float lastUpdateTime = 0.0f;
	public override void Update ()
	{
		base.Update ();

		float now = Time.realtimeSinceStartup;
		if (now - lastUpdateTime > 0.5f || lastUpdateTime > now) {
			lastUpdateTime = now;

			HashObject seed = GameMain.singleton.getSeed();
			timestamp = _Global.INT64(seed["bonus"]["bC3500"]["bT3502"]);
			long curtime = GameMain.unixtime();

			this.SetVisible(curtime < timestamp);
			
			if (curtime < timestamp) 
			{
				time.txt = _Global.timeFormatStr(timestamp - curtime);
			}
		}
	}

	private void OnButtonClick()
	{
		Hashtable data = new Hashtable() {
			{"type", Constant.BuffType.BUFF_TYPE_COMBAT },
			{"id", 3600},
			{"icon", "buff_icon_luck_world"},
			{"des1", Datas.getArString("BuffDescription.WildLucky")},
			{"des2", Datas.getArString("BuffDescription.WildLucky")},
			{"endTime", timestamp}
		};	
		MenuMgr.instance.PushMenu("SimpleBuffInfo", data, "trans_zoomComp");
	}
}
