using UnityEngine;
using System.Collections;
using System.Runtime.InteropServices;

#if UNITY_IOS
internal class ResolutionHelper_iPhone6Plus : IResolutionHelper
{
    protected static float DownSamplingRate = 1.7f;

    public bool IsLargeResolution
    {
        get
        {
            return false;
        }
    }

    public bool IsMiniResolution
    {
        get
        {
            return false;
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

    public int ScreenHeight
    {
        get
        {
			#if UNITY_EDITOR

			if(TextureMgr.instance().useLocalResolution){
				return (int)(TextureMgr.instance().screenResolution.y / (DownSamplingRate));
			}
			#endif
            return (int)(Screen.height / DownSamplingRate);
        }
    }

    public int ScreenWidth
    {
        get
        {
			#if UNITY_EDITOR

			if(TextureMgr.instance().useLocalResolution){
				return (int)(TextureMgr.instance().screenResolution.x / DownSamplingRate);
			}
			#endif
			return (int)(Screen.width / DownSamplingRate);
        }
    }

    public Vector2 ScreenToUISpace(Vector2 point)
    {
        return new Vector2(point.x / DownSamplingRate, point.y / DownSamplingRate);
    }
}
#endif
