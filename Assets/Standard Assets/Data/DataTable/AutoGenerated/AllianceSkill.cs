using System.Linq;

namespace KBN.DataTable
{
    public class AllianceSkill : IDataItem
    {
        #region Fields
        
        public int ID;

        public int LEVEL;

        public int BUFF_ID;

        public int DURATION;

        public string REQS;

        public string COSTS;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            LEVEL = int.Parse(columns[1]);
            BUFF_ID = int.Parse(columns[2]);
            DURATION = int.Parse(columns[3]);
            REQS = columns[4];
            COSTS = columns[5];
        }

        #endregion
    }
}
