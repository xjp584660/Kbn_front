
namespace UILayout
{
	[UILayout.UIFrameLayout("RowDefinition")]
	public class Grid_RowDefinition
		: _SizeAdjust
	{
		#region Rect Setting
		public UISize Height
		{
			get { return tgtSize; }
			set { tgtSize = value; }
		}

		public uint MaxHeight
		{
			get { return tgtSize.HaveMax ? tgtSize.Max : uint.MaxValue; }
			set { tgtSize.Max = value; }
		}

		public uint MinHeight
		{
			get { return tgtSize.Min; }
			set { tgtSize.Min = value; }
		}
		#endregion
	}
}
