using System.Linq;

namespace KBN.DataTable
{
    public class SellItem : IDataItem
    {
        #region Fields
        
        public int ITEMID;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ITEMID = int.Parse(columns[0]);
        }

        #endregion
    }
}
