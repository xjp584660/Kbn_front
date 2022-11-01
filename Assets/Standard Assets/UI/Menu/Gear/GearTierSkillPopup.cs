using UnityEngine;
using System.Collections;
using System.Collections.Generic;

using Datas = KBN.Datas;
using ScrollList = KBN.ScrollList;

public class GearTierSkillPopup : PopMenu {

	[SerializeField]
	private SimpleLabel lblDesc;

	[SerializeField]
	private SimpleLabel lblListHeaderBg;
	[SerializeField]
	private SimpleLabel lblListBg;
	[SerializeField]
	private SimpleLabel lblListHeaderAttribute;
	[SerializeField]
	private SimpleLabel lblListHeaderTroops;
	[SerializeField]
	private SimpleLabel lblListHeaderType;

	[SerializeField]
	private SkillInformationItem listItem;
	[SerializeField]
	private ScrollList skillList;

	public override void Init ()
	{
		base.Init ();

		lblDesc.Init();
		lblDesc.txt = Datas.getArString("GearReset.PreviewSkillTips");

		lblListHeaderBg.Init();
		lblListHeaderBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2", TextureType.DECORATION);
		lblListBg.Init();
		lblListBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2", TextureType.DECORATION);

		lblListHeaderAttribute.Init();
		lblListHeaderAttribute.txt = Datas.getArString("Gear.AttributeIcon");
		lblListHeaderTroops.Init();
		lblListHeaderTroops.txt = Datas.getArString("Gear.BenefitTroops");
		lblListHeaderType.Init();
		lblListHeaderType.txt = Datas.getArString("Gear.AttributeType");

		skillList.Init(listItem);
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);
		List<int> data = param as List<int>;
		if (null != data) {
			skillList.Clear();
			skillList.SetData(data);
			skillList.AutoLayout();
			skillList.MoveToTop();
		}
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

		skillList.Clear();
	}

	public override void Update ()
	{
		base.Update ();

		skillList.Update();
	}

	protected override void DrawItem ()
	{
		base.DrawItem ();

		lblDesc.Draw();
		
		lblListBg.Draw();
		lblListBg.Draw();
		lblListHeaderBg.Draw();
		lblListHeaderAttribute.Draw();
		lblListHeaderTroops.Draw();
		lblListHeaderType.Draw();

		skillList.Draw();
	}
}
