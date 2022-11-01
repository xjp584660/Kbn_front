using UnityEngine;
using System;

//public delegate void ITouchableActiveFunction(ITouchable t);
public interface ITouchable
{
	Rect GetAbsoluteRect();
	int GetZOrder();
	void SetTouchableActiveFunction(Action<ITouchable> Activated);
	string GetName();
	bool IsVisible();
}
