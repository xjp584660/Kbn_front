using UnityEngine;
using System;

public class NavigatorHead : UIObject
{
	public Button btn_back;
	public Label l_title;
	
	public NavigatorController controller;
	
	public override void Init()
	{
		base.Init();

//		if (KBN._Global.IsLargeResolution ()) 
//		{
//			btn_back.rect.width = 62;
//		} 
//		else if (KBN._Global.isIphoneX ()) 
//		{
//			btn_back.rect.width = 85;
//		}
//		else
//		{
//			btn_back.rect.width = 75;
//		}
//		
//		btn_back.rect.y = 2;
//		btn_back.rect.height = 64;
		btn_back.OnClick = new Action(onClick);
		btn_back.SetVisible(true);
	}
	
	public override int Draw()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);
		btn_back.Draw();
		l_title.Draw();
		GUI.EndGroup();

		return -1;
	}
	
	public void showBackButton(bool b)
	{
		btn_back.SetVisible(b);
	}
	
	public void updateBackButton()
	{
		if(null != controller)
		{
			showBackButton(controller.uiNumbers > 1);
		}
	}
	
	public string titleTxt
	{
		set {
			l_title.txt = value;
		}
	}
	protected void onClick()
	{
		if(controller != null)
		{
			controller.pop();
			updateBackButton();
		}
	}

	public void popUI(){
		onClick();
	}

	public void pop2RootUI(){
		if(controller != null)
		{
			controller.pop2Root();
			updateBackButton();
		}
	}
}
