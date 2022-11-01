using System.Linq;

namespace KBN.DataTable
{
    public class AvaModeReward : IDataItem
    {
        #region Fields
        
        public string SCORE;

        public int EAP;

        public string REWARD;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            SCORE = columns[0];
            EAP = int.Parse(columns[1]);
            REWARD = columns[2];
        }

        #endregion
    }
}
