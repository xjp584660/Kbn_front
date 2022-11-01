using UnityEngine;
using System.Collections;

public class CampaignWidgets
{

	class Widget // Widget struct
	{
		public GameObject	m_go;

		public Widget()
		{
			m_go = null;
		}
	};

	// Widget Type
	public static int TYPE_LEADERBOARD = 0;
	public static int TYPE_HIDDEN_BOSS = 1;
	public static int TYPE_STAMINA_POTION = 2;
	public static int TYPE_STARS_IN_CHPATER_VIEW = 3;
	public static int TYPE_LEADERBOARD_IN_CHAPTER_VIEW = 4;
	public static int TYPE_PVE_BUFF = 5;
	public static int TYPE_MAIL=6;
	public static int TYPE_MAIL_IN_CHAPTER_VIEW=7;
	public static int TYPE_STAMINA_POTION_IN_CHAPTER_VIEW = 8;
	public static int TYPE_PVE_BUFF_IN_CHAPTER = 9;


	public static int TYPE_NUM = TYPE_PVE_BUFF_IN_CHAPTER + 1;

	// Widget Number Type
	public static int NUMBER_TYPE_STAMINA_POTION = 2;
	public static int NUMBER_TYPE_STARS_IN_CHPATER_VIEW = 3;
	public static int NUMBER_TYPE_BOSSES = 4;
	public static int NUMBER_TYPE_STAMINA_POTION_IN_CHAPTER_VIEW = 8;


  
	private Widget[] m_widgets;
	private Vector3[] m_originalPositions;
	private Camera m_cam;

	private int m_newBossCount = 0;
	public int NewBossCount
	{
		get { return m_newBossCount; }
		set { m_newBossCount = value; }
	}

	private int m_curSamina = 1000;


	private float moveSpeed =  - 9f;

	private float moveDis = 0;

	private bool isMove = false;

	//---------------------------------------------------------------------------------

	public void setWidgetData( int numberType, int param1, int param2 = 0 )
	{
		int index = numberType;
		string name1 = "number";
		string name2 = "bossNumber";
		bool need2ndFind = false;

		if( index == NUMBER_TYPE_BOSSES )
		{
			index = TYPE_HIDDEN_BOSS;
			need2ndFind = true;
			name1 = "bossNumberObj";
			NewBossCount = param1;
		}
		else if( index == NUMBER_TYPE_STARS_IN_CHPATER_VIEW )
		{
			need2ndFind = true;
			name1 = "star";
			name2 = "number";
		}

		if( m_widgets[index].m_go )
		{
			GameObject numGO = m_widgets[index].m_go.transform.Find( name1 ).gameObject;
			if( numGO )
			{
				if( need2ndFind )
				{
					numGO = numGO.transform.Find( name2 ).gameObject;
				}

				TextMesh tm = numGO.GetComponent<TextMesh>();
				if( numberType == NUMBER_TYPE_STAMINA_POTION|| numberType == NUMBER_TYPE_STAMINA_POTION_IN_CHAPTER_VIEW)
				{
					if(m_curSamina < param1)
					{
						SoundMgr.instance().PlayEffect("kbn_pve_stamina", TextureType.AUDIO_PVE);
					}
					m_curSamina = param1;
					tm.text = ""+param1+"/"+param2;
				}
				else if( numberType == NUMBER_TYPE_STARS_IN_CHPATER_VIEW )
				{
					tm.text = ""+param1+"/"+param2;
				}
				else
				{
					tm.text = ""+param1;
				}
			}
		}
	}

	public void updatePositions()
	{
	
		if( m_cam && moveDis <= 0 && !isMove )
		{
			for( int i = TYPE_LEADERBOARD; i < TYPE_NUM; ++i )
			{
				if( m_widgets[i].m_go )
				{
					m_widgets[i].m_go.transform.position = m_cam.ScreenToWorldPoint(
																relocatePositionFromOriginalResolution(
																m_originalPositions[i] ) );
				}
			}
		}
		else if(m_cam && moveDis >=4 && !isMove)
		{
            for( int i = TYPE_LEADERBOARD; i < TYPE_NUM; ++i )
			{
				if( m_widgets[i].m_go )
				{
					m_widgets[i].m_go.transform.position = m_cam.ScreenToWorldPoint(
																relocatePositionFromOriginalResolution(
																m_originalPositions[i] ) )+Vector3.forward*moveDis;
				}
			}

		}
		else if( m_cam && isMove)
		{
            for( int i = TYPE_LEADERBOARD; i < TYPE_NUM; ++i )
			{
				if( m_widgets[i].m_go )
				{
					m_widgets[i].m_go.transform.position +=   Vector3.forward * moveSpeed * Time.deltaTime ;
				}
			}
            if(moveSpeed>0){
				moveDis += moveSpeed* Time.deltaTime ;
				if(moveDis >= 4.5f)
				{
                   isMove = false;
				}
			}else{
				moveDis += moveSpeed * Time.deltaTime ;
				if(moveDis <= 0)
				{
                   isMove = false;
				}
			}
		}
	}

	public void setWidgetGO( int type, GameObject go, Camera cam, Transform parentXform,
	                        string name )
	{
		if( !m_widgets[type].m_go )
		{
			m_widgets[type].m_go = go;
			m_widgets[type].m_go.name = name;
			m_widgets[type].m_go.transform.localPosition = cam.ScreenToWorldPoint(
										relocatePositionFromOriginalResolution(
										m_originalPositions[type] ) );
			m_widgets[type].m_go.transform.parent = parentXform;
			m_widgets[type].m_go.transform.position = cam.ScreenToWorldPoint(
										relocatePositionFromOriginalResolution(
										m_originalPositions[type] ) );
			m_cam = cam;
		}
	}
	
	public void setWidgetEnabled( int type, bool enabled )
	{
		if( m_widgets[type].m_go )
		{
			m_widgets[type].m_go.SetActive( enabled );
		}
	}

	public CampaignWidgets()
	{
		// Widgets
		m_widgets = new Widget[TYPE_NUM];
		for( int i = 0; i < TYPE_NUM; ++i )
		{
			m_widgets[i] = new Widget();
		}
		
		// Original positions
		m_originalPositions = new Vector3[]
		{
			new Vector3(68,630,50),		// Leaderboard
			new Vector3(68,530,50),		// Hidden boss
			new Vector3(550,630,50),	// Stamina Point
			new Vector3(550,530,50),	// Stars in chapter map
			new Vector3(68,630,50),		// Leaderboard in chapter map
			new Vector3(68,730,50),    // pvebuffer
			new Vector3(68,430,50),		// email
			new Vector3(68,530,50),
			new Vector3(550,630,50),
			new Vector3(68,730,50),    // pvebuffer	
		};
	}



	//---------------------------------------------------------------------------------

	private Vector3 relocatePositionFromOriginalResolution( Vector3 oldPos )
	{
		return new Vector3 (oldPos.x * Screen.width / 640.0f,
		                   oldPos.y * Screen.height / 960.0f,
		                   oldPos.z);
	}

	public void ClickHideButton()
	{
       moveSpeed = -1 * moveSpeed;
	   isMove = true;
	}
}