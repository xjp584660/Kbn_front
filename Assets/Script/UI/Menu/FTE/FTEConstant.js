public class  FTEConstant
{
	class Step
	{
		//NPC talking......		
		public static var FTE_FIRST_STEP	:int = 101; //DON't modify this.(equals BACKGROUND1)
		
		public static var FTE_SKIPFROM_STEP		:int = 201;	//next of 101...
		public static var FTE_SKIP2_STEP	:int = 9999;
		//BACKGROUND
		public static var BACKGROUND_1		:int = 101;
		public static var BACKGROUND_2		:int = 102;		
		//MAP
		public static var MAP_1		:int = 201;
		public static var MAP_2		:int = 202;
		public static var MAP_3		:int = 203;
		public static var MAP_4		:int = 204;
		public static var MAP_5		:int = 205;
		//debug 

		
		//Build House
		public static var BUILD_HOUSE_BEGIN			:int = 301;
		public static var BUILD_HOUSE_CLICK_SLOT	:int = BUILD_HOUSE_BEGIN + 1;
		public static var BUILD_HOUSE_CLICK_NEXT	:int = BUILD_HOUSE_BEGIN + 2;
		public static var BUILD_HOUSE_CLICK_BUILD	:int = BUILD_HOUSE_BEGIN + 3;
		public static var BUILD_HOUSE_WAIT			:int = BUILD_HOUSE_BEGIN + 4;
		public static var BUILD_HOUSE_COMPLETE		:int = 401;	//401
		//Quest 1; see FTEDEV.doc FTEMgr part. ...link
		public static var TASK_1_CLICK_QUESTS	:int = 401;
		public static var TASK_1_CLICK_NEXT		:int = TASK_1_CLICK_QUESTS + 1;
		public static var TASK_1_CLICK_REWARD	:int = TASK_1_CLICK_QUESTS + 2;
		public static var TASK_1_CLICK_DETAIL	:int = TASK_1_CLICK_QUESTS + 3;
		public static var TASK_1_CLICK_HOME		:int = TASK_1_CLICK_QUESTS + 4;	//405
		
		//change view 
		public static var VIEW_CHANGE				:int = 501;
		//Farm
		public static var UP_BUILD_CLICK_FARM		:int = 601;
		public static var UP_BUILD_CLICK_UPGRADE	:int = UP_BUILD_CLICK_FARM + 1;
		public static var UP_BUILD_WAIT				:int = UP_BUILD_CLICK_FARM + 2;
		public static var UP_BUILD_SPEED_UP_CLICK	:int = UP_BUILD_CLICK_FARM + 3;
		public static var UP_BUILD_SPEED_UP_MENU	:int = UP_BUILD_CLICK_FARM + 4;
		public static var UP_BUILD_SPEED_WAIT_FOR_LVUP : int = UP_BUILD_CLICK_FARM + 5;
		public static var UP_BUILD_SPEED_2_LEVELUP : int = UP_BUILD_CLICK_FARM + 6;

		public static var UP_BUILD_COMPLETE			:int = 701;
		// Task2;
		public static var TASK_2_CLICK_QUEST 	:int = 701;
		public static var TASK_2_CLICK_NEXT  	:int = TASK_2_CLICK_QUEST + 1;
		public static var TASK_2_CLICK_REWARD	:int = TASK_2_CLICK_QUEST + 2;
		public static var TASK_2_CLICK_HOME	 	:int = TASK_2_CLICK_QUEST + 3;
		public static var TASK_2_CLICK_SWITCH	:int = TASK_2_CLICK_QUEST + 4;
		//create alchemy
		public static var BUILD_ACADEMY_CLICK_SLOT	:int = 801;
		public static var BUILD_ACADEMY_CLICK_NEXT	:int = BUILD_ACADEMY_CLICK_SLOT + 1;
		public static var BUILD_ACADEMY_CLICK_BUILD	:int = BUILD_ACADEMY_CLICK_SLOT + 2;
		public static var BUILD_ACADEMY_CLICK_WAIT	:int = BUILD_ACADEMY_CLICK_SLOT + 3;
		public static var BUILD_ACADEMY_COMPLETE	:int = BUILD_ACADEMY_CLICK_SLOT + 4;
		
		//Research 
		public static var UP_TECH_CLICK_ACADEMY 	:int = 901;
		public static var UP_TECH_CLICK_TAB			:int = UP_TECH_CLICK_ACADEMY + 1;
		public static var UP_TECH_CLICK_NEXT		:int = UP_TECH_CLICK_ACADEMY + 2;
		public static var UP_TECH_CLICK_RESEARCH	:int = UP_TECH_CLICK_ACADEMY + 3;
		public static var UP_TECH_WAIT				:int = UP_TECH_CLICK_ACADEMY + 4; //
		
		///=========
		
		//SPEEDUP -> link...
		public static var SPEED_UP_OPEN				:int = 1001;
		public static var SPEED_UP_CLICK_INSTANT	:int = SPEED_UP_OPEN + 1;
		public static var SPEED_UP_COMPLETE			:int = SPEED_UP_OPEN + 2;
		public static var SPEED_UP_2_OPEN_LEVELUP	:int = 1099;
		//Levelup 
		public static var LEVEL_UP_CLAIM:int = 1101;
		public static var LEVEL_UP_OK	:int = 1102;

		//ITEMS
		public static var ITEMS_CLICK_ITEMS	:int = 1201;
		public static var ITEMS_CLICK_TAB_1	:int = ITEMS_CLICK_ITEMS + 1;
		public static var ITEMS_CLICK_TAB_2	:int = ITEMS_CLICK_ITEMS + 2;
		public static var ITEMS_CLICK_USE	:int = ITEMS_CLICK_ITEMS + 3;
		//END
		public static var END_NPC_1	:int = 1301;
		public static var END_NPC_2 :int = 1302;		
		public static var END_NPC_3 :int = 1303;		
		public static var COMPLETE_STEP:int = 9999;
	}
	class Action
	{
		public static var Next 			:String = "next";
		public static var ShowNext		:String = "shownext";
		public static var FadeIn_End	:String = "fade_in_end";
		public static var FadeOut_End	:String = "fade_out_end";
			
		public static var Show_GlobalMask:String = "showGlobalMask";
		
		public static var SkipToEnd		:String = "skip_to_end";
	}
	class Data
	{
		public static var Slot_Farm		:int = 100; 
		public static var Slot_House	:int = 10;
		public static var Slot_Academy	:int = 2;
		
		public static var Quest_Comoplete_Id1		:int = 1051;
		public static var Quest_Detail_Id1			:int = 6010;
		public static var Quest_LeveUPId			:int = 11002;
		public static var Quest_Comoplete_Id2		:int = 6010; //TODO  6010
		public static var Quest_BuildAcademy_Id		:int = 1111;
		public static var Quest_UseChestId			:int = 999020;
		public static var Quest_ResearchId			:int = 2011;
		
		//
		public static var Research_Time :long = 30;
		public static var Research_Time_Fast :long = 5;
		public static var Build_Time	:int = 5;
		public static var BuildUpgrade_Time : int = 15;

		public static var SpeedUp_ItemId:int = 7;
		public static var Used_ItemId	:int = 10020;
	}
	class Module
	{
		public static var BACKGROUND	:int = 1;
		public static var MAP			:int = 2;
		public static var BUILD_HOUSE	:int = 3;
		public static var TASK_1		:int = 4;
		public static var VIEW_CHANGE	:int = 5;
		public static var UP_BUILD		:int = 6;
		public static var TASK_2		:int = 7;
		public static var BUILD_ACADEMY	:int = 8;
		public static var UP_TECH		:int = 9;
		public static var SPEED_UP		:int = 10;
		public static var LEVEL_UP		:int = 11;
		public static var ITEMS			:int = 12;
		public static var END			:int = 13;
	}
	class ElementType
	{
		public static var ET_Text:String = "label";
		
		public static var ET_TypingText	:String = "typingtext";
		public static var ET_FloatText  :String = "floattext";
		public static var ET_Button		:String = "button";
		public static var ET_Label		:String = "label";
		public static var ET_Texture	:String = "texture";
		public static var ET_NpcView	:String = "npcview";
		public static var ET_Hand		:String = "hand";
		public static var ET_Light		:String = "light";
		public static var ET_BlueNext	:String = "bluenext";
		public static var ET_END		:String = "end";
		public static var ET_SKIP		:String = "skip";
		
		public static var ET_StoreText	:String = "storetext";
		public static var ET_EffectTexture:String = "effecttexture";
	}
	class StepType
	{
		public static var ST_StoryCard	:String = "storycard";
		
	}
/****************************************************************************
	SETPVO:
		nextStep		
		rollStep
		
		Elements:
		
		All Properties:
			type		:String		//[label,button,"texture" arraow1..arrow4.. userDefine!]
			onNoraml	:String 	//
			onActive	:String 	//
			rect		:Rect;		//
			border		:RectOffset	//
			font		:FontSize	//
			action		:String		//
			visible		:String		//
			delayTime	:float		//
			textPath	:String		//
			textAlign	:TextAnchor.MiddleCenter		//
			
		{"type":"label", "textPath": "FTE.STEP1", "onNormal":"", "rect":{"x":0, "y":0, "width":0, "height":0},"border":{"top":0, "left":0, "right":0, "bottom":0}},
		
		{"type":"button", "textPath": "Common.Next", "onNormal":"Textures/UI/button/button_60_blue_normal", "onActive":"Textures/UI/button/button_60_blue_down", "action":"next", "rect":{"x":0, "y":0, "width":0, "height":0}, "border":{"left":0, "top":0, "right":0, "bottom":0}}
		
		{"type":"texture","texturePath":"", "x":0, "y":0};
		
		//TEMPLATE
		"rect:{x:0,y:0,width:0,height:0},
		border:{top:0,left:0,right:0, bottom:0},
		color:{"a":1, "r":1, "g":1, "b":1},
		
		{"type":"npcview","npcx":00, "npcy":00, "bgx":00, "bgy":00, "bgw":00, "bgh":00 }		
		{"type":"npcview","npcPath":"Textures/UI/FTE/character_Drust", "bgy": 400}
		
		{"type":"hand", "pos":0, "rect":{"x":200, "y":600, "width":160, "height":110} }
****************************************************************************/
	static static var g_fteVersion = 0;
	public static function SetFteVersion(ver : int)
	{
		g_fteVersion = ver;
	}
	public static function GetFteVersion() : int
	{
		return g_fteVersion;
	}
	public static function FTE_Steps() : Hashtable
	{
		switch ( g_fteVersion )
		{
		case 0:
			return FteStage0.m_FTE_Steps;
		case 1:
				if(KBN._Global.isIphoneX()) {
					return FteStage_X.m_FTE_Steps;
				}
			return FteStage1.m_FTE_Steps;
		case 2:
			return FteStage2.m_FTE_Steps;
		}
		
		return FteStage0.m_FTE_Steps;
	}
	
	public static function GetResearchTimes() : int
	{
		if ( g_fteVersion == 0 )
			return Data.Research_Time;
		return Data.Research_Time_Fast;
	}
}
