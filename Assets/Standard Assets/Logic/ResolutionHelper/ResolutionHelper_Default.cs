using UnityEngine;
using System.Collections;
using KBN;

internal class ResolutionHelper_Default : IResolutionHelper
{
    protected const int LargeResolutionMinHeight = 1366;

    public bool IsLargeResolution
    {
        get
        {
            if (IsMiniResolution)
            {
                return false;
            }
			#if UNITY_EDITOR
			if(TextureMgr.instance().useLocalResolution){
				return  TextureMgr.instance().screenResolution.y > LargeResolutionMinHeight;
			}
			#endif
            return Screen.height > LargeResolutionMinHeight;
        }
    }

    public virtual bool IsMiniResolution
    {
        get
        {
			#if UNITY_EDITOR
			if(TextureMgr.instance().useLocalResolution){
				return TextureMgr.instance().screenResolution.y < MenuMgr.SCREEN_HEIGHT || TextureMgr.instance().screenResolution.x < MenuMgr.SCREEN_WIDTH;
			}
			#endif
            return Screen.height < MenuMgr.SCREEN_HEIGHT || Screen.width < MenuMgr.SCREEN_WIDTH;
        }
    }



	public bool IsIphoneX {
		get {
			return false;
		}
	}

	public bool IsIphoneXR
	{
		get {
			return false;
		}
	}

    public virtual int ScreenWidth
    {
        get
        {
            if (IsMiniResolution)
            {
                return MenuMgr.SCREEN_WIDTH;
            }
			#if UNITY_EDITOR
			if(TextureMgr.instance().useLocalResolution){
				return (int)TextureMgr.instance().screenResolution.x;
			}
			#endif
            return Screen.width;
        }
    }

    public virtual int ScreenHeight
    {
        get
        {
            if (IsMiniResolution)
            {
                return MenuMgr.SCREEN_HEIGHT;
            }
			#if UNITY_EDITOR
			if(TextureMgr.instance().useLocalResolution){
				return (int)TextureMgr.instance().screenResolution.y;
			}
			#endif
            return Screen.height;
        }
    }

    public virtual Vector2 ScreenToUISpace(Vector2 point)
    {
        if (IsMiniResolution)
        {
			#if UNITY_EDITOR
			if(TextureMgr.instance().useLocalResolution){
				return new Vector2(point.x * MenuMgr.SCREEN_WIDTH / TextureMgr.instance().screenResolution.x, point.y * MenuMgr.SCREEN_HEIGHT / TextureMgr.instance().screenResolution.y);
			}
			#endif
            return new Vector2(point.x * MenuMgr.SCREEN_WIDTH / Screen.width, point.y * MenuMgr.SCREEN_HEIGHT / Screen.height);
        }

        return point;
    }
}
