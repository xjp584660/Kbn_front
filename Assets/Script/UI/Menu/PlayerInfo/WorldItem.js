class WorldItem extends ListItem
{

	@Space(30) @Header("---------- WorldItem ----------") 
	public var playerName:Label;
	public var time:Label;
	public var worldInfo:WorldInfo;
	public var curWorld:Label;
	private var bCurWorld:boolean;
	public var toggle : ToggleButton;
	public var seperateLine:Label;
	public var population:Label;
	public var capactityPre:Label;
	public var lbManHere : Label;
	public var l_Merging : Label;
	
	public function Init()
	{
		btnSelect.Init();
		capactityPre.Init();
		title.Init();
		curWorld.Init();
		population.Init();
	}
	
	public function SetRowData(data:Object)
	{
		var texMgr : TextureMgr = TextureMgr.instance();
//		var arStrings:Object = Datas.instance().arStrings();
		worldInfo = data as WorldInfo;
		title.SetFont(FontSize.Font_20,FontType.TREBUC);
		var clipWidth : float = title.rect.width;
		var clippedText : String = _Global.GUIClipToWidth(title.mystyle, worldInfo.worldName, clipWidth, "...", null);
		title.txt = clippedText;
		playerName.SetFont();
		playerName.txt = _Global.GUIClipToWidth(playerName.mystyle, worldInfo.playerName, playerName.rect.width, "...", null);
		time.txt = worldInfo.worldDate;
		bCurWorld =	( worldInfo.worldId == Datas.instance().worldid() );
		curWorld.txt = Datas.getArString("Common.CurrentWorld");
		capactityPre.txt = Datas.getArString("ChangWorld.Capacity") + ":";
		capactityPre.SetFont(FontSize.Font_18, FontType.TREBUC);
		l_Merging.txt = Datas.getArString("ServerMerge.Merging");
		
		if(worldInfo.playerName != null)
			btnSelect.txt = Datas.getArString("Common.Return");
		else
			btnSelect.txt = Datas.getArString("Common.Create");	
		btnSelect.OnClick = ReturnWorld;
		
		icon.mystyle.normal.background = texMgr.LoadTexture("w_51_4_1",TextureType.MAP17D3A_TILE);
		lbManHere.Init();
		lbManHere.mystyle.normal.background = texMgr.LoadTexture("Landmarks", TextureType.DECORATION);

		switch(worldInfo.population)
		{
			case 0:
				population.txt = Datas.getArString("ChangWorld.CapacityLow");
				population.SetNormalTxtColor(FontColor.Pure_Green);//mystyle.normal.textColor = Color(0,1,0,1);
				
				break;
			case 1:
				population.txt = Datas.getArString("ChangWorld.CapacityMedian");
				population.SetNormalTxtColor(FontColor.Yellow);//mystyle.normal.textColor = Color(1,1,0,1);
				break;
			case 2:
				population.txt = Datas.getArString("ChangWorld.CapacityHigh");
				population.SetNormalTxtColor(FontColor.Red);//mystyle.normal.textColor = Color(248.0/255.0,26.0/255.0,26.0/255.0,1);
				break;
		}
		var populationleft:float = capactityPre.rect.x + capactityPre.GetWidth() + 5;
		population.rect.x = populationleft;
	}
	
	public function Draw()
	{
		if (!visible) return;


		GUI.BeginGroup(rect);
		icon.Draw();
		capactityPre.Draw();
		population.Draw();
		title.Draw();
		playerName.Draw();
		time.Draw();
	//	toggle.Draw();
		seperateLine.Draw();
		if(worldInfo!=null && worldInfo.isMerging)
		{
			l_Merging.Draw();
		}
		else if(!bCurWorld)
		{
			btnSelect.Draw();
		}
		else
		{
			curWorld.Draw();
			lbManHere.Draw();
		}
		GUI.EndGroup();
	   	return -1;
	}
	
	function UpdateData()
	{
		if( bCurWorld )
		{
			var seed:HashObject = GameMain.instance().getSeed();
			playerName.txt = seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value;
			playerName.txt = _Global.GUIClipToWidth(playerName.mystyle, playerName.txt, playerName.rect.width, "...", null);
		}
	}
	
	private function ReturnWorld(param:Object)
	{
		if(worldInfo.isTest == false)
		{
			UnityNet.signup(worldInfo.worldId, SwitchWorldOk,null);	
		}
		else
		{
			var dialog:ConfirmDialog = MenuMgr.getInstance().getConfirmDialog();
			dialog.setLayout(600,460);
			dialog.setTitleY(40);
			dialog.setContentRect(70,140,0,460);
			dialog.setDefaultButtonText();
			var content:String = Datas.instance().getArString("SpeciallWorld.Entrance_Desc");
			var title:String = Datas.instance().getArString("SpeciallWorld.Entrance_Title");
			MenuMgr.getInstance().PushConfirmDialog(content,title,function(){
				UnityNet.signup(worldInfo.worldId, SwitchWorldOk,null);	
			},null);
		}
	}
	
	private function EnterNewWorld(param:Object)
	{		
		UnityNet.signup(worldInfo.worldId, SwitchWorldOk,null);	
	}
	
	private function SwitchWorldOk()
	{

		/*------------------------------------------------------------*/
		/* 事件：用户登出 （角色退出游戏时上报（杀进程、切换角色、重新读loading条、切到后台）） */

		ThinkingAnalyticsManager.Instance.EndTimeTrackEvent("logout");
		/*------------------------------------------------------------*/

		NativeCaller.RoleLogout(Datas.instance().tvuid().ToString());
		Datas.instance().setWorldid(worldInfo.worldId);
		GameMain.instance().restartGame();
	}
}

