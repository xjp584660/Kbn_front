class ToumamentRankItem extends FullClickItem
{
	public var lineUp:Label;
	public var label_FirstPic:Label;
	public var label_Rank:Label;
	public var label_Name:Label;
	public var label_Integration:Label;
	public var label_AllianceOfPlayer:Label;
	public var btn_Reward:Button;
	public var red_ribbon:Label;
	public static var playerName:String="";
	public static var myAllianceName:String="";
	private var r_MyAllianceId:long=-1;
	private var startRect=new Rect(525,-10.5,57.1,80.1);
	private var specialRect=new Rect(505,5,95,50);
	
	private var startBorder : RectOffset;
	private var specialBorder : RectOffset;
	private var m_bonus : HashObject;
	
	public function Init()
	{
		super.Init();
		btnDefault.rect = Rect(-40, 0, 700, 60);
        startBorder=new RectOffset(0,0,0,0);
        specialBorder=new RectOffset(30,30,0,0);
	}
	
	public function SetRowData(data:Object)
	{
		var seed:HashObject = GameMain.instance().getSeed();
		if( seed != null ) 
		{
			if( seed["player"]["allianceId"] != null ) 
			{
				r_MyAllianceId=_Global.INT32(seed["player"]["allianceId"].Value);
			}
		}
				
		
		//FontColor
		playerName=seed["players"]["u"+ Datas.instance().tvuid() ]["n"].Value;
		var tmpdata:ToumamentRankData = (data as ToumamentRankData);
		m_bonus = tmpdata.m_bonus;
		//playerName=tmpdata.r_Name;
		label_Rank.txt=tmpdata.r_position+"";
		label_Name.txt=ShortSpellString(tmpdata.r_Name+"");
		label_Integration.txt=tmpdata.r_Integration+"";
		label_AllianceOfPlayer.txt=ShortSpellString(tmpdata.r_AllianceOfPlayer+"");
		lineUp.setBackground("bg_line_bright",TextureType.DECORATION);
		
		btnDefault.SetVisible( true );
		btnDefault.OnClick = function(param:Object)
		{
			var id:HashObject = new HashObject({"Category":"Chest",
												"inShop":false,
												"bonus":m_bonus,
												"hasReward":false,
												"isAlliance":NoticePadMenu.isAllianRank
												});
			MenuMgr.getInstance().PushMenu("ChestDetail4IndividualProps", id, "trans_zoomComp");
		};
		
		if(	
		(playerName.Equals(tmpdata.r_Name)&&NoticePadMenu.isIndiviRank==true)
		||
		(r_MyAllianceId==tmpdata.r_AllianceIdOfPlayer&&NoticePadMenu.isAllianRank==true)&&(r_MyAllianceId!=-1)
		)//Yours Reward
		{
			red_ribbon.mystyle.normal.background = TextureMgr.instance().LoadTexture("ui_hero_tiao",TextureType.DECORATION);
			red_ribbon.visible=true;
			label_FirstPic.mystyle.normal.background = TextureMgr.instance().LoadTexture("gems_box",TextureType.DECORATION);
			label_FirstPic.visible=true;
			label_Rank.normalTxtColor=FontColor.Button_White;
			label_Name.normalTxtColor=FontColor.Button_White;
			label_AllianceOfPlayer.normalTxtColor=FontColor.Button_White;
			label_Integration.normalTxtColor=FontColor.Button_White;
			if(tmpdata.status==1)
			{
				btn_Reward.visible = true;
				btn_Reward.normalTxtColor=FontColor.Button_White;
				btn_Reward.changeToBlueNew();
				btn_Reward.txt=Datas.getArString("PVP.Event_Leaderboard_Claim");
				btn_Reward.rect=specialRect;
				btn_Reward.mystyle.border=specialBorder;
				btn_Reward.mystyle.normal.background = TextureMgr.instance().LoadTexture("button_60_blue_normal",TextureType.BUTTON);
				btn_Reward.mystyle.active.background = TextureMgr.instance().LoadTexture("button_60_blue_down",TextureType.BUTTON);

				btn_Reward.OnClick=function(param:Object)//64300,30001
				{
					var id:HashObject = new HashObject({"Category":"Chest",
														"inShop":false,
														"hasReward":true,
														"bonus":m_bonus,
														"acqBonusOccasion":"pvp",
														"isAlliance":NoticePadMenu.isAllianRank
														});
					MenuMgr.getInstance().PushMenu("ChestDetail4IndividualProps", id, "trans_zoomComp");
				};
			}
			else
			{
				btn_Reward.visible = false;
			}
			//btnDefault.SetVisible( false );
		}
		else
		{
			label_FirstPic.visible=false;
			red_ribbon.visible=false;
			label_Rank.normalTxtColor=FontColor.SmallTitle;
			label_Name.normalTxtColor=FontColor.SmallTitle;
			label_AllianceOfPlayer.normalTxtColor=FontColor.SmallTitle;
			label_Integration.normalTxtColor=FontColor.SmallTitle;
			btn_Reward.visible = false;
			//btnDefault.SetVisible( true );
		}
		
	}
	
	public function ShortSpellString(s:String):String
	{
		if(s.Length>=12)
		{
			s=s.Substring(0,10)+"...";
		}
		return s;
	}
	
	public function Draw()
	{
		if(!visible)
			return;
			
		
	   	GUI.BeginGroup(rect);
	   	if(red_ribbon.visible)
	   	{
	   		red_ribbon.Draw();
	   	}	
		lineUp.Draw();
		label_FirstPic.Draw();
		label_Rank.Draw();
		label_Integration.Draw();
		btn_Reward.Draw();
		if(NoticePadMenu.isIndiviRank==true)
		{
			label_AllianceOfPlayer.Draw();
		}
		label_Name.Draw();
		if(NoticePadMenu.isIndiviRank==true)
		{
			label_Name.rect.y=14.5;
		}
		else
		{
			label_Name.rect.y=5.5;
		}
		GUI.EndGroup();
		super.Draw();
	}
}