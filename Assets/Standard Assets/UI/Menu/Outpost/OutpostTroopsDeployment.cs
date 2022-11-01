using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

using Datas = KBN.Datas;
using ScrollList = KBN.ScrollList;
using MenuMgr = KBN.MenuMgr;
using _Global = KBN._Global;

namespace KBN {

	public abstract class OutpostTroopsDeployment : UIObject, IEventHandler {

        [SerializeField]
        private OutpostStatusLabel lbTime;

		[SerializeField]
		private SimpleLabel lbFrame;
		[SerializeField]
		private SimpleLabel lbDesc;
		[SerializeField]
		private SimpleButton btnMarch;
		[SerializeField]
		private SimpleButton btnAlliancesDeployment;
		[SerializeField]
		private SimpleLabel lbCount;

        [SerializeField]
        private SimpleLabel lbCondition;
        [SerializeField]
        private SimpleButton btnCondition;

		[SerializeField]
		private SimpleLabel lbNoMarchesDesc;

		[SerializeField]
		private ScrollList scrollList;

		[SerializeField]
		private OutpostTroopsMovementListItem listItem;
		

		public class MarchData {
			public int marchId;
			public int marchType;
			public int cityId;
			public string knightShowName;
			public string knightTexName;
			public HashObject rawData;
            public HashObject heroData;
		}

		public Action<object> OnPushMarchDetail { get; set; }

		public Action<object> OnPushAllianceDeployments{ get; set; }

        private Requirement[] requirements = null;

		public override void Init ()
		{
			base.Init ();

            lbTime.Init();

			lbFrame.mystyle.normal.background = TextureMgr.singleton.LoadTexture("square_blackorg", TextureType.DECORATION);
			btnMarch.EnableBlueButton(true);
			btnMarch.txt = Datas.getArString("AVA.Outpost_deploytroopsbtn");
			btnMarch.OnClick = new Action(OnMarchButton);

			btnAlliancesDeployment.EnableBlueButton(true);
			btnAlliancesDeployment.txt = Datas.getArString("AVA.Outpost_AllianceDeployment");
			btnAlliancesDeployment.OnClick = new Action(OnAlliancesDeploymentButton);

            btnCondition.txt = Datas.getArString("AVA.outpost_deploy_tapHereToView");
            btnCondition.OnClick = new Action(OnConditionButton);

			scrollList.Init(listItem);
			scrollList.itemDelegate = this;
		}

		protected abstract List<MarchData> GetDeploymentMarches();

		public override void SetUIData (object data)
		{
			base.SetUIData (data);

			Alliance.singleton.reqAllianceInfo(UpdateData);
		}

		public void UpdateData()
		{
			if(Alliance.singleton.myAlliance != null)
			{
				if((Alliance.singleton.myAlliance.isChairman()|| Alliance.singleton.IsHaveRights(AllianceRights.RightsType.AllianceDeployment)) && (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Prepare ||
				GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Match))
				{
					btnAlliancesDeployment.EnableBlueButton(true);
				}
				else
				{
					btnAlliancesDeployment.EnableBlueButton(false);
				}
			}
			else
			{
				btnAlliancesDeployment.EnableBlueButton(false);
			}
			List<MarchData> listdata = GetDeploymentMarches();

			long userPower = GameMain.singleton.AvaGetUserPower();
			long alliancePower = GameMain.singleton.AvaGetAlliancePower();

			lbDesc.txt = string.Format("{0}\n{1}", 
                                       Datas.GetFormattedString("AVA.Outpost_deploytroops_yourtroopspower", _Global.NumSimlify(userPower)),
                                       Datas.GetFormattedString("AVA.Outpost_deploytroops_Alliancepower", _Global.NumSimlify(alliancePower)));

			int divisor = GameMain.singleton.AvaGetMaxDeploymentCountDivisor();
			int sumLevel = Building.singleton.getLevelsSumForType(Constant.Building.RALLY_SPOT);
			int maxCount = Mathf.Max(sumLevel / divisor, 1);

			long playerMight = GameMain.singleton.getPlayerMight();
			long allianceMight = GameMain.singleton.GetAllianceMight();

			long minPlayerMight = GameMain.singleton.AvaGetMinDeploymentIndividualMight();
			long minAllianceMight = GameMain.singleton.AvaGetMinDeploymentAllianceMight();

            bool unreachMax = (listdata.Count < maxCount);
            bool meetCondition = playerMight >= minPlayerMight &&
                allianceMight >= minAllianceMight &&
                Alliance.singleton.MyAllianceId() > 0 &&
                GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Prepare;

            lbCount.txt = String.Format("{0}/{1}", listdata.Count, maxCount);
            lbCount.SetNormalTxtColor(unreachMax ? FontColor.BEGIN : FontColor.Red);

            lbCondition.mystyle.normal.background = meetCondition ?
                TextureMgr.singleton.LoadTexture("icon_satisfactory",TextureType.ICON) :
                TextureMgr.singleton.LoadTexture("icon_unsatisfactory",TextureType.ICON) ;

            lbCondition.txt = meetCondition ?
                Datas.getArString("AVA.outpost_deploy_meetConditions") :
                Datas.getArString("AVA.outpost_deploy_notmeetConditions") ;

            lbCondition.SetNormalTxtColor(meetCondition ? FontColor.Button_White : FontColor.Red);

            btnMarch.EnableBlueButton(unreachMax && meetCondition);

            bool isPrepareTime = (GameMain.Ava.Event.CurStatus == AvaEvent.AvaStatus.Prepare);

            requirements = new Requirement[] {
                new Requirement() {
                    type = Datas.getArString("AVA.outpost_deploy_conditionsPhases"),
                    required = Datas.getArString("AVA.outpost_deploy_prepareTime"),
                    own = isPrepareTime ? Datas.getArString("AVA.outpost_deploy_met") : Datas.getArString("AVA.outpost_deploy_notMet"),
                    ok = isPrepareTime
                },
                new Requirement() {
                    type = Datas.getArString("AVA.outpost_deploy_yourMight"),
                    required = _Global.NumSimlify(minPlayerMight),
                    own = _Global.NumSimlify(playerMight),
                    ok = (playerMight >= minPlayerMight)
                },
                new Requirement() {
                    type = Datas.getArString("AVA.outpost_deploy_allianceMight"),
                    required = _Global.NumSimlify(minAllianceMight),
                    own = _Global.NumSimlify(allianceMight),
                    ok = (allianceMight >= minAllianceMight)
                }
            };

			if (0 == listdata.Count)
			{
				lbNoMarchesDesc.txt = Datas.GetFormattedString("AVA.Outpost_deploytroops_nonedeploydesc", 
	                                       maxCount,
	                                       sumLevel,
	                                       divisor,
	                                       GameMain.singleton.AvaGetMinProtectPower(),
	                                       minPlayerMight, 
	                                       minAllianceMight);

				lbNoMarchesDesc.SetVisible(true);
			}
			else
			{
				lbNoMarchesDesc.SetVisible(false);
			}
			
            scrollList.MoveToTop();
			scrollList.Clear();
			scrollList.SetData(listdata);
			scrollList.MoveToTop();

            MenuMgr.instance.SendNotification(Constant.Notice.AvaOutpostUpdateUndeployedAmount, maxCount - listdata.Count);
		}

