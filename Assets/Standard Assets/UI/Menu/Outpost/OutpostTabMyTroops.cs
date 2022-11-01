using UnityEngine;
using System.Collections;

using GameMain = KBN.GameMain;

public class OutpostTabMyTroops : TabContentUIObject {
    
    [SerializeField]
    private OutpostStatusLabel lbTime;
	
	[SerializeField]
	private ScrollView scrollView;

	[SerializeField]
	private OutpostTabMyTroopsInnerPanel innerPanel;

	public override void Init ()
	{
		base.Init ();

        lbTime.Init();

		innerPanel.Init();
		scrollView.Init();
	}

	public override void OnPush (object param)
	{
		base.OnPush (param);

		innerPanel.SetUIData(param);
		scrollView.AutoLayout();
		scrollView.MoveToTop();

		GameMain.Ava.Units.RequestAvaUnits();

        KBN.Game.Event.RegisterHandler(KBN.EventId.AvaStatus, OnAvaStatusChanged);
	}

	public override void OnPopOver ()
	{
		base.OnPopOver ();

        KBN.Game.Event.UnregisterHandler(KBN.EventId.AvaStatus, OnAvaStatusChanged);

		innerPanel.OnPopOver();
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

        lbTime.Draw();
		scrollView.Draw();

		return -1;
	}
	
	public override void Update ()
	{
		base.Update ();
		
        lbTime.Update();
		scrollView.Update();
		innerPanel.Update();
	}

	public override void HandleNotification (string action, object data)
	{
		switch (action) {
		case Constant.Notice.AvaUnitsRefreshed:
			innerPanel.SetUIData(null); // refresh whole ui
			scrollView.AutoLayout();
			scrollView.MoveToTop();
			break;
		case Constant.AvaNotification.AssignKnightOK:
		case Constant.AvaNotification.UnAssignKnightOK:
			innerPanel.UpdateDefenseGeneral();
			break;
		}
	}

    private void OnAvaStatusChanged(object sender, GameFramework.GameEventArgs e)
    {
        innerPanel.UpdateDefenseGeneral();
    }
}
