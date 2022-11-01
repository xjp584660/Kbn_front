using UnityEngine;
using System.Collections;
using System;

namespace KBN
{
    public abstract class Building
    {
		public static Building singleton { get; protected set; }

        public static readonly int[] FieldBuildingIds =
        {
            Constant.Building.FARM,
            Constant.Building.SAWMILL,
            Constant.Building.QUARRY,
            Constant.Building.MINE,
        };

        public static bool IsFieldBuilding(int id)
        {
            return Array.Exists<int>(FieldBuildingIds, tempId => tempId == id);
        }

		public abstract	int getMaxLevelForType(int buildingTypeId, int cityId);

		public abstract int getLevelsSumForType(int buildingTypeId);
    }
}
