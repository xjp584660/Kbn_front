using UnityEngine;
using System.Collections;
using KBN;

public class SimpleBuffInfo : PopMenu {

	[SerializeField]
	private SimpleLabel lbSep;
	[SerializeField]
	private Label lbIcon;
	[SerializeField]
	private Label lbDesc;
	[SerializeField]
	private Label timeIcon;
	[SerializeField]
	private Label timeLabel;
	[SerializeField]
	private Label levelDesc; // not used

	[SerializeField]
	private Rect timeRect;

	private bool showTime = false;
	private long timestamp = 0;
	private string desc1 = string.Empty;
	private string desc2 = string.Empty;

	public override void Init ()
	{
		base.Init ();

		title.Init();
		lbSep.Init();
		lbIcon.Init();
		lbDesc.Init();
		timeIcon.Init();
		timeLabel.Init();
		levelDesc.Init();

		title.txt = Datas.getArString("Common.Buff");
		lbSep.setBackground("between line", TextureType.DECORATION);
		lbIcon.useTile = true;
		timeIcon.setBackground("icon_time", TextureType.ICON);
		timeLabel.setBackground("square_black2",TextureType.DECORATION);

		showTime = false;
		timestamp = 0;
		desc1 = string.Empty;
		desc2 = string.Empty;
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);

		Hashtable data = param as Hashtable;

		lbIcon.tile = TextureMgr.singleton.ElseIconSpt().GetTile(_Global.GetString(data["icon"]));
		desc1 = _Global.GetString(data["des1"]);
		desc2 = _Global.GetString(data["des2"]);

		timestamp = _Global.INT64(data["endTime"]);
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();

		lbSep.Draw();
		lbIcon.Draw();
		lbDesc.Draw();

		if (showTime)
		{
			GUI.BeginGroup(timeRect);
			timeIcon.Draw();
			timeLabel.Draw();
			levelDesc.Draw();
			GUI.EndGroup();
		}
	}

	public override void Update ()
	{
		base.Update ();

		long curTime = GameMain.unixtime();

		if (timestamp > curTime)
		{
			showTime = true;
			timeLabel.txt = _Global.timeFormatStr(timestamp - curTime);
			lbDesc.txt = desc2;
		}
		else
		{
			showTime = false;
			lbDesc.txt = desc1;
		}
	}

}
