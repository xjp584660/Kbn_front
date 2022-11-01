public class FTELight extends SimpleLabel
{
	private var m_getRect : function() : Rect;
	
	public var autoRect:boolean;
	public function Sys_Constructor()
	{
		super.Sys_Constructor();
		this.mystyle.normal.background = TextureMgr.instance().LoadTexture("fte_light", TextureType.FTE);//Resources.Load("Textures/UI/FTE/fte_light");
		
		mystyle.border.left = 20;
		mystyle.border.right = 20;
		mystyle.border.top = 20;
		mystyle.border.bottom = 20;
		
	}
	public function Init(evo:ElementVO):void
	{		
		this.rect = evo.rect;
		autoRect = (rect.width == 0);			
	}

	public function aroundRect(rect:Rect, genRect : function() : Rect):void
	{
		if ( m_getRect != null )
			return;
		if(autoRect)
		{
			this.rect = rect;
			this.rect.x -= 13;
			this.rect.y -= 13;
			this.rect.width += 23;
			this.rect.height += 23;

			m_getRect = genRect;
		}
	}

	public function get  holeRect():Rect
	{
		var r:Rect = new Rect();
		r.x = this.rect.x + 15;
		r.y = this.rect.y + 15;
		r.width = this.rect.width - 30;
		r.height = this.rect.height - 30;
		return r;
	}
	
	public function focusCamera(cx:float,by:float):void
	{
		rect.x = cx - rect.width / 2;
		rect.y = by - rect.height;
	}

	public function set RectGen(value : function() : Rect)
	{
		m_getRect = value;
	}

	public function get RectGen() : function() : Rect
	{
		return m_getRect;
	}

	public function Draw()
	{
		var realRect : Rect = this.rect;
		if ( m_getRect != null )
		{
			this.rect = m_getRect();
			realRect = this.rect;
			if(autoRect)
			{			
				this.rect = rect;
				this.rect.x -= 13;
				this.rect.y -= 13;
				this.rect.width += 23;
				this.rect.height += 23;
			}
		}
		if ( realRect.width < 10 || realRect.height < 10 )
			return;
		super.Draw();
	}
}