using GameFramework;

namespace KBN
{
	public class AvaOutPostEventArgs : GameEventArgs 
	{

		public AvaOutPostEventArgs(int status)
		{
			Status = status;
		}

		public override int Id
		{
			get
			{
				return (int)EventId.AvaOutPostStatus;
			}
		}

		public int Status 
		{
			get;
			set;
		}
	}
}