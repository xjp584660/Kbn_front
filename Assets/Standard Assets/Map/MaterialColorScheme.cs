using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class MaterialColorScheme : MonoBehaviour {

	public static MaterialColorScheme instance { get; private set; }

	void OnEnable() {
		if (null != instance)
			KBN._Global.LogError("Multiple MaterialColorScheme Enabled!!!!");
		instance = this;
	}

	void OnDisalbe() {
		instance = null;
	}

	private bool _useScheme;
	public bool useScheme {
		get {
			return debugSwitch || _useScheme;
		}
		set {
			_useScheme = value;
		}
	}
	public bool debugSwitch = false;
	public Color defaultColor;
	public List<string> tags;
	public List<Color> colors;
	private Dictionary<string, Color> scheme = new Dictionary<string, Color>();

	void Awake() {
		scheme.Clear();
		for (int i = 0; i < tags.Count; i++) {
			if (i < colors.Count)
				scheme.Add(tags[i], colors[i]);
		}
	}

	public void ApplyColorScheme(Renderer renderer, string tag) {
		if (!useScheme) 
			return;

#if UNITY_EDITOR
		renderer.material.color = scheme.ContainsKey(tag) ? scheme[tag] : defaultColor;
#else
		renderer.sharedMaterial.color = scheme.ContainsKey(tag) ? scheme[tag] : defaultColor;
#endif
	}

	public void ApplyColorScheme(GameObject go, string tag) {
		if (!useScheme) 
			return;

		Renderer[] renderers = go.GetComponentsInChildren<Renderer>();
		for (int i = 0; i < renderers.Length; i++)
			ApplyColorScheme(renderers[i], tag);
	}
}
