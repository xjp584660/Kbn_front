using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
/// <summary>
/// Tween the widget's depth.
/// </summary>

[RequireComponent(typeof(UIWidget))]
[AddComponentMenu("NGUI/Tween/Tween Slider")]
public class TweenSlider : UITweener {

	public float from=1;
	public float to=1;

	UISlider mWidget;

	public UISlider cachedWidget{get{if(mWidget==null) mWidget=GetComponent<UISlider>(); return mWidget;}}

	[System.Obsolete("Use 'value' instead")]
    public float num { get { return this.value; } set { this.value = value; } }

	/// <summary>
    /// Tween's current value.
    /// </summary>

    public float value { get { return cachedWidget.value; } set { cachedWidget.value = value; } }

    /// <summary>
    /// Tween the value.
    /// </summary>

    protected override void OnUpdate(float factor, bool isFinished)
    {
        value = from * (1f - factor) + to * factor;
    }

    static public TweenSlider Begin(UISlider widget, float duration, float num)
    {
        TweenSlider comp = UITweener.Begin<TweenSlider>(widget.gameObject, duration);
        //TweenDepth comp = UITweener.Begin<TweenDepth>(go, duration);
        comp.from = widget.value;
        comp.to = num;

        if (duration <= 0f)
        {
            comp.Sample(1f, true);
            comp.enabled = false;
        }
        return comp;
    }

    [ContextMenu("Set 'From' to current value")]
    public override void SetStartToCurrentValue() { from = value; }

    [ContextMenu("Set 'To' to current value")]
    public override void SetEndToCurrentValue() { to = value; }

    [ContextMenu("Assume value of 'From'")]
    void SetCurrentValueToStart() { value = from; }

    [ContextMenu("Assume value of 'To'")]
    void SetCurrentValueToEnd() { value = to; }
}
