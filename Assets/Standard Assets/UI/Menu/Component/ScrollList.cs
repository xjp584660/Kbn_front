using System.Collections.Generic;
using UnityEngine;

namespace KBN
{
	public class ScrollList : UIObject, ITouchable
	{
		public enum Panel_State
		{
			PANEL_IDL = 0,
			PANEL_DRAG,
			PANEL_SLIDE,
			PANEL_REBOUND,
			//	PANEL_SLIDE_RIGHT,
			PANEL_LISTITEM_FADEOUT,
			PANEL_MOVE,

			PANEL_STATE_NUM
		};

		public enum ORIENTATION
		{
			HORIZONTAL,
			VERTICAL
		};


		[UnityEngine.Space(30), UnityEngine.Header("----------ScrollList----------")]

		public int rowPerPage;
		public int colPerPage;
		private System.Collections.Generic.List<ListItem> m_itemsList;
		public GUIStyle horizontalScrollbar;
		public GUIStyle verticalScrollbar;
		public bool alwaysShowHorizontal;
		public bool alwaysShowVertical;

		public ScrollBar scrollBar;
		public bool HoleScreenAct = true;
		public Rect actRect;

		private Vector2 scrollViewVector;
		private int rowNum;
		private int colNum;

		private float smoothTime = 0.1f;
		private float xVelocity = 0.0f;
		private float m_nCursorPos;
		private bool m_bTouch;
		private bool m_bFirstTouch;
		private float m_fAcceloration;
		private float m_fSpeed;
		private int m_nPage;
		public float m_nOffSet;
		private float m_nStartX;
		private float m_nStartY;
		private float m_nLastTouchY;
		private float m_nLastTouchX;
		private float m_nLastTouch;
		private Panel_State m_state;
		private Panel_State m_lastState;
		private int m_nStateStartTime;
		public int m_nMaxOffset;
		private float m_nSlideDest;
		private bool m_bMoveDown;
		private bool m_bMoveRight;
		private bool m_bJudge;
		private float s_fAcceloration = 800;
		private float s_slideDist = 200;

		public System.Collections.IList m_datasList;

		public int m_startIndex;
		public int m_showRowNum;
		private int m_showColNum;

		public float margin;
		public float itemScaleY;
		private int dataLen;
		private ListItem m_itemTemplate;

		public IEventHandler itemDelegate;

		private float responseAngle;

		private float touchTime;
		public bool updateable = true;

		public ORIENTATION orientation = ORIENTATION.VERTICAL;
		public int moveThreshold = 5;

		public Button btnNextPage;
		public Button btnPrevPage;

		public bool autoArrange = false;
		public bool drawPageNum = false;
		public bool AutoNumRegion = true;
		public Texture2D point;
		public Texture2D pointBig;
		public bool bindActRectToRect = true;
		public int pageNum;
		public int curPage;
		public Rect pageNumRegion;
		public bool lastItemScale = true;
		//		public Vector2 DistNormal=Vector2.one;
		//		public bool ScalItem=false;

		public System.Action onDragFnished;

		public bool isCanOffset = false;

		private Panel_State State
		{
			set
			{
				if (m_state == value)
				{
					return;
				}

				Panel_State oldState = m_state;
				m_state = value;
				OnStateTransition(oldState, m_state);
			}

			get
			{
				return m_state;
			}
		}

		private void OnStateTransition(Panel_State oldState, Panel_State newState)
		{
			if (newState == Panel_State.PANEL_IDL)
			{
				return;
			}

			InputText.closeActiveInput();

			InputText activeInputText = InputText.GetActiveTarget();
			if (activeInputText != null)
			{
				activeInputText.setDone();
			}
		}

		public Vector2 getScrollViewVector()
		{
			return scrollViewVector;
		}

		private int offsetRowDist;
		private int offsetColDist;
		public void SetCanOffset(int rowDist, int colDist)
		{
			this.isCanOffset = true;
			this.offsetRowDist = rowDist;
			this.offsetColDist = colDist;
		}

		//public GetItemNum()
		public void Init(ListItem itemTemplate)
		{
			m_itemsList = new System.Collections.Generic.List<ListItem>();
			m_itemTemplate = itemTemplate;
			scrollBar.Init();
			scrollViewVector.y = 0;
			m_nOffSet = 0;
			responseAngle = 0.0f;
			dataLen = 0;
			itemScaleY = 1;
			if (inScreenAspect)
			{
				itemTemplate.inScreenAspect = true;
				itemTemplate.lockWidthInAspect = lockWidthInAspect;
				itemTemplate.lockHeightInAspect = lockHeightInAspect;

				rowDist = (int)itemTemplate.DistNormal.y;//height
				colDist = (int)itemTemplate.DistNormal.x;//width
				float mScaleX = GetScreenScale().x;
				float mScaleY = GetScreenScale().y;

				if (lockWidthInAspect)
				{

					mScaleY = Mathf.Clamp(mScaleY, 0.7f, 1.2f);
					if (KBN._Global.isIphoneX())
					{
						mScaleY *= 1 / KBN._Global.GetIphoneXScaleY();
						rowDist = _Global.INT32(rowDist * mScaleY);
					}
					else
						rowDist = _Global.INT32(rowDist * mScaleY);
					itemScaleY = mScaleY;

				}
				else if (lockHeightInAspect)
				{
					mScaleX = Mathf.Clamp(mScaleX, 0.7f, 1.2f);
					colDist = _Global.INT32(colDist * mScaleY);
				}
				else
				{
					//					mScaleY = Mathf.Clamp(mScaleY,0.7f,1.2f);
					//					rowDist =_Global.INT32(rowDist*mScaleY );
				}
				//				_Global.Log("scrollList-->:mScaleY = "+mScaleY+",rowDist="+rowDist+","+lockWidthInAspect+","+lockHeightInAspect+","+mScaleY);
				//				_Global.Log("scrollList-->GUI.matrix"+GUI.matrix[0,0]+","+GUI.matrix[1,1]);
			}

			if (isCanOffset)
			{
				rowPerPage = (int)Mathf.Ceil(1.0f * rect.height / offsetRowDist);
				colPerPage = (int)Mathf.Ceil(1.0f * rect.width / offsetColDist);
			}
			else
			{
				rowPerPage = (int)Mathf.Ceil(1.0f * rect.height / rowDist);
				colPerPage = (int)Mathf.Ceil(1.0f * rect.width / colDist);
			}

			ScrollBarFlash();

			if (btnNextPage)
				btnNextPage.OnClick = new System.Action(onNavigatorDown);
			if (btnPrevPage)
				btnPrevPage.OnClick = new System.Action(onNavigatorUp);

			State = Panel_State.PANEL_IDL;
			updateable = true;

			m_bMoveDown = false;
			m_bMoveRight = false;
		}

		public void SetColPerPage(int page)
		{
			// rowPerPage=page;
		}
		public void SetRowPerPage(int page)
		{

			// colPerPage=page;
		}

		public void Init(ListItem[] itemArray)
		{
			m_itemsList = new System.Collections.Generic.List<ListItem>();
			for (int i = 0; i < itemArray.Length; i++)
			{
				m_itemsList.Add(itemArray[i]);
				//m_itemsList.Add(itemArray[i]);
				itemArray[i].Init();
			}
			scrollBar.Init();
			scrollViewVector.y = 0;
			m_nOffSet = 0;
			responseAngle = 0.0f;
			dataLen = 0;
			rowPerPage = (int)Mathf.Ceil(1.0f * rect.height / rowDist);
			colPerPage = (int)Mathf.Ceil(1.0f * rect.width / colDist);
			ScrollBarFlash();

			updateable = true;

			m_bMoveDown = false;
			m_bMoveRight = false;
		}

		public void SmoothMoveToBottom()
		{
			if (State == Panel_State.PANEL_IDL)
			{
				State = Panel_State.PANEL_MOVE;
			}
		}

		private float time;
		private int multiple = 100;
		private float gap = 0.01f;
		private int speed = 5;
		private int stepValue;
		private void UpdateMove()
		{
			if (m_nOffSet > -m_nMaxOffset)
			{
				m_nOffSet = -m_nMaxOffset;
				State = Panel_State.PANEL_IDL;

				return;
			}
			else
			{
				time += Time.deltaTime;
				if (time > gap)
				{
					stepValue = (int)(time * multiple * speed);
					m_nOffSet -= stepValue;

					time = 0;
				}
			}
		}

		// Update is called once per frame
		public override void Update()
		{
			if (!updateable)
				return;
			ForceUpdate();
		}

