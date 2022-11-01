using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System;
using System.Linq;

namespace KBN
{
	public enum SimpleRelicItemType
	{
		EquipType,
		UpgradeType,
		WareHouseType,
	}

	public class HeroRelicManager
	{
		protected static HeroRelicManager singleton = null;
		public static HeroRelicManager instance()
		{
			if( singleton == null )
			{
				if (GameMain.singleton!=null)
				{
					singleton = new HeroRelicManager();
					GameMain.singleton.resgisterRestartFunc(new Action(resginster));
				}
			}
			return singleton as HeroRelicManager;
		}

		public Dictionary<int, HeroRelicInfo> heroRelicList = new Dictionary<int, HeroRelicInfo>();

		public SimpleRelicItemType simpleRelicItemType = SimpleRelicItemType.EquipType;

		private static void resginster(){
			singleton = null;
		}

		public bool CanOpenHeroRelic()
		{
			return heroRelicList.Count > 0;
		}

		public void SetHeroRelicSelectState(int relicId, bool isSelect)
		{
			if(heroRelicList.ContainsKey(relicId))
			{
				heroRelicList[relicId].IsSelected = isSelect;
			}
		}

		public void SetAllHeroRelicNoSelect()
		{
			foreach(var a in heroRelicList)
			{
				if(a.Value != null)
					a.Value.IsSelected = false;
			}
		}

		public HeroRelicInfo GetHeroRelicInfo(int relicId)
		{
			if(heroRelicList.ContainsKey(relicId))
			{
				return heroRelicList[relicId];
			}

			return null;
		}

		public List<HeroRelicInfo> GetAllRelics()
		{
			List<HeroRelicInfo> list = new List<HeroRelicInfo>();
			foreach(var a in heroRelicList)
			{
				if(a.Value != null)
					list.Add(a.Value);
			}

			return list;
		}

		public List<HeroRelicInfo> GetEquipRelics()
		{
			List<HeroRelicInfo> list = new List<HeroRelicInfo>();
			foreach(var a in heroRelicList)
			{
				if(a.Value != null && a.Value.UserHeroId == 0)
					list.Add(a.Value);
			}

			return list;
		}

		public List<HeroRelicInfo> GetUpgradeRelics()
		{
			List<HeroRelicInfo> list = new List<HeroRelicInfo>();
			foreach(var a in heroRelicList)
			{
				if(a.Value != null && a.Value.UserHeroId == 0 && a.Value.Status == 1)
					list.Add(a.Value);
			}

			return list;
		}

		public List<HeroRelicInfo> GetUpgradeRelicsNoSelf(int id)
		{
			List<HeroRelicInfo> list = new List<HeroRelicInfo>();
			foreach(var a in heroRelicList)
			{
				if(a.Value != null && a.Value.UserHeroId == 0 && a.Value.Status == 1 && a.Value.RelicId != id)
					list.Add(a.Value);
			}

			return list;
		}

		public List<HeroRelicInfo> GetLevelSortRelics()
		{
			List<HeroRelicInfo> list = GetAllRelics();
			list.Sort((a, b)=>
			{		
				return b.Level - a.Level;
			});

			return list;
		}

		public List<HeroRelicInfo> GetTierSortRelics()
		{
			List<HeroRelicInfo> list = GetAllRelics();
			list.Sort((a, b)=>
			{		
				return b.Tier - a.Tier;
			});

			return list;
		}

		public void InitHeroRelicManager()
		{
			Action<HashObject> onHeroRelics = delegate (HashObject ho)
			{
				if(_Global.GetBoolean(ho["ok"]))
				{
					HashObject results = ho["relicList"];
					object[] arr = _Global.GetObjectValues(results);

					for(int i = 0; i < arr.Length; i++)
					{
						HashObject relic = arr[i] as HashObject;

						HeroRelicInfo info = new HeroRelicInfo(relic);
						if(heroRelicList.ContainsKey(info.RelicId))
						{
							heroRelicList[info.RelicId] = info;
						}
						else
						{
							heroRelicList.Add(info.RelicId, info);
						}					
					}
				}
			};	  
			UnityNet.getHeroRelics(onHeroRelics, null);
		}

		public void RemoveHeroRelic(int downRid, int heroId, int slot)
		{
			Action<HashObject> onHeroRelicUpdate = delegate (HashObject ho)
			{
				if(_Global.GetBoolean(ho["ok"]))
				{
					HeroInfo heroInfo = KBN.HeroManager.Instance.GetHeroInfo(heroId);
					HashObject heroBasic = ho["heroBasic"];
					heroInfo.Attack = _Global.INT32(heroBasic["attack"]);
					heroInfo.Health = _Global.INT32(heroBasic["hp"]);
					heroInfo.Load = _Global.INT32(heroBasic["load"]);

					if(heroInfo.Relic[slot] != 0)
					{								
						HeroRelicInfo downRelicInfo = GetHeroRelicInfo(downRid);
						downRelicInfo.UserHeroId = 0;

						// 把英雄身上的圣物卸下
						heroInfo.Relic[slot] = 0;
					}
					
					heroInfo.CalculateRelicSet();
					heroInfo.RefreshHeroSkillByHeroRelic();
					MenuMgr.instance.sendNotification(Constant.HeroRelic.RelicEquipSuccess, null); 
				}
			};	

			UnityNet.heroRelicUpdate(downRid, heroId, 2, slot + 1, onHeroRelicUpdate, null);
		}

