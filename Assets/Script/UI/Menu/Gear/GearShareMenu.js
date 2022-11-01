import System;

public class GearShareMenu extends ComposedMenu implements IEventHandler
{
public var bgFrame:Label;
public var closeBtn:Button;
public var messageLabel:Label;
public var sharePhoto:Label;
public var logoPhoto:Label;
public var okBtn:Button;
public var cancelBtn:Button;

private var backRect:Rect;

public function Init()
{
	super.Init();
	var texMgr : TextureMgr = TextureMgr.instance();
	bgFrame.useTile = true;
	bgFrame.tile = texMgr.IconSpt().GetTile("popup1_transparent");
	closeBtn.OnClick = CloseMenu;
	okBtn.OnClick=OnOk;
	cancelBtn.OnClick=CloseMenu;
	okBtn.txt=Datas.getArString("Common.OK_Button");
	cancelBtn.txt=Datas.getArString("Common.Cancel_Button");
	messageLabel.txt=Datas.getArString("Gear.ShareFaceText");

}
	
public function OnPush(param:Object)
{
	super.OnPush(param);
	showIphoneXFrame=false;
	var texMgr : TextureMgr = TextureMgr.instance();
	var img:Texture2D = texMgr.LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
	bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
	backRect = Rect( 5, 5, rect.width, rect.height - 10);
	var texture:Texture = GameMain.instance().GetGearShareTexture();
	if(texture!=null){
		sharePhoto.mystyle.normal.background = texture;
	}
	
}

public function handleNotification(type:String, body:Object):void
{
	switch(type)
		{
//			case "XX":
//				refreshData();
//				break;
//			
		}			
}

public function CloseMenu(param:Object)
{
	MenuMgr.getInstance().PopMenu("");
}

public function OnOk(param:Object)
{
	MenuMgr.getInstance().PopMenu("");
	MenuMgr.instance.sendNotification(Constant.Notice.ShowGearLoading, "");
	GameMain.instance().ShareFBPhoto();
}



public function DrawItem()
{
	bgFrame.Draw();
	
	closeBtn.Draw();
	messageLabel.Draw();
	sharePhoto.Draw();
	logoPhoto.Draw();
	okBtn.Draw();
	cancelBtn.Draw();
	
	
}

function DrawBackground()
	{
		if(Event.current.type != EventType.Repaint)
			return;
		
		GUI.BeginGroup(backRect);
		DrawMiddleBg(rect.width - 22,6);
		prot_drawFrameLine();
		GUI.EndGroup();
	}


}