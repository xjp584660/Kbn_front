public class MarchConfirmDialog extends PopMenu
{
	public var btnConfirm:Button;
	public var btnCancel:Button;
	public var m_msg:Label;
	public var l_img:Label;
	
	private var func_ok:Function;
	
	public function Init():void
	{
		super.Init();
		btnCancel.OnClick = close;
		btnConfirm.OnClick = handlerConfirmClick;
		
		btnCancel.txt = Datas.getArString("March.newUserDontAttack");
		btnConfirm.txt = Datas.getArString("March.newUserAttackAnyways");
	
		l_img.useTile = true;
		l_img.tile = TextureMgr.instance().ElseIconSpt().GetTile("drust");
		//l_img.tile.name = "drust";
	}
	
	public function OnPush(param:Object):void
	{
		
	}
	
	public function SetContent(msg:String,okFunc:Function):void
	{
		m_msg.txt = msg;
		func_ok = okFunc;
	}
	
	
	private function handlerConfirmClick(param:Object):void
	{
		this.close();
		if(func_ok != null)
			func_ok();
	}
	
	public function DrawItem()
	{
		btnClose.Draw();
		l_img.Draw();
		m_msg.Draw();
		btnConfirm.Draw();
		btnCancel.Draw();
	
	}
	

}
