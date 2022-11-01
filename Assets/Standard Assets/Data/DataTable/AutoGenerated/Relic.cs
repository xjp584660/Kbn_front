using System.Linq;

namespace KBN.DataTable
{
    public class Relic : IDataItem
    {
        #region Fields
        
        public int RELIC_ID;

        public string PICTURE;

        public int RARE;

        public int TYPE;

        public string MAIN_TYPE;

        public int SET_ID;

        public string INT_SKILL;

        public string SKILL;

        public string SKILL_LEVVEL_UP_PR;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            RELIC_ID = int.Parse(columns[0]);
            PICTURE = columns[1];
            RARE = int.Parse(columns[2]);
            TYPE = int.Parse(columns[3]);
            MAIN_TYPE = columns[4];
            SET_ID = int.Parse(columns[5]);
            INT_SKILL = columns[6];
            SKILL = columns[7];
            SKILL_LEVVEL_UP_PR = columns[8];
        }

        #endregion
    }
}
