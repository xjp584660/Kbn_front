using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class FoldablePanel : UIObject {

	public enum FoldingDirection {
		LEFT,
		RIGHT,
		UP,
		DOWN
	};

	public enum Status {
		UNFOLDED,
		FOLDED,
		ANIMATING
	};

	private const float transThreshold = 0.01f;
	
	public Rect visibleBorder;

	public float foldingDuration = 0.5f;
	public float unfoldingDuration = 0.5f;
	public float elasticAmplitude = 0.0f;
	public float elasticPeriod = 0.9f;
	public Vector2 innerTrans = Vector2.zero;

	public List<UIObject> children;  // if need make sure z-order, manually edit this in Inspector

	public Status status { get; protected set; }
	public override void Init() {
		base.Init();

		if (null == children) children = new List<UIObject>();

		if (children.Count == 0) {
			foreach(Transform t in transform) {
				UIObject obj = t.GetComponent<UIObject>();
				if (null != obj)
					children.Add(obj);
			}
		}

		if (innerTrans.magnitude <= transThreshold)
			status = Status.UNFOLDED;
		else
			status = Status.FOLDED;
	}

	public void Fold(FoldingDirection direction) {
		Fold(direction, 0.0f);
	}

	public void Fold(FoldingDirection direction, float delay) {
		
	}

	public void Unfold() {
		Unfold(0.0f);
	}

	public void Unfold(float delay) {
		
	}

	// events
	protected virtual void OnUnfold() {
		SetVisible(true);
		status = Status.ANIMATING;
	}
	
	protected virtual void OnFold() {
		status = Status.ANIMATING;
	}

	protected virtual void OnUnfolded() {
		status = Status.UNFOLDED;
	}

	protected virtual void OnFolded() {
		status = Status.FOLDED;
		SetVisible(false);
	}


	public void Toggle(FoldingDirection direction = FoldingDirection.LEFT) {
		if (status == Status.FOLDED)
			Unfold();
		else if (status == Status.UNFOLDED)
			Fold(direction);
	}

	public override void Update() {
//		if (innerTrans.magnitude <= transThreshold) innerTrans = Vector2.zero;
	}

	public override int Draw() {

		if (!visible) return -1;

		Rect outerRect = rect;
		outerRect.x -= visibleBorder.x;
		outerRect.y -= visibleBorder.y;
		outerRect.width += visibleBorder.width + visibleBorder.x;
		outerRect.height += visibleBorder.height + visibleBorder.y;
		GUI.BeginGroup(outerRect); // outer box

		Rect transRect = rect;
		transRect.x = innerTrans.x;
		transRect.y = innerTrans.y;
		GUI.BeginGroup(transRect); // inner panel

		// inner componenets
		foreach (UIObject child in children) {
			child.Draw();
		}

		GUI.EndGroup(); // inner panel

		GUI.EndGroup(); // outer box

		return 0;
	}

	public void UnfoldByStatus() {
		if (status == Status.FOLDED)
			Unfold();
	}

	public void FoldByStatus(FoldingDirection direction) {
		if (status == Status.UNFOLDED)
			Fold(direction);
	}
}
