using GameFramework;

namespace KBN
{
	public class AvaBuyItem : GameEventArgs
	{
		public AvaBuyItem()
		{
		}
		
		public override int Id
		{
			get
			{
				return (int)EventId.AvaBuyItem;
			}
		}
	}
}