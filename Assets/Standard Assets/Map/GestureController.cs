using UnityEngine;
using System.Collections;
using GameMain = KBN.GameMain;
using MenuMgr = KBN.MenuMgr;

public class GestureController : MonoBehaviour {
	//int viewportTopEdge;
	//int viewportBottomEdge;


	int scaleThresholdDis;
	float scaleSpeed;
	
	[Space(30),Header("----------GestureController----------")]

	public	Rect viewRect;
	public	const	float MIN_SCALE_FACTOR = 8.0f;
	public	const	float MAX_SCALE_FACTOR = 14f;
	public	const	float MAX_MAX_SCALE_FACTOR = 16f;
	public	const	float MIN_MIN_SCALE_FACTOR = 6.0f;
	
	//private	Vector3 orgScale;
	protected	float curScaleFactor = 12.0f;
	protected	Camera curCamera;
	//private float scaleMinAc = 8.5f;
	//private float scaleMaxAc = 7.0f;
	private bool lastStateIsScale = false;
	
	//one finger	
	private	const	int GESTURE_STATE_NONE = 0;
	private	const	int GESTURE_STATE_MOVE = 1;
	private	const	int GESTURE_STATE_HIT = 2;
	
	//two fingers
	private	const	int GESTURE_STATE_SCALE = 3;
	private	const	int GESTURE_STATE_SCALE_NONE = 4;
	private	int gestureState = GESTURE_STATE_NONE;
	
	//mouse support, add by sc
	private const float mouseClickThreshold = 0.2f;
	private const float mouseDragThreshold = 0.4f;
	private const int MOUSE_STATE_NONE = 0;
	private const int MOUSE_STATE_HIT = 1;
	private const int MOUSE_STATE_MOVE = 2;
	private const int MOUSE_STATE_SCALE = 3;
	private int mouseState = MOUSE_STATE_NONE;
	private Vector3 mouseLastPos;
	private float mouseDownTime;
	[Header("是否可以移动摄像机")]
	public bool isCameraCanMove = true;
	public float zoomDampening = 0.1f;
	private float currentDistance;
	private float desiredDistance = 0.54f;
	public float wheelSpeed = 25.0f;
	
	private	bool oneTouchBegin;
	
	//mouse support, add by sc

#if UNITY_EDITOR
    public static bool MouseSupport = true;
#else
    public static bool MouseSupport = false;
#endif
	
	public	float getCurScaleFactor(){
		return curScaleFactor;
	}
	
	//public	void OnLevelWasLoaded(int level){
	//	
	//	orgScale = transform.localScale;
	//	viewRect = Camera.main.pixelRect;
	//}
	
	protected virtual void Awake(){
		//orgScale = transform.localScale;
	}
	//
	protected virtual void Start(){
		
	}
	
	public Camera getCurCamera()
	{
		return curCamera;	
	}
	
	protected virtual void Update() {
		if( !MenuMgr.instance || !GameMain.singleton ){// restart game and menuMgr.instance has been freed
			return;
		}
		//if display menu, not response
		//	int menuCnt = MenuMgr.getInstance().getStackNum();
		
		if(! MenuMgr.instance.CanTouchMap() ){
			return;
		}

		if(GameMain.singleton.TouchForbidden || GameMain.singleton.ForceTouchForbidden)
		{
			return;
		}


		UpdateCameraPos();



		/*
		 ---------------- Mouse Input -----------------------------------------------------------
		 */

		//mouse support, add by sc
		if (MouseSupport) {
			updateMouseGestureState();
			return;
		}

		/*
		 ---------------- Mobile Input -----------------------------------------------------------
		 */


		if (Input.touches.Length < 2)
		{

			curScaleFactor = Mathf.Clamp(curScaleFactor, MIN_MIN_SCALE_FACTOR, MAX_MAX_SCALE_FACTOR);


			//ProfilerSample.BeginSample("GestureController.Update  checkCameraScale()");
			checkCameraScale();
			//ProfilerSample.EndSample();	
		}
		
		if(Input.touches.Length <= 0 || Input.touches.Length > 2){
			if(gestureState == GESTURE_STATE_SCALE || gestureState ==GESTURE_STATE_SCALE_NONE )
			{
				lastStateIsScale = true;
			}
			GameInput.oldPos1 = Vector2.zero;
			GameInput.oldPos2 = Vector2.zero;
			desiredDistance = curScaleFactor;
			gestureState = GESTURE_STATE_NONE;
			return;
		}
		
		//Vector2 progressAreaTopLeft;
		//if( MenuMgr.getInstance().MainChrom != null ){
		//	progressAreaTopLeft = MenuMgr.getInstance().MainChrom.getProgressAreaTopLeft();
		//}
		
		//check the click area
		//bool g_isDisplayBuff = GameMain.singleton.curSceneLev() != GameMain.WORLD_SCENCE_LEVEL;
		for( var i = 0; i < Input.touches.Length; i ++ ){
			if( !viewRect.Contains( Input.touches[i].position ) || MenuMgr.instance.isHitUI(Input.touches[i].position) /*|| UICamera.hoveredObject != null*/ ) {
				//			_Global.Log("viewRect.Contains:" + viewRect.Contains( Input.touches[i].position )
				//				+ " x:" + Input.touches[i].position.x + " left:" + progressAreaTopLeft.x
				//				 + " y:" + Input.touches[i].position.y + " top:" +  progressAreaTopLeft.y);
//				if(UICamera.hoveredObject != null)
//				{
//					hitNGUI(Input.mousePosition);
//					return;
//				}

				if(gestureState == GESTURE_STATE_NONE){
					return;
				}
				
			}
		}
		
		//更新手势状态
		updateGestureState();

		//根据手势状态结果执行相应的动作
		actionByGesture();

         if(oneTouchBegin){
			 recordTime += Time.deltaTime;
		 }
	}
	
