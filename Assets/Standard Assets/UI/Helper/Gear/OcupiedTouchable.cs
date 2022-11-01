
using UnityEngine;

public class OcupiedTouchable : ITouchable
{
	public Rect rect;
	public object tag;
	//private bool visible;
	
	public void Draw()
	{
		DrawInterface(); 
		UpdateAbsoluteVector();
	}

	private Vector2 mAbsoluteVector;
	private Rect mAbsoluteRect;
	private System.Action<ITouchable> mActivated;
	private string mName;
	public void SetName(string name)
	{
		mName = name;
	}
	public string GetName()
	{
		return mName;
	}
	public bool IsVisible()
	{
		return false;
		//return visible;
	}
	
	public Rect GetAbsoluteRect()
	{
		mAbsoluteRect.x = mAbsoluteVector.x;
		mAbsoluteRect.y = mAbsoluteVector.y;
		mAbsoluteRect.width = rect.width;
		mAbsoluteRect.height = rect.height;
		return mAbsoluteRect;
	}
	private int zOrder = 0;
	public void SetZOrder(int order)
	{
		zOrder = order;
	}
	
	public int GetZOrder()
	{
		return zOrder;
	}	
	private void UpdateAbsoluteVector()
	{
		GUI.BeginGroup(rect);
		mAbsoluteVector = GUIUtility.GUIToScreenPoint(new Vector2(0 ,0));
		GUI.EndGroup();
	}
	public void SetTouchableActiveFunction(System.Action<ITouchable> Activated)
	{
		mActivated = Activated;
	}
	private void DrawInterface()
	{	
		if(mActivated != null)
			mActivated(this);
	}
		
}
