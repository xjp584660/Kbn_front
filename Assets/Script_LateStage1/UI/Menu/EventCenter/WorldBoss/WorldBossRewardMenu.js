

public class WorldBossRewardMenu extends PopMenu{
	
	public var titleBg:Label;
	public var titleBg2:Label;
	public var scroll:ScrollView;
	public var frameLabel:SimpleLabel;
	
	public var item:WorldBossRankRewardItem;
	private var backGroundRect:Rect;

	public function Init(){
		super.Init();
		scroll.Init();		
	}

	public function OnPush(param:Object){
		super.OnPush(param);
		var dataList=_Global.GetObjectValues(param);

		for (var i = 0; i < dataList.length; i++) {
			
			var reward:WorldBossRankRewardItem=GameObject.Instantiate(item) as WorldBossRankRewardItem;
			reward.Init();
			reward.SetRowData(dataList[i]);
			scroll.addUIObject(reward);
			//scroll.SetItemAutoScale(reward);
		}	

		scroll.AutoLayout();
 		scroll.MoveToTop();
		titleBg.txt=Datas.getArString("AVA.Reward_Preview_Title");

		var texMgr : TextureMgr = TextureMgr.instance();
		var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
		repeatTimes = (rect.height - 15)/bgMiddleBodyPic.rect.height +1;
		
		bgStartY = 31;
		
		backGroundRect = Rect( 5, 5, rect.width, rect.height - 10);
		
		frameLabel.Sys_Constructor();
		frameLabel.mystyle.border = new RectOffset(68, 68, 68, 68);
		frameLabel.useTile = true;
		var iconSpt : TileSprite = texMgr.IconSpt();
		frameLabel.tile = iconSpt.GetTile("popup1_transparent");
		frameLabel.rect = frameSimpleLabel.rect;
		frameLabel.rect.y = frameLabel.rect.y + bgStartY;
		frameLabel.rect.height = frameLabel.rect.height - bgStartY;
		
		frameSimpleLabel.useTile = false;
		btnClose.rect.y = 25;
	}

	public function Draw(){
		super.Draw();	
		
//		titleBg2.Draw();
//		scroll.Draw();
//		//titleBg.rect.y=titleBg2.rect.y+50;
//		titleBg.Draw();	
	}

	public function DrawItem(){
		// title.Draw();
		
		frameLabel.Draw();
		titleBg2.Draw();
		scroll.Draw();
		//titleBg.rect.y=titleBg2.rect.y+50;
		titleBg.Draw();
	}
	
	function DrawBackground()
	{
		if(Event.current.type != EventType.Repaint)
			return;
		
		GUI.BeginGroup(backGroundRect);
		DrawMiddleBg(rect.width - 22,6);
		prot_drawFrameLine();
		GUI.EndGroup();
	}

	public function Update(){
 		scroll.Update();
 		
 	}

 	public function OnPopOver(){
 		scroll.clearUIObject();
 	}
}