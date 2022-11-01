using UnityEngine;
using KBN;

// Define the property type
public class ItemPropertyKind
{
	// The value is same with Server declare
	public const int Null = -10000;

	public const int Level = 0; // No use here
	public const int Attack = 1;
	public const int Life = 2;
	public const int TroopsLimit = 3;
	
	public const int Load = 4;
	public const int Speed = 5;
	
	public const int Upkeep = 6;
	public const int Might = 7;
	public const int Trainable = 8;
	public const int LifeRate = 9;
	public const int AttackRate = 10;

	public static Texture2D GetTextureByKind(int kind)
	{
		Texture2D image = null;
		switch (kind)
		{
		case Null:
			image = null;
		break;
		case Level:
			image = TextureMgr.instance().LoadTexture("Button_UserInfo_lv", TextureType.DECORATION);
		break;
		case Life:
			image = TextureMgr.instance().LoadTexture("icon_life", TextureType.BUTTON);
		break;
		case Attack:
			image = TextureMgr.instance().LoadTexture("swords", TextureType.BUTTON);
		break;
		case TroopsLimit:
			image = TextureMgr.instance().LoadTexture("icon_solider", TextureType.ICON);
		break;
		}
		
		return image;
	}
	
	public static string GetTextureByArmSkill(ArmSkill arm)
	{
		string imageName = "";
		
		int kind = 0; // arm.xxx;
		switch (kind)
		{
		case Null:
			imageName = "Archers";
		break;
		case Attack:
			imageName = "Attack";
		break;
		case Life:
			imageName = "Life";
		break;
		case TroopsLimit:
			imageName = "TroopsLimit";
		break;
		}
		
		bool isLight = false; // arm.xxx;
		if (isLight)
			imageName += ("_" + GearSysHelpUtils.LightString);
		else
			imageName += ("_" + GearSysHelpUtils.DarkString);
		
//		image = TextureMgr.instance().LoadTexture(imageName, TextureType.GEAR);
		return imageName;
	}
}

// Job declare
public class ItemSupportJobKind
{
	public const int Archers = 1;
	public const int Infantry = 2;
	public const int Cavalry = 3;
	
	public const int All = 99;
	
	public static string GetTextureByArmSkill(ArmSkill arm)
	{
		string imageName = "";
		
		int job = 0; // arm.xxx;
		switch (job)
		{
		case Archers:
			imageName = "Archers";
		break;
		case Infantry:
			imageName = "Infantry";
		break;
		case Cavalry:
			imageName = "Cavalry";
		break;
		case All:
			imageName = "Troops";
		break;
		}
		
		bool isLight = false; // arm.xxx;
		if (isLight)
			imageName += ("_" + GearSysHelpUtils.LightString);
		else
			imageName += ("_" + GearSysHelpUtils.DarkString);
		
//		image = TextureMgr.instance().LoadTexture(imageName, TextureType.GEAR);
		return imageName;
	}
}

// Stars declare
public class ItemSwallowStarLevel
{
	public static string GetTextureByArmSkill(ArmSkill arm)
	{
		string imageName = "";
		
		int star = 0; // arm.xxx;
		imageName = "Aperture";
		
		bool isLight = false; // arm.xxx;
		if (isLight)
			imageName += ("_" + GearSysHelpUtils.LightString);
		else
			imageName += ("_" + GearSysHelpUtils.DarkString);
			
		imageName += star.ToString();
//		image = TextureMgr.instance().LoadTexture(imageName, TextureType.GEAR);
		return imageName;
	}
}

public class GearSysHelpUtils
{
	//-----------------------------------------------------------------
	// Fixed hard code
	//-----------------------------------------------------------------
	public static float UseItemRate = 1.0f;
	public static float UseToolsRate = 1.0f;
	
	public const float DividendFactor = 10000.0f;
	
	public const string DarkString = "dark"; // Not active
	public const string LightString = "Light"; // Active
	
	public const string ImageNameIsDressed = "DressPrompt_icon";
	
	public const string ImageArrowRise = "Rise";
	public const string ImageArrowDown = "Decline";
	
	public static readonly string[] NullEquipImageNames = new string[]{"Weapon", "Shoe", "Helmet", "Armor", "Pants", "Ring"};
	public static readonly string[] NullEquipPrompts = new string[]{"Gear.NoWeaponDesc", "Gear.NoShieldDesc"
												, "Gear.NoHelmetDesc", "Gear.NoArmorDesc"
												, "Gear.NoPantsDesc", "Gear.NoRingDesc"};
	
	
	public static int[] getStrengthenItemIds()
	{
		HashObject levelUpTools = Datas.singleton.gearLevelUpTools();
		if (null == levelUpTools || null == levelUpTools[_Global.ap + 0] )
			return new int[]{5001, 5002, 5003, 5004, -1};
		System.Collections.Hashtable table = levelUpTools[_Global.ap + 0].Table;
		int[] ids = new int[table.Count + 1];
		for (int i = 0; i < table.Count; i++) {
			ids[i] = _Global.INT32(table[_Global.ap + i]);
		}
		ids[table.Count] = -1;
		return ids;
	}
	