		public void ForceUpdate()
		{
			if (dataLen != prot_getDataCount())
			{
				if (dataLen < prot_getDataCount())
					m_bMoveDown = true;
				else
					m_bMoveDown = false;
				dataLen = prot_getDataCount();
				m_showRowNum = rowPerPage;
				if (rowPerPage >= prot_getDataCount())
				{
					m_showRowNum = (int)Mathf.Ceil(1.0f * prot_getDataCount() / colPerPage);
				}

				if (rowPerPage >= prot_getDataCount())
				{
					ResetPos();
				}
				else
					this.AutoLayout();
				this.UpdateItems(true);
			}

			if (m_lastState != State)
			{
				m_lastState = State;
			}

			if ((rowNum <= 0 && orientation == ORIENTATION.VERTICAL) || (colNum <= 0 && orientation != ORIENTATION.VERTICAL))
				return;

			switch (Application.platform)
			{
				case RuntimePlatform.IPhonePlayer:
				case RuntimePlatform.Android:
					if (Input.touchCount < 1)
					{
						m_bTouch = false;
						break;
					}

					if (!HoleScreenAct && (Input.touchCount != 1 || !actRect.Contains(GetTouchPos())))
					{
						m_bTouch = false;
						break;
					}

					Touch touch = Input.touches[0];
					if (touch.phase == TouchPhase.Began)
					{
						m_bTouch = true;
					}
					else if (touch.phase == TouchPhase.Canceled)
					{
						m_bTouch = false;
					}
					else if (touch.phase == TouchPhase.Moved)
					{
						m_bTouch = true;
					}
					else if (touch.phase == TouchPhase.Ended)
					{
						m_bTouch = false;
					}
					break;

				default:
					if (!Input.GetMouseButton(0) && !Input.GetMouseButtonDown(0))
					{
						m_bTouch = false;
						break;
					}
					if (!HoleScreenAct && !actRect.Contains(GetTouchPos()))
					{
						m_bTouch = false;
						break;
					}
					m_bTouch = true;
					break;
			}

			switch (State)
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
				case Panel_State.PANEL_LISTITEM_FADEOUT:
					UpdateFadeOutItem();
					break;
			}

			//		if(State == Panel_State.PANEL_LISTITEM_FADEOUT)
			//		{
			//			return;
			//		}

			int length;
			int startIndex;
			if (orientation == ORIENTATION.VERTICAL)
			{
				startIndex = (int)(-m_nOffSet / rowDist);
				startIndex *= colPerPage;
			}
			else
			{
				startIndex = (int)(-m_nOffSet / colDist);
				startIndex *= rowPerPage;
			}
			if (m_nOffSet > 0)
			{
				if (orientation == ORIENTATION.VERTICAL)
				{
					length = (int)(rect.height * rect.height / (rowNum * rowDist));
					length = (int)Mathf.Max(4, length * (rect.height - 2 * m_nOffSet) / (rect.height));
				}
				else
				{
					length = (int)(rect.width * rect.width / (colNum * colDist));
					length = (int)Mathf.Max(4, length * (rect.width - 2 * m_nOffSet) / (rect.width));
				}
				scrollBar.SetLength(length);
				scrollBar.MoveTo(rect.width - scrollBar.width, 0);
				startIndex = 0;
			}
			else if (m_nOffSet < -m_nMaxOffset)
			{
				if (orientation == ORIENTATION.VERTICAL)
				{
					length = (int)(rect.height * rect.height / (rowNum * rowDist));
					length = (int)Mathf.Max(4, length * (rect.height + (m_nOffSet + m_nMaxOffset) * 2) / rect.height);
					scrollBar.SetLength(length);
					scrollBar.MoveTo(rect.width - scrollBar.width, rect.height - scrollBar.GetLength());
					//startIndex = Mathf.Max(0, prot_getDataCount() - m_showRowNum*colPerPage + prot_getDataCount()%colPerPage);
					startIndex = Mathf.Max(0, Mathf.CeilToInt((prot_getDataCount() / (float)colPerPage)) * colPerPage - m_showRowNum * colPerPage);
				}
				else
				{
					// ??? why not update scrollbar ?
					//startIndex = Mathf.Max(0, prot_getDataCount() - m_showColNum*rowPerPage + prot_getDataCount()%rowPerPage);
					startIndex = Mathf.Max(0, Mathf.CeilToInt((prot_getDataCount() / (float)rowPerPage)) * rowPerPage - m_showColNum * rowPerPage);
				}
			}
			else
			{
				if (orientation == ORIENTATION.VERTICAL)
				{
					scrollBar.SetLength(rect.height * rect.height / (rowNum * rowDist));
					scrollBar.MoveTo(rect.width - scrollBar.width, (rect.height - scrollBar.GetLength()) * (-m_nOffSet) / m_nMaxOffset);
				}
			}
			scrollBar.UpdateData();

			if (startIndex != m_startIndex/* && m_showRowNum == rowPerPage*/)
			{
				m_startIndex = startIndex;
				UpdateItems(false);
			}

			ForEachItem(UpdateItem);
			if (orientation == ORIENTATION.VERTICAL)
				curPage = (int)Mathf.Round(-m_nOffSet / rect.height);
			else
				curPage = (int)Mathf.Round(-m_nOffSet / rect.width);
		}

		public static bool UpdateItem(ListItem listItem)
		{
			listItem.Update();
			return true;
		}

		public void ForEachItem(System.Func<ListItem, bool> func)
		{
			if (func == null || m_itemsList == null || prot_getDataCount() == 0)
			{
				return;
			}

			for (var i = 0; i < m_itemsList.Count; ++i)
			{
				if (i + m_startIndex >= prot_getDataCount())
				{
					break;
				}
				if (!func(m_itemsList[i]))
					break;
			}
		}

		public int GetDataLength()
		{
			return dataLen;
		}

		private int GetListHeight()
		{
			return rowNum * rowDist;
		}
		private Touch GetTouch()
		{
			return Input.touches[0];
		}

		private bool IsTouched()
		{
			return m_bTouch;
		}

		public bool IsMoved()
		{
			return m_bTouch;
		}

		private Vector2 GetTouchPos()
		{
			Vector2 pos;
			if (Application.platform == RuntimePlatform.IPhonePlayer || Application.platform == RuntimePlatform.Android)
			{
				pos.x = GetTouch().position.x;
				pos.y = Screen.height - GetTouch().position.y;
			}
			else
			{
				pos.x = Input.mousePosition.x;
				pos.y = Screen.height - Input.mousePosition.y;
			}

			pos.x /= GameMain.horizRatio;
			pos.y /= GameMain.vertRatio;
			return pos;
		}


		public int rowDist;
		public int rowDistNormal;
		public int colDist;
		private Rect windowRect;

		private System.Collections.Generic.IEnumerable<object> priv_castToGeneric(System.Collections.IEnumerable data)
		{
			foreach (object d in data)
				yield return d;
		}

		public void SetData(System.Collections.IEnumerable data)
		{
			prot_setDataWithOwnerStorage(data, true);
		}

		protected void prot_setDataWithOwnerStorage(System.Collections.IEnumerable data, bool isStorage)
		{
			ListItem item;
			if (m_itemsList.Count == 0)
			{
				int i = 0;
				if (orientation == ORIENTATION.VERTICAL)
				{
					for (i = 0; i < rowPerPage * colPerPage + colPerPage; i++)
					{
						item = (ListItem)Instantiate(m_itemTemplate);
						// item.transform.parent=transform;
						item.handlerDelegate = itemDelegate;
						m_itemsList.Add(item);
						item.Init();
					}
				}
				else
				{
					for (i = 0; i < rowPerPage * colPerPage + rowPerPage; i++)
					{
						item = (ListItem)Instantiate(m_itemTemplate);
						// item.transform.parent=transform;
						item.handlerDelegate = itemDelegate;
						m_itemsList.Add(item);
						item.Init();
					}
				}
			}

			if (isStorage)
			{
				if (data is System.Collections.IList)
				{
					m_datasList = (System.Collections.IList)data;
				}
				else
				{
					var datasList = new System.Collections.Generic.List<object>();
					datasList.AddRange(priv_castToGeneric(data));
					m_datasList = datasList;
				}
			}

			m_showRowNum = rowPerPage;
			if (rowPerPage >= prot_getDataCount())
			{
				m_showRowNum = (int)Mathf.Ceil(1.0f * prot_getDataCount() / colPerPage);
			}

			m_showColNum = colPerPage;
			if (colPerPage >= prot_getDataCount())
			{
				m_showColNum = (int)Mathf.Ceil(1.0f * prot_getDataCount() / rowPerPage);
			}

			if (dataLen != prot_getDataCount())
			{
				if (dataLen < prot_getDataCount())
					m_bMoveDown = true;
				else
					m_bMoveDown = false;
				AutoLayout();
				dataLen = prot_getDataCount();
			}
			UpdateItems(true);
		}

