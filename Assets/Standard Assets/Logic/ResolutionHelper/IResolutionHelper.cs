using UnityEngine;
using System.Collections;

public interface IResolutionHelper
{
    bool IsLargeResolution { get; }

    bool IsMiniResolution { get; }

    bool IsIphoneX { get; }

	bool IsIphoneXR{ get; }

    int ScreenWidth { get; }

    int ScreenHeight { get; }

    Vector2 ScreenToUISpace(Vector2 point);
}
