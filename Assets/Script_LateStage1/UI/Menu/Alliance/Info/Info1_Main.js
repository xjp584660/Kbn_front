public class Info1_Main extends ComposedUIObj
{
	public var texture_line:Texture2D;
	public var TL_Y:int = 230;
	public var TL_V:int = 100;
	public function Draw()
	{	
//		GUI.DrawTexture(Rect(10,TL_Y,620,10),texture_line,ScaleMode.StretchToFill,false,62);
		GUI.BeginGroup(rect);
		this.drawTexture(texture_line,10,TL_Y, 620,4 );
		this.drawTexture(texture_line,10,TL_Y + TL_V, 620,4 );
		this.drawTexture(texture_line,10,TL_Y + 2*TL_V, 620,4 );
		GUI.EndGroup();
		
		super.Draw();
	}
	
	
}