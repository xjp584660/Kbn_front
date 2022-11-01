using UnityEngine;
using System.Collections;

public class UnlockChapterEvent : MonoBehaviour {

	tk2dSpriteAnimator animator;
	// Use this for initialization
	void Start () 
	{
		animator = GetComponent<tk2dSpriteAnimator>();
		animator.AnimationEventTriggered += AnimationEventHandler;
	}

	void AnimationEventHandler(tk2dSpriteAnimator animator, tk2dSpriteAnimationClip clip, int frameNum)
	{
		KBN.GameMain.singleton.UnlockPveNextChapter_Step2();
	}
}
