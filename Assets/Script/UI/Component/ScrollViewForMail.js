//the listItem is same height
class ScrollViewForMail extends ScrollView
{	
	private var deleteItemIndexArr:Array;
	private var itemsArr:Array;
	private var timeGap:float;
	private var startAlphaForFadein:float = 0.3;
	private var alphaSpeed:int = 1;	
	private var moveSpeed:int = 100;
	private var fadeoutAlpha:float;
	private var fadeinAlpha:float;
	private var maxMailNum:int = 10;
	private var totalPage:int;
	private var curPage:int;
	private var btnDesPos:float;
	private var heightOfItem:int;
	private var postM_nOffset:float;
	
	private var deleteItemState:int;	
	enum DeleteItemState
	{
		DELETE_ITEM_FADE_OUT = 0,
		RESET_ITEM_POSITION,
		NEW_ITEM_FADE_IN
	}
	
	public function deleteItemWithAnimation(_indexArr:Array, _itemsArr:Array, _curPage:int, _totalPage:int):void
	{
		if(_indexArr != null)
		{
			m_state = Panel_State.PANEL_DELETE_ITEM;
			deleteItemState = DeleteItemState.DELETE_ITEM_FADE_OUT;
		
			deleteItemIndexArr = _indexArr;
			itemsArr   	 = new Array();
			totalPage	 = _totalPage;
			curPage  	 = _curPage;
			fadeoutAlpha = 1;

			if(_itemsArr != null && _itemsArr.length > 0)
			{
				itemsArr = _itemsArr;
				
				var obj:EmailItem;
				for(var a:int = 0; a < itemsArr.length; a ++)
				{
					obj = itemsArr[a] as EmailItem;					
					obj.alpha = 0;
				}
			}
		}
	}

