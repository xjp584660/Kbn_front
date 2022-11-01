using System.Linq;

namespace KBN.DataTable
{
    public class RelicSet : IDataItem
    {
        #region Fields
        
        public int SET_ID;

        public int TWO_EFFECT;

        public int TWO_VALUE;

        public int FOUR_EFFECT;

        public string FOUR_VALUE;

        public string FOUR_TROOP;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            SET_ID = int.Parse(columns[0]);
            TWO_EFFECT = int.Parse(columns[1]);
            TWO_VALUE = int.Parse(columns[2]);
            FOUR_EFFECT = int.Parse(columns[3]);
            FOUR_VALUE = columns[4];
            FOUR_TROOP = columns[5];
        }

        #endregion
    }
}
