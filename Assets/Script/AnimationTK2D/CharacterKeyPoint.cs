using UnityEngine;
#if UNITY_EDITOR
using UnityEditor;
#endif
using System.Collections;
using System.Collections.Generic;

[ExecuteInEditMode]
public class CharacterKeyPoint : MonoBehaviour 
{
	[HideInInspector]
	public List<CharacterKeyPoint> froms = new List<CharacterKeyPoint>();
	
	public CharacterKeyPoint[] to;
	
	void Start ()
	{
		
	}
	
	public CharacterKeyPoint RandomNext()
	{
		List<CharacterKeyPoint> nextList = new List<CharacterKeyPoint>();
		
		if (this.to != null)
		{
			foreach (CharacterKeyPoint kp in this.to)
			{
				if (kp != null && !nextList.Contains(kp))
				{
					nextList.Add(kp);
				}
			}
		}
		
		if (this.froms != null)
		{
			foreach (CharacterKeyPoint kp in this.froms)
			{
				if (kp != null && !nextList.Contains(kp))
				{
					nextList.Add(kp);
				}
			}
		}
		
		nextList.Add(this);
		
		int idx = UnityEngine.Random.Range(0, nextList.Count);
		return nextList[idx];
	}
	
	void Update () 
	{
			
	}

#if UNITY_EDITOR
	void OnDrawGizmos ()
	{
		float len = 0.2f;
		
		Vector3 x = new Vector3(len, 0, 0);
		Vector3 y = new Vector3(0, 0, len);
		
		Gizmos.color = Color.red;
		Gizmos.matrix = this.gameObject.transform.localToWorldMatrix;
		Gizmos.DrawLine(-x, x);
		Gizmos.DrawLine(-y, y);
		
		GUIStyle style = new GUIStyle();
		style.normal.textColor = Color.red;
		
		Matrix4x4 oriMatrix = Handles.matrix;
		Handles.matrix = this.transform.localToWorldMatrix;
		Handles.Label(Vector3.zero, this.name, style);
		Handles.matrix = oriMatrix;
	}
#endif	
}
