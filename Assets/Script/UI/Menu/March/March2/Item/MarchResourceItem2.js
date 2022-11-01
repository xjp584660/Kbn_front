public class MarchResourceItem2 extends ListItem
{

	@Space(30) @Header("----------MarchResourceItem2----------")

	public var l_Line : Label;
	public var l_img : Label;
	public var l_name : Label;
	public var input_number : InputText;
	public var slider : Slider;
	public var l_min : Label;
	public var l_max : Label;
	public var slider_bg : SimpleLabel;
	public var btn_max : Button;
	
    @SerializeField
    private var head : Label;
    @SerializeField
    private var info : Label;
    @SerializeField
    private var detail : Button;
    @SerializeField
    private var heroName : Label;
    @SerializeField
    private var heroMight : Label;
	@SerializeField
    private var level : Label;
	@SerializeField
	private var attack : Label;
	@SerializeField
	private var health : Label;
	@SerializeField
	private var load : Label;
	@SerializeField
	private var skillName : Label[];
	@SerializeField
	private var join : Button;
	@SerializeField
	private var disjoin : Button;
	@SerializeField
	private var speedup : Button;
	@SerializeField
	private var sleepStatus : Label;
	@SerializeField
    private var sleepTime : Label;
	@SerializeField
	private var flag : Label;

	protected var ITEM_ACTION : String = "";
	protected var data : Object = null;
	protected var tname : String = "";
	protected var type : MarchResourceItemType = MarchResourceItemType.ResourceOrTroop;
	protected var heroJoin : boolean = false;
	protected var heroInfo : KBN.HeroInfo = null;

	protected var marchDataIns:MarchDataManager;

	private enum MarchResourceItemType
	{
		ResourceOrTroop,
		Hero
	};


	public function Draw()
	{
		if (!visible) return;


		GUI.BeginGroup(rect);
		if (type == MarchResourceItemType.ResourceOrTroop)
		{
			l_img.Draw();
			l_name.Draw();
			input_number.Draw();
			slider.Draw();
			l_min.Draw();
			l_max.Draw();
			btn_max.Draw();
			l_Line.Draw();
		}
		else if (type == MarchResourceItemType.Hero)
		{
			head.Draw();
			info.Draw();
			detail.Draw();
			level.Draw();
			heroName.Draw();
			heroMight.Draw();
			attack.Draw();
			health.Draw();
			load.Draw();
			for (var i : Label in skillName)
			{
				i.Draw();
			}
			if (heroInfo.Status == KBN.HeroStatus.Sleeping)
			{
				speedup.Draw();
				sleepStatus.Draw();
				sleepTime.txt = heroInfo.SleepTimeDescripiton;
				sleepTime.Draw();
			}
            else if (heroJoin)
            {
            	flag.Draw();
                disjoin.Draw();
            }
            else
            {
                join.Draw();
            }
			l_Line.Draw();
		}
		GUI.EndGroup();
	}

	public function Init()	/*call many*/
	{
		/*keyboardtype*/
		input_number.type = TouchScreenKeyboardType.NumberPad;
		input_number.filterInputFunc = handlerFilterInputFunc;
		input_number.inputDoneFunc = handlerInputDoneFunc;
		input_number.Init();
		btn_max.OnClick = handlerMaxbtnFunc;
		join.changeToBlueNew();
		join.OnClick = OnJoinClick;
		disjoin.changeToBlueNew();
		disjoin.OnClick = OnDisJoinClick;
		speedup.changeToGreenNew();
		speedup.OnClick = OnSpeedupClick;
		detail.OnClick = OnDetailClick;
		slider.Init(100);

		l_Line.setBackground("between line_list_small", TextureType.DECORATION);
		info.mystyle.normal.background = TextureMgr.instance().LoadTexture("infor_icon", TextureType.DECORATION);
		flag.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_march_icon");
		sleepStatus.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_sleep");
		sleepTime.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_time");
		join.txt = Datas.getArString("Common.HeroJoinButton");
		disjoin.txt = Datas.getArString("Common.HeroDisjoinButton");
		speedup.txt = Datas.getArString("Common.Speedup");
		sleepStatus.txt = Datas.getArString("HeroHouse.HeroState2");
		marchDataIns = MarchDataManager.instance();
	}

	private var isTroop = false;


	public function RefreshMaxLabel() {
		var troopInfo = data as Barracks.TroopInfo;
		if (troopInfo != null)
		{
			l_max.txt = marchDataIns.MAXSIZE >= troopInfo.owned ? (_Global.NumSimlify(troopInfo.owned)) : (_Global.NumSimlify(marchDataIns.MAXSIZE) + "/" + _Global.NumSimlify(troopInfo.owned));
			slider.SetMaxValue(marchDataIns.MAXSIZE >= troopInfo.owned ? troopInfo.owned:marchDataIns.MAXSIZE);
		}
	}

	public function SetRowData(obj:Object):void
	{
		data = obj;
		l_min.txt = "0";
		slider.valueChangedFunc = valueChangedFunc;
		slider.onMouseFunc = null;

		var troopInfo = data as Barracks.TroopInfo;
		if (troopInfo != null)
		{
			isTroop=true;
			slider.onMouseFunc=MouseFunc;
			type = MarchResourceItemType.ResourceOrTroop;
			l_img.useTile = true;
			l_img.tile = TextureMgr.instance().UnitSpt().GetTile(troopInfo.troopTexturePath);
			tname = troopInfo.troopName;
			updateName(troopInfo.selectNum);
			l_max.txt = marchDataIns.MAXSIZE >= troopInfo.owned ? (_Global.NumSimlify(troopInfo.owned)) : (_Global.NumSimlify(marchDataIns.MAXSIZE) + "/" + _Global.NumSimlify(troopInfo.owned));
				
			slider.Init(marchDataIns.MAXSIZE >= troopInfo.owned ? troopInfo.owned:marchDataIns.MAXSIZE);
			//_Global.LogWarning("slider.Init>>>>>...");
			ITEM_ACTION = Constant.Action.MARCH_TROOP_SELECT;
		}
		else if( (obj as ResourceVO) != null )
		{
			type = MarchResourceItemType.ResourceOrTroop;
			//l_img.mystyle.normal.background = Resources.Load("Textures/UI/icon/icon_resource/icon_rec" + obj.id);//Resource.getResourceTexure(obj.id);
			l_img.useTile = true;
			l_img.tile = TextureMgr.instance().ElseIconSpt().GetTile("icon_rec" + (data as ResourceVO).id);
			//l_img.tile.name = "icon_rec" + (data as ResourceVO).id;
			//l_img.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_rec" + obj.id, TextureType.ICON_ELSE);

			tname = (data as ResourceVO).name;
			updateName((data as ResourceVO).selectNum);
			l_max.txt = "" + (data as ResourceVO).owned;
			//_Global.Log("MarchResourceItem2    ResourceType : " + (data as ResourceVO).id + " owned : " + (data as ResourceVO).owned);
			slider.Init((data as ResourceVO).owned);
			ITEM_ACTION = Constant.Action.MARCH_RESOURCE_SELECT;
		}
		else if ((obj as KBN.HeroInfo) != null)
		{
        	// var marchMenu : MarchMenu = MenuMgr.getInstance().getMenu("MarchMenu") as MarchMenu;
        	// if (marchMenu == null)
        	// {
            // 	return;
        	// }

		    heroInfo = obj as KBN.HeroInfo;
		    heroJoin = marchDataIns.ContainHero(heroInfo.Id);
		    type = MarchResourceItemType.Hero;
		    attack.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_attack");
		    health.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_health");
		    load.tile = TextureMgr.instance().GetHeroSpt().GetTile("ui_hero_load");
		    head.tile = TextureMgr.instance().ItemSpt().GetTile(heroInfo.HeadSmall);
		    level.txt = String.Format(Datas.getArString("HeroHouse.Collection_Level"), heroInfo.Level.ToString());
		    heroName.txt = heroInfo.Name;
		    heroMight.txt = String.Format(Datas.getArString("HeroHouse.Detail_Might"), heroInfo.Might.ToString());
		    attack.txt = heroInfo.Attack.ToString();
		    health.txt = heroInfo.Health.ToString();
		    load.txt = heroInfo.Load.ToString();
            var skillIndex : int = 0;
		    var fateIndex : int = 0;
		    for (var i : Label in skillName)
		    {
                if (skillIndex < heroInfo.Skill.Count)
		        {
                    i.txt = heroInfo.Skill[skillIndex].Name;
                    //i.SetNormalTxtColor(heroInfo.Skill[skillIndex].Actived ? FontColor.SmallTitle : FontColor.TabNormal_Light);
                    skillIndex++;
		        }
                else if (fateIndex < heroInfo.Fate.Count)
                {
                    i.txt = heroInfo.Fate[fateIndex].Name;
                    //i.SetNormalTxtColor(heroInfo.Fate[fateIndex].Actived ? FontColor.SmallTitle : FontColor.TabNormal_Light);
                    fateIndex++;
                }
	            else
	            {
                    i.txt = String.Empty;
                }
		    }
		}
		
		if( (obj as ResourceVO) != null )
			slider.SetCurValue((data as ResourceVO).selectNum);
		else if ((obj as Barracks.TroopInfo) != null){
			slider.SetCurValue((data as Barracks.TroopInfo).selectNum);
			handlerDelegate.handleItemAction("Slider_Up",null);
		}
	}


	private function MouseFunc(isDown:boolean){
		if (!isDown) {
			handlerDelegate.handleItemAction("Slider_Up",null);
		}
	}

	protected function valueChangedFunc(v:long):void
	{
		if(data)
		{

			var troopInfo = data as Barracks.TroopInfo;
			if (troopInfo != null) {
				troopInfo.selectNum = v;
			}
			else {
				var resourceVO = data as ResourceVO;
				if (resourceVO != null)
					resourceVO.selectNum = v;
			}


			updateName(v);
		}
		if(handlerDelegate)
			handlerDelegate.handleItemAction(ITEM_ACTION,data);
	}

	/*到达上限的回调方法*/
	protected function toLimitFunc(v:long):void
	{

	}

	protected function updateName(v:long):void
	{
		l_name.txt = tname;
		input_number.txt = "" + v;
	}

	public function SetScrollPos(pos:int, listHeight:int)
	{
	//	var scrollPos:int = pos;
		if(l_img)
		{
			if(rect.y - pos < 0 || rect.y+rect.height - pos > listHeight)
			{
				l_img.drawTileByGraphics = false;
			}
			else
				l_img.drawTileByGraphics = true;

		}
	}

	public function handlerFilterInputFunc(oldStr: String, newStr: String): String
	{
		var max:long;
		if( data instanceof Barracks.TroopInfo)
			max = _Global.INT64((data as Barracks.TroopInfo).owned);
		else if( data instanceof ResourceVO )
			max = _Global.INT64((data as ResourceVO).owned);
		var input:String = _Global.FilterStringToNumberStr(newStr);
		var count:long = 0;
		if(input == "")
		{
			count = 0;
		}
		else
		{
			count = _Global.INT64(input);
		}
		if (isTroop) {
			count = count < 0 ? 0:count;
			count = count >= slider.MaxValue ? slider.MaxValue : count;
			count = count >= slider.GetLimitValue() ? slider.GetLimitValue():count;
		}else{
			count = count >= max ? max : count;
		}

		slider.SetCurValue(count);
		valueChangedFunc(count);
		return count == 0 ? "":"" +count;
	}

	public function handlerInputDoneFunc(input: String)
	{
		if(_Global.FilterStringToNumberStr(input) == "")
		{
			slider.SetCurValue(0);
			valueChangedFunc(0);
			MouseFunc(false);
			return "0";		
		}
		else
		{
			var count=_Global.INT64(input);
			var max:long;
			if( data instanceof Barracks.TroopInfo)
				max = _Global.INT64((data as Barracks.TroopInfo).owned);
			else if( data instanceof ResourceVO )
				max = _Global.INT64((data as ResourceVO).owned);

			if (isTroop) {
				count = count < 0 ? 0:count;
				count = count >= slider.MaxValue ? slider.MaxValue : count;
				count = count >= slider.GetLimitValue() ? slider.GetLimitValue():count;	
			}else{
				count = count >= max ? max : count;
			}
			slider.SetCurValue(count);
			valueChangedFunc(count);
			MouseFunc(false);
			return input;
		}
	}

	public function handlerMaxbtnFunc(Param:Object)
	{
		var max:long;
		if( data instanceof Barracks.TroopInfo)
			max = _Global.INT64((data as Barracks.TroopInfo).owned);
		else if( data instanceof ResourceVO )
			max = _Global.INT64((data as ResourceVO).owned);

		if (isTroop) {
			max = max < 0 ? 0:max;
			max = max >= slider.MaxValue ? slider.MaxValue : max;
			max = max >= slider.GetLimitValue() ? slider.GetLimitValue():max;
		}
			
		slider.SetCurValue(max);
		valueChangedFunc(max);
		MouseFunc(false);
	}

	private function OnJoinClick(param : Object)
    {
        if (type != MarchResourceItemType.Hero)
        {
            return;
        }
        
        // var marchMenu : MarchMenu = MenuMgr.getInstance().getMenu("MarchMenu") as MarchMenu;
        // if (marchMenu == null)
        // {
        //     return;
        // }
        
		var joinHeroCount : int = marchDataIns.GetJoinHeroCount();
		var marchType : int = marchDataIns.GetMarchType();
		if(joinHeroCount >= GameMain.instance().avaMarchHeroLimit() && _Global.INT32(GameMain.Ava.Event.CurAvaType) == 1 && (marchType == Constant.AvaMarchType.ATTACK
		|| marchType == Constant.AvaMarchType.REINFORCE || marchType == Constant.AvaMarchType.SCOUT
		|| marchType == Constant.AvaMarchType.RALLYATTACK || marchType == Constant.AvaMarchType.RALLYREINFORCE
		|| marchType == Constant.AvaMarchType.RALLY))
		{
			ErrorMgr.instance().PushError("", String.Format(Datas.instance().getArString("AVAHeroLimit.Warning"), GameMain.instance().avaMarchHeroLimit()));
		}
		else
		{
			heroJoin = true;
			var heroInfo : KBN.HeroInfo = data as KBN.HeroInfo;
	        marchDataIns.JoinHero(heroInfo.Id);
		}       
    }

    private function OnDisJoinClick(param : Object)
    {
        if (type != MarchResourceItemType.Hero)
        {
            return;
        }

        heroJoin = false;
        // var marchMenu : MarchMenu = MenuMgr.getInstance().getMenu("MarchMenu") as MarchMenu;
        // if (marchMenu == null)
        // {
        //     return;
        // }

        var heroInfo : KBN.HeroInfo = data as KBN.HeroInfo;
        marchDataIns.DisJoinHero(heroInfo.Id);
    }
    
    private function OnSpeedupClick(param : Object)
    {
        if (type != MarchResourceItemType.Hero)
        {
            return;
        }

		if (heroInfo.Status != KBN.HeroStatus.Sleeping)
		{
		    return;
		}
		
		if( handlerDelegate != null )
		{
			handlerDelegate.handleItemAction(Constant.Action.MARCH_SPEEDUP_HERO,heroInfo);
		}
    }
    
    private function OnDetailClick(param : Object)
    {
        if (type != MarchResourceItemType.Hero)
        {
            return;
        }
        
        MenuMgr.getInstance().PushMenu("HeroDetailView", heroInfo, "trans_zoomComp");
    }
}
