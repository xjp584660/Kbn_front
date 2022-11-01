using UnityEngine;
using KBN;

public class RadioButton : CheckBox
{
	private RadioButtonController controller;

	public override int Draw()
	{
		if( !visible ){
			return -1;
		}	
		if(category != "" && content != "")
			txt = Datas.getArString(category+ "." +content);	
		bool bChoose = GUI.Toggle( rect, controller.choosedBtn == this ,txt, mystyle);	
		if(bChoose != this.IsSelect )
		{
			if(bChoose)
			{
				controller.ChooseButton(this);
			}
			this.IsSelect = bChoose;
		}

		return -1;
	}
	
	public void SetController( RadioButtonController ctrl)
	{
		controller = ctrl;
	}
}
