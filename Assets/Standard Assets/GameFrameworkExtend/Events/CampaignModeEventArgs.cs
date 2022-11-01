using GameFramework;

namespace KBN
{
	public class CampaignModeEventArgs : GameEventArgs 
	{
		
		public CampaignModeEventArgs(int type)
		{
			Type = type;
		}
		
		public override int Id
		{
			get
			{
				return (int)EventId.CampaignMode;
			}
		}
		
		public int Type 
		{
			get;
			set;
		}
	}
}