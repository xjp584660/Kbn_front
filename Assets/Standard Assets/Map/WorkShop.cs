using _Global = KBN._Global;
using UnityNet = KBN.UnityNet;
using Utility = KBN.Utility;
using Datas = KBN.Datas;
using GameMain = KBN.GameMain;

public class WorkShop
{
	private	static	WorkShop	singleton;
	private System.Collections.Generic.List<HashObject> m_AllData;
	private System.Collections.Generic.List<HashObject>	m_RubyList;
	private System.Collections.Generic.List<HashObject>	m_SapphireList;
	private System.Collections.Generic.List<HashObject>	m_EmeraldList;
	private System.Collections.Generic.List<HashObject>	m_DiamondList;
	private HashObject m_seed;
	
	public	static	WorkShop instance()
	{
		if( singleton == null )
		{
			singleton = new WorkShop();
		}
		return singleton;
	}
	
	public	void init( HashObject sd)
	{
		m_seed = sd;
		
		m_RubyList = new System.Collections.Generic.List<HashObject>();
		m_SapphireList = new System.Collections.Generic.List<HashObject>();
		m_EmeraldList = new System.Collections.Generic.List<HashObject>();
		m_DiamondList = new System.Collections.Generic.List<HashObject>();
		m_AllData = new System.Collections.Generic.List<HashObject>();
		//m_AllData = _Global.GetObjectValues(Datas.singleton.recipeData());
		foreach ( HashObject tempData in _Global.GetObjectValues(Datas.singleton.recipeData()) )
		//for(var i:int=0;i<m_AllData.length;i++)
		{
			m_AllData.Add(tempData);
			//var tempData:HashObject = m_AllData[i] as HashObject;
			if(_Global.INT32(tempData["reward"]["id"])>=42000 && _Global.INT32(tempData["reward"]["id"])<42100)
			{
				m_RubyList.Add(tempData);
			}
			else if(_Global.INT32(tempData["reward"]["id"])>=42100 && _Global.INT32(tempData["reward"]["id"])<42200)
			{
				m_EmeraldList.Add(tempData);
			}
			else if(_Global.INT32(tempData["reward"]["id"])>=42200 && _Global.INT32(tempData["reward"]["id"])<42300)
			{
				m_SapphireList.Add(tempData);
			}
			else
			{
				m_DiamondList.Add(tempData);
			}
		}
		
		SortRecipeList(m_RubyList);
		SortRecipeList(m_SapphireList);
		SortRecipeList(m_EmeraldList);
		SortRecipeList(m_DiamondList);
		
	}
	
	public void SortRecipeList(System.Collections.Generic.List<HashObject> list)
	{
		list.Sort((objA,objB)=> _Global.INT32((objA as HashObject)["recipeId"]) - _Global.INT32((objB  as HashObject)["recipeId"]));
	}
	
	public Requirement[] getStudyRequirements(string recipeId)
	{
		return Utility.singleton.checkRecipeStudyReq(recipeId);
	}
	
	public object[] getCraftCostItems(string recipeId)
	{
		return Utility.singleton.getCraftCostItems(recipeId);
	}
	
	public string getCraftCostRes(string recipeId)
	{
		return Utility.singleton.getCraftCostRes(recipeId);
	}
	
	public bool isCraftCostResEnough(string recipeId)
	{
		return Utility.singleton.isCraftCostResEnough(recipeId);
	}
	
	public bool isCraftCostItemsEnough(string recipeId)
	{
		return Utility.singleton.isCraftCostItemsEnough(recipeId);
	}
	
	public object[] getRubyListData()
	{
		return m_RubyList.ToArray();
	}
	
	public object[] getSapphireListData()
	{
		return m_SapphireList.ToArray();
	}
	
	public object[] getEmeraldListData()
	{
		return m_EmeraldList.ToArray();
	}
	
	public object[] getDiamondListData()
	{
		return m_DiamondList.ToArray();
	}
	
	public HashObject getOneRecipe(string recipeId)
	{
		//var ret:HashObject = null;
		//var tempData:HashObject;
		//for(var i:int=0;i<m_AllData.length;i++)
		foreach ( HashObject tempData in m_AllData )
		{
			//tempData = m_AllData[i] as HashObject;
			if(_Global.GetString(tempData["recipeId"]) == recipeId)
				return tempData;
			//{
			//	ret = tempData;
			//}
		}
		//return ret;
		return null;
	}
	
	public bool needStudyRecipe(string recipeId)
	{
		HashObject recipeObj = getOneRecipe(recipeId);
		return (_Global.GetString(recipeObj["needStudy"]) == "1");
	}
	
	public bool hasStudyRecipe(string recipeId)
	{
		//var tempArray:Array =  _Global.GetObjectValues(m_seed["playerRecipe"]);
		//var tempObj:HashObject = null;
		//for(var i:int=0;i<tempArray.length;i++)
		foreach ( HashObject tempObj in _Global.GetObjectValues(m_seed["playerRecipe"]) )
		{
			//tempObj = tempArray[i] as HashObject;
			if(tempObj != null && _Global.GetString(tempObj["id"]) == recipeId)
			{
				return (_Global.GetString(tempObj["status"]) == "1");
			}
		}
		return false;
	}

	public void setRecipeStudyStatus(string recipeId, string status)
	{
		//var tempArray:Array =  _Global.GetObjectValues(m_seed["playerRecipe"]);
		//var tempObj:HashObject = null;
		//for(var i:int=0;i<tempArray.length;i++)
		foreach ( HashObject tempObj in _Global.GetObjectValues(m_seed["playerRecipe"]) )
		{
			//tempObj = tempArray[i] as HashObject;
			if(tempObj != null && _Global.GetString(tempObj["id"]) == recipeId)
			{
				tempObj["status"].Value = status;
				break;
			}
		}
	}
	
	public void reqRecipeStudy(string recipeId, System.MulticastDelegate resultFunc)
	{
		object[] pars = new object[]{GameMain.singleton.getCurCityId(), recipeId};
		//var params:Array = new Array();	
		//params.Add(GameMain.singleton.getCurCityId());
		//params.Add(recipeId);
		//var okFunc:Function = function(result:HashObject)
		//{
		//	if(result["ok"].Value)
		//	{
		//		if(resultFunc != null)
		//		{
		//			resultFunc(result);
		//		}
		//	}
		//};
		UnityNet.reqRecipeStudy(pars, resultFunc);
	}
	
	public void reqRecipeCraft(string recipeId, System.MulticastDelegate resultFunc)
	{
		object[] pars = new object[]{GameMain.singleton.getCurCityId(), recipeId};
		//var params:Array = new Array();	
		//params.Add(GameMain.singleton.getCurCityId());
		//params.Add(recipeId);
		//var okFunc:Function = function(result:HashObject)
		//{
		//	if(result["ok"].Value)
		//	{
		//		if(resultFunc != null)
		//		{
		//			resultFunc(result);
		//		}
		//	}
		//};
		UnityNet.reqRecipeCraft(pars, resultFunc);
	}
	
	public void SubResAndItemAfterCraftSuccess(string recipeId)
	{
		Utility.singleton.SubResAndItemAfterCraftSuccess(recipeId);
	}
}
