using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using Datas = KBN.Datas;
using GameMain = KBN.GameMain;
using UnityNet = KBN.UnityNet;

public class MapView {

	
	private	static	MapView singleton;
	
	private Hashtable g_types;	
	private Hashtable g_typename;
	private bool allForceUpdate = false;
	private bool allForceUpdateOnlyNextTime = false;

	public bool AllForceUpdate {
		set { allForceUpdate = value; }
		get { return allForceUpdate; }
	}

	public bool AllForceUpdateOnlyNextTime {
		set { allForceUpdateOnlyNextTime = value; }
		get { return allForceUpdateOnlyNextTime; }
	}

	public static MapView instance()
	{
		if(singleton == null)
		{
			singleton = new MapView();	
			GameMain.singleton.resgisterRestartFunc(new Action(delegate(){
				singleton = null;
			}));		
		}
		
		return singleton;
	}
	
	public Hashtable TileTypeNames
	{
		get{
			if(null == g_types)
			{
				g_types = new Hashtable();
				g_types.Add("0"		,Datas.getArString("Common.Bog"));
				g_types.Add("10"	,Datas.getArString("Common.Grassland"));
				g_types.Add("11"	,Datas.getArString("Common.Lake"));
				g_types.Add("12"	,Datas.getArString("Common.River"));
				g_types.Add("20"	,Datas.getArString("Common.Woods"));
				g_types.Add("30"	,Datas.getArString("Common.Hills"));
				g_types.Add("40"	,Datas.getArString("Common.Mountain"));
				g_types.Add("50"	,Datas.getArString("Common.Plain"));
				g_types.Add("51"	,Datas.getArString("Common.City"));
				g_types.Add("52"	,Datas.getArString("Common.Ruins"));
				g_types.Add("53"	,"city_mist");
				g_types.Add("101"	,"camelot1");
				g_types.Add("102"	,"camelot2");
				g_types.Add("103"	,"camelot3");
				g_types.Add("104"	,"camelot4");
				g_types.Add("105"	,"camelot5");
				g_types.Add("106"	,"camelot6");
				g_types.Add("201"	,"sr1"); 	// titanium
				g_types.Add("202"	,"sr2");	// graphene
				g_types.Add("203"	,"sr3"); 	// uranium
				g_types.Add("204"	,"sr4"); 		// diamonds	
			}
		
			return 	g_types;
		}
	}

	public void getMoreSlots(List<string> blockNames, MulticastDelegate okCallback, MulticastDelegate errorCallback) {

		
		List<string> changeBlocksArray = new List<string>();
		List<string> forceblocksArray = new List<string>();
		List<MapMemCache.BlockData> visitblocksArray = new List<MapMemCache.BlockData>();
		
		//first find memcatch
		string changedBlocksString = "";
		MapMemCache memCath = MapMemCache.instance();
		MapMemCache.BlockData catchData;
		int i = 0;
		for( i = blockNames.Count - 1; i >= 0; i -- ){
			if( allForceUpdateOnlyNextTime ) {
				catchData = null;
			} else {
				catchData = allForceUpdate ? null : memCath.findBlock( blockNames[i] );
			}
			if( null != catchData ){
				catchData.visitCnt ++;
				visitblocksArray.Add(catchData);
				
				if( !memCath.valideBlock(catchData) ){
					
					if(changeBlocksArray.Count<15){
	                   changeBlocksArray.Add(blockNames[i]);
					}
				
					
					if( changedBlocksString.Length > 0 ){
						changedBlocksString += "," + blockNames[i];
					}else{
						changedBlocksString = blockNames[i];
					}
				}
				
			}else{
				if(forceblocksArray.Count<15)
				{
                  forceblocksArray.Add(blockNames[i]);
				}
				
			}
		}

		allForceUpdateOnlyNextTime = false;
		
		if( forceblocksArray.Count <= 0 && changeBlocksArray.Count <= 0){
			if( null != okCallback ){
				okCallback.DynamicInvoke(null);
			}
			resetCatchVisitingFlag(visitblocksArray);
			
			return;
		}
		
		string blockString = "";
		for( i = 0; i < forceblocksArray.Count-1; i ++ ){
			blockString += forceblocksArray[i] + ",";
		}
		if( forceblocksArray.Count > 0 ){
			blockString += forceblocksArray[forceblocksArray.Count - 1];
		}

		string[] args = {
			blockString,
			changedBlocksString
		};
		
		UnityNet.PFN_OkFunction okFunc = delegate(HashObject rslt){
			for( i = 0; i < forceblocksArray.Count; i ++ ){
				memCath.updateBlock(forceblocksArray[i], rslt["data"]);
			}
			
			for( i = 0; i < changeBlocksArray.Count; i ++ ){
				memCath.updateBlock(changeBlocksArray[i], rslt["data"]);
			}

			memCath.updateAdditionInfo(rslt["allianceNames"], rslt["allianceMights"],rslt["allianceLeagues"], rslt["userInfo"],
			                           rslt["tournament"],rslt["march"] );
			if( null != okCallback ){
				okCallback.DynamicInvoke(null);
			}
			resetCatchVisitingFlag(visitblocksArray);
           
			System.GC.Collect();
		};
		
		UnityNet.PFN_ErrorFunction errorFunc = delegate (string msg, string errorCode){
			if( null != errorCallback ){
				errorCallback.DynamicInvoke(new object[] { msg, errorCode});
			}
			
			resetCatchVisitingFlag(visitblocksArray);
		};
		UnityNet.fetchMapTiles(args, okFunc, errorFunc );
		
	}
	
	private	void resetCatchVisitingFlag(List<MapMemCache.BlockData> visitblocksArray){
		for( int i = 0; i < visitblocksArray.Count; i ++ ){
			(visitblocksArray[i] as MapMemCache.BlockData).visitCnt --;
		}
	}
}

