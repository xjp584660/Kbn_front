// Converted from UnityScript to C# at http://www.M2H.nl/files/js_to_c.php - by Mike Hergaarden
// Do test the code! You usually need to change a few small bits.

using UnityEngine;
using System.Collections;
using KBN;
using System;

public class InputText : SimpleUIObj
{
	// tzhou
	static float SKIP_TIME = 0.4f;
	private static int SID = 1;
	protected int inputId;
	protected bool innerClicked = false;


	/// <summary>
    ///键盘 只要任何键盘在屏幕上完全可见，就返回 true ，这个值是 系统函数返回的键盘显示状态
    /// </summary>
	protected bool TouchScreenKeyboard_visible = false;

	/// <summary>
	/// 键盘 指定输入过程是否已完成
	/// </summary>
	protected bool keyboard_done = false;


	/////////// end 	

	public static int DT_DONE = 1;
	public static int DT_HIDE = 2;
	public static int DT_FOCUSOUT = 3;

	protected static SimpleUIObj activeTarget;
	protected static TouchScreenKeyboard keyboard;


	[UnityEngine.Space(30), UnityEngine.Header("----------InputText----------")]

	public UnityEngine.TouchScreenKeyboardType type = UnityEngine.TouchScreenKeyboardType.Default;
	public UnityEngine.Texture image;


	protected string lastStr = "";
	protected string kStr;

	public int maxChar = 999;
	[HideInInspector]
	public bool hidInput = true;
	public Func<string, string, string> filterInputFunc; // as string func(oldStr,string newStr);
	public Func<string, string> inputDoneFunc; // func(string str):string;

	public Action startInput;
	public Action<string> endInput;

	public bool AutoChangeStatus = true;

	private bool isReadEnd = false;

	protected bool done;


	public Action handleTextClicked;
	protected bool lastVisible = false;

	protected string activeBackground = "Textures/UI/decoration/type_box2";
	protected string normalBackground = "Textures/UI/decoration/type_box";

	//输入框正常状态背景  不设置,默认是type_box背景
	[HideInInspector] public Texture2D nomalBackground;
	//输入框点击状态背景  不设置,默认是type_box2背景
	[HideInInspector] public Texture2D clickBackground;






	public override void Init()
	{
		isReadEnd = false;
		AutoChangeStatus = true;
		this.inputId = SID++;

		//if (RuntimePlatform.Android == Application.platform)
		//	hidInput = false;

		InitBackground();

		KBHook.getInstance();

	}

	public void setReadEndEnable(bool _enable)
	{
		isReadEnd = _enable;
	}

	public void SetTouchEnable()
	{

	}



