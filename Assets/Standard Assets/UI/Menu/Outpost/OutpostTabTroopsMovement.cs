using UnityEngine;
using System.Collections;

using GameMain = KBN.GameMain;
using OutpostTroopsDeployment = KBN.OutpostTroopsDeployment;
using OutpostAllianceDeployments = KBN.OutpostAllianceDeployments;

public class OutpostTabTroopsMovement : TabContentUIObject {

	[SerializeField]
	private OutpostTroopsMovement troopsMovementInfo;
	[SerializeField]
	private OutpostTroopsDeployment troopsDeploymentInfo;
	[SerializeField]
	private AvaRallyAttackDetail rallyAttackDetail;
	[SerializeField]
	private OutpostTroopsMarchInfo troopsMarchInfo;
	[SerializeField]
	public OutpostAllianceDeployments allianceDeploymentInfo;
	[SerializeField]
	public OutpostAllianceDeploymentDetail allianceDeploymentDetail;

	private NavigatorController navigatorController;
	[SerializeField]
	public AvaAllianceDeployment deployment;

	private enum UIType {
		UI_DEPLOYMENT,
		UI_TROOPSMOVEMENT
	}
	private UIType uiType;

	public override void Init ()
	{
		base.Init ();

		navigatorController = new NavigatorController();
		navigatorController.Init();

		troopsMovementInfo.Init();
		troopsMovementInfo.OnPushMarchDetail = PushMarchDetail;
		troopsDeploymentInfo.Init();
		troopsDeploymentInfo.OnPushMarchDetail = PushMarchDetail;
		troopsDeploymentInfo.OnPushAllianceDeployments = PushAllianceDeployments;
		rallyAttackDetail.Init();
		rallyAttackDetail.OnGoBack = GoBack;
		troopsMarchInfo.Init();
		troopsMarchInfo.OnGoBack = GoBack;
		allianceDeploymentInfo.Init();
		allianceDeploymentInfo.OnGoBack = GoBack;
		allianceDeploymentInfo.OnGetAllianceDeploymentDetail = OnGetAllianceDeploymentDetail;
		allianceDeploymentDetail.Init();
		allianceDeploymentDetail.OnGoBack = GoBack;
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;
		
		navigatorController.DrawItems();
		return -1;
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);

		Hashtable hashtable = param as Hashtable;
		if (null != hashtable && hashtable.ContainsKey("ShowTroopsDeployment")) {
			uiType = UIType.UI_DEPLOYMENT;
			troopsDeploymentInfo.SetUIData(param);
			navigatorController.push(troopsDeploymentInfo);
		} else {
			uiType = UIType.UI_TROOPSMOVEMENT;
			troopsMovementInfo.SetUIData(param);
			navigatorController.push(troopsMovementInfo);
		}
	}

	public override void FixedUpdate ()
	{
		base.FixedUpdate ();

		navigatorController.u_FixedUpdate();
	}

	public override void Update ()
	{
		base.Update ();

		navigatorController.u_Update();
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

		troopsMovementInfo.OnPopOver();
		troopsDeploymentInfo.OnPopOver();
		rallyAttackDetail.OnPopOver();
		troopsMarchInfo.OnPopOver();
	}

	private void PushMarchDetail(object data)
	{
        AvaRallyAttack rallyAttack = data as AvaRallyAttack;
        if (null != rallyAttack && null != rallyAttack.MarchData.rallyAttackInfo) {
            rallyAttackDetail.SetUIData(new AvaRallyDetailInfo(rallyAttack));
			navigatorController.push(rallyAttackDetail);
		} else {
			troopsMarchInfo.SetUIData(data);
			navigatorController.push(troopsMarchInfo);
		}
	}

	private void PushAllianceDeployments(object data)
	{
		allianceDeploymentInfo.SetUIData(data);
		navigatorController.push(allianceDeploymentInfo);
	}

	private void GoBack()
	{
		navigatorController.pop();
	}

	private void OnGetAllianceDeploymentDetail(object data)
	{
		deployment = data as AvaAllianceDeployment;
		int allianceId = KBN.Alliance.singleton.MyAllianceId();
    	KBN.UnityNet.GetAllianceAvaTroop(allianceId, deployment.userId, getAlliancesDeploymentOk, null);
	}

	 private void getAlliancesDeploymentOk(HashObject result)
	{
		if(KBN._Global.GetBoolean(result["ok"]))
		{
			allianceDeploymentDetail.SetUIData(result["data"], deployment);
			navigatorController.push(allianceDeploymentDetail);
		}
	}

	private void getAlliancesDeploymentError(string errorMessage, string errorCode)
	{

	}

	public override void HandleNotification (string action, object data)
	{
		if (uiType == UIType.UI_DEPLOYMENT)
		{
			if (action == Constant.Notice.ON_MARCH_OK)
			{
				troopsDeploymentInfo.UpdateData();

				GameMain.Ava.Units.RequestAvaUnits();
			}

            if (action == Constant.Notice.AvaPowerUpdated)
            {
                troopsDeploymentInfo.UpdateData();
            }

            if (action == Constant.AvaNotification.StatusChanged)
            {
                troopsDeploymentInfo.UpdateData();
            }
		}
		else if (uiType == UIType.UI_TROOPSMOVEMENT)
		{
			if (action == Constant.Notice.AvaMarchOK || 
			    action == Constant.Notice.AvaGetMarchListOK || 
			    action == Constant.Notice.AvaMarchRemoved) {

				troopsMovementInfo.UpdateData();
			}
		}
	}

	public override bool OnBackButton()
	{
		if(!navigatorController.isNormaState)
		{
			return true;
		}

		if (navigatorController.topUI == rallyAttackDetail 
		    || navigatorController.topUI == troopsMarchInfo) 
		{
			GoBack ();
			return true;
		}
		return false;
	}
}
