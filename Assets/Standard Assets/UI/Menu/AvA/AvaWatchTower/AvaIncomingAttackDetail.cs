using UnityEngine;
using System.Collections;
using System;
using System.Collections.Generic;

using MenuMgr = KBN.MenuMgr;
using _Global = KBN._Global;
using Datas = KBN.Datas;
using HeroInfo = KBN.HeroInfo;
using GameMain = KBN.GameMain;

// ComingAttackDetail.js is the prototype of this class, which is a bit hard to reuse or directly converted to C#
// with the current limited dev time. So although this violates the principle of DRY, we have to put up with it for
// now.
public class AvaIncomingAttackDetail : UIObject
{
    public Action OnGoBack { get; set; }

    [SerializeField]
    private Button btnBack;
    [SerializeField]
    private Label title;

    [SerializeField]
    private UIList techList;
    [SerializeField]
    private UIList troopList;
    [SerializeField]
    private UIList heroList;
    [SerializeField]
    private Label target;
    [SerializeField]
    private Label arrivalTime;
    //[SerializeField]
    //private Label alliance;
    [SerializeField]
    private Label armySize;
    [SerializeField]
    private Label attacker;
    [SerializeField]
    private Label generalLevel;
    [SerializeField]
    private Label targetContent;
    [SerializeField]
    private Button targetBtn;

    [SerializeField]
    private Label arrivalTimeContent;
    //[SerializeField]
    //private Label allianceContent;
    [SerializeField]
    private Label armySizeContent;
    [SerializeField]
    private Label attackerContent;
    [SerializeField]
    private Label generalLevelContent;
    [SerializeField]
    private Label enemyResearch;
    [SerializeField]
    private Label enemyTroop;
    [SerializeField]
    private Label enemyHero;

    private List<ListItem> troopItems = new List<ListItem>();
    [SerializeField]
    private ListItem troopItem;

    private List<ListItem> techItems = new List<ListItem>();
    [SerializeField]
    private ListItem techItem;

    private List<ListItem> heroItems = new List<ListItem>();
    [SerializeField]
    private ListItem heroItem;

    public const float DefaultRowHeight = 130f;

    [SerializeField]
    private ComposedUIObj post;
    [SerializeField]
    private ScrollView scrollView;
    [SerializeField]
    private ComposedUIObj detail;
    [SerializeField]
    private Label l_bg;
    //[SerializeField]
    //private Label line2;
    [SerializeField]
    private Label noTech;
    [SerializeField]
    private Label noTroop;
    [SerializeField]
    private Label noHero;

    [SerializeField]
    private FontColor coordColor = FontColor.Blue;

    public const int DefaultMargin = 5;

    private AvaIncomingAttackDetailData cachedData;

    private class InternalUIList
    {
        public UIList uiList;
        public List<ListItem> items;
        public ListItem itemTemplate;
        public Label title;
        public string titleKey;
        public Label emptyText;
        public Func<string> getEmptyKey;

        public void Init()
        {
            uiList.Init();
            uiList.growDown = true;
        }

        public void Clear()
        {
            uiList.Clear();
            
            for (int i = 0; i < items.Count; ++i)
            {
                TryDestroy(items[i]);
            }
            items.Clear();
        }

        public void PopulateData<TData>(List<TData> dataList, Action<TData, ListItem> setRowData)
        {
            title.txt = Datas.getArString(titleKey);
            emptyText.rect.y = uiList.rect.y = title.rect.yMax + AvaIncomingAttackDetail.DefaultMargin;

            items.Clear();
            for (int i = 0; i < dataList.Count; ++i)
            {
                items.Add(Instantiate(itemTemplate) as ListItem);
                items[i].Init();
                setRowData(dataList[i], items[i]);
                uiList.AddItem(items[i]);
            }

            if (dataList.Count <= 0)
            {
                items.Add(Instantiate(itemTemplate) as ListItem);
                items[0].SetVisible(false);
                items[0].rect.height = DefaultRowHeight;
                uiList.AddItem(items[0]);

                emptyText.txt = Datas.getArString(getEmptyKey());
                emptyText.SetVisible(true);
            }
            else
            {
                emptyText.SetVisible(false);
            }
        }
    }

    private InternalUIList internalTechList;
    private InternalUIList internalTroopList;
    private InternalUIList internalHeroList;

    private InternalUIList[] internalUILists;

    private string GetDefaultEmptyKey()
    {
        return "WatchTower.UpgradeMsg";
    }

    private string GetHeroEmptyKey()
    {
        if (cachedData.KnightLevel <= 0)
        {
            return GetDefaultEmptyKey();
        }
        return "AVA.chrome_attackme_NoHero";
    }

