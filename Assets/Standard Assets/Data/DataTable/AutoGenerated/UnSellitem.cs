using System.Linq;

namespace KBN.DataTable
{
    public class UnSellitem : IDataItem
    {
        #region Fields
        
        public int STARTITEMID;

        public int ENDITEMID;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            STARTITEMID = int.Parse(columns[0]);
            ENDITEMID = int.Parse(columns[1]);
        }

        #endregion
    }
}
