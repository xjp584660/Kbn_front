using System;
using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// This class used to manage multiple states animated sprite.
/// </summary>
[RequireComponent(typeof(tk2dSpriteAnimator))]
public class StatesAnimatedSprite : MonoBehaviour
{
    #region Fields

    #region Public

    /// <summary>
    /// The default state of the animated sprite.
    /// </summary>
    public string DefaultState;
	
	private float characterScale = 0.7f;

    /// <summary>
    /// All aniamted sprite states.
    /// </summary>
    public List<StateAnimatePair> StateAnimatePairs = new List<StateAnimatePair>();

    #endregion

    #region Private

    /// <summary>
    /// The animated sprite reference.
    /// </summary>
    private tk2dSpriteAnimator _animatedSprite;

    /// <summary>
    /// Dictionary of all animated sprite states.
    /// </summary>
    private readonly Dictionary<string, string> _stateAnimateDic = new Dictionary<string, string>();

    /// <summary>
    /// Current state of the animated sprite.
    /// </summary>
    private string _state;

    #endregion

    #endregion

    /// <summary>
    /// Current state of the animated sprite.
    /// </summary>
    /// 
    /// 
    public void State(string animationStr)
    {
        if (animationStr == _state)
        {
            return;
        }
        if (!_stateAnimateDic.ContainsKey(animationStr))
        {
            throw new Exception("The state is not valid :" + animationStr);
        }
		
        _state = animationStr;
        var animationNames = _stateAnimateDic[animationStr].Split('-');
        var animationName = animationNames[0];
        //_animatedSprite.DefaultClipId = _animatedSprite.GetClipIdByName(animationName);
		var scale = _animatedSprite.Sprite.scale;
		scale.x = characterScale;
        if (animationNames.Length == 2)
        {
            if (animationNames[1] == "Flip")
            {
                scale.x = -characterScale;
            }
            else
            {
                throw new Exception("The state is not valid");
            }
        }
		_animatedSprite.Sprite.scale = scale;
		_animatedSprite.PlayFrom(animationName, 0);
    }

    /// <summary>
    /// Init StatesAniamtedSprite.
    /// </summary>
    protected void Awake()
    {
        _animatedSprite = GetComponent<tk2dSpriteAnimator>();
        foreach (var stateAnimate in StateAnimatePairs)
        {
            _stateAnimateDic.Add(stateAnimate.State, stateAnimate.Animate);
        }
        State(DefaultState);
    }
	
	protected void Update()
	{
		//print(_state);
	}
}
