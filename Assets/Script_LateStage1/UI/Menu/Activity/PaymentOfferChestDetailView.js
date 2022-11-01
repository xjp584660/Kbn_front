#pragma strict

public class PaymentOfferChestDetailView extends UIObject
{
	@SerializeField
    private var frameBg : SimpleLabel;

    @SerializeField
    private var icon : SimpleLabel;
    
    @SerializeField
    private var iconFrame : SimpleLabel;
    
    @SerializeField
    private var nameLabel : SimpleLabel;
    
    @SerializeField
    private var descLabel : SimpleLabel;
    
    // Mystery chest
    @SerializeField
    private var detailBg : SimpleLabel;
    
    @SerializeField
    private var detailBgRectOffset : RectOffset;
    
    @SerializeField
    private var detailBgImageName : String;
    
    @SerializeField
    private var descMystLabel : Label;
    
    @SerializeField
    private var scrollViewRectOffset : RectOffset;
    
    @SerializeField
    private var mystryChestScrollView : ScrollView;
    
    // Normal chest
	@SerializeField
    private var scrollListBg : SimpleLabel;
    
    @SerializeField
    private var subItemsScrollList : ScrollList;
    
    @SerializeField
    private var scrollListRectOffset : RectOffset;
    
    @SerializeField
    private var subItemTemplate : NewSubItem;
    
    private var data : ChestDetailDisplayData = null;
    
    public function GetChestScrollView() : ScrollView
    {
    	return mystryChestScrollView;
    }
    
    public function GetItemsScrollList() : ScrollList
    {
    	return subItemsScrollList;
    }

    public function Init(id : int,subItems:HashObject)
    {
    	ClearData();
    	
    	if(id != 0)
    	{
	    	var ho = new HashObject({
	            "ID": id
	            , "Category": MyItems.GetItemCategoryByItemId(id)
	        });
	        data = ChestDetailDisplayData.CreateWithHashObject(ho);
	        
	        nameLabel.txt = data.Name;
	        descLabel.txt = data.Desc;
	        icon.tile = TextureMgr.instance().LoadTileOfItem(data.Id);
	        iconFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("chestFrame", TextureType.DECORATION);
	        nameLabel.SetVisible(true);
        	descLabel.SetVisible(true);
        	icon.SetVisible(true);
        	iconFrame.SetVisible(true);
        	frameBg.SetVisible(true);
        	
            InitMystryChest();
        	InitNormalChest();
    	}
        else
        {
        	var items : InventoryInfo[] = ChestDetailDisplayData.GetOfferItems(subItems);
        	InitPopChest(items);
        	nameLabel.SetVisible(false);
        	descLabel.SetVisible(false);
        	icon.SetVisible(false);
        	iconFrame.SetVisible(false);
        	frameBg.SetVisible(false);
        }
        
        //frameBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("liebiao_ditu", TextureType.DECORATION);
        scrollListBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2", TextureType.DECORATION);
             
		if(KBN._Global.IsLargeResolution ())
		{
			icon.rect = new Rect(15f,32f,80,80);	
			iconFrame.rect = new Rect(15,32f,80,80);							
		}
		else
		{
			icon.rect = new Rect(15,18,100,100);	
			iconFrame.rect = new Rect(15,18,100,100);
		}
    }
    
    private function InitPopChest(items : InventoryInfo[])
    {
        scrollListBg.rect = new Rect(0, 20, 526, 356);

        subItemsScrollList.Init(subItemTemplate);
        subItemsScrollList.SetVisible(true);
        if (items.Length > 0)
        {
            subItemsScrollList.SetData(items);
            subItemsScrollList.ResetPos();
        }  
        subItemsScrollList.rect = new Rect(0, 20, 526, 356);  	
    }

