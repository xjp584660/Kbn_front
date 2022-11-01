using System.Linq;

namespace KBN.DataTable
{
    public class AVABuffList : IDataItem
    {
        #region Fields
        
        public int ID;

        public string ICON;

        public int TARGET;

        public string SUB_TARGET;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            ICON = columns[1];
            TARGET = int.Parse(columns[2]);
            SUB_TARGET = columns[3];
        }

        #endregion
    }
}
