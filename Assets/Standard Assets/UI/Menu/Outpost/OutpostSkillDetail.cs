using UnityEngine;
using System;
using System.Collections;

using Datas = KBN.Datas;
using System.Collections.Generic;
using GameFramework;
using KBN;

public class OutpostSkillDetail : UIObject {

	[SerializeField]
	private SimpleButton btnBack;

	[SerializeField]
	private SimpleLabel lbTitle;
	[SerializeField]
	private SimpleLabel lbIcon;
	[SerializeField]
	private SimpleLabel lbDesc;

	[SerializeField]
	private SimpleLabel lbNextLevelBg;
	[SerializeField]
	private SimpleLabel lbNextLevel;

	[SerializeField]
	private SimpleLabel lbNextLevelDescBg;
	[SerializeField]
	private SimpleLabel lbNextLevelDesc;

	[SerializeField]
	private SimpleButton btnLevelUp;

	[SerializeField]
	private SimpleLabel lbPoints;

	[SerializeField]
	private SimpleLabel lbRequiresBg;
	[SerializeField]
	private RequireContent requires;

	[SerializeField]
	private SimpleLabel lbNoLevelUpDesc;

    private AvaPlayerSkillItem m_Data;

//	[SerializeField]
//	private SimpleLabel 

	public Action OnGoBack { get; set; }

	public override void Init ()
	{
		base.Init ();

		btnBack.mystyle.normal.background = TextureMgr.singleton.LoadTexture("button_back2_normal", TextureType.BUTTON);
		btnBack.mystyle.active.background = TextureMgr.singleton.LoadTexture("button_back2_down", TextureType.BUTTON);
		
		if (KBN._Global.IsLargeResolution ()) 
		{
			btnBack.rect.width = 62;
		} 
		else if (KBN._Global.isIphoneX ()) 
		{
			btnBack.rect.width = 85;
		}
		else
		{
			btnBack.rect.width = 75;
		}
		btnBack.rect.height = 64;

		btnBack.OnClick = new Action(OnBackButton);

		lbNextLevelBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
		lbNextLevelDescBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
		lbRequiresBg.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);

        btnLevelUp.txt = Datas.getArString("Common.LevelUp_title");
        btnLevelUp.OnClick = new Action<object>(OnLevelUpClick);

		lbPoints.mystyle.normal.background = TextureMgr.singleton.LoadTexture("HP_icon", TextureType.DECORATION);
		lbNoLevelUpDesc.txt = Datas.getArString("Error.err_4351");

		requires.Init();
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);
		btnBack.Draw();
		
		lbTitle.Draw();
		lbIcon.Draw();
		lbDesc.Draw();
		
		lbNextLevelBg.Draw();
		lbNextLevel.Draw();
		
		lbNextLevelDescBg.Draw();
		lbNextLevelDesc.Draw();
		
		btnLevelUp.Draw();
		
		lbPoints.Draw();

		lbRequiresBg.Draw();
		requires.Draw();
		lbNoLevelUpDesc.Draw();
		GUI.EndGroup();

		return -1;
	}

	public override void Update ()
	{
		base.Update ();

		requires.Update();
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

		requires.Clear();
        KBN.Game.Event.UnregisterHandler(KBN.EventId.AvaPlayerSkillLevelUp, OnAvaPlayerSkillLevelUp);
	}

	public override void SetUIData (object data)
	{
        m_Data = data as AvaPlayerSkillItem;
        if (m_Data == null)
        {
            throw new ArgumentNullException("data");
        }

        KBN.Game.Event.RegisterHandler(KBN.EventId.AvaPlayerSkillLevelUp, OnAvaPlayerSkillLevelUp);
        RefreshUI();
	}

	private void OnBackButton()
	{
		if (null != OnGoBack)
			OnGoBack();
	}

    private void RefreshUI()
    {
        lbTitle.txt = string.Format("{0} (Lv {1})", m_Data.Name, m_Data.Level.ToString());
        lbDesc.txt = m_Data.Description;
		lbIcon.useTile = true;
		lbIcon.tile = m_Data.Icon;

        if (m_Data.IsMaxLevel)
        {
            btnLevelUp.SetVisible(false);

            lbNextLevel.txt = Datas.getArString("AVA.Outpost_detail_Maxlevel");
            lbNextLevelDesc.txt = Datas.getArString("AVA.Outpost_detail_maxleveldesc");

            lbPoints.SetVisible(false);
            lbRequiresBg.SetVisible(false);
            requires.SetVisible(false);
        }
        else
        {
			if(GameMain.Ava.Event.CanEnterAvaMiniMap())
			{
				lbNoLevelUpDesc.SetVisible (true);
				btnLevelUp.SetVisible (false);
			}
			else
			{
				lbNoLevelUpDesc.SetVisible (false);
				btnLevelUp.SetVisible (true);
				btnLevelUp.EnableBlueButton(m_Data.CanLevelUp);
			}

            lbNextLevel.txt = Datas.getArString("AVA.Outpost_detail_nextlevel") + " " + m_Data.NextLevel.ToString();
            lbNextLevelDesc.txt = m_Data.NextLevelDescription;

            lbPoints.SetVisible(true);
            lbPoints.txt = string.Format("{0}/{1}", KBN.GameMain.Ava.Player.ExpendablePoint.ToString(), m_Data.LevelUpRequireExpendablePoint.ToString());
            float minWidth = 0f;
            float maxWidth = 0f;
            lbPoints.mystyle.CalcMinMaxWidth(new GUIContent(lbPoints.txt), out minWidth, out maxWidth);
            lbPoints.rect.x = 550f - Mathf.Ceil(maxWidth);
            if (KBN.GameMain.Ava.Player.ExpendablePoint < m_Data.LevelUpRequireExpendablePoint)
            {
                lbPoints.txt = string.Format("<color=red>{0}</color>", lbPoints.txt);
            }

            lbRequiresBg.SetVisible(true);
            requires.SetVisible(true);
            requires.setMaxShowNum(8);
            requires.showRequire(m_Data.GetLevelUpRequirement(), true);
			requires.scroll.rect.height = 204;
        }
    }

    private void OnLevelUpClick(object param)
    {
        KBN.GameMain.Ava.PlayerSkill.SkillLevelUp(m_Data.Type, m_Data.NextLevel);
    }

    private void OnAvaPlayerSkillLevelUp(object sender, GameEventArgs e)
    {
        RefreshUI();
    }
}
