class HeroRelicItem extends UIObject
{
    public var relicItem : ComposedUIObj;
    
    public var relicBack : Button;
    public var relicIcon : Label;
    public var relicAdd : Label;
    public var relicSelect : Label;
    public var relicLevel : Label;
    public var relicNameLine : Label;
    public var relicName : Label;
    public var btnLevelUp : Button;
    public var bigBack : Label;
    public var mainSkillDes : Label;
    public var deputySkillDes : Label;
    public var deputySkill1Des : Label;
    public var deputySkill2Des : Label;
    public var deputySkill3Des : Label;
    public var noDeputySkill : Label;
    public var stars : List.<Label> = new List.<Label>();
    public var relicIndex;
    public var isOnEquipClicked : boolean = false;

    public var heroRelicInfo : KBN.HeroRelicInfo;
    //public var star : int;

    public function Init()
    {
        Refresh();
        this.relicBack.OnClick = OnEquip;
        this.btnLevelUp.OnClick = OnLevelUp;
    }

    public function OnEquip(param : Object)
    {
        MenuMgr.getInstance().sendNotification(Constant.HeroRelic.RelicEquipRefresh, relicIndex); 
        if(!isOnEquipClicked)
        {
            MenuMgr.getInstance().sendNotification(Constant.HeroRelic.RelicEquipDisplay, relicIndex);   
        }
        else
        {
            MenuMgr.getInstance().sendNotification(Constant.HeroRelic.RelicEquipHide, null); 
        } 
        isOnEquipClicked = !isOnEquipClicked;
        relicSelect.SetVisible(isOnEquipClicked);
    }

    public function OnLevelUp(param : Object)
    {
        MenuMgr.getInstance().PushMenu("HeroRelicUpgradePopMenu", heroRelicInfo, "trans_zoomComp");
    }

    public function Refresh()
    {
        isOnEquipClicked = false;
        relicSelect.SetVisible(false);
    }

    public function Draw()
    {
        this.relicItem.Draw();
    }

    public function SetDeputyEmpty()
    {
        this.mainSkillDes.txt = String.Empty;
        this.deputySkillDes.txt = String.Empty;
        this.deputySkill1Des.txt = String.Empty;
        this.deputySkill2Des.txt = String.Empty;
        this.deputySkill3Des.txt = String.Empty;
    }

    public function SetOther(flag : boolean)
    {
        this.relicLevel.SetVisible(flag);
        this.relicName.SetVisible(flag);
        this.relicNameLine.SetVisible(flag);
        this.mainSkillDes.SetVisible(flag);
        this.btnLevelUp.SetVisible(flag);
        this.relicIcon.SetVisible(flag);
        this.relicAdd.SetVisible(!flag);
    }

    public function SetEquipState(flag : boolean)
    {
        this.mainSkillDes.SetVisible(flag);
        this.deputySkillDes.SetVisible(flag);
        this.deputySkill1Des.SetVisible(flag);
        this.deputySkill2Des.SetVisible(flag);
        this.deputySkill3Des.SetVisible(flag);
        this.relicName.SetVisible(flag);
        this.relicNameLine.SetVisible(flag);
        this.btnLevelUp.SetVisible(flag);
        this.bigBack.SetVisible(flag);
    }

    public function SetNoData( index : int )
    {
        //Refresh();
        relicIndex = index;

        SetDeputyEmpty();
        SetOther(false);
        this.bigBack.SetVisible(true);
        for(var j : int = 0; j < this.stars.Count; j++)
        {
            this.stars[j].SetVisible(false);
        }
    }

    public function SetData(relicInfo : KBN.HeroRelicInfo, index : int)
    {
        //Refresh();
        heroRelicInfo = relicInfo;
        relicIndex = index;

        SetDeputyEmpty();
        SetOther(true);
        SetEquipState(true);

        this.relicLevel.txt = "Lv " + relicInfo.Level.ToString();
        //this.relicLevel.txt = "Lv " + relicInfo.RelicSetId.ToString();
        this.relicName.txt = relicInfo.RelicName;
        relicIcon.mystyle.normal.background = TextureMgr.instance().LoadTexture(relicInfo.IconName, TextureType.HERORELIC); 

        this.mainSkillDes.txt = Datas.getArString("HeroRelic.MainValue") + relicInfo.MainSkillDesc;
        this.deputySkillDes.txt = Datas.getArString("HeroRelic.DeputyValue");
        var minWidth : float = 0.0f;
        var maxWidth : float = 0.0f;
        this.deputySkillDes.mystyle.CalcMinMaxWidth(GUIContent(deputySkillDes.txt), minWidth, maxWidth);
        if(relicInfo.DeputySkill1 != 0)
        {        
            this.deputySkill1Des.rect.x = Mathf.Ceil(deputySkillDes.rect.x + maxWidth);
            this.deputySkill1Des.txt = relicInfo.DeputySkill1Desc;
        }

        if(relicInfo.DeputySkill2 != 0)
        {
            this.deputySkill2Des.rect.x = Mathf.Ceil(deputySkillDes.rect.x + maxWidth);
            this.deputySkill2Des.txt = relicInfo.DeputySkill2Desc;
        }
        
        if(relicInfo.DeputySkill3 != 0)
        {
            this.deputySkill3Des.rect.x = Mathf.Ceil(deputySkillDes.rect.x + maxWidth);
            this.deputySkill3Des.txt = relicInfo.DeputySkill3Desc;
        }    
        
        SetStars(relicInfo.Tier);

        this.btnLevelUp.SetVisible(true);
        //this.SetStars(star);
    }

    public function SetStars(starCount : int)
    {
        for(var j : int = 0; j < this.stars.Count; j++)
        {
            this.stars[j].SetVisible(false);
        }

        if(starCount % 2 == 0)
        {
            var left : int = 60;
            var right : int = 90;
            for(var i : int = 0; i < starCount; i++)
            {
                if((i + 1) % 2 == 0)
                {
                    stars[i].rect.x = right;
                    right += 30;
                }
                else
                {
                    stars[i].rect.x = left;
                    left -= 30;
                }
                this.stars[i].SetVisible(true);
            }
        }
        else
        {
            var mid : int = 75;
            var midLeft : int = mid - 30;
            var midRight : int = mid + 30; 
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
                        midRight += 30;
                    }
                    else
                    {
                        stars[k].rect.x = midLeft;
                        midLeft -= 30;
                    }
                } 
                this.stars[k].SetVisible(true);            
            }
        }
    }
}