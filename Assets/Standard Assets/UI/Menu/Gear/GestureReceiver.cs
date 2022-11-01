using UnityEngine;
using System.Collections;
using System;
using System.Collections.Generic;


public interface GestureReceiver
{
	void OnGesture(KBN.GestureManager.GestureEventType type,List<ITouchable> touchables, object t);
	void SetReceiverActiveFunction(System.Action<GestureReceiver> Activated);
}