    public override int Draw()
	{
		if (!visible || disabled && Event.current.type != EventType.Repaint)
			return 0;


		SetFont();
		SetNormalTxtColor();


		TouchScreenKeyboard_visible = KBHook.getInstance().isKeyBoardVisible();
		keyboard_done = KBHook.getInstance().isKeyBoardDone();

		if (GUI.Button(rect, new GUIContent(txt, image, tips), mystyle) && !KBHook.IsForbidInput())
		{



			/* 当再次将键盘唤出时，将键盘中的输入框内容清空，防止其内容会被复制到当前点击的UI输入中 */
			if (!TouchScreenKeyboard_visible) {
				clearKeyboardTxt();
			}


			innerClicked = true;
			if (TouchScreenKeyboard_visible)
			{
				KBHook.getInstance().setKeyBoard(null);

				if (AutoChangeStatus && activeTarget == this){
					mystyle.normal.background = nomalBackground;
				}
			}
			else
			{
				inner_Click(true);
			}

		}
		else {
			innerClicked = false;
		}





		if (activeTarget != this) {
			//键盘已经不可见，并且不是当前 input 目标（例如：点击了除input以外的空白区域），则修改当前input 的显示状态，并且输入置空，为下次输入对象作准备
			if (!TouchScreenKeyboard_visible && activeTarget == null) {
				if (AutoChangeStatus)
					mystyle.normal.background = nomalBackground;
				KBHook.getInstance().setKeyBoard(null);

			}

			return 0;
		}

		if (keyboard != null && TouchScreenKeyboard_visible && activeTarget == this)
		{
			kStr = keyboard.text;
			if (kStr != lastStr)
			{
				lastStr = filterInput(kStr);
				if (keyboard.text != lastStr)
				{
					keyboard.text = lastStr;
				}
			}
			txt = lastStr;
			done = false;
			lastVisible = true;
			if (Event.current.type == EventType.Repaint)
			{
				if (isReadEnd)
				{
					var curTextSize = mystyle.CalcSize(new GUIContent(txt));
					if (curTextSize.x <= rect.width)
					{
						mystyle.alignment = TextAnchor.MiddleLeft;
					}
					else
					{
						mystyle.alignment = TextAnchor.MiddleRight;
					}
				}
			}

		}

		//--- for editor
#if UNITY_EDITOR
		if (Event.current.type == EventType.KeyDown && activeTarget == this)
		{
			SetInputForEditor();
		}
#endif

		if (innerClicked)
		{
			keyboard_done = false;

			/* 解决快速点击时，软键盘无法及时相应 */
			if (this == activeTarget && keyboard!= null && !KBHook.getInstance().isKeyBoardEuqals(keyboard)) {
				KBHook.getInstance().setKeyBoard(keyboard);
			}


		}
		else
		{
			if (!TouchScreenKeyboard_visible && activeTarget == this && lastVisible && !done)
			{
				this.finishInput(DT_HIDE);
				closeActiveInput();
				return -1;
			}

#if UNITY_ANDROID
			if (activeTarget == this && keyboard != null && keyboard_done && !done) {
				finishInput(DT_DONE);
			}
#endif
			
		}
		return -1;
	}






	private void InitBackground()
	{
		if (nomalBackground == null)
		{
			nomalBackground = TextureMgr.instance().LoadTexture("type_box", TextureType.DECORATION);
		}

		if (clickBackground == null)
		{
			clickBackground = TextureMgr.instance().LoadTexture("type_box2", TextureType.DECORATION);
		}
	}

	public void setDone()
	{
		finishInput(DT_HIDE);
	}

	public void clearKeyboardTxt()
	{
		if (keyboard != null)
		{
			keyboard.text = "";
		}
	}


	protected virtual void finishInput(int type)
	{
		lastVisible = false;
		done = true;

		if (AutoChangeStatus)
			mystyle.normal.background = nomalBackground;

		activeTarget = null;


		keyboard = null;

		txt = lastStr = inputDone(lastStr);

		if (endInput != null)
			endInput.Invoke(txt);
		
	}




	public void setKeyboardTxt(string _str)
	{
		if (keyboard != null && this == activeTarget)
		{
			keyboard.text = _str;
		}
	}

	protected string filterInput(string str)
	{
		if (str == null)
		{
			return "";
		}

		if (str.Length > maxChar)
			str = str.Substring(0, maxChar);

		if (filterInputFunc != null)
		{
			str = filterInputFunc.Invoke(txt, str);
			str = str != null ? str : "";
			if (str.Length > maxChar)
				str = str.Substring(0, maxChar);
		}
		return str;
	}



	protected string inputDone(string str)
	{
		if (inputDoneFunc != null)
			return inputDoneFunc.Invoke(str);
		return str;
	}



	public void openKeyboard(bool _isKeyboardOnly)
	{
		inner_Click(!_isKeyboardOnly);
	}

	protected bool isMultiLine = false;

	public void setKeyboardMultiLine()
	{
		isMultiLine = true;
	}