	public void ResetState()
	{
		gestureState = GESTURE_STATE_NONE;
	}
	
	private float smoothSpeed;
	private float smoothTime = 0.1f;
	
	private void checkCameraScale()
	{
		if(gestureState != GESTURE_STATE_NONE)
		{
			return;
		}
		
		if( curScaleFactor > MAX_SCALE_FACTOR )
		{
			curScaleFactor = Mathf.SmoothDamp(curScaleFactor, MAX_SCALE_FACTOR, ref smoothSpeed, smoothTime);
			
			if(curScaleFactor - MAX_SCALE_FACTOR < 0.1f)
			{
				curScaleFactor = MAX_SCALE_FACTOR;
			}
			
		}
		else if(curScaleFactor < MIN_SCALE_FACTOR)
		{
			curScaleFactor = Mathf.SmoothDamp(curScaleFactor, MIN_SCALE_FACTOR, ref smoothSpeed, smoothTime);
			
			if(MIN_SCALE_FACTOR - curScaleFactor < 0.1f)
			{
				curScaleFactor = MIN_SCALE_FACTOR;
			}		
		}
		
		desiredDistance = curScaleFactor;
		
		actScale();
	}
	
	//mouse begin support, add by sc
	private void updateMouseGestureState() {
		if (!MouseSupport)
			return;

		bool mouseDown = Input.GetMouseButtonDown(0);
		bool mouseUp = Input.GetMouseButtonUp(0);
		bool mouseHold = Input.GetMouseButton(0);
		float mouseScroll = Input.GetAxis("Mouse ScrollWheel");
		Touch fakeTouch = new Touch();
			
		if (mouseScroll == 0.0f) {

			curScaleFactor = Mathf.Clamp(curScaleFactor, MIN_MIN_SCALE_FACTOR, MAX_MAX_SCALE_FACTOR);

			checkCameraScale();
		}
			
		if (mouseDown || mouseUp || mouseHold) {
			if( !viewRect.Contains( Input.mousePosition )
				|| MenuMgr.instance.isHitUI(Input.mousePosition) /*|| UICamera.hoveredObject != null*/
				) {
				//			_Global.Log("viewRect.Contains:" + viewRect.Contains( Input.touches[i].position )
				//				+ " x:" + Input.touches[i].position.x + " left:" + progressAreaTopLeft.x
				//				 + " y:" + Input.touches[i].position.y + " top:" +  progressAreaTopLeft.y);
//					if(UICamera.hoveredObject != null)
//					{
//						hitNGUI(Input.mousePosition);
//						return;
//					}

				if(mouseState == MOUSE_STATE_NONE){
					return;
				} else if (mouseState == MOUSE_STATE_MOVE) {
					mouseState = MOUSE_STATE_NONE;
					onMoveEnd(fakeTouch);
					return;
				}
					
			}
		}
			
		if (mouseDown) {
			mouseDownTime = Time.realtimeSinceStartup;
			mouseLastPos = Input.mousePosition;
		}
			
		switch (mouseState) {
			case MOUSE_STATE_NONE:
				if (mouseDown) {
					// TODO begin touch event for sub-class
					//fakeTouch.phase = TouchPhase.Began;
					onTouchBegin(mouseLastPos);
				}
				
				if (mouseUp && Time.realtimeSinceStartup - mouseDownTime < mouseClickThreshold) {
					mouseState = MOUSE_STATE_HIT;
				} else if (mouseHold && (Input.mousePosition - mouseLastPos).magnitude > mouseDragThreshold) {
					mouseState = MOUSE_STATE_MOVE;
					// TODO begin move event for sub-class
					//fakeTouch.phase = TouchPhase.Moved;
					onMoveBegin(fakeTouch);
				} else if (mouseScroll != 0.0f) {
					mouseState = MOUSE_STATE_SCALE;
					onScaleBegin(fakeTouch, fakeTouch);
				}
				
				break;
			case MOUSE_STATE_HIT:
				hit(mouseLastPos);
				mouseState = MOUSE_STATE_NONE;
				
				break;
			case MOUSE_STATE_MOVE:
				if (mouseUp || !mouseHold) {
					mouseState = MOUSE_STATE_NONE;
					// TODO end move event for sub-class
					//fakeTouch.phase = TouchPhase.Ended;
					onMoveEnd(fakeTouch);
				} else {
					move(getInputMoveWorldDis());
					mouseLastPos = Input.mousePosition;
				}
				
				break;
			case MOUSE_STATE_SCALE:
				if (mouseScroll == 0.0f)
					mouseState = MOUSE_STATE_NONE;
				else
					scale();
				
				break;
			}

	}