    private string GetTechEmptyKey()
    {
        if (cachedData.KnightLevel <= 0 || !GameMain.Ava.Seed.CanSeeEnemyResearch)
        {
            return GetDefaultEmptyKey();
        }
        return "AVA.chrome_attackme_NoTech";
    }

    private void InitInternalUILists()
    {
        internalTechList = new InternalUIList
        {
            uiList = techList,
            items = techItems,
            itemTemplate = techItem,
            title = enemyResearch,
            titleKey = "WatchTower.EnemyResearch",
            emptyText = noTech,
            getEmptyKey = GetTechEmptyKey,
        };

        internalTroopList = new InternalUIList
        {
            uiList = troopList,
            items = troopItems,
            itemTemplate = troopItem,
            title = enemyTroop,
            titleKey = "Common.Troops",
            emptyText = noTroop,
            getEmptyKey = GetDefaultEmptyKey,
        };

        internalHeroList = new InternalUIList
        {
            uiList = heroList,
            items = heroItems,
            itemTemplate = heroItem,
            title = enemyHero,
            titleKey = "Dungeon.Detail_SubTitle1",
            emptyText = noHero,
            getEmptyKey = GetHeroEmptyKey,
        };

        internalUILists = new InternalUIList[]
        {
            internalTechList,
            internalTroopList,
            internalHeroList,
        };

        for (int i = 0; i < internalUILists.Length; ++i)
        {
            internalUILists[i].Init();
        }
    }

    private void InitButtons()
    {
        btnBack.OnClick = new Action<object>(delegate (object param)
        {
            if (this.OnGoBack != null)
            {
                this.OnGoBack();
            }
        });
        
        targetBtn.OnClick = new Action<object>(OnClickTarget);
    }

    private void InitComposedUIObjects()
    {
        post.component = new UIObject[]
        {
            l_bg,
            target,
            targetContent,
            targetBtn,
            arrivalTime,
            arrivalTimeContent,
            attacker,
            attackerContent,
            //alliance,
            //allianceContent,
            armySize,
            armySizeContent,
            generalLevel,
            generalLevelContent,
        };
        
        detail.component = new UIObject[]
        {
            post,
            noTech,
            techList,
            //line2,
            noHero,
            heroList,
            noTroop,
            troopList,
            enemyResearch,
            enemyTroop,
            enemyHero,
        };  
        
        scrollView.component = new UIObject[]
        {
            detail,
        };
    }

    private void InitTextures()
    {
        //line2.setBackground("between line", TextureType.DECORATION);
        l_bg.setBackground("square_black2", TextureType.DECORATION);
        enemyTroop.setBackground("Brown_Gradients", TextureType.DECORATION);
        enemyHero.setBackground("Brown_Gradients", TextureType.DECORATION);
        enemyResearch.setBackground("Brown_Gradients", TextureType.DECORATION);
    }

    private void InitTexts()
    {
        generalLevel.txt = Datas.getArString("WatchTower.GeneralLevel");
        armySize.txt = Datas.getArString("WatchTower.ArmySize") ;
        target.txt = Datas.getArString("Common.Target");
        attacker.txt = Datas.getArString("Common.Attacker");
        //alliance.txt = Datas.getArString("Common.Alliance");
        arrivalTime.txt = Datas.getArString("Common.Arrival");
        
        noTech.txt = Datas.getArString("WatchTower.UpgradeMsg");
        noTroop.txt = Datas.getArString("WatchTower.UpgradeMsg");
        noHero.txt = Datas.getArString("WatchTower.UpgradeMsg");
        title.txt = Datas.getArString("WatchTower.IncomingAttacks");
    }

    public override void Init()
    {
        base.Init();
        InitInternalUILists();
        InitButtons();
        InitComposedUIObjects();
        InitTextures();
        InitTexts();
    }

    private void PopulatePostUI()
    {
        string upgrade = Datas.getArString("WatchTower.UpgradeMsg");
        if (cachedData.CoordX == 0 || cachedData.CoordY == 0)
        {
            targetContent.txt = cachedData.ToTileName;

            targetBtn.SetDisabled(true);
        }
        else
        {
            var colorStr = _Global.FontColorEnumToString(this.coordColor);
            targetContent.txt = string.Format("{0} <color={3}>({1},{2})</color>", cachedData.ToTileName, cachedData.CoordX, cachedData.CoordY, colorStr);

            
            targetBtn.SetDisabled(false);
            targetBtn.rect = targetContent.rect;
            targetBtn.rect.width = _Global.GUICalcWidth(targetContent.mystyle, targetContent.txt);
        }

        if (string.IsNullOrEmpty(cachedData.AttackerName))
        {
            attackerContent.txt = upgrade;
        }
        else
        {
            attackerContent.txt = cachedData.AttackerName;
        }
        //allianceContent.txt = cachedData.AttackerAlliance;
        
        if (cachedData.ArmySize > 0)
        {
            armySizeContent.txt = cachedData.ArmySize.ToString();
        }
        else
        {
            armySizeContent.txt = upgrade;
        }
        
        if (cachedData.KnightLevel > 0)
        {
            generalLevelContent.txt = cachedData.KnightLevel.ToString();
        }
        else
        {
            generalLevelContent.txt = upgrade;
        }

        arrivalTimeContent.txt = upgrade;
    }

