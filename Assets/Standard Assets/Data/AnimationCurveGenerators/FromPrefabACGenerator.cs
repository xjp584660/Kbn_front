using UnityEngine;
using System.Collections;

public class FromPrefabACGenerator : MonoBehaviour, IAnimationCurveGenerator
{
    [SerializeField]
    private AnimationCurveInfo acInfo;

    public AnimationCurveInfo Generate()
    {
        return acInfo;
    }
}