		protected void UpdateItems(bool updateAll)
		{
			if (orientation == ORIENTATION.VERTICAL)
				UpdateItemsVertical(updateAll);
			else
				UpdateItemsHorizontal(updateAll);
		}
		protected void UpdateItemsVertical(bool updateAll)
		{
			if (m_startIndex >= prot_getDataCount())
				return;
			//		_Global.Log("movedown:"+m_bMoveDown);
			var updateCount = Mathf.Ceil((prot_getDataCount() - m_startIndex) / colPerPage) <= m_showRowNum ? prot_getDataCount() - m_startIndex : (m_showRowNum + 1) * colPerPage;

			ListItem temp;
			int modifyNum = 0;
			int i = 0;
			float bottom;
			if (m_nOffSet <= -m_nMaxOffset && m_nMaxOffset >= rowDist)
			{
				bottom = m_showRowNum * rowDist - rect.height;
				for (i = 0; i < (m_showRowNum + 1) * colPerPage; i++)
				{
					if (i >= 0 && i < m_itemsList.Count)
					{
						m_itemsList[i].rect.x = (i % colPerPage) * colDist;
						m_itemsList[i].rect.y = (i / colPerPage) * rowDist + margin + m_nMaxOffset - bottom;
					}
				}
				updateAll = true;
			}
			else if (m_nOffSet >= 0)
			{
				for (i = 0; i < (m_showRowNum + 1) * colPerPage; i++)
				{
					if (i >= 0 && i < m_itemsList.Count)
					{
						m_itemsList[i].rect.x = (i % colPerPage) * colDist;
						m_itemsList[i].rect.y = (i / colPerPage) * rowDist + margin;
					}
				}
				updateAll = true;
			}
			else
			{
				if (!m_bMoveDown)
				{
					float offset = m_nOffSet < -m_nMaxOffset ? -m_nMaxOffset : m_nOffSet;
					while (m_itemsList.Count > 0 && GetItem(0).rect.y + offset - margin <= -rowDist)
					{
						temp = m_itemsList[0]; m_itemsList.RemoveAt(0);
						if ((m_itemsList[m_itemsList.Count - 1] as ListItem).rect.x == (colPerPage - 1) * colDist)
						{
							temp.rect.y = (m_itemsList[m_itemsList.Count - 1] as ListItem).rect.y + rowDist;
							temp.rect.x = 0;
						}
						else
						{
							temp.rect.y = (m_itemsList[m_itemsList.Count - 1] as ListItem).rect.y;
							temp.rect.x = (m_itemsList[m_itemsList.Count - 1] as ListItem).rect.x + colDist;
						}
						m_itemsList.Add(temp);
						modifyNum++;
						//			_Global.Log("move item to bottom, y="+ (temp.rect.y + m_nOffSet - margin));
					}
					if (!updateAll)
					{
						for (i = m_itemsList.Count - modifyNum; i < updateCount; i++)
						{
							if (i >= 0 && i < m_itemsList.Count)
							{
								if (m_startIndex + i < prot_getDataCount())
								{
									m_itemsList[i].SetRowData(prot_getListItem(m_startIndex + i));
									m_itemsList[i].SetIndexInList(m_startIndex + i);
									m_itemsList[i].SetListCount(m_datasList.Count);
								}

								m_itemsList[i].SetVisible(true);
							}
						}
					}

				}
				else
				{
					while (m_itemsList.Count > 0 && (m_itemsList[m_itemsList.Count - 1] as ListItem).rect.y + m_nOffSet - margin >= m_showRowNum * rowDist)
					{
						temp = m_itemsList[m_itemsList.Count - 1]; m_itemsList.RemoveAt(m_itemsList.Count - 1);
						if (m_itemsList[0].rect.x == 0)
						{
							temp.rect.y = m_itemsList[0].rect.y - rowDist;
							temp.rect.x = (colPerPage - 1) * colDist;
						}
						else
						{
							temp.rect.y = m_itemsList[0].rect.y;
							temp.rect.x = m_itemsList[0].rect.x - colDist;
						}
						m_itemsList.Insert(0, temp);
						modifyNum++;
					}
					if (!updateAll)
					{
						for (i = 0; i < modifyNum; i++)
						{
							if (i >= 0 && i < m_itemsList.Count)
							{
								if (m_startIndex + i < prot_getDataCount())
								{
									m_itemsList[i].SetRowData(prot_getListItem(m_startIndex + i));
									m_itemsList[i].SetIndexInList(m_startIndex + i);
									m_itemsList[i].SetListCount(m_datasList.Count);
								}
								m_itemsList[i].SetVisible(true);
							}
						}
					}

				}
			}

			if (!updateAll)
				return;
			for (i = 0; i < updateCount; i++)
			{
				if (m_startIndex + i < prot_getDataCount())
				{
					m_itemsList[i].SetRowData(prot_getListItem(m_startIndex + i));
					m_itemsList[i].SetIndexInList(m_startIndex + i);
					m_itemsList[i].SetListCount(m_datasList.Count);
				}
				GetItem(i).SetVisible(true);
			}
		}
		protected void UpdateItemsHorizontal(bool updateAll)
		{
			if (m_startIndex >= prot_getDataCount())
				return;
			int updateCount = Mathf.Ceil((prot_getDataCount() - m_startIndex) / rowPerPage) <= m_showColNum ? prot_getDataCount() - m_startIndex : (m_showColNum + 1) * rowPerPage;

			ListItem temp;
			int modifyNum = 0;
			int i = 0;
			if (m_nOffSet <= -m_nMaxOffset && m_nMaxOffset >= colDist)
			{
				float right = m_showColNum * colDist - rect.width;
				for (i = 0; i < (m_showRowNum + 1) * colPerPage; i++)
				{
					if (i >= 0 && i < m_itemsList.Count)
					{
						m_itemsList[i].rect.y = (i % rowPerPage) * rowDist;
						m_itemsList[i].rect.x = (i / rowPerPage) * colDist + margin + m_nMaxOffset - right;
					}
				}
				updateAll = true;
			}
			else if (m_nOffSet >= 0)
			{
				for (i = 0; i < (m_showColNum + 1) * rowPerPage; i++)
				{
					if (i >= 0 && i < m_itemsList.Count)
					{
						m_itemsList[i].rect.y = (i % rowPerPage) * rowDist;
						m_itemsList[i].rect.x = (i / rowPerPage) * colDist + margin;
					}
				}
				updateAll = true;
			}
			else
			{
				if (!m_bMoveRight)
				{
					float offset = m_nOffSet < -m_nMaxOffset ? -m_nMaxOffset : m_nOffSet;
					while (m_itemsList.Count > 0 && GetItem(0).rect.x + offset - margin <= -colDist)
					{
						temp = m_itemsList[0]; m_itemsList.RemoveAt(0);
						if ((m_itemsList[m_itemsList.Count - 1] as ListItem).rect.y == (rowPerPage - 1) * rowDist)
						{
							temp.rect.x = (m_itemsList[m_itemsList.Count - 1] as ListItem).rect.x + colDist;
							temp.rect.y = 0;
						}
						else
						{
							temp.rect.x = (m_itemsList[m_itemsList.Count - 1] as ListItem).rect.x;
							temp.rect.y = (m_itemsList[m_itemsList.Count - 1] as ListItem).rect.y + rowDist;
						}
						m_itemsList.Add(temp);
						modifyNum++;
						//			_Global.Log("move item to bottom, y="+ (temp.rect.y + m_nOffSet - margin));
					}
					if (!updateAll)
					{
						for (i = m_itemsList.Count - modifyNum; i < updateCount; i++)
						{
							if (i >= 0 && i < m_itemsList.Count)
							{
								if (m_startIndex + i < prot_getDataCount())
								{
									m_itemsList[i].SetRowData(prot_getListItem(m_startIndex + i));
									m_itemsList[i].SetIndexInList(m_startIndex + i);
									m_itemsList[i].SetListCount(m_datasList.Count);
								}
								m_itemsList[i].SetVisible(true);
							}
						}
					}

				}
				else
				{
					while (m_itemsList.Count > 0 && m_itemsList[m_itemsList.Count - 1].rect.x + m_nOffSet - margin >= m_showColNum * colDist)
					{
						temp = m_itemsList[m_itemsList.Count - 1]; m_itemsList.RemoveAt(m_itemsList.Count - 1);
						if (m_itemsList[0].rect.y == 0)
						{
							temp.rect.x = m_itemsList[0].rect.x - colDist;
							temp.rect.y = (rowPerPage - 1) * rowDist;
						}
						else
						{
							temp.rect.x = m_itemsList[0].rect.x;
							temp.rect.y = m_itemsList[0].rect.y - rowDist;
						}
						m_itemsList.Insert(0, temp);
						modifyNum++;
					}
					if (!updateAll)
					{
						for (i = 0; i < modifyNum; i++)
						{
							if (i >= 0 && i < m_itemsList.Count)
							{
								if (m_startIndex + i < prot_getDataCount())
								{
									m_itemsList[i].SetRowData(prot_getListItem(m_startIndex + i));
									m_itemsList[i].SetIndexInList(m_startIndex + i);
									m_itemsList[i].SetListCount(m_datasList.Count);
								}
								m_itemsList[i].SetVisible(true);
							}
						}
					}

				}
			}

			if (!updateAll)
				return;
			for (i = 0; i < updateCount; i++)
			{
				if (m_startIndex + i < prot_getDataCount())
				{
					m_itemsList[i].SetRowData(prot_getListItem(m_startIndex + i));
					m_itemsList[i].SetIndexInList(m_startIndex + i);
					m_itemsList[i].SetListCount(m_datasList.Count);
				}
				GetItem(i).SetVisible(true);
			}
		}

