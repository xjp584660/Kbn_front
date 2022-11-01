
namespace UILayout
{
	[UIFrameLayout(TypeName="Panel")]
	public class Panel
		: UIFrame
	{
		struct FrameInfo
		{
			public UIFrame	frame;
			public int		appendDeep;
		}
		
		private UIArea m_tgtArea;
		private UIArea m_curArea;

		System.Collections.Generic.List<FrameInfo> m_chrFrame = new System.Collections.Generic.List<FrameInfo>();
		public Panel()
		{
			m_tgtArea = new UIArea();
			m_curArea = new UIArea();
		}

		public void AddItem(UIFrame frame)
		{
			this.AddItem(frame, m_chrFrame.Count);
		}
		public void AddItem(UIFrame inFrame, int inDeep)
		{
			FrameInfo fInfo = new FrameInfo();
			fInfo.frame = inFrame;
			fInfo.appendDeep = inDeep;
			inFrame.Parent = this;
			m_chrFrame.Add(fInfo);
		}

		public override void Reorder(uint x, uint y, uint width, uint height)
		{
			if (!this.PrevCalcAreaSize())
				return;
			this.AfterCalcAreaSize(x, y, width, height);
		}

		public override bool PrevCalcAreaSize( )
		{
			m_curArea.Copy(m_tgtArea);
			foreach ( var uiFrame in m_chrFrame )
			{
				if ( uiFrame.frame == null )
					continue;
				if ( !uiFrame.frame.PrevCalcAreaSize() )
					return false;
				m_curArea.Cover(uiFrame.frame.Area);
			}

			return true;
		}

		public override void AfterCalcAreaSize(uint x, uint y, uint width, uint height)
		{
			foreach ( var uiFrame in m_chrFrame )
			{
				if ( uiFrame.frame == null )
					continue;
				uiFrame.frame.AfterCalcAreaSize(x, y, width, height);
			}
		}
		public override UIFrame FindItem(string frameName)
		{
			if ( frameName == this.Name )
				return this;
			foreach(var uiFrame in m_chrFrame)
			{
				if ( uiFrame.frame.Name == frameName )
					return uiFrame.frame;
				var ret = uiFrame.frame.FindItem(frameName);
				if ( ret != null )
					return ret;
			}
			return null;
		}

		public override bool VisitItems(VisitItemsDelegate visitor, uint startLevel, object usrItem)
		{
			if ( !visitor(this, startLevel, usrItem) )
				return false;
			foreach ( var uiFrame in m_chrFrame )
			{
				if ( uiFrame.frame == null )
					continue;
				if ( !uiFrame.frame.VisitItems(visitor, startLevel+1 + (uint)uiFrame.appendDeep, usrItem) )
					return false;
			}

			return true;
		}
	}
	
	class DebugPanel
		: Panel
	{
		public new void AddItem(UIFrame frame)
		{
			base.AddItem(frame);
		}
		public new void AddItem(UIFrame frame, int deep)
		{
			base.AddItem(frame, deep);
		}

		public override void Reorder(uint x, uint y, uint width, uint height)
		{
			base.Reorder(x, y, width, height);
		}

		public override bool PrevCalcAreaSize( )
		{
			return base.PrevCalcAreaSize();
		}

		public override void AfterCalcAreaSize(uint x, uint y, uint width, uint height)
		{
			base.AfterCalcAreaSize(x, y, width, height);
		}

		public override bool VisitItems(VisitItemsDelegate visitor, uint startLevel, object usrItem)
		{
			return base.VisitItems(visitor, startLevel, usrItem);
		}
	}
}

