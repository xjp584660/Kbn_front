using System.Linq;

namespace KBN.DataTable
{
    public class AllianceUpgrade : IDataItem
    {
        #region Fields
        
        public int Level;

        public int Stone_limit;

        public int Wood_limit;

        public int Ore_limit;

        public int Food_limit;

        public int Gold_limit;

        public int CAP;

        public string Inventory_limit;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            Level = int.Parse(columns[0]);
            Stone_limit = int.Parse(columns[1]);
            Wood_limit = int.Parse(columns[2]);
            Ore_limit = int.Parse(columns[3]);
            Food_limit = int.Parse(columns[4]);
            Gold_limit = int.Parse(columns[5]);
            CAP = int.Parse(columns[6]);
            Inventory_limit = columns[7];
        }

        #endregion
    }
}
