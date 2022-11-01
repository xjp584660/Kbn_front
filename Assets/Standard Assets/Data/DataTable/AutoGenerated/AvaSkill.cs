using System.Linq;

namespace KBN.DataTable
{
    public class AvaSkill : IDataItem
    {
        #region Fields
        
        public int TYPE;

        public int LEVEL;

        public int GOLD;

        public int FOOD;

        public int WOOD;

        public int STONE;

        public int IRON;

        public string REQ_ITEM;

        public int REQ_EAP;

        public int REQ_ALLIANCE_LEVEL;

        public string EFFECT;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            TYPE = int.Parse(columns[0]);
            LEVEL = int.Parse(columns[1]);
            GOLD = int.Parse(columns[2]);
            FOOD = int.Parse(columns[3]);
            WOOD = int.Parse(columns[4]);
            STONE = int.Parse(columns[5]);
            IRON = int.Parse(columns[6]);
            REQ_ITEM = columns[7];
            REQ_EAP = int.Parse(columns[8]);
            REQ_ALLIANCE_LEVEL = int.Parse(columns[9]);
            EFFECT = columns[10];
        }

        #endregion
    }
}
