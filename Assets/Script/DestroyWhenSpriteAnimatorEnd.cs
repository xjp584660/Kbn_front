using System.Collections;
using UnityEngine;

namespace Assets
{
    public class DestroyWhenSpriteAnimatorEnd : MonoBehaviour
    {
        #region Fields

        public bool IsSpriteAnimator;

        public float DelayDestroyTime = 0;

        #endregion

        #region Methods

        protected IEnumerator Start()
        {
            if (IsSpriteAnimator)
            {
                GetComponent<tk2dSpriteAnimator>().AnimationCompleted += (animator, clip) => Destroy(gameObject);
                yield break;
            }
            yield return new WaitForSeconds(DelayDestroyTime);
            Destroy(gameObject);
        }

        #endregion
    }
}
