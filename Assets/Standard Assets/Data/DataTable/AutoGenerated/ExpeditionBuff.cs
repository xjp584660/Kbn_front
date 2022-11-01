using System.Linq;

namespace KBN.DataTable
{
    public class ExpeditionBuff : IDataItem
    {
        #region Fields
        
        public int ID;

        public int TIER;

        public string NAME;

        public string DESCRIPTION;

        public string ICON;

        public int UPGRADE_TARGET;

        public int EFFECTTYPE;

        public int TARGET;

        public string SUB_TARGET;

        public string VALUE;

        public int VALUE_TYPE;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            TIER = int.Parse(columns[1]);
            NAME = columns[2];
            DESCRIPTION = columns[3];
            ICON = columns[4];
            UPGRADE_TARGET = int.Parse(columns[5]);
            EFFECTTYPE = int.Parse(columns[6]);
            TARGET = int.Parse(columns[7]);
            SUB_TARGET = columns[8];
            VALUE = columns[9];
            VALUE_TYPE = int.Parse(columns[10]);
        }

        #endregion
    }
}