	public static int[] getChaseHammerIdsForLevel(int level)
	{	
		HashObject levelUpTools = Datas.singleton.gearLevelUpTools();
		if (null == levelUpTools || null == levelUpTools[_Global.ap + level]) return new int[0];
		HashObject list = levelUpTools[_Global.ap + level];
		int[] ret = new int[list.Table.Count];
		for (int i = 0; i < list.Table.Count; i++) {
			ret[i] = _Global.INT32(list[_Global.ap + i].Value);
		}
		return ret;
	}
	
	public static string GetStarNameByArm(Arm arm)
	{
		string name = string.Empty;
		if (arm.StarLevel > 0)
			name = "Star_Medalno" + arm.StarLevel;
		else
			name = "Star_Medalno";
			
		return name;
	}
	
	public static void SetKnightProp(Label propLabel, int propKind, object val)
	{
		string szVal = "";
		
		// Detect the Object type is Basic type in js
		if (val is bool
		    || val is int
		    || val is long)
		{ 
			szVal = val.ToString();
		}
		else if (val is float || val is double)
		{
			// Keep 2 values after the radix point 
			szVal = val.ToString();
		}
		// Check the Function and real Object type use keyword instanceof
		//if (val instanceof Label)
		
		Texture2D image = ItemPropertyKind.GetTextureByKind(propKind);
		propLabel.txt = szVal;
		propLabel.mystyle.normal.background = image;
	}
	
	public static void SetItemProp(Label propLabel, int propKind, object val)
	{
		SetKnightProp(propLabel, propKind, val);
	}
	
	public static void ChangeLabelToTile(Label label, string imageName)
	{
		label.tile = TextureMgr.instance().GetGearIcon(imageName);
		label.useTile = true;
	}
	
	public static void SetLabelTexture(Label label, string imageName, string texType)
	{
		Texture2D image = null;
		
		if (!string.IsNullOrEmpty(imageName))
			image = TextureMgr.instance().LoadTexture(imageName, texType);
		label.mystyle.normal.background = image;
	}
	
	public static void SetLabelTexture(Label label, Texture2D image)
	{
		label.useTile = false;
		label.mystyle.normal.background = image;
	}
	
	public static void SetEquipItemIcon(Label itemIcon, Arm data)
	{ 
		string iconName = GearManager.Instance().GetImageName(data);
		itemIcon.tile = TextureMgr.instance().GetGearIcon(iconName);
		itemIcon.useTile = true;
	} 
	
	public static void SetEquipItemIcon(Label itemIcon, int gearId)
	{ 
		//Arm arm= GearManager.Instance().GearWeaponry.GetArm(gearId);
		//if(arm == null) return;
		int rare = GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetRare(gearId);
		string iconName = GameMain.GdsManager.GetGds<KBN.GDS_Gear>().GetPic(gearId,rare);
		itemIcon.tile = TextureMgr.instance().GetGearIcon(iconName);
		itemIcon.useTile = true;
	} 
	
	public static void SetMyItemIcon(Label itemIcon, int itemId)
	{  
		itemIcon.useTile = true;
		itemIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile("i" + itemId.ToString());
		// itemIcon.tile.name = TextureMgr.instance().LoadTileNameOfItem(itemId);
		//itemIcon.tile.name = "i" + itemId.ToString();
	}
	
	public static void SetMyItemIcon(Label itemIcon, string itemIconName)
	{  
		itemIcon.useTile = true;
		itemIcon.tile = TextureMgr.instance().ElseIconSpt().GetTile(itemIconName);
	}
	
	public static Vector2 Screen2GUIPosition(Vector2 screenPos)
	{
		// Input.mousePostion in Screen coordinate is from[Left, Bottom], 
		// and GUI coordinate is from[Left, Top], need care the Screen.width / Screen.height
		screenPos.y = Screen.height - screenPos.y;
		
		screenPos.x = screenPos.x / Screen.width * 640.0f;
		screenPos.y = screenPos.y / Screen.height * 960.0f;
		
		return screenPos;
	}
	
	public static ConfirmDialog PopupDefaultDialog(string title, string content, bool isOkCancel)
	{
		ConfirmDialog dialog = MenuMgr.instance.getConfirmDialog();
		
		dialog.setLayout(600, 380);
		dialog.setTitleY(60);
		dialog.setContentRect(70, 140, 0, 100);
		dialog.SetCancelAble(isOkCancel);
		
		MenuMgr.instance.PushConfirmDialog(content, title, null, null);
		dialog.setDefaultButtonText();
		return dialog;
	}
}
