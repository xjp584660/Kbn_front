using UnityEngine;

public static class TransformExtensions {
    public static void SetPositionX(this Transform t, float x) {
        t.position = new Vector3(x, t.position.y, t.position.z);
    }

    public static void SetPositionY(this Transform t, float y) {
        t.position = new Vector3(t.position.x, y, t.position.z);
    }

    public static void SetPositionZ(this Transform t, float z) {
        t.position = new Vector3(t.position.x, t.position.y, z);
    }

    public static void SetLocalPositionX(this Transform t, float x) {
        t.localPosition = new Vector3(x, t.localPosition.y, t.localPosition.z);
    }

    public static void SetLocalPositionY(this Transform t, float y) {
        t.localPosition = new Vector3(t.localPosition.x, y, t.localPosition.z);
    }

    public static void SetLocalPositionZ(this Transform t, float z) {
        t.localPosition = new Vector3(t.localPosition.x, t.localPosition.y, z);
    }

    public static void IncrementPositionX(this Transform t, float deltaX) {
        t.position = new Vector3(t.position.x + deltaX, t.position.y, t.position.z);
    }

    public static void IncrementPositionY(this Transform t, float deltaY) {
        t.position = new Vector3(t.position.x, t.position.y + deltaY, t.position.z);
    }

    public static void IncrementPositionZ(this Transform t, float deltaZ) {
        t.position = new Vector3(t.position.x, t.position.y, t.position.z + deltaZ);
    }

    public static void IncrementLocalPositionX(this Transform t, float deltaX) {
        t.localPosition = new Vector3(t.localPosition.x + deltaX, t.localPosition.y, t.localPosition.z);
    }

    public static void IncrementLocalPositionY(this Transform t, float deltaY) {
        t.localPosition = new Vector3(t.localPosition.x, t.localPosition.y + deltaY, t.localPosition.z);
    }

    public static void IncrementLocalPositionZ(this Transform t, float deltaZ) {
        t.localPosition = new Vector3(t.localPosition.x, t.localPosition.y, t.localPosition.z + deltaZ);
    }

	public static void SetLocalScaleX(this Transform t, float x) {
		t.localScale = new Vector3(x, t.localScale.y, t.localScale.z);
	}

	public static void SetLocalScaleY(this Transform t, float y) {
		t.localScale = new Vector3(t.localScale.x, y, t.localScale.z);
	}

	public static void SetLocalScaleZ(this Transform t, float z) {
		t.localScale = new Vector3(t.localScale.x, t.localScale.y, z);
	}
}
