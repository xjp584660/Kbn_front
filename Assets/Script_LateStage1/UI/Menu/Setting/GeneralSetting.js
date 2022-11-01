public class GeneralSetting extends ListItem
{
	public var l_bg	:Label;
	public var item1 : SoundItem;
	public var item2 : SoundItem;
	public var l_bgMap	: Label;
	public var l_des : Label;
	public  var speedInput : InputText;
	public var slider : Slider;
    public var  btnSave : Button;
    public var lowToggle : ToggleButton;
    public var mediumToggle : ToggleButton;
    public var highToggle : ToggleButton;
    public var lowLabel : Label;
    public var mediumLabel : Label;
    public var highLabel : Label;
    public var l_frameBg : Label;
    public var frameTitle : Label;
	public var frameDes : Label;
	public var frameline1:SimpleLabel;
	public var frameline2:SimpleLabel;
	public var frameline3:SimpleLabel;
	protected var btn_group:RadioGroup = new RadioGroup();




	
	function Init()
	{
		super.Init();		
							
		item1.l_text.txt = Datas.getArString("Settings.Music");
		item1.b_switch.OnClick = item1_Click;
		
		item2.l_text.txt = Datas.getArString("Settings.Sound_Effects");
		item2.b_switch.OnClick = item2_Click;
		
		item1.b_switch.textOn = item2.b_switch.textOn = Datas.getArString("Settings.On");
		item1.b_switch.textOff = item2.b_switch.textOff = Datas.getArString("Settings.Off");
		
		//default On
		item1.b_switch.SetOn( PlayerPrefs.GetInt("GAME_MUSIC",1) == 1);
		item2.b_switch.SetOn( PlayerPrefs.GetInt("GAME_SFX",1) == 1);
		
		item1_Click(null);
		item2_Click(null);

		speedInput.filterInputFunc = handlerFilterInputFunc;
		speedInput.inputDoneFunc = handlerInputDoneFunc;						
		speedInput.type = TouchScreenKeyboardType.NumberPad;		
		speedInput.Init();
		
		btnSave.txt = Datas.getArString("SettingMap.SaveButton");
		l_des.txt = Datas.getArString("SettingMap.PanningSpeed");
		btnSave.OnClick = OnSaveSpeed;
		slider.Init(Constant.Map.MOVE_ADD_SPEED_MAX);
		
		 if(Application.platform == RuntimePlatform.Android)
		 {
			var androidFrame:int = _Global.GetAndroidFrame();
			lowToggle.selected = androidFrame == Constant.AndroidFrame.LowFrame;
			mediumToggle.selected = androidFrame == Constant.AndroidFrame.MediumFrame;
			highToggle.selected = androidFrame == Constant.AndroidFrame.HighFrame;
			btn_group.addButton(lowToggle);
			btn_group.addButton(mediumToggle);
			btn_group.addButton(highToggle);
			btn_group.buttonChangedFunc = buttonChangedFunc;
			lowLabel.txt = Datas.getArString("Setting.PerformanceLow");
			mediumLabel.txt = Datas.getArString("Setting.PerformanceMedium");
			highLabel.txt = Datas.getArString("Setting.PerformanceHigh");
			frameTitle.txt = Datas.getArString("Setting.PerformanceTitle");
			frameDes.txt = Datas.getArString("Setting.PerformanceText");
            btnSave.rect.y = 900;
		}else{
			btnSave.rect.y = 710;
            
		}


	}

	public function buttonChangedFunc(tb:ToggleButton):void
	{
		switch(tb)
		{
			case lowToggle:
				lowToggle.selected = true;
				mediumToggle.selected = false;
				highToggle.selected = false;
				Application.targetFrameRate = Constant.AndroidFrame.LowFrame;
				PlayerPrefs.SetInt(Constant.AndroidFrame.ANDROID_FRAME_KEY,Constant.AndroidFrame.LowFrame);
				break;
			case mediumToggle:
				mediumToggle.selected = true;
				lowToggle.selected = false;
				highToggle.selected = false;
				Application.targetFrameRate = Constant.AndroidFrame.MediumFrame;
				PlayerPrefs.SetInt(Constant.AndroidFrame.ANDROID_FRAME_KEY,Constant.AndroidFrame.MediumFrame);
				
				break;
			case highToggle:
				highToggle.selected = true;
				mediumToggle.selected = false;
				lowToggle.selected = false;
				Application.targetFrameRate = Constant.AndroidFrame.HighFrame;
				PlayerPrefs.SetInt(Constant.AndroidFrame.ANDROID_FRAME_KEY,Constant.AndroidFrame.HighFrame);
				
				break;
		}
	}

	
	public function SetUIData(param:Object):void
	{
		slider.valueChangedFunc = valueChangedFunc;
		slider.onMouseFunc=MouseFunc;
		slider.Init(Constant.Map.MOVE_ADD_SPEED_MIN ,Constant.Map.MOVE_ADD_SPEED_MAX, true);
		
		if(PlayerPrefs.HasKey(Constant.Map.MOVE_ADD_SPEED_KEY))
		{
			var addSpeed : int = PlayerPrefs.GetInt(Constant.Map.MOVE_ADD_SPEED_KEY);
			slider.SetCurValue(addSpeed);
			valueChangedFunc(addSpeed);
		}
		else
		{
			slider.SetCurValue(Constant.Map.MOVE_ADD_SPEED_MIN);
			valueChangedFunc(Constant.Map.MOVE_ADD_SPEED_MIN);
		}
	}
	
	function item1_Click(param:Object):void
	{
		SoundMgr.instance().SetMusicEnable(item1.b_switch.on);
	}
	
	function item2_Click(param:Object):void
	{
		SoundMgr.instance().SetEffectEnable(item2.b_switch.on);
	}
	
	private function OnSaveSpeed(param : Object)
	{
		if(_Global.FilterStringToNumberStr(speedInput.txt) == "")
		{
			PlayerPrefs.SetInt(Constant.Map.MOVE_ADD_SPEED_KEY, Constant.Map.MOVE_ADD_SPEED_MIN);
		}
		else
		{
			var count : int = _Global.INT32(speedInput.txt);
			var max : int =  Constant.Map.MOVE_ADD_SPEED_MAX;
			
			count = count < Constant.Map.MOVE_ADD_SPEED_MIN ? Constant.Map.MOVE_ADD_SPEED_MIN : count;
			count = count >= max ? max : count;
		
			PlayerPrefs.SetInt(Constant.Map.MOVE_ADD_SPEED_KEY, count);
		}
		
		MenuMgr.getInstance().PopMenu("");
	}
	
	public function handlerFilterInputFunc(oldStr:String,newStr:String)
	{
		var max : int =  Constant.Map.MOVE_ADD_SPEED_MAX;
		var input = _Global.FilterStringToNumberStr(newStr);
		var count:long = 0;
		if(input == "")
		{
			count = 0;
		}
		else
		{
			count = _Global.INT64(input);
		}
		count = count < 0 ? 0 : count;
		count = count >= max ? max : count;
		
		return count == 0 ? "" : "" + count;
	}
	
	public function handlerInputDoneFunc(input:String)
	{
		if(_Global.FilterStringToNumberStr(input) == "")
		{
			slider.SetCurValue(Constant.Map.MOVE_ADD_SPEED_MIN);
			valueChangedFunc(Constant.Map.MOVE_ADD_SPEED_MIN);
			return "1";
		}
		else
		{
			var count = _Global.INT64(input);
			var max : int =  Constant.Map.MOVE_ADD_SPEED_MAX;
			
			count = count < Constant.Map.MOVE_ADD_SPEED_MIN ? Constant.Map.MOVE_ADD_SPEED_MIN : count;
			count = count >= max ? max : count;
		
			slider.SetCurValue(count);
			valueChangedFunc(count);
			MouseFunc(false);

			return input;
		}
	}

	private function MouseFunc(isDown:boolean){
		if (!isDown) {
			//handlerDelegate.handleItemAction("Slider_Up",null);
		}
	}

	protected function valueChangedFunc(v:long):void
	{
		speedInput.txt = v.ToString();
	}

	function Update()
	{
        this.rect.y = -120;
	}
	
	public function DrawItem()
	{
		l_bg.Draw();
		item1.Draw();
		item2.Draw();
		l_bgMap.Draw();
		l_des.Draw();
		speedInput.Draw();
		slider.Draw();
        btnSave.Draw();

		if(Application.platform == RuntimePlatform.Android)
		{
			l_frameBg.Draw();
			frameTitle.Draw();
			frameDes.Draw();
			lowToggle.Draw();
			mediumToggle.Draw();
			highToggle.Draw();
			lowLabel.Draw();
			mediumLabel.Draw();
			highLabel.Draw();
			frameline1.Draw();
			frameline2.Draw();
			frameline3.Draw();
		}
       
	}
	
	function DrawBackground()
	{
		
	}
}