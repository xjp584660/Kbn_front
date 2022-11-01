using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using KBN;

public class CollectResourcesInfo
{
	public string tileKey;
	public int tileX;
	public int tileY;
	public int level;
	public int resourcesType;
	public long resourcesCount;
	public bool isHaveMarch = false;
	public int resourcesFlag = 0;//标记驻扎在该地块的March是否是自己同盟的
	public int marchId = 0;//驻扎在当前地块的March的ID
	public int playerId = 0;
	public int allianceId = 0;
	public int cityId = 0;
	public HashObject tileResourceInfo = null;
}

public class CollectionResourcesMgr
{
	private	static CollectionResourcesMgr singleton;
	public	static	CollectionResourcesMgr instance()
	{
		if( null == singleton )
		{
			singleton = new CollectionResourcesMgr();
		}
		return singleton;
	}

	public Dictionary<string, CollectResourcesInfo> collectResources = new Dictionary<string, CollectResourcesInfo>();
	private HashObject seed;
	//public HashObject tilesResourcesInfos = new HashObject();
	//public Dictionary<string, string> resourcesListInfos = new Dictionary<string, string>();

	public void Init() 
	{
		seed = GameMain.singleton.getSeed();
	}

	public int GetResourcesMarchIdByCoord(string coordx,string coordy){
		string key = coordx + "_" + coordy;
		if(collectResources.ContainsKey(key))
		{
			return collectResources[key].marchId;
		}
		return -1;
	}

	public int GerResourcesLevel(string key)
	{
		if(collectResources.ContainsKey(key))
		{
			return collectResources[key].level;
		}
		return 1;
	}

	public int GetResourcesType(string key)
	{
		if(collectResources.ContainsKey(key))
		{
			return collectResources[key].resourcesType;
		}
		return 0;
	}

	public string GetResourcesTextureName(string key)
	{
		string name = string.Empty;
		if(collectResources.ContainsKey(key))
		{
			CollectResourcesInfo info = collectResources[key];
			int level = info.level;
			if(level <= 2)
			{
				level = 1;
			}
			else if(level > 2 && level <= 4)
			{
				level = 2;
			}
			else 
			{
				level = 3;
			}
			switch(info.resourcesType)
			{
				case Constant.CollectResourcesType.WOOD :
					name = string.Concat("collectResWood_", level);
					break;
				case Constant.CollectResourcesType.FOOD :
					name = string.Concat("collectResFood_", level);
					break;
				case Constant.CollectResourcesType.STONE :
					name = string.Concat("collectResStone_", level);
					break;
				case Constant.CollectResourcesType.ORE :
					name = string.Concat("collectResOre_", level);
					break;
				case Constant.CollectResourcesType.GOLD :
					name = string.Concat("collectResGold_", level);
					break;
				case Constant.CollectResourcesType.CARMOT :
					int carmotLevel = info.level;
					name = string.Concat("CarmotCave_", carmotLevel, "_1");
					break;
			}
		}

		return name;
	}

	public string GetResourcesTileName(string key)
	{
		string name = string.Empty;
		if(collectResources.ContainsKey(key))
		{
			CollectResourcesInfo info = collectResources[key];
			int level = info.level;
			name = GetResourceName(info.resourcesType);
			if(info.resourcesType == Constant.CollectResourcesType.CARMOT)
			{
				name = String.Format(name ,level);
			}
			else
			{
				name = name + "(Lv." + level + ")";
			}			
		}

		return name;
	}

	public string GetResourceName(int tileType)
	{
		string name = string.Empty;
		switch(tileType)
		{
			case Constant.CollectResourcesType.WOOD :
				name = Datas.getArString("Newresource.Wood");
				break;
			case Constant.CollectResourcesType.FOOD :
				name = Datas.getArString("Newresource.Food");
				break;
			case Constant.CollectResourcesType.STONE :
				name = Datas.getArString("Newresource.Stone");
				break;
			case Constant.CollectResourcesType.ORE :
				name = Datas.getArString("Newresource.Ore");
				break;
			case Constant.CollectResourcesType.GOLD :
				name = Datas.getArString("Newresource.Gold");
				break;
			case Constant.CollectResourcesType.CARMOT :
				name = Datas.getArString("Newresource.tile_name");
				break;
		}

		return name;
	}

