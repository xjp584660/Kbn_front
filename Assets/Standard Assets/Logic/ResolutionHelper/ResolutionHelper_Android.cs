using UnityEngine;
using System.Collections;

#if UNITY_ANDROID
internal class ResolutionHelper_Android : ResolutionHelper_Default
{
    public override bool IsMiniResolution
    {
        get
        {
            return true;
			//LargeResolutionMinHeight = 1366
            if (Screen.height > LargeResolutionMinHeight && Screen.width <= 1440)
            {
                return true;
            }

            return base.IsMiniResolution;
        }
    }

   public override int ScreenWidth
    {
        get
        {
            if (IsMiniResolution)
            {
                return 720;//MenuMgr.SCREEN_WIDTH;
            }
            #if UNITY_EDITOR
            if(TextureMgr.instance().useLocalResolution){
                return (int)TextureMgr.instance().screenResolution.x;
            }
            #endif
            return Screen.width;
        }
    }

    public override int ScreenHeight
    {
        get
        {
            if (IsMiniResolution)
            {
                return 1280;//MenuMgr.SCREEN_HEIGHT;
            }
            #if UNITY_EDITOR
            if(TextureMgr.instance().useLocalResolution){
                return (int)TextureMgr.instance().screenResolution.y;
            }
            #endif
            return Screen.height;
        }
    }

    public override Vector2 ScreenToUISpace(Vector2 point)
    {
        if (IsMiniResolution)
        {
            //#if UNITY_EDITOR
            //if(TextureMgr.instance().useLocalResolution){
            //    return new Vector2(point.x * 720 / TextureMgr.instance().screenResolution.x, point.y * 1280 / TextureMgr.instance().screenResolution.y);
            //}
            //#endif
            return new Vector2(point.x * 720 / Screen.width, point.y * 1280 / Screen.height);
        }

        return point;
    }
}
#endif
