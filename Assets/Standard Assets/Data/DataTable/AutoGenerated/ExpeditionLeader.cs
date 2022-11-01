using System.Linq;

namespace KBN.DataTable
{
    public class ExpeditionLeader : IDataItem
    {
        #region Fields
        
        public int ID;

        public string ICON;

        public string HEAD_ICON;

        public string HEADBACKGROUND_ICON;

        public string NAME;

        public string DESCRIPTION;

        public string BUFFS;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            ICON = columns[1];
            HEAD_ICON = columns[2];
            HEADBACKGROUND_ICON = columns[3];
            NAME = columns[4];
            DESCRIPTION = columns[5];
            BUFFS = columns[6];
        }

        #endregion
    }
}
