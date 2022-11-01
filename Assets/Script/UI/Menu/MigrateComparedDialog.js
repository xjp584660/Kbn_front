import System.Reflection;

public class ComparedData
{
	public var callBack : function() : void;
	public var msgTxt : String;
}

class MigrateComparedDialog extends PopMenu
{
	public var msgLabel:Label;
	public var btnConfirm:Button;
	public var btnCancel:Button;
	public var bgMenu : BGMenu;
	public var l_bg:Label;
	public var _callBack : Function;
	
	public function Init():void
	{		
		super.Init();
		bgMenu.Init();
		bgMenu.m_color = new Color(1, 1, 1, 0.8);
		btnConfirm.OnClick = OnConfirmClick;
		btnCancel.OnClick = OnCancelClick;
		btnClose.OnClick = 	OnCloseClick;
		
		btnConfirm.txt = Datas.getArString("paymentLabel.ok");
		btnCancel.txt = Datas.getArString("paymentLabel.cancel");
        //msgLabel.txt = Datas.getArString("Migrate.ChooseServer_HaveAccount");
        var img:Texture2D = TextureMgr.instance().LoadTexture("ui_paper_bottomSystem",TextureType.BACKGROUND);
		bgMiddleBodyPic = TileSprite.CreateTile(img, "ui_paper_bottomSystem");
	}
	
	public function DrawItem()
	{		
		msgLabel.Draw();
		btnClose.Draw();
		btnConfirm.Draw();
		btnCancel.Draw();
	}
	
	function OnPush(param:Object)
	{
		_callBack = null;
		var paramDat : ComparedData = param as ComparedData;
		msgLabel.txt = paramDat.msgTxt;
		_callBack = paramDat.callBack;
		
		rect.x = (MenuMgr.SCREEN_WIDTH - rect.width) /2;
		rect.y = (MenuMgr.SCREEN_HEIGHT - rect.height) /2;
        
		var texMgr : TextureMgr = TextureMgr.instance();
		var iconSpt : TileSprite = texMgr.IconSpt();
		if ( iconSpt == null )
			return;
		frameSimpleLabel.useTile = true;
		frameSimpleLabel.tile = iconSpt.GetTile("popup1_transparent");		
	}
	
	public function OnPop()
	{
		super.OnPop();
	}
	
	public function setLayout(wid:int,hgt:int):void
	{
		if(wid <= 0)
			wid = this.rect.width;
			
		this.rect.width = wid;
		this.rect.height = hgt;
		
		l_bg.rect.width = wid - l_bg.rect.x * 2;	// 10
		l_bg.rect.height = hgt - l_bg.rect.y * 2;	//10

		rect.x = (MenuMgr.SCREEN_WIDTH - rect.width)/2;
		rect.y = (MenuMgr.SCREEN_HEIGHT - rect.height)/2;					
	}
	
	public function OnCloseClick()
	{
		MenuMgr.getInstance().PopMenu("");
 	}
 		
 	public function OnConfirmClick()
 	{
 		MenuMgr.getInstance().PopMenu("");
 		if(_callBack != null)
 		{
 			_callBack();
 		}
 	}

 	public function OnCancelClick()
 	{
 		MenuMgr.getInstance().PopMenu("");
 	}
}