#pragma strict

public class HeroSimpleRelicItem extends ListItem
{
    public var relicBack : Button;
    public var relicIcon : Label;
    public var relicLock : Label;
    public var relicSelect : Label;
    public var relicLevel : Label;
    public var stars : List.<Label> = new List.<Label>();
    private var relicInfo : KBN.HeroRelicInfo;
    private var simpleRelicItemType : KBN.SimpleRelicItemType;

    public function Init()
    {
        relicBack.OnClick = OnRelicClick;
        relicSelect.SetVisible(false);
    }

    // public function SetSimpleRelicEquipType()
    // {
    //     simpleRelicItemType = SimpleRelicItemType.EquipType;
    // }

    // public function SetSimpleRelicUpgradeType()
    // {
    //     simpleRelicItemType = SimpleRelicItemType.UpgradeType;
    // }

    // public function SetSimpleRelicWarehouseType()
    // {
    //     simpleRelicItemType = SimpleRelicItemType.WareHouseType;
    // }

    public function GetHeroRelicInfo() : KBN.HeroRelicInfo
    {
        return relicInfo;
    }

    public function get RelicSelect() : boolean
    {
        return relicSelect.isVisible();
    }

    public function set RelicSelect(value : boolean)
    {
        relicSelect.SetVisible(value);
    }

    public function SetLockStatue(value : boolean)
    {
        relicLock.SetVisible(value);
    }

    public function SetRowData(data : Object)
    {
        //simpleRelicItemType = KBN.HeroRelicManager.instance().simpleRelicItemType;
        relicInfo = data as KBN.HeroRelicInfo;
        relicLevel.txt = "Lv " + relicInfo.Level.ToString();
        //relicLevel.txt = "Lv " + relicInfo.RelicSetId.ToString();
        SetStars(relicInfo.Tier);
        relicLock.SetVisible(relicInfo.Status == 2);
        relicIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture(relicInfo.IconName, TextureType.HERORELIC); 

        relicSelect.SetVisible(relicInfo.IsSelected);
    }

    public function SetStars(starCount : int)
    {
        for(var j : int = 0; j < this.stars.Count; j++)
        {
            this.stars[j].SetVisible(false);
        }

        if(starCount % 2 == 0)
        {
            var left : int = 53;
            var right : int = 74;
            for(var i : int = 0; i < starCount; i++)
            {
                if((i + 1) % 2 == 0)
                {
                    stars[i].rect.x = right;
                    right += 21;
                }
                else
                {
                    stars[i].rect.x = left;
                    left -= 21;
                }
                this.stars[i].SetVisible(true);
            }
        }
        else
        {
            var mid : int = 64;
            var midLeft : int = mid - 21;
            var midRight : int = mid + 21; 
            for(var k : int = 0; k < starCount; k++)
            {
                if(k == 0)
                {
                    stars[k].rect.x = mid;
                }
                else
                {
                    if((k + 1) % 2 == 0)
                    {
                        stars[k].rect.x = midRight;
                        midRight += 21;
                    }
                    else
                    {
                        stars[k].rect.x = midLeft;
                        midLeft -= 21;
                    }
                } 
                this.stars[k].SetVisible(true);            
            }
        }
    }

    public function Draw()
    {
        GUI.BeginGroup(rect);	

        relicBack.Draw();
        relicIcon.Draw();
        relicSelect.Draw();
        relicLevel.Draw();

        if(KBN.HeroRelicManager.instance().simpleRelicItemType == KBN.SimpleRelicItemType.WareHouseType)
        {
            relicLock.Draw();
        }
        
        for(var i : int = 0; i < this.stars.Count; ++i)
        {
            stars[i].Draw();
        }

		GUI.EndGroup();
    }

    public function OnRelicClick()
    {
        switch(KBN.HeroRelicManager.instance().simpleRelicItemType)
        {
            case KBN.SimpleRelicItemType.EquipType :
                handlerDelegate.handleItemAction(Constant.HeroRelic.RelicEquipSelect, this);
                break;
            case KBN.SimpleRelicItemType.UpgradeType :
                //relicSelect.SetVisible(!relicSelect.isVisible());
                if(!relicSelect.isVisible())
                {
                    MenuMgr.getInstance().sendNotification(Constant.HeroRelic.RelicAddUpgradeItem, relicInfo); 
                }
                else
                {
                    MenuMgr.getInstance().sendNotification(Constant.HeroRelic.RelicRemoveUpgradeItem, relicInfo); 
                }
                break;
            case KBN.SimpleRelicItemType.WareHouseType :
                relicSelect.SetVisible(true);
                MenuMgr.getInstance().sendNotification(Constant.HeroRelic.RelicSelectWarehouseItem, relicInfo); 
                break;
        }       
    }
}