using UnityEngine;
using System;

public class ProgressList : UIList
{
	
	private bool isHide;
//	private bool isShowAll;
	private UIObject m_parent;
	private Action<ProgressList> m_onProgressListRemove;
	
	// Update is called once per frame
	public void Init(UIObject parent)
	{
		base.Init();
		m_parent = parent;
		isHide = true;
//		isShowAll = true;
		
		curState = ProgressState.STOP;
		oldState = ProgressState.STOP;
	}
	
	public Action<ProgressList> OnProgressListRemove
	{
		set {
			m_onProgressListRemove = value;
		}
	}
	
	public override void UpdateData() 
	{
		bool removeItem = false;
		ListItem item;
		
		for (var i = this.items.Count - 1; i >= 0; i--)
		{		
			item = items[i] as ListItem;
			if(item != null)
			{
				//if( items[i].progressBar.IsFinished())
				if( item.willBeRemoved() )
				{
					
					items.RemoveAt(i);
					//	item.Destroy();					
					removeItem = true;
				}
				else 
				{
					item.UpdateData();
				}
			}	
		}
		
		if(removeItem)
		{
			RefreshPos();
			if ( m_onProgressListRemove != null )
				m_onProgressListRemove(this);
		}
	}
	
	private Rect tarRect;
	private ProgressState curState;
	private ProgressState oldState;
	//private float newHeight = 0;
	private float smoothTime = 0.05f;
	private float yVelocity = 0.0f;
	private float lessFloatPart = 0.0f;
	
	public enum ProgressState
	{
		STOP = 0,
		ANIMATION_SHOW,
		ANIMATION_HIDE
	};
	
	public override void Update()
	{	
		base.Update();

		if(curState == ProgressState.STOP)
		{
			return;
		}
		
		float newHeight = Mathf.SmoothDamp(rect.height, tarRect.height, ref yVelocity, smoothTime);
		newHeight += lessFloatPart;
		float newHeightInt = Mathf.Floor(newHeight);
		lessFloatPart = newHeight - newHeightInt;

		if(Mathf.Abs(newHeightInt - tarRect.height) < 5)
		{
			newHeightInt = tarRect.height;
			oldState = curState;
			curState = ProgressState.STOP;
		}

		rect.height = newHeightInt;		
	}

	public void ShowAll()
	{ 	
		RefreshPos();
		isHide = false;
//		isShowAll = true;
		curState = ProgressState.STOP;
		oldState = ProgressState.STOP;
	}
	
	public bool isFinish()
	{
		return curState == ProgressState.STOP;
	}
	
	public void showAllWithAnimation()
	{
		if(curState == ProgressState.STOP && oldState != ProgressState.ANIMATION_SHOW)
		{
			oldState = curState;
			curState = ProgressState.ANIMATION_SHOW;
						
			RefreshPos();	
			tarRect = rect;		
			rect = rectFixed;
	
			isHide = false;
//			isShowAll = true;			
		}
	}	
	
	public void hideAllWithAnimation()
	{
		if(curState == ProgressState.STOP && oldState != ProgressState.ANIMATION_HIDE)
		{
			oldState = curState;
			curState = ProgressState.ANIMATION_HIDE;
			
			isHide = true;
//			isShowAll = false;
			tarRect = rectFixed;
		}
	}
	
//	public void ShowPart()
//	{
//		RefreshPos();
//		if(items.length > 2)
//		{
//			rect = rectFixed;
//			for (var i = 0; i<= 2; i++)
//			{		
//				if(growDown)
//				{	
//				//	items[i].rect.y = rect.height; 
//					rect.height += (items[i] as UIObject).rect.height;
//				}
//				else 
//				{
//				//	items[i].rect.y = rect.height; 
//					rect.y -= (items[i] as UIObject).rect.height;
//					rect.height += (items[i] as UIObject).rect.height;
//				}
//			}
//		}
//		if( items.length > 0 )
//		{
//			isHide = false;	
//			isShowAll = false;
//		}
//	}

	public void Hide()
	{
		rect = rectFixed;
		isHide = true;
		
		curState = ProgressState.STOP;
		oldState = ProgressState.STOP;		
	}
	
	public bool IsHide()
	{
		return isHide;
	}
	
    public void ResetFixedRect()
    {
        rectFixed = rect;
    }

//	public bool IsShowAll()
//	{
//		return isShowAll;
//	}

}

