using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

public class MaterialMgr : MonoBehaviour {

	private Dictionary<string, Material> table = new Dictionary<string, Material>();

	public Shader sharedShader;
	public static MaterialMgr instance { get; private set; }

	void OnEnable() {
		if (null != instance)
			KBN._Global.LogError("Multiple MaterialMgr Enabled!!!!");

		instance = this;
	}

	void OnDisable() {
		instance = null;
	}

	public void SetTextureWithSameMaterial(Renderer renderer, string texName, string texType, Shader shader = null) {
		if (table.ContainsKey(texName)) {
			//renderer.material = table[texName];
			renderer.sharedMaterial = table[texName];
			return;
		}
		renderer.material = new Material((shader == null) ? sharedShader : shader);
		renderer.material.mainTexture = TextureMgr.instance().LoadTexture(texName, texType);
		table.Add(texName, renderer.material);
	}

}
