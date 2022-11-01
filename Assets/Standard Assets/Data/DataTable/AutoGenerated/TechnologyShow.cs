using System.Linq;

namespace KBN.DataTable
{
    public class TechnologyShow : IDataItem
    {
        #region Fields
        
        public int ID;

        public int SORT;

        public int NUM1;

        public int NUM2;

        public int NUM3;

        public int NUM4;

        public int NUM5;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            SORT = int.Parse(columns[1]);
            NUM1 = int.Parse(columns[2]);
            NUM2 = int.Parse(columns[3]);
            NUM3 = int.Parse(columns[4]);
            NUM4 = int.Parse(columns[5]);
            NUM5 = int.Parse(columns[6]);
        }

        #endregion
    }
}
