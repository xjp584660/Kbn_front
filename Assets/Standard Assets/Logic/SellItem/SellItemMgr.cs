using UnityEngine;
using System.Collections;
using System.Collections.Generic;
namespace KBN
{
	public class SellItemMgr 
	{
		private static SellItemMgr singleton;
		public	static	SellItemMgr	instance()
		{
			if(singleton == null)
			{
				singleton = new SellItemMgr();
			}
			return singleton;
		}

		public void RequestSell(int itemId,int itemNum)
		{
			PBMsgReqSellItem.PBMsgReqSellItem request = new PBMsgReqSellItem.PBMsgReqSellItem ();
			request.itemId = itemId;
			request.itemNum = itemNum;
			request.cityId = GameMain.singleton.getCurCityId ();
			UnityNet.RequestForGPB("sellItem.php", request, OnSellOk, null);
		}

		private void OnSellOk(byte[] data)
		{
			if(data == null)
			{
				return;
			}
			PBMsgSellItem.PBMsgSellItem response = _Global.DeserializePBMsgFromBytes<PBMsgSellItem.PBMsgSellItem>(data);
			MyItems.singleton.subtractItem (response.itemId, response.itemNum);
			Resource.singleton.addToSeed (Constant.ResourceType.GOLD, response.totalGold, response.cityId);
			Resource.singleton.UpdateRecInfo();
			MenuMgr.instance.SendNotification (Constant.Notice.SellItemOK);
			string msg = string.Format (Datas.getArString ("ToasterMsg.ItemSold"), response.totalGold);
			MenuMgr.instance.PushMessage(msg);
		}

		public bool CanSell(int itemId)
		{
			// GDS_SellItem gds = GameMain.GdsManager.GetGds<GDS_SellItem>();
			// Dictionary<string,DataTable.IDataItem> dicSellItem = gds.GetItemDictionary ();
			// return dicSellItem.ContainsKey (itemId.ToString ());
			bool isCanSell = true;
			GDS_UnSellItem gds = GameMain.GdsManager.GetGds<GDS_UnSellItem>();
			if(gds ==null)
			{
	          return isCanSell;
			}
		
			Dictionary<string,DataTable.IDataItem> dic = gds.GetItemDictionary ();
			foreach(string key in dic.Keys)
			{
               KBN.DataTable.UnSellitem item = dic[key] as KBN.DataTable.UnSellitem;
			   if(item!=null && ( itemId >= item.STARTITEMID && itemId <= item.ENDITEMID))
			   {
                   isCanSell = false;
				   break;
			   }
			}
            return isCanSell;

		}
		
		public int GetSellItemPrice(int itemId)
		{
			// GDS_SellItem gds = GameMain.GdsManager.GetGds<GDS_SellItem>();
			// Dictionary<string,DataTable.IDataItem> dicSellItem = gds.GetItemDictionary ();
			// KBN.DataTable.IDataItem gdsItem = null;
			// if (dicSellItem.TryGetValue (itemId.ToString (), out gdsItem)) 
			// {
			// 	KBN.DataTable.SellItem gdsSellItem = gdsItem as KBN.DataTable.SellItem;
			// 	return gdsSellItem.PRICE;
			// }
			HashObject seed = GameMain.singleton.getSeed();
			if(seed !=null && seed["sellItemPrice"]!=null){
				return _Global.INT32( seed["sellItemPrice"]);
			}
			return 0;
		}

		public bool CheckIsGearDrop(int id){
			PBData.PBMsgResMystryChest.ChestData chestData = KBN.MystryChest.singleton.GetChestItemRawData(id);
			if(chestData!=null){
			return chestData.gearDrop!=null&&chestData.gearDrop.Count > 0 && CanSell(id);
			}else{
				return false;
			}
		}
	}
}