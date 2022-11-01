public class CraftContent extends UIObject
{
	public var btn_back  :Button;
	public var l_title : Label;
	//public var l_icon : Label;
	public var itemPic:ItemPic;
	public var l_name : Label;
	public var l_description : Label;
	public var l_owned:Label;
	public var l_requirement : Label;
	public var l_resCost : Label;
	public var btn_craft : Button;
	public var l_bg:Label;
//	public var l_line1:Label;
	public var l_reqBg:Label;
	public var l_wrong:Label;
	public var l_right:Label;
	
	public var costList : ScrollList;
	public var costItem : CraftCostItem;
	
	public var f_click_callBack:Function;
	
	protected var costItems:Array;
	protected var req_ok:boolean;
	private var m_data:HashObject;
	
	public	function Init()
	{	
		btn_back.OnClick = OnBack;
		
		if (KBN._Global.IsLargeResolution ()) 
		{
			btn_back.rect.width = 60;
		} 
		else if (KBN._Global.isIphoneX ()) 
		{
			btn_back.rect.width = 85;
		}
		else
		{
			btn_back.rect.width = 75;
		}
		btn_back.rect.height = 64;
		
		btn_craft.OnClick = OnCraft;
		btn_craft.txt = Datas.getArString("Workshop.CraftBtn");
		//l_icon.tile.spt = TextureMgr.instance().ItemSpt();
		//l_icon.useTile = true;
		costList.Init(costItem);
		l_reqBg.setBackground("square_black",TextureType.DECORATION);
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		l_bg.Draw();
//		l_line1.Draw();
		l_reqBg.Draw();
		btn_back.Draw();
		btn_craft.Draw();
		l_title.Draw();
		l_name.Draw();
		//l_icon.Draw();
		itemPic.Draw();
		l_owned.Draw();
		l_description.Draw();
		l_requirement.Draw();
		l_resCost.Draw();
		l_right.Draw();
		l_wrong.Draw();
		costList.Draw();
		GUI.EndGroup();
	}
	
	public function Update()
	{
		costList.Update();
	}
	
	private function OnBack()
	{
		if(f_click_callBack != null)
			f_click_callBack(2);
	}
	
	private function OnCraft()
	{
		WorkShop.instance().reqRecipeCraft(_Global.GetString(m_data["recipeId"]),OnCraftSuccess);
	}
	
	public function OnCraftSuccess(param:HashObject)
	{
		MenuMgr.getInstance().PushMessage(Datas.getArString("ToastMsg.CraftingSuccess"));	
	
		if(param != null && param["recipeId"] != null)
		{
			var rewardItems:Array = _Global.GetObjectValues(param["rewards"]);
			var item:HashObject = null;
			var itemId:int;
			var itemNum:int;
			for(var i:int = 0;i<rewardItems.length;i++)
			{
				item = rewardItems[i] as HashObject;
				if(item !=null)
				{
					itemId = _Global.INT32(item["id"]);
					itemNum = _Global.INT32(item["num"]);
					MyItems.instance().AddItem(itemId,itemNum);
				}
			}
		}
		WorkShop.instance().SubResAndItemAfterCraftSuccess(_Global.GetString(param["recipeId"]));
		updateData(m_data);
	}
	
	private function playEndSound():void
	{
		Invoke("playSound",1.5);
	}
	private function playSound():void
	{
		SoundMgr.instance().PlayEffect( "end_construction", /*TextureType.AUDIO*/"Audio/" );
	}
	
	public function updateData(data:HashObject)
	{
		m_data = data;
		var recipeId:String = _Global.GetString(m_data["recipeId"]);
		var rewardItemId:int = _Global.INT32(m_data["reward"]["id"]);
		var bCostResEnough:boolean = WorkShop.instance().isCraftCostResEnough(recipeId);
		var bCostItemEnough:boolean = WorkShop.instance().isCraftCostItemsEnough(recipeId);
		l_title.txt = Datas.getArString("itemName.i" + rewardItemId);
		l_name.txt = Datas.getArString("itemName.i" + rewardItemId);
		l_description.txt = Datas.getArString("itemDesc.i" + rewardItemId);
		//l_icon.tile.name = "i" + rewardItemId;
		itemPic.SetId(rewardItemId);
		l_owned.txt = Datas.getArString("Common.Owned") + ": " +MyItems.instance().countForItem(rewardItemId);
		l_requirement.txt = Datas.getArString("Workshop.MaterialsRequired");
		
		l_resCost.txt = Datas.getArString("Workshop.CraftingCost") + WorkShop.instance().getCraftCostRes(recipeId);
		l_right.SetVisible(bCostResEnough);
		l_wrong.SetVisible(!bCostResEnough);
		costItems = WorkShop.instance().getCraftCostItems(recipeId);
		if(costItems != null)
		{
			costList.Clear();
			costList.SetData(costItems);
			costList.ResetPos();
		}
		if(bCostResEnough && bCostItemEnough)
		{
			btn_craft.changeToBlueNew();
			btn_craft.SetDisabled(false);
		}
		else
		{
			btn_craft.changeToGreyNew();
			btn_craft.SetDisabled(true);
			
		}
		
	}
	
	public function Clear()
	{
		costList.Clear();
	}
}
