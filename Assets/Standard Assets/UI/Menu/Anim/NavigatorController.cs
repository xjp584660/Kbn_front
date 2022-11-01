
public class NavigatorController
{
	protected int _state;
	//protected Array _stack = [];
	protected System.Collections.Generic.List<UIObject> _stack = new System.Collections.Generic.List<UIObject>();
	protected TransHorMove trans = new TransHorMove();
	
	protected UIObject prevUI;
	protected UIObject nextUI;
	
	public System.Action<NavigatorController, UIObject> popedFunc;
	public System.Action<NavigatorController, UIObject> pushedFunc;
	public System.Action pushFunc;

	public bool soundOn = true;

	public void Init()
	{
		_state = Constant.State.Normal;
	}
	
/*	public function get topUI():UIObject
	{
		return nextUI;
	}*/
	
	public bool isNormaState
	{
		get
		{
			return _state == Constant.State.Normal;
		}
	}

	public void push(UIObject ui)
	{	
		if(nextUI == ui || _state != Constant.State.Normal)	// duplicate not allowed. 
			return;
		
		if ( pushFunc != null )
			pushFunc();

		nextUI = ui;
		if(_stack.Count == 0)
		{
			_stack.Add(ui);
			nextUI.SetVisible(true);
		}
		else
		{
			prevUI = _stack[_stack.Count -1];
			_stack.Add(ui);
			trans.StartTrans(prevUI, nextUI);
			_state = Constant.State.Push;	
			nextUI.SetVisible(false);
//			u_FixedUpdate();		
			if(soundOn)
				SoundMgr.instance().PlayEffect( "modal_open", /*TextureType.AUDIO*/"Audio/" );
			InputText.closeActiveInput();
		}
//		nextUI.SetVisible(true);
	}
	/**
		ui0, ..... ui ......uin;
		while offset equals 0, remove from ui and all behind.
	*/
	public void switchRootUI(UIObject ui)
	{
        if (_stack.Count <= 0)
        {
            _stack.Add(ui);
        }
        else
        {
		    _stack[0] = ui;
        }
		
		if (_stack.Count == 1)
		{
			nextUI = ui;
			InputText.closeActiveInput();
		}
	}
	
	public int uiNumbers
	{
		get
		{
			if ( _stack != null )
				return _stack.Count;
			return 0;
		}
	}
	public UIObject getUIAtIndex(int index)
	{
		if(index < 0)
			index = index + this.uiNumbers;	
		if(index >= 0 && index < uiNumbers)
			return _stack[index] as UIObject;
		return null;
	}
	
	public UIObject topUI
	{
		get
		{
			return nextUI;
		}
	}
	public void pop(UIObject ui)
	{
		if(nextUI == ui)
			pop();
	}
	public void pop2UI(UIObject ui)
	{
		if(nextUI != ui)
			pop();
	}
	
	public void pop()
	{
		if(_stack.Count > 1 && _state == Constant.State.Normal )
		{
			prevUI = _stack[_stack.Count-1];
			_stack.RemoveAt(_stack.Count-1);

			nextUI = _stack[_stack.Count-1];			
			trans.StartTrans(prevUI,nextUI);
			_state = Constant.State.Pop;
			nextUI.SetVisible(false);
			InputText.closeActiveInput();
		}	
	}
	
	public void pop2Root()
	{
		prevUI = null;
		while(_stack.Count > 1)
		{
			_stack.RemoveAt(_stack.Count-1);			
		}
		if(_stack.Count > 0)
		{
			nextUI = _stack[0];
			nextUI.SetVisible(true);
			InputText.closeActiveInput();
		}
		
		_state = Constant.State.Normal;
	}
	
	public void pop3Root()
	{
		if(_state != Constant.State.Normal)
		{
			if(_state == Constant.State.Push)
			{
				trans.instantFinishTrans(true);
			}
			else if(_state == Constant.State.Pop)
			{
				trans.instantFinishTrans(false);
			}
		}
		
		pop2Root();
	}
	
	public void clear()
	{
		_stack = new System.Collections.Generic.List<UIObject>();
		prevUI = null;
		nextUI = null;
		_state = Constant.State.Normal;
	}
	
	public void DrawItems()
	{		
		if(!this.isNormaState)
		{
			if(prevUI != null)
				prevUI.Draw();
		}		
		
		if(nextUI != null)
		{
			nextUI.Draw();
		}
	}
	
	public void u_Update()
	{
		if(this.isNormaState && nextUI)
		{
			nextUI.Update();		
		}		
	}
	
	public void u_FixedUpdate()
	{
	
//		base.FixedUpdate();
		if(this.isNormaState && nextUI)
		{
			nextUI.FixedUpdate();		
		}
		
		if(_state == Constant.State.Push)
		{
			nextUI.SetVisible(true);
			trans.FadeinUpdate();
			if(trans.IsFin())
			{
				_state = Constant.State.Normal;
				if(null != pushedFunc)
					pushedFunc(this, prevUI);
				//RallyMarchInfo rallyMarchInfo = nextUI as RallyMarchInfo;
				//if ( rallyMarchInfo != null )
				//	rallyMarchInfo.didShowed();
			}
		}
		else if(_state == Constant.State.Pop)
		{
			nextUI.SetVisible(true);
			trans.FadeoutUpdate();
			if(trans.IsFin())
			{
				_state = Constant.State.Normal;
				if(null != popedFunc)
					popedFunc(this, prevUI);				
			}
		}
	}
	
	//public function get NCStack():Array
	//{
	//	return _stack;
	//}
}
