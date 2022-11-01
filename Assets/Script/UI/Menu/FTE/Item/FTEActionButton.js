public class FTEActionButton extends SimpleButton
{

	private var m_getRect : function() : Rect;
	
	public function focusCamera(cx:float,by:float):void
	{
//		rect.width = rect.width * MenuMgr.SCREEN_WIDTH / Screen.width;
//		rect.height = rect.height * MenuMgr.SCREEN_HEIGHT / Screen.height;
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
		if ( m_getRect != null )
			this.rect = m_getRect();
		super.Draw();
	}
}