	//end
	private float recordTime;
	private	void updateGestureState(){
		
		if( Input.touchCount == 1 ){
			Touch touch = Input.touches[0];

			if( touch.phase == TouchPhase.Began ){
				oneTouchBegin = true;
				recordTime = 0;
			}


			switch(gestureState){

			case GESTURE_STATE_NONE:
				if( touch.phase == TouchPhase.Began ){

					onTouchBegin(touch.position);
				}else if( touch.phase == TouchPhase.Moved )
				{

					if(Application.platform == RuntimePlatform.Android)
					{
						int androidFrame = KBN._Global.GetAndroidFrame();
						if(androidFrame == Constant.AndroidFrame.LowFrame)
						{
							if(touch.deltaPosition.magnitude > Constant.AndroidFrame.TouchDeltaPositionMagnitudeThreshold_LowFrame)
							{
								onMoveBegin(touch);
								gestureState = GESTURE_STATE_MOVE;
							}
						}
						else if(androidFrame == Constant.AndroidFrame.MediumFrame)
						{
                            if(touch.deltaPosition.magnitude > Constant.AndroidFrame.TouchDeltaPositionMagnitudeThreshold_MediumFrame)
							{
								onMoveBegin(touch);
								gestureState = GESTURE_STATE_MOVE;
							}
						}
						else
						{
							if(recordTime > 0.06f && touch.deltaPosition.magnitude > Constant.AndroidFrame.TouchDeltaPositionMagnitudeThreshold_HighFrame)
							{
								onMoveBegin(touch);
								gestureState = GESTURE_STATE_MOVE;
							}
						}
					}
					else
					{
						if(touch.deltaPosition.magnitude > 0.1f)
						{
							onMoveBegin(touch);
							gestureState = GESTURE_STATE_MOVE;
						}
					}					
				}else if( touch.phase == TouchPhase.Ended && oneTouchBegin ){

					gestureState = GESTURE_STATE_HIT;
				}
				break;
				
			case GESTURE_STATE_MOVE:
				if( touch.phase == TouchPhase.Ended ||
				   touch.phase == TouchPhase.Canceled ){
					//Debug.Log("touch.Canceled");
					onMoveEnd(touch);
					//				int curX = Input.touches[0].position.x;
					//				int curY = Input.touches[0].position.y;
					//				int orgX = curX - Input.touches[0].deltaPosition.x;
					//				int orgY = curY - Input.touches[0].deltaPosition.y;
					//				_Global.Log("end move dis x:" + (curX - orgX) + " disy:" + (curY - orgY)  + " deltaTime:" + Time.deltaTime);
					
					gestureState = GESTURE_STATE_NONE;
				}
				break;
				
				//GESTURE_STATE_HIT update after hit() function	
				//		case	GESTURE_STATE_HIT:
				//			break;
				
			case GESTURE_STATE_SCALE://up one touche
			case GESTURE_STATE_SCALE_NONE:
				gestureState = GESTURE_STATE_NONE;
				break;
			}
			
			if( touch.phase == TouchPhase.Ended ||
			   touch.phase == TouchPhase.Canceled ){
				//Debug.Log("TouchCancel");
				oneTouchBegin = false;
			}
			
		}else if( Input.touchCount == 2 ){
			
			if( gestureState != GESTURE_STATE_SCALE && gestureState != GESTURE_STATE_SCALE_NONE){
				onScaleBegin(Input.GetTouch(0), Input.GetTouch(1));
			}
			
			if( Input.GetTouch(0).phase != TouchPhase.Moved &&
			   Input.GetTouch(1).phase != TouchPhase.Moved ){
				gestureState = GESTURE_STATE_SCALE_NONE;
			}else{
				//			
				gestureState = GESTURE_STATE_SCALE;
			}
		}
	}
	
