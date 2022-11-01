public enum FontSize
{
	Font_BEGIN,	//18  description
	
	Font_18,		//18  description
	Font_20,		//20  small title
	Font_22,		//22  sub title
	Font_25,		//25  title,button

	Font_32,		//16x2
	Font_36,		//18x2
	Font_40,		//20x2
	Font_44,		//22x2
	Font_50,		//25x2

	Font_16,

	Font_80,		//retain screen 2048*1536 Level
	
	END
}


public enum FontType
{
	BEGIN,
	
	TREBUC,		// others
	GEORGIAB,		//title,button
	
	
	END
}


public enum FontColor
{
	Default = -1,		//skip default option.
	BEGIN,
	
	Description_Dark, 	//207,169,114	#CFA972		default
	Title,				//235,208,168   #EBD0A8 	nextlevel title
	TabDown,			//249,237,145	#F9ED91
	TabNormal,			//33,11,3		#210B03
	Red,				//243,20,62		#F3143E
	Yellow,				//234,146,3		#EA9203
	Blue,				//0,160,233		#00A0E9
	SmallTitle,			//129,81,28		#81511C
	Description_Light,	//153,108,51	#996C33
	Grey,				//89,73,63		#59493F		Title_Light
	Button_White,		//255,255,255	#FFFFFF
	Green,				//74,167,49		#4AA731
	TabNormal_Light,	//207,169,114	#CFA972
	Milk_White,			//247,233,211	#F7E9D3
	Dark_Red,			//114,0,0		#720000
	Pure_Green,			//0,255,0
	Sale_Gray,			//181,181,181
	Small_Gray,         //146,139,128
	Light_Yellow,       //254,223,161
	Orange,				//248,118,0
	Pure_Yellow,        //255,255,0 by Caisen

	New_Describe_Grey_1,			//89,41,9
	New_Describe_Grey_2,			//164,139,105
	New_Num, 						//218,164,128
	New_Mail_Content,				//129,59,12
	New_PopUp_Time_Red,				//124,30,9
	New_Common_Red,					//121,56,17
	New_PopUp_Title_Red,			//164,18,6
	New_Mail_Red,					//121,28,0
	New_Title_Yellow,				//255,209,100
	New_Level_Yellow,				//255,237,197
	New_PassWord_Yellow,			//108,91,56
	New_PageTab_Yellow,				//235,210,166
	New_PopUp_Title_Green,			//5,109,39
	New_OwnedNum_Orange,			//246,151,83
	New_Time_Orange,				//161,98,36
	New_Blue,						//59,223,253
	New_Payment_Grey,               //113,65,14
	New_GearGem_Green,              //50,221,31
	New_GearInfo_Yellow,            //235,196,144
	New_Tech_Yellow,                //255,223,6
	New_Tech_Red, 					//198,5,5
	New_KnightName_Blue,            //255,174,116

	_Gray_,            //#443A30
	_Green_,           //#38871E
	_Title_,           //#D7CDA5
	_Des_,             //#D0C1A0
	_Title2_,          //#B59E52
	_Red_,             //#DE443C
	_Title3_,          //#FFC85A
	_OrangeRed_,       //#CF6548
	_Des2_,            //#CFC1A6
	_RedOrange2_,      //#FA7B61
	_Green2_,          //#B6F986
	_DeepGray_,        //#3C361E
	_DeepGray2_,       //#544542
	_Dark_,            // 0,0,0
	blue_1,           // 0,0,255
	END
}

[UILayout.HaveValueCastAttribute]
static public class FontCastHelp
{
	[UILayout.ValueCastAttribute]
	public static FontSize CastToFontSize(string fontSize)
	{
		return (FontSize)System.Enum.Parse(typeof(FontSize), fontSize);
	}

	[UILayout.ValueCastAttribute]
	public static FontType CastToFontType(string fontType)
	{
		return (FontType)System.Enum.Parse(typeof(FontType), fontType);
	}

	[UILayout.ValueCastAttribute]
	public static FontColor CastToFontColor(string fontColor)
	{
		return (FontColor)System.Enum.Parse(typeof(FontColor), fontColor);
	}
}
