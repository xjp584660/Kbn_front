using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// This class is for manage child animated sprites.
/// </summary>
public class AnimatedSpritesManage : MonoBehaviour
{
    #region Fields

    #region Public

    /// <summary>
    /// The default state of this game object.
    /// </summary>
    public string DefaultState;

    /// <summary>
    /// The animated sprites to be managed.
    /// </summary>
    public List<tk2dSpriteAnimator> AnimatedSpriteList = new List<tk2dSpriteAnimator>();

    /// <summary>
    /// The default state of this game object.
    /// </summary>
    public List<AnimatedSpriteInfo> AnimatedSpriteInfoList = new List<AnimatedSpriteInfo>();

	public GameObject effect;

    #endregion

    #region Private

    /// <summary>
    /// Current state of this game object.
    /// </summary>
    private string _state;

    #endregion

    #endregion

    #region Properties

    /// <summary>
    /// Current state of this game object.
    /// </summary>
    public string State
    {
        get { return _state; }
    }

    #endregion

    #region Methods
	
	#region Public
	
	public void SetState(string state)
	{
		if (_state == state)
		{
			if(effect != null)
			{
				effect.SetActive(false);
			}
			return;
		}
		_state = state;
		var count = AnimatedSpriteInfoList.Count;
		for (var i = 0; i != count; ++i)
		{
            var animatedSpriteInfo = AnimatedSpriteInfoList[i];
            var animatedSprite = AnimatedSpriteList[i];
            if (animatedSpriteInfo.ValidStates.Contains(_state))
            {
                animatedSprite.GetComponent<Renderer>().enabled = true;
                animatedSprite.Play();
				if(effect != null)
				{
					effect.SetActive(true);
				}
            }
            else
            {
                animatedSprite.StopAndResetFrame();
                if (animatedSpriteInfo.DeactiveWhenInvalidStates)
                {
                    animatedSprite.GetComponent<Renderer>().enabled = false;
                }
				if(effect != null)
				{
					effect.SetActive(false);
				}
            }
        }
    }
	
	#endregion

    #region Protected

    /// <summary>
    /// Called when recover all animated sprites children.
    /// </summary>
    protected void Awake()
    {
        if (string.IsNullOrEmpty(DefaultState))
        {
            return;
        }
		SetState(DefaultState);
    }

    #endregion

    #endregion
}
