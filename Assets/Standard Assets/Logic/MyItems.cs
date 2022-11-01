using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public class InventoryInfo{
    public int id;
    public int category;
    public int quant;
    public bool useInList;
    public bool mayDropGear; 
    public int belongFteId = -1;
    public int fteFakeCount = -1;
    public string description;
	public int customParam1 = 0;
	public bool isNewGet=false;
};

namespace KBN {
    public abstract class MyItems
	{
		public enum Category
		{
			General = 1,
			Speed = 2,
			Attack = 3,
			Product = 4,
			Chest = 5,	
			Piece = 8,
			MystryChest = 9,
			LevelChest = 10,
			
			TreasureChest = 11,
			TreasureItem = 12,
			
			// LiHaojie 2013.08.07: Add the gear strengthen type
			EquipStrengthen = 13,
			GearItem = 14,

			Buff = 21,
			Troops = 22,
			Gear = 23,
			Hero = 24,
			Exchange = 25,

			CitySkinProp = 26,//城堡皮肤道具

			UnknowItem = 99,
			MonthlyCard=101,   //虚拟类型，仅为月卡判断所用
		};
		
		#region Member Field
		protected HashObject seed;
		protected int[] unusableItemIds = new int[]{9, 361, 362, 363, 401, 402, 1202, 1203,1204, 1205, 2201};
		protected KBN.IntIntervalUnion unusableItemRanges;
		protected KBN.IntIntervalUnion shadowGemItemRanges;
		protected bool m_bNeedUpdate = false;
		protected List<InventoryInfo> generalList = new List<InventoryInfo>();
		protected List<InventoryInfo> speedList= new List<InventoryInfo>();
		protected List<InventoryInfo> attackList= new List<InventoryInfo>();
		protected List<InventoryInfo> productList= new List<InventoryInfo>();
		protected List<InventoryInfo> chestList= new List<InventoryInfo>();
		protected List<InventoryInfo> piecesList = new List<InventoryInfo>();
		protected List<InventoryInfo> buffList = new List<InventoryInfo>();
		protected List<InventoryInfo> troopsList = new List<InventoryInfo>();
		protected List<InventoryInfo> gearList = new List<InventoryInfo> ();
		protected List<InventoryInfo> heroList = new List<InventoryInfo> ();
		protected List<InventoryInfo> exchangeList = new List<InventoryInfo> ();
		
		protected List<InventoryInfo> treasureChestList = new List<InventoryInfo>();
		protected List<InventoryInfo> treasureItemList = new List<InventoryInfo>();
		
		protected List<InventoryInfo> equipStrengthenList = new List<InventoryInfo>();
		protected List<InventoryInfo> newItemsList = new List<InventoryInfo>();

		protected List<InventoryInfo> citySkinPropList = new List<InventoryInfo>();/*城堡皮肤道具*/


		protected List<int> mayDropGearItemIds = new List<int>();

		protected Dictionary<int,int> generalCountDic = new Dictionary<int, int> ();
		protected Dictionary<int,int> speedCountDic = new Dictionary<int, int> ();
		protected Dictionary<int,int> attackCountDic = new Dictionary<int, int> ();
		protected Dictionary<int,int> productCountDic = new Dictionary<int, int> ();
		protected Dictionary<int,int> chestCountDic = new Dictionary<int, int> ();
		protected Dictionary<int, int> buffCountDic = new Dictionary<int, int> ();
		protected Dictionary<int, int> troopsCountDic = new Dictionary<int, int> ();
		protected Dictionary<int, int> gearCountDic = new Dictionary<int, int> ();
		protected Dictionary<int, int> heroCountDic = new Dictionary<int, int> ();
		protected Dictionary<int, int> exchangeCountDic = new Dictionary<int, int> ();
		protected Dictionary<int, int> citySkinPropCountDic = new Dictionary<int, int> ();
		
		public bool isGeneralCountChanged=false;
		public bool isSpeedCountChanged=false;
		public bool isAttackCountChanged=false;
		public bool isProductCountChanged=false;
		public bool isChestCountChanged=false;
		public bool isBuffCountChanged = false;
		public bool isTroopsCountChanged = false;
		public bool isGearCountChanged = false;
		public bool isHeroCountChanged = false;
		public bool isExchangeCountChanged = false;
		public bool isCitySkinPropCountChanged = false;
		
		public void SetMemoryTabPage(int page)
		{
			PlayerPrefs.SetInt(Constant.ShopAndMyItemsTabMemory.MyItemsTabMemory, page);
		}

