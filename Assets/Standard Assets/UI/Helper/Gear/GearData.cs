

namespace KBN
{
	public abstract class GearData
	{
		public static GearData singleton { get; protected set; }
		public abstract Arm PreviousArm
		{
			get;
		}	
		public abstract Arm CurrentArm
		{
			get;
		}	
		public abstract Arm NextArm
		{
			get;
		}	
		public abstract Knight CurrentKnight
		{
			get;
		}
		public abstract bool ShiftPreviousArm();
		public abstract bool ShiftNextArm();
		public abstract void AddArmListener(UIObject uiobject);
		public abstract void RemoveArmListener(UIObject uiobject);


		private int gachaLevelUpMaxTier = 0;
		public int GachaLevelUpMaxTier
		{
			get
			{
				return gachaLevelUpMaxTier;
			}
			set
			{
				gachaLevelUpMaxTier = value;
			}
		}

	}
}
