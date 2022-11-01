using System.Linq;

namespace KBN.DataTable
{
    public class Vip : IDataItem
    {
        #region Fields
        
        public int LEVEL;

        public int POINT;

        public int FOOD;

        public int WOOD;

        public int STONE;

        public int ORE;

        public int GOLD;

        public int CONSTRUCT;

        public int TECH;

        public int MERLINS_CHANCE;

        public int PVE_ENERGY;

        public int PVE_LOGIN_ENERGY;

        public int PVE_MARCH_SPEEDUP;

        public int PVE_TROOP_RETURN;

        public int HERO_EXPLORE_DAY;

        public int HERO_EXPLORE_TIMES;

        public int HERO_SLEEP;

        public int HERO_RENOWN;

        public int MAP_SEARCH_TIMES;

        public int MARCH_PRESET;

        public int STORE_HOUSE_CAP;

        public int HOSPITAL_CAP;

        public int TRAIN_SPEED;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            LEVEL = int.Parse(columns[0]);
            POINT = int.Parse(columns[1]);
            FOOD = int.Parse(columns[2]);
            WOOD = int.Parse(columns[3]);
            STONE = int.Parse(columns[4]);
            ORE = int.Parse(columns[5]);
            GOLD = int.Parse(columns[6]);
            CONSTRUCT = int.Parse(columns[7]);
            TECH = int.Parse(columns[8]);
            MERLINS_CHANCE = int.Parse(columns[9]);
            PVE_ENERGY = int.Parse(columns[10]);
            PVE_LOGIN_ENERGY = int.Parse(columns[11]);
            PVE_MARCH_SPEEDUP = int.Parse(columns[12]);
            PVE_TROOP_RETURN = int.Parse(columns[13]);
            HERO_EXPLORE_DAY = int.Parse(columns[14]);
            HERO_EXPLORE_TIMES = int.Parse(columns[15]);
            HERO_SLEEP = int.Parse(columns[16]);
            HERO_RENOWN = int.Parse(columns[17]);
            MAP_SEARCH_TIMES = int.Parse(columns[18]);
            MARCH_PRESET = int.Parse(columns[19]);
            STORE_HOUSE_CAP = int.Parse(columns[20]);
            HOSPITAL_CAP = int.Parse(columns[21]);
            TRAIN_SPEED = int.Parse(columns[22]);
        }

        #endregion
    }
}
