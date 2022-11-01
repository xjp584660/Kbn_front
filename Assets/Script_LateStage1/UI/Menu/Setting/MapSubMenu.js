public class MapSubMenu extends SubMenu
{
	public var l_bg	: Label;
	public var l_des : Label;
	public  var speedInput : InputText;
	public var slider : Slider;
	public var  btnSave:Button;
	
	function Init(parent:ComposedMenu)
	{
		super.Init(parent);		
					
		speedInput.filterInputFunc = handlerFilterInputFunc;
		speedInput.inputDoneFunc = handlerInputDoneFunc;						
		speedInput.type = TouchScreenKeyboardType.NumberPad;		
		speedInput.Init();
		
		title.txt = Datas.getArString("Settings.Map");
		btnSave.txt = Datas.getArString("SettingMap.SaveButton");
		l_des.txt = Datas.getArString("SettingMap.PanningSpeed");
		btnSave.OnClick = OnSaveSpeed;
		slider.Init(Constant.Map.MOVE_ADD_SPEED_MAX);
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
		
//		slider.SetCurValue(count);
//		valueChangedFunc(count);
		
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
	
	public function OnPush(param:Object):void
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
	}
	
	function DrawItem()
	{
		l_bg.Draw();
		title.Draw();
		btnBack.Draw();
		l_des.Draw();
		speedInput.Draw();
		slider.Draw();
		btnSave.Draw();
	}
	
	function DrawBackground()
	{
		
	}
}