using UnityEngine;
using System.Collections;
using System;

using Random = UnityEngine.Random;

/// <summary>
/// Rect shaker, implementing a random shaking pattern for UnityEngine.Rect
/// </summary>
public class RectShaker : object {
    private Rect originalRect;
    private Vector2 posDelta;
    private float radius;
    private float scale;
    private float period;
    private int count;
    private float time;
    private Action onComplete;

    // Excluding the scaling, which will be returned as another property
    public Rect CurrentRect { get; private set; }

    // The current scaling factor, Returned separately for easier usage in our UI framework
    public float CurrentScaleFactor { get; private set; }

    public bool IsPlaying { get; private set; } 

    public void Init(Rect originalRect, float radius, float scale, float period, int count, Action onComplete) {
        this.originalRect = originalRect;
        this.radius = radius;
        this.period = period;
        this.scale = scale;
        this.count = count;
        this.onComplete = onComplete;
    }

    public void Update() {
        if (!IsPlaying) { return; }

        time += Time.deltaTime;
        if (time > period) {
            time = time % period;
            --count;
 
            if (count <= 0) {
                IsPlaying = false;
                CurrentRect = originalRect;
                CurrentScaleFactor = 1;
                if (onComplete != null) {
                    onComplete();
                }
                return;
            }
            posDelta = NewTarget();
        }

        float factor = 1 - Mathf.Cos(2 * Mathf.PI / period * time);
        CurrentScaleFactor = 1 + (scale - 1) * factor;
        CurrentRect = new Rect(originalRect.x + posDelta.x * factor,
                               originalRect.y + posDelta.y * factor,
                               originalRect.width,
                               originalRect.height);
    }

    public void Play() {
        CurrentRect = originalRect;
        posDelta = NewTarget();
        IsPlaying = true;
    }

    private Vector2 NewTarget() {
        float theta = Random.Range(0, 2 * Mathf.PI);
        return new Vector2(radius * Mathf.Cos(theta), radius * Mathf.Sin(theta));
    }

    public void Stop() {
        IsPlaying = false;
    }
}
