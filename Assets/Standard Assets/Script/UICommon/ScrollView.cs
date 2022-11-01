using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ScrollView : ComposedUIObj, ITouchable
{
    public enum Panel_State
    {
        PANEL_IDL = 0,
        PANEL_DRAG,
        PANEL_SLIDE,
        PANEL_REBOUND,
        PANEL_MOVE,
        PANEL_DELETE_ITEM,
        PANEL_STATE_NUM,
    }

    public enum ORIENTATION
    {
        HORIZONTAL,
        VERTICAL,
    }


    [Space(20),Header("---------- ScrollView ----------")]

    public bool IsDebug=false;

    public ScrollBar scrollBar;
    public bool hasMargin = true;
    public ORIENTATION orientation = ORIENTATION.VERTICAL;
    public int moveThreshold = 3;
    protected Vector2 scrollViewVector;
    private int rowNum;
    protected bool touchEnable = true;
    private float smoothTime = 0.1f;
    private float xVelocity = 0.0f;
    private float m_nCursorPos;
    protected bool m_bTouch;
    private bool m_bFirstTouch;
    private float m_fAcceloration;
    private float m_fSpeed;
    private int m_nPage;
    protected float m_nOffSet;
    private float m_nStartX;
    private float m_nStartY;
    private float m_nLastTouchY;
    private float m_nLastTouchX;
    private float m_nLastTouch;
    protected Panel_State m_state;
    protected float m_nMaxOffset;
    private float m_nSlideDest;
    private bool m_bMoveDown;
    private bool m_bMoveRight;
    private bool m_bJudge;
    private float s_fAcceloration = 1000;
    private float s_slideDist = 200;
    protected float margin ;
    private float touchTime;
    private float responseAngle;
    private static float SHOW_BAR_INTERVAL = 5;
    private static float cutDownTime = 0;
    public  bool HoleScreenAct = true;
    public bool autoArrange = false;
    protected Rect actRect;
    public bool scrollAble = true;
    public bool bindActRectToRect = true;
    private int m_intervalSize = 0;

	public int windowHeightOffset = 10;

	private float currOffset; //record last offset 

    public override void Init()
    {
        base.Init();
        this.clearUIObject();
        InitCache();
        margin = (int)rect.height;
        SetMaxOffset((int)windowRect.height);
        scrollBar.Init();
        responseAngle = 0.0f;
        ScrollBarFlash();
        this.ResetActRect();

        scrollAble = true;
        if(LoadingIcon)
            LoadingIcon.SetVisible(false);
    }

    public void ResetActRect()
    {
        if (bindActRectToRect)
        {
            return;
        }
        float horizRatio = Screen.width / 640.0f;
        float vertRatio = Screen.height / 960.0f;
        actRect = new Rect(rect.x * horizRatio, rect.y * vertRatio, rect.width * horizRatio, rect.height * vertRatio);
    }

    public Rect ActRect
    {
        get
        {
            return actRect;
        }
        set
        {
            actRect = new Rect(value);
        }
    }

    public int IntervalSize
    {
        get
        {
            return m_intervalSize;
        }
        set
        {
            m_intervalSize = value;
            this.AutoLayout();
        }
    }

    private float moveCounter;
    private int multiple = 100;
    private float gap = 0.01f;
    private int speed = 6;
    private int stepValue;

    protected void UpdateMove()
    {
        if (!IsTouched())
        {
            if (m_nOffSet > -m_nMaxOffset && m_nMaxOffset != 1)
            {
                moveCounter += Time.deltaTime;
                if (moveCounter > gap)
                {
                    stepValue = (int)(moveCounter * multiple * speed);
                    m_nOffSet -= stepValue;

                    moveCounter = 0;
                }
            }
            else
            {
                m_state = Panel_State.PANEL_IDL;
            }
        }
        else
        {
            m_state = Panel_State.PANEL_IDL;
        }

    }
    public float rotateSpeed=720f;
    protected System.MulticastDelegate m_OnDropDown;
    public Label LoadingIcon;
    private bool IsOnDropDown=false;
    private void DropDown(){

        if(m_OnDropDown!=null&&!IsOnDropDown){
            IsOnDropDown=true;
            if(LoadingIcon)
                LoadingIcon.SetVisible(true);

            if(IsInvoking("DropDownFun")){
                CancelInvoke("DropDownFun");          
            }
            Invoke("DropDownFun",0.5f);
        }
    }
    private void DropDownFun(){
        m_OnDropDown.DynamicInvoke(null);
        if(LoadingIcon)
            LoadingIcon.SetVisible(false);
        if(IsInvoking("FinishDropDown")){
            CancelInvoke("FinishDropDown");          
        }
        Invoke("FinishDropDown",0.5f);
    }   
    private void FinishDropDown(){
        IsOnDropDown=false;
    }
    public override void Update()
    {

        if(LoadingIcon){
            LoadingIcon.transform.Rotate(0, 0, rotateSpeed * Time.deltaTime);
			LoadingIcon.rotateAngle=LoadingIcon.transform.localEulerAngles.z;
        }
        if(IsDebug){
            // Debug.Log("ScrollVoew is Dowm:"+m_bMoveDown+"   state:"+m_state+"   m_nOffSet:"+(-m_nOffSet)+"/"+"m_nMaxOffset");
        }
        if (!scrollAble)
        {
            return;
        }
        if (Application.platform == RuntimePlatform.IPhonePlayer || Application.platform == RuntimePlatform.Android)
        {
            if (Input.touchCount != 1 || (!HoleScreenAct && !actRect.Contains(GetTouchPos())))
            {
                m_bTouch = false;
            }
            else
            {
                Touch touch = Input.touches[0];

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
            if (Input.GetMouseButtonDown(0) && (HoleScreenAct || actRect.Contains(GetTouchPos())))
            {
                m_bTouch = true;
            }
            else if (Input.GetMouseButtonUp(0) || (!HoleScreenAct && !actRect.Contains(GetTouchPos())))
            {
                m_bTouch = false;
            }
        }

        switch (m_state)
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
        }

        float length;
        if (m_nOffSet > 0)
        {
            length = rect.height * rect.height / (windowRect.height);
            length = Mathf.Max(4, length * (rect.height - 2 * m_nOffSet) / (rect.height));
            scrollBar.SetLength(length);
            scrollBar.MoveTo(rect.width - scrollBar.width, 0);
        }
        else if (m_nOffSet < -m_nMaxOffset)
        {
            length = rect.height * rect.height / (windowRect.height);
            length = Mathf.Max(4, length * (rect.height + (m_nOffSet + m_nMaxOffset) * 2) / rect.height);
            scrollBar.SetLength(length);
            scrollBar.MoveTo(rect.width - scrollBar.width, rect.height - scrollBar.GetLength());

        }
        else
        {
            scrollBar.SetLength(rect.height * rect.height / windowRect.height);
            m_nMaxOffset = m_nMaxOffset > 0 ? m_nMaxOffset : 1;
            scrollBar.MoveTo(rect.width - scrollBar.width, (rect.height - scrollBar.GetLength()) * (-m_nOffSet) / m_nMaxOffset);
        }

        UpdateCacheList();
        if (newComponent != null)
        {
            foreach (UIObject obj in newComponent)
            {
                obj.Update();
            }
        }
        scrollBar.UpdateData();
        if(IsDragDown){
            AutoLayout();
            if(m_nOffSet < - m_nMaxOffset){
                MoveToBottom();               
            }
            IsDragDown=false;
        }
    }

    private bool mRunAutoLayout = false;

    public void RunAutoLayoutAfterCache()
    {
        mRunAutoLayout = true;
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

    protected Vector2 GetTouchPos()
    {
        Vector2 pos;
        float y;
        if (Application.platform == RuntimePlatform.IPhonePlayer || Application.platform == RuntimePlatform.Android)
        {
            pos.x = Input.mousePosition.x;
            y = Screen.height - GetTouch().position.y;
            pos.y = y;
            return pos;
        }
        else
        {
            pos.x = Input.mousePosition.x;
            y = Screen.height - Input.mousePosition.y;
            pos.y = y;
            return pos;
        }
    }

    public Rect windowRect;

    void SetMaxOffset(float offset)
    {
		if(offset!= 0&&offset!=m_nMaxOffset){
			currOffset = offset - m_nMaxOffset;
		}
        m_nMaxOffset = offset;
        if (offset == 0)
        {
            m_nMaxOffset = 1;
        }
    }

    public void onNavigatorUp()
    {
    }

    public void onNavigatorDown()
    {
    }

    public override int Draw()
    {
        if (!visible)
        {
            return -1;
        }

        if (m_state != Panel_State.PANEL_IDL && Event.current.type != EventType.Repaint)
        {
            return -1;
        }
        if (!HoleScreenAct && bindActRectToRect)
        {
            this.MakeNeedScreenRectOnce();
        }
        this.prot_calcScreenRect();
        if (!HoleScreenAct && bindActRectToRect)
        {
            actRect = this.ScreenRect;
        }

        var selectedItem = -1;
        if (orientation == ORIENTATION.VERTICAL)
        {
            scrollViewVector.x = windowRect.x;
            scrollViewVector.y = - m_nOffSet + margin;
        }
        else
        {
            scrollViewVector.y = windowRect.y;
            scrollViewVector.x = - m_nOffSet + margin;
        }
        UpdateAbsoluteVector();
        GUI.BeginScrollView(rect, scrollViewVector, windowRect);

        DrawInterface();
        for (int i=0; i<component.Length; i++)
        {
            ListItem lItem = component[i] as ListItem;
            if (lItem != null)
            {
                lItem.SetScrollPos((int)(scrollViewVector.y), (int)(rect.height));
            }
            component[i].Draw();
        }

        if (newComponent != null)
        {
            foreach (UIObject obj in newComponent)
            {
                if (orientation == ORIENTATION.VERTICAL)
                {
                    if (obj.rect.y < scrollViewVector.y - obj.rect.height || obj.rect.y > rect.height + scrollViewVector.y)
                    {
                        continue;
                    }
                }
                else
                {
                    if (obj.rect.x < scrollViewVector.x - obj.rect.width || obj.rect.x > rect.width + scrollViewVector.x)
                    {
                        continue;
                    }
                }
                ListItem listItem = obj as ListItem;
                if (listItem != null)
                {
                    listItem.SetScrollPos((int)(scrollViewVector.y), (int)(rect.height));
                }
                obj.Draw();
            }
        }
        // LoadingIcon.rect.y
        
        GUI.EndScrollView();

        GUI.BeginGroup(rect);
        if (orientation == ORIENTATION.VERTICAL)
        {
            scrollBar.Draw();
        }

        if(LoadingIcon){
            LoadingIcon.rect.y=rect.height-70;
            LoadingIcon.Draw();
        }
        
        GUI.EndGroup();

        return selectedItem;
    }


    public System.MulticastDelegate OnDropDown
    {
        get
        {
            return m_OnDropDown;
        }
        set
        {
            m_OnDropDown = value;
        }
    }
    private bool IsDragDown=false;
    public void DragOnce(){
        IsDragDown=true;
    }

    protected void UpdateDrag()
    {
        if(m_nOffSet < - m_nMaxOffset-15f){
            DropDown();              
        }
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
                else if (m_nOffSet < - m_nMaxOffset)
                {

                    m_nOffSet += fElas * (GetTouchPos().y - m_nLastTouch);
                    if (m_nOffSet > - m_nMaxOffset)
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
                    if (m_nOffSet < - m_nMaxOffset)
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
                else if (m_nOffSet < - m_nMaxOffset)
                {

                    m_nOffSet += fElas * (GetTouchPos().x - m_nLastTouch);
                    if (m_nOffSet > - m_nMaxOffset)
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
                    if (m_nOffSet < - m_nMaxOffset)
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
            {
                m_fSpeed = 1500.0f;
            }
        }
        else
        {
            int releasePos;

            m_bJudge = false;

            if (m_nOffSet > 0)
            {
                m_bMoveDown = false;
                m_bMoveRight = false;
                m_nSlideDest = 0;
                m_state = Panel_State.PANEL_SLIDE;
                m_fAcceloration = s_fAcceloration * 2;//*SCREEN_WIDTH/(m_nOffSet);
                m_fSpeed = Mathf.Min(1500, m_nOffSet * 10);
                m_bJudge = true;
            }
            else if (m_nOffSet < - m_nMaxOffset)
            {
                m_bMoveDown = true;
                m_bMoveRight = true;
                m_nSlideDest = -m_nMaxOffset;
                m_state = Panel_State.PANEL_SLIDE;
                m_fAcceloration = s_fAcceloration * 2;
                m_fSpeed = Mathf.Min(1500, (- m_nOffSet - m_nMaxOffset) * 10);
                m_bJudge = true;
            }
            else
            {
                if (autoArrange)
                {
                    int page;
                    if (m_fSpeed > 200.0)
                    {
                        if ((m_bMoveDown && orientation == ORIENTATION.VERTICAL) || (m_bMoveRight && orientation != ORIENTATION.VERTICAL))
                        {
                            if (orientation == ORIENTATION.VERTICAL)
                            {
                                page = (int)((-m_nOffSet) / rect.height - 1);
                                m_nSlideDest = -page * rect.height;
                            }
                            else
                            {
                                page = (int)((-m_nOffSet) / rect.width - 1);
                                m_nSlideDest = -page * rect.width;
                            }

                            if (m_nSlideDest > 0)
                            {
                                m_nSlideDest = 0;
                            }
                        }
                        else
                        {
                            if (orientation == ORIENTATION.VERTICAL)
                            {
                                page = (int)((-m_nOffSet) / rect.height + 1);
                                m_nSlideDest = -page * rect.height;
                            }
                            else
                            {
                                page = (int)((-m_nOffSet) / rect.width + 1);
                                m_nSlideDest = -page * rect.width;
                            }

                            if (m_nSlideDest < -m_nMaxOffset)
                            {
                                m_nSlideDest = -m_nMaxOffset;
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
                    m_state = Panel_State.PANEL_SLIDE;
                    m_bJudge = true;
                    m_fAcceloration = s_fAcceloration;
                }
                else
                {
                    if (m_fSpeed == 0)
                    {
                        m_state = Panel_State.PANEL_IDL;
                        scrollBar.Hide();
                    }
                    else
                    {
                        m_state = Panel_State.PANEL_SLIDE;
                        if ((m_bMoveDown && orientation == ORIENTATION.VERTICAL) || (m_bMoveRight && orientation != ORIENTATION.VERTICAL))
                        {
                            m_nSlideDest = m_nOffSet + s_slideDist;
                            if (m_nSlideDest > 0)
                            {
                                m_nSlideDest = 0;
                            }
                        }
                        else
                        {
                            m_nSlideDest = m_nOffSet - s_slideDist;
                            if (m_nSlideDest < -m_nMaxOffset)
                            {
                                m_nSlideDest = -m_nMaxOffset;
                            }
                        }
                        if (m_fSpeed >= 1500.0f)
                        {
                            m_fSpeed = 1500.0f;
                        }
                        m_bJudge = false;
                        m_fAcceloration = s_fAcceloration;

                    }
                }
            }
        }
    }

    protected void UpdateSlide()
    {
        if(m_nOffSet < - m_nMaxOffset-15f){
            DropDown();              
        }
        if (m_bTouch && m_nOffSet > -m_nMaxOffset && m_nOffSet < 0)
        {
            m_state = Panel_State.PANEL_IDL;
            return;
        }
        float time = Time.deltaTime;
        if (m_fSpeed - time * m_fAcceloration < 0)
        {
            time = m_fSpeed / m_fAcceloration;
        }

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
                    m_state = Panel_State.PANEL_IDL;
                    scrollBar.Hide();
                }
            }
            else if (m_nOffSet < -m_nMaxOffset)
            {
                m_nOffSet = Mathf.SmoothDamp(m_nOffSet, -m_nMaxOffset, ref xVelocity, smoothTime);

                if (m_nOffSet > -m_nMaxOffset - 2)
                {
                    m_nOffSet = -m_nMaxOffset;
                    m_state = Panel_State.PANEL_IDL;
                    scrollBar.Hide();
                }
            }
            else
            {
                m_nOffSet = Mathf.SmoothDamp(m_nOffSet, m_nSlideDest, ref xVelocity, smoothTime);

                if (Mathf.Abs(m_nSlideDest - m_nOffSet) < 2)
                {
                    m_nOffSet = m_nSlideDest;
                    m_state = Panel_State.PANEL_IDL;
                    scrollBar.Hide();
                }
            }
        }
        m_fSpeed -= m_fAcceloration * Time.deltaTime;
        if ((m_fSpeed <= 0 || m_nOffSet > 100 || m_nOffSet < -m_nMaxOffset - 200) && !m_bJudge)
        {
            if (m_nOffSet > 0)
            {
                m_bMoveDown = false;
                m_bMoveRight = false;
                m_nSlideDest = 0;
                m_state = Panel_State.PANEL_SLIDE;
                m_fAcceloration = s_fAcceloration * 2;//*SCREEN_WIDTH/(m_nOffSet);
                m_fSpeed = Mathf.Min(1500, 10 * m_nOffSet);
            }
            else if (m_nOffSet < - m_nMaxOffset)
            {
                m_bMoveDown = true;
                m_bMoveRight = true;
                m_nSlideDest = -m_nMaxOffset;
                m_state = Panel_State.PANEL_SLIDE;
                m_fAcceloration = s_fAcceloration * 2;
                m_fSpeed = Mathf.Min(1500, 10 * (- m_nOffSet - m_nMaxOffset));
            }
            else
            {
                if (!autoArrange)
                {
                    m_state = Panel_State.PANEL_IDL;
                    scrollBar.Hide();
                }
                else
                {
                    if (((m_bMoveDown && orientation == ORIENTATION.VERTICAL) || (m_bMoveRight && orientation != ORIENTATION.VERTICAL)) && m_nOffSet >= m_nSlideDest)
                    {
                        m_nOffSet = m_nSlideDest;
                        m_state = Panel_State.PANEL_IDL;
                        scrollBar.Hide();
                    }
                    else if ((!m_bMoveDown && !m_bMoveRight) && m_nOffSet <= m_nSlideDest)
                    {
                        m_nOffSet = m_nSlideDest;
                        m_state = Panel_State.PANEL_IDL;
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

    protected void UpdateIdl()
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

          //  Debug.Log("Update m_nStartX idle:" + m_nStartX + " m_nStartY:" + m_nStartY);

            if (orientation == ORIENTATION.VERTICAL)
            {
                m_nLastTouch = GetTouchPos().y;
            }
            else
            {
                m_nLastTouch = GetTouchPos().x;
            }
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

            float nOffsetX = GetTouchPos().x - m_nStartX;
            float nOffsetY = GetTouchPos().y - m_nStartY;
            float angle = Mathf.Atan2(nOffsetY, nOffsetX);
            if (angle < 0)
            {
                angle += Mathf.PI;
            }
            float limit1 = Mathf.PI * responseAngle / 180.0f;
            float limit2 = Mathf.PI * (180.0f - responseAngle) / 180.0f;
            bool bVertical = (angle > limit1 && angle < limit2);
            if (orientation == ORIENTATION.VERTICAL)
            {
                if (nOffsetY > moveThreshold && bVertical)
                {
                    m_state = Panel_State.PANEL_DRAG;
                    m_nOffSet += (GetTouchPos().y - m_nStartY);
                    m_nCursorPos += GetTouchPos().y - m_nStartY;

                    scrollBar.Show();
                    m_bFirstTouch = false;
                    m_bMoveDown = true;
                }
                else if (nOffsetY < -moveThreshold && bVertical)
                {
                    m_state = Panel_State.PANEL_DRAG;
                    m_nOffSet += (GetTouchPos().y - m_nStartY);
                    m_nCursorPos += GetTouchPos().y - m_nStartY;

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
                    m_state = Panel_State.PANEL_DRAG;
                    m_nOffSet += (GetTouchPos().x - m_nStartX);
                    m_nCursorPos += GetTouchPos().x - m_nStartX;

                    scrollBar.Show();
                    m_bFirstTouch = false;
                    m_bMoveRight = true;
                }
                else if (nOffsetX < -moveThreshold)
                {
                    m_state = Panel_State.PANEL_DRAG;
                    m_nOffSet += (GetTouchPos().x - m_nStartX);
                    m_nCursorPos += GetTouchPos().x - m_nStartX;

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
            }
        }
    }

    protected void SetScrollState(Panel_State state)
    {
        if (state == Panel_State.PANEL_IDL)
        {
        }
        m_state = state;
    }

    public void AutoLayoutVertical()
    {
        if (hasMargin)
        {
            margin = rect.height;
        }
        else
        {
            margin = 0;
        }
        windowRect.height = margin;
        for (int i=0; i<component.Length; i++)
        {
            UIObject c = (component[i] as UIObject);
            if (!c.isVisible())
            {
                continue;
            }
            c.rect.y = windowRect.height;
            windowRect.height += (c.rect.height + m_intervalSize);
        }

        if (newComponent != null)
        {
            foreach (UIObject obj in newComponent)
            {
                if (!obj.isVisible())
                {
                    continue;
                }
                obj.rect.y = windowRect.height;
                windowRect.height += (obj.rect.height + m_intervalSize);
            }
        }
		windowRect.height += (margin - m_intervalSize) + windowHeightOffset;
        SetMaxOffset(Mathf.Max(0, windowRect.height - 2 * margin - rect.height));
    }

    public void AutoLayoutHorizontal()
    {
        if (hasMargin)
        {
            margin = rect.width;
        }
        else
        {
            margin = 0;
        }
        windowRect.width = margin;
        for (int i=0; i<component.Length; i++)
        {
            UIObject c = (component[i] as UIObject);
            if (!c.isVisible())
            {
                continue;
            }
            c.rect.x = windowRect.width;
            windowRect.width += (c.rect.width + m_intervalSize);
        }

        if (newComponent != null)
        {
            foreach (UIObject obj in newComponent)
            {
                if (!obj.isVisible())
                {
                    continue;
                }
                obj.rect.x = windowRect.width;
                windowRect.width += (obj.rect.width + m_intervalSize);
            }
        }
        windowRect.width += (margin - m_intervalSize);
        SetMaxOffset(Mathf.Max(0, windowRect.width - 2 * margin - rect.width));
    }

    public override void AutoLayout()
    {
        if (orientation == ORIENTATION.VERTICAL)
        {
            AutoLayoutVertical();
        }
        else
        {
            AutoLayoutHorizontal();
        }
    }

    public void MoveToBottom()
    {
        m_nOffSet = -m_nMaxOffset;
    }

    public void SmoothMoveToBottom()
    {
        if (m_state == Panel_State.PANEL_IDL)
        {
            m_state = Panel_State.PANEL_MOVE;
            moveCounter = 0;
        }
    }

    public void MoveToTop()
    {
        m_nOffSet = 0;
    }

    public float getCurOffSet()
    {
        return m_nOffSet;
    }

    public bool IsMoveDown()
    {
        return m_bMoveDown;
    }

    public void ScrollBarFlash()
    {
        scrollBar.Show();
        scrollBar.Hide();
        cutDownTime = 0;
    }

    protected override void UpdateCacheList()
    {
        base.UpdateCacheList();
        if (mRunAutoLayout)
        {
            AutoLayout();
            mRunAutoLayout = false;
        }
    }

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
        float t = mAbsoluteVector.x;
        mAbsoluteVector.x = t / Screen.width * 640.0f;
        t = mAbsoluteVector.y;
        mAbsoluteVector.y = t / Screen.height * 960.0f;
    }

    private void DrawInterface()
    {
        if (mActivated != null)
        {
            mActivated(this);
        }
    }

	public Vector2 GetScrollViewScale()
	{
		float mScaleX = GetScreenScale().x;
		float mScaleY = GetScreenScale().y;

		if(lockHeightInAspect){
			mScaleX = Mathf.Clamp(mScaleX,0.7f,1.2f);						
		}else{
			mScaleY = Mathf.Clamp(mScaleY,0.7f,1.2f);
		}

		return new Vector2(mScaleX,mScaleY);
	}

	public void SetItemAutoScale(ListItem listItem){
		if(inScreenAspect)
		{
			
			float mScaleX = GetScreenScale().x;
			float mScaleY = GetScreenScale().y;
			listItem.inScreenAspect =true;
			listItem.lockWidthInAspect =lockWidthInAspect;
			listItem.lockHeightInAspect =lockHeightInAspect;
			listItem.useDrawrect=true;
			if(lockHeightInAspect){
				mScaleX = Mathf.Clamp(mScaleX,0.7f,1.2f);
				listItem.rect.width = mScaleX*listItem.DistNormal.x;
				listItem.rect.height  = listItem.DistNormal.y;

			}else{
				mScaleY = Mathf.Clamp(mScaleY,0.7f,1.2f);
				listItem.rect.width = listItem.DistNormal.x;
				listItem.rect.height  = mScaleY*listItem.DistNormal.y;
				if(KBN._Global.isIphoneX()){
					listItem.rect.height *= 1/KBN._Global.GetIphoneXScaleY();
				}
			}

		}
	}

	public bool IsOutScorllView(){

		return m_nMaxOffset != 1 && m_nMaxOffset + m_nOffSet > currOffset;
	}
}

