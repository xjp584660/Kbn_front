using System.Linq;

namespace KBN.DataTable
{
    public class PveDrop : IDataItem
    {
        #region Fields
        
        public int ID;

        public string DROP_ITEM;

        public string PARAM;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            DROP_ITEM = columns[1];
            PARAM = columns[2];
        }

        #endregion
    }
}
