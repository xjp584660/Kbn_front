public final class HeroManager extends KBN.HeroManager
{
    public static function Instance() : HeroManager
    {
        if (m_Instance == null)
        {
            m_Instance = new HeroManager();
        }

        return m_Instance;
    }

    protected function TryAddBuilding() : void
    {
        if (GameMain.instance().getCityController() == null)
        {
            return;
        }

        GameMain.instance().getCityController().addBuilding(Constant.Hero.HeroHouseSlotId, 0, 0);
    }
}
