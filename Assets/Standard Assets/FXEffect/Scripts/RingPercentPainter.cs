//using UnityEngine;
//using System.Collections;

public class RingPercentPainter
{
	private float _percent;
	private float _radians;
	private UnityEngine.Texture2D _tex;
	private bool _isNeedSetTex;
	private bool _isNeedSetRadians;

	private UnityEngine.Material _material;

	public RingPercentPainter()
	{
		UnityEngine.Shader sd = UnityEngine.Shader.Find("Script/RingPercentPainter");
		_material = new UnityEngine.Material(sd);
	}

	public float Percent
	{
		set
		{
			if ( System.Math.Abs(_percent - value) < 0.001f )
				return;

			_percent = value;
			if ( _percent > 1.0f )
				_percent = 1.0f;
			_radians = _percent * (float)System.Math.PI * 2.0f;
			if ( _percent > 0 )
			{
				_isNeedSetRadians = true;
			}
		}

		get
		{
			return _percent;
		}
	}

	public UnityEngine.Texture2D Tex
	{
		get
		{
			return _tex;
		}

		set
		{
			if ( _tex == value )
				return;
			_tex = value;
			_isNeedSetTex = true;
		}
	}

	public void DrawTexture(UnityEngine.Rect rect)
	{
		if ( _percent <= 0.0f )
			return;
		if ( _isNeedSetRadians )
		{
			_material.SetFloat("_Radians", _radians);
			_isNeedSetRadians = false;
		}
		if ( _isNeedSetTex )
		{
			_material.SetTexture("_MainTex", _tex);
			_isNeedSetTex = false;
		}
		UnityEngine.Graphics.DrawTexture(rect, _tex, _material);
	}
}
