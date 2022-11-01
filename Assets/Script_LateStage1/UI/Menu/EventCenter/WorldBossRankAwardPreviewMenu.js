
public class WorldBossRankAwardPreviewMenu extends EventRankAwardPreviewMenu
{
	public var titleBg:Label;
	private var backGroundRect:Rect;
	public var frameLabel:SimpleLabel;
	
	public function Init(){
		super.Init();
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
		
		titleBg.txt = Datas.getArString("EventCenter.Awards");
		title.txt = "";
		
		description.rect.y = 100;
		prizeList.rect.y = 210;
	}
	
	public function OnPush(param:Object){
		super.OnPush(param);
		
	}
	
	public function DrawItem(){
		super.DrawItem();
		
		frameLabel.Draw();
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
}