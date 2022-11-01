using UnityEngine;
using System;
using System.Collections;

public class ReportLogItem : UIObject 
{
	[SerializeField]
    private Label title;
    [SerializeField]
    private Label content;

    public int heightOffset = 10;

	public override void Init ()
	{
		base.Init ();

		title.Init();
		content.Init();
	}

	public override int Draw ()
	{
		if (!visible)
			return -1;

		GUI.BeginGroup(rect);

		title.Draw();
		content.Draw();

		GUI.EndGroup();

		return -1;
	}

	public void SetLogData (string title, string content, int width)
	{
		this.title.txt = title;
		if(String.IsNullOrEmpty(content))
		{
			this.title.rect.height = 72;
			this.title.mystyle.alignment = TextAnchor.UpperCenter;
		}
		this.content.txt = content;

		this.content.rect.width = width;
        float contentHeight = this.content.mystyle.CalcHeight(new GUIContent(content), this.content.rect.width);
     	this.content.rect.height = contentHeight;

     	this.rect.height = contentHeight + this.title.rect.height + heightOffset;
	}
}
