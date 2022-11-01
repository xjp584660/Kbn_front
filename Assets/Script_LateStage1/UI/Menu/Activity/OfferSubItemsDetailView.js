#pragma strict
import System.Collections.Generic;

public class OfferSubItemsDetailView extends UIObject
{   
    @SerializeField
    private var subItemsScrollList : ScrollList;
    
    @SerializeField
    private var subItemTemplate : NewSubItem;
    
    @SerializeField
    private var offerData : PaymentOfferData;
    
    public function GetItemsScrollList() : ScrollList
    {
    	return subItemsScrollList;
    }

    public function Init(data : PaymentOfferData)
    {
    	offerData = data as PaymentOfferData;
    	//intsubItems : HashObject
    	ClearData();

		var chestId : int = offerData.RewardChestId;
		if(chestId != 0)
		{
			var itemListTemp : List.<InventoryInfo> = new List.<InventoryInfo>();
		
			var newItem = new InventoryInfo();
			newItem.id = chestId;
			newItem.quant = 1;
			newItem.category = _Global.INT32(MyItems.GetItemCategoryByItemId(chestId));
			itemListTemp.Add(newItem);
			
			var chests : InventoryInfo[] = itemListTemp.ToArray();
			subItemsScrollList.Init(subItemTemplate);
			subItemsScrollList.SetData(chests);
            subItemsScrollList.ResetPos();			
		}
		else
		{
			var intsubItems : HashObject = offerData.subItems;
			subItemsScrollList.Init(subItemTemplate);
	        var items : InventoryInfo[] = ChestDetailDisplayData.GetOfferItems(intsubItems);
	        var itemsCount : int = items.Length;
	        if (itemsCount > 0)
	        {
				var shows : InventoryInfo[] = new InventoryInfo[itemsCount];
				for(var i : int = 0; i < itemsCount; i++)
				{
					if(items[i] != null)
					{
						shows[i] = items[i];
					}
				}
				
	            subItemsScrollList.SetData(shows);
	            subItemsScrollList.ResetPos();
	        }  
		}        
    }

    public function OnPopOverOrDestroy()
    {
        ClearData();
    }
    
    public function ClearData()
    {
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
        	subItemsScrollList.updateable = false;
            subItemsScrollList.Update();
        }
    }

    public function Draw()
    {
        if (!visible)
        {
            return;
        }
        
        GUI.BeginGroup(rect);

        subItemsScrollList.Draw();

        GUI.EndGroup();
    }
}