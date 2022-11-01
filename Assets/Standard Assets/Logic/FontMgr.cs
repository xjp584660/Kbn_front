using UnityEngine;
using System.Collections;


public class FontMgr
{
	private	static bool inited;
	private static Font m_FontGeorgiab;//title,button
	private static Font m_Fontcambriab;//description,small title ,tab

	public	static	void Init()
	{
		if( inited )
			return;
		if (Application.platform == RuntimePlatform.Android)
		{
			m_Fontcambriab = TextureMgr.singleton.LoadFont("DroidSansFallback",TextureType.FONT);
			m_FontGeorgiab = TextureMgr.singleton.LoadFont("DroidSansFallback",TextureType.FONT);
		}
		else
		{
			m_Fontcambriab = TextureMgr.singleton.LoadFont("trebuc",TextureType.FONT);
			m_FontGeorgiab = TextureMgr.singleton.LoadFont("GEORGIAB",TextureType.FONT);
		}
		inited = true;
		
		//		_Global.Log("load font");
	}
	
	public static void SetStyleTextColor(GUIStyleState stylestate, FontColor colorType)
	{
		if ( colorType == FontColor.END || colorType == FontColor.Default )
			return;
		stylestate.textColor = GetColorFromTextColorEnum(colorType);
	}
	
	public static Color GetColorFromTextColorEnum(FontColor colorType)
	{
		switch(colorType)
		{
		case FontColor.New_Describe_Grey_1: return Constant.ColorValue.ToRGBA(89,41,9);
		case FontColor.New_Describe_Grey_2: return Constant.ColorValue.ToRGBA(164,139,105);
		case FontColor.New_Num: return Constant.ColorValue.ToRGBA(218,164,128);
		case FontColor.New_Mail_Content: return Constant.ColorValue.ToRGBA(129,59,12);
		case FontColor.New_PopUp_Time_Red: return Constant.ColorValue.ToRGBA(124,30,9);
		case FontColor.New_Common_Red: return Constant.ColorValue.ToRGBA(121,56,17);
		case FontColor.New_PopUp_Title_Red: return Constant.ColorValue.ToRGBA(164,18,6);
		case FontColor.New_Mail_Red: return Constant.ColorValue.ToRGBA(121,28,0);
		case FontColor.New_Title_Yellow: return Constant.ColorValue.ToRGBA(255,209,100);
		case FontColor.New_Level_Yellow: return Constant.ColorValue.ToRGBA(255,237,197);
		case FontColor.New_PassWord_Yellow: return Constant.ColorValue.ToRGBA(108,91,56);
		case FontColor.New_PageTab_Yellow: return Constant.ColorValue.ToRGBA(235,210,166);
		case FontColor.New_PopUp_Title_Green: return Constant.ColorValue.ToRGBA(5,109,39);
		case FontColor.New_OwnedNum_Orange: return Constant.ColorValue.ToRGBA(246,151,83);
		case FontColor.New_Time_Orange: return Constant.ColorValue.ToRGBA(161,98,36);
		case FontColor.New_Blue: return Constant.ColorValue.ToRGBA(59,223,253);
		case FontColor.New_Payment_Grey : return Constant.ColorValue.ToRGBA(113,65,14);
		case FontColor.New_KnightName_Blue : return Constant.ColorValue.ToRGBA(255,174,116);

		case FontColor.Description_Dark: return Constant.ColorValue.ToRGBA(207,169,114);
		case FontColor.Title: return Constant.ColorValue.ToRGBA(235,208,168);
		case FontColor.TabDown: return Constant.ColorValue.ToRGBA(249,237,145);
		case FontColor.TabNormal: return Constant.ColorValue.ToRGBA(33,11,3);
		case FontColor.Red: return Constant.ColorValue.ToRGBA(237,0,0);
		case FontColor.Yellow: return Constant.ColorValue.ToRGBA(234,146,3);
		case FontColor.Blue: return Constant.ColorValue.ToRGBA(0,160,233);
		case FontColor.SmallTitle: return Constant.ColorValue.ToRGBA(129,81,28);
		case FontColor.Description_Light: return Constant.ColorValue.ToRGBA(153,108,51);
		case FontColor.Grey: return Constant.ColorValue.ToRGBA(89,73,63);
		case FontColor.END:
		case  FontColor.Button_White:
			return Constant.ColorValue.ToRGBA(255,255,255);
		case FontColor.Green: return Constant.ColorValue.ToRGBA(74,167,49);
		case FontColor.TabNormal_Light: return Constant.ColorValue.ToRGBA(207,169,114);
		case FontColor.Milk_White: return Constant.ColorValue.ToRGBA(247,233,211);
		case FontColor.Dark_Red: return Constant.ColorValue.ToRGBA(114,0,0);
		case FontColor.Pure_Green: return Constant.ColorValue.ToRGBA(0,255,0);
		case FontColor.Light_Yellow: return Constant.ColorValue.ToRGBA(254,223,161);
		case FontColor.Sale_Gray: return Constant.ColorValue.ToRGBA(181,181,181);
		case FontColor.Small_Gray: return Constant.ColorValue.ToRGBA(146,139,128);
		case FontColor.Orange: return Constant.ColorValue.ToRGBA(248, 118, 0);
		case FontColor.Pure_Yellow: return Constant.ColorValue.ToRGBA(255,255,0);
		case FontColor.New_GearGem_Green: return Constant.ColorValue.ToRGBA(50,221,31);	
		case FontColor.New_GearInfo_Yellow: return Constant.ColorValue.ToRGBA(235,196,144);	
		case FontColor.New_Tech_Yellow: return Constant.ColorValue.ToRGBA(255,223,6);
		case FontColor.New_Tech_Red: return Constant.ColorValue.ToRGBA(198,5,5);	

		case FontColor._Gray_: return Constant.ColorValue.ToRGBA(68,58,48);	
		case FontColor._Green_: return Constant.ColorValue.ToRGBA(56,135,30);	
		case FontColor._Title_: return Constant.ColorValue.ToRGBA(215,205,165);	
		case FontColor._Des_: return Constant.ColorValue.ToRGBA(208,193,160);	
		case FontColor._Title2_: return Constant.ColorValue.ToRGBA(181,158,82);	
		case FontColor._Red_: return Constant.ColorValue.ToRGBA(222,68,60);	
		case FontColor._Title3_: return Constant.ColorValue.ToRGBA(255,200,90);	
		case FontColor._OrangeRed_: return Constant.ColorValue.ToRGBA(207,102,72);	
		case FontColor._Des2_: return Constant.ColorValue.ToRGBA(207,193,166);	
		case FontColor._RedOrange2_: return Constant.ColorValue.ToRGBA(250,122,97);	
		case FontColor._Green2_: return Constant.ColorValue.ToRGBA(182,249,134);	
		case FontColor._DeepGray_: return Constant.ColorValue.ToRGBA(60,54,30);	
		case FontColor._DeepGray2_: return Constant.ColorValue.ToRGBA(84,69,66);	
		case FontColor._Dark_:return Constant.ColorValue.ToRGBA(0,0,0);
		case FontColor.blue_1: return Constant.ColorValue.ToRGBA(0, 0, 255);
			default:
				return Constant.ColorValue.ToRGBA(207, 169, 114);
		}
	}
	