	private function UpdateDeleteAnimation():void
	{		
		timeGap = Time.deltaTime;
		
		var a:int;
		var item:EmailItem;
		if(deleteItemState == DeleteItemState.DELETE_ITEM_FADE_OUT)
		{
			if(fadeoutAlpha == 0)
			{
				deleteItemState = DeleteItemState.RESET_ITEM_POSITION;
				
				if(totalPage > 1)
				{
					if(deleteItemIndexArr.length == itemsArr.length)
					{
						postM_nOffset = m_nOffSet;
						btnDesPos = (newComponent[newComponent.Count - 1] as UIObject).rect.y;
					}
					else if(deleteItemIndexArr.length > itemsArr.length)
					{
						var difference:int = deleteItemIndexArr.length - itemsArr.length;
						
						if(m_nMaxOffset > 0 && m_nMaxOffset < difference * heightOfItem) 
						{
							postM_nOffset = 0;
						}
						else if(m_nMaxOffset >= difference * heightOfItem)
						{
							if(m_nOffSet - difference * heightOfItem >= -m_nMaxOffset) //up
							{
								postM_nOffset = m_nOffSet;
							}	
							else //up and down
							{
								postM_nOffset = difference * heightOfItem - m_nMaxOffset;														
							}
						}						
						
						btnDesPos = (newComponent[newComponent.Count - 1] as UIObject).rect.y - difference * heightOfItem;
					}
					else if(deleteItemIndexArr.length < itemsArr.length) 
					{						
						postM_nOffset = m_nOffSet;
						btnDesPos = (newComponent[newComponent.Count - 1] as UIObject).rect.y + difference * heightOfItem;
					}				
				}
				else
				{
					if(!(newComponent[newComponent.Count - 1] instanceof EmailItem))
					{
						newComponent.RemoveAt(newComponent.Count - 1);
					}
				}
				
				return;
			}
			
			fadeoutAlpha -= timeGap * alphaSpeed;
			
			if(fadeoutAlpha <= 0)
			{
				fadeoutAlpha = 0;
			}
			
			for(a = 0; a < deleteItemIndexArr.length; a++)
			{
				if(_Global.INT32(deleteItemIndexArr[a]) < newComponent.Count && 
				   newComponent[deleteItemIndexArr[a]] instanceof EmailItem)
				{
					item = newComponent[deleteItemIndexArr[a]] as EmailItem;
					item.alpha = fadeoutAlpha;				
				}
			}
			
			if(totalPage == 1)
			{
				if(!(newComponent[newComponent.Count - 1] instanceof EmailItem))
				{
					//(newComponent[newComponent.Count - 1] as UIObject).alpha = fadeoutAlpha;
				}
			}
		}
		else if(deleteItemState == DeleteItemState.RESET_ITEM_POSITION)
		{			
			var itemIndex:int = 0;
			var distance:float = timeGap * moveSpeed;
			var destPosY:float;
			var isMoveOver:boolean = true;
			
			if(newComponent != null && newComponent.Count > 1)
			{
				for(a = 0; a < deleteItemIndexArr.length; a++)
				{					
					if(a == deleteItemIndexArr.length - 1)
					{
						itemIndex = _Global.INT32(deleteItemIndexArr[a]);
						
						if(itemIndex < newComponent.Count - 1)
						{
							itemIndex++;
							
							if(newComponent[itemIndex] instanceof EmailItem)
							{
								item = newComponent[itemIndex] as EmailItem;
								destPosY = (newComponent[itemIndex - (a + 1)] as EmailItem).rect.y;
								
								if(item.rect.y == destPosY)
								{
									continue;
								}
								
								isMoveOver = false; 
								
								if(item.rect.y - distance < destPosY)
								{
									distance = item.rect.y - destPosY;
									item.rect.y = destPosY;
								}
								else
								{
									item.rect.y -= distance;
								}
								
								itemIndex++;
								
								while(itemIndex < newComponent.Count)
								{
									if(newComponent[itemIndex] instanceof EmailItem)
									{
										(newComponent[itemIndex] as EmailItem).rect.y -= distance;							
										itemIndex++;									
									}
								}																
							}
						}
					}
					else    
					{
						if(_Global.INT32(deleteItemIndexArr[a]) + 1 == _Global.INT32(deleteItemIndexArr[a + 1]))
						{
							continue;
						}
										
						itemIndex = _Global.INT32(deleteItemIndexArr[a]) + 1;
						
						item = newComponent[itemIndex] as EmailItem;
						destPosY = (newComponent[itemIndex - (a + 1)] as EmailItem).rect.y;
						
						if(item.rect.y == destPosY)
						{
							continue;
						}
						
						isMoveOver = false;
						
						if(item.rect.y - distance < destPosY)
						{
							distance = item.rect.y - destPosY;
							item.rect.y = destPosY;
						}
						else
						{
							item.rect.y -= distance;
						}
						
						itemIndex++;
						
						while(itemIndex < _Global.INT32(deleteItemIndexArr[a + 1]))
						{
							(newComponent[itemIndex] as EmailItem).rect.y -= distance;							
							itemIndex++;
						}						
					}
				}		
			}
			
			if(m_nOffSet != postM_nOffset)
			{
				isMoveOver = false;
			
				if(m_nOffSet < postM_nOffset)
				{
					if(m_nOffSet + distance > postM_nOffset)
					{
						m_nOffSet = postM_nOffset;
					}
					else
					{
						m_nOffSet += distance;
					}
				}
				else
				{
					if(m_nOffSet - distance < postM_nOffset)
					{
						m_nOffSet = postM_nOffset;
					}
					else
					{
						m_nOffSet -= distance;
					}
				}
			} 

			if(totalPage > 1)
			{
				var btnObj:UIObject = newComponent[newComponent.Count - 1] as UIObject;
				if(btnDesPos != btnObj.rect.y)
				{
					isMoveOver = false;
					
					if(btnObj.rect.y > btnDesPos) 
					{
						if(btnObj.rect.y - distance < btnDesPos)
						{
							 btnObj.rect.y = btnDesPos;
						}
						else
						{
							 btnObj.rect.y -= distance;
						}
					}
					else
					{
						if(btnObj.rect.y + distance > btnDesPos)
						{
							 btnObj.rect.y = btnDesPos;
						}
						else
						{
							 btnObj.rect.y += distance;
						}						
					}				
				}
			}
			
			if(isMoveOver)
			{
				deleteItemState = DeleteItemState.NEW_ITEM_FADE_IN;
				
				itemIndex = 0;
				var tempArr:Array = new Array();
				for(a = 0; a < newComponent.Count; a++)
				{
					if(a != deleteItemIndexArr[itemIndex])
					{
						tempArr.Push(newComponent[a]);						
					}
					else
					{
						itemIndex++;
					}
				}
				
				newComponent.Clear();
				
				for(a = 0; a < tempArr.length; a++)
				{
					newComponent.Add(tempArr[a]);
				}

				if(newComponent[newComponent.Count - 1] instanceof EmailItem)
				{
					for(a = 0; a < itemsArr.length; a++)
					{ 
						(itemsArr[a] as EmailItem).rect.y = (newComponent[newComponent.Count - 1] as EmailItem).rect.y + 
															(newComponent[newComponent.Count - 1] as EmailItem).rect.height;
						newComponent.Add(itemsArr[a]); 
					}
				}
				else
				{
					var obj:UIObject = newComponent[newComponent.Count - 1];
					newComponent.RemoveAt(newComponent.Count - 1);
					for(a = 0; a < itemsArr.length; a++)
					{ 
						(itemsArr[a] as EmailItem).rect.y = (newComponent[newComponent.Count - 1] as EmailItem).rect.y + 
															(newComponent[newComponent.Count - 1] as EmailItem).rect.height;					
						newComponent.Add(itemsArr[a]);	
					}
					newComponent.Add(obj);
				}
			}
		}
		else if(deleteItemState == DeleteItemState.NEW_ITEM_FADE_IN)
		{
			var isFadeinOver:boolean = true;
		
			fadeinAlpha = alphaSpeed * timeGap;
			for(a = 0; a < itemsArr.length; a++)
			{
				item = itemsArr[a] as EmailItem; 
				
				if(item.alpha == 1)
				{
					continue;
				}
				 
				isFadeinOver = false;
				
				if(item.alpha + fadeinAlpha > 1)
				{ 
					item.alpha = 1;
				}
				else
				{
					item.alpha += fadeinAlpha;
				}
				
				if(item.alpha < startAlphaForFadein)
				{
					break;
				}
			}
			
			if(isFadeinOver)
			{
				m_state = Panel_State.PANEL_IDL;
				AutoLayout();
			}
		}
	}
	
