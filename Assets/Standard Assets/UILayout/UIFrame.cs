
namespace UILayout
{
	public abstract class UIFrame
		: _Control, IUIRegion, ICanFlushAreaInfo
	{
		private string m_name = "";
		public string Name{get{return m_name;}set{ m_name = value; }}
		private bool m_bDebug = false;
		public bool DebugFlag{get{return m_bDebug;}set{m_bDebug=value;}}

		public abstract void AfterCalcAreaSize(uint x, uint y, uint width, uint height);
		public abstract UIFrame FindItem(string frameName);
		public abstract bool PrevCalcAreaSize( );
		public abstract void Reorder(uint x, uint y, uint width, uint height);

		public delegate bool VisitItemsDelegate(UIFrame frame, uint level, object usrItem);
		public abstract bool VisitItems(VisitItemsDelegate visitor, uint startLevel, object usrItem);
	}
}
