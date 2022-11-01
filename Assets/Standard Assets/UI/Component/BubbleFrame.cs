using UnityEngine;
using System;
using System.Collections;

[Serializable]
public class BubbleFrame : UIElement {

	public Rect arrowRect;

	private static Rect screenRect = new Rect(0, 0, 640, 960);

	private Tile bubble;
	private Texture2D arrow;


	public override void Sys_Constructor ()
	{
		base.Sys_Constructor ();
		this.SetVisible(false);

		bubble = TextureMgr.singleton.IconSpt().GetTile("Login_bubble");
		arrow = TextureMgr.singleton.LoadTexture("Login_bubbleArrow", TextureType.BACKGROUND);
	}

	public override int Draw ()
	{
		if (!visible)
			return 0;

		bubble.Draw(rect, false);
		GUI.DrawTexture(arrowRect, arrow);

		GUI.BeginGroup(rect);
		DrawItem();
		GUI.EndGroup();

		if (Event.current.type != EventType.Repaint) {
			bool hit2 = GUI.Button(rect, GUIContent.none);
			bool hit1 = GUI.Button(screenRect, GUIContent.none);
			if (hit1 && !hit2) 
				Close();
		}

		return 0;
	}

	protected virtual void DrawItem() {
	}

	public void Close()
	{
		this.SetVisible(false);
	}

}
