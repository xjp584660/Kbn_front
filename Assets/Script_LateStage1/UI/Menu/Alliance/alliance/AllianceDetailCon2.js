public class AllianceDetailCon2 extends ComposedUIObj
{
	
	public var nav_head :NavigatorHead;
	public var detail 	:AllianceDetail;
	public var btn_send	:Button;
	public var l_bottom	:Label;
	
	
	public function Init()
	{
		detail.Init();
		nav_head.Init();
//		detail.Init();
		nav_head.titleTxt = Datas.getArString("Common.Details");
		btn_send.txt = Datas.getArString("Alliance.MessageLeader");
		nav_head.updateBackButton();
	}
	
	public function Draw()
	{
		super.Draw();
	}
	
	
	
	public function DrawBackGround():void
	{
		
	}
}