	protected virtual void inner_Click(bool _bool)
	{
		if (this == activeTarget)
			return;


		if (AutoChangeStatus)
			mystyle.normal.background = clickBackground;


		if (startInput != null)
			startInput.Invoke();


		if (activeTarget != this && (activeTarget as InputText) != null)
		{
			//if (Application.platform == RuntimePlatform.IPhonePlayer)
			//{
			//	if (keyboard != null)
			//		keyboard.active = false;
			//}
			(activeTarget as InputText).finishInput(DT_FOCUSOUT);
		}


		if (keyboard == null || !keyboard.active || activeTarget != this)
		{
			txt = filterInput(txt);
			TouchScreenKeyboard.hideInput = hidInput;
			if (type == TouchScreenKeyboardType.NumberPad)
			{
				TouchScreenKeyboard.hideInput = false;
			}


			keyboard = TouchScreenKeyboardOpen(txt, type, true, isMultiLine);

			KBHook.getInstance().setKeyBoard(keyboard);

			if (keyboard != null)
			{
				keyboard.text = txt;
			}

			if (handleTextClicked != null && _bool)
			{
				handleTextClicked.Invoke();
			}
		}
		else
		{
			keyboard.text = filterInput(txt);
		}


		activeTarget = this;

		//if (RuntimePlatform.Android == Application.platform)
		//	hidInput = false;

	}

	/// <summary>
	///   <para>Opens the native keyboard provided by OS on the screen.</para>
	/// </summary>
	/// <param name="text">Text to edit.</param>
	/// <param name="keyboardType">Type of keyboard (eg, any text, numbers only, etc).</param>
	/// <param name="autocorrection">Is autocorrection applied?</param>
	/// <param name="multiline">Can more than one line of text be entered?</param>
	protected virtual TouchScreenKeyboard TouchScreenKeyboardOpen(string text, TouchScreenKeyboardType keyboardType, bool autocorrection, bool multiline)
	{
		return TouchScreenKeyboard.Open(text, keyboardType, autocorrection, multiline);
	}




	public static InputText GetActiveTarget()
	{
		return (activeTarget as InputText);
	}


	void Insert(string str)
	{
		txt = txt + str;
		lastStr = txt;
		txt = filterInput(txt);
	}


	void DoBackspace()
	{
		if (txt.Length > 0)
		{
			txt = txt.Substring(0, txt.Length - 1);
			lastStr = txt;
		}
	}



	private void SetInputForEditor()
	{
		if (Event.current.character.ToString() == Input.inputString)
		{
			string ime = Input.compositionString;
			if (String.IsNullOrEmpty(ime) && !String.IsNullOrEmpty(Input.inputString))
			{
				string s = Input.inputString;

				// for (int i = 0; i < s.Length; ++i)
				// {
				// 	char ch = s[i];
				// 	// OSX inserts these characters for arrow keys
				// 	if (ch.ToString() == "\uF700") continue;
				// 	if (ch.ToString() == "\uF701") continue;
				// 	if (ch.ToString() == "\uF702") continue;
				// 	if (ch.ToString() == "\uF703") continue;
				// 	// if (ch.ToString() == "b")
				// 	Insert(ch.ToString());
				// }
				Insert(s);
			}
		}
		else if (Event.current.isKey && Event.current.keyCode == KeyCode.Backspace)
		{
			DoBackspace();
		}
	}


	public static TouchScreenKeyboard getKeyBoard()
	{
		return keyboard;
	}


	public static void closeActiveInput()
	{
		if (InputText.getKeyBoard() != null)
			InputText.getKeyBoard().active = false;
		KBHook.getInstance().setKeyBoard(null);
	}

	public int GetTxtHeight()
	{
		FontMgr.SetStyleFont(mystyle, font,FontType.BEGIN);
		return (int)mystyle.CalcHeight(new GUIContent(txt, null, null), rect.width);
	}



	public static string FilterInputForNumber(string oldStr, string newStr)
	{
		string input = _Global.FilterStringToNumberStr(newStr);
		long count = 0;

		if (!string.IsNullOrEmpty(input))
			count = _Global.INT64(input);


		count = count < 0 ? 0 : count;
		return count == 0 ? string.Empty : count.ToString();
	}




	public string LastStr
	{
		set { lastStr = value; }
		get { return lastStr; }
	}
}
