public class SoundItem extends UIObject
{
	public var l_text: Label;
	public var b_switch:SwitchButton;
	
	public var line:SimpleLabel;
	
	public function Init(selected:boolean):void
	{
//		b_switch.on = selected;
		b_switch.textOn = Datas.getArString("Settings.On");
		b_switch.textOff = Datas.getArString("Settings.Off");
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		l_text.Draw();
		b_switch.Draw();
		line.Draw();
		GUI.EndGroup();
	}
}
