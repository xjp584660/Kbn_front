using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;

/*
 * This system works in a non-straightforword way.
 * if MainChrome is refactored some day, 
 * this system should be considered to be replaced by a 
 * simpler one.
 * 
 * This system works by inserting a layer (HidableElement) 
 * between UIElementMgr and real UI objects
 * to avoid position correcting or hit testing by UIElementMgr 
 * and manipulating positions or alphas of UI objects itself.
 */

class HidableElement : IUIElement {
	private IUIElement mRealElement;
	private ObjType mType;
	private Rect mRect;
	private bool mHiding;
	private bool mHijackRect;

	public enum ObjType {
		TUIObject,
		TUIElement,
		TTile,
	}

	public HidableElement(IUIElement realElement, ObjType type) {
//		if (null == realElement) throw new Exception();
		mRealElement = realElement;
		mType = type;
		mRect = realElement.rect;
		mHiding = false;
		mHijackRect = false;
		alpha = 1.0f;
	}

	public void Draw ()
	{
		// avoid UI object (like Buttons) being clicked
		if (mHiding && Event.current.type != EventType.Repaint) 
			return;

		// set alpha
		Color oldColor = GUI.color;
		Color t = GUI.color;
		t.a *= alpha;
		GUI.color = t;

		mRealElement.Draw();

		GUI.color = oldColor;
	}

	public object RealObj {
		get {
			return mRealElement.RealObj;
		}
	}

	public float alpha { get; set; }

	public Rect realRect {
		get
		{
			return mRealElement.rect;
		}
		set
		{
			mRealElement.rect = value;
		}
	}

	public bool Hiding 
	{
		get 
		{
			return mHiding;
		}
		set
		{
			if (mHiding && !value)
				HijackRect = false;
			mHiding = value;
		}
	}

	public bool HijackRect
	{
		get
		{
			return mHijackRect;
		}
		set
		{	
			if (!mHiding) return;

			bool restore = mHijackRect && !value;
			bool backup = !mHijackRect && value;

			mHijackRect = value;

			// restore RealObj's rect to UIElementMgr's value
			if (restore) mRealElement.rect = mRect;
			if (backup) mRect = mRealElement.rect;
		}
	}

	public Rect rect {
		get {
			if (!mHijackRect) mRect = mRealElement.rect;
			return mRect;
		}
		set {
			mRect = value;

			// avoid RealObj's rect being modified by UIElementMgr.reorder() when hiding
			if (!mHijackRect) mRealElement.rect = mRect;
		}
	}

	public bool IsShow {
		get {
			// avoid being "hit" by UIElementMgr when hiding
			// Draw() will be called still
			if (mHiding) return false;

			return mRealElement.IsShow;
		}
	}

	public FontSize FontSizeEnum {
		set {
			mRealElement.FontSizeEnum = value;
		}
	}

	public FontType FontTypeEnum {
		set {
			mRealElement.FontTypeEnum = value;
		}
	}

	public FontColor NormalTextColorEnum {
		set {
			mRealElement.NormalTextColorEnum = value;
		}
	}

	public TextAnchor Alignment {
		get {
			return mRealElement.Alignment;
		}
		set {
			mRealElement.Alignment = value;
		}
	}

	public string Text {
		get {
			return mRealElement.Text;
		}
		set {
			mRealElement.Text = value;
		}
	}
}

public class MainChromeIconHider : MonoBehaviour {

	public List<string>     affectedElements;
	public List<Vector2>    hidingDirection;
	public List<float>      targetAlpha;

	private Dictionary<string, int> config;
	private HidableElement[] agents;	

	private HidableElement tryCreateHidableAgent(AgentElement agent) {
		if (null == agent) 
			return null;
		HidableElement t = tryCreateHidableAgent(agent.RealElement);
		if (null == t) 
			return null;
		agent.RealElement = t;
		return t;
	}

