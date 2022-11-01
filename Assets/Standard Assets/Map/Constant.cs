using UnityEngine;

public class Constant {

    public class PassMission
    {
        public const int OpenPassMissionItemId = 4600; //解锁通行证活动道具
        public const int ApItemId = 4601; //通行证解锁地图点消耗道具
        public const int RefreshRandomQuestItemId = 4602; //刷新随机任务道具
    }

    public const string ITunesAppId = "476546099";

    public const string DefaultChestTileName = "i10005";

    public const int MightDigitCountInList = 3;

    public const int CarmotLimitLevel = 22;

    public const int ResourceLimitLevel = 10;

    public const int GEM_LEVEL = 10;

    public const string CITYSKIN_DEFAULT_SKINRES = "skinres_0";


    public class BuildingAnimationState {
        public const string Open = "Open";
        public const string Close = "Close";
    }

    public class SpeedUpHintType
    {
        public const string GemsCost = "GemsCost";
    }

    public class ShopAndMyItemsTabMemory
    {
        public const string InventoryTabMemory = "InventoryTabMemory";
        public const string ShopTabMemory = "ShopTabMemory";
        public const string MyItemsTabMemory = "MyItemsTabMemory";
        public const string MyItemsTabListPos = "MyItemsTabListPos";
    }

    public class GearSoundName {
        public const string EquipOrUnEquip = "KBN_1_EquipGear_v01";
        public const string OnlockGear = "KBN_2_UnlockGear_v01";
        public const string IncreaseGearEXP = "KBN_3_ExpIncrease_v01";
        public const string LevelUpGearSuccess = "KBN_4_GearUp_Success_v01";
        public const string LevelUpGearFail = "KBN_5_GearUp_Fail_v01";
        public const string Hammer = "KBN_6_Anvil_v02";
        public const string EmbedGearStone = "KBN_7_GemDrop_v01";
        public const string BlackSmith = "KBN_8_Blacksmith_v01";
    }

    public class AnimationSpriteType {
        public const string Cloud = "Cloud";
        public const string Bird = "Bird";
        public const string Water = "Water";
        public const string Character = "Character";
        public const string Building = "Building";
        public const string Decoration = "Decoration";
        public const string BuildingAnimation = "BuildingAnimation";
        public const string Campaign = "Campaign";
        public const string Levels = "Campaign/Levels";
        public const string Levels_Chapter100 = "Campaign/Levels/Chapter100";
        public const string Levels_Chapter101 = "Campaign/Levels/Chapter101";
        public const string Levels_Chapter102 = "Campaign/Levels/Chapter102";
        public const string CampaignAnimation = "Campaign/Animation";
        public const string BossIcon = "Campaign/BossIcon";
        public const string AllianceBossHead = "AllianceBossHead";

        public const string BuildingCitySkin = "BuildingCitySkin";/*城堡换肤资源路径*/

        public const string MistExpeditionCloudAnimation = "MistExpedition";/*迷雾远征开启、退出的遮罩动画*/
    }


    public class PivotType {
        public const string MIDDLE_CENTER = "middleCenter";
        public const string LEFT_CENTER = "leftCenter";
        public const string RIGHT_CENTER = "rightCenter";
    }

    public class FrameType
    {
        public const string DECORATION_UPDATE = "decorationUpdate";
    }

    public class ItemId {
        public const int STAKE_BEGIN_ID = 3000;
        public const int STAKE_END_ID = 3100;
        public const int WHEELGAME_TOKEN = 600;
        public const int WHEELGAME_KEY = 2401;
    }

    public class LayerY {
        public const float LAYERY_BG = 0;
        public const float LAYERY_WALL = 1;
        public const float LAYERY_BUILDING = 2;
        public const float LAYERY_BIRD = 10;
        public const float LAYERY_EAGLE = 10;
        public const float LAYERY_FIREWORK = 20;
        public const float LAYERY_PARTICLE = 25;
        public const float LAYERY_CLOUD = 30;
    }

    public class SalePrice {
        public const int Text_OffsetX1 = 34;
        public const int DeLine_OffsetX = 30;
        public const int DeLine_Height = 20;
        public const int DeLine_OffsetY = 5;
        public const int DeLine_Wid1 = 18;
        public const int DeLine_Wid2 = 30;
        public const int DeLine_Wid3 = 44;

        public const int Text_OffsetX2 = 85;

    }

    public class UserSetting {
        public const int BLOCK_USER = 0;
        public const int IGNORE_USER = 1;
        public const int CHAT_BOX = 2;

        public const string CampaignSettlementSkip = "Campaign_Settlement_Skip";
    }

    public class LinkerType {
        public const string URL = "url";
        public const string SHOP = "shop";
        public const string INVENTORY = "inventory";
        public const string ALLIANCE = "alliance";
        public const string QUEST = "quest";
        public const string GET_GEMS = "getGems";
        public const string KABAM_ID = "kabamID";
        public const string HELP = "help";
        public const string SHARE = "share";
        public const string ROUNDTOWER = "roundtower";
        public const string SURVEYOPENHELP = "surveyhelp";
        public const string EVENTVENTER = "EventCenter";
        public const string INVENTORY_MENU = "inventoryMenu";
        public const string OFFER = "offer";
        public const string SERVERMERGE = "servermerge";
        public const string CITY = "city";
        public const string FIELD = "field";
        public const string WORLD = "world";
        public const string AVA_MINIMAP = "ava_minimap";
        public const string TRAINING = "training";
        public const string HERO_HOUSE = "heroHouse";
        public const string PVE = "pve";
        public const string GAMBLE = "gamble";
        public const string PREMIUM_GAMBLE = "PremiumChance";
        public const string HEAL = "heal";
        public const string BLACKSMITH = "Blacksmith";
        public const string CHAT = "chat";
    }

    public class PayNoticeType {
        public const int Begginer = 1;
        public const int BlueLight = 2;
    }

    public class OfferPage
    {
        public const int Payment = 0;
        public const int Offer = 1;
        public const int PassMapOpen = 2;
    }

    public class PaymentBI {
        public const int BegginerOpen = 0;
        public const int MenuOpen = 1;
        public const int BuyOpen = 2;
        public const int BlueLight = 4;
        public const int PayOffer = 5;
        public const int Cancel = 6;
        public const int DirectGemsOpen = 7;
        public const int DirectDollaOpen = 8;
    }

    public class PaymentOffer
    {
        public class PricePointType
        {
            public const int Equal = 1;
            public const int GreaterOrEqual = 2;
        }
    }

    public class BIType {
        public const int FTE = 100;
        public const int PAYMENT = 400;
        public const int KABAMBI = 1400;
        public const int PUSH = 1401;
        public const int NOTICE = 1402;
        public const int ALLIANCE_INVITATION_CLICK = 1403;
        public const int DIRECTPAYMENT = 1500;
        public const int RATERBI = 1600;
        public const int RATEROPENBI = 1601;
        public const int LOADING_TIME = 1700;
        public const int QUEST_BALLOON_STATUS = 1800;
        public const int QUEST_COMPLETE = 1801;

        public const int INSTANT_HEAL = 3033;
        public const int INSTANT_DEFENSE_DEPLOYING = 3034;

        public class LoadingTimeSubType {
            public const int FIRST_START = 1;
            public const int RESTART = 2;
        }
    }

    public class PushType {
        public const string Building_Complete = "1001";
        public const string Research_Complete = "1002";
        public const string March_Complete = "2005";
        public const string Heal_Complete = "2006";
        public const string Food = "1004";
        public const string BeginnerProtect = "1005";
        public const string Training_Complete = "1003";
        public const string Return_Game = "4003";  //D3
        public const string Wall_Training_Complete = "1006";
        public const string CraftRecipe_Study_Complete = "1007";
        public const string Ava_Deploy_Start = "1008";
        public const string Ava_Combat_Start = "1009";
    }

    public class AchievementCountType {
        public const string LEVEL = "level";
        public const string NUMBER = "number";
        public const string SUM = "sum";
    }

    public class ShareType {
        public const int Share_Twitter = 1;
        public const int Share_FaceBook = 2;
        public const int Share_EMail = 3;
        public const int Share_SMS = 4;
    }

    public class AchievementType {
        public const string BUILDING = "building";
        public const string RESERACH = "research";
        public const string FTE = "fte";
        public const string MIGHT = "might";
        public const string QUEST = "quest";
        public const string WILDER = "wilder";

        //these type data can not get from the seed
        public const string BATTLE = "battle";
        public const string STORYCARD = "story";
    }

    public class GamecenterCompType {
        public const string LEADER_BOARD = "leaderboard";
        public const string ACHIEVEMENT = "achievement";
        public const string INVITE_FRIEND = "inviteFri";
    }

