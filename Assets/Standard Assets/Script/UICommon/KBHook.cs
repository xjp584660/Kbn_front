using UnityEngine;
using System;
public class KBHook : MonoBehaviour
{
	private static KBHook _instance;
	public static KBHook getInstance()
	{
		if(_instance == null)
		{
			GameObject obj = new GameObject();
			obj.name = "INPUT_TEXT_KEYBOARD_HOOK";
			_instance = obj.AddComponent<KBHook>();
		}
		return _instance;
	}	
	
	public bool isKeyBoardVisible()
	{
		return this._isKBVisible;
	}
	public bool isKeyBoardDone()
	{
		return this._isKBDone;
	}


	public bool isKeyBoardEuqals(TouchScreenKeyboard kb)
	{
		return this.keyboard == kb;
	}


	public void setKeyBoard(TouchScreenKeyboard kb)
	{
		if(keyboard != null && keyboard.active) 
		{
			keyboard.active = false;
		}
		this.keyboard = kb;
	}


	
	protected bool _isKBVisible = false;
	protected bool _isKBDone = false;
	protected TouchScreenKeyboard keyboard;

	//控制 _isKBVisible 变更的频率
	private bool isKBVisibleFlag = false;
	private float timer;

	//这个时间是 ios 端 的键盘动画的大致时间
	private const float BE_CLICK_TIME = 0.8f;

	//是否禁止输入操作
	private static bool _IsForbidInput = false;
	/// <summary>
	/// 是否禁止输入操作(在手机上的虚拟键盘进行缓动动画时，禁止输入)
	/// </summary>
	/// <returns></returns>
	public static bool IsForbidInput() {
		return _IsForbidInput;
	}


	void Start()
	{
		DontDestroyOnLoad(this);

		_isKBVisible = isKBVisibleFlag = TouchScreenKeyboard.visible;
		_IsForbidInput = false;
		timer = 0f;
	}



	void Update()
	{
		isKBVisibleFlag = TouchScreenKeyboard.visible;

		if (isKBVisibleFlag != _isKBVisible && timer <= 0) {
			_isKBVisible = isKBVisibleFlag;
			timer = BE_CLICK_TIME;
			_IsForbidInput = true;

		} else if(timer > 0) {
			timer -= Time.deltaTime;

			if(timer <= 0)
				_IsForbidInput = false;

		}

		/*
		if(keyboard != null)
		{
			if(keyboard.done != _isKBDone)
			{
				_isKBDone = keyboard.done;
				Debug.Log("============Update  kbDone Changed : " + _isKBDone);	
			}
		}
		*/
		_isKBDone = ( keyboard != null && keyboard.done);		// not used.
		//_isKBDone = ( keyboard != null && keyboard.status == TouchScreenKeyboard.Status.Done);	// not used.
		//GameMainCS.GameMainInstance.Log("ios13+++++++++++++keyboard.status "+keyboard.status +"+++++"+TouchScreenKeyboard.Status.Done);
	}
	public bool CompareToString(string V)
	{
		Version v1 = new Version("13.0");	
		Version v2 = new Version(V);
		switch(v1.CompareTo(v2))
		{
			case 0:
			case -1:
					return true;
			case 1:
			default :
					return false;
			
		}

	}
	
}
///////////////////////////////////
