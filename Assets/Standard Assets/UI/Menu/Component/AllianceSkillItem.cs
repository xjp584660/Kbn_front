using UnityEngine;
using System;
using KBN;

public class AllianceSkillItem : FullClickItem 
{
	public class DataStruct
	{
		public AvaAllianceSkill skillData;
		public Action<AvaAllianceSkill> clickFunc;
		
		public DataStruct(AvaAllianceSkill _skillData, Action<AvaAllianceSkill> _clickFunc)
		{
			skillData = _skillData;
			clickFunc = _clickFunc;
		}
	}

	[SerializeField] private SimpleLabel skillIcon;
	[SerializeField] private SimpleLabel blackMask;
	[SerializeField] private SimpleLabel lockMask;
	[SerializeField] private ProgressBarWithBg progressBar;
	[SerializeField] private SimpleLabel lvLabel;

	[SerializeField] private SimpleLabel skillTitle;
	[SerializeField] private SimpleLabel skillDesc;
	
	[SerializeField] private Button arrowBtn;
	
	[SerializeField] private SimpleLabel cutLine;

	private DataStruct itemData;

	public override void Init()
	{
		base.Init();

		progressBar.Init();
		progressBar.thumb.setBackground("payment_Progressbar_Orange",TextureType.DECORATION);	
		progressBar.SetBg("pvpbuilding_hpmeter",TextureType.MAP17D3A_UI);
		blackMask.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("square_black", TextureType.BACKGROUND);
		lockMask.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("icon_lock", TextureType.ICON);
		lvLabel.mystyle.normal.background = TextureMgr.instance ().LoadTexture ("Points_collected", TextureType.MAP17D3A_UI);
		lvLabel.txt = "Lv";

		arrowBtn.setNorAndActBG("button_flip_right_normal","button_flip_right_down");

		cutLine.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line_list_small",TextureType.DECORATION);
	}
	
	public override void OnPopOver()
	{
		base.OnPopOver();
	}
	
	public override int Draw()
	{
		base.Draw ();
		GUI.BeginGroup(rect);
		skillIcon.Draw ();
		lockMask.Draw ();
		progressBar.Draw ();
//		blackMask.Draw ();
		lvLabel.Draw ();
		
		skillTitle.Draw ();
		skillDesc.Draw ();

		arrowBtn.Draw ();
		cutLine.Draw ();
		GUI.EndGroup();
		return -1;
	}
	
	public override void Update()
	{
	}
	
	public override void SetRowData(object data)
	{
		itemData = data as DataStruct;
		progressBar.SetValue(itemData.skillData.Level, itemData.skillData.MaxLevel);

		skillIcon.useTile = true;
		skillIcon.tile = TextureMgr.instance().IconSpt().GetTile("ava_buff"+itemData.skillData.Id);
		skillTitle.txt = Datas.getArString ("AllianceSkill.Name_s" + itemData.skillData.Id);
		skillDesc.txt = GetSkillDesc (itemData.skillData.Id, itemData.skillData.Value, itemData.skillData.ValueType);
		if(itemData.skillData.Level == 0)
			skillDesc.txt = "";

		btnDefault.OnClick = new Action(OnClick);

		if (GameMain.Ava.Alliance.SkillToNextLevelRequirementSatisfied (itemData.skillData))
			lockMask.SetVisible (false);
		else
			lockMask.SetVisible (true);
	}

	private void OnClick()
	{
		itemData.clickFunc (itemData.skillData);
	}

	private string GetSkillDesc(int skillId, int value, BuffValueType valueType)
	{
		string strValue = "";
		if(valueType == BuffValueType.Percent)
		{
			strValue = value+"%";
		}
		else if(valueType == BuffValueType.Int)
		{
			strValue  = value+"";
		}
		else if(valueType == BuffValueType.Thethousand)
		{
			strValue = _Global.FLOAT(value) / 100f + "%";
		}
		return string.Format (Datas.getArString ("AllianceSkill.Desc_s" + itemData.skillData.Id + "_0"), strValue);
	}
}
