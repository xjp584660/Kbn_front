// TileStateUnderAttackHUD.cs
//
// Brief: Tile state HUD.
// Created: Hong Pan
//
using UnityEngine;
using System.Collections;


public class TileStateUnderAttackHUD : UIObject {


	public long CurHP { 
		set {
			m_curHP = value;
			if( m_maxHP > 0 ) {
				float curWidth = m_maxWidth * m_curHP / m_maxHP;
				m_hpFilling.rect.width = curWidth;
			} else {
				m_hpFilling.rect.width = 0;
			}
		}
		get { return m_curHP;}
	}

	public bool Is2x2 {
		set { m_is2x2 = value; }
		get { return m_is2x2; }
	}


	public long MaxHP {
		set { m_maxHP = value; }
		get { return m_maxHP; }
	}

	public int MaxFillingWidth {
		get { return (int)m_maxWidth; }
	}


	public void Awake() {
		m_maxWidth = m_hpFilling.rect.width;
	}
	
	public void Start() {
		m_hpMeter.setBackground( "pvpbuilding_hpmeter", TextureType.MAP17D3A_UI );
		m_hpFilling.setBackground( "pvpbuilding_hpfilling", TextureType.MAP17D3A_UI );

	}
	
	public void OnGUI() {
		if( !visible ) {
			return;
		}
		
		GUI.depth = 10;
		Matrix4x4 oldMatrix = GUI.matrix;
		GUI.matrix = Matrix4x4.identity;
		
		
		GUI.BeginGroup(rect);
			m_hpMeter.Draw();
			m_hpFilling.Draw();
		GUI.EndGroup();

		GUI.matrix = oldMatrix;
	}

	public Label m_hpMeter;
	public Label m_hpFilling;
	public bool m_is2x2;

	private long m_curHP;
	private long m_maxHP;
	private float m_maxWidth;
}