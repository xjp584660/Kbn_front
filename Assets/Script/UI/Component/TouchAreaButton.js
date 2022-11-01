public class TouchAreaButton extends Button
{
	//public var alpha:float = 0.4;
	
	public function Init()
	{
		/*
		this.mystyle.normal.background = Resources.Load("Textures/UI/background/a_0_square");
		this.mystyle.active.background = Resources.Load("Textures/UI/background/square_black");
		this.mystyle.border.left = 14;
		this.mystyle.border.right = 14;
		this.mystyle.border.top = 14;
		this.mystyle.border.bottom = 14;
		*/
		
		alpha = 0.4;
	}
	
	public function Draw()
	{
		var oldColor:Color = GUI.color;
		GUI.color = new Color(0, 0, 0, alpha);	
		super.Draw();
		GUI.color = oldColor;		
	}
}