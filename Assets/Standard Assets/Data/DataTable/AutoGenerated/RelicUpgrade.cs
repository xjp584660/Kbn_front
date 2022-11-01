using System.Linq;

namespace KBN.DataTable
{
    public class RelicUpgrade : IDataItem
    {
        #region Fields
        
        public int RELIC_ID;

        public int LEVEL;

        public string MAIN_VALUE;

        public int ADD_SKILL_PR;

        public int EXP;

        public int PROVIDE_EXP;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            RELIC_ID = int.Parse(columns[0]);
            LEVEL = int.Parse(columns[1]);
            MAIN_VALUE = columns[2];
            ADD_SKILL_PR = int.Parse(columns[3]);
            EXP = int.Parse(columns[4]);
            PROVIDE_EXP = int.Parse(columns[5]);
        }

        #endregion
    }
}
