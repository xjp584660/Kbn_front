using UnityEngine;
using System.Collections;

public class StatePopupEntranceController
{
    public static StatePopupEntranceController Instance { get; protected set; }

    public static void MakeInstance()
    {
        Instance = new StatePopupEntranceController();
    }

    public static void ClearInstance()
    {
        Instance = null;
    }

    public bool HasOpenedUI { get; protected set; }

    /// <summary>
    /// User interfaces the open. Should be called only by ChromeOrganizerMenu
    /// </summary>
    public void UIOpen()
    {
        HasOpenedUI = true;
    }

    protected StatePopupEntranceController()
    {
        HasOpenedUI = false;
    }

    public bool ShouldAnimate
    {
        get
        {
            if (HasOpenedUI)
            {
                return false;
            }

            return CanClaimDailyQuest/*|| ShouldShowRoundTower*/;
        }
    }

    protected bool CanClaimDailyQuest
    {
        get
        {
            if (DailyQuestManager.Instance == null)
            {
                return false;
            }

            return DailyQuestManager.Instance.CanClaimAny;
        }
    }

    protected bool ShouldShowRoundTower
    {
        get
        {
            return ChromeOrganizerMenu.IsShowRoundTowerButton;
        }
    }
}