		public int GetMemoryTabPage()
		{
			if(PlayerPrefs.HasKey(Constant.ShopAndMyItemsTabMemory.MyItemsTabMemory))
			{
				int page = PlayerPrefs.GetInt(Constant.ShopAndMyItemsTabMemory.MyItemsTabMemory);
				return page;
			}

			return 0;
		}

		public void SetMemoryTabPos(float pos)
		{
			PlayerPrefs.SetFloat(Constant.ShopAndMyItemsTabMemory.MyItemsTabListPos, pos);
		}

		public float GetMemoryTabPos()
		{
			if(PlayerPrefs.HasKey(Constant.ShopAndMyItemsTabMemory.MyItemsTabListPos))
			{
				float pos = PlayerPrefs.GetFloat(Constant.ShopAndMyItemsTabMemory.MyItemsTabListPos);
				return pos;
			}
			
			return 0f;
		}

		#endregion

		public static MyItems singleton { get; protected set; }
		public bool IsShowItemChangeMsg=false;
        public abstract void AddItemWithCheckDropGear(int itemId, int quant);
        public abstract void AddItem(int itemId, int quant);
		public long countForItem(int itemId)
		{
			return seed["items"]["i" + itemId] != null ? _Global.INT64(seed["items"]["i" + itemId].Value) : 0;
		}

		public abstract int subtractItem(int itemId, int count);

		public abstract void SubtractGems(int cost);
		public abstract int subtractItem(int itemId);
		public abstract void AddItem(int itemId);
		public abstract void AddItemDropGear(int itemId, bool mayDropGear);
		public abstract void AddCarmotLootItem(int marchId);

		[JasonReflection.JasonData]
		private class BatchUseConfig
		{
			public int startindex;
			public int endindex;
			public int useflag;
			public int purchaseflag;
		}

		private BatchUseConfig[] m_batchitem;
		[JasonReflection.JasonData]
		class BatchConfig
		{
			public BatchUseConfig[] m_batchitem;
		}

		public void SetBatchConfig(HashObject dat)
		{
			if ( dat == null )
				return;
			var batchitem = dat["batchitem"];
			if ( batchitem == null )
				return;
			var brObj = new HashObject();
			brObj["m_batchitem"] = batchitem;
			var batchConfig = new BatchConfig();
			if ( JasonReflection.JasonConvertHelper.ParseToObjectOnce(batchConfig, brObj) )
				m_batchitem = batchConfig.m_batchitem;
		}

		public bool IsCanBatchBuy(int itemId)
		{
			if ( m_batchitem == null )
				return false;
			for ( int i = 0; i != m_batchitem.Length; ++i )
			{
				if ( m_batchitem[i].startindex <= itemId && itemId <= m_batchitem[i].endindex )
					return m_batchitem[i].purchaseflag != 0;
			}
			return false;
		}

		public bool IsCanBatchUse(int itemId)
		{
			if ( m_batchitem == null )
				return false;
			for ( int i = 0; i != m_batchitem.Length; ++i )
			{
				if ( m_batchitem[i].startindex <= itemId && itemId <= m_batchitem[i].endindex )
					return m_batchitem[i].useflag != 0;
			}
			return false;
		}
		
		public bool M_bNeedUpdate {
			get {
				return m_bNeedUpdate;
			}
			set {
				m_bNeedUpdate = value;
			}
		}

		public bool priv_isItemCanUse(int itemId , int category )
		{
			if ( infilterUnuseItems(itemId) )
				return false;
			if ( category == (int)Category.Speed )
				return false;
			if ( category == (int)Category.Piece )
				return false;
			if ( category == (int)Category.UnknowItem )
				return false;
			if ( category == (int)Category.Exchange )
				return false;
			if ( Constant.ItemId.STAKE_BEGIN_ID < itemId && itemId < Constant.ItemId.STAKE_END_ID )
				return false;
			if((itemId >= 21000 && itemId <= 21002) || (itemId >= 21501 && itemId <= 21509))
			{
				return GameMain.singleton.IsVipOpened();
			}
			return true;
		}

		public bool infilterUnuseItems(int itemId)
		{
			if(_Global.IsValueInArray(unusableItemIds, itemId) || (itemId >= 2305 && itemId <= 2350) 
			   || (itemId >= 2201 && itemId <= 2210) || (itemId >= 4000 && itemId <= 4018)
			   || (itemId >= 5101 && itemId <= 5104) || (itemId >= 5001 && itemId <= 5004)
			   ||(itemId >= 4201 && itemId <= 4215)
			   ||( itemId >= 4600 && itemId <= 4700)
			   ||	itemId == Constant.ItemId.WHEELGAME_TOKEN
			   || (4028 <= itemId && itemId <= 4050)
			   || unusableItemRanges.Contains(itemId)
			   )
				return true;
			
			return false;
		}

