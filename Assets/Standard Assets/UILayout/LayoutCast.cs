
namespace UILayout
{
	[HaveValueCast]
	class LayoutCast
	{
		[ValueCast]
		public static UILayout.UISize CastToUISize(string str)
		{
			UISize rtSize = new UISize();
			//"*20"
			if (str[0] == '*')
			{
				//	weight
				str = str.Substring(1);
				rtSize.Weight = System.Convert.ToUInt32(str);
				return rtSize;
			}

			rtSize.Value = System.Convert.ToUInt32(str);
			return rtSize;
		}
	}
}