	public Texture GetTilePopUpIcon(string key)
	{
		Texture icon = null;
		if(collectResources.ContainsKey(key))
		{
			CollectResourcesInfo info = collectResources[key];
			icon = GetResourceIcon(info.resourcesType);
		}

		return icon;
	}

	public Texture GetResourceIcon(int tileType)
	{
		Texture icon = null;
		switch(tileType)
		{
			case Constant.CollectResourcesType.WOOD :
				icon = TextureMgr.instance().LoadTexture("resource_Wood_icon", TextureType.ICON);
				break;
			case Constant.CollectResourcesType.FOOD :
				icon = TextureMgr.instance().LoadTexture("resource_Food_icon", TextureType.ICON);
				break;
			case Constant.CollectResourcesType.STONE :
				icon = TextureMgr.instance().LoadTexture("resource_Stone_icon", TextureType.ICON);
				break;
			case Constant.CollectResourcesType.ORE :
				icon = TextureMgr.instance().LoadTexture("resource_Ore_icon", TextureType.ICON);
				break;
			case Constant.CollectResourcesType.GOLD :
				icon = TextureMgr.instance().LoadTexture("resource_Gold_icon", TextureType.ICON);
				break;
			case Constant.CollectResourcesType.CARMOT :
				icon = TextureMgr.instance().LoadTexture("resource_Carmot_icon", TextureType.MAP17D3A_NEWRESOURCES);
				break;
		}

		return icon;
	}

	public void RemoveResourcesData(int xCoord, int yCoord)
	{
		MapController mc = GameMain.singleton.getMapController();
		if(mc == null)
		{
			return;
		}
		
		string key = xCoord + "_" + yCoord;
		if(collectResources.ContainsKey(key))//when carmot coun is zero,remove it
		{
			string l = "l_" + xCoord + "_";
			string t = "t_" + yCoord;
			GameObject obj = GameObject.Find(l+t);		
			mc.setCarmotTexture(key,obj,false);
			//collectResources.Remove(key);
		}
	}

	public void OnNewNetworkNodeConnected()
	{
		collectResources.Clear();
		GameMain.singleton.getMarchesInfo();
	}

	public void SetResourcesData(HashObject rslt)
	{
		//_Global.LogError("1111111111");
		if(rslt == null )
		{
			return;
		}

		MapController mc = GameMain.singleton.getMapController();
		if(mc == null)
		{
			return;
		}

		if(_Global.GetBoolean(rslt["ok"].Value) && rslt["data"] != null)
		{	
			//collectResources.Clear();

			//tilesResourcesInfos = rslt;
			GameObject obj = null;
			foreach (var key in _Global.GetObjectKeys(rslt["data"]))
			{
				if(rslt["data"][key] != null)
				{
					string l = "l_" + key.Split('_')[0] + "_";
					string t = "t_" + key.Split('_')[1];
					obj = GameObject.Find(l+t);
					CollectResourcesInfo info = new CollectResourcesInfo();
					if(_Global.INT64(rslt["data"][key]["amount"].Value) > 0)
					{
						info.level=_Global.INT32(rslt["data"][key]["level"].Value);
						info.resourcesCount = _Global.INT64(rslt["data"][key]["amount"].Value);
						info.resourcesType = _Global.INT32(rslt["data"][key]["type"].Value);
						info.tileKey = key;
						info.tileX = _Global.INT32(key.Split('_')[0]);
						info.tileY = _Global.INT32(key.Split('_')[1]);
						info.isHaveMarch = false;
						mc.setCarmotTexture(key,obj,true);	
						if(!collectResources.ContainsKey(key))
						{
							collectResources.Add(key, info);							
						}
						else
						{
							collectResources[key] = info;
						}					
					}
					else
					{
						if(collectResources.ContainsKey(key))//when carmot coun is zero,remove it
						{							
							mc.setCarmotTexture(key,obj,false);
							//collectResources.Remove(key);
						}
					}

					HashObject occpupant = rslt["data"][key]["occupant"];
					int occpupantsCount = _Global.GetObjectValues(occpupant).Length;
					if( occpupantsCount > 0)
					{
						int tileUserId = _Global.INT32(occpupant["fromPlayerId"]);
						int tileCityId = _Global.INT32(occpupant["fromCityId"]);
						int tileAllianceId = _Global.INT32(occpupant["fromAllianceId"]);
						int tileType = _Global.INT32(occpupant["toTileType"]);
						info.playerId = tileUserId;
						info.allianceId = tileAllianceId;
						int carmotFlag = checkCarmotFlag(rslt,tileUserId,tileCityId,tileAllianceId,tileType);
						info.resourcesFlag = carmotFlag;
						info.marchId = _Global.INT32(occpupant["marchId"]);
						info.cityId = tileCityId;
						info.isHaveMarch = true;	
						info.tileResourceInfo = occpupant;	
						UpdateMarchInfo(occpupant);	
					}	
					mc.SetCarmotStateTexture(obj, key);				
				}					
			}
		}
	}

