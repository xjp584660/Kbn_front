using UnityEngine;
using System.Collections;

public class AvaTileProtectionTimeHUD : UIObject {
	public Label m_labelBG;
	public Label m_labelTime;
	public bool Is2x2 { set; get; }
	public long Time { set; get; }
	public GameObject protection;

	public void Awake() {
	}

	void Update() {
		long now = KBN.GameMain.unixtime();
		if( Time > now ) {
			m_labelTime.txt = KBN._Global.timeFormatStrPlus( Time - now );
		} else {
			m_labelTime.txt = KBN._Global.timeFormatStrPlus( 0 );
			this.gameObject.SetActive(false);
			protection.SetActive(false);
		}
	}
	
	public void Start() {
	}

	public void OnGUI() {
		if( !visible ) {
			return;
		}
		
		GUI.depth = 10;
		Matrix4x4 oldMatrix = GUI.matrix;
		GUI.matrix = Matrix4x4.identity;
		
		
		GUI.BeginGroup(rect);
		m_labelBG.Draw();
		m_labelTime.Draw();
		GUI.EndGroup();
		
		GUI.matrix = oldMatrix;
	}


}
