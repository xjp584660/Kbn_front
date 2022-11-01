
using System.Collections.Generic;
using System.Reflection;
using UnityEngine;






public class HorizontalTransition
{
	private UIObject obj;
	
	private double current = 0.0f;
	private double interval;
	
	private UIObject[] objects;
	private object[] datas;
	
	private bool isWorking;
	
	private double trasitionFactor = 0.2f;
	
	
	public void Init()
	{
		
		
		isWorking = false;
	}
	
	protected bool IsValid()
	{
		if(!isWorking) return false;
		if(datas == null) return false;
		if(obj == null) return false;
		if(objects == null) return false;
		if(interval <= 0 ) return false;
		if(current < -1.0f || current > 1.0f) return false;
		return true;
	}
	
	
	public void Update()
	{
		if(!IsValid()) return;
		
		for(int i = 0;i<3;i++)
		{
			if(objects[i] == null) continue;
			objects[i].rect.x = ((float)i - 1.0f) * (float)interval   - (float)current * (float)interval + obj.rect.x;
			float j = (float)i - 1;
			float d = (j - (float)current);
			objects[i].alpha = (0.5f - Mathf.Abs(d)) * 2; 
			objects[i].Update();
		}
	}
		
	public void Draw()
	{
		if(!IsValid()) return;
				
		for(int i = 0;i<3;i++)
		{
			if(objects[i] == null) continue;
			objects[i].Draw();
		}
	}
	
	public void OnPopOver()
	{
		DestroyObjects();
	}
	
	protected void SetObject(UIObject obj,int interval,object[] datas)
	{
		if(obj == null) return;
		this.obj = obj;
		this.interval = interval;

		this.datas = datas;
		
		CreateObjects();
		for(int i = 0;i<3;i++)
		{
			if(datas[i] == null) 
			{
				if(this.objects[i] == null) continue;
				this.objects[i].OnPopOver();
				UIObject.TryDestroy(this.objects[i]);
				this.objects[i] = null;
				continue;
			}
			this.objects[i].Init();
			this.objects[i].SetUIData(datas[i]);
			
		}
		
	}
	
	protected void CreateObjects()
	{
		if(obj == null) return;
		objects = new UIObject[3];
		for(int i = 0;i<3;i++)
		{
			if(objects[i] != null)
			{
				objects[i].OnPopOver();
				UIObject.TryDestroy(objects[i]);
			}
			objects[i] = (UIObject)GameObject.Instantiate(obj);
			objects[i].SetVisible(true);		
			objects[i].rect.x = -1000;	
			objects[i].alphaEnable = true;
			objects[i].alpha = 1.0f;			
		}
	}
	
	protected void DestroyObjects()
	{
		if(objects == null) return;
		for(int i = 0;i<3;i++)
		{
			if(objects[i] == null) continue;
			objects[i].OnPopOver();
			UIObject.TryDestroy(objects[i]);
		}		
	}
	
	public double CalculateDestination(double c)
	{	
		if(datas == null) return 0.0f;
		if(this.datas[0] == null && this.datas[2] == null)
		{
			return 0.0f;
		}	
		else if(this.datas[0] == null)
		{
			if( c < trasitionFactor) return 0.0f;
			return 1.0f;
		}
		else if(this.datas[2] == null)
		{
			if(c < -1 * trasitionFactor) return -1.0f;
			return 0.0f;
		}
		
		if(c < -1 * trasitionFactor) return -1.0f;
		else if(c < trasitionFactor) return 0.0f;
		return 1.0f;
	}
	
	public double Current
	{
		get
		{
			return current;
		}
		set
		{
			double x = 0.0f;
			double v = value;
			if(v < -1.0f) x = 2;
			if(v > 1.0f) x = -2;
			
			while(true)
			{
				if(v <= 1.0f && v >= -1.0f) break;
				v += x;
			}
			current = v;	
		}
	}

	public UIObject GetObject(int i)
	{
		if(i < -1 || i > 1) return null;
		return objects[i + 1];
	}
	
	public void Finish()
	{
		if(!isWorking) return;
		isWorking = false;
		DestroyObjects();
		obj.SetVisible(true);
	}
	
	public void Begin(UIObject obj,int interval,object[] datas)
	{
		if(obj == null) return;
		if(datas == null) return;
		isWorking = true;
		SetObject(obj,interval,datas);
		obj.SetVisible(false);
	}
	
	
	
}