    public class GamecenterPostStatus {
        public const int OVER_TIME = 0;
        public const int SENDING = 1;
        public const int SUCCESS = 2;
    }

    public class AchivementTargetIdType {
        //must 
        public const string EACH = "each";
        public const string ANY = "any";
    }

    public class BuffType {
        public const int BUFF_TYPE_FRESHMAN = 0;
        public const int BUFF_TYPE_PEASE = 1;
        public const int BUFF_TYPE_ANTI_SCOUT = 2;
        public const int BUFF_TYPE_COMBAT = 3;
        public const int BUFF_TYPE_RESOURCE = 4;
        public const int BUFF_TYPE_TRAINTROOP = 5;
        public const int BUFF_TYPE_CARMOTCOLLECT = 6;
        public const int BUFF_TYPE_RESOURCECOLLECT = 7;
    }

    public class LoginInfor {
        public const string LAST_LOGIN_DATE = "lastLoginDate";
        public const string LAST_PUSH_TIME = "lastLoginInfor";
    }

    public class ChatType {
        public const string CHAT_GLOBLE = "globle";
        public const string CHAT_WHISPER = "whisper";
        public const string CHAT_ALLIANCE = "alliance";
        public const string CHAT_ALLIANCE_OFFICER = "allianceOfficer";

        public const string CHAT_ALCREQUEST = "alliance_req";
        public const string CHAT_ALCRQANSWER = "alc_rq_answer";

        public const string CHAT_PRIVATE_ONE2ONE = "one2one";

        public const string CHAT_RULE = "rule";
        public const string CHAT_NOT_ONLINE = "notOnline";
        public const string CHAT_NO_USER = "noUser";
        public const string CHAT_EXCEPTION = "exception";
        public const string CHAT_AWARD = "award";
        public const string HELP_FOUNDER_INITIATE = "fInitiate";
        public const string HELP_FOUNDER_FEEDBACK = "fFeedback";
        public const string HELP_HELPER_CONFIRM = "hConfirm";
        public const string HELP_HELPER_FEEDBACK = "hFeedback";
        public const string CHAT_MONSTER = "monster";

        public const string AVA_RALLY_ATTACK = "avaRallyAttack";
    }

    public class NativeDefine {
        public const string KMP_WORLD_URL = "WORLD_URL";
        public const string KMP_AUTH = "AUTH_VAR";
        public const string KMP_FB_TOKEN = "FB_TOKEN";
        public const string KMP_DEVICE_TOKEN = "KMP_DEVICE_TOKEN";
        public const string KMP_PUSH_NOTIFICATION = "PUSH_TYPE";
        public const string KMP_PUSH_STOREKEY = "presendBI";
        public const string KMP_PUSH_LIMITADTRACKING = "LIMITADTRACKING";
    }

    public class UIRect {
        public const int MENUHEAD_H1 = 90;
        public const int MENUHEAD_H2 = 150;
    }

    public class Action {
        public const string ALLIANCE_PDITEM_NAME = "alliance_pditem_name";
        public const string ALLIANCE_LDITEM_NAME = "alliance_lditem_name";
        public const string ALLIANCE_LDITEM_MAIL = "alliance_lditem_mail";

        public const string ALLIANCE_MEMB_NAME = "alliance_memb_name";
        public const string ALLIANCE_ITEM_NEXT = "alliance_item_next";
        public const string ALLIANCE_REPORT_NEXT = "alliance_report_next";
        //march.
        public const string MARCH_GENERAL_SELECT = "march_general_select";
        public const string MARCH_TYPE_SELECT = "march_type_select";
        public const string MARCH_TROOP_SELECT = "march_troop_select";
        public const string MARCH_RESOURCE_SELECT = "march_resource_select";
        public const string PROVINCE_SELECT = "province_select";
        public const string MARCH_SPEEDUP_HERO = "March_SpeedUp_Hero";
        //research
        public const string ACADEMY_TECH_ITEM_NEXT = "open_tech_content";

        public const string PAYMENT_ITEM_SELECT = "payment_item_selecte";
        public const string MONSTER_ITEM_SELECT = "monster_item_select";

        public const string BOOKMARK_EDIT_ITEM = "bookmark_edit_item";
        public const string ALLIANCEWALL_DELETE_ITEM = "alliancewall_delete_item";
        public const string ALLIANCEWALL_EDIT_ITEM = "alliancewall_edit_item";

        //event center
        public const string EVENTCENTER_ITEM_NEXT = "eventcenter_item_next";
        //craft
        public const string CRAFT_ITEM_NEXT = "open_craft_content";
        //speedup
        public const string USE_SPEEDUP_ITEM = "use_speedup_item";
        //ServerMerge
        public const string SERVERMERGE_ITEM_SELECT = "ServerMerge_Item_Select";
        //Hero
        public const string HERO_MARCHING = "Hero_Marching";
        //AvA
        public const string AVA_LASTRESULT = "AvA_LastResult";
        //season league
        public const string SELECTLEAGUE = "SelectLeague";
        //addmarchsize
        public const string SELECTMARCHSIZEBUFF = "SelectMarchSizeBuff";

        //technologyTree
        public const string TECHNOLOGY_SKILL_ON_CLICK = "TechnologySkillOnClick";
        public const string TECHNOLOGY_START = "TechnologySTART";
        public const string TECHNOLOGY_COMPLETE = "TechnologyCOMPLETE";

        //rally
        public const string RALLY_DATA_UPDATE = "RallyDataUpdate";
        public const string RALLY_REQUEST_DETAILED_INFO = "RallyRequestDetailedInfo";
        public const string RALLY_DETAILED_INFO_PUSH = "RallyDetailedInfo";
        public const string RALLY_DETAILED_INFO_POP = "RallyDetailedInfoBack";
        public const string RALLY_CHANGE_MARCH_ITEM = "RallyChangeMarchItem";
        public const string RALLY_DATA_REMOVE = "RallyDataRemove";
        public const string RALLY_SELECT_PARNER = "RallySelectParner";

        public const string CLOSE_MARCHCARMOTBUFF_MENU = "CloseMarchCarmotBuffMenu";
    }

    public class State {
        public const int Normal = 0;
        public const int Push = 1;
        public const int Pop = 2;
    }

    public class Notice {
        public const string BUILDING_UPDATE = "building_update";
        public const string BUILDING_PROGRESS_COMPLETE = "building_progress_complete";
        public const string PREVIOUS_PROGRESS_COMPLETE = "previous_progress_complete";

        public const string MARCH_ITEM_REMOVED = "marchItemRemoved";
        public const string ON_MARCH_OK = "onMarchOK";
        public const string SPEED_MARCH_OK = "speed_march_ok";
        public const string SPEED_WILDER_OK = "speed_wilder_ok";
        public const string RESEARCH_START = "research_start";
        public const string RESEARCH_COMPLETE = "research_complte";
        public const string CRAFTRECIPE_STUDY_COMPLETE = "craftrecipe_study_complete";

        public const string SEND_MARCH = "sendMarch";

        public const string SET_MARCH_GENERAL = "setMarchGneral";

        public const string SET_MARCH_TROOP = "setMarchTroop";
        public const string SET_MARCH_BUFF = "setMarchBuff";
        // ALliance
        public const string ALLIANCE_ = "alliance_";
        public const string ALLIANCE_INFO_LOADED = "alliance_info_loaded";
        public const string ALLIANCE_MEMBER_PROMOTE = "alliace_member_promote";
        public const string ADD_RESOURCE = "AddResource";
        public const string ATTACKINFO = "AttackInfo";
        public const string Train = "Train";
        public const string BOSST_RESOURCE = "Boost_Resource";
        public const string Add_TROOP_ITEM = "add_troop_item";
        public const string ALLIANCE_EMBLEM_CHANGED = "alliance_emblem_changed";

        //Wall
        public const string WALL_UNITS_CNT_UP = "WallUnitsCntUp";
        public const string BARRACK_UNITS_CNT_UP = "BarrackUnitsCntUp";

        // Payment and payment offer
        public const string PAYMENT_NOTICE_END = "payment_notice_end";
        public const string PAYMENT_CLOSE = "payment_close";
        public const string PAYMENT_OFFER_CLICK_PAGE = "payment_offer_click_page";

        public const string APP_BECOME_ACTIVE = "app_become_active";

        //train
        public const string TRAIN_COMPLETED = "train_complete";
        public const string LEVEL_UP = "level_up";
        public const string NOTE_NEWCITY = "note_newcity";
        public const string NEWCITY_REQUIREMENT = "newcity_requirement";
        public const string CANCEL_TRAINING = "cancel_trian";
        public const string USE_RADIO = "use_radio";

