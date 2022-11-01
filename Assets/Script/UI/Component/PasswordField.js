class PasswordField extends TextField
{

	private var star:String ="";


	function Draw():int
	{
		if(!visible)
			return;

		super.Draw();

		/* 显示 * 号 */
		if (star.length != txt.length) {
			UpdateString();
		}
		GUI.Label(rect, star, mystyle);


		return -1;
	}





	protected function UpdateString()
	{
		star = "";
		for(var i:int = 0; i < txt.length; i++)
		{
			star = star + "*";
		}

	}
	


	protected function TouchScreenKeyboardOpen(text: String, keyboardType: TouchScreenKeyboardType, autocorrection: boolean, multiline: boolean): TouchScreenKeyboard {

		return TouchScreenKeyboard.Open(text, keyboardType, autocorrection, multiline, true);

	}

	
	public function set _txt(value:String)
	{
		txt = value;
		UpdateString();
	}
	public function get _txt():String
	{
		return txt;
	}
}

