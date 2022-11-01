public class Info2_Main_View extends UIObject
{
	@SerializeField private var info2_main :Info2_Main;
	@SerializeField private var scrollView :ScrollView;
	
	public function Init(buttonHandler :System.MulticastDelegate)
	{
		info2_main.Init();
		
		info2_main.btn_leave.OnClick = buttonHandler;
		info2_main.btn_leave.clickParam = "IM_LEAVE";
		info2_main.btn_message.OnClick = buttonHandler;
		info2_main.btn_message.clickParam = "IM_MESSAGE";
		
		info2_main.sv_b_ib1.nextHandler = buttonHandler;
		info2_main.sv_b_ib2.nextHandler = buttonHandler;
		info2_main.sv_b_ib3.nextHandler = buttonHandler;
		info2_main.sv_b_ib4.nextHandler = buttonHandler;
		info2_main.sv_b_ib5.nextHandler = buttonHandler;
		info2_main.sv_b_ib6.nextHandler = buttonHandler;
		info2_main.sv_b_ib1.clickParam = "IB1";
		info2_main.sv_b_ib2.clickParam = "IB2";
		info2_main.sv_b_ib3.clickParam = "IB3";
		info2_main.sv_b_ib4.clickParam = "IB4";
		info2_main.sv_b_ib5.clickParam = "IB5";
		info2_main.sv_b_ib6.clickParam = "IB6";

		scrollView.clearUIObject();
		scrollView.Init();
		scrollView.ActRect = this.rect;
		scrollView.addUIObject(info2_main);
		scrollView.AutoLayout();
		scrollView.MoveToTop();
	} 
	
	public function Update()
	{
		scrollView.Update();
		info2_main.Update();
	}
	
	public function showAllianceInfo(avo:AllianceVO):void
	{
		info2_main.showAllianceInfo(avo);
	}
	
	public function Clear()
	{
		info2_main.Clear();
		scrollView.clearUIObject();
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		scrollView.Draw();
		GUI.EndGroup();
	}
	
	public function OnBack(preMenuName:String):void
	{
		info2_main.OnBack(preMenuName);
	}
}