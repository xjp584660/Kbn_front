class PrestigeConfirmMenu extends PopMenu
{
	public var l_Title:Label; 
	public var l_Line:Label;
	public var l_Description:Label;
	public var l_Img:Label;
	public var l_bgImg:Label;
	public var l_Gain:Label;
	public var l_Star1:Label;
	public var l_Star2:Label;
	public var l_Star3:Label;
	public var l_bgDark:Label;
	public var l_bgDarkTiao:Label;
	public var scroll:ScrollList;
	public var item:PrestigeDescItem;
	public var l_ConfirmTips:Label;
	public var btnCancel:Button;
	public var btnPrestige:Button;
	
	private var m_animationSprClone:GameObject;
	
	static private  var BIMG_RECT_TALL:Rect = new Rect(47,90,220,220);
	static private var BIMG_RECT_FAT:Rect = new Rect(47,70,220,220);
	static private var BIMG_RECT_FAT1:Rect = new Rect(47,80,220,220);
	
	static private var BIMG_RECT_WALL:Rect = new Rect(55,120,220,164);
	
	private var m_buildingInfo:Building.BuildingInfo;
	
	
	public function Init()
	{
		super.Init();
		l_Title.txt = Datas.getArString("Common.Prestige");
		l_Gain.txt = Datas.getArString("Prestige.Bonuses");
		l_Line.mystyle.normal.background = TextureMgr.instance().LoadTexture("between line",TextureType.DECORATION);
		l_bgDark.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2",TextureType.DECORATION);
		l_bgDarkTiao.mystyle.normal.background = TextureMgr.instance().LoadTexture("square_black2",TextureType.DECORATION);
		
		l_Star1.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_Star2.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		l_Star3.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_quest_recommend",TextureType.ICON);
		
		btnCancel.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
		btnCancel.mystyle.onNormal.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
		btnCancel.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
		btnPrestige.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
		btnPrestige.mystyle.onNormal.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
		btnPrestige.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_downnew",TextureType.BUTTON);
		
		btnCancel.txt = Datas.getArString("Common.Cancel");
		btnPrestige.txt = Datas.getArString("Common.Prestige");
		btnCancel.OnClick = OnCancel;
		btnPrestige.OnClick = OnPrestige;
		
		scroll.Init(item);
	}
	
	public function Update()
	{
		scroll.Update();
	}
	
	public function DrawItem()
	{
		l_Title.Draw();
		l_Line.Draw();
		l_bgImg.Draw();
		l_Img.Draw();
		l_Description.Draw();
		l_bgDark.Draw();
		l_bgDarkTiao.Draw();
		l_Gain.Draw();
		l_ConfirmTips.Draw();
		l_Star1.Draw();
		l_Star2.Draw();
		l_Star3.Draw();
		btnCancel.Draw();
		btnPrestige.Draw();
		scroll.Draw();
	}
	
	public function OnPush(param:Object)
	{
		m_buildingInfo = param as Building.BuildingInfo;
		if(null == m_buildingInfo) return;
		_UpdateData();
		
		var prestigeDesc:String = Datas.getArString("Prestige.BuildingModalDesc");
		prestigeDesc = prestigeDesc.Replace("{0}",m_buildingInfo.buildName);
		l_Description.txt = prestigeDesc;
		
		var conText:String = Datas.getArString("Prestige.ModalWarning");
		conText = conText.Replace("{0}",m_buildingInfo.buildName);
		l_ConfirmTips.txt = conText;
		
		var arr:Array = new Array();
		//Prestige^LevelXBonus
		
		var titleStr:String = Datas.getArString("Prestige.LevelXBonus");
		var curPrestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(m_buildingInfo.typeId,m_buildingInfo.curLevel);
		var prestige:int = _Global.INT32(curPrestigeData["prestige"]);
		var minLevelOfNextPrestige:int = m_buildingInfo.curLevel+1;
		var maxLevelOfNextPrestige:int = GameMain.GdsManager.GetGds.<GDS_Building>().getMaxLevelOfThisPrestige(m_buildingInfo.typeId,prestige+1);
		var minNextPrestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(m_buildingInfo.typeId,minLevelOfNextPrestige);
		var maxNextPrestigeData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(m_buildingInfo.typeId,maxLevelOfNextPrestige);
		
//		titleStr = titleStr.Replace("{0}",minNextPrestigeData["prestige"].Value + "-" + minNextPrestigeData["level"].Value);
		titleStr = titleStr.Replace("{0}","" + minNextPrestigeData["level"].Value);
		var desc:String = Building.instance().getNextLevelDescription(m_buildingInfo.typeId,m_buildingInfo.curLevel);	
		
		var Obj:HashObject = new HashObject({"prestige":prestige+1,"lvBonus":titleStr,"lvDesc":desc});
		arr.Push(Obj);
		
		titleStr = Datas.getArString("Prestige.LevelXBonus");
//		titleStr = titleStr.Replace("{0}",maxNextPrestigeData["prestige"].Value + "-" + maxNextPrestigeData["level"].Value);
		titleStr = titleStr.Replace("{0}","" + maxNextPrestigeData["level"].Value);
		desc = Building.instance().getNextLevelDescription(m_buildingInfo.typeId,maxLevelOfNextPrestige-1);
		Obj = new HashObject({"prestige":prestige+1,"lvBonus":titleStr,"lvDesc":desc});
		arr.Push(Obj);
		
		scroll.SetData(arr);
		scroll.ResetPos();
	}
	
	private function _UpdateData()
	{
		if(m_buildingInfo != null)
		{
			var prefixName:String = Building.instance().getPrefixOfBuildingImgName(GameMain.instance().getCurCityOrder(),m_buildingInfo.typeId);
			var prestigeImgName:String = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeImgName(m_buildingInfo.typeId,m_buildingInfo.curLevel);
			prestigeImgName = prefixName + prestigeImgName;
			var texture :Texture2D = null;
			if(m_buildingInfo.typeId == Constant.Building.WALL)
			{
				texture = TextureMgr.instance().LoadTexture(prestigeImgName,TextureType.BUILDING);
			}
			else
			{
				m_animationSprClone = TextureMgr.instance().loadAnimationSprite(prestigeImgName, Constant.AnimationSpriteType.Building);
				if(m_animationSprClone != null)
				{
					m_animationSprClone = Instantiate(m_animationSprClone);
					texture = m_animationSprClone.transform.GetChild(0).GetComponent.<Renderer>().material.mainTexture as Texture2D;
				}
			}
			l_Img.mystyle.normal.background = texture;
			if(m_buildingInfo.typeId == Constant.Building.PALACE || m_buildingInfo.typeId == Constant.Building.EMBASSY || m_buildingInfo.typeId == Constant.Building.WATCH_TOWER)
			{
				l_Img.rect = BIMG_RECT_TALL;
			}
			else if(m_buildingInfo.typeId == Constant.Building.WALL)
			{
				l_Img.rect = BIMG_RECT_WALL;
			}
			else if(m_buildingInfo.typeId == Constant.Building.QUARRY)
			{
				l_Img.rect = BIMG_RECT_FAT1;
			}
			else
			{
				l_Img.rect = BIMG_RECT_FAT;
			}
			
			var presData:HashObject = GameMain.GdsManager.GetGds.<GDS_Building>().getPrestigeDataFromRealLv(m_buildingInfo.typeId,m_buildingInfo.curLevel+1);
			var prestige:int = _Global.INT32(presData["prestige"]);
			l_Star1.SetVisible(prestige >= 1);
			l_Star2.SetVisible(prestige >= 2);
			l_Star3.SetVisible(prestige >= 3);
			var descString:String = l_Description.txt;
			descString.Replace("{building name}",m_buildingInfo.buildName);
			l_Description.txt = descString;
		}
	}
	
	public function OnPrestige()
	{
		Building.instance().upgradeAction(m_buildingInfo.typeId,m_buildingInfo.curLevel,m_buildingInfo.slotId);
		MenuMgr.getInstance().SwitchMenu("MainChrom",null);
	}
	
	public function OnCancel()
	{
		MenuMgr.getInstance().PopMenu("");
	}
	
	public	function	OnPopOver()
	{
		if(m_animationSprClone != null)
			UnityEngine.Object.Destroy(m_animationSprClone.gameObject);
		scroll.Clear();
	}
	
	
}