//
//
//
//class SimpleScrollList extends UIElement
//{ 
//	enum Panel_State
//	{
//		PANEL_IDL = 0,
//		PANEL_DRAG,
//		PANEL_SLIDE,
//		PANEL_REBOUND,
//	//	PANEL_SLIDE_RIGHT,
//
//		PANEL_STATE_NUM
//	};
//	public var rowPerPage:int;
//	public var colPerPage:int;
//	public var items;
//	public var horizontalScrollbar : GUIStyle;
//	public var verticalScrollbar : GUIStyle;	
//	public var alwaysShowHorizontal : boolean;
//	public var alwaysShowVertical : boolean; 
//	
//	public var scrollBar:ScrollBar;
//	private var scrollViewVector:Vector2;
//	private var rowNum:int;
//	private var touchEnable:boolean = true;
//	
//	private var m_nCursorPos:int;
//	private var m_bTouch:boolean;
//	private var m_bFirstTouch:boolean;
//	private var	m_fAcceloration:float;
//	private var m_fSpeed:float;
//	private var m_nPage:int;
//	private var m_nOffSet:int;
//	private var m_nStartX:int;
//	private var m_nStartY:int;
//	private var m_nLastTouchY:int;
//	private var m_nLastTouch:int;
//	private var m_state:Panel_State;
//	private var m_nStateStartTime:int;
//	private var m_nMaxOffset:int;
//	private var m_nSlideDest:int;
//	private var m_bMoveDown:boolean;
//	private var m_bJudge:boolean;
//	private var s_fAcceloration:float = 2000;
//	private var m_data:Array = new Array();
//	private var m_startIndex:int;
//	private var m_showRowNum:int;
//	
//	private var margin:int;
//	
//	private var dataLen:int;
//	private var m_itemTemplate:SimpleListItem;
//	
//	public var itemDelegate:IEventHandler;
//	
//	// Use this for initialization
//	function Start () { 
//		//enabled = true;
//		
//	}
//	
//	function Init(itemTemplate:SimpleListItem)
//	{
//	
//		items = new Array();
//		m_itemTemplate = itemTemplate;
//	//	items.Push(itemTemplate);
//		return;
//		
////		if(itemTemplate == null)
////		{
////			_Global.Log("itemTemplate is null");
////		}
//		
//		for(var i:int = 0; i< rowPerPage*colPerPage +1; i++)
//		{
//			items.Push( itemTemplate.Instantiate( ) );
//		}
//	}
//	// Update is called once per frame
//	function Update () {
//		if( dataLen != m_data.length )
//		{
//			dataLen = m_data.length;
//			m_showRowNum = rowPerPage; 
//			if (rowPerPage >= m_data.length)
//			{
//				m_showRowNum = m_data.length;	
//			}
//			this.AutoLayout(); 	
//			this.UpdateItems();
//		}
//		if(rowNum <= 0)
//			return;
//			
//
//		if( Application.platform ==	RuntimePlatform.IPhonePlayer )
//		{
//			if (Input.touchCount  != 1 )
//			{
//				m_bTouch = false;
//			}
//			else
//			{
//				var  touch:Touch = Input.touches[0];
//				
//				if (touch.phase == TouchPhase.Began)
//				{
//					m_bTouch = true;
//				}
//				else if (touch.phase == TouchPhase.Canceled)
//				{
//			//		touchEnable = true;
//					m_bTouch = false;
////					_Global.Log("touch cancel");
//				}
//				else if (touch.phase == TouchPhase.Moved)
//				{
//			//		previousDelta = touch.deltaPosition.y;
//			//		scrollPosition.y += touch.deltaPosition.y;
//			//		touchEnable = false;
//					m_bTouch = true;
//				}
//				else if (touch.phase == TouchPhase.Ended)
//				{
//					m_bTouch = false;
////					_Global.Log("touch end");
//			//		touchEnable = true;
//				}
//			}
//			
//
//		}
//		else 
//		{
//			if(Input.GetMouseButtonDown(0))
//			{
//				m_bTouch = true;
//			}
//			else if(Input.GetMouseButtonUp(0) )
//			{
//				m_bTouch = false;
////				_Global.Log("touch cancel");
//			}
//		}
//		
//	//	_Global.Log("list state"+m_state);
//		switch(m_state)
//		{
//		case Panel_State.PANEL_IDL:
//			UpdateIdl();
//			break;
//		case Panel_State.PANEL_DRAG:
////			_Global.Log("scroll list drag");
//			UpdateDrag();
//			break;
//		case Panel_State.PANEL_SLIDE:
////			_Global.Log("scroll list slide");
//			UpdateSlide();
//			break;
//		}
//		
//		var length:int; 
//		var startIndex:int = -m_nOffSet/rowDist; 
//		if(m_nOffSet > 0)
//		{
//			length = rect.height*rect.height/(rowNum*rowDist);
//			length = Mathf.Max(4, length*(rect.height - 2*m_nOffSet)/(rect.height) ) ;
//			scrollBar.SetLength(length);
//			scrollBar.MoveTo(rect.width - scrollBar.width, 0 )  ;
//			startIndex = 0;
//		}
//		else if(m_nOffSet < -m_nMaxOffset)
//		{
//			length = rect.height*rect.height/(rowNum*rowDist);
//			length = Mathf.Max(4,length*(rect.height + (m_nOffSet + m_nMaxOffset)*2 )/rect.height);
//			scrollBar.SetLength(length);
//			scrollBar.MoveTo(rect.width - scrollBar.width, rect.height - scrollBar.GetLength())  ;
//			startIndex = m_data.length - m_showRowNum;
//		}
//		else
//		{
//			scrollBar.SetLength( rect.height*rect.height/(rowNum*rowDist) );
//			scrollBar.MoveTo(rect.width - scrollBar.width, (rect.height - scrollBar.GetLength() )*(-m_nOffSet)/m_nMaxOffset )  ;
//		}	
//		scrollBar.UpdateData();
//		
//		if(startIndex != m_startIndex)
//		{
//			m_startIndex = startIndex;
//			UpdateItems();
//		}
//	}
//	
//	private function GetListHeight()
//	{
//		return rowNum*rowDist;
//	}
//	private function GetTouch():Touch
//	{
//		return Input.touches[0];
//	}
//	
//	private function IsTouched():boolean
//	{
//		return m_bTouch;
//	}
//	
//	private function GetTouchPos():Vector2
//	{
//		var pos:Vector2;
//		var y:int;
//		if(Application.platform ==	RuntimePlatform.IPhonePlayer)
//		{
//			pos.x = Input.mousePosition.x ;
//			y = Screen.height-  GetTouch().position.y ;
//			pos.y = y ;
//		//	_Global.Log("touch position"+pos.y );
//			return pos;
//		}
//		else
//		{
//			pos.x = Input.mousePosition.x ;
//			y = Screen.height -  Input.mousePosition.y ;
//			pos.y = y ;
//			return pos;
//		}
//	}
//	
//	
//	public var rowDist:int;
//	public var colDist:int;
////	private var rect:Rect;
//	private var windowRect:Rect;
//
////	private var _startIndex:Number;
//
//	public function SetData(data:Array)
//	{
//	//	Clear();
////		if(m_data)
////			m_data.Clear();
////		else 
////			m_data = new Array();
////		for (var i = 0; i < data.length; i++)
////		{
////			m_data.Push(data[i]);
////		}
//		var item:SimpleListItem;
//		if( items.length == 0)
//		{
//			for(var i:int = 0; i< rowPerPage*colPerPage +1; i++)
//			{
//				item = m_itemTemplate.Instantiate(); 
//				item.handlerDelegate = itemDelegate;
//				items.Push( item);
//			}
//		}
//		m_data = data;
//		m_showRowNum = rowPerPage; 
//		if (rowPerPage >= m_data.length)
//		{
//			m_showRowNum = m_data.length;	
//		}
//		AutoLayout();
//		m_startIndex = 0;
//		dataLen = m_data.length;
//		UpdateItems();
//	}
//	
//	
//	public function pushData(data:Object)
//	{
//		m_data.push(data);
//		
//		AutoLayout();
//		UpdateItems();
//	}
//	
//	public function shiftData()
//	{
//		m_data.shift();	
//	}	
//	
//	protected function UpdateItems()
//	{
//		if (m_startIndex >= m_data.length)
//			return ;
////		_Global.Log("update items, startindex = "+ m_startIndex);	
////		_Global.Log("movedown:"+m_bMoveDown);
//		var updateCount = m_data.length - m_startIndex <= m_showRowNum ? m_data.length - m_startIndex:m_showRowNum+1;
//		
//		var temp:ListItem;
//		if(!m_bMoveDown)
//		{
//			while(GetItem(0).rect.y  + m_nOffSet - margin < -rowDist )
//			{
//				temp = items.Shift();
//				temp.rect.y = items[items.length - 1].rect.y + rowDist;
//				items.Push(temp);
////				_Global.Log("move item to bottom, y="+ (temp.rect.y + m_nOffSet - margin));
//			}
//		}
//		else
//		{
//			while(items[items.length - 1].rect.y  + m_nOffSet - margin >= m_showRowNum*rowDist )
//			{
//				temp = items.Pop();
//				temp.rect.y = items[0].rect.y - rowDist;
//				items.Unshift(temp);
//			}
//		}
////		_Global.Log("offset="+ (m_nOffSet - margin));
//		for (var i:int = 0 ; i < updateCount; i++ )
//		{
////			_Global.Log("item.y="+ (items[i].rect.y + m_nOffSet - margin));
//			GetItem(i).SetRowData(m_data[m_startIndex + i]);
//			GetItem(i).SetVisible (true);
//		}
//	}
//	
//	public function GetItem(index:int):ListItem
//	{
//		return items[index];
//	}
//	
//	public function AddItem( item:UIObject)
//	{
//		items.push(item);
//	}
//	
//	public function RemoveIem()
//	{
//	}
//	
//	public function AutoLayout()
//	{
//		
//		var itemPerPage = rowPerPage*colPerPage;
//		rowNum = m_data.length / colPerPage;
//		if(!items)
//			return;
//		if(items.length % colPerPage != 0)
//			rowNum++;
//		margin = rowDist*rowPerPage;
//		for(var i=0; i<m_showRowNum + 1; i++)
//		{		
//		    items[i].rect.x = (i%colPerPage)*colDist;
//		    items[i].rect.y = (i/colPerPage)*rowDist + margin;		    
//		}	
//
//		rect.width = colDist*colPerPage;
//		rect.height = rowDist*rowPerPage;
//		windowRect = new Rect(0,0,colDist*colPerPage, Mathf.Max(rowPerPage,rowNum)*rowDist + 2*margin);		
//		
//		SetMaxOffset(Mathf.Max( rowDist*rowPerPage ,windowRect.height - rowDist*m_showRowNum - 2*margin ) );
//		
//		if(rowNum > 0)
//			scrollBar.SetLength( rect.height*rect.height/(rowNum*rowDist) );
//		else 	
//			scrollBar.SetLength( rect.height );
//		scrollBar.rect.x = rect.width - scrollBar.width;
//		scrollBar.rect.width = scrollBar.width;
//		scrollBar.rect.y = 0;
//	}
//
//	function SetMaxOffset( offset:int)
//	{
//		m_nMaxOffset = offset;
//		if(offset == 0)
//			m_nMaxOffset = 1;
//	}
//	public function Clear()
//	{
//		if( this.items != null)
//		{
//			for (var i = this.items.length - 1; i >= 0; i--)
//			{		
//				var temp = this.items.pop();
//				temp.Destroy();
//			}
//		}
//		this.items = null;		
//		this.items = new Array();		
//	}
//
//
//	
///*	public function pageDown():Void
//	{
//		if (this._startIndex + this._maxRowNum < this.getItemCount())
//		{
//			this._startIndex += this._maxRowNum;
//			this.setItems();
//			this.setSelectedItem(this._startIndex);
//		}
//	}
//	
//	public function pageUp():Void
//	{
//		if (this._startIndex > 0)
//		{
//			this._startIndex = Math.max(0, this._startIndex - this._maxRowNum);
//			this.setItems();
//			this.setSelectedItem(this._startIndex);
//		}
//	}*/
//
//	public function onNavigatorUp()
//	{
//	//	this.goToPrevious();
//	}
//
//	public function onNavigatorDown()
//	{
//	//	this.goToNext();	
//	}
//
//
//	public function Draw()
//	{	
//	//	print (GUI.matrix);	
//		var selectedItem = -1;
//		scrollViewVector.x = windowRect.x;
//		scrollViewVector.y = - m_nOffSet + margin;
//		GUI.BeginScrollView (rect, scrollViewVector, windowRect);
//	//	GUI.ScrollTo(Rect(rect.x, -m_nOffSet, rect.width, rect.height)); 
//	//	print (GUI.matrix);	
//		var hasItem = false;
//		for(var i=0; i<items.length; i++)
//		{
//	//		if(items[i].rect.y - scrollViewVector.y < -rowDist || items[i].rect.y - scrollViewVector.y > rect.y + rowDist*rowPerPage)
//	//			continue;
//			if(m_data == null || i + m_startIndex >=  m_data.length)
//				break;						
//		    if( items[i].Draw() )
//		    	selectedItem = i;
//		    hasItem = true;
//		}		
//	//	_Global.Log("List Screen "+Screen.height);
//
//		GUI.EndScrollView();
//
//		GUI.BeginGroup(rect);
//		if(hasItem)
//			scrollBar.Draw();
//		GUI.EndGroup();
//		
//		return selectedItem;
//	}
//	
//	public function UpdateData()
//	{
//		for(var i=0; i<items.length; i++)
//		{
//		    items[i].UpdateData();
//		}
//	}
//
//
//
//	function UpdateDrag()
//	{
//		if(IsTouched() )
//		{
//			 if(m_nLastTouchY < GetTouchPos().y)
//			 {
//				 m_bMoveDown = true;
//			 }
//			 else if(m_nLastTouchY > GetTouchPos().y)
//			 {
//				 m_bMoveDown = false;
//			 }
//		
//			m_nLastTouchY = GetTouchPos().y;	
//			var fElas:float = 1.0;	
//			if(m_nOffSet > 0)
//			{
//
//				if(GetTouchPos().y - m_nLastTouch > 0)
//				{
//					m_nOffSet = GetTouchPos().y - m_nStartY - fElas*(GetTouchPos().y - m_nStartY)*0.5;
//				}
//				else if(GetTouchPos().y - m_nLastTouch < 0)
//				{
//					m_nOffSet = GetTouchPos().y - m_nStartY - fElas*(GetTouchPos().y - m_nStartY)*0.5;				
//				}
//			}
//			else if(m_nOffSet < - m_nMaxOffset)
//			{
//						
//				if(GetTouchPos().y - m_nLastTouch > 0)
//				{
//					m_nOffSet = GetTouchPos().y - m_nStartY - fElas*(GetTouchPos().y - m_nStartY)*0.5 - m_nMaxOffset;
//				}
//				else if(GetTouchPos().y - m_nLastTouch < 0)
//				{
//					m_nOffSet = GetTouchPos().y - m_nStartY - fElas*(GetTouchPos().y - m_nStartY)*0.5 - m_nMaxOffset;				
//				}
//			}
//			else
//			{
//				m_nOffSet += (GetTouchPos().y - m_nLastTouch);
//			}
//	
//			m_fSpeed = Mathf.Abs(1.0*(GetTouchPos().y - m_nLastTouch)/Time.deltaTime);
//	
//			if(m_fSpeed >= 3000.0)
//				m_fSpeed = 3000.0;		
//			if(m_fSpeed < 1500.0 && m_fSpeed > 300.0)
//				m_fSpeed = 1500.0;
//	
//			m_nLastTouch = GetTouchPos().y;
//		//	print("Panel offset: %d\n", m_nOffSet);
//		//	print("touch point: %d\n", GetTouchPos().y);
//		}
//		else
//		{
//			m_bJudge = false;				
//			if(m_fSpeed <= 1000.0)
//			{
//				if(m_nOffSet > 0)
//				{
//					m_bMoveDown = false;
//					m_nSlideDest =  0;
//					m_state = Panel_State.PANEL_SLIDE;
//					m_fAcceloration = s_fAcceloration;//*SCREEN_WIDTH/(m_nOffSet);
//					m_fSpeed = Mathf.Min(3000, m_nOffSet*20);
//				}
//				else if(m_nOffSet < - m_nMaxOffset)
//				{
//					m_bMoveDown = true;
//					m_nSlideDest = -m_nMaxOffset ;
//					m_state = Panel_State.PANEL_SLIDE;
//					m_fAcceloration = s_fAcceloration;
//					m_fSpeed = Mathf.Min(3000, (- m_nOffSet - m_nMaxOffset)*20);
//				}
//				else
//				{
//					if(m_fSpeed == 0)
//					{
//						m_state = Panel_State.PANEL_IDL;
//						scrollBar.Hide();
//					}
//					else
//					{
//						m_state = Panel_State.PANEL_SLIDE;
//						var nSlideDist:int = 20;
//						if(m_bMoveDown)
//						{
//							m_nSlideDest = m_nOffSet + nSlideDist;
//							if(m_nSlideDest > 0)
//								m_nSlideDest = 0;
//						}
//						else
//						{
//							
//							m_nSlideDest = m_nOffSet - nSlideDist;
//							if(m_nSlideDest < -m_nMaxOffset)
//								m_nSlideDest = -m_nMaxOffset;
//						}	
//					//	m_fSpeed = 1000;		
//					}
//				}
//				
//				m_bJudge = true;
//			}
//			else
//			{
//				m_bJudge = false;
//				m_fAcceloration = 2000.0;		
//				m_state = Panel_State.PANEL_SLIDE;
//			}
////			_Global.Log("movedown:"+m_bMoveDown);
//			
//			
//		}
//	
//	}
//	
//	
//	function UpdateRebound()
//	{
//	}
//	
//	function UpdateSlide()
//	{
//	
//		if(m_bTouch && m_nOffSet > -m_nMaxOffset && m_nOffSet < 0)
//		{
//			m_state = Panel_State.PANEL_IDL;
//			return;
//		}
//
//		m_fSpeed -= m_fAcceloration*Time.deltaTime*6;
//		
//	
//		if( (m_fSpeed <= 1000.0||m_nOffSet > 100|| m_nOffSet < -m_nMaxOffset - 200)&& !m_bJudge)
//		{		
//			if(m_nOffSet > 0)
//			{
//				m_bMoveDown = false;
//				m_nSlideDest =  0;
//				m_state = Panel_State.PANEL_SLIDE;
//				m_fAcceloration = s_fAcceloration;//*SCREEN_WIDTH/(m_nOffSet);
//				m_fSpeed = Mathf.Min(3000, 20*m_nOffSet);
//			}
//			else if(m_nOffSet < - m_nMaxOffset)
//			{
//				m_bMoveDown = true;
//				m_nSlideDest = -m_nMaxOffset ;
//				m_state = Panel_State.PANEL_SLIDE;
//				m_fAcceloration = s_fAcceloration;
//				m_fSpeed = Mathf.Min(3000, 20*(- m_nOffSet - m_nMaxOffset));
//			}
//			else
//			{
//					var nSlideDist:int = 100;
//			
//					if(m_bMoveDown)
//					{
//						m_nSlideDest = m_nOffSet + 100;
//						if(m_nSlideDest > 0)
//							m_nSlideDest = 0;
//					//	m_state = PANEL_SLIDE;	
//						m_fAcceloration = s_fAcceloration;
//						m_fSpeed = 1000;
//					}
//					else
//					{
//						
//						m_nSlideDest = m_nOffSet - nSlideDist;
//						if(m_nSlideDest < -m_nMaxOffset)
//							m_nSlideDest = -m_nMaxOffset;
//					//	m_state = PANEL_SLIDE;	
//						m_fAcceloration = s_fAcceloration;
//						m_fSpeed = 1000;
//					}
//		
//			}
//			m_bJudge = true;
//		}
//		if(m_fSpeed <= 200.0)
//		{
//			m_fSpeed = 200.0;		
//		}
//	
//		if(!m_bJudge)
//		{
//			if(m_bMoveDown)
//			{
//				m_nOffSet += m_fSpeed* Time.deltaTime;	
//			}
//			else
//			{
//				m_nOffSet -= m_fSpeed*Time.deltaTime;	
//
//			}
//
//		}
//		else
//		{
//			if(m_bMoveDown)
//			{
//				m_nOffSet += m_fSpeed*Time.deltaTime;	
//				if(	m_nOffSet >= m_nSlideDest )
//				{
//					m_nOffSet = m_nSlideDest;
//					m_state = Panel_State.PANEL_IDL;
//					scrollBar.Hide();
//				}
//			}
//			else
//			{
//				m_nOffSet -= m_fSpeed*Time.deltaTime;	
//				if(	m_nOffSet <= m_nSlideDest )
//				{
//					m_nOffSet = m_nSlideDest;
//					m_state = Panel_State.PANEL_IDL;
//					scrollBar.Hide();
//	
//				}
//			}
//		}
//		//m_state = Panel_State.PANEL_IDL;
////		_Global.Log("slide speed:"+m_fSpeed);
//	}
//	
//	
//	
//	function UpdateIdl()
//	{
//		if(!IsTouched() /*|| tp->GetPosition().y < kPanelTop*/)
//
//		{
//			m_bFirstTouch = false;
//			return;
//		}
////		print("first touch"+m_bFirstTouch);
//		if(!m_bFirstTouch)
//		{
//	
//			m_bFirstTouch = true;
//			m_nStartX = GetTouchPos().x;
//			m_nStartY = GetTouchPos().y;
//			m_nLastTouchY = GetTouchPos().y;
//			m_nLastTouch = GetTouchPos().y;
//		}
//		else
//		{
//			var  nOffsetX:int = GetTouchPos().x - m_nStartX;
//			var  nOffsetY:int = GetTouchPos().y - m_nStartY;
//			//float angle = Mathf.ATan(nOffsetX, -nOffsetY);
//	
//			if(nOffsetY > 5/*&&  m_nOffSet <= kOutRange && !(angle < Math_PI*170/180 && angle > Math_PI*10/180)*/)
//			{
//				m_state = Panel_State.PANEL_DRAG;		
//				m_nOffSet += (GetTouchPos().y - m_nStartY);
//				m_nCursorPos += GetTouchPos().y - m_nStartY;
//			//	m_nStateStartTime = GetApp()->GetCurMTime();
//
//				m_state = Panel_State.PANEL_DRAG;	
//				scrollBar.Show();
//				m_bFirstTouch = false;
//			}
//			else if(nOffsetY < -5/* && m_nOffSet > - ( m_nMaxOffset + kOutRange ) && !(angle < Math_PI*170/180 && angle > Math_PI*10/180)*/ ) 
//			{
//				m_state = Panel_State.PANEL_DRAG;
//				m_nOffSet += (GetTouchPos().y - m_nStartY);
//				m_nCursorPos += GetTouchPos().y - m_nStartY;
//			//	m_nStateStartTime = GetApp()->GetCurMTime();
//				m_state = Panel_State.PANEL_DRAG;	
//				scrollBar.Show();	
//				m_bFirstTouch = false;
//			}		
//			m_nLastTouch = GetTouchPos().y;
//			m_fSpeed = 30.0;
//		}
//	//	print("offset"+m_nOffSet);
//	
//	}
//	
//	protected function SetScrollState( state:Panel_State)
//	{
//		if(state == Panel_State.PANEL_IDL)
//		{
//		}
//		m_state  = state;
//	}
//}
//
