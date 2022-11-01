using UnityEngine;
using System.Collections;

public abstract class MenuAccessorBase
{
    public static MenuAccessorBase Instance { get; protected set; }

    public abstract void SwitchTabIndexInAcademyBuilding(int index);
    public abstract void AcademyBuildingChangeStartIndex(int index);
    public abstract void AllianceWallInputReturn();
    public abstract void AllianceWallInputHide();
    public abstract void OpenBarrackWithTab(int index);
    public abstract void BarrackMenuSwitchToTrainList(UIObject barrackMenu);
    public abstract void BarrackMenuOnDismissOK(UIObject barrackMenu);
	public abstract int GetBuildingMaxLevelForType(int buildType, int cityId);
	public abstract void OpenEventDialog();
	public abstract void OpenUniversalOffer();
    public abstract void LinkerHandleDefaultAction(string linkType, string param);
    public abstract void OpenMissionMenu(object param);

    public abstract void OpenPlayerSetting(System.Action closeCallback);
    public abstract void OpenKabamId();
    public abstract void OpenHelp();
    public abstract void SetKabamIdBIPosition(int biPos);

	public abstract void OpenInGameHelpFromTierLevelUp();
    public abstract void SetAllianceWallKeyboardHeight(string height);
}
