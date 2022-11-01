using UnityEngine;
using System.Collections;

using UnityNet = KBN.UnityNet;
using MenuMgr = KBN.MenuMgr;
using _Global = KBN._Global;

public class AllianceEmblemButton : UIObject {

	[SerializeField]
	private AllianceEmblem emblem;

	[SerializeField]
	private SimpleLabel InfoIcon;

	[SerializeField]
	private SimpleButton CoverButton;


	public AllianceEmblemData Data {
		set {
			emblem.Data = value;
		}
		get {
			return emblem.Data;
		}
	}

	public override void Init ()
	{
		InfoIcon.Init();
		InfoIcon.mystyle.normal.background = TextureMgr.singleton.LoadTexture("infor_icon", TextureType.DECORATION);

		CoverButton.Init();
		CoverButton.OnClick = new System.Action(OnCoverButton);

		UpdateRects();
	}

	public void UpdateRects()
	{
		emblem.rect = rect;
		CoverButton.rect = rect;
	}

	public override int Draw ()
	{
		if (!visible)
			return 0;

		emblem.Draw();
		InfoIcon.Draw();
		CoverButton.Draw();

		return 0;
	}

	private void OnCoverButton() {

		UnityNet.reqAllianceEmblemEditorInfo(OnInfoArrived, null);
	}

	private void OnInfoArrived(HashObject result) {
		if (_Global.GetBoolean(result["ok"]))
		{
			MenuMgr.instance.PushMenu("AllianceEmblemEditor", result["allianceEmblems"], "trans_zoomComp");
		}
	}
}
