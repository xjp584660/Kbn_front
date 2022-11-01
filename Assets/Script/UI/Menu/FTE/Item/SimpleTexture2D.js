public class SimpleTexture2D extends UIElement
{
	protected var texture:Texture2D;
	
	public function Draw()
	{
//		GUI.BeginGroup(rect);		
//		this.drawTexture(texture,0,0);
		if(texture)
			GUI.DrawTexture(rect,texture);
//		GUI.EndGroup();
	}
	
	public function set texturePath(value:String)
	{
		texture = TextureMgr.instance().LoadTexture(value, TextureType.FTE);//Resources.Load(value);		
		if(texture)
		{
			rect.width = texture.width;
			rect.height = texture.height;
		}
	}
	
	public function setWH(w:int,h:int):void
	{
		if(w > 0)
			rect.width = w;
		if(h > 0)
			rect.height = h;
	}
	

}