	function Update() {
		if(!scrollAble)
			return;
		if( Application.platform ==	RuntimePlatform.IPhonePlayer || Application.platform ==	RuntimePlatform.Android )
		{
			if (Input.touchCount  != 1 || (!HoleScreenAct && !actRect.Contains( GetTouchPos() )) )
			{
				m_bTouch = false;
			}
			else
			{
				var  touch:Touch = Input.touches[0];
				
				if (touch.phase == TouchPhase.Began)
				{
					m_bTouch = true;
				}
				else if (touch.phase == TouchPhase.Canceled)
				{
					touchEnable = true;
					m_bTouch = false;
				}
				else if (touch.phase == TouchPhase.Moved)
				{
//					previousDelta = touch.deltaPosition.y;
//					scrollPosition.y += touch.deltaPosition.y;
					touchEnable = false;
					m_bTouch = true;
				}
				else if (touch.phase == TouchPhase.Ended)
				{
					m_bTouch = false;
					touchEnable = true;
				}
			}
		}
		else 
		{
			if(Input.GetMouseButtonDown(0) && (HoleScreenAct || actRect.Contains( GetTouchPos() )) )
			{
				m_bTouch = true;
			}
			else if(Input.GetMouseButtonUp(0) || (!HoleScreenAct && !actRect.Contains( GetTouchPos() )) )
			{
				m_bTouch = false;
			}
		}
		
		switch(m_state)
		{
		case Panel_State.PANEL_IDL:
			UpdateIdl();
			break;
		case Panel_State.PANEL_DRAG:
			UpdateDrag();
			break;
		case Panel_State.PANEL_SLIDE:
			UpdateSlide();
			break;
		case Panel_State.PANEL_MOVE:
			UpdateMove();
			break;
		case Panel_State.PANEL_DELETE_ITEM:
			UpdateDeleteAnimation();
			break;
		}
		
		var length:int; 
//		var startIndex:int = -m_nOffSet/rowDist; 
		if(m_nOffSet > 0)
		{
			length = rect.height*rect.height/(windowRect.height);
			length = Mathf.Max(4, length*(rect.height - 2*m_nOffSet)/(rect.height) ) ;
			scrollBar.SetLength(length);
			scrollBar.MoveTo(rect.width - scrollBar.width, 0 )  ;
//			startIndex = 0;
		}
		else if(m_nOffSet < -m_nMaxOffset)
		{
			length = rect.height*rect.height/(windowRect.height);
			length = Mathf.Max(4,length*(rect.height + (m_nOffSet + m_nMaxOffset)*2 )/rect.height);
			scrollBar.SetLength(length);
			scrollBar.MoveTo(rect.width - scrollBar.width, rect.height - scrollBar.GetLength())  ;
			
		}
		else
		{
			scrollBar.SetLength( rect.height*rect.height/windowRect.height );
			m_nMaxOffset = m_nMaxOffset > 0?m_nMaxOffset:1;
			scrollBar.MoveTo(rect.width - scrollBar.width, (rect.height - scrollBar.GetLength() )*(-m_nOffSet)/m_nMaxOffset )  ;
		}
		for(var i:int=0; i<newComponent.Count; i++)
		{
			(newComponent[i] as UIObject).Update();
		}	
		scrollBar.UpdateData();
	}		
}