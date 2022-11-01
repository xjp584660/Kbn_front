
namespace UILayout
{
	public class _SizeAdjust
	{
		public _SizeAdjust()
		{
			tgtSize = new UISize();
			curSize = new UISize();
		}

		public void Reset()
		{
			curSize.Copy(tgtSize);
		}

		public UISize tgtSize;
		public UISize curSize;
	}
}
