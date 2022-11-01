using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class ComposedMenu : KBNMenu
{
	public ToolBar titleTab;
	protected int selectedTab = 0;
	protected int lastTab = 0;
	public MenuHead clone_menuHead;
	public MenuHead menuHead;
	protected List<SubMenu> subMenuStack = new List<SubMenu>();
	protected SubMenu popMenu = null;
	protected UIObject oldMenu = null;
	protected SubMenu curSubMenu = null;
	protected TransHorMove trans= new TransHorMove();
	protected UIObject[] tabArray;
	private   GUIStyle backStyle;

	
	protected enum State{
		Normal,
		Push,
		Pop
	};
	protected State curState = State.Normal;

	//for the case that want to mem last tab index
	public void Init(bool bInitToolBar)
	{
		base.Init();
		if ( clone_menuHead != null && menuHead == null)
			menuHead = (Instantiate(clone_menuHead.gameObject) as GameObject).GetComponent<MenuHead>();
		if ( menuHead != null )
			menuHead.Init();
		if(titleTab != null && bInitToolBar)
			titleTab.Init();
	}
	
	public override void Init()
	{
		base.Init();
		if ( clone_menuHead != null && menuHead == null)
			menuHead = (Instantiate(clone_menuHead.gameObject) as GameObject).GetComponent<MenuHead>();
		if ( menuHead != null )
			menuHead.Init();
		if(titleTab != null)
			titleTab.Init();
	}
	
	public override void OnPopOver()
	{
		if ( clone_menuHead != null && menuHead != null )
		{
			TryDestroy(menuHead);
			menuHead = null;
		}
		if(curSubMenu!=null)
			prot_OnSubMenuTransFin(curSubMenu, false);
		base.OnPopOver();
	}

	protected override void DrawBackground()
	{
		if(menuHead != null)
			menuHead.Draw();
		if(Event.current.type != EventType.Repaint)
			return;
		//		GUI.Label( Rect(0, 0, rect.width, titleBack.height ), titleBack );	
		if(titleTab != null)
		{
			//			backStyle.normal.background = background;
			//			DrawTextureClipped(background, Rect(0, 0, 640, 970), Rect(0, titleTab.rect.yMax -10, rect.width, rect.height ), rotation);
			//			GUI.DrawTexture( Rect(0, titleTab.rect.yMax -10, rect.width, rect.height ), background );
			bgStartY = System.Convert.ToInt32(titleTab.rect.yMax -10);
			DrawMiddleBg();
			//			backStyle.normal.background = frameTop;
			//GUI.DrawTexture( Rect(0, titleTab.rect.yMax- 10, rect.width , frameTop.height), frameTop);
			frameTop.rect = new Rect( 0, titleTab.rect.yMax- 10, frameTop.rect.width, frameTop.rect.height);
			frameTop.Draw();
		}
		else
		{
			//		backStyle.normal.background = background;
			//		DrawTextureClipped(background, Rect(0, 0, 640, 970), Rect(0, 85, rect.width, rect.height ), rotation);
			//		GUI.DrawTexture( Rect(0, 85, rect.width, rect.height ), background);
			bgStartY = 85;
			DrawMiddleBg();
			//		backStyle.normal.background = frameTop;
			//		GUI.DrawTexture( Rect(0, 85, rect.width , frameTop.height), frameTop);
			frameTop.rect = new Rect( 0, 85, frameTop.rect.width, frameTop.rect.height);
			frameTop.Draw();
		}
		//		GUI.Label( Rect(0, rect.height - frameBottom.height, frameBottom.width, frameBottom.height), frameBottom);
	}

	protected override void DrawTitle()
	{
		if(titleTab == null)
			return;	
		selectedTab = titleTab.Draw();
		if( lastTab != selectedTab)
		{
			ClearMenuStack();
			lastTab = selectedTab;
		}
	}
	
	public override void OnPush(System.Object param)
	{
		base.OnPush(param);
		curState = State.Normal;
		subMenuStack.Clear();
	}

	public virtual void PushSubMenu(SubMenu menu, System.Object param)
	{
		//	var oldMenu:SubMenu = subMenuStack[];
		while( curState != State.Normal )
		{
			UpdateTransition();
		}
		curSubMenu=menu;
		subMenuStack.Add(menu);
//		subMenuStack.Push(menu);
		if(subMenuStack.Count > 1)
		{
			oldMenu = subMenuStack[subMenuStack.Count - 2];
		}
		else
			oldMenu = tabArray[selectedTab];
		curState = State.Push;
		menu.OnPush(param);
		if(subMenuStack.Count == 1)
			trans.StartTrans(tabArray[selectedTab],menu);
		else
			trans.StartTrans(oldMenu,menu);	
		menu.SetVisible(true);
		//		menu.enabled = true;
		trans.FadeinUpdate();
		prot_OnSubMenuTransFin(oldMenu as SubMenu, false);
		if(InputText.getKeyBoard() != null)
			InputText.getKeyBoard().active = false;
	}
	
	public virtual void PopSubMenu()
	{
		if(subMenuStack.Count <= 0) return;	
		while( curState != State.Normal )
		{
			UpdateTransition();
		}

		popMenu = subMenuStack[subMenuStack.Count - 1];
		subMenuStack.RemoveAt(subMenuStack.Count - 1);
//		popMenu = subMenuStack.Pop();	
		oldMenu = null;			
		popMenu.OnPop();
		curState = State.Pop;
		if(subMenuStack.Count == 0)
			trans.StartTrans(popMenu, tabArray[selectedTab]);
		else
			trans.StartTrans(popMenu, subMenuStack[subMenuStack.Count - 1]);	
		trans.FadeoutUpdate();	
		if(InputText.getKeyBoard() != null)
			InputText.getKeyBoard().active = false;
	}

	public virtual SubMenu GetTopSubMenu()
	{
		if(subMenuStack != null && subMenuStack.Count > 0)
			return subMenuStack[subMenuStack.Count - 1];
		return null;
	}
	
	public override int Draw()
	{
		if(!visible)
			return -1;		
		
		if(disabled && Event.current.type != EventType.Repaint)	
			return -1;	
		
		Color oldColor = GUI.color;
		Matrix4x4 matrix = GUI.matrix; 
		Matrix4x4 scaleMatrix = Matrix4x4.Scale  (new Vector3 (m_scale, m_scale, 1.0f));
		GUI.matrix = scaleMatrix*matrix ;
		GUI.color = m_color;		

		if(adapterIphoneX){
			if(showIphoneXFrame){
				GUI.BeginGroup(m_top.rect);
				m_top.Draw();
				GUI.EndGroup();
			}

			
			
			Matrix4x4 scale2 = Matrix4x4.Scale  ( new Vector3 (scaleX, iphoneXSacleY, 1.0f));
			GUI.matrix = scale2*matrix ;
			float f= rect.y*iphoneXSacleY+offsetY;
			GUI.BeginGroup(new Rect (rect.x,f,rect.width,rect.height));		
			DrawBackground();		
			DrawTitle();	
			if( subMenuStack.Count == 0 )
			{							
				DrawItem();
			}
			DrawSubMenu();		
			GUI.EndGroup();

			if(showIphoneXFrame){
				GUI.matrix = scaleMatrix*matrix ;
				GUI.BeginGroup(new Rect(m_bottom.rect.x,960 - m_bottom.rect.height,m_bottom.rect.width,m_bottom.rect.height));
//				GUI.BeginGroup(new Rect(m_bottom.rect.x,rect.height*(iphoneXSacleY-0.01f)+m_top.rect.height,m_bottom.rect.width,m_bottom.rect.height));
				m_bottom.Draw();
				GUI.EndGroup();
			}

			
			
		}else{
			GUI.BeginGroup(rect);		
			DrawBackground();		
			DrawTitle();	
			if( subMenuStack.Count == 0 )
			{							
				DrawItem();
			}
			DrawSubMenu();		
			GUI.EndGroup();
		}

		
		GUI.color = oldColor;
		GUI.matrix = matrix;
		
		return -1;
	}

	protected override void DrawItem()
	{ 
		if(tabArray[selectedTab])
		{
			tabArray[selectedTab].Draw();
		}
	}
	
	protected virtual void DrawSubMenu()
	{
		if(oldMenu && curState != State.Normal)
		{
			oldMenu.Draw();
		}
		
		if(subMenuStack.Count > 0)
		{
			(subMenuStack[subMenuStack.Count - 1] as SubMenu).Draw();
		}
		if( popMenu )
			popMenu.Draw();
	}
	
	public override void FixedUpdate()
	{
		base.FixedUpdate();
		UpdateTransition();
	}
	
	public void UpdateTransition()
	{
		if(curState == State.Push)
		{
			trans.FadeinUpdate();
			if(trans.IsFin())
			{
				curState = State.Normal;
				if(subMenuStack.Count>0)
				{
					SubMenu oMenu = subMenuStack[subMenuStack.Count-1] as SubMenu;
					oldMenu = null;
					prot_OnSubMenuTransFin(oMenu, true);
				}
			
			}
		}
		else if(curState == State.Pop)
		{
			trans.FadeoutUpdate();
			if(trans.IsFin())
			{
				curState = State.Normal;
				SubMenu pMenu = popMenu as SubMenu;
				popMenu = null;
				oldMenu = null;
//				prot_OnSubMenuTransFin(pMenu, false);
			}
		}
	}

	protected virtual void prot_OnSubMenuTransFin(SubMenu menu, bool isPush)
	{

	}
	
	public override void Update()
	{
		
		if( menuHead != null ){
			menuHead.Update();
		}
		
		if(subMenuStack.Count > 0)
			(subMenuStack[subMenuStack.Count-1] as SubMenu).Update();
	}
	
	protected void ClearMenuStack()
	{
		subMenuStack.Clear();
	}
	
	public virtual bool OnBackButton()
	{
		if (this.GetTopSubMenu() == null)
		{
			return false;
		}

		this.PopSubMenu();
		return true;
	}
	public virtual void ClickShareReport(object param){

	}
}
