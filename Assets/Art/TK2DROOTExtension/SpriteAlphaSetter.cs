using UnityEngine;

/// <summary>
/// Set sprite alpha.
/// </summary>
[RequireComponent(typeof(tk2dBaseSprite))]
public class SpriteAlphaSetter : MonoBehaviour
{
    #region Fields

    #region Public

    /// <summary>
    /// Alpha of sprite to be set.
    /// </summary>
    public float Alpha = 1.0f;

    #endregion

    #region Private

    /// <summary>
    /// Base sprite.
    /// </summary>
    private tk2dBaseSprite _baseSprite;

    #endregion

    #endregion

    #region Methods

    /// <summary>
    /// Awake is called when the script instance is being loaded.
    /// </summary>
    protected void Awake()
    {
        _baseSprite = GetComponent<tk2dBaseSprite>();
    }

    /// <summary>
    /// Update is called every frame, if the MonoBehaviour is enabled.
    /// </summary>
    protected void Update()
    {
		if (_baseSprite == null)
			return;
		
        if (Mathf.Abs(Alpha - _baseSprite.color.a) < Mathf.Epsilon)
        {
            return;
        }
        var c = _baseSprite.color;
        c.a = Alpha;
        _baseSprite.color = c;
    }

    #endregion
}
