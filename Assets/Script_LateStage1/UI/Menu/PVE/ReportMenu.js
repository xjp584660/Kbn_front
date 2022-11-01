class ReportMenu extends PopMenu
{
	@SerializeField private var darkBack:Label;
	
	@SerializeField private var line:Label;
	@SerializeField private var star1:Label;
	@SerializeField private var star2:Label;
	@SerializeField private var star3:Label;
	
	@SerializeField private var score:Label;
	
	@SerializeField private var efficienceIcon1:Label;
	@SerializeField private var vitalityIcon1:Label;
	@SerializeField private var timeIcon1:Label;
	@SerializeField private var cupIcon1:Label;
	
	@SerializeField private var efficienceIcon2:Label;
	@SerializeField private var vitalityIcon2:Label;
	@SerializeField private var timeIcon2:Label;
	@SerializeField private var cupIcon2:Label;
	
	@SerializeField private var efficienceNum:Label;
	@SerializeField private var vitalityNum:Label;
	@SerializeField private var timeNum:Label;
	
	@SerializeField private var lastEfficience:Label;
	@SerializeField private var lastVitality:Label;
	@SerializeField private var lastTime:Label;
	
	@SerializeField private var efficienceScore:Label;
	@SerializeField private var vitalityScore:Label;
	@SerializeField private var timeScore:Label;
	
	@SerializeField private var lastBattle:Label;
	@SerializeField private var lastScore:Label;
	@SerializeField private var lastScoreTxt:Label;
	
	@SerializeField private var scoreLine1:Label;
	@SerializeField private var scoreLine2:Label;
	@SerializeField private var scoreLine3:Label;
	@SerializeField private var scoreLine4:Label;
	
	//
	@SerializeField private var topFram :SimpleLabel;
	@SerializeField private var circle1 :SimpleLabel;
	@SerializeField private var circle2 :SimpleLabel;
	@SerializeField private var circle3 :SimpleLabel;
	@SerializeField private var roundBack :SimpleLabel;
	@SerializeField private var lightBack :SimpleLabel;
	@SerializeField private var belt :SimpleLabel;
	@SerializeField private var bottomDesc :SimpleLabel;
	
	@SerializeField private var myAlpha:float;
	@SerializeField private var circleAlpha:float = 0.5f;
	
	private var levelID:int;
	private var data:KBN.PveLevelData;
	
	public function Init():void
	{
		super.Init();
		
		darkBack.Init();
		
		btnClose.Init();
		btnClose.OnClick = handleBack;
		title.Init();
		
		line.Init();
		star1.Init();
		star2.Init();
		star3.Init();
		
		score.Init();
		
		efficienceIcon1.Init();
		vitalityIcon1.Init();
		timeIcon1.Init();
		
		efficienceIcon2.Init();
		vitalityIcon2.Init();
		timeIcon2.Init();
		
		lastEfficience.Init();
		lastVitality.Init();
		lastTime.Init();
		
		efficienceScore.Init();
		vitalityScore.Init();
		timeScore.Init();
		
		lastBattle.Init();
		lastScore.Init();
		
		efficienceNum.Init();
		vitalityNum.Init();
		timeNum.Init();
		
		scoreLine1.Init();
		scoreLine2.Init();
		
		darkBack.setBackground("Brown_Gradients2",TextureType.DECORATION);
//		darkBack.txt = "Last Battle";
		
		line.setBackground("between line",TextureType.DECORATION);
		
		efficienceIcon1.setBackground("report-tactics",TextureType.DECORATION);
		vitalityIcon1.setBackground("report-courage",TextureType.DECORATION);
		timeIcon1.setBackground("report-speed",TextureType.DECORATION);
		cupIcon1.useTile = true;
		cupIcon1.tile = TextureMgr.instance().ElseIconSpt().GetTile("trophy");
//		cupIcon1.setBackground("icon_trophy",TextureType.ICON_ELSE);// icon_trophy
		
		efficienceIcon2.setBackground("report-tactics",TextureType.DECORATION);
		vitalityIcon2.setBackground("report-courage",TextureType.DECORATION);
		timeIcon2.setBackground("report-speed",TextureType.DECORATION);
		cupIcon2.setBackground("cup_new-record",TextureType.DECORATION);
		
		
		scoreLine1.setBackground("between line_list_small",TextureType.DECORATION);
		scoreLine2.setBackground("between line_list_small",TextureType.DECORATION);
		scoreLine3.setBackground("between line_list_small",TextureType.DECORATION);
		scoreLine4.setBackground("between line_list_small",TextureType.DECORATION);
		
		title.txt = Datas.getArString("Campaign.Level_Record_Title");//"REPORT";
		lastBattle.txt = Datas.getArString("Campaign.Level_Record_Subtitle1");//"last battle";
		
		lastEfficience.txt = Datas.getArString("Campaign.Level_Record_Text4");//"Efficience";
		lastVitality.txt = Datas.getArString("Campaign.Level_Record_Text3");//"Vitality";
		lastTime.txt = Datas.getArString("Campaign.Level_Record_Text2");//"Time";
		bottomDesc.txt = Datas.getArString("Campaign.Level_Record_Tip");//"Tactics:The fewer troops died,thehigher tactics Courage:the fewer troops sent,the higher courage Speed:the fewer march time,the higher speed");//

		topFram.mystyle.normal.background = TextureMgr.instance().LoadTexture("Quest_kuang",TextureType.DECORATION);
		circle1.mystyle.normal.background = TextureMgr.instance().LoadTexture("Type_ring_dark",TextureType.DECORATION);
		circle2.mystyle.normal.background = TextureMgr.instance().LoadTexture("Type_ring_dark",TextureType.DECORATION);
		circle3.mystyle.normal.background = TextureMgr.instance().LoadTexture("Type_ring_dark",TextureType.DECORATION);
		roundBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("report-cup-bg",TextureType.DECORATION);
		lightBack.mystyle.normal.background = TextureMgr.instance().LoadTexture("payment_light",TextureType.DECORATION);
		belt.mystyle.normal.background = TextureMgr.instance().LoadTexture("Event_mytiao",TextureType.DECORATION);
		topFram.txt = Datas.getArString("Campaign.Level_Record_Subtitle3");//"My Record";
	}
	
	public function DrawItem()
	{
		topFram.Draw();
		roundBack.Draw();
		lightBack.Draw();
		cupIcon1.Draw();
		belt.Draw();
		
		var oldAlpha:float = GUI.color.a;
		GUI.color.a = circleAlpha;	
			circle1.Draw();
			circle2.Draw();
			circle3.Draw();
		GUI.color.a = oldAlpha;
		
		oldAlpha = GUI.color.a;
		GUI.color.a = myAlpha;
			darkBack.Draw();
		GUI.color.a = oldAlpha;
		
		line.Draw();
		star1.Draw();
		star2.Draw();
		star3.Draw();
		
		score.Draw();
		
		efficienceIcon1.Draw();
		vitalityIcon1.Draw();
		timeIcon1.Draw();
		
		efficienceIcon2.Draw();
		vitalityIcon2.Draw();
		timeIcon2.Draw();
		cupIcon2.Draw();
		
		lastEfficience.Draw();
		lastVitality.Draw();
		lastTime.Draw();
		
		efficienceScore.Draw();
		vitalityScore.Draw();
		timeScore.Draw();
		
		lastBattle.Draw();
		lastScore.Draw();
		lastScoreTxt.Draw();
		
		efficienceNum.Draw();
		vitalityNum.Draw();
		timeNum.Draw();
		
		scoreLine1.Draw();
		scoreLine2.Draw();
		scoreLine3.Draw();
		scoreLine4.Draw();
		
		bottomDesc.Draw();
	}
	
	function Update() 
	{
	}
	
	public function OnPush(param:Object)
	{
		var hash:HashObject = param as HashObject;
		if(hash == null)return;
		levelID = _Global.INT32(hash["levelID"]);
		data = KBN.PveController.instance().FindLeveData(levelID) as KBN.PveLevelData;
		if(data != null)
		{
			score.txt = String.Format(Datas.getArString("Campaign.Level_Record_Subtitle2"), data.highestScore);
		
			efficienceNum.txt = data.highestSpeed+"";
			vitalityNum.txt = data.highestVitality+"";
			timeNum.txt = data.highestTactics+"";
			
			lastScore.txt = Datas.getArString("Campaign.Level_Record_Text1");
			lastScoreTxt.txt = data.lastScore+"";
			
			efficienceScore.txt = data.lastSpeed+"";
			vitalityScore.txt = data.lastVitality+"";
			timeScore.txt = data.lastTactics+"";
			
			star1.useTile = true;
			star2.useTile = true;
			star3.useTile = true;
			var texMgr : TextureMgr = TextureMgr.instance();
			var iconSpt : TileSprite = texMgr.IconSpt();
			var starTile : Tile = iconSpt.GetTile("button_star_chapter");
			var blackTile : Tile = iconSpt.GetTile("bossinfo-blackstar");
			star1.tile = data.highestStar>=1?starTile:blackTile;
			star2.tile = data.highestStar>=2?starTile:blackTile;
			star3.tile = data.highestStar>=3?starTile:blackTile;
		}
	}
	
	public function OnPop()
	{
		super.OnPop();
	}
	
	public function OnPopOver()
    {
        super.OnPopOver();
    }
	
	private function handleBack():void
	{
		MenuMgr.getInstance().PopMenu("ReportMenu");
		//MenuMgr.getInstance().PushMenu("PveLeaderboardMenu", null, "trans_zoomComp");
	}
	
	function getTestDate():Hashtable
	{
		var testData:Hashtable = {
			"curScore":5677299,
			"lastScore":123455,
			"efficienceScore":241,
			"vitalityScore":241,
			"timeScore":241,
			"efficienceNum":12,
			"vitalityNum":12,
			"timeNum":12
		};
		
		return testData;
	}
}