		public void EquipAndReplaceHeroRelic(int upRid, int heroId, int slot)
		{
			Action<HashObject> onHeroRelicUpdate = delegate (HashObject ho)
			{
				if(_Global.GetBoolean(ho["ok"]))
				{
					HeroInfo heroInfo = KBN.HeroManager.Instance.GetHeroInfo(heroId);
					HashObject heroBasic = ho["heroBasic"];
					heroInfo.Attack = _Global.INT32(heroBasic["attack"]);
					heroInfo.Health = _Global.INT32(heroBasic["hp"]);
					heroInfo.Load = _Global.INT32(heroBasic["load"]);

					if(heroInfo.Relic[slot] != 0)
					{								
						int downRelicId = heroInfo.Relic[slot];
						HeroRelicInfo downRelicInfo = GetHeroRelicInfo(downRelicId);
						downRelicInfo.UserHeroId = 0;
					}
					// 把英雄身上的圣物换成新装备的圣物
					heroInfo.Relic[slot] = upRid;						
					HeroRelicInfo upRelicInfo = GetHeroRelicInfo(upRid);
					upRelicInfo.UserHeroId = heroId;
					
					heroInfo.CalculateRelicSet();
					heroInfo.RefreshHeroSkillByHeroRelic();
					MenuMgr.instance.sendNotification(Constant.HeroRelic.RelicEquipSuccess, null); 
				}
			};	

			UnityNet.heroRelicUpdate(upRid, heroId, 1, slot + 1, onHeroRelicUpdate, null);
		}

		public void UpgradeHeroRelic(int rid, List<HeroRelicInfo> upgradeList) 
		{
			if(upgradeList.Count == 0)
			{
				String msg = Datas.getArString("HeroRelic.NotSelectRelic");
				MenuMgr.instance.PushMessage(msg);
				return;
			}
			string oid = "";
			for(int i = 0; i < upgradeList.Count; i++)
			{
				oid += upgradeList[i].RelicId;
				if(i != upgradeList.Count - 1)
				{
					oid += ",";
				}
			}

			Action<HashObject> onHeroRelicUpgrade = delegate (HashObject ho)
			{
				if(_Global.GetBoolean(ho["ok"]))
				{
					// 删除材料
					for(int i = 0; i < upgradeList.Count; i++)
					{
						if(heroRelicList.ContainsKey(upgradeList[i].RelicId))
						{
							heroRelicList.Remove(upgradeList[i].RelicId);
						}
					}

					// 修改升级成功后的圣物属性
					HashObject relic = ho["relic"];
					HeroRelicInfo info = new HeroRelicInfo(relic);
					if(heroRelicList.ContainsKey(info.RelicId))
					{
						heroRelicList[info.RelicId] = info;
					}

					// 如果升级的圣物在英雄身上 修改英雄信息
					if(info.UserHeroId != 0)
					{
						HeroInfo heroInfo = KBN.HeroManager.Instance.GetHeroInfo(info.UserHeroId);
						HashObject heroBasic = ho["hero"];
						heroInfo.Attack = _Global.INT32(heroBasic["attack"]);
						heroInfo.Health = _Global.INT32(heroBasic["hp"]);
						heroInfo.Load = _Global.INT32(heroBasic["load"]);
						heroInfo.RefreshHeroSkillByHeroRelic();
					}
		
					MenuMgr.instance.sendNotification(Constant.HeroRelic.RelicUpgradeSuccess, info); 
				}
			};

			UnityNet.relicUpdate(rid, oid, onHeroRelicUpgrade, null);
		}

		// 解锁/锁上圣物 status(1-正常，2-上锁)
		public void ChangeReliccStatus(HeroRelicInfo info, int status)
		{
			Action<HashObject> onChangeRelicStatus = delegate (HashObject ho)
			{
				if(_Global.GetBoolean(ho["ok"]))
				{				
					info.Status = status;
					MenuMgr.instance.sendNotification(Constant.HeroRelic.RelicLockAndUnlocckSuccess, info); 
				}
			};

			UnityNet.changeRelicStatus(info.RelicId, status, onChangeRelicStatus, null);
		}

		// 使用物品添加圣物
		public void addRelic(int itemId)
		{
			Action<HashObject> onAddRelic = delegate (HashObject ho)
			{
				if(_Global.GetBoolean(ho["ok"]))
				{				
					HashObject relic = ho["relic"];
					HeroRelicInfo info = new HeroRelicInfo(relic);
					heroRelicList.Add(info.RelicId, info);

					String msg = Datas.getArString("ToastMsg.UseItem");
					MenuMgr.instance.PushMessage(msg);

					MyItems.singleton.subtractItem(itemId);
				}
			};

			UnityNet.addRelic(itemId, onAddRelic, null);
		}
	}
}
