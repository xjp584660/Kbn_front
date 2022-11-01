

using UnityEngine;

public class GearCell : UIObject
{
	public Label data;
	public Label sign;
	
	private Mode mode = Mode.Normal;
	//private int centerX;
	//private int centerY;
	//private int interval;
	public float CenterX
	{
		set
		{
			//centerX = value;
			rect.x = value;
		}
	}
	
	private void SetLayout()
	{ 
		data.rect.y = 0;
		sign.rect.y = 5;

		if(mode == Mode.Increase || mode == Mode.Decrease)
		{
			sign.rect.x = 0;//5;//rect.width / 2 - signRect.width * 2;
			sign.rect.width = 0;//signRect.width;
			sign.rect.height = 0;//signRect.height;
			
			data.rect.x = sign.rect.x + sign.rect.width;
			data.rect.width = rect.width - data.rect.x;
			data.mystyle.alignment = TextAnchor.UpperCenter;
		}
		else 
		{
			data.rect.x = 0;
			data.rect.width = rect.width; 
			data.mystyle.alignment = TextAnchor.UpperCenter;
		}
		data.rect.height = 20;
	}
	
	public float CenterY
	{
		set
		{
			//centerY = value;
			rect.y = value;
		}
	}
	public float Interval
	{
		set
		{
			//interval = value; 
			rect.width = value;  
			SetLayout();
		}
	}
	
	public enum Mode
	{
		Increase,
		Decrease,
		Normal
	}
	
	public string Text
	{
		set
		{
			data.txt = value;
		}
	}
	//private Rect signRect;
	public Mode TheMode
	{
		set
		{
			mode = value; 
			if(mode == Mode.Increase)
			{
				sign.SetVisible(false);
				//sign.SetVisible(true);
				//sign.mystyle.normal.background = TextureMgr.instance().LoadTexture("Rise",TextureType.GEAR);
				//sign = GearManager.Instance().SetImage(sign,"Rise");
				//signRect = sprite.GetFullRect("Rise");
				data.SetNormalTxtColor(FontColor.Green);
				//data.mystyle.normal.textColor = new Color( 252.0f / 255.0f, 0.0f / 255.0f, 0.0f / 255.0f, 1.0f);
			}
			else if(mode == Mode.Decrease)
			{
				sign.SetVisible(false);
				//sign.SetVisible(true);
				//sign.mystyle.normal.background = TextureMgr.instance().LoadTexture("Decline",TextureType.GEAR);
				//sign = GearManager.Instance().SetImage(sign,"Decline");
				//signRect = sprite.GetFullRect("Decline");
				data.SetNormalTxtColor(FontColor.Red);
				//data.mystyle.normal.textColor = new Color( 26.0f / 255.0f, 158.0f / 255.0f, 0.0f / 255.0f, 1.0f );
			}
			else
			{
				sign.SetVisible(false);
				data.SetNormalTxtColor(FontColor.Description_Light);
				//data.mystyle.normal.textColor = new Color( 154.0f / 255.0f, 107.0f / 255.0f, 51.0f / 255.0f, 1.0f);
			}
			SetLayout();
		}
		get
		{
			return mode;
		}
	}

	public override void Init()
	{
		data.Init();
		sign.Init();
		sign.SetVisible(false);
		data.rect.y = 0;
		sign.rect.y = 10;
		TheMode = Mode.Normal;
		data.rect.width = 50;
		data.rect.height = 10;
		sign.rect.width = 50;
		sign.rect.height = 10;
		
	}
	
	public override void Update()
	{
		data.Update();
		sign.Update();
	}
	
	public override int Draw()
	{	 
		GUI.BeginGroup(rect);
		data.Draw();
		sign.Draw(); 
		GUI.EndGroup();
		return 0;
	}
	
	
	public override void OnPopOver() 
	{
		this.data.OnPopOver(); 
		this.sign.OnPopOver();
		UIObject.TryDestroy(this);
	}
	
	
}
