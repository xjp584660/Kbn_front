using UnityEngine;
using System.Collections;

public class PermissionMgr : MonoBehaviour {
	public GameObject amazonIAPManager;
    public GameObject gameFramework;
	public GameObject loadindCamera;
	public GameObject materialMgr;
	public GameObject soundMgr;
	public GameObject textureMgr;



	void Awake()
    {

		if (RuntimePlatform.Android == Application.platform)
		{
			if(KBN._Global.permissionState)// excude when restart from game
			{
				InitScene();
			}
		}
		else
		{
			InitScene();
		}
			
//			#if UNITY_ANDROID
//			if(KBN._Global.permissionState)
//	        {
//	            //amazonIAPManager.SetActive(true);
//	            //gameFramework.SetActive(true);
//	            //loadindCamera.SetActive(true);
//	            //materialMgr.SetActive(true);
//	            //soundMgr.SetActive(true);
//	            //textureMgr.SetActive(true);
//	            InitScene();
//	        }
//		#endif
//
//		#if !UNITY_ANDROID 
//			 			            
//		#endif


	}
	
	public void permissionAccessed(string message)
	{
        InitScene();
        KBN._Global.permissionState = true;
	}

    void InitScene(){
		if (amazonIAPManager != null) amazonIAPManager.SetActive(true);
		if (gameFramework != null) gameFramework.SetActive(true);
		if (loadindCamera != null) loadindCamera.SetActive(true);
		if (materialMgr != null) materialMgr.SetActive(true);
		if (soundMgr != null) soundMgr.SetActive(true);
		if (textureMgr != null) textureMgr.SetActive(true);
    }
}
