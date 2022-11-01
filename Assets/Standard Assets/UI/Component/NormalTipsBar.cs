using UnityEngine;
public class NormalTipsBar : TipBar
{
	public Label info;
	public Label back;
	public float s;
	public float v;
	public float a;
	public Rect animationRect;
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
	
	public void InitForWorldMap()
	{
		info.rect.width = this.rect.width;
		info.rect.height = this.rect.height;
		back.rect.width = this.rect.width;
		back.rect.height = this.rect.height;
		back.mystyle.normal.background = TextureMgr.instance().LoadTexture("black_Translucent", TextureType.DECORATION);
		visible = false;
	}
	
	protected override Rect CreateRect()
	{
		return new Rect(animationRect);
	}
	
	public void setInfoContent(string content)
	{
		info.txt = content;
	}
	
	public override int Draw()
	{ 	
		if(!this.visible) return -1;
		GUI.BeginGroup(rect);
		back.Draw();
		info.Draw();
		GUI.EndGroup();
		return -1;
	}

	protected override void LineInAnimate()
	{	
		visible = true;
		Rect from = new Rect(CreateRect());
		from.height = 0;
		rect = from;		
		Rect to = new Rect(CreateRect());
		UIObject uiobject = this;
		lineIn = LineAnimate(lineIn,OnLineInFinish,from,to,uiobject,s,v,a);
	}
	protected override void LineOutAnimate()
	{
		Rect to = new Rect(CreateRect());
		to.height = 0;
		Rect from = new Rect(CreateRect());
		UIObject uiobject = this;
		lineOut2 = LineAnimate(lineOut2,OnLineOutFinish,from,to,uiobject,s,v,a);
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

	public void OnLineOutFinish()
	{
		visible = false;
	}
}