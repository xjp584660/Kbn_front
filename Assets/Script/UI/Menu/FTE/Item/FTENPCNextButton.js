public class FTENPCNextButton extends FTEActionButton
{
	protected var texture:Texture2D;
	protected var dtime:double;
	protected var tX:int;
	protected var tY:int;
	private var shakeTime:float;

	public function setshakeTime(time:float):void
	{
		shakeTime = time;
	}

	public function Init():void
	{
		rect.width = 320;
		rect.height = 320;
		
		texture = TextureMgr.instance().LoadTexture("arrow1", TextureType.FTE);//Resources.Load("Textures/UI/FTE/arrow1"); //TODO..
		dtime = 0;
		tY = (rect.height - texture.height); 
	}
	
	public function Update():void
	{
		dtime += Time.deltaTime;
		if(dtime > 2)
			dtime -= 2;		
		tX = rect.width - texture.width;
		
		if(dtime < 1)
			tX = tX + (dtime - 1) * 20;
		else
			tX = tX - (dtime - 1) * 20;
		
	}
	
	public function FixedUpdate():void
	{
		
	}
	
	public function Draw()
	{
		if(!visible)
			return;
		super.Draw();
		GUI.BeginGroup(rect);
			//
			this.drawTexture(texture,tX,tY);
		GUI.EndGroup();
	}
}
