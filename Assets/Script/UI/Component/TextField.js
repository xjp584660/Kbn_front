class TextField extends InputText
{
//	public var	maxLength:int;
//	public var fieldString:String = "";
//	public var editable:boolean = true;
//	public var keybordType:iPhoneKeyboardType = iPhoneKeyboardType.Default;
//	protected	var	keyboard:iPhoneKeyboard;
//	protected static var curTextField:TextField;
//	public function Draw():int
//	{	
//		mystyle.font = FontMgr.GetFont(font);
//		if(editable)
//		{
//			if( Event.current.type == EventType.Repaint )
//				UpdateString();		
//			if( GUI.Button ( rect, fieldString, mystyle) )
//					openNumKeyboard();
//		}
//		else
//		{
//			GUI.Label(rect,fieldString,mystyle);
//		}
//		return -1;
//	}
//	
//	protected	function	openNumKeyboard(){
//		if( keyboard == null || !keyboard.active ){
//			iPhoneKeyboard.hideInput = true;
//			keyboard = iPhoneKeyboard.Open(fieldString, keybordType);
//			
//			curTextField = this;
//		}
//	}
//	
//	protected function UpdateString()
//	{
//		if( keyboard == null || !keyboard.active || curTextField != this)
//			return;
//			
//		if( maxLength )
//		{
//			//	fieldString = GUI.TextField ( rect, fieldString, maxLength, mystyle);	
//			fieldString = keyboard.text;
//			if(fieldString.length > maxLength)
//			{
//				fieldString = fieldString.Substring(0, maxLength);
//			}	 
//		}
//		else
//		{
//	//			fieldString = GUI.TextField ( rect, fieldString, mystyle);	
//			fieldString = keyboard.text;
//		}
//	}
//	
	public function ClearField()
	{
		txt = "";
	}
	
//	public function GetString():String
//	{
//		return fieldString;
//	}
//	
//	public	function	SetString(str:String)
//	{
//		str = str?str:"";
//		fieldString = str;
//	}
//	
	public function set _txt(value:String)
	{
		txt = value;
	}
	public function get _txt():String
	{
		return txt;
	}
}
