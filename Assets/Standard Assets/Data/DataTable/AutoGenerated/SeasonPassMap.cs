using System.Linq;

namespace KBN.DataTable
{
    public class SeasonPassMap : IDataItem
    {
        #region Fields
        
        public int LOCATION_ID;

        public int COST;

        public string REWARD;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            LOCATION_ID = int.Parse(columns[0]);
            COST = int.Parse(columns[1]);
            REWARD = columns[2];
        }

        #endregion
    }
}