        //heal
        public const string HOSPITAL_DATA_CHANGED = "hospital_data_changed";
        public const string HEAL_COMPLETED = "heal_complete";

        public const string ALLIANCE_HELP_ARRIVED = "alliance_help_arrived";

        public const string GEMS_UPDATED = "gems_updated";

        public const string SPEEDUP_ITEMS_UPDATED = "speedup_items_updated";

        public const string WILDSLOTS_UPDATE = "wilder_slots_update";

        //Android Keyboard
        public const string TOP_MENU_CHANGE = "top_menu_change";
        public const string TOAST_START = "toast_start";
        public const string TOAST_FINISH = "toast finish";

        //gamecenter
        public const string GAMECENTER_ID_CHANGED = "gamecenter_id_changed";

        //serversetting
        public const string SERVER_SETTING_CHANGED = "server_setting_changed";

        public const string ITEM_USE_CHEST = "item_use_chest";
        // Daily login reward
        public const string DailyLoginRewardFeatureOnOrOff = "DailyLoginRewardFeatureOnOrOff";
        public const string DailyLoginRewardUpdateDataSuccess = "DailyLoginRewardUpdateDataSuccess";
        public const string DailyLoginRewardUpdateDataFailure = "DailyLoginRewardUpdateDataFailure";
        public const string DailyLoginRewardClaimSuccess = "DailyLoginRewardClaimSuccess";
        public const string DailyLoginRewardClaimFailure = "DailyLoginRewardClaimFailure";
        //story
        public const string NEXT_CONVERSATION = "next_story";
        public const string UPDATE_PVE_STAMINA = "update_pve_dtamina";
        public const string UPDATE_PVE_SCORE_STAR = "update_pve_score_star";
        //pve
        public const string PVE_ENTER_CAMPAIGNMAP_SCENE = "pve_enter_campaignmap_scene";
        public const string PVE_ENTER_CHAPTERMAP_SCENE = "pve_enter_chaptermap_scene";
        public const string PVE_MARCH_BEGIN = "pve_march_begin";
        public const string PVE_SPEED_MARCH_OK = "pve_speed_march_ok";
        public const string PVE_LEADER_BOARD_OK = "pve_leader_board_ok";
        public const string HERO_LEADER_BOARD_OK = "hero_leader_board_ok";
        public const string PVE_TROOPKILL_LEADER_BOARD_OK = "pve_troopkill_leader_board_ok";
        public const string PVE_UPDATE_MARCH_DATA = "pve_update_march_data";
        public const string ALLIANCE_BOSS_LAYER_CHANGE = "allinace_boss_layer_change";
        public const string ALLIANCE_BOSS_ANIMATION_NOTICE = "allinace_boss_animation_notice";
        public const string ALLIANCE_BOSS_REPORT = "allinace_boss_report";
        public const string ALLIANCE_BOSS_RESET = "allinace_boss_reset";
        public const string ALLIANCE_BOSS_MSG = "allinace_boss_msg";
        public const string ALLIANCE_BOSS_JOINPLAYER = "allinace_boss_join_player";
        public const string ALLIANCE_BOSS_OTHER_ATTACK = "allinace_boss_other_attack";
        public const string ALLIANCE_BOSS_REWARD_REFRESH = "allinace_boss_reward_refresh";
        public const string ALLIANCE_BOSS_TROOP_DATA_OK = "allinace_boss_troop_data_ok";
        public const string SOCKET_ERROR = "socket_error";
        public const string SOCKET_RE_CONNECT = "socket_re_connect";
        public const string ALLIANCE_BOSS_ERROR = "alliance_boss_error";
        public const string ALLIANCE_BOSS_STATE_CHANGE = "alliance_boss_state_change";

        // Selective defense
        public const string SelectiveDefenseCountChanged = "SelectiveDefenseCountChanged";
        public const string SelectiveDefenseQueueUpdate = "SelectiveDefenseQueueUpdate";
        public const string SelectiveDefenseDeployStarted = "SelectiveDefenseDeployStarted";

        // Cities
        public const string ChangeCity = "ChangeCity";

        public const string LEADERBOARD_DATA_OK = "leaderboard_data_ok";

        //SODA
        public const string SODA_VISIBLE = "SODAVISIBLE";
        //servermerge
        public const string ServerMergeSwitchChanged = "ServerMergeSwitchChanged";
        //WorldMapActivityChanged
        public const string WorldMapActivityChanged = "WorldMapActivityChanged";

        // Daily quests
        public const string DailyQuestDataUpdated = "DailyQuestDataUpdated";
        public const string DailyQuestDataUpdateFailed = "DailyQuestDataUpdateFailed";
        public const string DailyQuestProgressIncreased = "DailyQuestProgressIncreased";
        public const string DailyQuestRewardClaimed = "DailyQuestRewardClaimed";

        // PassMission
        public const string PassMissionReqQuestsData = "PassMissionReqQuestsData";
        public const string PassMissionRefreshRandomQuest = "PassMissionRefreshRandomQuest";
        public const string PassMissionClaimRandomQuestReward = "PassMissionClaimRandomQuestReward";
        public const string PassMissionClaimFixedQuestReward = "PassMissionClaimFixedQuestReward";
        public const string PassMissionMapReward = "PassMissionMapReward";
        public const string PassMissionMapBoxReward = "PassMissionMapBoxReward";
        public const string PassMissionMapUnlock = "PassMissionMapUnlock";

        // Share
        public const string ShareLogOutOK = "ShareLogOutOK";
        public const string ShareLogInOK = "ShareLogInOK";
        public const string ShareLogInFailed = "ShareLogInFailed";
        public const string ShareSendOK = "ShareSendOK";
        public const string ShareSendInvite = "ShareSendInvite";
        public const string ShareSendFBPostOK = "ShareSendFBPostOK";
        public const string ShareSendFBPostFailed = "ShareSendFBPostFailed";

        // AVA
        public const string AvaCoopInspectRallyDetail = "AvaCoopInspectRallyDetail";
        public const string AvaCoopTileShareListRefreshed = "AvaCoopTileShareListRefreshed";
        public const string AvaAbandonTileOK = "AvaAbandonTileOK";
        public const string AvaDeleteSharedTileOK = "AvaDeleteSharedTileOK";
        public const string AvaEventOK = "AvaEventOK";
        public const string AvaCoopReorderTilesOK = "AvaCoopReorderTilesOK";
        public const string AvaCoopTileShareItemSelectionChanged = "AvaCoopTileShareItemSelectionChanged";
        public const string AvaCoopRallyListRefreshed = "AvaCoopRallyListRefreshed";
        public const string AvaCoopRallyDetailRefreshed = "AvaCoopRallyDetailRefreshed";
        public const string AvaInspectIncomingAttackDetail = "AvaInspectIncomingAttackDetail";
        public const string AvaIncomingAttackListRefreshed = "AvaIncomingAttackListRefreshed";
        public const string AvaUseSpeedUpItemOk = "AvaUseSpeedUpItemOk";
        public const string AvaTileTroopsOk = "AvaTileTroopsOk";
        public const string AvaGetSeedOK = "AvaGetSeedOK";
        public const string AvaMarchOK = "AvaMarchOK";
        public const string AvaGetMarchListOK = "AvaGetMarchListOK";
        public const string AvaMarchRemoved = "AvaMarchRemoved";
        public const string AvaUnitsRefreshed = "AvaUnitsRefreshed";
        public const string AvaPowerUpdated = "AvaPowerUpdated";
        public const string AvaOutpostUpdateUndeployedAmount = "AvaOutpostUpdateUndeployedAmount";

        public const string AllianceRankSelectPrefix = "AllianceRankSelect_";
        public const string AllianceRankSelectLevel = "AllianceRankSelect_0";
        public const string AllianceRankSelectLeague = "AllianceRankSelect_1";
        public const string AllianceRankSelectMight = "AllianceRankSelect_2";

        //SellItem
        public const string SellItemOK = "SellItemOK";
        //Select League
        public const string SelectLeague = "SelectLeague";
        public const string OnSelectLeagueOK = "OnSelectLeagueOK";

        //Museum
        public const string OnMutiClaimOK = "OnMutiClaimOK";
        //AddMarchSize
        public const string OnMarchSizeBuffSeleted = "OnMachSizeBuffSelected";
        //gear
        public const string ShowGearLoading = "ShowGearLoading";
        public const string CloseGearLoading = "CloseGearLoading";
        public const string ShowShareMenu = "ShowShareMenu";
        public const string OnMarchAddItemUse = "OnMarchAddItemUse";

