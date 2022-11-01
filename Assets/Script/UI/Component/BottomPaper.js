public class BottomPaper extends UIObject
{
	public var bgMiddleBodyPic:Tile;
	public var bgStartY:int = 0;

	public function Init()	
	{
		bgStartY = 0;
	//	bgMiddleBodyPic = Resources.Load("Textures/UI/decoration/ui_paper_bottom");	
		var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottom",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottom");	
	//	bgMiddleBodyPic.spt = TextureMgr.instance().BackgroundSpt();
		bgMiddleBodyPic.rect = new Rect(0, 0, rect.width, rect.height);//bgMiddleBodyPic.spt.GetTileRect("ui_paper_bottom");
		//bgMiddleBodyPic.name = "ui_paper_bottom";
		//bgMiddleBodyPic.spt.edge = 2;
//		rectReseted();		
	}
	
//	public function rectReseted():void
//	{
//		repeatTimes = (rect.height -1) / bgMiddleBodyPic.rect.height + 1;	
//	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);		
			//DrawMiddleBg(rect.width);
			bgMiddleBodyPic.Draw();
		GUI.EndGroup();
	}
//	protected var a:int;
//	protected var repeatTimes:int;
	
//	protected function DrawMiddleBg(width:int):void
//	{
//		for(a = 0; a < repeatTimes - 1; a++)
//		{
//			bgMiddleBodyPic.rect = Rect(0,bgStartY + a * bgMiddleBodyPic.rect.height, width, bgMiddleBodyPic.rect.height);
//			bgMiddleBodyPic.Draw(Rect(0,bgStartY + a * bgMiddleBodyPic.rect.height, width, bgMiddleBodyPic.rect.height), true);
//			GUI.DrawTexture(Rect(0,bgStartY + a * bgMiddleBodyPic.height, width, bgMiddleBodyPic.height), bgMiddleBodyPic);
//		}	
//		bgMiddleBodyPic.spt.edge = 4;
//		bgMiddleBodyPic.Draw(Rect(0,bgStartY + (repeatTimes - 1)* bgMiddleBodyPic.rect.height - 1, width, bgMiddleBodyPic.rect.height),false);
//		bgMiddleBodyPic.spt.edge = 2;
//	}
}
