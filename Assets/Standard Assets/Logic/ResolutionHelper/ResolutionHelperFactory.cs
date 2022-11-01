using UnityEngine;
using System.Collections;

public static class ResolutionHelperFactory
{
	private static IResolutionHelper cachedProduct;

	public static IResolutionHelper Product
	{
		get
		{
			if (cachedProduct == null)
			{
				cachedProduct = Create();
			}

			return cachedProduct;
		}
	}

	private static IResolutionHelper Create()
	{
#if UNITY_IOS && !UNITY_EDITOR

		//iPhone 技术参数链接 https://www.theiphonewiki.com/wiki/List_of_iPhones#iPhone_11

		if (UnityEngine.iOS.Device.generation == UnityEngine.iOS.DeviceGeneration.iPhone6Plus		// iPhone6 Plus
			|| UnityEngine.iOS.Device.generation == UnityEngine.iOS.DeviceGeneration.iPhone6SPlus	// iPhone6S Plus
			||SystemInfo.deviceModel.Contains("iPhone9,2")											// iPhone 7 Plus
			|| SystemInfo.deviceModel.Contains("iPhone9,4")											// iPhone 7 Plus
			||SystemInfo.deviceModel.Contains("iPhone10,2")											// iPhone 8 Plus
			||SystemInfo.deviceModel.Contains("iPhone10,5"))										// iPhone 8 Plus
		{
            return new ResolutionHelper_iPhone6Plus();
		}
		else if(SystemInfo.deviceModel.Contains("iPhone11,8")										// iPhone XR
			||SystemInfo.deviceModel.Contains("iPhone12,1"))										// iPhone 11
		{
			return new ResolutionHelper_IPhoneXR();
		}
		else if(SystemInfo.deviceModel.Contains("iPhone10,3")										// iPhone X
				||SystemInfo.deviceModel.Contains("iPhone10,6")										// iPhone X
		        ||SystemInfo.deviceModel.Contains("iPhone11,2")										// iPhone XS
				||SystemInfo.deviceModel.Contains("iPhone11,4")										// iPhone XS Max
				||SystemInfo.deviceModel.Contains("iPhone11,6")										// iPhone XS Max
				||SystemInfo.deviceModel.Contains("iPhone12,3")										// iPhone 11 Pro
				||SystemInfo.deviceModel.Contains("iPhone12,5")										// iPhone 11 Pro Max
				||SystemInfo.deviceModel.Contains("iPhone13,1")										// iPhone 12 mini
				||SystemInfo.deviceModel.Contains("iPhone13,2")										// iPhone 12
				||SystemInfo.deviceModel.Contains("iPhone13,3")										// iPhone 12 Pro
				||SystemInfo.deviceModel.Contains("iPhone13,4")										// iPhone 12 Pro Max
				||SystemInfo.deviceModel.Contains("iPhone14,2")										// iPhone 13 Pro
				||SystemInfo.deviceModel.Contains("iPhone14,3")										// iPhone 13 Pro Max
				||SystemInfo.deviceModel.Contains("iPhone14,4")										// iPhone 13 mini
				||SystemInfo.deviceModel.Contains("iPhone14,5")										// iPhone 13
				||SystemInfo.deviceModel.Contains("iPhone15")										// iPhone 14 等
				||SystemInfo.deviceModel.Contains("iPhone16")								        // iPhone 15 等
				||SystemInfo.deviceModel.Contains("iPhone17")                                       // iPhone 16 等
				||SystemInfo.deviceModel.Contains("iPhone18")                                       // iPhone 17 等
				||SystemInfo.deviceModel.Contains("iPhone19")                                       // iPhone 18 等
				||SystemInfo.deviceModel.Contains("iPhone20"))                                      // iPhone 19 等
		{
			return new ResolutionHelper_IPhoneX();
		}
		else
		   return new ResolutionHelper_Default();
#elif UNITY_ANDROID
		return new ResolutionHelper_Android();
#else
		if (TextureMgr.instance().useLocalResolution)
		{

			switch (TextureMgr.instance().resolutionType)
			{
				case Constant.EitorResolutionType.Normal:
					return new ResolutionHelper_Default();
				//					break;
				case Constant.EitorResolutionType.Iphone6s:
					return new ResolutionHelper_iPhone6Plus();
				//					break;
				case Constant.EitorResolutionType.IphoneX:
					return new ResolutionHelper_IPhoneX();
				//					break;
				case Constant.EitorResolutionType.IphoneXR:
					return new ResolutionHelper_IPhoneXR();
				//					break;
				default:
					break;
			}
		}
		return new ResolutionHelper_Default();

#endif
	}
}
