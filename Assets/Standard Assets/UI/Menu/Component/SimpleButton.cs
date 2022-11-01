using UnityEngine;
using System;
using System.Collections;

[UILayout.HaveValueCastAttribute]
[Serializable]
public class SimpleButton : SimpleUIElement
{

	[UnityEngine.Space(30), UnityEngine.Header("----------SimpleButton----------")]

	public Texture image;

	public string action;
	public string actionParam;
	public string transition;
	public object clickParam = null;
	//private float delayTime = 0.0f;
	private bool m_bClicked = false;
	private Texture2D normalTexture;
	private bool isDown;

	// Update is called once per frame
	public override void Update() {
	
	}
	
	public void Copy(SimpleButton src)
	{
		rect = src.rect;
		mystyle = src.mystyle;
		category = src.category;
		content = src.content;
	}
	
	public void Copy(Button src)
	{
		rect = src.rect;
		mystyle = src.mystyle;
		category = src.category;
		content = src.content;
	}
	
	public override int Draw()
	{					
		if( !visible ){
			return -1;
		}
		
		if(Event.current.type != EventType.Repaint && disabled ){
			return -1;
		}
		
		Matrix4x4 oldMatrix = GUI.matrix;
		bool matrixChanged = applyRotationAndScaling();

		base.prot_calcScreenRect();

//		FontMgr.SetStyleFont(mystyle, font,FontType.GEORGIAB);
		SetFont();
		SetNormalTxtColor();

		
//		if(Event.current.type == EventType.Repaint && m_bClicked)
//		{
//			delayTime -= Time.deltaTime;
//			if(delayTime <= 0)
//				delayTime = 0;
//		}
		EventType eType = Event.current.type;
		

		if(isDown && (!rect.Contains(Event.current.mousePosition) || Event.current.type == EventType.MouseUp) )
		{
			isDown = false;
//			_Global.Log("set down false");
		}
		
		if( isDown && ( Application.platform == RuntimePlatform.IPhonePlayer || Application.platform ==	RuntimePlatform.Android))
		{
			if (Input.touchCount  < 1 )
			{
				isDown = false;
//				_Global.Log("set down false");
			}	
		}
//		bool isMouseOver = rect.Contains(Event.current.mousePosition)&&isDown;
		if(Event.current.type == EventType.Repaint)
		{
			Color oldColor = GUI.color;
			if ( alpha < 1.0f )
			{
				Color c = new Color(1.0f, 1.0f, 1.0f, alpha);
				GUI.color = oldColor * c;
			}
			
			mystyle.Draw(rect, new GUIContent(txt,image), isDown, isDown, false, false);
//			if(m_bClicked)
//			{
//				delayTime -= Time.deltaTime;
//				if(delayTime <= 0)
//				{
//					delayTime = 0;
//					m_bClicked = false;
//					mystyle.normal.background = normalTexture;
//					return Click();	
//				}	
//			}
			GUI.color = oldColor;
			return -1;
		}	
		
		if( GUI.Button ( rect, new GUIContent(txt,image), mystyle) && !m_bClicked)
		{
//			m_bClicked = true;
//			delayTime = 0.1;
//			normalTexture = mystyle.normal.background;
//			mystyle.normal.background =	mystyle.active.background;
			return Click();
		}	
		if(Event.current.type != EventType.MouseDown && eType== EventType.MouseDown)
		{
//			_Global.Log("mouse down response");	
			isDown = true;
		}	

		if (matrixChanged)
			GUI.matrix = oldMatrix;

		return -1;
	
	}
	
	public override int Click()
	{
		SoundMgr.instance().PlayEffect("on_tap", /*TextureType.AUDIO*/"Audio/");
		if(action == "pushMenu")
		{
			KBN.MenuMgr.instance.PushMenu(actionParam, null, transition);
			return 0;
		}
		else if(action == "popMenu")
		{
			KBN.MenuMgr.instance.PopMenu(actionParam, transition);
			return 0;
		}
		if(OnClick != null)
		{
			try
			{
				OnClick.DynamicInvoke(new object[] {clickParam});
			}
			catch(System.Reflection.TargetParameterCountException)
			{
				OnClick.DynamicInvoke(new object[] {});
			}
		}
			
		return -1;
	}


	
	public void DrawBackground()
	{
	}


	public void EnableBlueButton(bool InEnable) 
	{
		if (InEnable) 
		{
			mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
			mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
			SetDisabled(false);
		} 
		else 
		{
            mystyle.normal.background = mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
			mystyle.active.background = mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
			SetDisabled(true);
		}
	}

	public void EnableGreenButton(bool InEnable) 
	{
		if (InEnable) 
		{
			mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
			mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_downnew",TextureType.BUTTON);
			SetDisabled(false);
		} 
		else 
		{
			mystyle.normal.background = mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
			mystyle.active.background = mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
			SetDisabled(true);
		}
	}
}

