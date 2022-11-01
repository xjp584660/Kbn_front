using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System;

namespace KBN{
public abstract class Utility{
	public static Utility singleton{get; protected set;}
	protected HashObject seed;
	
	protected string LV;
	protected string YourLv;
	protected string Population;
	protected float resourceToGems = 0;
	
	//public	static	void instance(){
	//	if( singleton == null ){
	//		singleton = new Utility();
	//		GameMain.instance().resgisterRestartFunc(()=>singleton = null);
	//	}
	//	return singleton;
	//}
	
	public	void init( HashObject sd ){
		seed = sd;
		
		Population = Datas.getArString("Common.Population");
		LV = Datas.getArString("Common.Lv") ;
		YourLv = Datas.getArString("Common.YourLevel");
		
	}
	
	public bool isCraftCostItemsEnough(string recipeId)
	{
		bool bRet = true;
		HashObject recipeData = Datas.singleton.getOneRecipe(recipeId);
		//object[] tempArray = _Global.GetObjectValues(recipeData["costItem"]);
		//HashObject costItem = null;
		//int needNum;
		//int hasNum;
		foreach (HashObject costItem in _Global.GetObjectValues(recipeData["costItem"]) )
		{
			//costItem = tempArray[i] as HashObject;
			if(costItem != null)
			{
				int needNum = _Global.INT32(costItem["num"]);
				long hasNum = MyItems.singleton.countForItem(_Global.INT32(costItem["id"]));
				if(hasNum <  needNum)
				{
					return false;
					//bRet = false;
					//break;
				}
			}
		}
		return bRet;
	}
	
	public	object[] getCraftCostItems(string recipeId)
	{
		HashObject recipeData = Datas.singleton.getOneRecipe(recipeId);
		return _Global.GetObjectValues(recipeData["costItem"]);
	}
	
	//private bool checkBuildNeedDI(int btype)
	//{
	//	//need to patch
	//	if(btype < Constant.Building.FARM || btype > Constant.Building.VILLA)
	//		return true;
	//	return false;
	//}
	
	static public int CalcTotalResourceToGemsWithCost(int costRes)
	{
		int resourceToGems = (int)(costRes*55.0f/250000.0f);
		return resourceToGems>0?resourceToGems:0;
	}
    
    // TODO: Combine this with the int32 version and keep only one interface
    static public long CalcTotalResourceToGemsWithCost64(long costRes)
    {
        long resourceToGems = (long)(costRes*55.0f/250000.0f);
        return resourceToGems>0?resourceToGems:0;
    }
	
	public  bool checkInstantRequire(System.Collections.IEnumerable requirements)
	{
		if ( requirements == null )
			return false;
#if true
		bool rtv = false;
		foreach ( Requirement idata in requirements )
		{
			if ( idata.ok == true )
				continue;
			if ( !isResourceReq(idata) )
				return false;
			rtv = true;
		}
		return rtv;
#else
		//RequireItem item ;
		
		int i;
		int sn = requirements.Count;
		
		Requirement idata;
		for (i=0; i< sn; i++)
		{
			idata = requirements[i] as Requirement;
			
			if(idata.ok != true && !isResourceReq(idata))
			{
				return false;
			}
		}
		
		for (i=0; i< sn; i++)
		{
			idata = requirements[i] as Requirement;
			
			if(idata.ok != true && isResourceReq(idata))
			{
				return true;
			}
		}
		return false;
#endif
	}
	
	private bool isResourceReq(Requirement param)
	{
		//Datas arStrings = Datas.instance();
		for (int i = 0; i <= 7; i++) 
		{
			if(param.type == Datas.getArString("ResourceName."+_Global.ap + i))
				return true;			
		}
		//		if(param.type == arStrings.getArString("Common.Population"))
		//			return true;

		return false;
	}

	public abstract void SubResAndItemAfterCraftSuccess(string recipeId);
	public abstract bool isCraftCostResEnough(string recipeId);
	public abstract void instantFinishPreQueue(QueueItem element, int gems, int type);
	public abstract Requirement[] checkRecipeStudyReq(string recipeId);
	public abstract string getCraftCostRes(string recipeId);
	public abstract Requirement[] checkreq(string type, int targetId, int targetLevel);


		public static string ReadFromFile(string fileFullPath)
		{
			string ret = String.Empty;
			if (!File.Exists (fileFullPath))
				return ret;

			try
			{
				using (StreamReader sr = new StreamReader(fileFullPath))
				{
					ret = sr.ReadToEnd();
					sr.Close();
				}
			}
			catch(IOException)
			{
				if (File.Exists(fileFullPath))
				{
					File.Delete(fileFullPath);
				}
			}
			return ret;
		}
		
		public static void	WriteToFile(string filePath,string content)
		{
			string directory = Path.GetDirectoryName (filePath);
			if(!Directory.Exists(directory))
			{
				Directory.CreateDirectory(directory);
			}
			try
			{
				using (StreamWriter sw = new StreamWriter(filePath,false))
				{
					sw.Write(content);
					sw.Close();
				}
			}
			catch(IOException)
			{
				if (File.Exists(filePath))
				{
					File.Delete(filePath);
				}
			}
		}


}//end of class Utility
}//end of namespace KBN
