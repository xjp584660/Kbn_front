
using UnityEngine;
using KBN;

public class GearTroopItem : ListItem
{
	public class GearTroopItemData
	{
		public int id;
		public double attack;
		public double life;
		public double load;
		public double speed;
		public double deattack;
		public double delife;
		public double troop;
		
		private double[] datas;
		public double[] TheDatas
		{
			get
			{
				if(datas == null)
				{
					datas = new double[7];
					datas[0] = life;
					datas[1] = attack;
					datas[2] = speed;
					datas[3] = load;
					datas[4] = delife;
					datas[5] = deattack;
					datas[6] = troop;
				}
				return datas;
			}
		}
	}
		
	public enum Mode
	{
		Display,
		Compare
	}
	
	public Mode mode = Mode.Display;
	private GearTroopItemData data;
	
	public UnitIcon unitIcon;
	
	public GearCell attack;
	public GearCell life;
	public GearCell speed;
	public GearCell load;
	public GearCell deattack;
	public GearCell delife;
	//public GearCell troop;
	
	public Label hilight;
	
	private GearCell[] items;
	
	public Mode TheMode
	{
		set
		{
			mode = value;
			SetData();
		}
	}
	public GearTroopItemData Data
	{
		set
		{
			data = value;
			SetData();
		}
	}
	
	private void SetData()
	{
		if(data == null) return;
		unitIcon.UnitId = data.id;
		double[] datas = data.TheDatas;
		if(datas == null) return;
		if(mode == Mode.Compare)
		{
			if(datas == null) return;
			if(items == null) return;
			int n = Mathf.Min(datas.Length,items.Length);
			for(int i = 0;i<n;i++)
			{
				if(items[i] == null) continue;
				items[i].Text = datas[i]+"";
				items[i].Text = GearManager.Instance().GearFormatString(data.TheDatas[i]);
				if(datas[i] > 0)
				{
					items[i].TheMode = GearCell.Mode.Increase;
					items[i].Text = data.TheDatas[i]+"";
//					if(i != 6)
					items[i].Text = GearManager.Instance().GearFormatString(data.TheDatas[i]);
				}
				else if(datas[i] < 0)
				{
					items[i].TheMode = GearCell.Mode.Decrease;
					items[i].Text = data.TheDatas[i]+"";
//					if(i != 6)
					items[i].Text = GearManager.Instance().GearFormatString(data.TheDatas[i] * -1);
				}
				else
				{
					items[i].TheMode = GearCell.Mode.Normal;
					items[i].Text = "-";
				}
			}
		}
		else if(mode == Mode.Display)
		{
			for(int j = 0;j<datas.Length;j++)
			{
				if(j == 6) continue;
				items[j].Text = datas[j]+"";
				items[j].TheMode = GearCell.Mode.Normal;
//				if(j != 6)
				items[j].Text = GearManager.Instance().GearFormatString(data.TheDatas[j]);
			}
		}
		
	}
	
	
	public float[] CenterX
	{
		set
		{
			if(items == null) return;
			if(value == null) return;
			int n = Mathf.Min(value.Length,items.Length);
			for(int i = 0;i<n;i++)
			{
				items[i].CenterX = value[i];
				items[i].CenterY = rect.height / 2 - 12;
			}
		}
	}
	
	public float[] Interval
	{
		set
		{
			if(items == null) return;
			if(value == null) return;
			if(value.Length != items.Length) return;
			for(int i = 0;i<items.Length;i++)
			{
				items[i].Interval = value[i];
			}
		}
	}
	
	
	public void SetUIData(GearTroopItemData o)
	{
		Data = o;
	}
	
	
	public override void Init()
	{
		unitIcon.Init();
		attack.Init();
		life.Init();
		speed.Init();
		//troop.Init();
		load.Init();
		items = new GearCell[6];
		items[0] = life;
		items[1] = attack;
		items[2] = speed;
		items[3] = load;
		items[4] = delife;
		items[5] = deattack;
		//items[6] = troop;
		
		hilight.Init();
		hilight.SetVisible(false);
		hilight.mystyle.normal.background = TextureMgr.instance().LoadTexture("jianbiantiao",TextureType.GEAR);
		//hilight = GearManager.Instance().SetImage(hilight,"jianbiantiao");
		hilight.rect = new Rect(0,0,rect.width,rect.height);
	}
	
	public bool HiLighted
	{
		set
		{
			hilight.SetVisible(value);
		}
	}
	
	public override void Update()
	{	
		unitIcon.Update();
		attack.Update();
		life.Update();
		speed.Update();
		//troop.Update();
		load.Update();
		deattack.Update();
		delife.Update();
		hilight.Update();
	}
	
	public override int Draw()
	{
		GUI.BeginGroup(rect);
		hilight.Draw();
		unitIcon.Draw();
		attack.Draw();
		life.Draw();
		speed.Draw();
		//troop.Draw();
		load.Draw();
		deattack.Draw();
		delife.Draw();
		
		GUI.EndGroup();
		return 0;
	}	
	public override void OnPopOver() 
	{
		this.unitIcon.OnPopOver();
		this.attack.OnPopOver();
		this.life.OnPopOver();
		this.speed.OnPopOver();
		this.load.OnPopOver();
		//this.troop.OnPopOver();
		this.deattack.OnPopOver();
		this.delife.OnPopOver();
		this.hilight.OnPopOver();
		UIObject.TryDestroy(this);
	}
	
}
