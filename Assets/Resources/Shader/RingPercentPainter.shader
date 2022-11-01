// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "Script/RingPercentPainter"
{
	Properties
	{
		_MainTex("mainTexture", 2D) = "white"{}
		_Radians("radians", Range(0.0000, 6.28318)) = 0.0
        _MainColor("mainColor", COLOR) = (1, 1, 1, 1)
	}
	SubShader
	{
		Tags { "RenderType"="Transparent" }
		//LOD 200
		Pass
		{
			Blend SrcAlpha OneMinusSrcAlpha
			CGPROGRAM
			#pragma vertex vertEnter
			#pragma fragment fragEnter
			#include "UnityCG.cginc"

			uniform sampler2D _MainTex;
			uniform float _Radians;
            uniform float4 _MainColor;
			struct v2f
			{
				float4 pos: SV_POSITION;
				float2 uv : TEXCOORD0;
			};
			//float4 _MainTex_ST;
			v2f vertEnter(appdata_base v)
			{
				v2f o;
				o.pos = UnityObjectToClipPos(v.vertex);
				o.uv = v.texcoord.xy;//TRANSFORM_TEX(v.texcoord, _MainTex);
				return o;
			}
			
			bool compare_pos(float2 s, float2 t)
			{
				s = normalize(s);
				if ( s.x >= 0 )
				{
					if ( t.x <= 0 )
						return true;
					return s.y > t.y;
				}

				if ( t.x > 0 )
					return false;

				return s.y < t.y;
			}

			float4 fragEnter(v2f i) : COLOR
			{
				if ( !compare_pos(i.uv - float2(0.5f, 0.5f), float2(sin(_Radians), cos(_Radians))) )
					discard;
				//return float4(1.0f, 0.0f, 0.0f, 1.0f);
				return tex2D(_MainTex, i.uv) * _MainColor;
			}
			ENDCG
		}
	}
}
