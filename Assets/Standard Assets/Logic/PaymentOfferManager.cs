using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using KBN;

using _Global = KBN._Global;
using Datas = KBN.Datas;

public class PaymentOfferManager : object
{
//    public enum Category
//    {
//        NonPayer = 1,
//        Payer,
//        Other,
//    }
//
//    public enum DisplayPosition
//    {
//        Upper = 1,
//        Lower,
//    }

    public enum PayingStatusType
    {
        HasNotPaid = 1,
        HasPaid,
    }

    //private Dictionary<Category, PaymentOfferData> data = new Dictionary<Category, PaymentOfferData>();
    //private Dictionary<DisplayPosition, PaymentOfferData> dataForDisplay = new Dictionary<DisplayPosition, PaymentOfferData>();
	private Dictionary<int,PaymentOfferData> allOfferDatas = new Dictionary<int, PaymentOfferData> ();

	private Dictionary<int,PaymentOfferData> data = new Dictionary<int, PaymentOfferData> ();
	private Dictionary<int,OfferCategoryData> offerCategoryDatas = new Dictionary<int,OfferCategoryData>();
    public PayingStatusType PayingStatus { get; set; }

    private bool NonBeginnerAutoPopup { get; set; }

    #region Static interfaces
    public static PaymentOfferManager Instance { get; private set; }

    public static void MakeInstance()
    {
        if (Instance != null)
        {
            throw new NotSupportedException("An instance of PaymentOfferManager already exists.");
        }

        Instance = new PaymentOfferManager();
    }

    public static void ClearInstance()
    {
        Instance = null;
    }

	public PaymentOfferData GetPaymentOfferDataById(int offerId)
	{
		if(data.ContainsKey(offerId))
		{
			return data[offerId];
		}

		return null;
	}

	public PaymentOfferData GetSpecialPaymentOfferDataById(int offerId)
	{
		if(allOfferDatas.ContainsKey(offerId))
		{
			return allOfferDatas[offerId];
		}
		
		return null;
	}

	public PaymentOfferData[] GetOfferList(){
		List<PaymentOfferData> list=new List<PaymentOfferData>();
		foreach (var item in data) {
			PaymentOfferData pdata=item.Value ;
			if(pdata!=null)
				list.Add(pdata);
		}
		return list.ToArray();
	}

	public bool IsHaveOffer()
	{
		return data.Count > 0;
	}

	public int GetOfferListCount()
	{
		PaymentOfferData[] list= GetPaymentList();
		return list.Length;
	}

	public int GetCategoryOfferListCount(int priority)
	{
		PaymentOfferData[] offers = GetPaymentListByPriority(priority);
		return offers.Length;
	}

    public PaymentOfferData GetDisplayDataByDisplayPosition()
    {
        PaymentOfferData ret = null;
		PaymentOfferData[] temps = GetOfferList ();
		if(temps.Length > 0)
		{
			ret =  temps[0];
		}
        return ret;
    }

	public int GetOfferCategoryById(int offerId)
	{
		PaymentOfferData offerData = GetPaymentOfferDataById(offerId);
		if(offerData != null)
		{
			return offerData.offerPriority;
		}

		return -1;
	}

	public void RemoveOfferCategory(int offerId)
	{
		int category = GetOfferCategoryById(offerId);
		int categoryCount = GetCategoryOfferListCount(category);
		if(categoryCount <= 0)
		{
			if(offerCategoryDatas.ContainsKey(category))
			{
				offerCategoryDatas.Remove(category);
			}
		}
	}

	public OfferCategoryData[] GetOfferCategoryList()
	{
		List<OfferCategoryData> list=new List<OfferCategoryData>();

		foreach (var item in offerCategoryDatas) 
		{
			OfferCategoryData pdata = item.Value ;
			
			if(pdata != null)
			{
				list.Add(pdata);
			}  
		}

		list.Sort(delegate (OfferCategoryData x, OfferCategoryData y)
        {
			return x.priority.CompareTo(y.priority);  
		});
		
		return list.ToArray();
	}

	public PaymentOfferData[] GetPaymentListByPriority(int priority)
	{
		List<PaymentOfferData> list=new List<PaymentOfferData>();

		long curTime = KBN.GameMain.unixtime();
		
		foreach (var item in data) 
		{
			PaymentOfferData pdata = item.Value ;
			
			if(pdata != null && pdata.EndTime>curTime && pdata.SurplusTimes > 0 && pdata.offerPriority == priority)
			{
				list.Add(pdata);
			}  
		}

		return list.ToArray();
	}

	public PaymentOfferData[] GetPaymentList()
	{
		List<PaymentOfferData> list=new List<PaymentOfferData>();
		long curTime = KBN.GameMain.unixtime();

		foreach (var item in data) {
			PaymentOfferData pdata=item.Value ;

			if(pdata != null && pdata.EndTime>curTime && pdata.SurplusTimes > 0)
			{
				list.Add(pdata);
			}  
		}

		return list.ToArray();
	}
	
    #endregion