		public override int Draw ()
		{
			if (!visible)
				return -1;

			GUI.BeginGroup(rect);

            lbTime.Draw();

			lbFrame.Draw();
			lbDesc.Draw();
			btnMarch.Draw();
			btnAlliancesDeployment.Draw();
			lbCount.Draw();

            lbCondition.Draw();
            btnCondition.Draw();

			lbNoMarchesDesc.Draw();
			scrollList.Draw();

			GUI.EndGroup();

			return -1;
		}

		public override void Update ()
		{
			base.Update ();

            lbTime.Update();
			scrollList.Update();
		}

		public override void OnPopOver ()
		{
			base.OnPopOver ();

			scrollList.Clear();
		}

		protected abstract void RecallMarch(MarchData data);
        protected abstract void RequestDataAndPushMarchDetail(MarchData data);

		public void handleItemAction (string action, object param)
		{
			if (action == "OnClick") {
                MarchData data = param as MarchData;
                if (null != data)
                {
                    if (null != data.heroData) 
                    {
        				if (null != OnPushMarchDetail)
        					OnPushMarchDetail(param);
                    }
                    else
                    {
                        RequestDataAndPushMarchDetail(data);
                    }
                }
			} else if (action == "OnRecall") {
				MarchData data = param as MarchData;
				if (null != data)
					RecallMarch(data);
			} else if (action == "RefreshList") {
				UpdateData();

				GameMain.Ava.Units.RequestAvaUnits();
			}
		}

		private void OnMarchButton()
		{
			Vector2 myCityPos = GameMain.singleton.getCurCityCoor(GameMain.singleton.getCurCityId());
			// MenuMgr.instance.PushMenu("MarchMenu", new Hashtable {
			// 	{"x", (int)myCityPos.x},
			// 	{"y", (int)myCityPos.y},
			// 	{"type", Constant.MarchType.AVA_SENDTROOP}
			// }, "trans_zoomComp");
			KBN.GameMain.singleton.SetMarchData
			(
				new Hashtable 
				{
					{"x", (int)myCityPos.x},
					{"y", (int)myCityPos.y},
					{"type", Constant.MarchType.AVA_SENDTROOP}
				}
			);
		}

		private void OnAlliancesDeploymentButton()
		{
			int allianceId = KBN.Alliance.singleton.MyAllianceId();
			KBN.UnityNet.GetAllianceAvaTroops(allianceId, getAlliancesDeploymentOk, null);
		}

		private void getAlliancesDeploymentOk(HashObject result)
		{
			if(_Global.GetBoolean(result["ok"]))
			{
				

				if(OnPushAllianceDeployments != null)
				{
					OnPushAllianceDeployments(result["data"]);
				}
			}
		}

		private void getAlliancesDeploymentError(string errorMessage, string errorCode)
		{

		}

        private void OnConditionButton()
        {
            if (null == requirements) 
                return;

            MenuMgr.instance.PushMenu("RequirePopMenu", new Hashtable() {
                { "title", Datas.getArString("AVA.outpost_deploy_deployConditionsTitle") },
                { "description", Datas.getArString("AVA.outpost_deploy_conditionsNote") },
                { "requiremenets", requirements }
            }, "trans_zoomComp");
        }
	}

}