	private	void actionByGesture() {

		switch (gestureState) {
			case GESTURE_STATE_NONE:
				break;
			case GESTURE_STATE_MOVE:
				move(getInputMoveWorldDis());
				break;

			case GESTURE_STATE_HIT:

				hit(Input.touches[0].position);
				gestureState = GESTURE_STATE_NONE;//update gestureState
				break;

			case GESTURE_STATE_SCALE_NONE:

				//curScaleFactor = Mathf.Lerp(curScaleFactor, desiredDistance, Time.deltaTime * zoomDampening);
				//actScale();
				break;
			case GESTURE_STATE_SCALE:

				scale();
				break;
		}
	}

	public virtual void hitNGUI(Vector2 position){

	}
	
	public virtual void hit(Vector2 position){
        //	Touch touch = Input.touches[0];
        //	if( touch.phase == TouchPhase.Ended){

        /*判断点击的是否是UI*/
        if (!viewRect.Contains(position) || MenuMgr.instance.isHitUI(position))
        {
            return;
        }

        Ray ray = curCamera.ScreenPointToRay(position);
		RaycastHit raycastHit;
		if( Physics.Raycast(ray,out raycastHit) ){
			hitSlot(raycastHit);
		}
		//	}
	}
	
	protected virtual void scale(){
		
		//mouse support, add by sc
		float k = 0.01f;
		if (MouseSupport) k = 1.0f;
		
		float result = k * GameInput.GetAxis("Mouse ScrollWheel");
		desiredDistance -= result * wheelSpeed * Time.deltaTime * Mathf.Abs(desiredDistance);
		desiredDistance = Mathf.Clamp(desiredDistance, MIN_MIN_SCALE_FACTOR, MAX_MAX_SCALE_FACTOR);
		if(Mathf.Abs(desiredDistance - curScaleFactor) > 0.05)
		{
			curScaleFactor = Mathf.Lerp(curScaleFactor, desiredDistance, Time.deltaTime * zoomDampening);
			actScale();
		}
		
	}
	
	protected virtual void actScale()
	{
		if(gameObject.name == "MovePlane" || gameObject.name == "CampaignMap" || gameObject.name == "ChapterMap" || gameObject.name == "MistExpeditionMap")
		{
			return;
		}


		curScaleFactor = Mathf.Clamp(curScaleFactor, MIN_MIN_SCALE_FACTOR, MAX_MAX_SCALE_FACTOR);


		curCamera.orthographicSize = curScaleFactor;
		Vector3 mapTrans = edgeCheck(Vector3.zero);
		
		if( mapTrans.magnitude > 0 )
		{
			transform.Translate(mapTrans, Space.World);
		}
	}
	
	
	protected Vector3 getMoveWorldDis(int fromScreenX, int fromScreenY, int toScreenX, int toScreenY) {
		//camera projection is orthographic
		Vector3 ret = Vector3.one;
		if(GameMain.singleton.curSceneLev() == GameMain.AVA_MINIMAP_LEVEL || GameMain.singleton.curSceneLev() == GameMain.WORLD_SCENCE_LEVEL)
		{
			curCamera.orthographic = true;
			ret = curCamera.ScreenToWorldPoint( new Vector3(toScreenX, toScreenY, 1 ) ) -
							curCamera.ScreenToWorldPoint( new Vector3(fromScreenX, fromScreenY, 1 ) );
			curCamera.orthographic = false;
		}
		else
		{
			ret = curCamera.ScreenToWorldPoint( new Vector3(toScreenX, toScreenY, 1 ) ) -
							curCamera.ScreenToWorldPoint( new Vector3(fromScreenX, fromScreenY, 1 ) );
		}
		
		ret.y = 0;
		return ret;
	}

