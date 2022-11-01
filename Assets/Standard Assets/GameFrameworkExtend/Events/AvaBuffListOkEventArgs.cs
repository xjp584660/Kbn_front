using GameFramework;

namespace KBN
{

	public class AvaBuffListOkEventArgs : GameEventArgs 
	{	
		public override int Id
		{
			get
			{
				return (int)EventId.AvaBuffListOk;
			}
		}
	}
}
