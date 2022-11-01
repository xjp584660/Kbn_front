using UnityEngine;
using System.Collections;
using System.Text;

using Datas = KBN.Datas;
using _Global = KBN._Global;

public class PaymentOfferData : object
{
    public int Id { get; protected set; }

    public string Name { get; protected set; }

    public string Desc { get; protected set; }

    public int Type { get; protected set; }

    //public bool IsTop { get; protected set; }

    public long StartTime { get; protected set; }

    public long EndTime { get; protected set; }

    public bool IsOnce { get; protected set; }

    public int GroupId { get; protected set; }

    public int RewardChestId { get; protected set; }

    public string RewardChestName { get; protected set; }

    public string RewardChestDesc { get; protected set; }

    public int RewardChestValue { get; protected set; }

    public int RewardChestValuePercentage { get; protected set; }

    public int PricePoint { get; protected set; }

    public int PricePointType { get; protected set; }

    public string PricePointDesc { get; protected set; }

    public bool IsVip { get; protected set; }

    public bool IsBuyDirect { get; protected set; }

    public string BannerDesc { get; protected set; }

	public float WorthBonus { get; protected set; }

	public string OfferPictureName{get; protected set;}

	public string OfferImageName{get; protected set;}

	public int PurchaseTimes{get; protected set;}

	public int HasBought{get; protected set;}

	public int SurplusTimes{get; set;}

    public int offerType{get;set;}

    public HashObject subItems{get;set;}

	public string offerPriorityName{get;set;}

	public int offerPriority{get;set;}

	public bool IsPopUp { get; protected set; }

	public int day { get; set; }

	public int offerLabel { get; protected set; }

	public int offerWorth { get; protected set; }

    public bool IsBeginnerOffer
    {
        get
        {
            return Id == -1;
        }
    }
    //是否是月卡
    public bool IsMonthlyCard
    {
        get{
            return offerType==1;
        }
    }

    public bool CheckPurchaseAmount(int amount)
    {
        if (PricePointType == Constant.PaymentOffer.PricePointType.Equal)
        {
            return amount == PricePoint;
        }

        return amount >= PricePoint;
    }

    private PaymentOfferData()
    {
        // Empty private constructor
    }

	public static PaymentOfferData CreateFromHashObject(HashObject offerNode)
    {
        var ret = new PaymentOfferData();
//        if (_Global.INT32(ho["isRunning"]) == 0)
//        {
//            return null;
//        }
//        var offerNode = ho["offer"];
//        if (offerNode == null)
//        {
//            return null;
//        }
        ret.Id = _Global.INT32(offerNode["offerId"]);
        ret.Name = _Global.GetString(offerNode["offerName"]);
        ret.Desc = _Global.GetString(offerNode["offerDesc"]);
		//1非付费2付费3all，vip，beginner
		ret.Type = _Global.INT32(offerNode["type"]);
		//ret.IsTop = (_Global.INT32(offerNode["isTop"]) != 0);
		ret.StartTime = _Global.INT64(offerNode["startTime"]);
		ret.EndTime = _Global.INT64(offerNode["endTime"]);
		ret.IsOnce = (_Global.INT32(offerNode["isOnce"]) == 1); // 1: once; 2: multi-times
        ret.GroupId = _Global.INT32(offerNode["groupId"]);
        ret.RewardChestId = _Global.INT32(offerNode["rewardChestID"]);
        ret.RewardChestName = _Global.GetString(offerNode["chestName"]);
        ret.RewardChestDesc = _Global.GetString(offerNode["chestDesc"]);
        ret.RewardChestValue = _Global.INT32(offerNode["chestWorth"]);
        ret.RewardChestValuePercentage = _Global.INT32(offerNode["worthPercentage"]);
        ret.PricePoint = _Global.INT32(offerNode["pricePoint"]);
        ret.PricePointType = _Global.INT32(offerNode["pricePointType"]);
        ret.PricePointDesc = _Global.GetString(offerNode["pricePointDesc"]);
        ret.IsVip = (_Global.INT32(offerNode["isVIP"]) != 0);
		ret.IsPopUp = (_Global.INT32(offerNode["isPopUp"]) != 0);
        ret.IsBuyDirect = (_Global.INT32(offerNode["buyDirect"]) != 0);
        ret.BannerDesc = _Global.GetString(offerNode["bannerDesc"]);
		ret.WorthBonus=_Global.FLOAT(offerNode["worthBonus"]);
		ret.OfferPictureName = _Global.GetString(offerNode["offerPictureName"]);
		//头像
		ret.OfferImageName=_Global.GetString(offerNode["offerImageName"]);
		//可购买次数
		ret.PurchaseTimes = _Global.INT32(offerNode["purchaseTimes"]);
		//已购买次数
		ret.HasBought = _Global.INT32(offerNode["hasBought"]);
		//剩余次数
		ret.SurplusTimes = ret.PurchaseTimes - ret.HasBought;
        //offer 类型
        ret.offerType=offerNode["offerType"]!=null?_Global.INT32(offerNode["offerType"]):0;
        //itemList ,月卡奖励
        ret.subItems=offerNode["subItems"]!=null?(offerNode["subItems"] as HashObject):null;

		ret.offerPriorityName = _Global.GetString(offerNode["offerCategory"]);
		ret.offerPriority = _Global.INT32(offerNode["priority"]);

		ret.day = _Global.INT32(offerNode["day"]);
		ret.offerLabel = _Global.INT32(offerNode["offerLabel"]);
		ret.offerWorth = _Global.INT32(offerNode["offerWorth"]);
        return ret;
    }
}