    #region Instance interfaces
	public void UpdateSurplusTimes(int offerId)
	{	
		List<int> notPaidOfferId = new List<int>();
		foreach (PaymentOfferData ret in data.Values) {
			
			if(ret.Type == 1)
			{
				notPaidOfferId.Add(ret.Id);
			}
		}
		for(int i = 0; i < notPaidOfferId.Count;++i)
		{
			if(data.ContainsKey(notPaidOfferId[i]))
			{
				//RemoveOfferCategory(notPaidOfferId[i]);

				data.Remove(notPaidOfferId[i]);
			}
		}

		if(data.ContainsKey(offerId))
		{
			int times = data[offerId].SurplusTimes;
			data[offerId].SurplusTimes = times - 1;

			if(data[offerId].SurplusTimes <= 0)
			{
				//RemoveOfferCategory(offerId);
				data.Remove(offerId);
			}
		}
	}

    public void UpdateDataWithHashObject(HashObject ho)
    {
        if (ho == null)
        {
            return;
        }
		data.Clear();
		offerCategoryDatas.Clear();
        PayingStatus = (PayingStatusType)(Datas.getIntValue(ho, "payingStatus"));
		//PayingStatus = PayingStatusType.HasPaid;
        NonBeginnerAutoPopup = (_Global.INT32(ho["nonBeginnerAutoPopup"]) != 0);
		if(ho["offers"] != null)
		{
			List<string> keys = new List<string>(_Global.GetObjectKeys(ho["offers"]));
			keys.Sort();
			for (int i = 0; i < keys.Count; i++)
			{
				HashObject temp = ho["offers"][keys[i]] as HashObject;
				PaymentOfferData offerData = PaymentOfferData.CreateFromHashObject(temp);

				//_Global.LogWarning(" OfferId : " + offerData.Id);
				data.Add(offerData.Id,offerData);

				if(!allOfferDatas.ContainsKey(offerData.Id))
				{
					allOfferDatas.Add(offerData.Id,offerData);
				}
			}
		}

		// 先把购买gems界面填入
		OfferCategoryData gemsData = new OfferCategoryData();
		gemsData.priority = 0;
		gemsData.categoryName = Datas.getArString("Offer.title1");
		offerCategoryDatas.Add(gemsData.priority,gemsData);
		if(ho["offerCategory"] != null)
		{
			List<string> categorys = new List<string>(_Global.GetObjectKeys(ho["offerCategory"]));
			categorys.Sort();
			for (int i = 0; i < categorys.Count; i++)
			{
				HashObject categoryHash = ho["offerCategory"][categorys[i]] as HashObject;
				OfferCategoryData offerCategoryData = OfferCategoryData.CreateFromHashObject(categoryHash);
				if(!offerCategoryDatas.ContainsKey(offerCategoryData.priority))
				{
					offerCategoryDatas.Add(offerCategoryData.priority,offerCategoryData);
				}
			}
		}
    }

	//当前购买的月卡保留  删除其余月卡
	public void RemovePaymentMonthlyCardOffer(int offerId)
	{
		List<PaymentOfferData> removeList=new List<PaymentOfferData>();
		
		foreach (var item in data) 
		{
			PaymentOfferData pdata = item.Value ;

			if(pdata.Id == offerId)
			{
				pdata.day = 30;
				continue;
			}
			
			if(pdata != null && pdata.IsMonthlyCard)
			{
				removeList.Add(pdata);
			}  
		}
		
		for(int i = 0 ; i < removeList.Count; ++i)
		{
			if(data.ContainsKey(removeList[i].Id))
			{
				//RemoveOfferCategory(removeList[i].Id);
				//data.Remove(removeList[i].Id);
				removeList[i].day = -1;
			}
		}
	}

	public void RemovePaymentOfferByOfferId(int offerID)
	{
		if(data.ContainsKey(offerID))
		{
			//RemoveOfferCategory(offerID);
			data.Remove(offerID);
		}
	}

	public PaymentOfferData[] GetPopOfferDatas()
	{
		List<PaymentOfferData> list=new List<PaymentOfferData>();
		list.Add(GetOfferForAutoPopup());
		
		return list.ToArray();
	}

    public PaymentOfferData GetOfferForAutoPopup()
    {
        PaymentOfferData ret = GetBeginnerOrVipOfferForAutoPopup();
        if (ret != null)
        {
            return ret;
        }

        return GetLatestOfferForAutoPopup();
    }
    #endregion

    private PaymentOfferData GetBeginnerOrVipOfferForAutoPopup()
    {
		PaymentOfferData temp = null;
		foreach (PaymentOfferData ret in data.Values) {

			if (ret.IsBeginnerOffer && PayingStatus == PayingStatusType.HasNotPaid)
			{
				temp = ret;
			}
			
			if (ret.IsVip && NonBeginnerAutoPopup)
			{
				temp = ret;
			}
		}

		if(temp == null)
		{
			foreach (PaymentOfferData ret in data.Values) 
			{				
				if (ret.IsPopUp)
				{
					temp = ret;
				}
			}
		}

		return temp;
	}

    private PaymentOfferData GetLatestOfferForAutoPopup()
    {
        if (!NonBeginnerAutoPopup)
        {
            return null;
        }

        PaymentOfferData latest = null;

        foreach (PaymentOfferData offer in data.Values)
        {
            if (offer == null)
            {
                continue;
            }

            if (latest == null || latest.Id < offer.Id)
            {
                latest = offer;
            }
        }

        return latest;
    }

    private PaymentOfferManager()
    {
        // Empty
    }
}
