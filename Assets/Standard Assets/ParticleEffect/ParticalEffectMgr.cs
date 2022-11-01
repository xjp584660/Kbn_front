using UnityEngine;
using System;
using GameMain = KBN.GameMain;
using _Global = KBN._Global;

public class ParticalEffectMgr 
{
	public enum ParticalEffectType
	{
		rain = 0,
		snow,
		firework,
		chatFirework
	}

	private static ParticalEffectMgr instance;
	
	private GameObject snow;
	private GameObject rain;
	private GameObject firework;
	
	private Transform cityTrans;
	private Transform fieldTrans;
	private Transform mapTrans;
	
	private int curSceneLevel;
	private bool enable;
	
	public ParticalEffectMgr()
	{
		enable = false;
	}
	
	public void init()
	{
		enable = true;	
		
		isPlayChatFirework = false;
		isPlayFestivalFirework = false;	
				
		calculateFireworkPara();
	}
	
	public void setEffectEnable(bool _enable)
	{
		enable = _enable;
	}
	
	public static ParticalEffectMgr getInstance()
	{
		if(instance == null)
		{
			instance = new ParticalEffectMgr();
			
			GameMain.singleton.resgisterRestartFunc(new Action(delegate()
			{
				instance = null;
			}));			
		}
		
		return instance;
	}

	public void playEffect(int type)
	{
		if(isEffectDisable())
		{
			return;
		}
	
		switch(type)
		{
			case (int)ParticalEffectType.rain:
				playRainEffect();
				break;				
			case (int)ParticalEffectType.snow:
				playSnowEffect();
				break;
			case (int)ParticalEffectType.chatFirework:
				if(!isPlayFestivalFirework && !isPlayChatFirework && cityTrans != null && curSceneLevel== GameMain.CITY_SCENCE_LEVEL)
				{
					isPlayChatFirework = true;
					chatFireworkStartTime = GameMain.unixtime();
					playFireworkEffect("normalFirework");			
				}
				break;
		}
	}
	
	public void stopEffect(int type)
	{
		if(isEffectDisable())
		{
			return;
		}
	
		switch(type)
		{
			case (int)ParticalEffectType.rain:
				stopRainEffect();
				break;				
			case (int)ParticalEffectType.snow:
				stopSnowEffect();
				break;
			case (int)ParticalEffectType.firework:
				stopFireworkEffect();
				break;
		}		
	}
	
	public void onScenceChanged(int sceneLevel)
	{
//		if(isEffectDisable())
//		{
//			return;
//		}
		
		curSceneLevel = sceneLevel;
	
		switch(sceneLevel)
		{
			case GameMain.CITY_SCENCE_LEVEL:
				
				if(cityTrans == null)
				{
					cityTrans = GameMain.singleton.getMapViewControllerTransform(0);
				}
				
				changeParentOfSnow();
									
				break;
				
			case GameMain.FIELD_SCENCE_LEVEL:

				if(fieldTrans == null)
				{
					fieldTrans = GameMain.singleton.getMapViewControllerTransform(1);
				}
				
				changeParentOfSnow();							
																									
				break;				
			case GameMain.AVA_MINIMAP_LEVEL:
			case GameMain.WORLD_SCENCE_LEVEL:

				if(mapTrans == null)
				{
					mapTrans = GameMain.singleton.getMapViewControllerTransform(2);
				}
				
				changeParentOfSnow();

				break;
		}					
	}
	
	private void changeParentOfSnow()
	{
		if(snow == null)
		{
			return;
		}	
	
		switch(curSceneLevel)
		{
			case GameMain.CITY_SCENCE_LEVEL:
				
				if(cityTrans != null)
				{
					snow.transform.parent = cityTrans;
					snow.transform.localPosition = new Vector3(0, Constant.LayerY.LAYERY_PARTICLE, 17);
				}
				break;
				
			case GameMain.FIELD_SCENCE_LEVEL:
				
				if(fieldTrans != null)
				{
					snow.transform.parent = fieldTrans;
					snow.transform.localPosition = new Vector3(0, Constant.LayerY.LAYERY_PARTICLE, 17);
				}
				break;
			case GameMain.AVA_MINIMAP_LEVEL:
			case GameMain.WORLD_SCENCE_LEVEL:
				
				if(mapTrans != null)
				{
					snow.transform.parent = mapTrans;
					snow.transform.localPosition = new Vector3(0, Constant.LayerY.LAYERY_PARTICLE, 17);
				}
				break;
		}
		
		if(isSnowing && snow!= null)
		{
			snow.SetActive(true);
		}
	}

	public void SetAllEffectActive(bool bActive)
	{
		if(snow != null)
			snow.SetActive(bActive);
		if(rain != null)
			rain.SetActive(bActive);
		if(firework != null)
			firework.SetActive(bActive);
	}

	public void stopAllEffect()
	{
		if(isEffectDisable())
		{
			return;
		}	
	
		stopRainEffect();
		stopSnowEffect();
		stopFireworkEffect();
	}
	
	private bool isEffectDisable()
	{
		 if(enable)
		 {
		 	if(_Global.IsLowEndProduct())
		 	{
		 		return true;
		 	}
		 	else
		 	{
		 		return false;
		 	}
		 }
		 else
		 {		 
		 	return true;
		 }
	}
	
