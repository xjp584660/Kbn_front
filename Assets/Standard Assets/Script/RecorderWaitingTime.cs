using UnityEngine;
using System;

public static class RecorderWaitingTime 
{
	private static System.DateTime waitStartTime;
	private static System.TimeSpan totalWaitTime = System.TimeSpan.Zero;
	private static bool isRecording= false;
	private static bool isInterrupted= false;

	public static void startLoading()
	{
		if(isRecording)	return;
		isRecording=true;
		waitStartTime = System.DateTime.Now;
	}

	public static void finishLoading()
	{
		if(isInterrupted)
			isInterrupted=false;
		if(!isRecording)	 return;
		isRecording=false;
		System.DateTime waitFinishTime = System.DateTime.Now;
		totalWaitTime += waitFinishTime-waitStartTime;
	}

	public static void onRestart()
	{
		if(!isInterrupted) return;
		isRecording=true;
		waitStartTime = System.DateTime.Now;
	}

	public static double getLoadingTimeAndClear()
	{
		if(isRecording)
		{
			finishLoading();
			isInterrupted=true;
		}
		double returnTime=totalWaitTime.TotalMilliseconds * 0.001d;
		totalWaitTime = System.TimeSpan.Zero;
		return returnTime;
	}

}