	public static void SetStyleFont(GUIStyle style,FontSize size,FontType type)
	{
		switch(type)
		{
		case FontType.TREBUC: style.font = m_Fontcambriab;
			break;
		case FontType.GEORGIAB: style.font = m_FontGeorgiab;
			break;
		default:
			style.font = m_Fontcambriab;
			break;
		}

		try
		{
			style.fontSize = KBN._Global.INT32(size.ToString().Substring(5));
		}
		catch(System.Exception /*e*/)
		{
			style.fontSize = 18;
		}
		
		//players don't like font_18
		if(style.font == m_Fontcambriab)
		{
//			if(style.fontSize == 18)
//			{
//				style.fontSize = 20;
//			}
			if(style.fontSize == 36)
			{	
				style.fontSize = 40;
			}
		}
		
		if(Application.platform == RuntimePlatform.Android)
		{
			style.fontSize -= 2;
		}
	}

	public static FontSize GetFontSize(string sizeStr)
	{
		switch(sizeStr)
		{
		case "font_small":
			return FontSize.Font_18;
		case "font_small_bold":
			return FontSize.Font_18;
		case "font_middle":
			return FontSize.Font_22;
		case "font_middle_bold":
			return FontSize.Font_22;
			
		case "font_big":
			return FontSize.Font_25;
		case "font_big_bold":
			return FontSize.Font_25;
		}

		return (FontSize)System.Enum.Parse(typeof(FontSize), sizeStr);
	}
	
	//public static void LoadFont(AssetBundle fontAsset)
	//{
	//	/*
	//	font_middle = fontAsset.Load("Treb"+ "_"+"English" + "_Middle");
	//	font_middle_bold = fontAsset.Load("Treb"+ "_"+"English" + "_Middle_Bold");
	//	font_big = fontAsset.Load("Treb"+ "_"+"English" + "_Big");
	//	font_big_bold = fontAsset.Load("Treb"+ "_"+"English" + "_Big_Bold");
	//	m_fontAsset = fontAsset;
	//*/
	//}
	
}