        public const string InventoryPage = "InventoryPage";

        //migrate
        public const string MigrateLeftPage = "MigrateLeftPage";
        public const string MigrateRightPage = "MigrateRightPage";

    }

    public class Alliance {
        public const int Chancellor = 1;
        public const int ViceChancellor = 2;
        public const int Officer = 3;
        public const int DefenseMinister = 4;
        public const int DeputyDefenseMinister = 5;
        public const int Member = 6;


        public const int DIP_FRIENDLY = 1;
        public const int DIP_HOSTILE = 2;
        public const int DIP_NEUTRAL = 3;
    }

    public class Building {
        public const int GROUND = 999;

        public const int PALACE = 0;
        public const int FARM = 1;
        public const int SAWMILL = 2;
        public const int QUARRY = 3;
        public const int MINE = 4;
        public const int VILLA = 5;//cottage
        public const int COLISEUM = 6;
        public const int GENERALS_QUARTERS = 7;
        public const int EMBASSY = 8;
        public const int STOREHOUSE = 9;
        public const int MARKET = 10;
        public const int ACADEMY = 11;
        public const int RALLY_SPOT = 12;
        public const int BARRACKS = 13;
        public const int WATCH_TOWER = 14;
        public const int BLACKSMITH = 15;
        public const int WORKSHOP = 16;
        public const int STABLE = 17;
        public const int RELIEF_STATION = 18;
        public const int WALL = 19;
        public const int MUSEUM = 20;
        public const int HOSPITAL = 22;
        public const int NOTICEPAD = 33;
        public const int TECHNOLOGY_TREE = 23;
        public const int WAR_HALL = 24;
        public const int AVAOUTPOST = 34;
        public const int HERO = 99;
        public const int MONSTER = 36;
        public const int TIERLEVEUP = 37;
        public const int MONTHLYCARD = 38;
    }

    public class Research {
        public const int IRRIGATION = 1;
        public const int LOGGING = 2;
        public const int STONEWORKING = 3;
        public const int SMELTING = 4;
        public const int TACTICS = 5;
        public const int STEALTH = 6;
        public const int STEEL = 8;
        public const int CAST_IRON = 9;
        public const int WEIGHT_DIST = 10;
        public const int ROADS = 11;
        public const int HORSE = 12;
        public const int SPRINGS = 13;
        public const int STORAGE = 14;
        public const int HEALING = 15;
        public const int CRANES = 16;
    }


    public class ResourceType {
        public const int GOLD = 0;
        public const int FOOD = 1;
        public const int LUMBER = 2; // wood
        public const int STONE = 3;
        public const int IRON = 4;
        public const int POPULATION = 5;
        public const int ITEMS = 6;
        public const int CARMOT = 7;//
        public const int POPULATIONCAP = 51; // seed.citystats['city' + currentcityid]['pop'][1]
        public const int LABORFORCE = 53; // seed.citystats['city' + currentcityid]['pop'][3]
    }

    public class Modal {
        public const int RED = 0;
        public const int GREEN = 1;
        public const int BLUE = 2;
        public const int GOLD = 3;
        public const int PURPLE = 4;
        public const int LARGE = 740;
        public const int MEDIUM = 500;
        public const int SMALL = 400;
        public const string COMMON = "common";
        public const string MILITARY = "military";
        public const string CULTURE = "culture";
        public const string PAYMENT = "payment";
        public const string ROYAL = "royal";
        public const string WHITE400 = "white400";
        public const string WHITE500 = "white500";
        public const string WHITE600 = "white600";
        public const string FORTUNA = "fortuna";
        public const string APOLLO = "apollo";
        public const string CERES = "ceres";
        public const string MARS = "mars";
        public const string VENUS = "venus";
        public const string VULCAN = "vulcan";
    }

    public class Unit {
        public const int SUPPLY_DONKEY = 1;
        public const int CONSCRIPT = 2;
        public const int LEGIONARY = 4;
        public const int CENTURION = 5;
        public const int SKIRMISHER = 6;
        public const int CALVARY = 7;
        public const int HEAVY_CALVARY = 8;
        public const int SUPPLY_WAGON = 9;
        public const int SCORPIO = 10;
        public const int BATTERING_RAM = 11;
        public const int BALLISTA = 12;
        public const int DEFENSIVE_SCORPIO = 53;
        public const int DEFENSIVE_BALLISTAE = 55;
        public const int TRAPS = 60;
        public const int SLING_BULLETS = 61;
        public const int SPIKED_BARRIERS = 62;
    }

    public class ResourceBoostIds {
        public static readonly int[] GOLD = new int[] { 103, 101, 102 };
        public static readonly int[] FOOD = new int[] { 113, 111, 112 };
        public static readonly int[] LUMBER = new int[] { 123, 121, 122 };
        public static readonly int[] STONE = new int[] { 133, 131, 132 };
        public static readonly int[] IRON = new int[] { 143, 141, 142 };
    }

    public class Fortifications {
        public const int ARCHERTOWER = 53;
        public const int CALTROPS = 52;
        public const int LOGS = 54;

        //lv2
        public const int BOILING_OIL = 56;
        public const int SPIKED_BARRIER = 57;
        public const int TREBUCHET = 55;

        //lv3
        public const int GREEK_FIRE = 58;
        public const int PERSIAN_SULFUR = 59;
        public const int HELLFIRE_THROWER = 60;
    }

    public class GeneralStatus {
        public const int IDLE = 1;
        public const int MARCH = 10;
    }

    public class MarchStatus {
        public const int DELETED = -1;
        public const int INACTIVE = 0;
        public const int OUTBOUND = 1;
        public const int DEFENDING = 2;
        public const int WAITING_FOR_REPORT = 5;
        public const int RALLYING = 6;
        public const int SITUATION_CHANGED = 7;
        public const int RETURNING = 8;
        public const int ABORTING = 9;
        public const int RALLY_WAITING = 10;
        public const int HALF_RETURN = 11;
        public const int CLIENT_RALLY_WAIT = 22;
    }

    public class MarchType {
        public const int TRANSPORT = 1;
        public const int REINFORCE = 2;
        public const int SCOUT = 3;
        public const int ATTACK = 4;
        public const int REASSIGN = 5;
        public const int SURVEY = 9;
        public const int PVE = 10;
        public const int PVP = 11;
        public const int ALLIANCEBOSS = 12;
        public const int AVA_SENDTROOP = 13;
        public const int COLLECT = 20;
        public const int RALLY_ATTACK = 21;
        public const int JION_RALLY_ATTACK = 22;
        public const int COLLECT_RESOURCE = 23;// 采集普通资源  木材，粮食，金币等
        public const int GIANTTPWER = 24;//巨塔
        public const int EMAIL_WORLDBOSS = 101;   //worldboss 邮件
        public const int MistExpedition = 102; // 迷雾远征 邮件
    }

    public class AvaMarchType
    {
        public const int ATTACK = 14;
        public const int REINFORCE = 15;
        public const int SCOUT = 16;
        public const int RALLYATTACK = 17;
        public const int RALLYREINFORCE = 18;
        public const int RALLY = 19;// back-end only
    }

    public class AvaMarchStatus
    {
        public const int OTHERS_MARCH_LINE = -2;
        public const int DELETED = -1;
        public const int INACTIVE = 0;
        public const int OUTBOUND = 1;
        public const int DEFENDING = 2;
        public const int SITUATION_CHANGED = 4;
        public const int RETURNING = 5;
        public const int RALLYING = 6;//front-end only
        public const int WAITING_FOR_REPORT = 7;//front-end only
    }

    public class AvaHeroStatus
    {
        public const int UNLOCKED = 1;
        public const int IN_CITY_DO_NOTHING = 2;
        public const int IN_CITY_IN_MARCH = 3;
        public const int IN_CITY_SLEEP = 4;
        public const int IN_NO_CITY = 5;
    }

    public class MarchResult {
        public const int UNKNOWN = 0;
        public const int LOSE = 1;
        public const int WIN = 2;
    }

    public class Map {
        public const int WIDTH = 800;
        public const int HEIGHT = 800;
        public const int AVA_MINIMAP_WIDTH = 80;
        public const int AVA_MINIMAP_HEIGHT = 80;
        public const int BLOCK_TILE_CNT = 5;

        public const int PROVINCE_SIZE = 200; //province area
        public const int EDGE_SIZE = 100;

        public const int MOVE_ADD_SPEED_MIN = 1;
        public const int MOVE_ADD_SPEED_MAX = 10;
        public const string MOVE_ADD_SPEED_KEY = "MoveAddSpeedKey";
    }

