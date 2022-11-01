namespace KBN
{
    public class HeroSlot
    {
        private int m_Index = 0;

        public HeroSlot(int index)
        {
            m_Index = index;
        }

        public int Index
        {
            get
            {
                return m_Index;
            }
        }

        public HeroSlotStatus Status
        {
            get;
            set;
        }

        public HeroInfo AssignedHero
        {
            get;
            set;
        }

        public int ActiveLevel
        {
            get;
            set;
        }

        public string ActiveMessage
        {
            get
            {
                return string.Format(Datas.getArString("HeroHouse.Slot_Locked_Text"), ActiveLevel);
            }
        }
    }
}