		public List<ListItem> GetItemLists()
		{
			return m_itemsList;
		}

		public ListItem GetItem(int index)
		{
			if (index >= 0 && index < m_itemsList.Count)
			{
				return m_itemsList[index];
			}
			return null;
		}

		public void AddItem(ListItem item)
		{
			m_itemsList.Add(item);
		}

		public void RemoveIem()
		{
		}

		public void AutoLayoutVertical()
		{
			if (m_itemsList.Count == 0)
			{
				for (int j = 0; j < rowPerPage * colPerPage + colPerPage; j++)
				{
					var item = (ListItem)Instantiate(m_itemTemplate);
					// item.transform.parent=transform;
					item.handlerDelegate = itemDelegate;
					m_itemsList.Add(item);
					item.Init();
				}
			}

			rowNum = (int)Mathf.Ceil(1.0f * prot_getDataCount() / colPerPage);
			if (m_itemsList == null || rowNum == 0)
				return;
			if (m_showRowNum < rowPerPage) // no need
				margin = rowDist * m_showRowNum;
			else
				margin = rect.height;


			if (isCanOffset)
			{
				rect.width = offsetColDist * colPerPage;
			}
			else
			{
				rect.width = colDist * colPerPage;
			}

			windowRect = new Rect(0, 0, colDist * colPerPage, Mathf.Max(m_showRowNum, rowNum) * rowDist + 2 * margin);

			bool bBottom = false;
			if (m_nOffSet <= -m_nMaxOffset && m_nMaxOffset > 1)
			{
				bBottom = true;

			}
			if (m_showRowNum < rowPerPage)
				SetMaxOffset(Mathf.Max(0, windowRect.height - rowDist * m_showRowNum - 2 * margin));
			else
			{
				if (lastItemScale)
				{
					if (itemScaleY < 1)
					{//the last item height ,shoud use item real height
						windowRect.height += rowDist / itemScaleY - rowDist;
					}
				}

				SetMaxOffset(windowRect.height - rect.height - 2 * margin);
			}

			if (bBottom)
			{
				if (m_nMaxOffset > 1)
					m_nOffSet = -m_nMaxOffset;
				else
					m_nOffSet = 0;
			}
			if (m_showRowNum < rowPerPage) // no need
				windowRect = new Rect(0, 0, colDist * colPerPage, rowPerPage * rowDist + 2 * margin);
			if (rowNum > 0)
				scrollBar.SetLength(rect.height * rect.height / (rowNum * rowDist));
			else
				scrollBar.SetLength(rect.height);
			scrollBar.rect.x = rect.width - scrollBar.width;
			scrollBar.rect.width = scrollBar.width;
			scrollBar.rect.y = 0;

			int startY = (m_startIndex / colPerPage) * rowDist;
			for (var i = 0; i < (m_showRowNum + 1) * colPerPage; i++)
			{
				if (i >= 0 && i < m_itemsList.Count)
				{
					m_itemsList[i].rect.x = (i % colPerPage) * colDist;
					m_itemsList[i].rect.y = (i / colPerPage) * rowDist + margin + startY;// - m_nOffSet;
				}
			}
		}
		public void AutoLayoutHorizontal()
		{
			if (m_itemsList.Count == 0)
			{
				for (int j = 0; j < rowPerPage * colPerPage + rowPerPage; j++)
				{
					var item = (ListItem)Instantiate(m_itemTemplate);
					// item.transform.parent=transform;
					item.handlerDelegate = itemDelegate;
					m_itemsList.Add(item);
					item.Init();
				}
			}

			//		var itemPerPage = rowPerPage*colPerPage;
			colNum = (int)Mathf.Ceil(1.0f * prot_getDataCount() / rowPerPage);
			if (m_itemsList == null || colNum == 0)
				return;
			//	if(m_itemsList.Count % colPerPage != 0)
			//		rowNum++;
			if (m_showColNum < colPerPage)
				margin = rowDist * m_showColNum;
			else
				margin = rect.width;


			if (isCanOffset)
			{
				rect.height = offsetRowDist * rowPerPage;
			}
			else
			{
				rect.height = rowDist * rowPerPage;
			}

			windowRect = new Rect(0, 0, Mathf.Max(m_showColNum, colNum) * colDist + 2 * margin, colDist * colPerPage);

			bool bRight = false;
			if (m_nOffSet <= -m_nMaxOffset && m_nMaxOffset > 1)
			{
				bRight = true;

			}
			if (m_showColNum < colPerPage)
				SetMaxOffset(Mathf.Max(0, windowRect.width - colDist * m_showColNum - 2 * margin));
			else
				SetMaxOffset(windowRect.width - rect.width - 2 * margin);
			if (bRight)
			{
				if (m_nMaxOffset > 1)
					m_nOffSet = -m_nMaxOffset;
				else
					m_nOffSet = 0;
			}
			if (m_showColNum < colPerPage)
				windowRect = new Rect(0, 0, colPerPage * colDist + 2 * margin, rowDist * rowPerPage);
			if (rowNum > 0)
				scrollBar.SetLength(rect.width * rect.width / (colNum * colDist));
			else
				scrollBar.SetLength(rect.width);
			scrollBar.rect.y = rect.height - scrollBar.height;
			scrollBar.rect.width = scrollBar.width;
			scrollBar.rect.y = 0;

			int startX = (m_startIndex / rowPerPage) * colDist;
			for (var i = 0; i < (m_showColNum + 1) * rowPerPage; i++)
			{
				if (i >= 0 && i < m_itemsList.Count)
				{
					m_itemsList[i].rect.y = (i % rowPerPage) * rowDist;
					m_itemsList[i].rect.x = (i / rowPerPage) * colDist + margin + startX;// - m_nOffSet;
				}
			}
		}
		public void AutoLayout()
		{
			if (orientation == ORIENTATION.VERTICAL)
				AutoLayoutVertical();
			else
				AutoLayoutHorizontal();
		}

		private void SetMaxOffset(float offset)
		{
			m_nMaxOffset = (int)offset;
			if (m_nMaxOffset == 0)
				m_nMaxOffset = 1;
			if (orientation == ORIENTATION.VERTICAL)
				pageNum = (int)(m_nMaxOffset / rect.height + 1);
			else
				pageNum = (int)(m_nMaxOffset / rect.width + 1);
			int pointSize;
			if (point)
			{
				pointSize = point.width;
			}
			else
			{
				pointSize = 12;
			}
			if (AutoNumRegion)
				pageNumRegion = new Rect((rect.width - pointSize * pageNum) / 2, rect.height - pointSize - 2, pointSize * pageNum, pointSize);
		}

		public void Clear()
		{
			if (this.m_itemsList != null)
			{
				foreach (ListItem obj in this.m_itemsList)
				{
					if (obj == null) continue;
					obj.OnClear();
					obj.OnPopOver();
					TryDestroy(obj);
				}
			}
			this.m_itemsList = new System.Collections.Generic.List<ListItem>();
		}