    public class AndroidFrame
    {
        public const int LowFrame = 25;
        public const int MediumFrame = 30;
        public const int HighFrame = 60;
        public const string ANDROID_FRAME_KEY = "AndroidFrameKey";

        public const float TouchDeltaPositionMagnitudeThreshold_LowFrame  = 0.5f;
        public const float TouchDeltaPositionMagnitudeThreshold_MediumFrame = 0.75f;
        public const float TouchDeltaPositionMagnitudeThreshold_HighFrame = 1f;

    }

    public class CollectResourcesType
    {
        public const int FOOD = 1;
        public const int WOOD = 2;
        public const int STONE = 3;
        public const int ORE = 4;
        public const int CARMOT = 7;
        public const int GOLD = 10;
    }

    public class TileType {
        public const int BOG = 0;
        public const int GRASSLAND = 10;
        public const int LAKE = 11;
        public const int WOODS = 20;
        public const int HILLS = 30;
        public const int MOUNTAIN = 40;
        public const int PLAIN = 50;
        public const int CITY = 51;
        public const int PICTISHCAMP = 52;
        public const int WORLDMAP_2X2_KEY_TILE = 56; // Server uses this to reserve the place to generate the 2x2 tiles.
        public const int WORLDMAP_1X1_DUMMY = 60;
        public const int WORLDMAP_1X1_ACT = 61;
        public const int WORLDMAP_2X2_LT_DUMMY = 62;
        public const int WORLDMAP_2X2_LT_ACT = 63;
        public const int WORLDMAP_2X2_RT_DUMMY = 64;
        public const int WORLDMAP_2X2_RT_ACT = 65;
        public const int WORLDMAP_2X2_LB_DUMMY = 66;
        public const int WORLDMAP_2X2_LB_ACT = 67;
        public const int WORLDMAP_2X2_RB_DUMMY = 68;
        public const int WORLDMAP_2X2_RB_ACT = 69;
        public const int WORLDMAP_LAST = WORLDMAP_2X2_RB_ACT;

        public const int TILE_TYPE_AVA_PLAYER = 70; // 每个玩家自己的在AvA map中的tile
        public const int TILE_TYPE_AVA_WONDER = 71; // 初始有一个boss，占领后会根据占领时间长度获得积分。
        public const int TILE_TYPE_AVA_SUPER_WONDER = 72; // 初始有一个boss，占领后会根据占领时间获得积分。是个2x2的tile。
        public const int TILE_TYPE_AVA_ATTACK = 73; // 初始有一个boss，占领后会增加全联盟attack buff。失去后，会降低buff。
        public const int TILE_TYPE_AVA_LIFE = 74; // 占领后会增加全联盟Life buff。失去后，会降低buff
        public const int TILE_TYPE_AVA_SPEED = 75; // 占领后会增加全联盟march speed。失去后，会降低buff
        public const int TILE_TYPE_AVA_PLAIN = 76; // 玩家可以把自己的tile 移动到此类型地块上
        public const int TILE_TYPE_AVA_BOG = 77; // 玩家不可攻打，不可占领的地块
        public const int TILE_TYPE_AVA_ITEM = 78; // 战胜后，有机会获得一些AvA专用道具。这些道具在本次AvA结束后，会消失。
        public const int TILE_TYPE_AVA_MERCENERY = 79; // 战胜后，有机会获得AvA专用的mercenary 道具。使用后可以增加mercenary到AvA的战斗中使用，
                                                       // 本次AvA结束后，未被使用的部分会被清除。杀死mercenary不会获得积分。
        public const int TILE_TYPE_AVA_SUPER_WONDER1 = 80; // one part of the 2x2 super wonder tile
        public const int TILE_TYPE_AVA_SUPER_WONDER2 = 81; // one part of the 2x2 super wonder tile
        public const int TILE_TYPE_AVA_SUPER_WONDER3 = 82; // one part of the 2x2 super wonder tile
        public const int TILE_TYPE_AVA_SUPER_WONDER4 = 83; // one part of the 2x2 super wonder tile
        public const int TILE_TYPE_AVA_BOG2 = 84; // 玩家不可攻打，不可占领的地块
        public const int TILE_TYPE_AVA_BOG3 = 85; // 玩家不可攻打，不可占领的地块
        public const int TILE_TYPE_AVA_BOG4 = 86; // 玩家不可攻打，不可占领的地块
        public const int TILE_TYPE_AVA_BOG5 = 87; // 玩家不可攻打，不可占领的地块
        public const int TILE_TYPE_AVA_ATTACK_REDUCE = 88; // ava减敌攻击地块
        public const int TILE_TYPE_AVA_LIFE_REDUCE = 89; // ava减敌生命地块
        public const int TILE_TYPE_AVA_LAST = TILE_TYPE_AVA_LIFE_REDUCE;
    }

    public class City {
        public const string HIDE = "0";
        public const string DEFEND = "1";
    }

    public class WildernessState {
        public const int DURINGCD = 0;
        public const int FREETOSURVEY = 1;
        public const int UNCONQUERED = -1;
        public const int DELETED = -2;
    }

    public class BookMarkType {
        public const string ADD_BOOKMARK = "BOOKMARK_LOCATION";
        public const string DEL_BOOKMARK = " ";   //TODO..
        public const string GET_BOOKMARKS = "GET_BOOKMARK_INFO";
    }

    public static readonly int[] FortificationTypesIDS = new int[] {
        Fortifications.ARCHERTOWER,
        Fortifications.CALTROPS,
        Fortifications.LOGS,

        Fortifications.BOILING_OIL,
        Fortifications.SPIKED_BARRIER,
        Fortifications.TREBUCHET,

        Fortifications.GREEK_FIRE,
        Fortifications.PERSIAN_SULFUR,
        Fortifications.HELLFIRE_THROWER,
    };

    public const string FIRST_MEET_WORLD_BOSS = "firstMeetWorldBoss";
    public const string BEFORE_FIRST_ATTACK_WORLD_BOSS = "beforeFirstAttackWorldBoss";

    public const int LISTITEM_MOVE_SPEED = 12;
    public const int ChatMaxLength = 140;
    public const int AllianceWallMaxLength = 140;
    public const string ChatFix = "...";
    public const int ChatDisplayLength = 30;
    public const int MAXUNITID = 35; // [0,34)	New Troop
    public class InputBoxGuid {
        /*input guid list*/
        public const int CHAT_INPUT = 1;
        public const int ALLIANCEWALL_INPUT = 2;
        public const int MAINTAINANCECHAT_INPUT = 3;
        public const int AVA_CHAT_INPUT = 4;
    }

    public class AllianceWallType {
        public const int NORMAL = 1;
        public const int NOTICE = 2;
    }
    public class MAIL {
        public const int INBOX_COUNT = 500;
        public const int SYS_COUNT = 500;
        public const int OUTBOX_COUNT = 500;
        public const int REPORT_COUNT = 1000;
        public const int AVA_REPORT_COUNT = 500;
    }

    public const int BEGINNER_SESSIONS = 10;

    public class EventCenter {
        public class RewardType {
            public const string RANK_CERTAINPRIZE = "1";
            public const string NORANK_RANDOMPRIZE = "2";
            public const string NORANK_CERTAINPRIZE = "3";
            public const string RANK_RANDOMPRIZE = "4";
            public const string GROUPED_RANK_CERTAINPRIZE = "5";
        }

        public class PrizeStatus {
            public const string NOPRIZE = "0";
            public const string PRIZE = "1";
            public const string HAVEGOTPRIZE = "2";
        }

        public enum GameEventType {
            BossFight = 1,
            PurchaseItem = 2,
            SpendCurrency = 3,
            TrainTroop = 4,
            LevelupKnight = 5,
            ExpandKingdom = 6,
            UpgradeBuilding = 7,
            Tournament = 8,
            SpendNGet = 9, // "Spend and get" event
            SeasonEvent = 10,
            CarmotEvent = 11,
            WorldBoss = 12,
        }

        public const string PRIZEOPEN = "2";
        public const string CANVIEWDETAIL = "1";

    }

    public class Museum {
        public class ExchangeLogicType {
            public const int LOGIC_AND = 0;
            public const int LOGIC_OR = 1;
        }
    }

    public class AllianceRequestType {
        public const int REINFORCE = 0;
        public const int RESOURCE = 1;
        public const int TOURNAMAMENT_HELP = 2;
    }

    public enum MessageType {
        AllianceInvite = 1,
        AllianceSys = 2,
        AllianceChangePosition = 3,
        AllianceRequestJoin = 4,
    }

    public class BlockSettings {
        public const string AllianceBlockInvitations = "2";
    }