	private void stopRainEffect()
	{
		if(rain == null)
		{
			return;
		}
		
		rain.SendMessage("setEffectState", "off", SendMessageOptions.DontRequireReceiver);	
	}

	private void stopSnowEffect()
	{
		if(snow == null)
		{
			return;
		}
		
		snow.SendMessage("setEffectState", "off", SendMessageOptions.DontRequireReceiver);			
	}

	private void stopFireworkEffect()
	{
		if(firework == null)
		{
			return;
		}
		
		firework.SendMessage("setEffectState", "off", SendMessageOptions.DontRequireReceiver);		
	}
					
	private void playRainEffect()
	{
		if(rain == null)
		{
			GameObject rainObj = Resources.Load("Effect/Snow/snow") as GameObject;
			rain = GameObject.Instantiate(rainObj) as GameObject;				
		}
		
		rain.SendMessage("setEffectState", "on", SendMessageOptions.DontRequireReceiver);
	}

	private void playSnowEffect()
	{
		if(isSnowing)
		{
			return;
		}
	
		if(snow == null)
		{
			GameObject snowObj = Resources.Load("Effect/Snow/snow") as GameObject;
			snow = GameObject.Instantiate(snowObj) as GameObject;	
		}

		isSnowing = true;
 		snowStartTime = GameMain.unixtime();
		changeParentOfSnow();
		snow.SendMessage("setEffectState", "on", SendMessageOptions.DontRequireReceiver);		
	}
	
	private void playFireworkEffect(string fireType)
	{
		if(firework == null)
		{
			GameObject fireworkObj = Resources.Load("Effect/Firework/fireworkEffect") as GameObject;
			firework = GameObject.Instantiate(fireworkObj) as GameObject;												
		}
		
		if(cityTrans != null)
		{
			firework.transform.parent = cityTrans;
			firework.SendMessage("setEffectState", fireType);		
		}
	}
	
	public void Update()
	{		
		if(isEffectDisable())
		{
			return;
		}
	
		UpdateSnow();		
		UpdateChatFirework();
		UpdateFestivalFirework();
	}
	
	
	private long chatFireworkStartTime;
	private bool isPlayChatFirework = false;
	private void UpdateChatFirework()
	{	
		if(!isPlayChatFirework || curSceneLevel!= GameMain.CITY_SCENCE_LEVEL)
		{
			return;
		}

		if(GameMain.unixtime() > chatFireworkStartTime + 60)
		{	
			if(isPlayFestivalFirework)
			{
				isPlayChatFirework = false;
			}
			else
			{
				stopFireworkEffect();
				isPlayChatFirework = false;
			}
		}
	}
	
	private bool isSnowing = false;
	private int snowTime = 60;
	private long snowStartTime;
	private void UpdateSnow()
	{
		if(!isSnowing)
		{
			return;
		}
		
		if(GameMain.unixtime() > snowStartTime + snowTime)
		{	
			stopSnowEffect();
			isSnowing = false;
		}
	}	

	private long fireworkStartTime;
	private int gapFirework = 3600;
	private int times = 25;
	private int fireworkIndex;
	
	private long curFireworkTime;
	private long nexFireworkTime;
	private int fireworkPlayingTime;
	private bool isPlayFestivalFirework = false;
	private bool isFireworkExpire;
	
	
	public void setFireworkStartTime(long startTime)
	{
		fireworkStartTime = startTime;	
	}
		
	private void calculateFireworkPara()
	{
		fireworkIndex = 0;
		
		long current = GameMain.unixtime();
	
		for(fireworkIndex = 0; fireworkIndex < times; fireworkIndex++)
		{	
			curFireworkTime = fireworkStartTime + fireworkIndex * gapFirework;
			nexFireworkTime = fireworkStartTime + (fireworkIndex + 1) * gapFirework;
						
			if(current < nexFireworkTime)
			{
				break;
			}
		}
		
		if(fireworkIndex == times - 1)
		{
			fireworkPlayingTime = 60 * 5;
		}
		else
		{
			fireworkPlayingTime = 60;
		}
		
		if(current > fireworkStartTime + gapFirework * (times - 1) + fireworkPlayingTime)
		{
			isFireworkExpire = true;
		}
		else
		{
			isFireworkExpire = false;
		}		
	}
	
	private void UpdateFestivalFirework()
	{		
		if(isFireworkExpire || cityTrans == null || curSceneLevel!= GameMain.CITY_SCENCE_LEVEL)
		{
			return;
		}

		long current = GameMain.unixtime();
		
		if(current < curFireworkTime)
		{
			return;
		}
		else if(current >= curFireworkTime && current <= curFireworkTime + fireworkPlayingTime)
		{
			//play firework
			if(!isPlayFestivalFirework)
			{
				//festival firework
				if(fireworkIndex == times - 1)
				{
					playFireworkEffect("normalFirework");
				}
				else
				{
					playFireworkEffect("festivalFirework");
				}
			}
			
			isPlayFestivalFirework = true;
		}
		else if(current > curFireworkTime + fireworkPlayingTime && current < nexFireworkTime)
		{
			//stop firework
			if(isPlayFestivalFirework)
			{
				stopFireworkEffect();
			}
			isPlayFestivalFirework = false;
		}
		else if(current >= nexFireworkTime)
		{
			//next firework
			calculateFireworkPara();
		}	
	}
				
}

