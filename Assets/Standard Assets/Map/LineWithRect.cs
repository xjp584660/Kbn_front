using UnityEngine;
using System.Collections;

public class LineWithRect : MonoBehaviour
{
	public Rect rect = new Rect(0f,0f , Screen.width, Screen.height);
	public Transform LineStart;
	public Transform lineEnd;


	Vector3 VecLineStart;
	Vector3 vecLineEnd;

	Vector3 leftDown
	{
	    get
	    {
	        return new Vector2(rect.xMin, rect.yMin);
	    }
	}
	Vector3 leftUp
	{
	    get
	    {
	        return new Vector2(rect.xMin, rect.yMax);
	    }
	}
	Vector3 RigtDown
	{
	    get
	    {
	        return new Vector2(rect.xMax, rect.yMin);
	    }
	}
	Vector3 RightUp
	{
	    get
	    {
	        return new Vector2(rect.xMax, rect.yMax);
	    }
	}

	void Start()
	{
		rect = new Rect(0f,0f , Screen.width, Screen.height);
	}

	private void OnDrawGizmos()
	{
	    if (LineStart == null || lineEnd == null)
	        return;

	    VecLineStart = new Vector2(LineStart.position.x, LineStart.position.y);
	    vecLineEnd = new Vector2(lineEnd.position.x, lineEnd.position.y);

	    Gizmos.DrawLine(VecLineStart, vecLineEnd);

	    Gizmos.DrawLine(leftDown, leftUp);
	    Gizmos.DrawLine(leftUp, RightUp);
	    Gizmos.DrawLine(RightUp, RigtDown);
	    Gizmos.DrawLine(RigtDown, leftDown);
	}

	private void OnGUI()
	{
	    string content = "不在矩形内";
	    if (LineInRect(VecLineStart, vecLineEnd, rect))
	        content = "在矩形内";

	    GUILayout.Label(content);

	    content = "不相交";
	    if (LineIntersectRect(VecLineStart, vecLineEnd, rect))
	        content = "相交";

	    GUILayout.Label(content);

	    GUILayout.Label("RightUp:[" + RightUp + "]    RigtDown:[" + RigtDown);
	}

	// 线是否在矩形内
	bool LineInRect(Vector2 lineStart, Vector2 lineEnd, Rect rect)
	{
	    return rect.Contains(lineStart) || rect.Contains(lineEnd);
	}

	// 线与矩形是否相交
	bool LineIntersectRect(Vector2 lineStart, Vector2 lineEnd, Rect rect)
	{
	    if (LineIntersectLine(lineStart, lineEnd, leftDown, leftUp))
	        return true;
	    if (LineIntersectLine(lineStart, lineEnd, leftUp, RightUp))
	        return true;
	    if (LineIntersectLine(lineStart, lineEnd, RightUp, RigtDown))
	        return true;
	    if (LineIntersectLine(lineStart, lineEnd, RigtDown, leftDown))
	        return true;

	    return false;
	}

	// 线与线是否相交
	bool LineIntersectLine(Vector2 l1Start, Vector2 l1End, Vector2 l2Start, Vector2 l2End)
	{
	    return QuickReject(l1Start, l1End, l2Start, l2End) && Straddle(l1Start, l1End, l2Start, l2End);
	}

	// 快速排序。  true=通过， false=不通过
	bool QuickReject(Vector2 l1Start, Vector2 l1End, Vector2 l2Start, Vector2 l2End)
	{
	    float l1xMax = Mathf.Max(l1Start.x, l1End.x);
	    float l1yMax = Mathf.Max(l1Start.y, l1End.y);
	    float l1xMin = Mathf.Min(l1Start.x, l1End.x);
	    float l1yMin = Mathf.Min(l1Start.y, l1End.y);

	    float l2xMax = Mathf.Max(l2Start.x, l2End.x);
	    float l2yMax = Mathf.Max(l2Start.y, l2End.y);
	    float l2xMin = Mathf.Min(l2Start.x, l2End.x);
	    float l2yMin = Mathf.Min(l2Start.y, l2End.y);

	    if (l1xMax < l2xMin || l1yMax < l2yMin || l2xMax < l1xMin || l2yMax < l1yMin)
	        return false;

	    return true;
	}

	// 跨立实验
	bool Straddle(Vector3 l1Start, Vector3 l1End, Vector3 l2Start, Vector3 l2End)
	{
	    float l1x1 = l1Start.x;
	    float l1x2 = l1End.x;
	    float l1y1 = l1Start.y;
	    float l1y2 = l1End.y;
	    float l2x1 = l2Start.x;
	    float l2x2 = l2End.x;
	    float l2y1 = l2Start.y;
	    float l2y2 = l2End.y;

	    if ((((l1x1 - l2x1) * (l2y2 - l2y1) - (l1y1 - l2y1) * (l2x2 - l2x1)) *
	         ((l1x2 - l2x1) * (l2y2 - l2y1) - (l1y2 - l2y1) * (l2x2 - l2x1))) > 0 ||
	        (((l2x1 - l1x1) * (l1y2 - l1y1) - (l2y1 - l1y1) * (l1x2 - l1x1)) *
	         ((l2x2 - l1x1) * (l1y2 - l1y1) - (l2y2 - l1y1) * (l1x2 - l1x1))) > 0)
	    {
	        return false;
	    }

	    return true;
	}
}
