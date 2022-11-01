using UnityEngine;
using System.Collections;
using System.Collections.Generic;
namespace KBN {
    public abstract class BarracksBase
	{
		// I found that if simply let the parent class and child class
		// use the same singleton object, some other classes(such as MyItems)
		// will match the function call to the parent class first which
		// will lead to a "undefined function" error. So I define the
		// parent class with a different name with the child class, and
		// give the hierarchy two singletons pointing to the same instance.


		public class TroopInfo
		{
			public	int	typeId;//Id
			public	int	traintime;
			// added info..
			public string troopName;
			public string troopTexturePath;
			public string description;
			public Requirement[] requirements;
			public long owned;//all num
			public int attack;
			public int health;//LIFE
			public int speed;
			public int load;
			public int upkeep;
			public int might;
			public bool bLocked;
			public int actType;//Type 1,'Supply' ; 2,'Horse' ; 3, 'Ground'; 4,'Artillery'
			public int level;//TIER
			public bool trainable;
			public int lifeRate;
			public int attackRate;
			//
			public long selectNum;
			public int appearTab;//TAP 1:junior,2:senior
			public string needCityOrder;//CITY
			public static int CompareByLevelAndType(TroopInfo l , TroopInfo r)
			{
				if ( l.level < r.level )
					return -1;
				if ( l.level > r.level )
					return 1;
				if ( l.actType < r.actType )
					return -1;
				if ( l.actType > r.actType )
					return 1;
				return 0;
			}

			public static int CompareById(TroopInfo l , TroopInfo r)
			{
				if ( l.typeId < r.typeId )
					return 1;
				if ( l.typeId > r.typeId )
					return -1;
				return 0;
			}
		}

		public static BarracksBase baseSingleton { get; protected set; }

		public abstract TroopInfo GetTroopInfo(int typeId);

		// Yeah...just what I need from a cs perspective...
		public abstract void addUnitsToSeed( int unitId, int amount, int cityId );
	}
}