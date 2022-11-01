using System.Linq;

namespace KBN.DataTable
{
    public class ExpeditionRankReward : IDataItem
    {
        #region Fields
        
        public string SCORE;

        public string REWARD;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            SCORE = columns[0];
            REWARD = columns[1];
        }

        #endregion
    }
}
