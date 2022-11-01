using UnityEngine;
using System.Collections;

public class FullClickItem : ListItem
{
	public SimpleButton btnDefault;
	public SimpleLabel line;

	public override void DrawItem()
	{
		base.DrawItem();
//		GUI.BeginGroup(rect);
		DrawDefaultBtn();		
//		line.Draw();
//		GUI.EndGroup();
//		return -1;
		
	}

	public void DrawDefaultBtn()
	{
		Color oldColor = GUI.color;
		GUI.color = new Color(0, 0, 0, 0.4f);	
		btnDefault.Draw();
		GUI.color = oldColor;
	}
	
	public override void Init()
	{
		if(btnDefault.mystyle == null)
			btnDefault.mystyle = new GUIStyle();
		if(btnDefault.mystyle.active.background == null)
		{
			btnDefault.mystyle.normal.background = TextureMgr.instance().LoadTexture("a_0_square",TextureType.BACKGROUND);
			btnDefault.mystyle.active.background = TextureMgr.instance().LoadTexture("square_black",TextureType.BACKGROUND);
			btnDefault.mystyle.border.left = 14;
			btnDefault.mystyle.border.right = 14;
			btnDefault.mystyle.border.top = 14;
			btnDefault.mystyle.border.bottom = 14;
			
		}
		btnDefault.rect = new Rect(0, 0, rect.width, rect.height - 5);
		line.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line_list_small",TextureType.DECORATION);
		line.rect = new Rect(5, rect.height - 4, rect.width-10, 4);
	}
}
