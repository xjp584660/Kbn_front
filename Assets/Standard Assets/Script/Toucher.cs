using UnityEngine;
using System.Collections;
using System;
public class Toucher
{
	private Vector2 posTouchBegin;
	private Vector2 posTouchEnd;
	private Action onMoveLeft;
	private Action onMoveRight;
	private Action onMoveUp;
	private Action onMoveDown;
	private float minMoveDistance = 10;

	public void Init(Action _onMoveLeft,Action _onMoveRight,Action _onMoveUp,Action _onMoveDown,float _minMoveDistance = 2)
	{
		onMoveLeft = _onMoveLeft;
		onMoveRight = _onMoveRight;
		onMoveUp = _onMoveUp;
		onMoveDown = _onMoveDown;
		minMoveDistance = _minMoveDistance;
	}

	public void Update () 
	{
		switch ( Application.platform )
		{
		case RuntimePlatform.IPhonePlayer:
		case RuntimePlatform.Android:
			if (Input.touchCount  < 1)
			{
				break;
			}
			Touch touch = Input.touches[0];				
			if (touch.phase == TouchPhase.Began)
			{
				posTouchBegin = touch.position;
			}
			else if (touch.phase == TouchPhase.Ended)
			{
				posTouchEnd = touch.position;
				OnTouchEnd ();
			}
			break;
			
		default:
			if( Input.GetMouseButtonDown(0))
			{
				posTouchBegin = Input.mousePosition;
			}
			else if (Input.GetMouseButtonUp(0))
			{
				posTouchEnd = Input.mousePosition;
				OnTouchEnd ();
			}
			break;
		}
	}

	private void OnTouchEnd ()
	{
		if(posTouchBegin.y < posTouchEnd.y && Mathf.Abs(posTouchBegin.y - posTouchEnd.y)>=minMoveDistance)
		{
			//down
			if(onMoveDown!=null)
				onMoveDown();
		}
		else if(posTouchBegin.y > posTouchEnd.y && Mathf.Abs(posTouchBegin.y - posTouchEnd.y)>=minMoveDistance)
		{
			//up
			if(onMoveUp!=null)
				onMoveUp();
		}
		
		if(posTouchBegin.x < posTouchEnd.x && Mathf.Abs(posTouchBegin.x - posTouchEnd.x)>=minMoveDistance)
		{
			//right
			if(onMoveRight!=null)
				onMoveRight();
		}
		else if(posTouchBegin.x > posTouchEnd.x && Mathf.Abs(posTouchBegin.x - posTouchEnd.x)>=minMoveDistance)
		{
			//left
			if(onMoveLeft!=null)
				onMoveLeft();
		}
	}
}
