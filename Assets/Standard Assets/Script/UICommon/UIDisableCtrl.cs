using UnityEngine;
using System.Collections;

public class UIDisableCtrl : MonoBehaviour
{
	[System.Flags]
	public enum FillState
	{
		Null = 0,	//	use bool mask
		NormalTexture = 1,
		NormalTextColor = 2,
		ActiveTexture = 4,
		ActiveTextColor = 8,
		OnNormalTexture = 16,
		OnNormalTextColor = 32,
		OnActiveTexture = 64,
		OnActiveTextColor = 128,
		IsFilled = 1<<31,
	}
	
	public GUIStyle onEnable;
	public GUIStyle onDisable;
	
	public FillState fillState = FillState.Null;
	
	public bool isFillNormalTexture;
	public bool isFillNormalTextColor;
	public bool isFillActiveTexture;
	public bool isFillActiveTextColor;
	public bool isFillOnNormalTexture;
	public bool isFillOnNormalTextColor;
	public bool isFillOnActiveTexture;
	public bool isFillOnActiveTextColor;

	//GUIStyle GetStyleByCtrlState(bool isEnable)
	//{
	//	return isEnable?onEnable:onDisable;
	//}

	public void FillStyleWithCtrlState(GUIStyle style, bool isEnable)
	{
		this.FillStyleWithCtrlState(style, isEnable, !isEnable);
	}

	public void FillStyleWithCtrlState(GUIStyle style, bool isEnable, bool styleOldIsEnable)
	{
		if ( isEnable == styleOldIsEnable )
			return;
		this.priv_fillStyleFlag();

		GUIStyle validStyle = isEnable?onEnable:onDisable;
		if ( (fillState & FillState.NormalTexture) != 0 )
			style.normal.background = validStyle.normal.background;
		if ( (fillState & FillState.NormalTextColor) != 0 )
			style.normal.textColor = validStyle.normal.textColor;
		
		if ( (fillState & FillState.ActiveTexture) != 0 )
			style.active.background = validStyle.active.background;
		if ( (fillState & FillState.ActiveTextColor) != 0 )
			style.active.textColor = validStyle.active.textColor;

		if ( (fillState & FillState.OnNormalTexture) != 0 )
			style.onNormal.background = validStyle.onNormal.background;
		if ( (fillState & FillState.OnNormalTextColor) != 0 )
			style.onNormal.textColor = validStyle.onNormal.textColor;
		
		if ( (fillState & FillState.OnActiveTexture) != 0 )
			style.onActive.background = validStyle.onActive.background;
		if ( (fillState & FillState.OnActiveTextColor) != 0 )
			style.onActive.textColor = validStyle.onActive.textColor;
	}
	
	private void priv_fillStyleFlag()
	{
		if ( fillState != FillState.Null )
			return;

		if ( isFillNormalTexture )
			fillState |= FillState.NormalTexture;
		if ( isFillNormalTextColor )
			fillState |= FillState.NormalTextColor;
		if ( isFillActiveTexture )
			fillState |= FillState.ActiveTexture;
		if ( isFillActiveTextColor )
			fillState |= FillState.ActiveTextColor;
		if ( isFillOnNormalTexture )
			fillState |= FillState.OnNormalTexture;
		if ( isFillOnNormalTextColor )
			fillState |= FillState.OnNormalTextColor;
		if ( isFillOnActiveTexture )
			fillState |= FillState.OnActiveTexture;
		if ( isFillOnActiveTextColor )
			fillState |= FillState.OnActiveTextColor;
		
		fillState |= FillState.IsFilled;
	}
}
