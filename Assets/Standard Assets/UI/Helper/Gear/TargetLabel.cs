

using System.Collections.Generic;
using UnityEngine;
using KBN;

public class TargetLabel : UIObject
{
	public Label starLabel;
	public Label targetLabel;
	public Label backLabel;
	
	private int id;
	private Rect[] stars;
	private Label back;
	private Label target;
	private Label lname;
	
	private int n;
	
	private bool drawName;
	private int maxInterval;
	private Rect drawNameRect;
	
	private List<UIObject> created;
	public override void Init()
	{
		created = new List<UIObject>();
		starLabel.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON); 
		backLabel = GearManager.Instance().SetImage(backLabel,"Arms_ground");	
		
		target = targetLabel;
		back = backLabel;		
		back.rect = new Rect(0,0,rect.width,rect.height);
		SetRect(rect);
		isValid = false;
		drawName = false;
		maxInterval = 3;
	}
	
	public bool DrawName
	{
		set
		{
			drawName = value;
			if(lname != null)
				lname.OnPopOver();
			lname = (Label)GameObject.Instantiate(starLabel);
			GearManager.Instance().SetImageNull(lname);
			created.Add(lname);
			lname.mystyle.normal.background = null;
			lname.mystyle.normal.textColor = new Color(1.0f,1.0f,1.0f,1.0f);
		}
	}
	
	public int ID
	{
		set
		{
			OnIDChanged(id,value);
			id = value;
			AutoLayout();
		}
	}
	
	private void OnIDChanged(int o,int n)
	{
		//if(o == n) return;
//		if(n!=99)
//			return;
		int type;
		int level;
		string troopname;
		
        var gdsTroop = GameMain.GdsManager.GetGds<GDS_Troop>();
		type =  gdsTroop.GetAttributeFromAttrType(Constant.TroopType.UNITS,n,Constant.TroopAttrType.TYPE);
		level = gdsTroop.GetAttributeFromAttrType(Constant.TroopType.UNITS,n,Constant.TroopAttrType.TIER);
		troopname = Datas.getArString("unitName.u" + n.ToString());
		
		SetType(type,n);
		SetLevel(level,n);
		SetName(troopname,n);
		isValid = true;
		
		
	}
	
	private void SetType(int t,int id)
	{
		if(id == 0) return;
		if(id == 99) 
		{
			target.useTile = false;
			target.tile = null;
			//target.tile.name = "";
			return;
		}

		target.useTile = true;
		target.tile = TextureMgr.instance().UnitSpt().GetTile("troop_type" + t.ToString());
		//target.tile.name = "troop_type" + t;
	}
	private void SetLevel(int l,int id)
	{
		if(id == 0) return;
		if(id == 99)
		{
			stars = new Rect[1];
			starLabel.mystyle.normal.background = null;
			starLabel.txt = Datas.getArString("Gear.EffectAllTroops");
		}
		else
		{
			if(l > 0)
				stars = new Rect[l];
			starLabel.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON); 
			starLabel.txt = "";
		}
	}
	private void SetName(string n,int id)
	{
		if(id == 99 || id == 0) return;
		if(drawName && lname != null)
			lname.txt = n;		
	}
	
	
	public override void SetRect(Rect r)
	{
		back.rect = new Rect(0,0,r.width,r.height);
	}
	
	
	private bool isValid;
	public bool IsValid()
	{
		if(!visible) return false;
		if(id <= 0) return false;
		return isValid;	
	}
	
	private void AutoLayout()
	{
		if(!IsValid()) return;
		target.rect = new Rect(0.727f * rect.width,0.131f * rect.height,0.243f * rect.width,0.737f*rect.height);
		int n = stars.Length;
		float y = 0.289f;
		float total = n * 0.130f + (n-1) * maxInterval / 115.0f;
		if(total > 0.626f) total = 0.626f;
		float left = 0.383f - total / 2.0f;
		if(left < 0.067f) left = 0.067f;
		float per = total / n;
		for(int i = 0;i<n;i++)
		{
			stars[i].y = y * rect.height;
			stars[i].x = left * rect.width;
			stars[i].width = 0.130f * rect.width;
			stars[i].height = 0.421f * rect.height;
			left += per;
		}
		
		if(id == 99)
		{
			stars[0].x = (0.383f - total / 2.0f) * rect.width;
			stars[0].width = total * rect.width;
			starLabel.mystyle.alignment = TextAnchor.MiddleCenter;
			drawName = false;
		}
		
		if(drawName && lname != null)
		{
			lname.rect = new Rect(rect.width + 5,0,rect.width * 2,rect.height); 
			lname.mystyle.alignment = TextAnchor.MiddleLeft;
		}
		drawNameRect = new Rect(rect);
		drawNameRect.width *= 3;
	}
	
	public override void OnPopOver()
	{
		DestroyResource();
		UIObject.TryDestroy(this);
	}
	
	private void DestroyResource()
	{
		if( created == null) created = new List<UIObject>();
		for(int j = 0;j < created.Count;j++)
		{
			created[j].OnPopOver();
		} 
		created.Clear();
	}
	
	public override int Draw()
	{	
		if(!IsValid()) return -1;
		
		if(drawName)
			GUI.BeginGroup(drawNameRect);
		else
			GUI.BeginGroup(rect);
		if(back != null)
			back.Draw();
		if(stars != null)
		{
			foreach(Rect l in stars)
			{
				starLabel.rect = l;
				starLabel.Draw();
			}
		}
		if(target != null)
			target.Draw();
		if(lname != null && drawName)
			lname.Draw();
		GUI.EndGroup();
		return 0;
	}
	

}