		public virtual void ClearData()
		{
			if (m_datasList != null)
				m_datasList.Clear();
		}
		public void ClearData2()
		{
			if (m_datasList != null)
				m_datasList.Clear();
			m_datasList = null;
		}

		public void onNavigatorUp()
		{
			if (State != Panel_State.PANEL_IDL)
				return;
			MoveToPrevPage();
		}

		public void onNavigatorDown()
		{
			if (State != Panel_State.PANEL_IDL)
				return;
			MoveToNextPage();
		}

		private void MoveToPrevPage()
		{
			int page;
			if (orientation == ORIENTATION.VERTICAL)
			{
				page = (int)((-m_nOffSet) / rect.height) - 1;
				m_nSlideDest = -page * rect.height;
			}
			else
			{
				page = (int)((-m_nOffSet) / rect.width) - 1;
				m_nSlideDest = -page * rect.width;
			}

			m_fSpeed = 1500.0f;
			State = Panel_State.PANEL_SLIDE;
			m_bJudge = true;
			m_fAcceloration = s_fAcceloration;
			m_bMoveDown = true;
			m_bMoveRight = true;
		}

		private void MoveToNextPage()
		{
			int page;
			if (orientation == ORIENTATION.VERTICAL)
			{
				page = (int)((-m_nOffSet) / rect.height) + 1;
				m_nSlideDest = -page * rect.height;
			}
			else
			{
				page = (int)((-m_nOffSet) / rect.width) + 1;
				m_nSlideDest = -page * rect.width;
			}

			m_fSpeed = 1500.0f;
			State = Panel_State.PANEL_SLIDE;
			m_bJudge = true;
			m_fAcceloration = s_fAcceloration;
			m_bMoveDown = false;
			m_bMoveRight = false;
		}


		public override int Draw()
		{
			if (!visible)
				return -1;
			if (State != Panel_State.PANEL_IDL && Event.current.type != EventType.Repaint)
				return -1;

			DrawInterface();
			UpdateAbsoluteVector();

			if (!HoleScreenAct && bindActRectToRect)
				this.MakeNeedScreenRectOnce();
			this.prot_calcScreenRect();
			if (!HoleScreenAct && bindActRectToRect)
			{
				actRect = this.ScreenRect;
				actRect.x /= GameMain.horizRatio;
				actRect.width /= GameMain.horizRatio;
				actRect.y /= GameMain.vertRatio;
				actRect.height /= GameMain.vertRatio;
			}

			var selectedItem = -1;

			if (orientation == ORIENTATION.VERTICAL)
			{
				scrollViewVector.x = windowRect.x;
				scrollViewVector.y = -m_nOffSet + margin;
			}
			else
			{
				scrollViewVector.y = windowRect.y;
				scrollViewVector.x = -m_nOffSet + margin;
			}
			GUI.BeginGroup(rect);
			GUI.BeginScrollView(new Rect(0, 0, rect.width, rect.height), scrollViewVector, windowRect);

			var hasItem = false;
			for (var i = 0; i < m_itemsList.Count; i++)
			{
				if (prot_getDataCount() == 0 || i + m_startIndex >= dataLen)
				{
					break;
				}

				Color oldColor = GUI.color;
				if (State == Panel_State.PANEL_LISTITEM_FADEOUT && !hasMovedFadeoutItem && fadeoutItemIndex == i)
				{
					GUI.color = new Color(GUI.color.r, GUI.color.g, GUI.color.b, fadeoutAlpha);
				}

				if (Event.current.type == EventType.Repaint)
				{
					m_itemsList[i].SetScrollPos((int)scrollViewVector.y, (int)rect.height);
				}

				if (m_itemsList[i].Draw() != 0)
				{
					selectedItem = i;
				}

				if (State == Panel_State.PANEL_LISTITEM_FADEOUT && !hasMovedFadeoutItem && fadeoutItemIndex == i)
				{
					GUI.color = oldColor;
				}

				hasItem = true;
			}

			GUI.EndScrollView();
			GUI.EndGroup();

			GUI.BeginGroup(rect);
			if (hasItem && orientation == ORIENTATION.VERTICAL)
				scrollBar.Draw();
			if (btnNextPage && m_nOffSet > -m_nMaxOffset && m_nMaxOffset > 1)
				btnNextPage.Draw();
			if (btnPrevPage && m_nOffSet < -1)
				btnPrevPage.Draw();

			if (drawPageNum)
			{
				float pointX = pageNumRegion.x;
				for (int j = 0; j < pageNum; j++)
				{
					if (j == curPage)
					{
						GUI.Label(new Rect(pointX, pageNumRegion.y - (pointBig.height - point.height) / 2, point.width, point.height), point);
						pointX += point.width;
					}
					else
					{
						GUI.Label(new Rect(pointX, pageNumRegion.y - (pointBig.height - point.height) / 2, pointBig.width, pointBig.height), pointBig);
						pointX += pointBig.width;
					}
				}
			}
			GUI.EndGroup();

			return selectedItem;
		}

		private int fadeoutItemIndex;
		public void UpdateData()
		{
			int length = Mathf.Min(m_itemsList.Count, prot_getDataCount());
			for (var i = 0; i < length; i++)
			{
				m_itemsList[i].UpdateData();
			}

			if (dataLen > prot_getDataCount())
			{
				ListItem tempListItem;
				bool hasUseoutItem = false;
				for (int a = 0; a < m_itemsList.Count; a++)
				{
					tempListItem = m_itemsList[a];
					if (tempListItem.isUseOutListItem())
					{
						hasUseoutItem = true;
						fadeoutItemIndex = a;

						break;
					}
				}

				if (hasUseoutItem)
				{
					State = Panel_State.PANEL_LISTITEM_FADEOUT;

					hasMovedFadeoutItem = false;
					fadeoutAlpha = 1;
				}
			}
			else if (dataLen < prot_getDataCount())
			{
				//this is activated when num changed				
				if (dataLen < prot_getDataCount())
					m_bMoveDown = true;
				else
					m_bMoveDown = false;
				dataLen = prot_getDataCount();
				m_showRowNum = rowPerPage;
				if (rowPerPage >= prot_getDataCount())
				{
					m_showRowNum = (int)Mathf.Ceil(1.0f * prot_getDataCount() / colPerPage);
				}

				if (rowPerPage >= prot_getDataCount())
				{
					ResetPos();
				}
				else
				{
					this.AutoLayout();
				}
				this.UpdateItems(true);
			}

		}