	private void UpdateMarchInfo(HashObject occpupant)
	{
		int tileUserId = _Global.INT32(occpupant["fromPlayerId"]);
		if(tileUserId != GameMain.singleton.getUserId())
		{
			return;
		}
		int cityId = GameMain.singleton.getCurCityId();
		int marchId = _Global.INT32(occpupant["marchId"]);
		seed = GameMain.singleton.getSeed();
		if(null != seed["outgoing_marches"]["c" + cityId] && null != seed["outgoing_marches"]["c" + cityId]["m" + marchId] && (_Global.INT32(seed["outgoing_marches"]["c" + cityId]["m" + marchId]["marchStatus"]) != Constant.MarchStatus.DEFENDING || _Global.INT64(seed["outgoing_marches"]["c" + cityId]["m" + marchId]["destinationUnixTime"]) != _Global.INT64(occpupant["destinationUnixTime"])))
		{
			HashObject localMarchData = seed["outgoing_marches"]["c" + cityId]["m" + marchId];
			localMarchData["marchUnixTime"] = occpupant["marchUnixTime"];
			localMarchData["destinationUnixTime"] = occpupant["destinationUnixTime"];
			localMarchData["marchStatus"].Value = Constant.MarchStatus.DEFENDING;
			GameMain.singleton.syncSeedMarch(cityId, marchId);
		}
	}

	private	int checkCarmotFlag(HashObject slotInfo, int tileUserId,int tileCityId,int tileAllianceId,int tileType)
	{
		seed = GameMain.singleton.getSeed();
		int flagNumber = 0; // 0: no flag; >0: city id; 
											//-1: sameAlliance;
											//-2: hostile & friend
		if(tileUserId == GameMain.singleton.getUserId()){
			return 1;
		}
		
		if ( tileUserId > 0 && tileType != Constant.TileType.BOG )
		{
			
			int currentcityid = GameMain.singleton.getCurCityId();
			
			//now check to make sure this tile is FRIENDLY, HOSTILE, OR OURS
			//NEUTRAL NOTE (not in any alliance or in alliance thats neither friendly nor hostile) SHOULD HAVE NO FLAGS
			
			if( tileUserId == Datas.singleton.tvuid() )
			{ //this is OURS
				
				int i = 0;
				while( seed["cities"][_Global.ap + i] != null )
				{
					if( _Global.INT32(seed["cities"][_Global.ap + i][_Global.ap + 0]) == tileCityId)
					{
						flagNumber = _Global.INT32(seed["cities"][_Global.ap + i][_Global.ap + 6]);
						break;
					} 
					i ++;
				}				
			}
			else
			{ //this belongs to SOMEBODY
				HashObject allianceDiplomacies = seed["allianceDiplomacies"];
				if( allianceDiplomacies == null || tileAllianceId==0)
				{
					return -2;
				}else
				if( flagNumber == 0 && allianceDiplomacies["allianceId"] != null)
				{//check to see if this tile is an alliance member
					if( tileAllianceId == _Global.INT32( allianceDiplomacies["allianceId"] ) )
					{
						flagNumber = -1;
					}else{
						flagNumber = -2;
					}
				}
			}
		}
		
		return flagNumber;
	}
}
