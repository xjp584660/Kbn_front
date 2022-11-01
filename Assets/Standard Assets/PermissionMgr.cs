using UnityEngine;
using System.Collections;

public class PermissionMgr : MonoBehaviour {
	public GameObject amazonIAPManager;
    public GameObject gameFramework;
	public GameObject loadindCamera;
	public GameObject materialMgr;
	public GameObject soundMgr;
	public GameObject textureMgr;

#if UNITY_EDITOR
	[Space(20f), Header("BuildSetting的参数值设置（悬浮查看信息）")]
	[Tooltip("下面2个值是设置 BuildSetting 中的对应值，且只在 Editor 编辑器下才会启用；默认值都是 1 ；\n之所以需要这样做，是因为 当出正式包的时候下面2个值都为 0，\n但是在Editor下就会无法运行游戏")]
	[Range(0, 1),SerializeField]private int INTERNAL_VERSION = 1;
	[Range(0, 1),SerializeField]private int DEBUG_MODE = 1;
#endif

	void Awake()
    {
#if UNITY_EDITOR
		BuildSetting.INTERNAL_VERSION = INTERNAL_VERSION;
		BuildSetting.DEBUG_MODE = DEBUG_MODE;
#endif

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