		private int fadeoutSpeed = 3;
		private float fadeoutAlpha;
		private float timeGap;
		private bool hasMovedFadeoutItem;
		private float moveTime = 0.04f;
		//1 for offset, 2 for fadeoutIndex 
		private float post_m_nOffset;
		private float endPos;
		private float curPos;
		private float moveDist;
		private float velocity;
		private void UpdateFadeOutItem()
		{
			timeGap = Time.deltaTime;

			ListItem tempItem;

			//fade out effect
			if (fadeoutAlpha != 0)
			{
				fadeoutAlpha -= timeGap * fadeoutSpeed;
			}
			//move effect
			else
			{
				if (!hasMovedFadeoutItem)
				{
					//there is no need moving
					if (dataLen <= 1)
					{
						State = Panel_State.PANEL_IDL;

						dataLen = prot_getDataCount();
						m_startIndex = 0;
						AutoLayout();
						UpdateItems(true);

						return;
					}

					tempItem = m_itemsList[fadeoutItemIndex];
					m_itemsList.RemoveAt(fadeoutItemIndex);

					if (orientation == ORIENTATION.VERTICAL)
					{
						if (m_nMaxOffset == 1) //up
						{
							post_m_nOffset = m_nOffSet;
						}
						else if (m_nMaxOffset > 0 && m_nMaxOffset < rowDist && m_nMaxOffset != 1)
						{
							if (m_nOffSet == 0) //up 
							{
								post_m_nOffset = m_nOffSet;
							}
							else if (m_nOffSet < 0) //up and down
							{
								post_m_nOffset = 0;
							}
						}
						else if (m_nMaxOffset >= rowDist)
						{
							if (m_nOffSet - rowDist >= -m_nMaxOffset) //up
							{
								post_m_nOffset = m_nOffSet;
							}
							else if (m_nOffSet == -m_nMaxOffset) // down
							{
								post_m_nOffset = m_nOffSet + rowDist;
							}
							else //up and down
							{
								post_m_nOffset = rowDist - m_nMaxOffset;
							}
						}

						endPos = tempItem.rect.y;
						tempItem.rect.y = m_itemsList[m_itemsList.Count - 1].rect.y + m_itemsList[m_itemsList.Count - 1].rect.height;
						m_itemsList.Add(tempItem);
						dataLen = prot_getDataCount();
					}
					else
					{
						if (m_nMaxOffset == 1) //up
						{
							post_m_nOffset = m_nOffSet;
						}
						else if (m_nMaxOffset > 0 && m_nMaxOffset < rowDist)
						{
							if (m_nOffSet == 0) //up 
							{
								post_m_nOffset = m_nOffSet;
							}
							else if (m_nOffSet < 0) //up and down
							{
								post_m_nOffset = 0;
							}
						}
						else if (m_nMaxOffset >= rowDist)
						{
							if (m_nOffSet - rowDist >= -m_nMaxOffset) //up
							{
								post_m_nOffset = m_nOffSet;
							}
							else if (m_nOffSet == -m_nMaxOffset) // down
							{
								post_m_nOffset = m_nOffSet + colDist;
							}
							else //up and down
							{
								post_m_nOffset = colDist - m_nMaxOffset;
							}
						}

						endPos = tempItem.rect.x;
						tempItem.rect.x = m_itemsList[m_itemsList.Count - 1].rect.x + m_itemsList[m_itemsList.Count - 1].rect.width;
						m_itemsList.Add(tempItem);
						dataLen = prot_getDataCount();
					}
					UpdateItems(true);
					hasMovedFadeoutItem = true;
				}

				if (orientation == ORIENTATION.VERTICAL)
				{
					if (fadeoutItemIndex - 1 >= 0)
					{
						curPos = m_itemsList[fadeoutItemIndex].rect.y;
					}
					else
					{
						curPos = m_itemsList[fadeoutItemIndex].rect.y;
					}
				}
				else
				{
					if (fadeoutItemIndex - 1 >= 0)
					{
						curPos = m_itemsList[fadeoutItemIndex].rect.x;
					}
					else
					{
						curPos = m_itemsList[fadeoutItemIndex].rect.x;
					}
				}

				if (post_m_nOffset - m_nOffSet != 0)
				{
					m_nOffSet = Mathf.SmoothDamp(m_nOffSet, post_m_nOffset, ref velocity, moveTime);

					if (post_m_nOffset - m_nOffSet < 4)
					{
						m_nOffSet = post_m_nOffset;
					}
				}

				if (curPos - endPos != 0)
				{
					moveDist = curPos;
					curPos = Mathf.SmoothDamp(curPos, endPos, ref velocity, moveTime);

					if (curPos - endPos < 4)
					{
						curPos = endPos;
						moveDist = curPos;
					}

					moveDist = moveDist - curPos;
				}

				if (curPos - endPos == 0 && post_m_nOffset - m_nOffSet == 0)
				{
					State = Panel_State.PANEL_IDL;

					if (orientation == ORIENTATION.VERTICAL)
					{
						m_nMaxOffset -= rowDist;
					}
					else
					{
						m_nMaxOffset -= colDist;
					}

					AutoLayout();
					return;
				}

				if (orientation == ORIENTATION.VERTICAL)
				{
					for (int a = 0; a < m_itemsList.Count; a++)
					{
						tempItem = m_itemsList[a];
						if (a >= fadeoutItemIndex)
						{
							tempItem.rect.y -= moveDist;
						}
					}
				}
				else
				{
					for (int b = 0; b < m_itemsList.Count; b++)
					{
						tempItem = m_itemsList[b];
						if (b >= fadeoutItemIndex)
						{
							tempItem.rect.x -= moveDist;
						}
					}
				}
			}

			if (fadeoutAlpha < 0)
			{
				fadeoutAlpha = 0;
			}
		}

		void UpdateDrag()
		{
			if (IsTouched())
			{
				if (m_nLastTouchY < GetTouchPos().y)
				{
					m_bMoveDown = true;
				}
				else if (m_nLastTouchY > GetTouchPos().y)
				{
					m_bMoveDown = false;
				}

				if (m_nLastTouchX < GetTouchPos().x)
				{
					m_bMoveRight = true;
				}
				else if (m_nLastTouchX > GetTouchPos().x)
				{
					m_bMoveRight = false;
				}

				m_nLastTouchY = GetTouchPos().y;
				m_nLastTouchX = GetTouchPos().x;
				float fElas = 0.4f;
				float remain;
				float touchOffset;
				if (orientation == ORIENTATION.VERTICAL)
				{
					if (m_nOffSet > 0)
					{
						m_nOffSet += fElas * (GetTouchPos().y - m_nLastTouch);
					}
					else if (m_nOffSet < -m_nMaxOffset)
					{

						m_nOffSet += fElas * (GetTouchPos().y - m_nLastTouch);
						if (m_nOffSet > -m_nMaxOffset)
						{
							m_nOffSet -= fElas * (GetTouchPos().y - m_nLastTouch);
							remain = (GetTouchPos().y - m_nLastTouch) - (m_nOffSet + m_nMaxOffset) / fElas;
							m_nOffSet = -m_nMaxOffset + remain;
						}
					}
					else
					{
						touchOffset = GetTouchPos().y - m_nLastTouch;
						m_nOffSet += touchOffset;
						if (m_nOffSet < -m_nMaxOffset)
						{
							m_nOffSet -= touchOffset;
							remain = touchOffset - (-m_nMaxOffset - m_nOffSet);
							m_nOffSet = -m_nMaxOffset + remain * fElas;
						}
						else if (m_nOffSet > 0)
						{
							m_nOffSet -= touchOffset;
							remain = touchOffset + m_nOffSet;
							m_nOffSet = remain * fElas;
						}
					}

					m_fSpeed = Mathf.Abs(1.0f * (GetTouchPos().y - m_nLastTouch) / Time.deltaTime);
					m_nLastTouch = GetTouchPos().y;
				}
				else
				{
					if (m_nOffSet > 0)
					{

						m_nOffSet += fElas * (GetTouchPos().x - m_nLastTouch);
					}
					else if (m_nOffSet < -m_nMaxOffset)
					{

						m_nOffSet += fElas * (GetTouchPos().x - m_nLastTouch);
						if (m_nOffSet > -m_nMaxOffset)
						{
							m_nOffSet -= fElas * (GetTouchPos().x - m_nLastTouch);
							remain = (GetTouchPos().x - m_nLastTouch) - (m_nOffSet + m_nMaxOffset) / fElas;
							m_nOffSet = -m_nMaxOffset + remain;
						}
					}
					else
					{
						touchOffset = GetTouchPos().x - m_nLastTouch;
						m_nOffSet += touchOffset;
						if (m_nOffSet < -m_nMaxOffset)
						{
							m_nOffSet -= touchOffset;
							remain = touchOffset - (-m_nMaxOffset - m_nOffSet);
							m_nOffSet = -m_nMaxOffset + remain * fElas;
						}
						else if (m_nOffSet > 0)
						{
							m_nOffSet -= touchOffset;
							remain = touchOffset + m_nOffSet;
							m_nOffSet = remain * fElas;
						}
					}

					m_fSpeed = Mathf.Abs(1.0f * (GetTouchPos().x - m_nLastTouch) / Time.deltaTime);
					m_nLastTouch = GetTouchPos().x;
				}
				if (m_fSpeed >= 1500.0f)
					m_fSpeed = 1500.0f;

				//	print("Panel offset: %d\n", m_nOffSet);
				//	print("touch point: %d\n", GetTouchPos().y);
			}
			else
			{
				m_bJudge = false;

				if (m_nOffSet > 0)
				{
					m_bMoveDown = false;
					m_bMoveRight = false;
					m_nSlideDest = 0;
					State = Panel_State.PANEL_SLIDE;
					m_fAcceloration = s_fAcceloration * 2;//*SCREEN_WIDTH/(m_nOffSet);
					m_fSpeed = Mathf.Min(1500, m_nOffSet * 10);
					m_bJudge = true;
				}
				else if (m_nOffSet < -m_nMaxOffset)
				{
					m_bMoveDown = true;
					m_bMoveRight = true;
					m_nSlideDest = -m_nMaxOffset;
					State = Panel_State.PANEL_SLIDE;
					m_fAcceloration = s_fAcceloration * 2;
					m_fSpeed = Mathf.Min(1500, (-m_nOffSet - m_nMaxOffset) * 10);
					m_bJudge = true;
				}
				else
				{
					int page;
					if (autoArrange)
					{
						if (m_fSpeed > 200.0)
						{
							if ((m_bMoveDown && orientation == ORIENTATION.VERTICAL) || (m_bMoveRight && orientation != ORIENTATION.VERTICAL))
							{
								if (orientation == ORIENTATION.VERTICAL)
								{
									page = (int)((-m_nOffSet) / rect.height);
									m_nSlideDest = -page * rect.height;
								}
								else
								{
									page = (int)((-m_nOffSet) / rect.width);
									m_nSlideDest = -page * rect.width;
								}
							}
							else
							{
								if (orientation == ORIENTATION.VERTICAL)
								{
									page = (int)((-m_nOffSet) / rect.height) + 1;
									m_nSlideDest = -page * rect.height;
								}
								else
								{
									page = (int)((-m_nOffSet) / rect.width) + 1;
									m_nSlideDest = -page * rect.width;
								}
							}
						}
						else
						{
							if (orientation == ORIENTATION.VERTICAL)
							{
								page = (int)((-m_nOffSet + rect.height / 2) / rect.height);
								m_nSlideDest = -page * rect.height;
							}
							else
							{
								page = (int)((-m_nOffSet + rect.width / 2) / rect.width);
								m_nSlideDest = -page * rect.width;
							}

							if (m_nSlideDest > m_nOffSet)
							{
								m_bMoveDown = true;
								m_bMoveRight = true;
							}
							else
							{
								m_bMoveDown = false;
								m_bMoveRight = false;
							}
						}

						m_fSpeed = 1500.0f;
						State = Panel_State.PANEL_SLIDE;
						m_bJudge = true;
						m_fAcceloration = s_fAcceloration;
					}
					else
					{
						if (m_fSpeed == 0)
						{
							State = Panel_State.PANEL_IDL;
							scrollBar.Hide();
						}
						else
						{
							State = Panel_State.PANEL_SLIDE;
							if ((m_bMoveDown && orientation == ORIENTATION.VERTICAL) || (m_bMoveRight && orientation != ORIENTATION.VERTICAL))
							{
								m_nSlideDest = m_nOffSet + s_slideDist;
								if (m_nSlideDest > 0)
									m_nSlideDest = 0;
							}
							else
							{
								m_nSlideDest = m_nOffSet - s_slideDist;
								if (m_nSlideDest < -m_nMaxOffset)
									m_nSlideDest = -m_nMaxOffset;
							}
							if (m_fSpeed >= 1500.0f)
								m_fSpeed = 1500.0f;
							m_bJudge = false;
							m_fAcceloration = s_fAcceloration;

						}
					}
				}
			}

			//			_Global.Log("movedown:"+m_bMoveDown);		
			if (onDragFnished != null)
			{
				onDragFnished();
			}
		}

