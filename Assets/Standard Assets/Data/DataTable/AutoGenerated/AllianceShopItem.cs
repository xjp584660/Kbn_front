using System.Linq;

namespace KBN.DataTable
{
    public class AllianceShopItem : IDataItem
    {
        #region Fields
        
        public int ITEMTYPE;

        public int ISSHOW;

        public int BASIC_SHOP_PRICE;

        public int QUANTITY_LIMITAION;

        public int REQ_ALLIANCE_LEVEL;

        public int BUFF_ID;

        public int DURATION;

        public int ONLY_CURRENT_AVA;

        public string REQ_SKILL_LEVEL;

        public int BUY_TIME;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ITEMTYPE = int.Parse(columns[0]);
            ISSHOW = int.Parse(columns[1]);
            BASIC_SHOP_PRICE = int.Parse(columns[2]);
            QUANTITY_LIMITAION = int.Parse(columns[3]);
            REQ_ALLIANCE_LEVEL = int.Parse(columns[4]);
            BUFF_ID = int.Parse(columns[5]);
            DURATION = int.Parse(columns[6]);
            ONLY_CURRENT_AVA = int.Parse(columns[7]);
            REQ_SKILL_LEVEL = columns[8];
            BUY_TIME = int.Parse(columns[9]);
        }

        #endregion
    }
}
