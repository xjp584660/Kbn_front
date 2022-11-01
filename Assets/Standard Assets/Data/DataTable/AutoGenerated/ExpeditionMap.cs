using System.Linq;

namespace KBN.DataTable
{
    public class ExpeditionMap : IDataItem
    {
        #region Fields
        
        public int ID;

        public int RANDOMID;

        public int RCORD;

        public int CCORD;

        public int TYPE;

        public string DROP;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            RANDOMID = int.Parse(columns[1]);
            RCORD = int.Parse(columns[2]);
            CCORD = int.Parse(columns[3]);
            TYPE = int.Parse(columns[4]);
            DROP = columns[5];
        }

        #endregion
    }
}
