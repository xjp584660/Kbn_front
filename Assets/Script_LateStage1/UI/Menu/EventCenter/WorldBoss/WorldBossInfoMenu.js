public class WorldBossInfoMenu extends ComposedUIObj
{

	public var bg:Label;
	public var bossName:Label;
	
	public var img:Label;
	public var attackBtn:Button;
	public var helpBtn:Button;

	private var x:int;
	private var y:int;

	public var point:Label;
	public var endTime:Label;
	public var des:Label;
	public var closeBtn:Button;

	public var gds_worldboss:KBN.DataTable.WorldBoss;

	public var sliderTop:Label;
	public var currentBlood:Label;

	// public var item:WorldBossDropItem;
	// public var scroll:ScrollList; 

	public var dropTip:Label;

	public var direction:Label;

	public var marchShareBtn:Button;

	private var bossId:int;

	public function Init(){
		super.Init();
		bg.Init();
		bossName.Init();
		currentBlood.Init();
		img.Init();
		attackBtn.Init();
		helpBtn.Init();

		attackBtn.OnClick=Attack;
		helpBtn.OnClick=OpenHelp;

		point.Init();
		endTime.Init();
		des.Init();
		direction.Init();

		closeBtn.OnClick=close;

		// scroll.Init(item);
		dropTip.txt=Datas.getArString("WorldBoss.AttackBoss_Text1");

		marchShareBtn.OnClick=MarchShare;
	}

	public function UpdateItems(){
		// scroll.Update();
	}

	private function MarchShare() : void
    {
        var chatMenuName = "ChatMenu";
        var paramDict : Hashtable = null;
        if (true)
        {
        	var str:String=bossName.txt+"-("+x+","+y+")";
            paramDict = new Hashtable();
            paramDict.Add("tabName", "normal");
            paramDict.Add("marchShare", str);
          //  Debug.Log("this March = "+str);
        }
        MenuMgr.getInstance().PushMenu(chatMenuName, paramDict);
    }

	public function close(){
		// this.SetVisible(false);
		MenuMgr.getInstance().PopMenu("WorldBossInfoMenu");
		
	}

	public function OnShow(param:Object){

		// super.OnPush(param);

		if (param==null) {
			return;
		}
		if (param!=null) {
			Debug.Log("WorldBossInfoMenu:info: "+param);
		}
		
		var data:PBMsgWorldBossSocket.PBMsgWorldBossSocket=param as PBMsgWorldBossSocket.PBMsgWorldBossSocket;
		// bossName.txt="BossId: "+data.bossId.ToString();

		bossId=data.bossId;

		x=data.xCoord;
		y = data.yCoord;

		if ((data.blood / 100f) <= 0)
		{
			currentBlood.txt = 0 + "%";
			sliderTop.rect.width = 0;
		}else
		{
			currentBlood.txt = (data.blood / 100f) +"%";
			sliderTop.rect.width = (data.blood / 10000f)* 320f;
		}
		//currentBlood.txt=(data.blood/100f)+"%";
		//sliderTop.rect.width=(data.blood/10000f)*320f;

		gds_worldboss=GameMain.GdsManager.GetGds.<KBN.GDS_WorldBoss>().GetItemById(data.bossTypeId);

		bossName.txt=Datas.getArString(gds_worldboss.Boss_name);
		point.txt="("+x+","+y+")";
		// endTime.txt=Datas.getArString("WorldBoss.AttackBoss_Text2")+GameMain.singleton.GetWorldBossEndTime();
		

		// var showRewards:String[]=_Global.GetStringListByString(gds_worldboss.show_reward);
		// scroll.SetData(showRewards);
		SetBossState(data.status);

		var gMain:GameMain = GameMain.singleton;
		var curCityInfo:HashObject = gMain.GetCityInfo(gMain.getCurCityId());
		var x:int = _Global.INT32(curCityInfo[_Global.ap + 2]);
		var y:int = _Global.INT32(curCityInfo[_Global.ap + 3]);
		Debug.LogWarning("x="+x+"  y="+y);
		if (WorldBossController.singleton.IsFrontAttack(data.xCoord,data.yCoord,x,y)) {
			direction.txt=Datas.getArString("WorldBoss.AttackBoss_Text8");
		}else{
			direction.txt=Datas.getArString("WorldBoss.AttackBoss_Text9");
		}
		

	}

	private function SetBossState(state:int){
		switch(state){
			case 0:
				// endTime.txt=Datas.getArString("WorldBoss.AttackBoss_Text7");
				des.txt=Datas.getArString(gds_worldboss.drama_normal);
				img.mystyle.normal.background=TextureMgr.instance().LoadTexture("boss_dead",TextureType.WORLDBOSS);
				endTime.mystyle.normal.background=TextureMgr.instance().LoadTexture("none",TextureType.WORLDBOSS);
				break;
			case 1:
				// endTime.txt="";
				des.txt=Datas.getArString(gds_worldboss.drama_normal);
				img.mystyle.normal.background=TextureMgr.instance().LoadTexture("boss_normal",TextureType.WORLDBOSS);
				endTime.mystyle.normal.background=TextureMgr.instance().LoadTexture("none",TextureType.WORLDBOSS);
				break;
			case 2:
				// endTime.txt=Datas.getArString("WorldBoss.AttackBoss_Text5");
				des.txt=Datas.getArString(gds_worldboss.drama_angry);
				img.mystyle.normal.background=TextureMgr.instance().LoadTexture("boss_mad",TextureType.WORLDBOSS);
				endTime.mystyle.normal.background=TextureMgr.instance().LoadTexture("buff_fanu",TextureType.WORLDBOSS);
				break;
			case 3:
				// endTime.txt=Datas.getArString("WorldBoss.AttackBoss_Text6");
				des.txt=Datas.getArString(gds_worldboss.drama_weak);
				img.mystyle.normal.background=TextureMgr.instance().LoadTexture("boss_awake",TextureType.WORLDBOSS);
				endTime.mystyle.normal.background=TextureMgr.instance().LoadTexture("buff_xuruo",TextureType.WORLDBOSS);
				break;
			case 4:
				endTime.mystyle.normal.background=TextureMgr.instance().LoadTexture("none",TextureType.WORLDBOSS);
				break;
		}

		if (state==0||state==4) {
			attackBtn.OnClick=null;
			attackBtn.SetVisible(false);
			// attackBtn.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_60_grey_normalnew",TextureType.BUTTON);
		}else{
			attackBtn.SetVisible(true);
			attackBtn.OnClick=Attack;
			// attackBtn.mystyle.normal.background=TextureMgr.instance().LoadTexture("button_60_blue_normalnew",TextureType.BUTTON);
		}
	}


	private function Attack(){
		// MenuMgr.getInstance().PopMenu("");
//		var key:String=x+"_"+y;
//		PlayerPrefs.SetString("findBoss_"+bossId,key);
		

		if (checkWorldBossOverMarch()) {
			close();
			//MenuMgr.getInstance().PushMenu("MarchMenu",{"x":x, "y":y, "type":Constant.MarchType.ATTACK},"trans_zoomComp" );
			MarchDataManager.instance().SetData({"x":x, "y":y, "type":Constant.MarchType.ATTACK});
			WorldBossController.singleton.HideBossSelect();
		}else{
			ErrorMgr.instance().PushError("",Datas.getArString("Error.err_1553"));
		}
		
	}

	public	function	checkWorldBossOverMarch () :boolean{
		var	currentcityid:int = GameMain.instance().getCurCityId();

		var filterFunc:Function = function(march:Object):boolean{
			var mStatus:int = (march as MarchVO).marchStatus;
			if(currentcityid != (march as MarchVO).cityId)
				return false;

			return (mStatus != Constant.MarchStatus.DELETED 
					&& mStatus != Constant.MarchStatus.INACTIVE 
					&& (march as MarchVO).worldBossId!=0
					);
		};
		var marches:Array = March.instance().getMarchListByFilter(filterFunc);
		var numOfMarches:int = marches.length;
		var maxMarchSlotNum:int = GameMain.singleton.GetWorldBossCount();
		return numOfMarches < maxMarchSlotNum;
	}
	private function OpenHelp(){
		MenuMgr.getInstance().PushMenu("WorldBossHelpMenu", "bossInfo", "trans_zoomComp");
	}

	public function DrawItem(){
		bossName.Draw();
		currentBlood.Draw();
		img.Draw();
		attackBtn.Draw();
		point.Draw();
		endTime.Draw();
		des.Draw();
		helpBtn.Draw();
		direction.Draw();
		// scroll.Draw();
	}

	public function OnPopOver(){
		super.OnPopOver();
		// scroll.Clear();
	}
}