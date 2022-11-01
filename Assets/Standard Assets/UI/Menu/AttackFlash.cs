using UnityEngine;
using GameMain = KBN.GameMain;

public class AttackFlash : MonoBehaviour
{
	private const float FLASH_SPEED = 2.0f;
    private const float MIN_ALPHA = 0.3f;
    private const int BORDER_WIDTH = 45;
    private readonly Rect DRAW_RECT = new Rect(0.0f, 0.0f, Screen.width, Screen.height);
    private readonly Rect SOURCE_RECT = new Rect(0.0f, 0.0f, 1.0f, 1.0f);

	private static AttackFlash m_Instance = null;
	private Texture2D m_TextureFlash = null;
	private bool m_Enable = false;

	public static AttackFlash Instance
	{
        get
        {
		    if (m_Instance == null)
		    {
		    	m_Instance = GameObject.FindObjectOfType(typeof(AttackFlash)) as AttackFlash;
		    	if (m_Instance == null)
		    	{
		    		GameObject go = new GameObject("AttackFlash");
		    		DontDestroyOnLoad(go);
		    		m_Instance = go.AddComponent(typeof(AttackFlash)) as AttackFlash;
		    	}
		    }

		    return m_Instance;
        }
	}

	private void Awake()
	{
		m_TextureFlash = TextureMgr.instance().LoadTexture("Attack_warning_red", TextureType.DECORATION);
	}

	private void Start()
	{

	}
	
	private void Update()
	{

	}

    private bool IsInAva
    {
        get
        {
            if (GameMain.singleton == null)
            {
                return false;
            }

            if (GameMain.singleton.curSceneLev() == GameMain.AVA_MINIMAP_LEVEL)
            {
                return true;
            }

            return false;
        }
    }

	private void OnGUI()
	{
		if (!m_Enable || m_TextureFlash == null || IsInAva)
		{
            return;
        }

		Color color = Color.white;
		color.a = MIN_ALPHA + 0.5f * (1 - MIN_ALPHA) * (1 + Mathf.Sin(Time.realtimeSinceStartup * FLASH_SPEED));
		
		if (Event.current.type.Equals(EventType.Repaint))
		{
			Graphics.DrawTexture(DRAW_RECT, m_TextureFlash, SOURCE_RECT, BORDER_WIDTH, BORDER_WIDTH, BORDER_WIDTH, BORDER_WIDTH, color);
		}
	}

	public void SetEnable(bool enable)
	{
		m_Enable = enable;
	}
}
