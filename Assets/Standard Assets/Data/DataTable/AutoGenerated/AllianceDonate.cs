using System.Linq;

namespace KBN.DataTable
{
    public class AllianceDonate : IDataItem
    {
        #region Fields
        
        public string Resource;

        public int Donation;

        public int AP;

        public int Count_limit;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            Resource = columns[0];
            Donation = int.Parse(columns[1]);
            AP = int.Parse(columns[2]);
            Count_limit = int.Parse(columns[3]);
        }

        #endregion
    }
}
