using System.Linq;

namespace KBN.DataTable
{
    public class GearItemChest : IDataItem
    {
        #region Fields
        
        public int itemId;

        public string chestList;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            itemId = int.Parse(columns[0]);
            chestList = columns[1];
        }

        #endregion
    }
}
