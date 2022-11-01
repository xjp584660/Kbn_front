using System.Linq;

namespace KBN.DataTable
{
    public class HeroCommon : IDataItem
    {
        #region Fields
        
        public int ID;

        public int PLAYER_LEVEL;

        public int USE_EQUIP;

        public int HERO_HOUSE_SLOTS;

        public int FIRST_HERO_ID;

        public int FIRST_SUMMON_HERO_ID;

        public string UNLOCK_SLOT_;

        public string RENOWN_VALUE_;

        public int EXPLORE_OFFSET;

        public string EXPLORE_FIRE;

        public string PVE_HERO;

        public string EVENT_HERO;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            PLAYER_LEVEL = int.Parse(columns[1]);
            USE_EQUIP = int.Parse(columns[2]);
            HERO_HOUSE_SLOTS = int.Parse(columns[3]);
            FIRST_HERO_ID = int.Parse(columns[4]);
            FIRST_SUMMON_HERO_ID = int.Parse(columns[5]);
            UNLOCK_SLOT_ = columns[6];
            RENOWN_VALUE_ = columns[7];
            EXPLORE_OFFSET = int.Parse(columns[8]);
            EXPLORE_FIRE = columns[9];
            PVE_HERO = columns[10];
            EVENT_HERO = columns[11];
        }

        #endregion
    }
}
