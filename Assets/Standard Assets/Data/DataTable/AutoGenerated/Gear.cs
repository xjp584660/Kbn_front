using System.Linq;

namespace KBN.DataTable
{
    public class Gear : IDataItem
    {
        #region Fields
        
        public int gearid;

        public string pic;

        public string smallPic;

        public int rare;

        public int type;

        public string req;

        public string skill;

        public string baseTarget;

        public int defaultToExp;

        public string lv_attack;

        public string lv_hp;

        public string lv_limit;

        public string lv_load;

        public string lv_speed;

        public string lv_exp;

        public string lv_might;

        public int colorIndex;

        public string tierPic;

        public string tierSmallPic;

        public string tierSlot;

        public string tierExp;

        public string tierMight;

        public string tierHP;

        public string tierAttack;

        public string tierColor;

        public string setid;

        public string threesetattribute;

        public string fivesetattribute;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            gearid = int.Parse(columns[0]);
            pic = columns[1];
            smallPic = columns[2];
            rare = int.Parse(columns[3]);
            type = int.Parse(columns[4]);
            req = columns[5];
            skill = columns[6];
            baseTarget = columns[7];
            defaultToExp = int.Parse(columns[8]);
            lv_attack = columns[9];
            lv_hp = columns[10];
            lv_limit = columns[11];
            lv_load = columns[12];
            lv_speed = columns[13];
            lv_exp = columns[14];
            lv_might = columns[15];
            colorIndex = int.Parse(columns[16]);
            tierPic = columns[17];
            tierSmallPic = columns[18];
            tierSlot = columns[19];
            tierExp = columns[20];
            tierMight = columns[21];
            tierHP = columns[22];
            tierAttack = columns[23];
            tierColor = columns[24];
            setid = columns[25];
            threesetattribute = columns[26];
            fivesetattribute = columns[27];
        }

        #endregion
    }
}