		void UpdateSlide()
		{
			if (m_bTouch && m_nOffSet > -m_nMaxOffset && m_nOffSet < 0)
			{
				State = Panel_State.PANEL_IDL;
				return;
			}
			float time = Time.deltaTime;
			if (m_fSpeed - time * m_fAcceloration < 0)
				time = m_fSpeed / m_fAcceloration;

			if (!m_bJudge)
			{

				if ((m_bMoveDown && orientation == ORIENTATION.VERTICAL) || (m_bMoveRight && orientation != ORIENTATION.VERTICAL))
				{
					m_nOffSet += m_fSpeed * time - m_fAcceloration * time * time / 2;//m_fSpeed* Time.deltaTime;	
				}
				else
				{
					m_nOffSet -= m_fSpeed * Time.deltaTime - m_fAcceloration * time * time / 2;//;m_fSpeed*Time.deltaTime;	
				}
			}
			else
			{
				if (m_nOffSet > 0)
				{
					m_nOffSet = Mathf.SmoothDamp(m_nOffSet, 0, ref xVelocity, smoothTime);

					if (m_nOffSet < 2)
					{
						m_nOffSet = 0;
						State = Panel_State.PANEL_IDL;
						scrollBar.Hide();
					}
				}
				else if (m_nOffSet < -m_nMaxOffset)
				{
					m_nOffSet = Mathf.SmoothDamp(m_nOffSet, -m_nMaxOffset, ref xVelocity, smoothTime);

					if (m_nOffSet > -m_nMaxOffset - 2)
					{
						m_nOffSet = -m_nMaxOffset;
						State = Panel_State.PANEL_IDL;
						scrollBar.Hide();
					}
				}
				else
				{
					m_nOffSet = Mathf.SmoothDamp(m_nOffSet, m_nSlideDest, ref xVelocity, smoothTime);

					if (Mathf.Abs(m_nSlideDest - m_nOffSet) < 2)
					{
						m_nOffSet = m_nSlideDest;
						State = Panel_State.PANEL_IDL;
						scrollBar.Hide();
					}
				}
			}

			m_fSpeed -= m_fAcceloration * Time.deltaTime;

			if ((m_fSpeed <= 0 || m_nOffSet > 100 || (!m_bMoveRight && m_nOffSet < m_nSlideDest - 100) || (m_bMoveRight && m_nOffSet > m_nSlideDest + 100)) && !m_bJudge && autoArrange)
			{
				//m_nOffSet = m_nSlideDest;
				//State = Panel_State.PANEL_IDL;
				//scrollBar.Hide();
				m_bJudge = true;
			}

			if ((m_fSpeed <= 0 || m_nOffSet > 100 || m_nOffSet < -m_nMaxOffset - 100) && !m_bJudge && !autoArrange)
			{
				if (m_nOffSet > 0)
				{
					m_bMoveDown = false;
					m_bMoveRight = false;
					m_nSlideDest = 0;
					State = Panel_State.PANEL_SLIDE;
					m_fAcceloration = s_fAcceloration * 2;//*SCREEN_WIDTH/(m_nOffSet);
					m_fSpeed = Mathf.Min(1500, 10 * m_nOffSet);
				}
				else if (m_nOffSet < -m_nMaxOffset)
				{
					m_bMoveDown = true;
					m_bMoveRight = true;
					m_nSlideDest = -m_nMaxOffset;
					State = Panel_State.PANEL_SLIDE;
					m_fAcceloration = s_fAcceloration * 2;
					m_fSpeed = Mathf.Min(1500, 10 * (-m_nOffSet - m_nMaxOffset));
				}
				else
				{
					if (!autoArrange)
					{
						State = Panel_State.PANEL_IDL;
						scrollBar.Hide();
					}
					else
					{
						if (((m_bMoveDown && orientation == ORIENTATION.VERTICAL) || (m_bMoveRight && orientation != ORIENTATION.VERTICAL)) && m_nOffSet >= m_nSlideDest)
						{
							m_nOffSet = m_nSlideDest;
							State = Panel_State.PANEL_IDL;
							scrollBar.Hide();
						}
						else if ((!m_bMoveDown && !m_bMoveRight) && m_nOffSet <= m_nSlideDest)
						{
							m_nOffSet = m_nSlideDest;
							State = Panel_State.PANEL_IDL;
							scrollBar.Hide();
						}
					}
				}
				m_bJudge = true;
			}

			if (m_bJudge)
			{
				if ((m_nSlideDest == 0 || m_nSlideDest == -m_nMaxOffset) && m_fSpeed < 200)
				{
					m_fSpeed = 200;
				}
			}
		}

