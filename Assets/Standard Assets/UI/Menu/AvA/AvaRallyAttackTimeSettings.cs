using UnityEngine;
using System.Collections;

using MenuMgr = KBN.MenuMgr;
using Datas = KBN.Datas;

public class AvaRallyAttackTimeSettings : PopMenu {

	[SerializeField] private Label lbTitle;
	[SerializeField] private Label lbDesc;
	[SerializeField] private Label lbSplitLine;
	[SerializeField] private Label lbTime1;
	[SerializeField] private Label lbTime2;
	[SerializeField] private Label lbTime3;
	[SerializeField] private Label lbTime4;
	[SerializeField] private Slider sdTime;
	[SerializeField] private Button btnConfirm;
	[SerializeField] private Button btnCancel;

	private int[] SECONDS = { 120, 240, 360, 600 };

	protected void valueChangedFunc(long v) {
		m_rallyAttackTime = SECONDS[v];
	}
	

	public override void Init()
	{
		base.Init();
		
		btnClose.Init();
		btnCancel.OnClick = btnClose.OnClick = new System.Action<System.Object>((param) => {
			MenuMgr.instance.PopMenu("AvaRallyAttackTimeSettings");
		});
		btnConfirm.OnClick = new System.Action<System.Object>((param) => {
            MenuMgr.instance.PopMenu("AvaRallyAttackTimeSettings");

			KBN.GameMain.singleton.SetMarchData(
				new Hashtable
            {
                { "x", m_tileCoordX },
                { "y", m_tileCoordY },
                { "type", m_avaMarchType },
                { "ava", 1 },
				{"rallyTime",m_rallyAttackTime},
            }
			);
			// MenuMgr.instance.PushMenu("MarchMenu", new Hashtable
            // {
            //     { "x", m_tileCoordX },
            //     { "y", m_tileCoordY },
            //     { "type", m_avaMarchType },
            //     { "ava", 1 },
			// 	{"rallyTime",m_rallyAttackTime},
            // }, "trans_zoomComp");
		});

		sdTime.Init(TIME_SEGMENTS - 1, true);
		sdTime.valueChangedFunc = valueChangedFunc;
		sdTime.SetCurValue( 0 );
		valueChangedFunc( 0 );
		// Strings
		btnConfirm.txt = Datas.getArString("Common.Confirm");
		btnCancel.txt = Datas.getArString("Common.Cancel");
		lbTitle.txt = Datas.getArString("AVA.rallyattack_timetorallyattacktitle");
		lbDesc.txt = Datas.getArString("AVA.rallyattack_timeruledesc");

		lbTime1.txt = (SECONDS[0]/60).ToString() + "M";
		lbTime2.txt = (SECONDS[1]/60).ToString() + "M";
		lbTime3.txt = (SECONDS[2]/60).ToString() + "M";
		lbTime4.txt = (SECONDS[3]/60).ToString() + "M";
	}

	protected override void DrawItem()
	{
		base.DrawItem();
		
		lbTitle.Draw();
		lbSplitLine.Draw();
		lbDesc.Draw();
		lbTime1.Draw();
		lbTime2.Draw();
		lbTime3.Draw();
		lbTime4.Draw();
		sdTime.Draw();
		btnConfirm.Draw();
		btnCancel.Draw();
	}
	
	public override void Update()
	{
		base.Update();
		
	}
	
	public override void OnPush(object param)
	{
		base.OnPush(param);
		if( param != null ) {
			Hashtable a = param as Hashtable;
			m_tileType = KBN._Global.INT32( a["tileType"] );
			m_tileCoordX = KBN._Global.INT32( a["x"] );
			m_tileCoordY = KBN._Global.INT32( a["y"] );
			m_avaMarchType = KBN._Global.INT32( a["type"] );
		}
	}
	
	public override void OnPop()
	{
		base.OnPop();
	}
	
	public override void OnPopOver()
	{
		base.OnPopOver();
	}
	private const int TIME_SEGMENTS = 4;
	private long m_rallyAttackTime; // In seconds
	private int m_avaMarchType;
	private int m_tileType;
	private int m_tileCoordX;
	private int m_tileCoordY;
}
