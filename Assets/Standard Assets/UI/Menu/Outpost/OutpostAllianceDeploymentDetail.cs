using UnityEngine;
using System.Collections;
using System;

using GameMain = KBN.GameMain;
using Datas = KBN.Datas;
using MenuMgr = KBN.MenuMgr;

public class OutpostAllianceDeploymentDetail : UIObject 
{

    [SerializeField]
	private ScrollView scrollView;
    [SerializeField]
    private OutpostAllianceDeploymentPanel deploymentPanel;

    public Action OnGoBack { get; set; }
	public override void Init ()
	{
		base.Init ();

        deploymentPanel.Init();
        scrollView.Init();
        deploymentPanel.OnGoBack = GoBack;
	}

	public void SetUIData (object data, AvaAllianceDeployment deployment)
	{
		//base.SetUIData (data, deployment);
		scrollView.rect.x = this.rect.x;
        deploymentPanel.SetUIData(data, deployment);
        scrollView.AutoLayout();
		scrollView.MoveToTop();
	}

	public override void Update ()
	{
		base.Update ();
		
        scrollView.Update();
        deploymentPanel.Update();
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		scrollView.rect.x = this.rect.x;
		scrollView.Draw();

		return -1;
	}


	public override void OnPopOver ()
	{
		base.OnPopOver ();
        deploymentPanel.OnPopOver();
	}

     private void GoBack()
    {
        if (null != OnGoBack) {
            OnPopOver();
            OnGoBack();
        }
    }
}
