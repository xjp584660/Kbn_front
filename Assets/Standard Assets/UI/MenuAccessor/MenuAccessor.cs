using UnityEngine;
using System.Collections;

public static class MenuAccessor
{
    private static MenuAccessorBase accessor
    {
        get
        {
            return MenuAccessorBase.Instance;
        }
    }

    public static void SwitchTabIndexInAcademyBuilding(int index)
    {
        accessor.SwitchTabIndexInAcademyBuilding(index);
    }

    public static void AcademyBuildingChangeStartIndex(int index)
    {
        accessor.AcademyBuildingChangeStartIndex(index);
    }

    public static void AllianceWallInputReturn()
    {
        accessor.AllianceWallInputReturn();
    }

    public static void OpenBarrackWithTab(int index)
    {
        accessor.OpenBarrackWithTab(index);
    }

    public static void AllianceWallInputHide()
    {
        accessor.AllianceWallInputHide();
    }

    public static void BarrackMenuOnDismissOK(UIObject barrackMenu)
    {
        accessor.BarrackMenuOnDismissOK(barrackMenu);
    }

    public static void BarrackMenuSwitchToTrainList(UIObject barrackMenu)
    {
        accessor.BarrackMenuSwitchToTrainList(barrackMenu);
    }

    public static int GetBuildingMaxLevelForType(int buildType, int cityId)
    {
        return accessor.GetBuildingMaxLevelForType(buildType, cityId);
    }

    public static void OpenEventDialog()
    {
        accessor.OpenEventDialog();
    }

    public static void OpenUniversalOffer()
    {
        accessor.OpenUniversalOffer();
    }

    public static void LinkerHandleDefaultAction(string linkType, string param)
    {
        accessor.LinkerHandleDefaultAction(linkType, param);
    }

    public static void OpenMissionMenu(object param)
    {
        accessor.OpenMissionMenu(param);
    }


    public static void OpenPlayerSetting(System.Action closeCallback)
    {
        accessor.OpenPlayerSetting(closeCallback);
    }

    public static void OpenKabamId()
    {
        accessor.OpenKabamId();
    }

    public static void OpenHelp()
    {
        accessor.OpenHelp();
    }

    public static void SetKabamIdBIPosition(int biPos)
    {
        accessor.SetKabamIdBIPosition(biPos);
    }

	public static void OpenInGameHelpFromTierLevelUp()
	{
		accessor.OpenInGameHelpFromTierLevelUp();
	}

    public static void SetAllianceWallKeyboardHeight(string height)
    {
        accessor.SetAllianceWallKeyboardHeight(height);
    }
}
