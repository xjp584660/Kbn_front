using System;
using UnityEngine;
using System.Collections;

using MyItems = KBN.MyItems;
using Shop = KBN.Shop;
using GameMain = KBN.GameMain;
using Datas = KBN.Datas;
using _Global = KBN._Global;
using Prop = KBN.Prop;

public class MarchBoostItem : UIObject
{
    public Label l_img;
    public Label l_name;
    public Label l_des;
    
    public Label l_num;
    public Button btn;

    public Label l_time;
    public Label l_status;
    public Label l_sale;
    
    public Label divideLine;
    public SaleComponent saleComponent;
    
    private int itemId;
    private bool inUse;
    
    private long itemNum;
    private long curTime;
    private long oldTime;
    private long expireTime;
    
    public void Init()
    {
        btn.OnClick = new Action<object>(handleClick);
        saleComponent.Init();    
        
        l_img.Init();
        l_name.Init();
        l_des.Init();
        
        l_num.Init();
        l_sale.Init();        
        
        l_status.Init();
        l_time.Init();    
        divideLine.setBackground("between line_list_small",TextureType.DECORATION);
    }
    
    private void handleClick(object clickParam)
    {
        if(itemNum > 0L)
        {
            MyItems.singleton.UseBoostCombat(itemId, useBoostOk);
        }
        else
        {
            Shop.singleton.swiftBuy(itemId, buyOk);
        }
        
    }

    public override int Draw()
    {
        GUI.BeginGroup(rect);
        
        l_img.Draw();
        l_name.Draw();
        l_des.Draw();
        
        l_num.Draw();
        btn.Draw();
        
        l_status.Draw();
        l_time.Draw();
        l_sale.Draw();
        divideLine.Draw();
        
        saleComponent.Draw();
        
        GUI.EndGroup();
        return -1;
    }
    
    public override void Update()
    {
        saleComponent.Update();
        
        if(l_sale.isVisible() != saleComponent.isShowSale)
        {
            l_sale.SetVisible(saleComponent.isShowSale);
        }
        
        if(inUse)
        {
            curTime = GameMain.unixtime();
            if(curTime > oldTime)
            {
                oldTime = curTime;
                if(curTime < expireTime)
                {
                    l_time.txt = Datas.getArString("Common.TimeRemining") + " " + _Global.timeFormatStr(expireTime - curTime);
                }
                else
                {
                    resetDisplay();
                }
            }
        }
    }
    
    private void resetDisplay()
    {
        itemNum = MyItems.singleton.countForItem(itemId);
        l_num.txt = Datas.getArString("Common.Own") + ": " + itemNum;
        inUse = false;
        
        PropVO pvo = Prop.Instance.getBoostCombatProp(itemId);
        expireTime = pvo.expire;
        
        l_sale.SetVisible(false);
        l_status.SetVisible(false);
        l_time.SetVisible(false);
        
        l_num.SetVisible(true);
        btn.SetVisible(true);

        if(expireTime > GameMain.unixtime())
        {
            inUse = true;
            l_status.SetVisible(true);
            l_time.SetVisible(true);
            saleComponent.SetVisible(false);
            
            l_num.SetVisible(false);
            btn.SetVisible(false);
        }
        else if(itemNum > 0)
        {
            saleComponent.SetVisible(false);

            btn.txt = Datas.getArString("Common.Use_button");
            btn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
            btn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
        }
        else
        {
            btn.txt = Datas.getArString("Common.BuyAndUse_button");
            btn.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_green_normalnew",TextureType.BUTTON);
            btn.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_green_downnew",TextureType.BUTTON);
        
            saleComponent.SetVisible(true);
            
            if(saleComponent.isShowSale)
            {
                l_sale.SetVisible(true);
            }
        }
    }
    
    public void setItemId(int _itemId)
    {
        itemId = _itemId;
        
        l_img.tile = TextureMgr.instance().ItemSpt().GetTile(TextureMgr.instance().LoadTileNameOfItem(itemId));
        l_img.useTile = true;
        
        l_name.txt = Datas.getArString("itemName.i" + itemId);
        l_des.txt = Datas.getArString("itemDesc.i" + itemId);
        
        l_status.txt = Datas.getArString("Common.InUse");
        
        Hashtable item = Shop.singleton.getItem(Shop.ATTACK, itemId);
        saleComponent.setData(_Global.INT32(item["price"]),
                              _Global.INT32(item["salePrice"]),
                              _Global.INT64(item["startTime"]),
                              _Global.INT64(item["endTime"]),
                              _Global.INT32(item["isShow"]));
        
        resetDisplay();
    }
    protected void useBoostOk(int result)
    {
        resetDisplay();
    }

    protected void buyOk()
    {
        resetDisplay();
        MyItems.singleton.UseBoostCombat(itemId, useBoostOk);
    }
}
