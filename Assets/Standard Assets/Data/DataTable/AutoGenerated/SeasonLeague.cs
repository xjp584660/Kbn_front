using System.Linq;

namespace KBN.DataTable
{
    public class SeasonLeague : IDataItem
    {
        #region Fields
        
        public int LEAGUE_LEVEL;

        public string LEAGUE_NAME;

        public int BATTLE_RANK;

        public int TRAINING_BUFF;

        public string LEAGUE_REWARD_BADGE_ITEM;

        public string REWARD_ITEM;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            LEAGUE_LEVEL = int.Parse(columns[0]);
            LEAGUE_NAME = columns[1];
            BATTLE_RANK = int.Parse(columns[2]);
            TRAINING_BUFF = int.Parse(columns[3]);
            LEAGUE_REWARD_BADGE_ITEM = columns[4];
            REWARD_ITEM = columns[5];
        }

        #endregion
    }
}
