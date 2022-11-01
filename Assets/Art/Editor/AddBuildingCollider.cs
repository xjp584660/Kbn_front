using UnityEngine;
using System.Collections;
using UnityEditor;

public class AddBuildingCollider
{
	[MenuItem("KBN/Tools/Add Collider To First Child")]
	public static void AddColliderToFirstChild()
	{
		foreach(var gO in UnityEditor.Selection.objects)
		{
			var originalPrefab = gO as GameObject;
			var copy = GameObject.Instantiate(originalPrefab) as GameObject;
			var child = copy.transform.GetChild(0).gameObject;
			var boxCollider = child.GetComponent<BoxCollider>();
			if(boxCollider != null)
			{
				Object.DestroyImmediate(boxCollider);
			}
			child.AddComponent<BoxCollider>();
			PrefabUtility.ReplacePrefab(copy, originalPrefab, ReplacePrefabOptions.ConnectToPrefab);
		}
	}
}
