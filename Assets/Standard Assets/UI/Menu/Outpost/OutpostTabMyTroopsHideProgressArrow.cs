using UnityEngine;
using System.Collections;

public class OutpostTabMyTroopsHideProgressArrow : UIObject {

	[SerializeField]
	private SimpleLabel lbPercent;
	[SerializeField]
	private SimpleLabel lbArrow;
	[SerializeField]
	private SimpleLabel lbTime;

	[SerializeField]
	private Vector2 offsetPercent;
	[SerializeField]
	private Vector2 offsetArrow;
	[SerializeField]
	private Vector2 offsetTime;

	public string Percentage
	{
		get
		{
			return lbPercent.txt;
		}
		set
		{
			lbPercent.txt = value;
		}
	}

	public string Time
	{
		get
		{
			return lbTime.txt;
		}
		set
		{
			lbTime.txt = value;
		}
	}

	public override void Init ()
	{
		base.Init ();

		lbArrow.mystyle.normal.background = TextureMgr.singleton.LoadTexture("Pointing_arrow_down", TextureType.DECORATION);
	}

	private void AdjustPosition()
	{
		lbPercent.rect.x = rect.x + offsetPercent.x;
		lbPercent.rect.y = rect.y + offsetPercent.y;

		lbArrow.rect.x = rect.x + offsetArrow.x;
		lbArrow.rect.y = rect.y + offsetArrow.y;
		
		lbTime.rect.x = rect.x + offsetTime.x;
		lbTime.rect.y = rect.y + offsetTime.y;
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		AdjustPosition();

		lbPercent.Draw();
		lbArrow.Draw();
		lbTime.Draw();

		return -1;
	}
}
