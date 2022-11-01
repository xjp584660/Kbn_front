public class PropItem extends ListItem
{
	public static var ACTION_USE :String = "use";
	public static var ACTION_BUY_USE:String = "buyuse";
	public static var ACTION_BUY :String = "buy";
	
	public var l_img 		:Label;
	public var l_title		:Label;
	public var l_description:Label;
	
	public var st1_btn_buyuse : Button;
	public var st1_l_price	  :Label;
	
	public var st2_btn_use 	: Button;
	public var st2_l_num 	:Label;
	public var st2_btn_buy 	:Button;
	

	protected var status:int = 0;
	
	public function Awake()
	{
		super.Awake();
		
		st1_btn_buyuse.OnClick = buttonHandler;
		st2_btn_buy.OnClick = buttonHandler;
		st2_btn_use.OnClick = buttonHandler;
		
		st1_btn_buyuse.clickParam = ACTION_BUY_USE;
		st2_btn_use.clickParam = ACTION_USE;
		st2_btn_buy.clickParam = ACTION_BUY;		
				
	}
	
	public function Draw()
	{
		GUI.BeginGroup(rect);
		
		l_img.Draw();
		l_title.Draw();
		l_description.Draw();
		switch(status)
		{
			case 0:
				st1_l_price.Draw();
				st1_btn_buyuse.Draw();
				break;
			case 1:
				st2_l_num.Draw();
				st2_btn_use.Draw();
				st2_btn_buy.Draw();
				break;
		}
		
		GUI.EndGroup();	
	}
	
	public function buttonHandler(param:String)
	{
		switch(param)
		{
			case ACTION_BUY:
				
				break;
			case ACTION_USE:
				
				break;
			case ACTION_BUY_USE:
				
				break;
		}
	}
	
	public function SetRowData(data:Object)
	{
		//......  second part..
		var pvo:PropVO = data as PropVO;
		l_title.SetFont(FontSize.Font_20,FontType.TREBUC);
		l_title.txt= pvo.name;
		l_description.txt = pvo.description;
		
		if(pvo.propNum > 0)
		{
			status = 1;
			st2_l_num.txt ="" +  pvo.propNum;
		}
		else
		{
			status = 0;
			st1_l_price.txt = "" + pvo.price;
		}
	}
}
