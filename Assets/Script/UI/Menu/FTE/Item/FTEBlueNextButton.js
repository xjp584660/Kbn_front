public class FTEBlueNextButton extends SimpleButton
{
	
	public function Sys_Constructor()
	{
		super.Sys_Constructor();
		
		this.mystyle.normal.background = Resources.Load("Textures/UI/button/button_35_blue_normal");	
		this.mystyle.normal.textColor = Color(1,1,1,1);			
		this.mystyle.active.background = Resources.Load("Textures/UI/button/button_35_blue_down");				
		this.mystyle.active.textColor = Color(1,1,1,1);
		//"border":{"left":25, "top":0, "right":30, "bottom":0}
		this.mystyle.alignment = TextAnchor.MiddleCenter;
		this.mystyle.border.left = 25;
		this.mystyle.border.right = 30;
		this.mystyle.padding.left = -8;
		this.mystyle.padding.top = -5;
		
		this.rect.width = 120;
		this.rect.height = 59;
		
		
	}
	public function Init(evo:ElementVO):void
	{
		this.clickParam = FTEConstant.Action.Next;
		this.rect.x = evo.getInt("rect.x");
		this.rect.y = evo.getInt("rect.y");
		
		if(evo.getInt('rect.width') > 0)
			this.rect.width = evo.getInt("rect.width");
			
		if(evo.getInt('rect.height') > 0)
			this.rect.height = evo.getInt("rect.height");
		//
		
	}

}