    public class BuildingEffectType {
        public const string EFFECT_TYPE_PROTECT_RESOURCE = "1";
        public const string EFFECT_TYPE_POPULATION_LIMIT = "2";
        public const string EFFECT_TYPE_CONQUER_TILE_COUNT = "3";
        public const string EFFECT_TYPE_UNLOCK_FIELD_COUNT = "4";
        public const string EFFECT_TYPE_UNLOCK_UNIT_TYPE = "5";//all 0,junior 1,senior 2

        public const string EFFECT_TYPE_WALL_SLOT_COUNT = "7";// ?
        public const string EFFECT_TYPE_MARCH_TROOP_LIMIT = "8";
        public const string EFFECT_TYPE_PRODUCTION_FOOD = "9";
        public const string EFFECT_TYPE_PRODUCTION_WOOD = "10";
        public const string EFFECT_TYPE_PRODUCTION_STONE = "11";
        public const string EFFECT_TYPE_PRODUCTION_IRON = "12";
        public const string EFFECT_TYPE_LABOR_POPULATION = "13";
        public const string EFFECT_TYPE_RESOURCE_CAPACITY = "14";
        public const string EFFECT_TYPE_MARCH_SLOT_COUNT = "15";// ?
        public const string EFFECT_TYPE_BLACK_SMITH_SLOT_COUNT = "16";// ? Black smith storage slot
        public const string EFFECT_TYPE_PLAYER_STABLE_MIGHT = "17";
        public const string EFFECT_TYPE_CURE_UNIT_COUT = "18";
        public const string EFFECT_TYPE_CURE_UNIT_CAP = "19";
        public const string EFFECT_TYPE_ITEM_LIMIT = "20"; //storehouse
        public const string EFFECT_TYPE_GENERALLEVEL_CAP = "21";
        public const string EFFECT_TYPE_CARMOTLIMIT_CAP = "22";
        public const string EFFECT_TYPE_WALL_TROOP_T1_LIMIT = "6_1";
        public const string EFFECT_TYPE_WALL_TROOP_T2_LIMIT = "6_2";
        public const string EFFECT_TYPE_WALL_TROOP_T3_LIMIT = "6_3";


    }

    public class BuildingNeedCityOrder {
        public const int NONE = 0;
        public const int CITY1 = 1;
        public const int CITY2 = 2;
        public const int CITY3 = 3;
        public const int CITY4 = 4;
        public const int ALL = 99;
    }

    public const int INVALID_PRESTIGELV = 0;

    public class TroopAttrType {
        public const int HEALTH = 0;
        public const int ATTACK = 1;
        public const int SPEED = 2;
        public const int LOAD = 3;
        public const int UPKEEP = 4;
        public const int SPACE = 5;
        public const int MIGHT = 6;
        public const int TIER = 7;
        public const int LIFERATE = 8;
        public const int ATTACKRATE = 9;
        public const int TRAINABLE = 10;
        public const int TYPE = 11;
        public const int AVASPEED = 12;
    }

    public class TroopType {
        public const string UNITS = "u";//for barrack
        public const string FORT = "f";//for wall
    }

    public class TroopActType
    {
        public const int Supply = 1;
        public const int Hourse = 2;
        public const int Ground = 3;
        public const int Artillery = 4;
    }

    public class TroopNeedCityOrder {
        public const int NONE = 0;
        public const int CITY1 = 1;
        public const int CITY2 = 2;
        public const int CITY3 = 3;
        public const int CITY4 = 4;
        public const int ALL = 99;
    }

    public class Gear {
        public const int ArmCategoryNumber = 6;
        public const int ArmPositionNumber = 6;
        public const int WeaponryCapacity = 10;
        public const int ArmSkillNumber = 4;
        public const float NetInterval = 0.5f;
        public const int NullSkillID = 20000000;
        public const int InValidArmID = -1;
        public const int InValidStoneID = -1;
    }

    public class GearSkillType
    {
        public const int ATTACK = 1;
        public const int LIFE = 2;
        public const int TROOPLIMIT = 3;
        public const int LOAD = 4;
        public const int SPEED = 5;
        public const int ATTACKDEBUFF = 6;
        public const int LIFEDEBUFF = 7;
    }

    public class ColorValue {
        public static readonly Vector4 LightGreen = new Vector4(255, 242, 170, 255); // Liang lv
        public static readonly Vector4 DarkBrown = new Vector4(69, 44, 3, 255); // Shen hese
        public static readonly Vector4 Magenta = new Vector4(113, 73, 14, 255); // Yang hong
        public static Color ToRGBA(int red, int green, int blue) {
            red = Mathf.Clamp(red, 0, 255);
            green = Mathf.Clamp(green, 0, 255);
            blue = Mathf.Clamp(blue, 0, 255);
            return new Color(red / 255.0f, green / 255.0f, blue / 255.0f, 1.0f);
        }

        public static Color ToRGBA(Vector3 src)
        {
            src.x = Mathf.Clamp(src.x, 0f, 255f);
            src.y = Mathf.Clamp(src.y, 0f, 255f);
            src.z = Mathf.Clamp(src.z, 0f, 255f);
            return new Color(src.x / 255.0f, src.y / 255.0f, src.z / 255.0f, 1.0f);
        }

        public static Color ToRGBA(Vector4 src)
        {
            src.x = Mathf.Clamp(src.x, 0f, 255f);
            src.y = Mathf.Clamp(src.y, 0f, 255f);
            src.z = Mathf.Clamp(src.z, 0f, 255f);
            src.w = Mathf.Clamp(src.w, 0f, 255f);
            return new Color(src.x / 255.0f, src.y / 255.0f, src.z / 255.0f, src.w / 255.0f);
        }

        public static Vector4 FromRGBA(Color col)
        {
            return new Vector4(col.r * 255.0f, col.g * 255.0f, col.b * 255.0f, col.a * 255.0f);
        }

        public static string ToHTMLHexString(int red, int green, int blue)
        {
            red = Mathf.Clamp(red, 0, 255);
            green = Mathf.Clamp(green, 0, 255);
            blue = Mathf.Clamp(blue, 0, 255);

            string result = "#" + red.ToString("X") + green.ToString("X") + blue.ToString("X");
            result += "FF";

            // MUST Note is lower char
            return result.ToLower();
        }

        public static Color FromHTMLHexString(string colorStr)
        {
            // #842828ff
            string redStr = colorStr.Substring(1, 2);
            int red = System.Convert.ToInt32(redStr, 16);

            string greenStr = colorStr.Substring(3, 2);
            int green = System.Convert.ToInt32(greenStr, 16);

            string blueStr = colorStr.Substring(5, 2);
            int blue = System.Convert.ToInt32(blueStr, 16);

            return ToRGBA(red, green, blue);
        }
    }

    public class StoneType {
        public const int Smallest = 42000;
        public const int Largetest = 42399;

        public const int Red = 42000;
        public const int Blue = 42200;
        public const int Green = 42100;
        public const int Grey = 42300;
        public const int All = 0;
    }

    public class ArmType {
        public const int Smallest = 1;
        public const int Largetest = 6;

        public const int Sword = 1;
        public const int Pants = 2;
        public const int Helmet = 3;
        public const int Shield = 4;
        public const int Armer = 5;
        public const int Ring = 6;
        public const int All = 0;
    }

    public class AppRaterFlag {
        public const string Now = "1";
        public const string Later = "2";
        public const string NoThanks = "3";
        public const string UserVoice = "4";
    }

    public class HeroRelic
    {
        public const string RelicEquipRefresh = "relic_Equip_Refresh";
        public const string RelicEquipDisplay = "relic_Equip_Display";
        public const string RelicEquipHide = "relic_Equip_Hide";
        public const string RelicEquipSelect = "relic_Equip_Select";
        public const string RelicEquipSuccess = "relic_Equip_Success";
        public const string RelicUnloadSuccess = "relic_Unload_Success";

        public const string RelicAddUpgradeItem = "relic_Add_Upgrade_Item";
        public const string RelicRemoveUpgradeItem = "relic_Removve_Upgrade_Item";
        public const string RelicUpgradeSuccess = "relic_Upgrade_Success";

        public const string RelicSelectWarehouseItem = "relic_Select_Warehouse_Item";
        public const string RelicLockAndUnlocckSuccess = "relic_LockAndUnlock_Success";
    }

    public class Hero
    {
        public const int HeroHouseSlotId = 99;
        public const int HeroMarchSkillType = 10004;
        public const int HeroExploreItemFrom = 970;
        public const int HeroExploreItemTo = 975;
        public const int HeroGiftItemFrom = 30000;
        public const int HeroGiftItemTo = 39999;
        public const int HeroLevelUpItemFrom = 34000;
        public const int MaxHeroNumPerTier = 100;
        public const int ElevateLevel = 100;
        public const float HeroExploreGameTime = 3.0f;
        public const int SkillLevelUp_ReqType_Hero = 0;
        public const int SkillLevelUp_ReqType_Item = 1;

