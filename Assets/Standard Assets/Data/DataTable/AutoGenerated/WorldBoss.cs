using System.Linq;

namespace KBN.DataTable
{
    public class WorldBoss : IDataItem
    {
        #region Fields
        
        public int id;

        public string Boss_name;

        public string drama_normal;

        public string drama_angry;

        public string drama_weak;

        public string unit;

        public string front_buff;

        public string back_buff;

        public string angry_start;

        public string angry_time;

        public string angry_buff;

        public string weak_start;

        public int weak_time;

        public string weak_buff;

        public int point;

        public string normal_reward;

        public string kill_reward;

        public string firstattack_reward;

        public string firstkill_reward;

        public string boss_buff;

        public string show_reward;

        #endregion

        #region Methods

        public void LoadFromText(string[] columns)
        {
			
            id = int.Parse(columns[0]);
            Boss_name = columns[1];
            drama_normal = columns[2];
            drama_angry = columns[3];
            drama_weak = columns[4];
            unit = columns[5];
            front_buff = columns[6];
            back_buff = columns[7];
            angry_start = columns[8];
            angry_time = columns[9];
            angry_buff = columns[10];
            weak_start = columns[11];
            weak_time = int.Parse(columns[12]);
            weak_buff = columns[13];
            point = int.Parse(columns[14]);
            normal_reward = columns[15];
            kill_reward = columns[16];
            firstattack_reward = columns[17];
            firstkill_reward = columns[18];
            boss_buff = columns[19];
            show_reward = columns[20];
        }

        #endregion
    }
}
