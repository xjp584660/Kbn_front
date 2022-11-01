using UnityEngine;
using System.Collections;
using System;

public class OutpostTabDetail : TabContentUIObject {

	[SerializeField]
    private OutpostStatusLabel lbTime;
	[SerializeField]
	private OutpostDetailInfo detailInfo;
	[SerializeField]
	private OutpostSkillDetail skillDetail;
	
	private NavigatorController navigatorController;

	[SerializeField]
	private ScrollView scrollView;

	public override void Init ()
	{
		base.Init ();

		lbTime.Init();

		navigatorController = new NavigatorController();
		navigatorController.Init();

		detailInfo.Init();
		detailInfo.OnPushSkillInfo = PushSkillInfo;

		skillDetail.Init();
		skillDetail.OnGoBack = PopSkillInfo;

		scrollView.Init();
	}

	public override void FixedUpdate ()
	{
		base.FixedUpdate ();

		navigatorController.u_FixedUpdate();
	}

	public override void Update ()
	{
		base.Update ();

		lbTime.Update();
		navigatorController.u_Update();
		scrollView.Update();
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;
		
		if(navigatorController.topUI == detailInfo)
		{
			lbTime.Draw();
			scrollView.Draw();			
		}
		else
		{
			navigatorController.DrawItems();
		}		
		return -1;
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

		detailInfo.OnPopOver();
		skillDetail.OnPopOver();
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);
		detailInfo.SetUIData(param);
		scrollView.AutoLayout();
		scrollView.MoveToTop();
		
		detailInfo.SetIsDraw(true);
		navigatorController.push(detailInfo);	
	}

	private void PushSkillInfo(object param)
	{
		detailInfo.SetIsDraw(false);

		skillDetail.SetUIData(param);
		navigatorController.push(skillDetail);
	}

	private void PopSkillInfo()
	{
		detailInfo.SetIsDraw(true);
		
		navigatorController.pop(skillDetail);
        detailInfo.SetUIData(null);
	}

	public override bool OnBackButton()
	{
		if(!navigatorController.isNormaState)
		{
			return true;
		}
		if(navigatorController.topUI == skillDetail)
		{
			PopSkillInfo ();
			return true;
		}
		return false;
	}
}
