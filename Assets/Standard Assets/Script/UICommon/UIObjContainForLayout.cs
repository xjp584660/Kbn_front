
public abstract class CAElement
{
	public int ZOrderOffset;
	public abstract void SetFrame(UILayout.UIFrame uiFrame);
}


[UILayout.UIFrameLayout(TypeName="ContainRef")]
[UILayout.HaveValueCastAttribute]
public class UIObjContainForLayout
	:  UILayout.UIFrame
{
	public enum FillHorizon
	{	Fill
	,	DockLeft
	,	DockRight
	,	Center
	}
	
	public enum FillVertical
	{	Fill
	,	DockTop
	,	DockBottom
	,	Center
	}	

	public enum LockType
	{	None
	,	LockHeight
	,	LockWidth
	,	LockSize		//	height + weight
	,	LockRadio
	}

	public class UIObjInfo
	{
		public IUIElement uiObj;
		public FillHorizon hFill;
		public FillVertical vFill;
		public LockType lockType;
		public uint deep;
	}

	private UILayout.UIArea m_tgtArea = null;
	private UILayout.UIFrame m_chrFrame;
	private System.Collections.Generic.List<UIObjInfo> m_uiObjs = new System.Collections.Generic.List<UIObjInfo>();

	public void AddItem(IUIElement uiObj)
	{
		this.AddItem(uiObj, 0, false);
	}
	public void AddItem(IUIElement uiObj, uint deep)
	{
		this.AddItem(uiObj, deep, false);
	}
	public void AddItem(IUIElement uiObj, uint deep, bool lockRadio)
	{
		this.AddItem(uiObj, deep, FillHorizon.Fill, FillVertical.Fill, lockRadio);
	}
	public void AddItem(IUIElement uiObj, uint deep, FillHorizon hFill, FillVertical vFill, bool lockRadio)
	{
		this.AddItem(uiObj, deep, hFill, vFill, lockRadio?LockType.LockRadio:LockType.None);
	}
	public void AddItem(IUIElement uiObj, uint deep, FillHorizon hFill, FillVertical vFill, LockType lockType)
	{
		if ( uiObj == null )
		{
			this.UnlinkObj(deep);
			return;
		}

		UIObjInfo uiObjPos = new UIObjInfo();
		uiObjPos.uiObj = uiObj;
		uiObjPos.deep = deep;
		uiObjPos.hFill = hFill;
		uiObjPos.vFill = vFill;
		uiObjPos.lockType = lockType;
		int pos = (int)priv_lowerbound(deep);
		if ( pos < m_uiObjs.Count && m_uiObjs[pos].deep == deep )
			m_uiObjs[pos] = uiObjPos;
		else
			m_uiObjs.Insert(pos, uiObjPos);
			
		CAElement agentObj = uiObj as CAElement;
		if ( agentObj != null )
			agentObj.SetFrame(this);
		UILayout.ModifyPropertysContains contains = uiObj as UILayout.ModifyPropertysContains;
		if ( contains != null )
			contains.Parent = this;
	}

	public void UnlinkObj(uint deep)
	{
		int pos = (int)priv_lowerbound(deep);
		if ( pos < m_uiObjs.Count && m_uiObjs[pos].deep == deep )
			m_uiObjs.RemoveAt(pos);
	}

	public UILayout.UIArea TargetArea
	{
		set
		{
			m_tgtArea = value;
		}

		get
		{
			if ( m_tgtArea == null )
				m_tgtArea = new UILayout.UIArea();
			return m_tgtArea;
		}
	}
	
	public void SetChrFrame(UILayout.UIFrame frame)
	{
		m_chrFrame = frame;
		//m_chrFrame.Parent = this;
	}

	public void AddItem(UILayout.UIFrame frame)
	{
		m_chrFrame = frame;
		m_chrFrame.Parent = this;
	}

	public override void Reorder(uint x, uint y, uint w, uint h)
	{
		return;	//	do nothing.
	}

	public override bool PrevCalcAreaSize()
	{
		var thisArea = this.Area;
		if ( m_tgtArea == null )
		{
			m_tgtArea = new UILayout.UIArea();
			m_tgtArea.Copy(thisArea);
		}
		else
		{
			thisArea.Copy(m_tgtArea);
		}

		if ( m_chrFrame != null )
		{
			if ( !m_chrFrame.PrevCalcAreaSize() )
				return false;
			thisArea.Width.Cover(m_chrFrame.Area.Width);
			thisArea.Height.Cover(m_chrFrame.Area.Height);
		}
		
		foreach ( UIObjInfo item in m_uiObjs )
		{
			switch ( item.lockType )
			{
			case LockType.LockSize:
				if ( thisArea.Width.Min < item.uiObj.rect.width )
					thisArea.Width.Min = (uint)item.uiObj.rect.width;
				if ( thisArea.Height.Min < item.uiObj.rect.height )
					thisArea.Height.Min = (uint)item.uiObj.rect.height;
				break;
			case LockType.LockWidth:
				if ( thisArea.Width.Min < item.uiObj.rect.width )
					thisArea.Width.Min = (uint)item.uiObj.rect.width;
				break;
			case LockType.LockHeight:
				if ( thisArea.Height.Min < item.uiObj.rect.height )
					thisArea.Height.Min = (uint)item.uiObj.rect.height;
				break;
			}
		}

		if ( thisArea.Width.Min + this.Border.horizontal >= 0 )
			thisArea.Width.Min += (uint)this.Border.horizontal;
		else
			thisArea.Width.Min = 0;

		if ( thisArea.Height.Min + this.Border.vertical >= 0 )
			thisArea.Height.Min += (uint)this.Border.vertical;
		else
			thisArea.Height.Min = 0;
		//thisArea.Width.ClearMax();
		//thisArea.Height.ClearMax();
		if ( thisArea.Width.HaveMax )
			thisArea.Width.Max += (uint)this.Border.horizontal;
		if ( thisArea.Height.HaveMax )
			thisArea.Height.Max += (uint)this.Border.vertical;
		return true;
	}

	public override void AfterCalcAreaSize(uint x, uint y, uint w, uint h)
	{
		x += (uint)this.Border.left;
		y += (uint)this.Border.top;
		w -= (uint)this.Border.horizontal;
		h -= (uint)this.Border.vertical;

		if ( m_chrFrame != null )
			m_chrFrame.AfterCalcAreaSize(x, y, w, h);

		foreach ( UIObjInfo item in m_uiObjs )
		{
			switch ( item.lockType )
			{
			case LockType.LockRadio:
				priv_resetItemInfoWithLock(item, x, y, w, h);
				break;
			default:
				priv_resetItemInfoWithoutLock(item, x, y, w, h);
				break;
			}
		}
	}
	
	private void priv_resetItemInfoWithLock(UIObjInfo item, uint x, uint y, uint w, uint h)
	{
		UnityEngine.Rect rect = new UnityEngine.Rect(item.uiObj.rect);
		rect = priv_validRect(item.hFill, item.vFill, item.lockType, rect, x, y, w, h);
		//	keep radio.
		if ( rect.height == 0 )
		{
			var rt = item.uiObj.rect;
			rt.width = 0;
			rt.height = 0;
			item.uiObj.rect = rt;
			return;
		}
		
		float radio = rect.width/rect.height - item.uiObj.rect.width/item.uiObj.rect.height;
		if ( radio > 0 )
		{	//	width is too large
			rect.width = item.uiObj.rect.width * rect.height / item.uiObj.rect.height;
			switch ( item.hFill )
			{
			case FillHorizon.Fill:
			case FillHorizon.Center:
				rect.x  = (w - rect.width)/2 + x;
				break;
	
			case FillHorizon.DockLeft:
				rect.x = x;
				break;

			case FillHorizon.DockRight:
				rect.x = x + w - rect.width;
				break;
			}
		}
		else if ( radio < 0 )
		{
			rect.height = item.uiObj.rect.height * rect.width / item.uiObj.rect.width;
			switch ( item.vFill )
			{
			case FillVertical.Fill:
			case FillVertical.Center:
				rect.y = (h - rect.height)/2 + y;
				break;

			case FillVertical.DockTop:
				rect.y = y;
				break;

			case FillVertical.DockBottom:
				rect.y = y + h - rect.height;
				break;
			}
		}
		
		item.uiObj.rect = rect;
	}

	private void priv_resetItemInfoWithoutLock(UIObjInfo item, uint x, uint y, uint w, uint h)
	{
		item.uiObj.rect = priv_validRect(item.hFill, item.vFill, item.lockType, item.uiObj.rect, x, y, w, h);
	}

	private UnityEngine.Rect priv_validRect(FillHorizon hFill, FillVertical vFill, LockType lockType, UnityEngine.Rect rect, uint x, uint y, uint w, uint h)
	{
		if ( lockType != LockType.LockWidth && lockType != LockType.LockSize )
		{
			rect.width = w;
			if ( rect.width < this.m_tgtArea.Width.Min )
				rect.width = this.m_tgtArea.Width.Min;
			if ( this.m_tgtArea.Width.HaveMax && rect.width > this.m_tgtArea.Width.Max )
				rect.width = this.m_tgtArea.Width.Max;
		}

		if ( lockType != LockType.LockHeight && lockType != LockType.LockSize )
		{
			rect.height = h;
			if ( rect.height < this.m_tgtArea.Height.Min )
				rect.height = this.m_tgtArea.Height.Min;
			if ( this.m_tgtArea.Height.HaveMax && rect.height > this.m_tgtArea.Height.Max )
				rect.height = this.m_tgtArea.Height.Max;
		}

		switch ( hFill )
		{
		case FillHorizon.Fill:
			rect.x = x;
			break;

		case FillHorizon.Center:
			rect.x = (w - rect.width)/2 + x;
			break;

		case FillHorizon.DockLeft:
			rect.x = x;
			break;
			
		case FillHorizon.DockRight:
			rect.x = x + w - rect.width;
			break;
		}
		
		switch ( vFill )
		{
		case FillVertical.Fill:
			rect.y = y;
			break;

		case FillVertical.Center:
			rect.y = (h - rect.height)/2 + y;
			break;

		case FillVertical.DockTop:
			rect.y = y;
			break;

		case FillVertical.DockBottom:
			rect.y = y + h - rect.height;
			break;
		}

		return rect;
	}

	private uint priv_lowerbound(uint deep)
	{
		uint begin = 0;
		uint end = (uint)m_uiObjs.Count;
		while ( begin != end )
		{
			int pos = (int)((end - begin)/2 + begin);
			if ( m_uiObjs[pos].deep < deep )
			{
				begin = (uint)pos;
				++begin;
			}
			else
			{
				end = (uint)pos;
			}
		}
		return begin;
	}

	public override bool VisitItems(VisitItemsDelegate visitor , uint startLevel, object usrItem)
	{
		if ( !visitor(this, startLevel, usrItem) )
			return false;
		if ( m_chrFrame == null )
			return true;
		return m_chrFrame.VisitItems(visitor, startLevel+1, usrItem);
	}
	
	public IUIElement GetElement(uint pos)
	{
		return m_uiObjs[(int)pos].uiObj;
	}

	public uint  Count
	{
		get
		{
			return (uint)m_uiObjs.Count;
		}
	}
	
	public UIObjInfo GetUIItem(uint pos)
	{
		return m_uiObjs[(int)pos];
	}
	
	public override UILayout.UIFrame FindItem(string frameName)
	{
		if ( this.Name == frameName )
			return this;
		if ( this.m_chrFrame == null )
			return null;
		return this.m_chrFrame.FindItem(frameName);
	}
	
	[UILayout.ValueCastAttribute]
	public static FillHorizon CoverToHF(string hFill)
	{
		switch ( hFill )
		{
		case "Fill": return FillHorizon.Fill;
		case "DockLeft": return FillHorizon.DockLeft;
		case "DockRight": return FillHorizon.DockRight;
		case "Center": return FillHorizon.Center;
		}
		return FillHorizon.Fill;
	}

	[UILayout.ValueCastAttribute]
	public static FillVertical CoverVF(string vFill)
	{
		switch ( vFill )
		{
		case "Fill": return FillVertical.Fill;
		case "DockTop": return FillVertical.DockTop;
		case "DockBottom": return FillVertical.DockBottom;
		case "Center": return FillVertical.Center;
		}
		return FillVertical.Fill;
	}

	[UILayout.ValueCastAttribute]
	public static LockType CoverLT(string lockType)
	{
		switch ( lockType )
		{
		case "LockHeight": return LockType.LockHeight;
		case "LockWidth": return LockType.LockWidth;
		case "LockSize": return LockType.LockSize;
		case "LockRadio": return LockType.LockRadio;
		}
		return LockType.None;
	}
}
/*
[UILayout.UIFrameLayout(TypeName="Menu")]
class UIMenu
	: UILayout.Panel
{
	public class MenuProp
		: UILayout.ModifyProperty<object>
	{
	}

	private static MenuProp gm_thisMenuProp = new MenuProp();

	public UIMenu()
	{
		this.RegistProperty("@ThisMenu", new MenuProp());
		//this.RegistProperty("@ThisMenu", gm_thisMenuProp);
	}
}
*/