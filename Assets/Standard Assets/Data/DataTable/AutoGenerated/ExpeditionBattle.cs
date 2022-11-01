using System.Linq;

namespace KBN.DataTable
{
    public class ExpeditionBattle : IDataItem
    {
        #region Fields
        
        public int ID;

        public int MAP;

        public int REWARD_COIN;

        public string DROP_BUFF;

        public string SENDTROOP_LIMIT;

        public string UNIT;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            MAP = int.Parse(columns[1]);
            REWARD_COIN = int.Parse(columns[2]);
            DROP_BUFF = columns[3];
            SENDTROOP_LIMIT = columns[4];
            UNIT = columns[5];
        }

        #endregion
    }
}