        public const string HeroCollectCount = "HERO_COLLECT_COUNT";
        public const string HeroExploreOpenedFlag = "HERO_EXPLORE_OPENED";
        public const string HeroErrorMessage = "hero_error_message";
        public const string HeroExploreSceneLoaded = "hero_explore_scene_loaded";
        public const string HeroStatusUpdated = "hero_status_updated";
        public const string HeroInfoListUpdated = "hero_info_list_updated";
        public const string HeroBoosted = "hero_boosted";
        public const string HeroUnlock = "hero_unlock";
        public const string HeroUnassigned = "hero_unassigned";
        public const string HeroAssigned = "hero_assigned";
        public const string HeroInitExplore = "hero_init_explore";
        public const string HeroProcessExplore = "hero_process_explore";
        public const string HeroExploreCostGems = "hero_explore_cost_gems";
        public const string HeroElevateOKFromDetail = "Hero_Elevate_OK_FromDetail";
        public const string HeroElevateOKFromHeroMenu = "Hero_Elevate_OK_FromHeroMenu";
        public const string HeroElevateOKFromCollectAndDetailMenu = "Hero_Elevate_OK_FromCollectAndDetailMenu";
        public const string HeroElevateOKFromAssignAndDetail = "Hero_Elevate_OK_FromAssignAndDetailMenu";
        public const string SkillLevelUpOK = "Hero_SkillLevelUp_OK";


    }

    public class PveLeaderboardMenuType
    {
        public enum Menu_Type
        {
            MENU_TYPE_PVE = 0,
            MENU_TYPE_HERO
        };
    }

    public class Vip
    {
        public const int VipItemBegin = 21000;
        public const int VipItemEnd = 21002;
        public const int TempVipItemBegin = 21501;
        public const int TempVipItemEnd = 21509;
    }

    public class ReqPvPToumamentId
    {
        public const int ReqEventList = 1;
        public const int ReqMarchList = 2;
        public const int ReqShareInfo = 3;
        public const int ReqRankList = 4;

        public const int RewardsList = 1;

        public const int ReqMyCityMarchList = 1;

        public const int ShareTile = 1;
        public const int ShareMyList = 2;
        public const int ShareList = 3;
        public const int ShareDelete = 4;
        public const int ShareSetOrder = 5;

        public const int AllianceLeaderboard = 1;
        public const int PlayerLeaderboard = 2;
    }

    public class PvPResponseOk
    {
        public const string ToumamentInfoOK = "ToumamentInfoOK";
        public const string SharedInfoOK = "SharedInfoOK";
        public const string RankInfoOK = "RankInfoOK";
        public const string SetOrderOK = "SetOrderOK";
        public const string DeleteSharedOK = "DeleteSharedOK";
        public const string AbandonTileOK = "AbandonTileOK";
        public const string SharedPageAllOK = "SharedPageAllOK";
        public const string SharedPageMyLotOK = "SharedPageMyLotOK";
        public const string RankPageAllianOK = "RankPageAllianOK";
        public const string RankPageIndiOK = "RankPageIndiOK";
        public const string WorldMapMarchOK = "WorldMapMarchOK";
        public const string WorldMapTroopRestoreOK = "WorldMapTroopRestoreOK";
        public const string ReceiveTournamentBonusForPlayer = "ReceiveTournamentBonusForPlayer";
        public const string ReceiveTournamentBonusForAlliance = "ReceiveTournamentBonusForAlliance";
        public const string RefreshTheAllianceHelpList = "RefreshTheAllianceHelpList";
        public const string RefreshTheEndTimeOfMarchLine = "RefreshTheEndTimeOfMarchLine";
        public const string MarchListCityChange = "MarchListCityChange";
    }

    public enum PVE_REQ_Type
    {
        REQ_Type_NONE = 0,
        REQ_Type_INFO = 1,
        REQ_Type_REFILL_ENERGY = 2,
        REQ_Type_RECOVER_ENERGY = 3,
        REQ_Type_MARCH = 4,
        REQ_Type_MARCH_RESULT = 5,
        REQ_Type_LEADERBOARD_PVE = 6,
        REQ_Type_PVE_FTE = 7,
        REQ_Type_LEADERBOARD_PVE_TROOPKILL = 8,
        REQ_Type_RECOVER_ADVANCED = 9,
        REQ_Type_RECOVER_NEW_ADVANCED = 10,
        ALLIANCE_BOSS_REQ_TYPE_INFO = 1000,
        ALLIANCE_BOSS_REQ_TYPE_MSG = 1001,
        REQ_Type_MARCH_ALLIANCEBOSS = 1002,
        REQ_Type_MARCH_RESULT_ALLIANCEBOSS = 1003,
        ALLIANCE_BOSS_REQ_TYPE_RESET = 1004,
        ALLIANCE_BOSS_TROOP_INFO = 1005,
        ALLIANCE_BOSS_TROOP_RETURN = 1006,
        ALLIANCE_BOSS_REWARD = 1008,
    };

    public enum PVE_VERIFY_REQ_Type
    {
        GET_INFO = 1,
        VERIFY = 2,
        REFRESH = 3,
    }

    public class MergeServer
    {
        public const string SaveServerOK = "SaveServerOK";
        public const string GetAllServerMergeMsgOk = "Get_AllServerMergeMsg_OK";
    }

    public class AssetBundleManager
    {
        public const string BundleMd5List = "BundleMd5List.txt";
        public const string ResourceList = "ResourceList.txt";
        public const string JointBundleNameAndMd5 = "__MD5__";
        public const string AssetBundleNameSuffix = ".assetbundle";
    }

    public class PLAYER_PREFS
    {
        public const string ALLIANCE_BUFF_MENU_OPEN = "ALLIANCE_BUFF_MENU_OPEN";
        public const string ALLIANCE_SHOP_MENU_OPEN = "ALLIANCE_SHOP_MENU_OPEN";
        public const string ALLIANCE_SEASON_LEADER_BOARD_TRACK = "ALLIANCE_SEASON_LEADER_BOARD_TRACK";
    }

    //notification of ava
    public class AvaNotification
    {
        public const string AssignKnightOK = "Ava_AssignKnightOK";
        public const string UnAssignKnightOK = "Ava_UnAssignKnightOK";
        public const string StatusChanged = "Ava_StatusChanged";
        public const string MatchResultOK = "Ava_MatchResultOK";
        public const string ActivityLogUpdated = "Ava_ActivityLogUpdated";
    }

    public class AvaSpeedUpType
    {
        public const int AvaMarchSpeedUp = 1;
        public const int AvaHeroSpeedUp = 2;
    }

    public class AvaSocketMsgType
    {
        public const int StateUpdate_Ava_RallyMarch = 1;
        public const int StateUpdate_Ava_IncommingAttack = 2;
        public const int StateUpdate_Ava_Reinforce = 3;
        public const int StateUpdate_Ava_Buff = 4;
        public const int StateUpdate_Ava_Report = 5;
        public const int StateUpdate_Ava_Troops = 6;
        public const int StateUpdate_Ava_MarchMaking = 7;
        public const int StateUpdate_Ava_Score = 8;
        public const int StateUpdate_Ava_Item = 9;
        public const int StateUpdate_Ava_ProtectionTime = 10;
        public const int StateUpdate_Ava_NewMarchLine = 11;
        public const int StateUpdate_Ava_Toast = 12;
        public const int StateUpdate_Ava_SuperWonderOwnershipChange = 13;
        public const int StateUpdate_Ava_ActivityLog = 14;
        public const int StateUpdate_Ava_WonderTileNumChange = 15;
        public const int StateUpdate_Ava_OwnTotalDataCount = 16;
    }

    public class AvaActivityLogType
    {
        public const int LOG_TYPE_WINNING_POSITION_CHANGE = 1; //Winning(leading) position changes
        public const int LOG_TYPE_SUPERWONDER_CHANGE_HANDS = 2; //The Super Wonder change hands
        public const int LOG_TYPE_START_RALLY = 3; //Start a Rally Attack
        public const int LOG_TYPE_ATTACK = 4; //Attacks
        public const int LOG_TYPE_RALLYATTACK = 5; //Rally Attacks
        public const int LOG_TYPE_DEFENCE = 6; //Defence
        public const int LOG_TYPE_JOIN_RALLYATTACK = 7; //Join a Rally Attack
        public const int LOG_TYPE_REINFOCE = 8; //Reinforcement
    }

