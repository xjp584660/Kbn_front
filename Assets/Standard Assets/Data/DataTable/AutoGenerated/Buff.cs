using System.Linq;

namespace KBN.DataTable
{
    public class Buff : IDataItem
    {
        #region Fields
        
        public int ID;

        public int SCENE;

        public int TARGET;

        public string SUB_TARGET;

        public int VALUE;

        public int VALUE_TYPE;

        public int SCOPE;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            SCENE = int.Parse(columns[1]);
            TARGET = int.Parse(columns[2]);
            SUB_TARGET = columns[3];
            VALUE = int.Parse(columns[4]);
            VALUE_TYPE = int.Parse(columns[5]);
            SCOPE = int.Parse(columns[6]);
        }

        #endregion
    }
}
