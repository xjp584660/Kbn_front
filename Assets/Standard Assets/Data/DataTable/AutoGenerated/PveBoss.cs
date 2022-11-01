using System.Linq;

namespace KBN.DataTable
{
    public class PveBoss : IDataItem
    {
        #region Fields
        
        public int ID;

        public string NAME;

        public string LEVEL_BOSS_ICON;

        public string HIDDEN_BOSS_ICON;

        public string BOSS_BG;

        public int LEVEL;

        public int RECOVER_TIME;

        public string UINT;

        public int CAN_VIEW_EQUIP;

        public string EQUIP;

        public int DISPPEAR_TIME;

        public int ATTACK_NUM;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            ID = int.Parse(columns[0]);
            NAME = columns[1];
            LEVEL_BOSS_ICON = columns[2];
            HIDDEN_BOSS_ICON = columns[3];
            BOSS_BG = columns[4];
            LEVEL = int.Parse(columns[5]);
            RECOVER_TIME = int.Parse(columns[6]);
            UINT = columns[7];
            CAN_VIEW_EQUIP = int.Parse(columns[8]);
            EQUIP = columns[9];
            DISPPEAR_TIME = int.Parse(columns[10]);
            ATTACK_NUM = int.Parse(columns[11]);
        }

        #endregion
    }
}
