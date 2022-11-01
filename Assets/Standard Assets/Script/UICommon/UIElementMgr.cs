using System;
using System.Collections.Generic;
using UnityEngine;
public class UIElementMgr
{
	private List<IUIElement> m_uiElementList;
	private Dictionary<uint, List<IUIElement>> uiElementDic;

	public UIElementMgr() {

		m_uiElementList = new List<IUIElement>();
		uiElementDic = new Dictionary<uint, List<IUIElement>>();

	}


	public static List<IUIElement> GetElements(UILayout.UIFrame root)
	{
		List<IUIElement> elements = new List<IUIElement>();
		root.VisitItems( (uiFrame, level, usrObj) =>
		{
			var uiObjContains = uiFrame as UIObjContainForLayout;
			if ( null == uiObjContains)
				return true;
			for (uint i = 0; i != uiObjContains.Count; ++i )
			{
				IUIElement elem = uiObjContains.GetElement(i);
				elements.Add(elem);
			}
			return true;
		}
		, 0, null);
		return elements;
	}

	//private UILayout.UIFrame m_frameRoot;
	public void CatchElement(UILayout.UIFrame frameRoot)
	{
		uiElementDic.Clear();
		uint uiMaxLevel = 0;
		frameRoot.VisitItems( (uiFrame, level, usrObj)=>
		{
			var uiObjContains = uiFrame as UIObjContainForLayout;
			if ( uiObjContains == null )
				return true;
			for ( uint i = 0; i != uiObjContains.Count; ++i )
			{
				IUIElement uiElm = uiObjContains.GetElement(i);
				//var agentElm = uiElm as IAgentElement;

				uint zOrder = (uint)level;
				//if ( agentElm != null )
				//	zOrder = (uint)((int)zOrder + agentElm.ZOrderOffset);

				if ( !uiElementDic.ContainsKey(zOrder) )
				{
					uiElementDic.Add(zOrder, new List<IUIElement>());
					if ( zOrder > uiMaxLevel )
						uiMaxLevel = zOrder;
				}
				uiElementDic[zOrder].Add(uiElm);
			}
			return true;
		}, 0, null);

		m_uiElementList.Clear();
		for ( uint i = 0; i <= uiMaxLevel; ++i )
		{
			if ( !uiElementDic.ContainsKey(i) )
				continue;

			foreach ( var uiItem in uiElementDic[i] )
				m_uiElementList.Add(uiItem);
		}
		
		//m_frameRoot = frameRoot;
	}
	
	public void Reorder(UILayout.UIFrame frameRoot)
	{
		frameRoot.Reorder(0, 0, KBN._Global.ScreenWidth + 1,  KBN._Global.ScreenHeight+1);
	}
	
	public void Draw()
	{
		Draw(null, null);
	}
	
	public void Draw(Action preDraw, Action postDraw)
	{
		if ( m_uiElementList == null )
			return;

		UnityEngine.Matrix4x4 oldMatrix = ResetMatrix();
		if (preDraw != null)
		{
			preDraw();
		}
		if ( UnityEngine.Event.current.type == UnityEngine.EventType.Repaint )
		{	//	top -> bottom
			for ( int x = 0; x != m_uiElementList.Count; ++x )
				m_uiElementList[x].Draw();
		}
		else
		{	//	bottom -> top
			for ( int y = m_uiElementList.Count - 1; y >= 0; --y )
				m_uiElementList[y].Draw();
		}
		if (postDraw != null)
		{
			postDraw();
		}
		//ShowProgress();
		RestoryMatrix(oldMatrix);
	}
	
	public bool IsHitUI(UnityEngine.Vector2 pos)
	{
		var pt = new UnityEngine.Vector2(pos.x, UnityEngine.Screen.height - pos.y);
        pt = ResolutionHelperFactory.Product.ScreenToUISpace(pt);

		if ( m_uiElementList == null )
			return false;
		//	top -> bottom
		foreach (var item in m_uiElementList)
		{
			var rect = item.rect;
			AgentElement agentElement = (item as AgentElement);
			if (agentElement != null)
			{
				if (KBN._Global.isIphoneX() || KBN._Global.isIphoneXR())
				{/*判断是否有花边 如果有就把下面四个按钮的位置判断减去120 防止穿透问题*/
					if (agentElement.RefName == "btnMarch" || agentElement.RefName == "btnTrain" || agentElement.RefName ==
						"btnBuildQueue" || agentElement.RefName == "btnExplore")
					{
						rect.yMin -= 120;
					}
				}
			}
			if (item.IsShow && rect.Contains(pt))
				return true;
		}
		return false;
	}

	static public UnityEngine.Matrix4x4 ResetMatrix()
	{
		var oldMatrix = UnityEngine.GUI.matrix;
        
		if((KBN._Global.isIphoneX() || KBN._Global.isIphoneXR())&& KBN.MenuMgr.instance!=null){
			float frameTHeight=KBN._Global.IphoneXTopFrameHeight2();
			float frameBHeight=KBN._Global.IphoneXBottomFrameHeight2();
			float iphoneXSacleY=(KBN._Global.ScreenHeight-frameTHeight-frameBHeight+6)/KBN._Global.ScreenHeight;
			KBN._Global.setGUIMatrix(KBN._Global.ScreenWidth, KBN._Global.ScreenHeight);
			SimpleLabelImple toplabel =KBN.MenuMgr.instance.iphoneXTop;
			#if UNITY_EDITOR
			if(frameTHeight-toplabel.rect.height > 5){
				KBN.MenuMgr.instance.InitIphonexFrame();
			}
			#endif
			GUI.BeginGroup(toplabel.rect);
			toplabel.Draw();
			GUI.EndGroup();

			Matrix4x4 scale2 = Matrix4x4.Scale  ( new Vector3 (1.0f, iphoneXSacleY, 1.0f));
			GUI.matrix = scale2*GUI.matrix ;
			UnityEngine.GUI.BeginGroup(new UnityEngine.Rect(0, frameTHeight+5, KBN._Global.ScreenWidth, KBN._Global.ScreenHeight));
		}else{
			KBN._Global.setGUIMatrix(KBN._Global.ScreenWidth, KBN._Global.ScreenHeight);
			UnityEngine.GUI.BeginGroup(new UnityEngine.Rect(0, 0, KBN._Global.ScreenWidth, KBN._Global.ScreenHeight));
		}

		
		return oldMatrix;
	}
	
	static public void RestoryMatrix(UnityEngine.Matrix4x4 matrix)
	{
		UnityEngine.GUI.EndGroup();
		if(KBN._Global.isIphoneX()){
			KBN._Global.setGUIMatrix(KBN._Global.ScreenWidth, KBN._Global.ScreenHeight);

			if (KBN.MenuMgr.instance != null) {
				SimpleLabelImple bottomLabel =KBN.MenuMgr.instance.iphoneXBottom;
				GUI.BeginGroup(new Rect(0,(KBN._Global.ScreenHeight-bottomLabel.rect.height),KBN._Global.ScreenWidth,bottomLabel.rect.height));
				bottomLabel.Draw();
				GUI.EndGroup();
			}
		}
		UnityEngine.GUI.matrix = matrix;
	}
}
