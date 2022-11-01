using UnityEngine;
using System.Collections;

public static class GameInput {

	public static Vector2 oldPos1 = Vector2.zero;
	public static Vector2 oldPos2 = Vector2.zero;

	public static float GetAxis(string type)
	{
		if(Application.platform == RuntimePlatform.IPhonePlayer || Application.platform == RuntimePlatform.Android)
		{
			switch(type)
			{
				case "Mouse ScrollWheel":
					if(Input.touchCount >1 )
					{
//						Debug.LogWarning(" 000000000 oldPos1.x = "+oldPos1.x+"  y= "+oldPos1.y+"  oldPos2.x = "+oldPos2.x+"  y = "+oldPos2.y);
						if(Input.GetTouch(0).phase==TouchPhase.Moved||Input.GetTouch(1).phase==TouchPhase.Moved)
						{
							Vector2 pos1 = Input.GetTouch(0).position;
							Vector2 pos2 = Input.GetTouch(1).position;
							if(oldPos1 == Vector2.zero && oldPos2 == Vector2.zero)
							{
								oldPos1 = pos1;
								oldPos2 = pos2;		
								return 0;
							}
							else
							{
								float result = checkEnlarge(oldPos1,oldPos2,pos1,pos2);
								oldPos1 = pos1;
								oldPos2 = pos2;
								return result;
							}
		
						}
						return 0;
					}
					else
					{
						oldPos1 = Vector2.zero;
						oldPos2 = Vector2.zero;
					}
				break;
			}
			return 0;
		}
		else
		{
			return Input.GetAxis(type);
		}
	}
	
	public static float checkEnlarge(Vector2 op1,Vector2 op2,Vector2 np1,Vector2 np2)
	{
		float len1 = Vector2.Distance(op1,op2);
		float len2 = Vector2.Distance(np1,np2);

		if(len1 < len2)
		{
			return (len2 - len1);
		}
		else if(len2 < len1)
		{
			return (len2 - len1);
		}
		else
		{
			return 0;
		}
		
	}
	public static bool isMultiTouch()
	{
		if(Application.platform == RuntimePlatform.IPhonePlayer)
		{
			return Input.touchCount>1;
		}
		else
		{
			return false;
		}
	}	

}