	private HidableElement tryCreateHidableAgent(IUIElement elem) {
		if (null == elem) 
			return null;

		if (null != elem as CUIWithUIObject) {
			UIObject obj = elem.RealObj as UIObject;
			if (null == obj) 
				return null;
			return new HidableElement(elem, HidableElement.ObjType.TUIObject);
		} else if (null != elem as CUIWithUIElement) {
			UIElement obj = elem.RealObj as UIElement;
			if (null == obj) 
				return null;
			return new HidableElement(elem, HidableElement.ObjType.TUIElement);
		} else if (null != elem as CUIWithTile) {
			Tile obj = elem.RealObj as Tile;
			if (null == obj) 
				return null;
			return new HidableElement(elem, HidableElement.ObjType.TTile);
		} else if (null != elem as SimpleLabelImple) {
			UIElement obj = elem.RealObj as UIElement;
			if (null == obj) 
				return null;
			return new HidableElement(elem, HidableElement.ObjType.TUIElement);
		} else if (null != elem as SimpleButtonImple) {
			UIElement obj = elem.RealObj as UIElement;
			if (null == obj) 
				return null;
			return new HidableElement(elem, HidableElement.ObjType.TUIElement);
		}
		
		return null;
	}

	public void Add(List<IUIElement> elements, bool clear) {
		if (null == config) {
			config = new Dictionary<string, int>();
			for (int i = 0; i < affectedElements.Count; i++) {
				config.Add(affectedElements[i], i);
			}
		}

		if (clear || null == agents) agents = new HidableElement[affectedElements.Count];
		if (clear) mState = State.NORMAL;

		for (int i = 0; i < elements.Count; i++) {
			AgentElement oldAgent = elements[i] as AgentElement;
			if (null == oldAgent || !config.ContainsKey(oldAgent.RefName)) continue;
			HidableElement agent = tryCreateHidableAgent(oldAgent);
			if (null != agent)
				agents[config[oldAgent.RefName]] = agent;
		}
	}

	public IUIElement Set(string name, IUIElement elem) {
		if (null == config || !config.ContainsKey(name)) 
			return null;
		// elem could be null
		HidableElement t = tryCreateHidableAgent(elem);
		agents[config[name]] = t;
		return t;
	}

	public IUIElement Get(string name) {
		if (null == config || !config.ContainsKey(name))
			return null;
		return agents[config[name]];
	}

	private enum State {
		NORMAL,
		HIDED,
		HIDING,
		UNHIDING,
	};

	private State mState;

	public void Hide() {
		return;
		if (null == agents || 0 == agents.Length) return;
		if (mState != State.NORMAL) return;

		for (int i = 0; i < agents.Length; i++) {
			if (null != agents[i]) agents[i].Hiding = true;
		}

		playHidingAnimation();
	}

	public void Unhide() {
		if (null == agents || 0 == agents.Length) return;
		if (mState != State.HIDED) return;

		playUnhidingAnimation();
	}

	public bool onlyTriggerOnEdge = false;

	public void MapMoved(bool onEdge) {
		if (onlyTriggerOnEdge && !onEdge)
			return;

		if (mState == State.NORMAL) {
			Hide();
		} else if (mState == State.HIDED) {
			startTime = Time.realtimeSinceStartup;
		} else if (mState == State.UNHIDING) {
			rehide = true;
		}
	}

	public float hidingTime = 2.0f;
	private float startTime = 0.0f;
	private bool rehide = false;

	// called by MainChrome
	public void Update() {
		if (mState == State.NORMAL) {
			if (rehide) {
				rehide = false;
				Hide();
			}
		} else if (mState == State.HIDED) {
			if (Time.realtimeSinceStartup - startTime >= hidingTime)
			{
				Unhide();
			}
		}
	}

	#region animation part

	public float animationDuration = 1.0f;

	private void playHidingAnimation() {
		if (mState != State.NORMAL) return;
		
	}

	private void onHidingFinished() {
		mState = State.HIDED;
		startTime = Time.realtimeSinceStartup;
	}

	private void playUnhidingAnimation() {
		if (mState != State.HIDED) return;
		
		
	}

	private void onUnhidingFinished() {
		mState = State.NORMAL;

		for (int i = 0; i < agents.Length; i++) {
			if (null != agents[i]) agents[i].Hiding = false;
		}
	}

	#endregion
}
