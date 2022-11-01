using System;
using System.Runtime.InteropServices;
using UnityEngine;

namespace KabamLab.ADS
{
	public class KADS
	{
		private static bool bRelicStarted = false;



		public static void StartNewRelic(string id)
		{
			if(bRelicStarted)
				return;
			bRelicStarted = true;
			NativeCaller.StartNewRelic(id);
			/*
			if(Application.platform == RuntimePlatform.IPhonePlayer)
			{
				#if UNITY_IOS
				_startNewRelic("AA311994f9f1747360df65e55703b24ebdc9d9a767");
				#endif
			}
			else
			if(Application.platform == RuntimePlatform.Android)
			{
				#if UNITY_ANDROID
				//TODO
				//adsMgr.CallNativeAction(START_NEWRELIC,LabConfig.NewRelic.token);	

				#endif	
			}
			*/
		}
	}
}