		public List<InventoryInfo> GetList(Category category)
		{
			switch(category)
			{
			case Category.General:
				//generalList.Sort(SortItem_Basic);
				//generalList = ResortList(generalList);
				return generalList;
			case Category.Speed:

				return 	speedList;
			case Category.Attack:

				return 	attackList;
			case Category.Product:
				//productList.Sort(SortItem_Basic);
				//productList = ResortList(productList);
				return productList;
			case Category.Chest:
			case Category.LevelChest:
			case Category.MystryChest:
			case Category.UnknowItem:

				return chestList;
			case Category.Buff:
				return buffList;
			case Category.Troops:
				return troopsList;
			case Category.Gear:
				return gearList;
			case Category.Hero:
				return heroList;
			case Category.Exchange:
				return exchangeList;
			case Category.Piece:
				return piecesList;
			case Category.TreasureChest:
				return treasureChestList;
			case Category.TreasureItem:
				return treasureItemList;
			case Category.EquipStrengthen:
				return equipStrengthenList;
			case Category.CitySkinProp:
				return citySkinPropList;
			default:
				return generalList;
			}
		}
		public InventoryInfo GetInventoryInfo(int id, Category category)
		{
			var list = GetList(category);
			if (null == list || list.Count == 0) return null;
			
			for (int i = 0; i < list.Count; i++)
			{
				var item = list[i];
				if (item.id == id)
				{
					return item;
				}
			}
			
			return null;
		}
		public int GetItemCount(int itemId)
		{
			if(seed == null) return 0;
			if(seed["items"] == null) return 0;

			if (seed["items"]["i" + itemId] != null)
				return _Global.INT32(seed["items"]["i" + itemId.ToString()]);
			return 0;
		}

        protected int SortItem_Basic(InventoryInfo a, InventoryInfo b)
        {
            return b.id - a.id;
        }
		protected int FteChestSort(InventoryInfo a, InventoryInfo b)
		{
			return a.id - b.id;
		}

		protected List<InventoryInfo>  ResortList(List<InventoryInfo> srcList)
		{
			List<InventoryInfo> retList = new List<InventoryInfo> ();
			HashObject itemOrderObj = Datas.singleton.itemOrders ();
			if (itemOrderObj == null)
				return srcList;
			object[] arr = _Global.GetObjectValues(itemOrderObj);
			object[] arr2;
			object[] arr3;
			HashObject obj1 = null;
			HashObject obj2 = null;
			int minItemId = 0;
			int maxItemId = 0;
			for(int i=0;i<arr.Length;i++)
			{
				obj1 = arr[i] as HashObject;
				arr2 = _Global.GetObjectValues(obj1);
				for(int j=0;j<arr2.Length;j++)
				{
					obj2 = arr2[j] as HashObject;
					arr3 = _Global.GetObjectValues(obj2);
					if(arr3.Length == 2)
					{
						minItemId = _Global.INT32(arr3[0]);
						maxItemId = _Global.INT32(arr3[1]);
						for(int k=0;k<srcList.Count;k++)
						{
							if(srcList[k].id >= minItemId && srcList[k].id <= maxItemId)
							{
								retList.Add(srcList[k]);
								srcList.RemoveAt(k);
								k--;
							}
						}
					}
				}
			}
			for(int m=0;m<srcList.Count;m++)
			{
				retList.Add(srcList[m]);
			}

			List<InventoryInfo> finalList = new List<InventoryInfo> ();
			for(int n=0;n<retList.Count;n++)
			{
				if(retList[n].useInList || IsCanBatchUse(retList[n].id))
				{
					//_Global.Log("In Use: " + retList[n].id);
					finalList.Add(retList[n]);
					retList.RemoveAt(n);
					n--;
				}
				else
				{
					//_Global.Log("can not Use: " + retList[n].id);
				}
			}
			for(int q=0;q<retList.Count;q++)
			{
				finalList.Add(retList[q]);
			}
			return finalList;
		}

		public abstract void Use(int itemId, int itemCnt, bool floatMsg);

        public abstract void UseBoostCombat(int itemId, Action<int> userOkFunc);

		public List<InventoryInfo> GetAvaSpeedItemList()
		{
			int[] AvaSpeedUpItemIds = {6805,6804,6803,6802};
			List<InventoryInfo> retList = new List<InventoryInfo> ();
			InventoryInfo item;
			for(int i=0;i<AvaSpeedUpItemIds.Length;i++)
			{
				item = new InventoryInfo();
				item.id = AvaSpeedUpItemIds[i];
				object val = Convert.ChangeType(Category.Speed, Category.Speed.GetTypeCode());
				item.category = (int)val;

				item.description = Datas.getArString("itemDesc.i" + item.id);
				item.quant = (int)countForItem(item.id);
				item.useInList = false;
				retList.Add(item);
			}
			return retList;
		}

