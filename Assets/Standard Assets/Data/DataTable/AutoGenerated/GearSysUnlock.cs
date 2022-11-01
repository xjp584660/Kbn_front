using System.Linq;

namespace KBN.DataTable
{
    public class GearSysUnlock : IDataItem
    {
        #region Fields
        
        public string key;

        public string value;

        public int type;

        public string comment;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            key = columns[0];
            value = columns[1];
            type = int.Parse(columns[2]);
            comment = columns[3];
        }

        #endregion
    }
}
