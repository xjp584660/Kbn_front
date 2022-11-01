using System.Linq;

namespace KBN.DataTable
{
    public class HeroLevel : IDataItem
    {
        #region Fields
        
        public int HERO_ID;

        public int RENOWN_LEVEL;

        public int RENOWN;

        public int LIFE;

        public int ATTACK;

        public int TROOP_NUM;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            HERO_ID = int.Parse(columns[0]);
            RENOWN_LEVEL = int.Parse(columns[1]);
            RENOWN = int.Parse(columns[2]);
            LIFE = int.Parse(columns[3]);
            ATTACK = int.Parse(columns[4]);
            TROOP_NUM = int.Parse(columns[5]);
        }

        #endregion
    }
}