		public static Category GetItemCategoryByItemId(int itemId)
		{
			Category category;		
			if(MystryChest.singleton.IsMystryChest(itemId))
			{
				if(MystryChest.singleton.IsExchangeChest(itemId))
				{
					category = Category.Exchange;
				}
				else
				{
					category = Category.MystryChest;					
				}
			}
			else if(MystryChest.singleton.IsLevelChest(itemId))
			{
				category = Category.LevelChest;
			}
			else
			{
				HashObject item = (Datas.singleton.itemlist())["i" + itemId.ToString()];
				if ( item == null )
					return Category.UnknowItem;
				category = (Category)Enum.ToObject(typeof(Category),_Global.INT32(item["category"]));
			}
			return category;
		}

		public static string GetItemName(int itemId)
		{
			string itemName;
			Category category = GetItemCategoryByItemId (itemId);
			if(category == Category.MystryChest)
				itemName = MystryChest.singleton.GetChestName(itemId);
			else
				itemName = Datas.getArString("itemName."+"i" + itemId);

			return itemName;
		}

		public static string GetItemDesc(int itemId)
		{
			string desc;
			Category category = GetItemCategoryByItemId (itemId);
			if(category == MyItems.Category.MystryChest)
			{	
				desc = MystryChest.singleton.GetChestDesc(itemId);	
			}
			else
			{
				if(category == Category.Chest )
					desc = Datas.getArString("Common.LookInside");
				else 
					desc = Datas.getArString("itemDesc.i" + itemId);	
			}
			return desc;
		}

		public void AddNewItem(InventoryInfo inv){
			newItemsList.Add(inv);
		}

		public void ReseaseNewItemList(){
			for (int i = 0; i < newItemsList.Count; i++) {
				newItemsList[i].isNewGet=false;
			}
			newItemsList.Clear ();
		}

		public void saveItemCoutDic() {
			saveDic<InventoryInfo> (generalList, generalCountDic);
			saveDic<InventoryInfo> (speedList, speedCountDic);
			saveDic<InventoryInfo> (attackList, attackCountDic);
			saveDic<InventoryInfo> (productList, productCountDic);
			saveDic<InventoryInfo> (chestList, chestCountDic);
			saveDic<InventoryInfo> (buffList, buffCountDic);
			saveDic<InventoryInfo> (troopsList, troopsCountDic);
			saveDic<InventoryInfo> (gearList, gearCountDic);
			saveDic<InventoryInfo> (heroList, heroCountDic);
			saveDic<InventoryInfo> (exchangeList, exchangeCountDic);
			saveDic<InventoryInfo>(citySkinPropList, citySkinPropCountDic);
		}

		void saveDic<T>(List<T> list,Dictionary<int,int> dic) where T:InventoryInfo{
			foreach (var item in list) {
				if(dic.ContainsKey(item.id)){
					dic[item.id]=item.quant;
				}else{
					dic.Add(item.id,item.quant);
				}
			}
		}
		//check item count change
		public	void checkItemCount(){
			if(!checkDic(generalList,generalCountDic)){
				isGeneralCountChanged=true;
			}
			if(!checkDic(speedList,speedCountDic)){
				isSpeedCountChanged=true;
			}
			if(!checkDic(attackList,attackCountDic)){
				isAttackCountChanged=true;
			}
			if(!checkDic(productList,productCountDic)){
				isProductCountChanged=true;
			}
			if(!checkDic(chestList,chestCountDic)){
				isChestCountChanged=true;
			}
			if (!checkDic (buffList, buffCountDic)) {
				isBuffCountChanged = true;
			}
			if (!checkDic (troopsList, troopsCountDic)) {
				isTroopsCountChanged = true;
			}
			if (!checkDic (gearList, gearCountDic)) {
				isGearCountChanged = true;
			}
			if (!checkDic (heroList, heroCountDic)) {
				isHeroCountChanged = true;
			}
			if (!checkDic (exchangeList, exchangeCountDic)) {
				isExchangeCountChanged = true;
			}

			if (!checkDic(citySkinPropList, citySkinPropCountDic))
			{
				isCitySkinPropCountChanged = true;
			}
		}

		//if item count dosen't change,return true,else returnfalse
		bool checkDic<T>(List<T> list,Dictionary<int,int> dic) where T:InventoryInfo{
			if (list.Count != dic.Count)
				return false;
			foreach (var item in list) {
				if(dic.ContainsKey(item.id)){

					if(dic[item.id]!=item.quant)
						return false;
				}
			}
			return true;
		}


	}
}
