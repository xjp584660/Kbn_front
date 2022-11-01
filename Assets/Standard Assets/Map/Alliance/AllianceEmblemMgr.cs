using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using JasonReflection;

using _Global = KBN._Global;
using Datas = KBN.Datas;
using GameMain = KBN.GameMain;
using UnityNet = KBN.UnityNet;
using MenuMgr = KBN.MenuMgr;
using Shop = KBN.Shop;
using MyItems = KBN.MyItems;

public enum AllianceEmblemItemType {
	BannerColor = 0,
	Style,
	Symbol,
	StyleColor,
	SymbolColor,
}

public class AllianceEmblemItemData : IComparable<AllianceEmblemItemData> {
	public AllianceEmblemItemType type;
	public int tile;
	public string color;
	public bool locked;

	public int CompareTo (AllianceEmblemItemData other)
	{
		if (!locked && other.locked)
			return -1;
		if (locked && !other.locked)
			return 1;

		if (type == AllianceEmblemItemType.Style || type == AllianceEmblemItemType.Symbol) {
			return (tile - other.tile);
		}

		return color.CompareTo(other.color);
	}
}

public class AllianceEmblemMgr {
	
	public static AllianceEmblemMgr instance {
		get {
			return GameMain.singleton.allianceEmblemMgr;
		}
	}

	private static Dictionary<string, Color> colorMapping = new Dictionary<string, Color>();

	private static int HexStr2Int(string hex) {
		int a = char.IsDigit(hex[0]) ? hex[0] - '0' : hex[0] - 'A' + 10;
		int b = char.IsDigit(hex[1]) ? hex[1] - '0' : hex[1] - 'A' + 10;
		return a * 16 + b;
	}

	public static Color GetColor(string code) {
		if (string.IsNullOrEmpty(code) || code.Length != 6)
			return Color.black;

		code = code.ToUpper();

		if (colorMapping.ContainsKey(code))
			return colorMapping[code];

		if (!Regex.IsMatch(code, "[0-9A-F]{6}"))
			return Color.black;

		int r = HexStr2Int(code.Substring(0, 2));
		int g = HexStr2Int(code.Substring(2, 2));
		int b = HexStr2Int(code.Substring(4, 2));

		colorMapping[code] = new Color(r / 255.0f, g / 255.0f, b / 255.0f);
		return colorMapping[code];
	}

	private static HashSet<string> GetUnlockSet(HashObject array) {
		HashSet<string> ret = new HashSet<string>();
		if (null == array.Table)
			return ret;

		for (int i = 0; i < array.Table.Count; i++) {
			ret.Add(_Global.GetString(array[_Global.ap + i]));
		}
		return ret;
	}

	private static List<AllianceEmblemItemData> ConvertColorList(HashObject colorListConfig, HashObject lockStates, AllianceEmblemItemType type) {
		List<AllianceEmblemItemData> colorList = new List<AllianceEmblemItemData>();
		if (null == colorListConfig)
			return colorList;

		string[] keys = _Global.GetObjectKeys(colorListConfig);
		HashSet<string> unlocks = GetUnlockSet(lockStates);

		foreach (string color in keys) {
			colorList.Add(new AllianceEmblemItemData() {
				type = type,
				color = color,
				locked = (_Global.INT32(colorListConfig[color]) == 1) && !unlocks.Contains(color)
			});
			GetColor(color);
		}
		colorList.Sort();
		return colorList;
	}

	private static List<AllianceEmblemItemData> ConvertIdList(HashObject idListConfig, HashObject lockStates, AllianceEmblemItemType type) {
		List<AllianceEmblemItemData> idList = new List<AllianceEmblemItemData>();
		if (null == idListConfig)
			return idList;

		string[] keys = _Global.GetObjectKeys(idListConfig);
		HashSet<string> unlocks = GetUnlockSet(lockStates);

		for (int i = 0; i < keys.Length; i++) {
			int id = _Global.INT32(keys[i]);
			idList.Add(new AllianceEmblemItemData() {
				type = type,
				tile = id,
				locked = (_Global.INT32(idListConfig[keys[i]]) == 1) && !unlocks.Contains(keys[i])
			});
		}
		idList.Sort();
		return idList;
	}
	
	
	public static List<AllianceEmblemItemData> GetBannerColors(HashObject lockStates) {
		return ConvertColorList(Datas.singleton.allianceEmblemConfig()["banner"], lockStates["banner"], AllianceEmblemItemType.BannerColor);
	}

	public static List<AllianceEmblemItemData> GetStyles(HashObject lockStates) {
		return ConvertIdList(Datas.singleton.allianceEmblemConfig()["style"], lockStates["style"], AllianceEmblemItemType.Style);
	}

	public static List<AllianceEmblemItemData> GetStyleColors(HashObject lockStates) {
		return ConvertColorList(Datas.singleton.allianceEmblemConfig()["styleColor"], lockStates["styleColor"], AllianceEmblemItemType.StyleColor);
	}

	public static List<AllianceEmblemItemData> GetSymbols(HashObject lockStates) {
		return ConvertIdList(Datas.singleton.allianceEmblemConfig()["symbol"], lockStates["symbol"], AllianceEmblemItemType.Symbol);
	}

	public static List<AllianceEmblemItemData> GetSymbolColors(HashObject lockStates) {
		return ConvertColorList(Datas.singleton.allianceEmblemConfig()["symbolColor"], lockStates["symbolColor"], AllianceEmblemItemType.SymbolColor);
	}
	
	public AllianceEmblemData playerAllianceEmblem {get; private set;}

	public void UpdateBySeed(HashObject seed) {
		if (null != seed["allianceEmblems"] && String.Empty != seed["allianceEmblems"].Value) {
			AllianceEmblemData data = new AllianceEmblemData();
			JasonConvertHelper.ParseToObjectOnce(data, seed["allianceEmblems"]);
			UpdateAllianceEmblem(data);
		} else {
			UpdateAllianceEmblem(null);
		}
	}

	public void UpdateAllianceEmblem(AllianceEmblemData emblem, bool notifyMenus = true) {
		if (AllianceEmblemData.Empty.Equals(emblem))
			playerAllianceEmblem = null;
		else
			playerAllianceEmblem = emblem;

		if (notifyMenus)
			MenuMgr.instance.SendNotification(Constant.Notice.ALLIANCE_EMBLEM_CHANGED);
	}

	public void SaveAllianceEmblem(AllianceEmblemData data) {
		Action useItemFunc = delegate () {
			
			UnityNet.reqSaveAllianceEmblem(
				data.banner, 
				data.style, 
				data.styleColor, 
				data.symbol, 
				data.symbolColor, 
				delegate (HashObject result) {
				if (_Global.GetBoolean(result["ok"])) {
					MyItems.singleton.subtractItem(2421);
					UpdateBySeed(result);
				}
			}, 
			null);
			
		};

		if (MyItems.singleton.countForItem(2421) > 0)
			useItemFunc();
		else
			Shop.singleton.swiftBuy(2421, useItemFunc);
	}
}
