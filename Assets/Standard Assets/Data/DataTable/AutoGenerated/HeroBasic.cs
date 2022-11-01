using System.Linq;

namespace KBN.DataTable
{
    public class HeroBasic : IDataItem
    {
        #region Fields
        
        public int ID;

        public string ICON;

        public string HEAD_ICON;

        public string HEADBACKGROUND_ICON;

        public string NAME;

        public string LEGEND;

        public string TROOP_TYPE;

        public int RENOWN_REQUIRED;

        public string EQUIP;

        public string SKILL;

        public string FATE;

        public string UNLOCK_DESCRIPTION;

        public int EXPLORE_SLEEP_MAX_TIME;

        public int EXPLORE_SLEEP_MIN_TIME;

        public int EXPLORE_HP;

        public int EXPLORE_TIMES;

        public int SUMMON_CD_TIME;

        public int MARCH_SLEEP_TIME;

        public int DEFEND_SLEEP_TIME;

        public string ELEVATELEVEL;

        public string REQUIREMENTS;

        public string NEWSKILLIDS;

        public string NEWFATEIDS;

        public string MAXSKILLLEVELS;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            ICON = columns[1];
            HEAD_ICON = columns[2];
            HEADBACKGROUND_ICON = columns[3];
            NAME = columns[4];
            LEGEND = columns[5];
            TROOP_TYPE = columns[6];
            RENOWN_REQUIRED = int.Parse(columns[7]);
            EQUIP = columns[8];
            SKILL = columns[9];
            FATE = columns[10];
            UNLOCK_DESCRIPTION = columns[11];
            EXPLORE_SLEEP_MAX_TIME = int.Parse(columns[12]);
            EXPLORE_SLEEP_MIN_TIME = int.Parse(columns[13]);
            EXPLORE_HP = int.Parse(columns[14]);
            EXPLORE_TIMES = int.Parse(columns[15]);
            SUMMON_CD_TIME = int.Parse(columns[16]);
            MARCH_SLEEP_TIME = int.Parse(columns[17]);
            DEFEND_SLEEP_TIME = int.Parse(columns[18]);
            ELEVATELEVEL = columns[19];
            REQUIREMENTS = columns[20];
            NEWSKILLIDS = columns[21];
            NEWFATEIDS = columns[22];
            MAXSKILLLEVELS = columns[23];
        }

        #endregion
    }
}