    //转为月卡做的初始化
    public function InitMonthCard(id : int, subItems : HashObject)
    {
        ClearData();
        var ho = new HashObject({
            "ID": id
            , "Category": 101,
            "subItems":subItems
        });
        data = ChestDetailDisplayData.CreateWithHashObject(ho);
        
        //frameBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("liebiao_ditu", TextureType.DECORATION);
        scrollListBg.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2", TextureType.DECORATION);
        

        nameLabel.txt = data.Name + " " + Datas.getArString("Offer.Monthly30Days");
        descLabel.txt = data.Desc;
        icon.tile = TextureMgr.instance().LoadTileOfItem(data.Id);
        iconFrame.mystyle.normal.background = TextureMgr.instance().LoadTexture("chestFrame", TextureType.DECORATION);
        nameLabel.SetVisible(true);
    	descLabel.SetVisible(true);
    	icon.SetVisible(true);
    	iconFrame.SetVisible(true);
    	frameBg.SetVisible(true);
    	
        if(KBN._Global.IsLargeResolution ())
        {
            icon.rect = new Rect(15f,32f,80,80);    
            iconFrame.rect = new Rect(15,32f,80,80);                            
        }
        else
        {
            icon.rect = new Rect(15,18,100,100);    
            iconFrame.rect = new Rect(15,18,100,100);
        }
        InitMystryChest();
        InitNormalChest();
    }

    
    public function OnPopOverOrDestroy()
    {
        ClearData();
    }
    
    public function ClearData()
    {
    	if (mystryChestScrollView != null)
        {
            mystryChestScrollView.clearUIObject();
        }
        
        if (subItemsScrollList != null)
        {
            subItemsScrollList.Clear();
        }
    }
    
    public function Update()
    {
        if (!visible)
        {
            return;
        }

        if (subItemsScrollList.isVisible)
        {
            subItemsScrollList.Update();
        }
        
        if (mystryChestScrollView.isVisible)
        {
            mystryChestScrollView.Update();
        }
    }

    public function Draw()
    {
        if (!visible)
        {
            return;
        }
        
        GUI.BeginGroup(rect);

		frameBg.Draw();
        icon.Draw();
        iconFrame.Draw();
        nameLabel.Draw();
        descLabel.Draw();
        
        // Mystery chest
        detailBg.Draw();
        mystryChestScrollView.Draw();
        
        // Normal chest
        //scrollListBg.Draw();
        subItemsScrollList.Draw();

        GUI.EndGroup();
    }
    
    private function InitMystryChest()
    {
        descMystLabel.txt = data.DescMyst;
        descMystLabel.SetFont();
        descMystLabel.SetVisible(data.ShouldShowDescMyst);
        var descMystLabelHeight : float = descMystLabel.mystyle.CalcHeight(new GUIContent(descMystLabel.txt), mystryChestScrollView.rect.width);
		if(KBN._Global.IsLargeResolution ())
		{
			descMystLabel.rect = new Rect(0,220,mystryChestScrollView.rect.width,descMystLabelHeight);								
		}
		else
		{
			descMystLabel.rect = new Rect(0,215,mystryChestScrollView.rect.width,descMystLabelHeight);	
		}
		
        mystryChestScrollView.Init();
        mystryChestScrollView.clearUIObject();
        mystryChestScrollView.addUIObject(descMystLabel);
        mystryChestScrollView.AutoLayout();
        mystryChestScrollView.MoveToTop();
        mystryChestScrollView.SetVisible(data.ShouldShowDescMyst);        
    }
    
    private function InitNormalChest()
    {
        scrollListBg.rect = new Rect(scrollListRectOffset.left, scrollListRectOffset.top,
            rect.width - scrollListRectOffset.horizontal, rect.height - scrollListRectOffset.vertical);
        //scrollListBg.SetVisible(data.ShouldShowItemList);
        //subItemsScrollList.rect = new Rect(scrollListRectOffset.left + 6, scrollListRectOffset.top + 6,
            //rect.width - scrollListRectOffset.horizontal - 14, rect.height - scrollListRectOffset.vertical - 12);
        subItemsScrollList.Init(subItemTemplate);
        subItemsScrollList.SetVisible(data.ShouldShowItemList);
        var items : InventoryInfo[] = data.Items;
        if (items.Length > 0)
        {
            subItemsScrollList.SetData(items);
            subItemsScrollList.ResetPos();
        }
        
//		if(KBN._Global.IsLargeResolution ())
//		{
//			subItemsScrollList.rect = new Rect(2.5f,150,520,245);								
//		}
//		else
//		{
//			subItemsScrollList.rect = new Rect(2.5f,120,520,245);	
//		}       	
    }
}