		void UpdateIdl()
		{
			if (!IsTouched())
			{
				if ((Application.platform == RuntimePlatform.IPhonePlayer || Application.platform == RuntimePlatform.Android) && Input.touchCount < 1)
				{
					m_bFirstTouch = false;
					return;
				}
			}

			if (!m_bFirstTouch && IsTouched())
			{

				m_bFirstTouch = true;
				m_nStartX = GetTouchPos().x;
				m_nStartY = GetTouchPos().y;
				m_nLastTouchY = GetTouchPos().y;
				m_nLastTouchX = GetTouchPos().x;
				if (orientation == ORIENTATION.VERTICAL)
					m_nLastTouch = GetTouchPos().y;
				else
					m_nLastTouch = GetTouchPos().x;
				//			_Global.Log("first touch");
				touchTime = Time.realtimeSinceStartup;
			}
			else if (m_bFirstTouch)
			{
				if ((Application.platform == RuntimePlatform.IPhonePlayer || Application.platform == RuntimePlatform.Android) && Input.touchCount < 1)
				{
					m_bFirstTouch = false;
					return;
				}
				if (Time.realtimeSinceStartup - touchTime > 0.2 && !IsTouched())
				{
					m_bFirstTouch = false;
					return;
				}
				touchTime = Time.realtimeSinceStartup;

				//			_Global.Log("touch again");
				float nOffsetX = GetTouchPos().x - m_nStartX;
				float nOffsetY = GetTouchPos().y - m_nStartY;
				double angle = Mathf.Atan2(nOffsetY, nOffsetX);
				if (angle < 0)
					angle += Mathf.PI;
				double limit1 = Mathf.PI * responseAngle / 180.0;
				double limit2 = Mathf.PI * (180.0 - responseAngle) / 180.0;
				bool bVertical = (angle > limit1 && angle < limit2);
				if (orientation == ORIENTATION.VERTICAL)
				{
					if (nOffsetY > moveThreshold && bVertical)
					{
						State = Panel_State.PANEL_DRAG;
						m_nOffSet += (GetTouchPos().y - m_nStartY);
						m_nCursorPos += GetTouchPos().y - m_nStartY;
						//	m_nStateStartTime = GetApp()->GetCurMTime();

						scrollBar.Show();
						m_bFirstTouch = false;
						m_bMoveDown = true;
					}
					else if (nOffsetY < -moveThreshold && bVertical)
					{
						State = Panel_State.PANEL_DRAG;
						m_nOffSet += (GetTouchPos().y - m_nStartY);
						m_nCursorPos += GetTouchPos().y - m_nStartY;
						//	m_nStateStartTime = GetApp()->GetCurMTime();

						scrollBar.Show();
						m_bFirstTouch = false;
						m_bMoveDown = false;
					}
					m_fSpeed = Mathf.Abs(1.0f * (GetTouchPos().y - m_nLastTouch) / Time.deltaTime);
					m_nLastTouch = GetTouchPos().y;
				}
				else
				{
					if (nOffsetX > moveThreshold)
					{
						State = Panel_State.PANEL_DRAG;
						m_nOffSet += (GetTouchPos().x - m_nStartX);
						m_nCursorPos += GetTouchPos().x - m_nStartX;
						//	m_nStateStartTime = GetApp()->GetCurMTime();

						scrollBar.Show();
						m_bFirstTouch = false;
						m_bMoveRight = true;
					}
					else if (nOffsetX < -moveThreshold)
					{
						State = Panel_State.PANEL_DRAG;
						m_nOffSet += (GetTouchPos().x - m_nStartX);
						m_nCursorPos += GetTouchPos().x - m_nStartX;
						//	m_nStateStartTime = GetApp()->GetCurMTime();
						scrollBar.Show();
						m_bFirstTouch = false;
						m_bMoveRight = false;
					}
					m_fSpeed = Mathf.Abs(1.0f * (GetTouchPos().x - m_nLastTouch) / Time.deltaTime);
					m_nLastTouch = GetTouchPos().x;
				}

				if (!IsTouched())
				{
					m_bFirstTouch = false;
					//				_Global.Log("release offset:"+ nOffsetY);
				}
			}
			//	print("offset"+m_nOffSet);

		}

		public void ResetPos()
		{
			m_nOffSet = 0;
			m_startIndex = 0;
			this.AutoLayout();
			this.UpdateItems(true);
		}
		/*	
			public void MoveToBottom()
			{
				m_nOffSet = -m_nMaxOffset;
			}
		*/
		public void MoveToTop()
		{
			m_nOffSet = 0;
		}

		protected void SetScrollState(Panel_State state)
		{
			if (state == Panel_State.PANEL_IDL)
			{
			}
			State = state;
		}

		public void SetResposeAngle(float angle)
		{
			responseAngle = angle;
		}

		public void ScrollBarFlash()
		{
			scrollBar.Show();
			scrollBar.Hide();
		}

		public Rect GetItemLocalPosition(int index)
		{

			ListItem item = m_itemsList[Mathf.Clamp(index - m_startIndex, 0, prot_getDataCount())];
			if (orientation == ORIENTATION.VERTICAL)
			{

				return new Rect(item.Region.x, item.Region.y - scrollViewVector.y, item.Region.width, item.Region.height);
			}
			else
			{
				return new Rect(item.Region.x - scrollViewVector.x, item.Region.y, item.Region.width, item.Region.height);
			}
		}

		public void SetToPage(int page)
		{
			//int oldOffset = m_nOffSet;
			if (orientation == ORIENTATION.VERTICAL)
				m_nOffSet = -page * rect.height;
			else
			{
				m_nOffSet = -page * rect.width;
			}

			if (page > 0 && page < m_nMaxOffset / colDist)
			{
				m_startIndex = page;
				int i = 0;
				if (GetItem(0) != null && GetItem(0).rect.x > (-m_nOffSet + colDist))
				{
					for (i = 0; i < (m_showRowNum + 1) * colPerPage; i++)
					{
						m_itemsList[i].rect.y = (i % rowPerPage) * rowDist;
						m_itemsList[i].rect.x -= colDist;
					}
				}
				else if (GetItem(0) != null && GetItem(0).rect.x <= -m_nOffSet)
				{
					for (i = 0; i < (m_showRowNum + 1) * colPerPage; i++)
					{
						if (m_itemsList[i] != null)
						{
							m_itemsList[i].rect.y = (i % rowPerPage) * rowDist;
							m_itemsList[i].rect.x += colDist;
						}
					}
				}

				for (i = 0; i < (m_showRowNum + 1) * colPerPage; i++)
				{
					if (m_itemsList[i] != null)
					{
						if (m_startIndex + i < prot_getDataCount())
						{
							m_itemsList[i].SetRowData(prot_getListItem(m_startIndex + i));
							m_itemsList[i].SetIndexInList(m_startIndex + i);
							m_itemsList[i].SetListCount(m_datasList.Count);
						}
						m_itemsList[i].SetVisible(true);
					}
				}
			}
			UpdateItems(true);
		}
		//===============================================================================================
		//interface
		private int mZOrder;
		private System.Action<ITouchable> mActivated;
		private Vector2 mAbsoluteVector;
		private Rect mAbsoluteRect;
		public string GetName()
		{
			return "";
		}
		public bool IsVisible()
		{
			return visible;
		}



		public Rect GetAbsoluteRect()
		{
			mAbsoluteRect.x = mAbsoluteVector.x;
			mAbsoluteRect.y = mAbsoluteVector.y;
			mAbsoluteRect.width = rect.width;
			mAbsoluteRect.height = rect.height;
			return mAbsoluteRect;
		}


		public void SetZOrder(int zOrder)
		{
			mZOrder = zOrder;
		}
		public int GetZOrder()
		{
			return mZOrder;
		}

		public void SetTouchableActiveFunction(System.Action<ITouchable> activated)
		{
			mActivated = activated;
		}
		private void UpdateAbsoluteVector()
		{
			mAbsoluteVector = GUIUtility.GUIToScreenPoint(new Vector2(rect.x, rect.y));
			var t = mAbsoluteVector.x;
			mAbsoluteVector.x = t / Screen.width * 640.0f;
			t = mAbsoluteVector.y;
			mAbsoluteVector.y = t / Screen.height * 960.0f;
		}
		private void DrawInterface()
		{
			if (mActivated != null)
				mActivated(this);
		}

		public void SetOffSet(float offSet)
		{
			m_nOffSet = offSet;
			int startIndex;
			if (orientation == ORIENTATION.VERTICAL)
			{
				startIndex = (int)(-m_nOffSet / rowDist);
				startIndex *= colPerPage;
			}
			else
			{
				startIndex = (int)(-m_nOffSet / colDist);
				startIndex *= rowPerPage;
			}
			m_startIndex = startIndex;
			this.AutoLayout();
			this.UpdateItems(true);
		}

		public float GetOffset()
		{
			return m_nOffSet;
		}

		protected virtual int prot_getDataCount()
		{
			return m_datasList != null ? m_datasList.Count : 0;
		}

		protected virtual object prot_getListItem(int idx)
		{
			return m_datasList != null ? m_datasList[idx] : null;
		}

		public void SetStateIdle()
		{
			State = Panel_State.PANEL_IDL;
		}

		public bool HasReachedBottom()
		{
			return m_nOffSet <= -m_nMaxOffset;
		}

		public bool IsIdle()
		{
			return State == Panel_State.PANEL_IDL;
		}

		public int CurrentPage()
		{
			return curPage;
		}

		public int PageNum()
		{
			return pageNum;
		}

		public bool bIsMoveRight()
		{
			return m_bMoveRight;
		}
	}
}