    private void SetTechRowData(AvaIncomingAttackDetailData.ResearchOrSkill data, ListItem listItem)
    {
        listItem.description.txt = "Lv " + data.Level.ToString();
        listItem.icon.useTile = true;

        switch (data.ItsCategory)
        {
        case AvaIncomingAttackDetailData.ResearchOrSkill.Category.AvaPlayerSkill:
            listItem.icon.tile = GameMain.Ava.PlayerSkill.GetPlayerSkill(data.Id).Icon;
            break;
        default:
            listItem.icon.tile = TextureMgr.instance().UnitSpt().GetTile(string.Format("timg_{0}", data.Id));
            break;
        }
    }

    private void PopulateEnemyResearchList()
    {
        internalTechList.PopulateData<AvaIncomingAttackDetailData.ResearchOrSkill>(cachedData.Researches, SetTechRowData);
    }

    private void SetTroopRowData(AvaIncomingAttackDetailData.Troop data, ListItem listItem)
    {
        listItem.description.txt = data.Count.ToString();
        listItem.icon.useTile = true;
        listItem.icon.tile =  TextureMgr.instance().UnitSpt().GetTile("ui_" + data.Id.ToString());
    }

    private void PopulateEnemyTroopList()
    {
        internalTroopList.PopulateData<AvaIncomingAttackDetailData.Troop>(cachedData.Troops, SetTroopRowData);
    }

    private void SetHeroRowData(AvaIncomingAttackDetailData.Hero data, ListItem listItem)
    {
        listItem.icon.useTile = true;
        listItem.SetRowData(data);
    }

    private void PopulateEnemyHeroList()
    {
        internalHeroList.PopulateData<AvaIncomingAttackDetailData.Hero>(cachedData.Heros, SetHeroRowData);
    }

    public override void SetUIData(object data)
    {
        this.Clear();
        this.cachedData = data as AvaIncomingAttackDetailData;
        PopulatePostUI();
        enemyResearch.rect.y = post.rect.yMax + DefaultMargin;
        PopulateEnemyResearchList();
        //line2.rect.y = techList.rect.yMax + DefaultMargin;
        enemyHero.rect.y = techList.rect.yMax + DefaultMargin;
        PopulateEnemyHeroList();
        enemyTroop.rect.y = heroList.rect.yMax + DefaultMargin;
        PopulateEnemyTroopList();
        detail.rect.height = troopList.rect.yMax;
        scrollView.AutoLayout();
        scrollView.MoveToTop();
    }

    public override int Draw()
    {
        GUI.BeginGroup(this.rect);
        title.Draw();
        btnBack.Draw();
        scrollView.Draw();
        GUI.EndGroup();
        return -1;
    }

    public override void Update()
    {
        base.Update();
        UpdateArrivalTime();
        this.scrollView.Update();
    }

    private void UpdateArrivalTime()
    {
        if (cachedData.ArrivalTime == null)
        {
            arrivalTimeContent.txt = Datas.getArString("WatchTower.UpgradeMsg");
        }
        else
        {
            long timeLeft = cachedData.ArrivalTime.Value - GameMain.unixtime();
            if (timeLeft < 0L)
            {
                timeLeft = 0L;
            }

            arrivalTimeContent.txt = _Global.timeFormatStr(timeLeft);
        }
    }

    public void Clear()
    {
        for (int i = 0; i < this.internalUILists.Length; ++i)
        {
            internalUILists[i].Clear();
        }
    }

    public override void OnPopOver()
    {
        base.OnPopOver();
        this.Clear();
    }

    private void OnClickTarget(object param)
    {
        if (MenuMgr.instance.hasMenuByName("AvaMainChrome"))
        {
            MenuMgr.instance.pop2Menu("AvaMainChrome");
        }

        GameMain.singleton.setSearchedTileToHighlight2(cachedData.CoordX, cachedData.CoordY);
        GameMain.singleton.gotoMap2(cachedData.CoordX, cachedData.CoordY);
    }
}
