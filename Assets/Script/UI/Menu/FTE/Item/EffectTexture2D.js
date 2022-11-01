public class EffectTexture2D extends EffectElement
{	
	public var fromX:int;
	public var toX:int;
	
	protected var texture :Texture2D;
	
	public function Init(evo:ElementVO):void
	{
		startTime = evo.getFloat("startTime");
		endTime = evo.getFloat("endTime");	
		fromX = evo.getInt("fromX");
		toX = evo.getInt("toX");		
		this.totalTime = endTime;		
		rect.x = fromX;
		this.texturePath = evo.getString("texturePath");
		
		if(evo.getInt("height") )
		{
			rect.height = evo.getInt("height");			
		}
		rect.y = MenuMgr.SCREEN_HEIGHT - rect.height;
//		texture = TextureMgr.instance().LoadTexture(evo.getString("npcPath"), TextureType.FTE);
	}
	
	public function Draw()
	{
//		GUI.BeginGroup(rect);		
//		this.drawTexture(texture,0,0);
		GUI.DrawTexture(rect,texture);
//		GUI.EndGroup();

//		GUI.Label(rect,texture);
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
	
	protected function doEffect(percent:float):void
	{
		rect.x = fromX * (1 - percent) + toX * percent;	
	}
	
}
