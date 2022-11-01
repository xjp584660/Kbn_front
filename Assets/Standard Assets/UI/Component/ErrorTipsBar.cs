using UnityEngine;
public class ErrorTipsBar : TipBar
{
	public Label info;
	public Label back;
	public float s;
	public float v;
	public float a;
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

	protected override Rect CreateRect()
	{
		return new Rect(20,400,600,100);
	}
	
	protected override void LineInAnimate()
	{	
		visible = true;
		Rect from = new Rect(CreateRect());
		from.height = 0;
		rect = from;		
		Rect to = new Rect(CreateRect());
		UIObject uiobject = this;
		float s = 0.0f;
		float v = 5.8f;
		float a = -2.35f;
		lineIn = LineAnimate(lineIn,OnLineInFinish,from,to,uiobject,s,v,a);
	}
	protected override void LineOutAnimate()
	{
		Rect to = new Rect(CreateRect());
		to.height = 0;
		Rect from = new Rect(CreateRect());
		UIObject uiobject = this;
		float s = 0.0f;
		float v = 5.8f;
		float a = -2.35f;
		lineOut2 = LineAnimate(lineOut2,OnLineOutFinish,from,to,uiobject,s,v,a);
	}
	
	public void  setInfoContent(string content)
	{
		info.txt = content;
	}
	
	public void Draw()
	{ 	
		if(!this.visible) return;
		GUI.BeginGroup(rect);
			back.Draw();
			info.Draw();
		GUI.EndGroup();
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