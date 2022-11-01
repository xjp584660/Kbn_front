using UnityEngine;
using System;
using System.Collections;

/*
 *
 * Known Issues : bug with BeginGroup() in parent components, 
 * you can use SetGroupPos() to adjust position offset by BeginGroup().
 * For clipping by BeginGroup(), there is no way to walk around, you can
 * adjust size of BeginGroup() ... :(
 *
 */

[Serializable]
public class AspectContainer {

	public enum AspectType {
		Off,
		LockWidth,
		LockHeight,
	}

	public UIObject uiobj;
	public Rect _rect;

	private int aspectW;
	private int aspectH;
	private AspectType aspectType = AspectType.Off;
	
	private float vScrWidth = 0.0f;
	private float vScrHeight = 0.0f;
	private float hRatio = 1.0f;
	private float vRatio = 1.0f;
	private Matrix4x4 matScale = Matrix4x4.identity;
	private float groupX = 0.0f;
	private float groupY = 0.0f;
	private float hAdjust = 0.0f;
	private float vAdjust = 0.0f;

	public Rect rect {
		set {
			_rect = value;
			updateRect();
		}
		get {
			return _rect;
		}
	}

	public void Init() {
		aspectType = AspectType.Off;
		updateRect();
	}

	public void SetAspect(int w, int h, AspectType type) {
		aspectW = w;
		aspectH = h;
		aspectType = type;
		updateRect();
	}

	public void SetGroupPos(float x, float y) {
		if (groupX != x || groupY != y) {
			groupX = x;
			groupY = y;
			updateRect();
		}
	}

	public void updateRect() {
		if (AspectType.Off == aspectType) {
			uiobj.rect = _rect;
			return;
		}
		
		float scrWidth = 0, scrHeight = 0;
		if (AspectType.LockWidth == aspectType) {
			scrWidth = 640;
			scrHeight = scrWidth * aspectH / aspectW;

		} else if (AspectType.LockHeight == aspectType) {
			scrHeight = 960;
			scrWidth = scrHeight * aspectW / aspectH;
		}

		if (vScrWidth != scrWidth || vScrHeight != scrHeight) {
			vScrWidth = scrWidth;
			vScrHeight = scrHeight;
			hRatio = scrWidth / 640;
			vRatio = scrHeight / 960;
			matScale = Matrix4x4.Scale(new Vector3(1 / hRatio, 1 / vRatio, 1));
		}
		hAdjust = groupX - groupX / hRatio;
		vAdjust = groupY - groupY / vRatio;
		uiobj.rect = new Rect(_rect.x * hRatio + hAdjust, _rect.y * vRatio + vAdjust, _rect.width * hRatio, _rect.height * vRatio);
	}

	public void Draw() {
		if (AspectType.Off == aspectType) {
			uiobj.Draw();
			return;
		}

		Matrix4x4 oldMatrix = GUI.matrix;
		GUI.matrix *= matScale;

		uiobj.Draw();

		GUI.matrix = oldMatrix;
	}
}
