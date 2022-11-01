using UnityEngine;
using System;
using System.Collections;

namespace KBN
{
	public abstract class Shop
	{
		public static Shop singleton { get; protected set; }

		public abstract Hashtable getItem(int _type, int _id);

		public abstract void BuyInventory(int itemId, int price, int buyCount, bool inMayDropGear, Action successOK);

		public abstract void swiftBuy(int itemId, Action buyCallback);

        public const int GENERAL = 1;
        public const int SPEEDUP = 2;
        public const int ATTACK = 3;
        public const int PRODUCT = 4;
        public const int CHEST = 5;
        public const int PIECE = 8; //piece of artifact
		public const int BUFF = 21;
		public const int TROOPS = 22;
		public const int GEAR = 23;
		public const int HERO = 24;
		public const int EXCHANGE = 25;
		public const int CITY_SKIN_PROP = 26;//城堡换肤的皮肤加时间的道具

		public void SetMemoryTabPage(int page)
		{
			PlayerPrefs.SetInt(Constant.ShopAndMyItemsTabMemory.ShopTabMemory, page);
		}

		public int GetMemoryTabPage()
		{
			if(PlayerPrefs.HasKey(Constant.ShopAndMyItemsTabMemory.ShopTabMemory))
			{
				int page = PlayerPrefs.GetInt(Constant.ShopAndMyItemsTabMemory.ShopTabMemory);
				return page;
			}

			return 0;
		}
	}
}