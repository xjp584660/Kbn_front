using UnityEngine;
using System.Collections;

public	interface FadeInAndOutDelegate{
		void	OnFadeOutStart(FadeInAndOut fadeInAndOut, Hashtable userData);
		void	OnFadeOutFinish(FadeInAndOut fadeInAndOut, Hashtable userData);
}

public class FadeInAndOut
{
	private Shader g_oldShader;
	
	private float g_specularFactor;
	
	private float g_fadeInSpeed;	
	private float g_fadeOutSpeed;
	
	private int g_fadeInTime;
	private int g_fadeOutTime;
	
	private int g_count;
	
	private GameObject fadeoutGameObject;
	private GameObject fadeinGameObject;
	private GameObject curGameObject;
	
	private Material oldMaterial;
	private Material m_material;
	
	private	FadeInAndOutDelegate mDelegate;
	private	Hashtable	mUserData;
	
	private	string	mTag;
	
	public FadeInAndOut()
	{
		g_specularFactor = 0.5f;
		
		g_fadeInSpeed = 0.1f;
		g_fadeOutSpeed = 0.05f;
		
		g_fadeInTime = 5;
		g_fadeOutTime = 15;

		g_count = 0;
		
		m_material = new Material(Shader.Find("Mobile/FadeState"));
		mDelegate = null;
	}
	
	public float specularFactor
	{
		set
		{
			g_specularFactor = value;	
		}
	}
	
	public float fadeInSpeed
	{
		set
		{
			g_fadeInSpeed = value;
		}	
	}
	
	public float fadeOutSpeed
	{
		set
		{
			g_fadeOutSpeed = value;
		}	
	}	
	
	public int fadeInTime
	{
		set
		{
			g_fadeInTime = value;
		}	
	}
	
	public int fadeOutTime
	{
		set
		{
			g_fadeOutTime = value;
		}	
	}
	
	public FadeInAndOutDelegate myDelegate
	{
		set
		{
			mDelegate = value;
		}	
	}
	
	public Hashtable userData
	{
		set
		{
			mUserData = value;
		}
		
		get
		{
			return mUserData;
		}
	}
	
	public string tag
	{
		set
		{
			mTag = value;
		}
		
		get
		{
			return mTag;
		}
	}
	
		
	public void addGameObject(GameObject fadeinObj, GameObject fadeoutObj)
	{
		if( curGameObject == null ){
			
			fadeinGameObject = fadeinObj;
			fadeoutGameObject = fadeoutObj;
			
			oldMaterial = fadeinObj.GetComponent<Renderer>().material;
			fadeinObj.GetComponent<Renderer>().material = m_material;
			fadeinObj.GetComponent<Renderer>().material.color = oldMaterial.color;
			fadeinObj.GetComponent<Renderer>().material.mainTexture = oldMaterial.mainTexture;
			
			curGameObject = fadeinGameObject;
		}

	}
	
	public void Update() 
	{
		if(curGameObject)
		{
			effectFadeInThenOut();
			
			if(g_specularFactor > 0.5f)
			{
	//			Shader.SetGlobalFloat("specularFactor", g_specularFactor);
				curGameObject.GetComponent<Renderer>().material.SetFloat("specularFactor", g_specularFactor);
			}
			else
			{
	//			g_gameObject.renderer.material.shader = g_oldShader;
				
				g_specularFactor = 0.5f;				
//				Shader.SetGlobalFloat("specularFactor", g_specularFactor);
//				g_gameObject.renderer.material.SetFloat("specularFactor", g_specularFactor);
				curGameObject.GetComponent<Renderer>().material = oldMaterial;
				curGameObject = null;
				g_count = 0;
				
				if( mDelegate != null ){
					mDelegate.OnFadeOutFinish(this, userData);
				}
			}
		}
	}
	
	public	bool	finished(){
		return curGameObject == null;
	}
	
	private void effectFadeInThenOut()
	{
		g_count++;
		
		if(g_count < g_fadeInTime)
		{
			g_specularFactor += g_fadeInSpeed;
			
		}else if(g_count == g_fadeInTime ){
			
			fadeinGameObject.GetComponent<Renderer>().material = oldMaterial;
			
			oldMaterial = fadeoutGameObject.GetComponent<Renderer>().material;
			fadeoutGameObject.GetComponent<Renderer>().material = m_material;
			fadeoutGameObject.GetComponent<Renderer>().material.color = oldMaterial.color;
			fadeoutGameObject.GetComponent<Renderer>().material.mainTexture = oldMaterial.mainTexture;
			
			curGameObject = fadeoutGameObject;
			
			g_specularFactor -= g_fadeOutSpeed;
			
			if( mDelegate != null ){
				mDelegate.OnFadeOutStart(this, userData);
			}
			
		}else if(g_count < g_fadeOutTime){
			g_specularFactor -= g_fadeOutSpeed;
		}
	}
}
