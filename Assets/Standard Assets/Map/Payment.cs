using UnityEngine;
using System.Collections;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using KBN;

namespace KBN {
    public abstract class Payment {
//		class OrderInfo{
//			public int payoutid;
//			public int currency;
//			public string description;
////			public string itunes_productid;
//			public int cents;
//			public string currency_code;
////			public string bonus_name;
////			public string bonus_description;
////			public int category;
//			public OrderInfo(int payoutid,int currency,string description,int cents,string currency_code){
//				this.payoutid=payoutid;
//				this.currency=currency;
//				this.description=description;
//				this.cents=cents;
//				this.currency_code=currency_code;
//			}
//
//		}
		public	class	PaymentElement{
			public	static	int NO_BONUS = -1;
			
			// NEW PART.
			public int payoutId;
			public string cents;
			public int currency;
			public string currencyCode;
			public string description;
			public string itunesProductId;
			public int saleType = 0 ;	//common 0 most 1 popular great 2 value  recommended. 3
			public string bonusName;
			public string bonusDescription;
			public int chestId;
			public int category;
			
			//		public int buyBtnBiNum;
			//		public int chestBtnBiNum;
			public int bi;
			public string price;
			public string icon;
			public bool isTapJoy = false;

            public string PriceWithoutCurrencySymbol
            {
                get
                {
                    if (price == null)
                    {
                        return string.Empty;
                    }

                    return Regex.Replace(price, "[^0-9.]", string.Empty);
                }
            }
		}

		public static Payment singleton { get; protected set; }

		protected static string prefix = "";
		protected Dictionary<int,PaymentElement> orderInfoDic=new Dictionary<int, PaymentElement>();

		public void AddOrderInfo(PaymentElement element){
			if(orderInfoDic.ContainsKey(element.payoutId) ){
				if(orderInfoDic[element.payoutId]!=null)
				{
					orderInfoDic[element.payoutId].currencyCode=element.currencyCode;
					orderInfoDic[element.payoutId].cents=element.cents;
				}else orderInfoDic[element.payoutId]=element;

			}else if(element!=null){
				orderInfoDic.Add(element.payoutId,element);
			}
		}

		public PaymentElement GetOrderInfo(int payoutId){
			PaymentElement element;
			if(orderInfoDic.TryGetValue(payoutId,out element)){
				if(element!=null) return element;
			}
			return null;
		}

		public PaymentElement GetOrderByGems(int gemsCount){
			foreach (var item in orderInfoDic) {
				PaymentElement payItem=item.Value;
				if(payItem!=null && payItem.currency==gemsCount){
					return payItem;
				}
			}
			return null;
		}

		public string getPriceByGems(int gemsCount)
		{
			PaymentElement item=GetOrderByGems(gemsCount);
			if(item!=null) return item.price;
			return "";
		}

        public static string URLPrefix() {
            return prefix;
        }

        public static void initPayment(HashObject data) {
            if (data != null) {
                prefix = data["prefix"].Value as string;
                _Global.Log("prefix of payment:" + prefix);
            }
        }

		public static int currentNoticeType = 8;

		public static void setCurNoticeType(int type)
		{
			currentNoticeType = type;
		}

		public static string getOriginalPrice(string curPrice,float multiple)
		{
			System.Text.StringBuilder sb = new System.Text.StringBuilder();
			System.Text.StringBuilder priceType = new System.Text.StringBuilder();
			int temp = 0;
			try {
				foreach (char c in curPrice)
				{
					int num = System.Convert.ToInt32(c);
					if (num >= 48 && num <= 57 )//数字 小数点
					{
						sb.Append(c);
						if(temp<2) temp = 1;
						
					}
					else if (num == 46 && temp == 1 )// 小数点
					{
						sb.Append(c);
						temp = 2;
					}else{//非数字 小数点
						if(temp==0) priceType.Append(c);
					}
				}
			} catch (System.Exception ex) {
				_Global.Log("getOriginalPrice error---->");
			}
			if(string.IsNullOrEmpty(sb.ToString())) return "";
			double oldPrice = _Global.FLOAT(sb.ToString());
			oldPrice*=multiple;
			if(oldPrice<=0) return "";
			string oldPriceStr=string.Format("{0:F}",oldPrice);//默认为保留两位
			string[] tempArr=oldPriceStr.Split('.');
//			tempArr[0]=string.Format("{0:###,###,###}",_Global.INT32(tempArr[0]));
			tempArr[1]="."+tempArr[1];
			if(oldPrice>=1000 || (tempArr[1].Equals(".00") && tempArr.Length>1)){
				tempArr[1]="";
			}
			return string.Format("{0}{1}{2}",priceType.ToString(),tempArr[0],tempArr[1]);
		}
		
		protected object[] itunesValideProducts;
		protected Dictionary<string,string> productsPrice;
		protected Dictionary<string,string> productsCodeType;
		protected Dictionary<string,string> productsCents;
		public object[] getitunesValideProducts()
		{
			return itunesValideProducts;
		}

		public abstract void SubtractGems(int cost);
		public abstract void AddGems(int cost);
		public BlueLightData blueLightData = new BlueLightData();

		public abstract long DisplayGems { get;}
	}
}


public class BlueLightData 
{
	private bool m_showIcon;

	public long cur;
	public long max;
	public int level;
	public bool hide_flag = false;
	private HashObject seed;

	public bool showIcon
	{
		get
		{
			return m_showIcon;
		}
	}
	
	public void init(HashObject seed)
	{
		this.seed = seed;
		
		if(seed["blueLight"] != null)
		{
			seed["blueLight"]["type"] = new HashObject(8);
			updateWithData(seed["blueLight"]);
		}
	}
	
	public void updateWithData(HashObject obj)
	{
		if(obj != null)
		{
			cur = _Global.INT32(obj["cur"]);
			max = _Global.INT32(obj["max"]);
			level = _Global.INT32(obj["level"]);
			
			updateShowIcon();
		}
	}
	
	public void openWithMainChrome()
	{
		if(_Global.INT32(seed["player"]["title"]) < 10 && level == 0)
			hide_flag = true;
		updateShowIcon();
	}
	
	public void updateShowIcon()
	{
		if (hide_flag || (_Global.INT32(seed["player"]["title"]) < 10 && level == 0) ) 
			m_showIcon = !hide_flag;
		else
			m_showIcon = max - cur < 100;
	}
}
