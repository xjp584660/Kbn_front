using System.Linq;

namespace KBN.DataTable
{
    public class PveLevel : IDataItem
    {
        #region Fields
        
        public int ID;

        public string NAME;

        public string ICON;

        public string DESCRIPTION;

        public int PARENT_LEVEL_ID;

        public int MARCH_TIME;

        public int ENERGY;

        public int THREE_STAR_SCORE;

        public int BOSS_ID;

        public int START_STORY_ID;

        public int SUCCESS_STORY_ID;

        public int FAIL_STORY_ID;

        public int POP_UP;

        public int REWARD_FOOD;

        public int REWARD_WOOD;

        public int REWARD_STONE;

        public int REWARD_ORE;

        public int REWARD_GOLD;

        public int DROP_ID;

        public int UNLOCK_HERO_ID;

        public int DAILY_COMBAT_LIMIT;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            NAME = columns[1];
            ICON = columns[2];
            DESCRIPTION = columns[3];
            PARENT_LEVEL_ID = int.Parse(columns[4]);
            MARCH_TIME = int.Parse(columns[5]);
            ENERGY = int.Parse(columns[6]);
            THREE_STAR_SCORE = int.Parse(columns[7]);
            BOSS_ID = int.Parse(columns[8]);
            START_STORY_ID = int.Parse(columns[9]);
            SUCCESS_STORY_ID = int.Parse(columns[10]);
            FAIL_STORY_ID = int.Parse(columns[11]);
            POP_UP = int.Parse(columns[12]);
            REWARD_FOOD = int.Parse(columns[13]);
            REWARD_WOOD = int.Parse(columns[14]);
            REWARD_STONE = int.Parse(columns[15]);
            REWARD_ORE = int.Parse(columns[16]);
            REWARD_GOLD = int.Parse(columns[17]);
            DROP_ID = int.Parse(columns[18]);
            UNLOCK_HERO_ID = int.Parse(columns[19]);
            DAILY_COMBAT_LIMIT = int.Parse(columns[20]);
        }

        #endregion
    }
}
