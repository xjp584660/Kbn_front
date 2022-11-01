using UnityEngine;
using System.Collections;
using System;

namespace KBN
{
    public class Walls
    {
        protected static int[] AllUnitIds = 
        {
            53, //trap
            54, //calrops
            55, //Wall-mountedCroosbows
            
            56, //Boiling Oil (v8)
            57, //Spiked Barrier (v8)
            52, //defensiveTrebuchet
            
            58, //Greek Fire (v8)
            59, //Persian Sulfur (v8)
            60, //Hellfire Thrower (v8)
        };

        public static bool IsWallUnit(int id)
        {
            return Array.Exists<int>(AllUnitIds, tempId => tempId == id);
        }
    }
}
