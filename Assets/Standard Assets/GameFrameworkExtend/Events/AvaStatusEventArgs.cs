using GameFramework;

namespace KBN
{
	public class AvaStatusEventArgs : GameEventArgs 
	{
		
		public AvaStatusEventArgs(AvaEvent.AvaStatus status)
		{
			Status = status;
		}
		
		public override int Id
		{
			get
			{
				return (int)EventId.AvaStatus;
			}
		}
		
		public AvaEvent.AvaStatus Status 
		{
			get;
			set;
		}
	}
}