using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

using Datas = KBN.Datas;
using ScrollList = KBN.ScrollList;
using KBN;

public class OutpostDetailInfo : UIObject, IEventHandler {

	[SerializeField]
	private SimpleButton btnHelp;
	[SerializeField]
	private SimpleLabel lbStateDesc;

	[SerializeField]
	private SimpleButton btnAvAEvent;
		[SerializeField]
	private SimpleLabel lbUpgradeFrame;

    [SerializeField]
    private SimpleLabel lbUpgradeTitle;
	[SerializeField]
	private SimpleLabel lbUpgradeDesc;

	
	[SerializeField]
	private SimpleLabel lbSelectTimeFrame;

	[SerializeField]
    private SimpleLabel lbSelectTimeTitle;
	[SerializeField]
	private SimpleLabel lbSelectTimeDesc;
	[SerializeField]
	private SimpleButton btnSelectTime;
	[SerializeField]
	private SimpleLabel lbSelectTime;
	[SerializeField]
	private SimpleLabel lbNoAlliance;


	[SerializeField]
	private SimpleLabel lbGWWonderFrame;
	[SerializeField]
	private SimpleLabel lbGWWonderTitle;
	[SerializeField]
	private SimpleLabel lbGWWonderDesc;
	[SerializeField]
	private SimpleButton btnGWWonderLDetail;
	[SerializeField]
	private SimpleLabel lbGWWonderStateDes;


	[SerializeField]
	private ScrollList skillList;
	[SerializeField]
	private OutpostSkillListItem listItemTemplate;

	public Action<object> OnPushSkillInfo { get; set; }

	private bool needDraw = true;

	public override void Init ()
	{
		base.Init ();
		lbSelectTimeFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);

		btnHelp.mystyle.normal.background = TextureMgr.singleton.LoadTexture("icon_i", TextureType.DECORATION);
		btnHelp.OnClick = new Action(OnHelpButton);
		
		lbStateDesc.txt = string.Empty;

		btnAvAEvent.txt = Datas.getArString("Event.AVA_AVAeventtitle");
		btnAvAEvent.OnClick = new Action(OnAvAEventButton);

        lbUpgradeTitle.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
        lbUpgradeTitle.txt = Datas.getArString("AVA.Outpost_outpostskill");
		lbSelectTimeTitle.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
		lbSelectTimeTitle.txt = Datas.getArString("AVA.Outpost_CompetitionRegion");
		lbNoAlliance.txt = Datas.getArString("AVA.OutpostNoneAlliance");

		lbGWWonderFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
		lbGWWonderTitle.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
		lbGWWonderTitle.txt = Datas.getArString("GWWonder.Detail_Title");
		lbGWWonderDesc.txt = Datas.getArString("GWWonder.Detail_Text1");
		btnGWWonderLDetail.txt = Datas.getArString("GWWonder.Detail_Text2");
		btnGWWonderLDetail.OnClick = new Action(OnGWWonderDetailClicked);

		lbUpgradeFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);

		skillList.Init(listItemTemplate);
		skillList.itemDelegate = this;

		btnSelectTime.OnClick = new Action(OnSelectTime);
	}

	public void SetIsDraw(bool needDraw)
	{
		this.needDraw = needDraw;
	}

	public override int Draw ()
	{
		if(!needDraw)
		{
			return -1;
		}

		if (!visible)
			return -1;

		GUI.BeginGroup(rect);
		
		btnHelp.Draw();
		lbStateDesc.Draw();
		btnAvAEvent.Draw();

		lbSelectTimeFrame.Draw();
		lbSelectTimeTitle.Draw();
		lbSelectTimeDesc.Draw();
		lbSelectTime.Draw();
		btnSelectTime.Draw();
		lbNoAlliance.Draw();

		lbGWWonderFrame.Draw();
		lbGWWonderTitle.Draw();
		lbGWWonderDesc.Draw();
		btnGWWonderLDetail.Draw();
		lbGWWonderStateDes.Draw();
		
		lbUpgradeFrame.Draw();
        lbUpgradeTitle.Draw();
		lbUpgradeDesc.Draw();
		
		skillList.Draw();

		GUI.EndGroup();

		return -1;
	}

	private float lastUpdateTime = 0.0f;
	public override void Update ()
	{
		base.Update ();

		float curTime = Time.realtimeSinceStartup;
		if (curTime - lastUpdateTime > 0.5f) {
			lastUpdateTime = curTime;

			lbStateDesc.txt = GameMain.Ava.Event.GetEventDesc();
			SetAvaRegionData();
		}
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

		skillList.Clear();
	}

	public override void SetUIData (object data)
	{
		base.SetUIData (data);
		lastUpdateTime = 0f;
		
        if (GameMain.singleton.getScenceLevel() == GameMain.AVA_MINIMAP_LEVEL)
        {
            lbUpgradeDesc.txt = string.Format(Datas.getArString("AVA.Outpost_details_abilityfromhomeserver"), GameMain.Ava.Seed.EagleEyeLevel.ToString(), GameMain.Ava.Seed.EmbassyLevel.ToString(), GameMain.Ava.Seed.WatchTowerLevel.ToString());
        }
        else
        {
            lbUpgradeDesc.txt = Datas.getArString("AVA.Outpost_details_abilityhomeserver");
        }
		
		SetAvaRegionData();
		
		skillList.SetData(GameMain.Ava.PlayerSkill.GetPlayerSkills());

		if(GameMain.singleton.curSceneLev() != GameMain.AVA_MINIMAP_LEVEL)
		{
			btnAvAEvent.SetNormalTxtColor(FontColor.Blue);
		}
		else
		{
			btnAvAEvent.SetNormalTxtColor(FontColor.Grey);
		}
	}

	private void SetGWWonderStateTxt()
	{
		int gwWonderState = _Global.INT32(GameMain.Ava.Event.CurGWWonderState());
		if(gwWonderState == 0)
		{
			lbGWWonderStateDes.txt = Datas.getArString("GWWonder.Detail_Text3");
		}
		else if(gwWonderState == 1)
		{
			lbGWWonderStateDes.txt = Datas.getArString("GWWonder.Detail_Text4");
		}
		else
		{
			lbGWWonderStateDes.txt = Datas.getArString("GWWonder.Detail_Text5");
		}
	}

	public int offset = 4;
	public int spaceCount = 17;
	public void SetAvaRegionData()
	{
		SetGWWonderStateTxt();
		string avaGroup = GameMain.Ava.Event.AllianceRegion();

		if(avaGroup == "none")
		{
			lbSelectTimeDesc.SetVisible(false);
			lbSelectTime.SetVisible(false);
			btnSelectTime.SetVisible(false);
			lbNoAlliance.SetVisible(true);

			lbGWWonderStateDes.txt = Datas.getArString("AVA.OutpostNoneAlliance");
		}
		else
		{
			float minWidth = 0.0f;
			float maxWidth = 0.0f;
			btnSelectTime.rect = lbSelectTimeDesc.rect;
			string backString = string.Empty;
			if(avaGroup == "na")
			{
				btnSelectTime.txt = Datas.getArString("AVA.Outpost_RegionDecNAButton");
				backString = Datas.getArString("AVA.Outpost_RegionDecNABack");
				if(GameMain.Ava.Event.NAStartTime() == 0)
				{
					lbSelectTime.txt = Datas.getArString("AVA.OutpostNoneEvent");
				}
				else
				{
					lbSelectTime.txt = string.Format(Datas.getArString("AVA.Outpost_UTCTime"), _Global.DateTimeChatFormat2(GameMain.Ava.Event.NAStartTime())
					, _Global.DateTimeChatFormat2(GameMain.Ava.Event.NAEndTime()));
				}
			}
			else if(avaGroup == "eu")
			{
				btnSelectTime.txt = Datas.getArString("AVA.Outpost_RegionDecEUButton");
				backString = Datas.getArString("AVA.Outpost_RegionDecEUBack");
				if(GameMain.Ava.Event.EUStartTime() == 0)
				{
					lbSelectTime.txt = Datas.getArString("AVA.OutpostNoneEvent");
				}
				else
				{
					lbSelectTime.txt = string.Format(Datas.getArString("AVA.Outpost_UTCTime"), _Global.DateTimeChatFormat2(GameMain.Ava.Event.EUStartTime())
					, _Global.DateTimeChatFormat2(GameMain.Ava.Event.EUEndTime()));
				}
			}
			
			string frontString = Datas.getArString("AVA.Outpost_RegionDecFront");
			
			lbSelectTimeDesc.mystyle.CalcMinMaxWidth(new UnityEngine.GUIContent(frontString), out minWidth, out maxWidth);
			btnSelectTime.rect.x = Mathf.Ceil(btnSelectTime.rect.x + maxWidth) + offset;
			float btnSelectTimeLength = 0.0f;
			this.btnSelectTime.mystyle.CalcMinMaxWidth(new UnityEngine.GUIContent(this.btnSelectTime.txt), out minWidth, out btnSelectTimeLength);
			this.btnSelectTime.rect.width = btnSelectTimeLength;

			//	use ' ' to fill this space.
			char spaceChar = ' ';
			string space  = spaceChar.ToString();
			float spaceWidth = 0.0f;
			lbSelectTimeDesc.mystyle.CalcMinMaxWidth(new UnityEngine.GUIContent(space), out minWidth, out spaceWidth);

			//int spaceCount = _Global.INT32(Mathf.Ceil(btnSelectTimeLength/(spaceWidth==0?btnSelectTimeLength:spaceWidth)));
			System.Text.StringBuilder strNullSpace = new System.Text.StringBuilder(spaceCount);
			for ( int i = 0; i != spaceCount; ++i )
				strNullSpace.Append(space);

			this.lbSelectTimeDesc.txt =  System.String.Format("{0}{1}{2}", frontString, strNullSpace.ToString(), backString);
			lbSelectTimeDesc.SetVisible(true);
			lbSelectTime.SetVisible(true);
			btnSelectTime.SetVisible(true);
			lbNoAlliance.SetVisible(false);
		}		
	}

	public void HandleNotification(string type, object data)
    {
        switch (type)
        {
			case Constant.Notice.AvaEventOK:
				SetAvaRegionData();
				break;
			default:
				break;
        }
    }

	public void handleItemAction (string action, object param)
	{
		if (action == "OnDetailButton") {
			if (null != OnPushSkillInfo)
				OnPushSkillInfo(param);
		}
	}

	private void OnHelpButton()
	{
        InGameHelpSetting setting = new InGameHelpSetting();
        setting.type = "one_context";
        setting.key = Datas.getArString("AVA.outpost_desc");
        setting.name = Datas.getArString("AVA.Outpost_title");
        
        MenuMgr.instance.PushMenu("InGameHelp", setting, "trans_horiz");
	}

	private void OnAvAEventButton()
	{
		if(GameMain.singleton.curSceneLev() != GameMain.AVA_MINIMAP_LEVEL)
		{
			MenuMgr.instance.PushMenu("AvAEventMenu", null);
		}		
	}

	private void OnSelectTime()
	{
		MenuMgr.instance.PushMenu("OutpostSelectTimePopMenu", null, "trans_zoomComp");
	}

	private void OnGWWonderDetailClicked()
	{
		MenuMgr.instance.PushMenu("OutpostGWWonderPopMenu", null, "trans_zoomComp");
	}
}
