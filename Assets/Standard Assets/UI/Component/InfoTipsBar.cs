#pragma strict
using UnityEngine;

public class InfoTipsBar:TipBar
{
	public Label info;
	public Label back;
	
	public override void Init()
	{
		base.Init();
		info.rect.width = this.rect.width;
		info.rect.height = this.rect.height;
		back.rect.width = this.rect.width;
		back.rect.height = this.rect.height;
		back.setBackground ("black_Translucent",TextureType.DECORATION);
		visible = false;
	}

	public override void ReSetRect(){
		info.rect.width = 640;
		info.rect.height = 180;
		back.rect.width = 640;
		back.rect.height = 180;
//		rect.width = 640;
	}
	
	public override void InitForWorldMap()
	{
		info.rect.width = this.rect.width;
		info.rect.height = this.rect.height;
		back.rect.width = this.rect.width;
		back.rect.height = this.rect.height;
		back.mystyle.normal.background = TextureMgr.instance().LoadTexture("black_Translucent", TextureType.DECORATION);
		visible = false;
	}
	
	protected override UnityEngine.Rect CreateRect()
	{
		return new UnityEngine.Rect(70,500,500,120);
	}
	
	public override void setInfoContent(string content)
	{
		info.txt = content;
	}

	public override int Draw()
	{ 	
		if(!this.visible) return 0;
		UnityEngine.GUI.BeginGroup(rect);
			back.Draw();
			info.Draw();
		UnityEngine.GUI.EndGroup();
		return 1;
	}
	
	public override bool IsShow()
	{
		return visible;
	}
	
	public override void Show()
	{
		base.Show();
		visible = true;
	} 
	public override void Hide()
	{
		base.Hide();
		visible = false;
	}
	
}