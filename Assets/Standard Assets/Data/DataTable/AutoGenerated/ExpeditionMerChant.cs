using System.Linq;

namespace KBN.DataTable
{
    public class ExpeditionMerChant : IDataItem
    {
        #region Fields
        
        public int ID;

        public int TYPE;

        public int SUBTYPE;

        public int LEADERID;

        public int ITEMID;

        public int WEIGHT;

        public int PRICE;

        public string DISCOUNT;

        public int LIMIT;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            TYPE = int.Parse(columns[1]);
            SUBTYPE = int.Parse(columns[2]);
            LEADERID = int.Parse(columns[3]);
            ITEMID = int.Parse(columns[4]);
            WEIGHT = int.Parse(columns[5]);
            PRICE = int.Parse(columns[6]);
            DISCOUNT = columns[7];
            LIMIT = int.Parse(columns[8]);
        }

        #endregion
    }
}
