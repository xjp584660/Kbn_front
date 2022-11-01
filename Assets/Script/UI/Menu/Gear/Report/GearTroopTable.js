
import System.Collections.Generic;

public class GearTroopTable extends UIObject
{
	public var view:ScrollView;
	public var attack:Label;
	public var life:Label;
	public var speed:Label;
	public var load:Label;
	public var deattack:Label;
	public var delife:Label;
	//public var troop:Label;
	public var item:GearTroopItem;
	
	private var datas:Dictionary.<int,GearTroopItem.GearTroopItemData>;
	private var items:List.<GearTroopItem>;
	
	public var mode:GearTroopItem.Mode;
		
	public function set Datas(value:Dictionary.<int,GearTroopItem.GearTroopItemData>)
	{ 
	
		datas = value; 
		Refresh();
	}
	
	public function Init()
	{
		view.Init();
		
		attack.Init();
		life.Init();
		speed.Init();
		load.Init();
		deattack.Init();
		delife.Init();
		//troop.Init();
		items = new List.<GearTroopItem>();
	}
	
	public function Update()
	{
		view.Update();
		attack.Update();
		life.Update();
		speed.Update();
		load.Update();
		deattack.Update();
		delife.Update();
		//troop.Update();
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		view.Draw();
		attack.Draw();
		life.Draw();
		speed.Draw();
		load.Draw();
		deattack.Draw();
		delife.Draw();
		//troop.Draw();
		GUI.EndGroup();
	}
	
	private function Refresh()
	{ 
		if(datas != null)
		{
			DestroyResource(); 
			view.clearUIObject();
			var i:int = 0;
			var list:List.<GearTroopItem.GearTroopItemData> = new List.<GearTroopItem.GearTroopItemData>();
			
			for(var k:KeyValuePair.<int,GearTroopItem.GearTroopItemData> in datas)
			{ 
				list.Add(k.Value);
			}
			list.Sort(Comp);
			
			for(var d:GearTroopItem.GearTroopItemData in list)
			{
				if(d == null) continue;
				var m:GearTroopItem = GameObject.Instantiate(item);
				view.addUIObject(m); 
				items.Add(m);
				m.Init();
				m.TheMode = mode;
				m.Data = d; 
				m.CenterX = [CenterX(life.rect),CenterX(attack.rect),CenterX(speed.rect),CenterX(load.rect),CenterX(delife.rect),CenterX(deattack.rect)];
				m.Interval = [Interval(life.rect),Interval(attack.rect),Interval(speed.rect),Interval(load.rect),Interval(delife.rect),Interval(deattack.rect)];
				if(i % 2 == 0)
					m.HiLighted = true;
				else 
					m.HiLighted = false;
				i++;
			}
			
			view.AutoLayout();
		}
	}
	
	private function Comp(a:GearTroopItem.GearTroopItemData,b:GearTroopItem.GearTroopItemData)
	{
		if(a == null) return -1;
		if(b == null) return 1;
		if(a.id < b.id) return -1;
		if(a.id > b.id) return 1;
		return 0;
	}
	
	private function CenterX(r:Rect):float
	{
		return r.x;
	}
	private function Interval(r:Rect):float
	{
		return r.width;
	}
	
	public function DestroyResource()
	{
		if(items != null)
		{
			for(var i:int = 0; i < items.Count;i++)
			{
				items[i].OnPopOver();
			}
		}
		if(view != null) view.clearUIObject();
	}
	
	public function OnPush()
	{
		//view.AutoLayout();
	}
	
	public function OnPopOver()
	{
		DestroyResource();
	}
	
}