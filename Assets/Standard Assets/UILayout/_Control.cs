
namespace UILayout
{
	public class _Control
		: ModifyPropertysContains
	{
		private UIArea m_area = new UIArea();
		private UnityEngine.RectOffset m_border = new UnityEngine.RectOffset();
		public UIArea Area { get { return m_area; } }
		public UnityEngine.RectOffset Border{get{return m_border;}set{m_border=value;}}
		#region Rect Setting
		public UISize Width
		{
			get { return this.Area.Width; }
			set { this.Area.Width.Copy(value); }
		}
		public uint MinWidth
		{
			get { return this.Area.Width.Min; }
			set { this.Area.Width.Min = value; }
		}
		public uint MaxWidth
		{
			get { return this.Area.Width.HaveMax ? this.Area.Width.Max : uint.MaxValue; }
			set { this.Area.Width.Max = value; }
		}

		public UISize Height
		{
			get { return this.Area.Height; }
			set { this.Area.Height = value; }
		}

		public uint MaxHeight
		{
			get { return this.Area.Height.HaveMax ? this.Area.Height.Max : uint.MaxValue; }
			set { this.Area.Height.Max = value; }
		}

		public uint MinHeight
		{
			get { return this.Area.Height.Min; }
			set { this.Area.Height.Min = value; }
		}
		#endregion
	}
}
