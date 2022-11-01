using UnityEngine;
using KBN;
public class BGMenu : KBNMenu
{
	[Space(30), Header("--------BGMenu---------")]

	public Label bgLabel;
	
	public override void Init()
	{
		bgLabel.Init();
	}
	
	public override int Draw()
	{

		if (!visible) return -1;

		Color oldColor = GUI.color;
		GUI.color = m_color;
		if (!VerifyMenu.GetInstance().gameObject.activeSelf)
		{
			bgLabel.Draw();
		}
		
		
		GUI.color = oldColor;
		return -1;
	}
}
