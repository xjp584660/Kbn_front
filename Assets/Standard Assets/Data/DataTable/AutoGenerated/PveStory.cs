using System.Linq;

namespace KBN.DataTable
{
    public class PveStory : IDataItem
    {
        #region Fields
        
        public int ID;

        public string ICON;

        public string NAME;

        public int POSITION;

        public string CONTENT;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            ICON = columns[1];
            NAME = columns[2];
            POSITION = int.Parse(columns[3]);
            CONTENT = columns[4];
        }

        #endregion
    }
}
