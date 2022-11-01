using System.Linq;

namespace KBN.DataTable
{
    public class HeroRenownItem : IDataItem
    {
        #region Fields
        
        public int ID;

        public int MIN_ITEM_ID;

        public int MAX_ITEM_ID;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            MIN_ITEM_ID = int.Parse(columns[1]);
            MAX_ITEM_ID = int.Parse(columns[2]);
        }

        #endregion
    }
}
