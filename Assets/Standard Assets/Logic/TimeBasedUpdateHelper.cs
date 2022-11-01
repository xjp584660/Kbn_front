using UnityEngine;
using System.Collections;
using System;
using GameMain = KBN.GameMain;

public class TimeBasedUpdateHelper
{
    private int currentUpdateIndex = -1;
    private long[] timePoints;
    private Action<long>[] initMethods;
    private Action<long>[] updateMethods;

    public TimeBasedUpdateHelper(long[] timePoints, Action<long>[] initMethods, Action<long>[] updateMethods)
    {
        if (timePoints.Length != initMethods.Length - 1 || timePoints.Length != updateMethods.Length - 1)
        {
            throw new ApplicationException("Illegal lengths of input arrays");
        }

        this.timePoints = timePoints;
        this.initMethods = initMethods;
        this.updateMethods = updateMethods;
    }

    public void Update()
    {
        long curTime = GameMain.unixtime();

        for (int i = 0; i < timePoints.Length; ++i)
        {
            if (curTime < timePoints[i])
            {
                PerformInitMethod(i, curTime);
                PerformUpdateMethod(i, curTime);
                return;
            }
        }

        PerformInitMethod(timePoints.Length, curTime);
        PerformUpdateMethod(timePoints.Length, curTime);
    }

    private void PerformInitMethod(int index, long curTime)
    {
        if (currentUpdateIndex == index)
        {
            return;
        }

        currentUpdateIndex = index;
        if (initMethods[index] == null)
        {
            return;
        }

        initMethods[index](curTime);
    }

    private void PerformUpdateMethod(int index, long curTime)
    {
        if (updateMethods[index] == null)
        {
            return;
        }
            
        updateMethods[index](curTime);
    }
}
