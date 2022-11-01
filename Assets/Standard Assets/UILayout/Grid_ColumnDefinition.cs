
namespace UILayout
{
	[UIFrameLayout("ColumnDefinition")]
	public class Grid_ColumnDefinition
		: _SizeAdjust
	{
		#region Rect Setting
		public UISize Width
		{
			get { return tgtSize; }
			set { tgtSize = value; }
		}

		public uint MaxWidth
		{
			get { return tgtSize.HaveMax ? tgtSize.Max : uint.MaxValue; }
			set { tgtSize.Max = value; }
		}

		public uint MinWidth
		{
			get { return tgtSize.Min; }
			set { tgtSize.Min = value; }
		}
		#endregion
	}
}
