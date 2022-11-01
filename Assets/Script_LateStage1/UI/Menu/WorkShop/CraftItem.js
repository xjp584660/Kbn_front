public class CraftItem extends FullClickItem
{
	public var l_title : Label;
	public var l_description : Label;
	public var btn_next : Button;
	public var sl_lock1 :SimpleLabel;
	public var l_lock2 :Label;
	public var l_right :Label;
	public var l_wrong :Label;
	public var l_Owned : Label;
	public var l_line:Label;
	public var itemPic:ItemPic;
	private var requirements:Array;
	private var m_data:HashObject;
	
	public function Init()
	{
		super.Init();
		btn_next.OnClick = this.onClick;
		l_right.SetVisible(false);
		
		l_line.setBackground("between line_list_small", TextureType.DECORATION);
		l_line.rect.height = 4;
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);

		itemPic.Draw();				
		l_title.Draw();
		l_description.Draw();
		sl_lock1.Draw();
		l_lock2.Draw();
		btn_next.Draw();		
		l_right.Draw();
		l_wrong.Draw();
		l_line.Draw();
		l_Owned.Draw();
		GUI.EndGroup();
	}
	public function SetRowData(data:Object)
	{
		m_data = data as HashObject;
		var rewardItemId:int = _Global.INT32(m_data["reward"]["id"]);
		l_title.SetFont(FontSize.Font_20,FontType.TREBUC);
		l_title.txt = Datas.getArString("itemName.i" + rewardItemId);
		l_description.txt = Datas.getArString("itemDesc.i" + rewardItemId);
		itemPic.SetId(rewardItemId);
		l_Owned.txt = Datas.getArString("Common.Owned") + ": " +MyItems.instance().countForItem(rewardItemId);
		//check lock
		var recipeId:String = _Global.GetString(m_data["recipeId"]);
		var needStudy:boolean = WorkShop.instance().needStudyRecipe(recipeId);
		var hasStudy:boolean = WorkShop.instance().hasStudyRecipe(recipeId);
		if(!needStudy || (needStudy && hasStudy))
		{
			sl_lock1.SetVisible(false);
			l_lock2.SetVisible(false);
			//check reqs
			if(WorkShop.instance().isCraftCostResEnough(recipeId) && WorkShop.instance().isCraftCostItemsEnough(recipeId))
			{
				l_right.SetVisible(true);
				l_wrong.SetVisible(false);
			}
			else
			{
				l_right.SetVisible(false);
				l_wrong.SetVisible(true);
			}
		}
		else
		{
			sl_lock1.SetVisible(true);
			l_lock2.SetVisible(true);
			l_right.SetVisible(false);
			l_wrong.SetVisible(false);
		}
	}
	
	protected function onClick(param:Object)
	{
		if(handlerDelegate != null)
		{
			handlerDelegate.handleItemAction(Constant.Action.CRAFT_ITEM_NEXT,m_data);
		}
	}
	
}