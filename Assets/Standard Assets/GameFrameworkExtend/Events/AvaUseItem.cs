using GameFramework;

namespace KBN
{
    public class AvaUseItemEventArgs : GameEventArgs
    {
        public AvaUseItemEventArgs(int itemId)
        {
            ItemId = itemId;
        }

        public override int Id
        {
            get
            {
                return (int)EventId.AvaUseItem;
            }
        }

        public int ItemId
        {
            get;
            private set;
        }
    }
}
