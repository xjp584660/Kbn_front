public class MarchBoostComplex extends PopMenu
{
	public enum BOOST_TYPE
	{
		NORMAL,
		AVA
	};
	@SerializeField private var mc_boost :MarchBoostCon;
	@SerializeField private var ava_mc_boost :AvaMarchBoost;
	@SerializeField private var l_mtile		:Label;
	@SerializeField private var next_Btn :Button;
	@SerializeField private var navHead  :NavigatorHead;	
	@SerializeField private var texture_line :Texture2D;
	

	private var boostType :BOOST_TYPE;
	
	public function Init()
	{
		super.Init();
		mc_boost.Init();
		ava_mc_boost.Init();
		//navHead.titleTxt = Datas.getArString("ModalTitle.Choose_Resources");
		l_mtile.mystyle.normal.background = TextureMgr.instance().LoadTexture("icon_time", TextureType.ICON);
		next_Btn.OnClick = OnNextBtnClick;

	}

   function OnPush(param:Object)
   {
	var data:Hashtable = param as Hashtable;
	boostType = data["type"];
	var toX:int = MarchDataManager.instance().tx;
	var toY:int = MarchDataManager.instance().ty;
	if(WorldBossController.singleton.isWorldBoss(toX, toY))
	{
		updateData(Constant.MarchType.EMAIL_WORLDBOSS);        
	}
	else
	{
		updateData(MarchDataManager.instance().march_type);
	}
	if(boostType == Constant.MarchType.COLLECT ){
		navHead.titleTxt = Datas.getArString("Newresource.march_Marchnow");
	}
	else 
	{
		navHead.titleTxt = Datas.getArString("ModalTitle.March_Now");
		switch(boostType)
		{
			case Constant.MarchType.REINFORCE:
			case Constant.AvaMarchType.REINFORCE:
				next_Btn.txt = Datas.getArString("Common.Reinforce");	
				break;
			case Constant.MarchType.ATTACK:
			case Constant.MarchType.PVE:
			case Constant.MarchType.ALLIANCEBOSS:
			case Constant.AvaMarchType.ATTACK:
				next_Btn.txt = Datas.getArString("Common.Attack");
				break;
			case Constant.MarchType.COLLECT:
				next_Btn.txt = Datas.getArString("Newresource.tile_button_gather");
				break;
			case Constant.AvaMarchType.RALLYATTACK:
				next_Btn.txt = Datas.getArString("AVA.chrome_rallyattackbtn");
				break;
			case Constant.MarchType.AVA_SENDTROOP:
				next_Btn.txt = Datas.getArString("Common.Deploy");
				break;
			
		}
		//navHead.titleTxt = next_Btn.txt;	
	}
	l_mtile.txt = _Global.timeFormatStr(MarchDataManager.instance().march_time);
	l_mtile.SetVisible(true);
	SetBuffCallback(setOneTimeBuffs);
	next_Btn.txt = MarchDataManager.instance().GetNextBtnTxt();
   }
   public function DrawBackground()
   {
	   super.DrawBackground();
	   this.drawTexture(texture_line,45,105,490,17);
   }

	public function DrawItem()
	{
	//	GUI.BeginGroup(rect);
		switch(boostType)
		{
		case BOOST_TYPE.NORMAL:
			mc_boost.Draw();
			break;
		case BOOST_TYPE.AVA:
			ava_mc_boost.Draw();
			break;
		}
		l_mtile.Draw();
		next_Btn.Draw();
		navHead.Draw();
		//GUI.EndGroup();
	}

	public function OnPopOver(): void {
		mc_boost.Clear();
		ava_mc_boost.Clear();
	}
	
	public function Clear()
	{
		mc_boost.Clear();
		ava_mc_boost.Clear();
	}
	
	public function Update()
	{
		switch(boostType)
		{
		case BOOST_TYPE.NORMAL:
			mc_boost.Update();
			break;
		case BOOST_TYPE.AVA:
			ava_mc_boost.Update();
			break;
		}
	}
	
	public function updateData(martch_type:int)
	{
		switch(boostType)
		{
		case BOOST_TYPE.NORMAL:
			mc_boost.updateData(martch_type);
			break;
		case BOOST_TYPE.AVA:
			ava_mc_boost.updateData(martch_type);
			break;
		}
	}
	
	public function SetBoostType(_boostType:BOOST_TYPE)
	{
		boostType = _boostType;
	}
	
	public function SetBuffCallback(callback : System.Action.<String>)
	{
		switch(boostType)
		{
		case BOOST_TYPE.NORMAL:
			mc_boost.SetBuffCallback(callback);
			break;
		case BOOST_TYPE.AVA:
			ava_mc_boost.SetBuffCallback(callback);
			break;
		}
	}
	public function handleNotification(type:String, body:Object):void
	{
		switch(type)
		{
			case Constant.Notice.PVE_MARCH_BEGIN:
			case Constant.Notice.SEND_MARCH:
			
				if(MenuMgr.instance.getMenu("MarchBoostComplex") != null)
				{
					MenuMgr.getInstance().PopMenu("MarchBoostComplex");
				}
				
				//March.instance().addPveQueueItem();
				break;
    	}
    }

	function OnNextBtnClick():void
	{
		if(MarchDataManager.instance().IsDefaultType())
		{
		  MenuMgr.getInstance().PopMenu("");
          MenuMgr.instance.sendNotification (Constant.Notice.SET_MARCH_BUFF,null);
		}
		else{
		   MarchDataManager.instance().SendMarch();
    	}
	}
	public function setOneTimeBuffs(buffs : String)
    {
		_Global.LogWarning("setOneTimeBuffs"+buffs);
    	MarchDataManager.instance().oneTimeBuffs = buffs;
    }
	
}