	protected Vector3 getMoveWorldDis( float fromScreenX, float fromScreenY, float fromZ,
	                                  float toScreenX, float toScreenY, float toZ ) {

		Vector3 to = Vector3.one;
		Vector3 from = Vector3.one;
		if(GameMain.singleton.curSceneLev() == GameMain.AVA_MINIMAP_LEVEL || GameMain.singleton.curSceneLev() == GameMain.WORLD_SCENCE_LEVEL)
		{
			curCamera.orthographic = true;
			to = curCamera.ScreenToWorldPoint( new Vector3(toScreenX, toScreenY, toZ ) );
			from = curCamera.ScreenToWorldPoint( new Vector3(fromScreenX, fromScreenY, fromZ ) );
			curCamera.orthographic = false;
		}
		else
		{
			to = curCamera.ScreenToWorldPoint( new Vector3(toScreenX, toScreenY, toZ ) );
			from = curCamera.ScreenToWorldPoint( new Vector3(fromScreenX, fromScreenY, fromZ ) );
		}
		Vector3 ret = to - from;
		return ret;
	}

	protected Vector3 getInputMoveWorldDis(){
		//mouse support, add by sc
		if (MouseSupport) {
			int curMouseX = (int)Input.mousePosition.x;
			int curMouseY = (int)Input.mousePosition.y;
			int orgMouseX = (int)mouseLastPos.x;
			int orgMouseY = (int)mouseLastPos.y;
			return getMoveWorldDis( orgMouseX, orgMouseY, curMouseX, curMouseY );
		}
		
		int curX = (int)Input.touches[0].position.x;
		int curY = (int)Input.touches[0].position.y;
		int orgX = curX - (int)Input.touches[0].deltaPosition.x;
		int orgY = curY - (int)Input.touches[0].deltaPosition.y;
		
		return getMoveWorldDis( orgX, orgY, curX, curY );
	}

	protected Vector3 getCurInputMovePos()
	{
		if (MouseSupport) 
		{
			return mouseLastPos;
		}
		
		return Input.touches[0].position;
	}
	
	protected virtual void onMoveBegin(Touch touch){
	}
	
	protected virtual void move(Vector3 trans){
		
	}
	
	protected virtual void onMoveEnd(Touch touch){
	}

	public virtual void toBack() { }

	protected bool isNeedMove = false;
	protected float targetValue = 0f;
	public float SMOOTH_TIME = 0.15f;
	protected float speed = 0f;
	
	private void UpdateCameraPos()
	{
		if(!isNeedMove)
		{
			return;
		}
		
		float posX = curCamera.transform.localPosition.x;
		if(Mathf.Abs(posX - targetValue) < 0.01f)
		{
			curCamera.transform.localPosition = new Vector3( targetValue, curCamera.transform.localPosition.y, curCamera.transform.localPosition.z);
			isNeedMove = false;
			onUpdateCameraPosEnd();
			return;
		}
		
		float pos = Mathf.SmoothDamp(curCamera.transform.localPosition.x, targetValue, ref speed, SMOOTH_TIME);	
		curCamera.transform.localPosition = new Vector3( pos, curCamera.transform.localPosition.y, curCamera.transform.localPosition.z);
	}

	protected virtual void onUpdateCameraPosEnd()
	{

	}
	
	protected virtual void onScaleBegin(Touch touch0, Touch touch1){
	}
	
//	protected virtual void onTouchBegin(Touch touch){
//	}
	// TODO changed Touch to Vector2, consider change other event function

	public virtual void onTouchBegin(Vector2 touchPos) {

	}
	
	//check screen edge top, bottom, left and right
	protected virtual Vector3 edgeCheck(Vector3 trans){
		return trans;
	}
	
	public virtual void hitSlot(RaycastHit raycastHit){
	}
	
	protected void setGameObjectVisibleRecursively( GameObject obj, bool visible ){
		if( obj == null ) return;
		
		Component[] rs;
		rs = obj.GetComponentsInChildren<Renderer>();
		foreach( Component r in rs ){
			r.GetComponent<Renderer>().enabled = visible;
		}
	}

	protected int getMoveMapAddSpeed()
	{
		if(PlayerPrefs.HasKey(Constant.Map.MOVE_ADD_SPEED_KEY))
		{
			int addSpeed = PlayerPrefs.GetInt(Constant.Map.MOVE_ADD_SPEED_KEY);
			return addSpeed;
		}
		else
		{
			return Constant.Map.MOVE_ADD_SPEED_MIN;
		}
	}
}
