using System.Collections;
using UnityEngine;
public class Transition
{
	protected UIObject m_curMenu;
	protected UIObject m_nextMenu;
	protected UnityEngine.Rect rectCurMenu;
	protected UnityEngine.Rect rectNextMenu;
	public 	  bool visible;
	protected int fadeinSpeed = 90;
	protected int offSet;
	protected bool m_bFin = false;

	public static float static_y=0;
	
	public virtual void StartTrans(UIObject curMenu, UIObject nextMenu)
	{
		KBN.GameMain.singleton.TouchForbidden = true;
		m_curMenu = curMenu;
		m_nextMenu = nextMenu;
		if(curMenu)
			rectCurMenu = curMenu.rect;
		if(m_nextMenu)	
			rectNextMenu = m_nextMenu.rect;
		offSet = KBN.MenuMgr.SCREEN_HEIGHT;
		m_bFin = false;
	}
	
	private float speed;
	
	public virtual void FadeinUpdate()
	{
		if( IsFin() ) return;
		
//		offSet -= fadeinSpeed;
		offSet = (int)UnityEngine.Mathf.SmoothDamp((float)offSet, 0.0f, ref speed, 0.15f);
		m_nextMenu.rect.y = offSet;
		static_y=m_nextMenu.rect.y;
		// Debug.Log("static_y="+static_y);
		// if(m_curMenu.menuName=="MonsterMenu")
		// {
			// m_nextMenu.rect.y=rectNextMenu.y;
		// }
		if(m_nextMenu.rect.y < rectNextMenu.y + 2)
		{
			KBN.GameMain.singleton.TouchForbidden = false;
			m_nextMenu.rect.y = rectNextMenu.y;
			m_bFin = true;
			
			if(m_curMenu){
				m_curMenu.SetVisible(false);
				m_curMenu = null;
			}
			m_nextMenu = null;
		}

	}
	private static bool isMonsterMenu=false;
	public static void SetMonsterMenuBool(){
		isMonsterMenu=true;
	}
	public virtual void FadeoutUpdate()
	{
		if( IsFin() ) return;
		
		//offSet -= fadeinSpeed;
		offSet = (int)UnityEngine.Mathf.SmoothDamp((float)offSet, -2.0f, ref speed, 0.15f);
		m_curMenu.rect.y  = KBN.MenuMgr.SCREEN_HEIGHT - offSet + rectCurMenu.y;
		static_y=m_curMenu.rect.y;
		// Debug.Log("static_y=="+static_y);

		// if(m_curMenu.menuName=="MonsterMenu")
		// {
	#if  UNITY_ANDROID||UNITY_EDITOR
		if(isMonsterMenu){
			m_curMenu.rect.y=KBN.MenuMgr.SCREEN_HEIGHT;
			isMonsterMenu=false;
		}
	#endif
			
		// }
		// }
//		if(m_curMenu.rect.y >= MenuMgr.SCREEN_HEIGHT)
		if(m_curMenu.rect.y > KBN.MenuMgr.SCREEN_HEIGHT - 2)
		{
			KBN.GameMain.singleton.TouchForbidden = false;
			m_curMenu.rect.y = rectCurMenu.y;
			m_curMenu.SetVisible(false);
//			if(m_curMenu instanceof Menu)
//				(m_curMenu as Menu).OnPopOver();
			if(m_nextMenu)
				m_nextMenu.SetDisabled(false);
			m_bFin = true;
			
			m_curMenu = null;
			m_nextMenu = null;
		}
	}
	
	public bool IsFin()
	{
		return m_bFin;
	}
	
	public virtual void SetStartPos(UnityEngine.Vector2 _pos)
	{
		
	}
}

