public class HandView extends UIElement
{
	private var m_getRect : function() : Rect;

	public var hand:Texture2D;
	public var hx:int;
	public var hy:int;
	public var pos:int ; // 0: right 1: up 2:left 3:bottom
	public var dtime:double;
	
	// f(time) = dp + xxx.
	public var dp:int;
	public var loopTime:float = 1.0;
	public var dt:float;
	
	protected var TX:int;
	protected var TY:int;
	public function Sys_Constructor():void
	{
		
	}
	
	public function Init(evo:ElementVO):void
	{	
		this.rect = evo.rect;
		this.m_getRect = evo.genRect;
		this.pos = evo.getInt("pos");
		//
		loopTime = 1.0f;
		
		
		switch(pos)
		{
			case 0:
				hand = TextureMgr.instance().LoadTexture("pointing_right", TextureType.FTE);//Resources.Load("Textures/UI/FTE/pointing_right");	
				dt = 0;			
				break;
			case 1:
				hand = TextureMgr.instance().LoadTexture("pointing_up", TextureType.FTE);//Resources.Load("Textures/UI/FTE/pointing_up");
				dt = loopTime / 2;
				break;
			case 2:
				hand = TextureMgr.instance().LoadTexture("pointing_left", TextureType.FTE);//Resources.Load("Textures/UI/FTE/pointing_left");
				dt = loopTime / 2;
				break;
			case 3:
				hand = TextureMgr.instance().LoadTexture("pointing_down", TextureType.FTE);//Resources.Load("Textures/UI/FTE/pointing_down");
				dt = 0;
				break;
		}
		dtime = dt;
		this.priv_recalcRect();
	}
	
	protected function calcXY():void
	{
		switch(pos)
		{
			case 0:
			case 2:
				hx = TX * funcTime(dtime,loopTime);
				break;
			case 1:
			case 3:
				hy = TY * funcTime(dtime,loopTime);
				break;
		}		
	}
	
	protected function funcTime(cur:float,total:float):float
	{
		var ig:int = cur / total;
		var rt:float;
		cur = cur - ig  * total;
		rt = 2  * cur / total;
		if( rt > 1)
			rt = 2 -rt;
		return rt;		
	}
	
	public function FixedUpdate():void
	{
		dtime += Time.fixedDeltaTime;
		calcXY();
	}
	
	public function Draw()
	{
		if(!visible)
			return;

		if ( m_getRect != null )
		{
			rect = m_getRect();
			this.priv_recalcRect();
		}
		GUI.BeginGroup(rect);
		
		if(hand)
			drawTexture(hand,hx,hy);	
		
		GUI.EndGroup();
	}
	
	private function priv_recalcRect()
	{
		TX = rect.width;
		TY = rect.height;
		
		if(hand)
		{
			if(pos == 0 || pos == 1)
			{				
				hy = (rect.height - hand.height ) /2;
			}
			else
			{			
				hx = (rect.width - hand.width) /2;
			}
			TX -= hand.width;
			TY -= hand.height;
		}

		calcXY();
	}
	
	public function focusCamera(cx:float,by:float):void
	{
		rect.x = cx - rect.width / 2;
//		rect.y = by - rect.height;
	}

}