    public const int Ava_Item_Begin = 6800;
    public const int Ava_Item_End = 7000;

    public class PveType
    {
        public const int NORMAL = 1;
        public const int HIDDENBOSS = 2;
        public const int EVENTBOSS = 3;
        public const int ALLIANCEBOSS = 4;
        public const int SOURCEBOSS = 5;
        public const int ELITE = 6;
    }

    public class AllianceRankType
    {
        public const string LEVEL = "level";
        public const string LEAGUE = "league";
        public const string MIGHT = "might";
    }

    public class CollectCarmotMarchlineColor
    {

        public static readonly Color GREEN = new Color(120 / 255f, 1, 0);//green
        public static readonly Color GREEN_LIGHT = new Color(0, 160 / 255f, 0);
        public static readonly Color PURPLE = new Color(199 / 255f, 65 / 255f, 225 / 255f);//purple
        public static readonly Color PURPLE_LIGHT = new Color(165 / 255f, 124 / 255f, 176 / 255F);
        public static readonly Color RED = new Color(1, 45 / 255f, 45 / 255f);//red
        public static readonly Color RED_LIGHT = new Color(195 / 255f, 195 / 255f, 195 / 255f);
        public static readonly Color BLUE = new Color(98 / 255, 203 / 255f, 1);//blue
        public static readonly Color BLUE_LIGHT = new Color(148 / 255f, 168 / 255f, 188 / 255f);


        public static readonly Color LIGHT = new Color(195 / 255f, 195 / 255f, 195 / 255f);
    }

    public class MarchLineType
    {
        public const int GREEN = 0;
        public const int BLUE = 1;
        public const int WHITE = 2;
        public const int RED = 3;
    }

    public class NewMarchlineColor
    {

        public static readonly Color GREEN = new Color(120 / 255f, 1, 0);//green
        public static readonly Color GREEN_OUTLIGHT = new Color(18 / 255f, 156 / 255f, 0);
        public static readonly Color GREEN_OUTLINE = new Color(56 / 255f, 79 / 255f, 7 / 255f);

        public static readonly Color WHITE = new Color(247 / 255f, 247 / 255f, 247 / 255f);
        public static readonly Color WHITE_OUTLIGHT = new Color(80f / 255f, 80f / 255f, 80f / 255f);
        public static readonly Color WHITE_OUTLINE = new Color(75 / 255f, 75 / 255f, 75 / 255f);

        public static readonly Color RED = new Color(1, 45 / 255f, 45 / 255f);//red
        public static readonly Color RED_OUTLIGHT = new Color(147 / 255f, 28 / 255f, 4 / 255f);
        public static readonly Color RED_OUTLINE = new Color(93 / 255f, 21 / 255f, 21 / 255f);

        public static readonly Color BLUE = new Color(54 / 255, 234 / 255f, 1);//blue
        public static readonly Color BLUE_OUTLIGHT = new Color(0 / 255f, 129 / 255f, 144 / 255f);
        public static readonly Color BLUE_OUTLINE = new Color(40 / 255f, 13 / 255f, 93 / 255f);

        public static readonly Color LIGHT = new Color(195 / 255f, 195 / 255f, 195 / 255f, 200 / 255f);

        public static readonly Color TRANSPARENT = new Color(0f, 0f, 0f, 0f);
    }

    public class RallyAttackMarchLineColor
    {
        public static readonly Color WHITE = new Color(1, 1, 1);
        public static readonly Color GRAY = new Color(200f / 255f, 200f / 255f, 200f / 255f);
    }

    public class MigrateConditionType {
        public const int ITEM_COUNT = 1;
        public const int ALIANCE_STATE = 2;
        public const int OUT_MARCH = 3;
        public const int OCCUPY_TIELS = 4;
        public const int CAN_MIGRATE = 5;
        public const int TS_PLANS = 6;
        public const int TS_ALLIANCE = 7;
        public const int TS_OUTMARCH = 8;
        public const int TS_OCCUPY = 9;
        public const int BOUNT_EMAIL = 10;
        public const int CURRENT_WORLDID = 11;
        public const int TARGET_WORLDID = 12;
    }

    public enum EitorResolutionType {
        Normal,
        Iphone6s,
        IphoneX,
        IphoneXR
    }

    //科技树升级 资源id
    public class TechnologyResourceID
    {
        public const int Gold = 0;
        public const int Food = 1;
        public const int Wood = 2;
        public const int Stone = 3;
        public const int Ore = 4;
        public const int Carmot = 5;
        public const int Item = 6;
    }

    //世界boss start
    public class WorldBossAnimationState
    {
        public const int normal = 1;
        public const int mad = 2;
        public const int awake = 3;
    }

    public class WorldBOssAnimationAction
    {
        public const int idle = 2;
        public const int attack = 1;
        public const int dead = 0;
        public const int reallyDead = 4;
    }

    public class WorldBossAnimationPar
    {
        public const int frontalAttack = 101;
        public const int backAttack = 102;
    }
    //世界boss end


    public class MistExpeditionConst{

        //menu prefab name
        // 字符串值 需要和 Resources/MenuResConfig.json 文件中的key对应上
        public const string SceneMenu_MainMenu = "MistExpeditionSceneMenu";
        public const string SceneMenu_Buff = "MistExpeditionSceneMenuBuff";
        public const string SceneMenu_BattleEvent = "MistExpeditionSceneMenuBattleEvent";
        public const string SceneMenu_BattleEventMarch = "MistExpeditionSceneMenuBattleEventMarch";
        public const string SceneMenu_BattleEventMarchChooseTroop = "MistExpeditionSceneMenuBattleEventMarchChooseTroop";
        public const string SceneMenu_BattleEventResult = "MistExpeditionSceneMenuBattleEventResult";
        public const string SceneMenu_BattleEventReward = "MistExpeditionSceneMenuBattleEventReward";
        public const string SceneMenu_BattleEventRewardBossChest = "MistExpeditionSceneMenuBattleEventRewardBossChest";
        public const string SceneMenu_ChestEvent = "MistExpeditionSceneMenuChestEvent";
        public const string SceneMenu_LeaderSelect = "MistExpeditionSceneMenuLeaderSelect";
        public const string SceneMenu_LeaderSkillInfo = "MistExpeditionSceneMenuLeaderSkillInfo";
        public const string SceneMenu_MerchantEvent = "MistExpeditionSceneMenuMerchantEvent";
        public const string SceneMenu_SupplyStationEvent = "MistExpeditionSceneMenuSupplyStationEvent";
        public const string SceneMenu_TroopInfo = "MistExpeditionSceneMenuTroopInfo";
        public const string SceneMenu_EventPoints = "MistExpeditionSceneEventPoints";
        public const string SceneMenu_LeaderCollect = "MistExpeditionSceneMenuLeaderCollect";
        public const string SceneMenu_ExpeditionBuyHorn = "MistExpeditionMenuExpeditionHorn";

        //event cell  prefab obj path 
        public const string MapSlot_Event_Chest = "MistExpedition/MapSlot/mistexpedition_map_slot_event_chest";
        public const string MapSlot_Event_Merchant = "MistExpedition/MapSlot/mistexpedition_map_slot_event_merchant";
        public const string MapSlot_Event_Random = "MistExpedition/MapSlot/mistexpedition_map_slot_event_random";
        public const string MapSlot_Event_SupplyStation = "MistExpedition/MapSlot/mistexpedition_map_slot_event_supplystation";

        public const string MapSlot_Event_Battle_Normal = "MistExpedition/MapSlot/mistexpedition_map_slot_event_battle_normal";
        public const string MapSlot_Event_Battle_Elite = "MistExpedition/MapSlot/mistexpedition_map_slot_event_battle_elite";
        public const string MapSlot_Event_Battle_Boss = "MistExpedition/MapSlot/mistexpedition_map_slot_event_battle_boss";

        public const string MapSlot_Flag = "MistExpedition/MapSlot/mistexpedition_map_slot_flag";
        public const string MapSlot_Select_Arrow = "MistExpedition/MapSlot/mistexpedition_map_slot_select_arrow";
        public const string MapSlot_Chest_Reward = "MistExpedition/MapSlot/mistexpedition_map_slot_chest_reward";
        public const string MapSlot_Battle_Anime = "MistExpedition/MapSlot/mistexpedition_map_slot_battle_anime";
        public const string MapSlot_Battle_Anime_Boss = "MistExpedition/MapSlot/mistexpedition_map_slot_battle_boss_anime";
    }


    public class ThirdPartyPayment {
        public const string ThirdPartyPaymentURL = "";// "https://decagames.com/";

    }
}
