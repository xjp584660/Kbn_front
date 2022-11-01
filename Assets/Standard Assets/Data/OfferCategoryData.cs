using UnityEngine;
using System.Collections;
using System.Text;

using Datas = KBN.Datas;
using _Global = KBN._Global;

public class OfferCategoryData : object 
{
	public int priority { get; set; }
	
	public string categoryName { get; set; }

	public static OfferCategoryData CreateFromHashObject(HashObject offerNode)
	{
		var ret = new OfferCategoryData();

		ret.priority = _Global.INT32(offerNode["priority"]);
		ret.categoryName = _Global.GetString(offerNode["categoryName"]);

		return ret;
	}
}
