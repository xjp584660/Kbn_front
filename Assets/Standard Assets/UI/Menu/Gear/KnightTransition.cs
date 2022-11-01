
using System.Collections.Generic;
using System.Reflection;
using UnityEngine;
using System;

public class KnightTransition
{
	private HorizontalTransition transition;
	private UIObject uiobject;
	//public Label previousLabel;
	//public Label nextLabel;
	//private bool canNext; 
	//private bool canPrevious;
	
	
	private double originX;
	private bool isTransition;
	
	private ArcOutScreenplay transcreenplay;
	private double distance;
	private bool isAutoTrans;
	private double startposition;
	private double transitiondestination;

	public Action<double> OnTransitionFinish;
	
	public void Init()
	{ 
		transition = new HorizontalTransition();
		transition.Init();
		isAutoTrans = false;
		transcreenplay = new ArcOutScreenplay();
		transcreenplay.OnFinish = OnFinish;
		/*
		if (null != previousLabel)
		{
			previousLabel.alphaEnable = true;
			previousLabel.alpha = 0.5f;
		}
		
		if (null != nextLabel)
		{	
			nextLabel.alphaEnable = true; 
			nextLabel.alpha = 0.5f;
		}
		*/
	}
	/*
	public void InitLabel()
	{
		if (null != previousLabel)
		{
			previousLabel.Init();
		}
		
		if (null != nextLabel)
		{
			nextLabel.Init();
		}
		
		canNext = (false);
		canPrevious = (false); 
		
	}
	*/
	public void Update()
	{
		transcreenplay.Update();
		transition.Update();
		if(isAutoTrans)
			transition.Current = startposition + distance * transcreenplay.data.S;
	}
	double temp;
	public void Draw()
	{
		transition.Draw(); 
		/*
		if(canPrevious && null != previousLabel)
		{
			if(previousLabel.alphaEnable)
			{
				temp = GUI.color.a;
				Color c = new Color(GUI.color.r,GUI.color.g,GUI.color.b,previousLabel.alpha);
				GUI.color = c;
			}
			previousLabel.Draw();
			if(previousLabel.alphaEnable)
			{
				Color c = new Color(GUI.color.r,GUI.color.g,GUI.color.b,(float)temp);
				GUI.color = c;
			}
		}
		if(canNext && null != nextLabel)
		{
			if(nextLabel.alphaEnable)
			{
				temp = GUI.color.a;
				Color c = new Color(GUI.color.r,GUI.color.g,GUI.color.b,nextLabel.alpha);
				GUI.color = c;
			}			
			nextLabel.Draw();
			if(nextLabel.alphaEnable)
			{
				Color c = new Color(GUI.color.r,GUI.color.g,GUI.color.b,(float)temp);
				GUI.color = c;
			}
		}
		*/
	}
	public void ForceStop()
	{
		Finish(0.0f);
	}

	public bool IsTransiting
	{
		get
		{
			return isTransition;
		}
	}


	public void Begin(UIObject uiobject,object[] datas)
	{
		if(!isTransition && !isAutoTrans)
		{
			
			isTransition = true;
			uiobject = uiobject;
			//canNext = (datas[2] != null);
			//canPrevious = (datas[0] != null); 
	 		
	 		transition.Current = 0;
			transition.Begin(uiobject,640,datas);
			originX = Input.mousePosition.x;
		}
	}
	

	public void Finish()
	{
		if(isTransition && !isAutoTrans)
		{
			isAutoTrans = true;
			originX = 0;
			transitiondestination = transition.CalculateDestination(transition.Current); 
			
			distance = transitiondestination - transition.Current;
			startposition = transition.Current;
			transcreenplay.Begin(0.0f,2.0f,5.0f); 
		}
	}
	
	public void Finish(double destination)
	{
		
		if(destination < -1.0f || destination > 1.0f) return;
		if(isTransition)
		{
			Finish();
			transitiondestination = destination;
			distance = transitiondestination - transition.Current;
		}
	}
	
	private void OnFinish()
	{
		int r = 0;
		
		isAutoTrans = false;
		isTransition = false;
		if(transitiondestination == -1.0f) r = -1;
		if(transitiondestination == 1f)  r = 1;
		
		transition.Current = 0;
		if(OnTransitionFinish != null)
			OnTransitionFinish(transitiondestination);
		
		uiobject = null;
		//canNext = (false);
		//canPrevious = (false); 
		transition.Finish();
	}
	
	public void InputCurrent()
	{
		if(isTransition && !isAutoTrans)
		{
			double x = 0f;

			x = originX - Input.mousePosition.x;

			if(originX != Input.mousePosition.x)
				x = x;

			x = x / (double)Screen.width;

			transition.Current = x;
		}
		
	}
	
	public void OnPopOver()
	{
		transition.OnPopOver();
	}
}
