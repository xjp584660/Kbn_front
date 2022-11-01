public class EffectConstant
{
	public enum FadeType
	{
		FADE_IN = 0,
		FADE_OUT,
		BLINK
	}

	public enum RotateType
	{
		LOOP = 0,
		ROTATE_ANGLE,
		ROTATE_INSTANT
	}
	
	public enum PivotPosition
	{
		MIDDLE_CENTER = 0,
		RIGHT_CENTER,
		LEFT_CENTER,
		BottomLeft,
		BottomRight,
		BottomCenter
	}
	
	public enum EffectState
	{
		START_STATE = 0,
		END_STATE
	}
}
