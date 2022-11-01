// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "Unlit/GuiAirDistortionMask"
{
	Properties
	{
		_MainTex ("Main (RGB)", 2D) = "white" {}
		_BumpTex ("Bump (RGB)", 2D) = "white" {}
		_MaskTex ("Mask (RGB)", 2D) = "white" {}
		_Distortion ("Distortion", float) = 0.02
		_UOffset ("U Offset", float) = 0
		_VOffset ("V Offset", float) = 0
	}

	SubShader
	{
		LOD 200

		Tags
		{
			"Queue" = "Transparent"
			"IgnoreProjector" = "True"
			"RenderType" = "Transparent"
		}

		Pass
		{
			Cull Off
			Lighting Off
			ZWrite Off
			Offset -1, -1
			Fog { Mode Off }
			ColorMask RGB
			Blend SrcAlpha OneMinusSrcAlpha
		
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma fragmentoption ARB_precision_hint_fastest
			#include "UnityCG.cginc"

			sampler2D _MainTex;
			float _Distortion;
			float _UOffset;
			float _VOffset;
			sampler2D _BumpTex;
			sampler2D _MaskTex;
			float4 _MainTex_ST;
			float4 _BumpTex_ST;
			float4 _MaskTex_ST;

			struct appdata_t
			{
				float4 vertex : POSITION;
				half4 color : COLOR;
				float2 texcoord : TEXCOORD0;
			};

			struct v2f
			{
				float4 vertex : POSITION;
				half4 color : COLOR;
				float2 texcoord : TEXCOORD0;
				float2 worldPos : TEXCOORD1;
								
				float4 uvgrab : TEXCOORD2;
				float2 uvmain : TEXCOORD3;
				float2 uvmask : TEXCOORD4;

			};

			v2f vert (appdata_t v)
			{
				v2f o;
				o.vertex = UnityObjectToClipPos(v.vertex);
				o.color = v.color;
				o.texcoord = v.texcoord;
				o.worldPos = TRANSFORM_TEX(v.vertex.xy, _MainTex);
				o.uvmask = TRANSFORM_TEX( v.texcoord, _MaskTex );
				o.uvmain = TRANSFORM_TEX( v.texcoord, _BumpTex );
				return o;
			}

			half4 frag (v2f i) : COLOR
			{
				half2 mask = tex2D( _MaskTex, i.uvmask );
				half2 bump = tex2D( _BumpTex, i.uvmain + float2(_UOffset,_VOffset) * fmod(_Time.y,64) ).rg;
				bump*=mask;
				half2 uvofs = bump*_Distortion;
				if (_ProjectionParams.x<0) uvofs.y = -uvofs.y;
				i.texcoord.xy += uvofs;
				half4 col = tex2D( _MainTex, i.texcoord.xy ) * i.color;

//				float2 factor = abs(i.worldPos);
//				float val = 1.0 - max(factor.x, factor.y);
//
//				if (val < 0.0) col.a = 0.0;

				return col;
			}
			ENDCG
		}
	}
	
	SubShader
	{
		LOD 100

		Tags
		{
			"Queue" = "Transparent"
			"IgnoreProjector" = "True"
			"RenderType" = "Transparent"
		}
		
		Pass
		{
			Cull Off
			Lighting Off
			ZWrite Off
			Fog { Mode Off }
			ColorMask RGB
			AlphaTest Greater .01
			Blend SrcAlpha OneMinusSrcAlpha
			ColorMaterial AmbientAndDiffuse
			
			SetTexture [_MainTex]
			{
				Combine Texture * Primary
			}
		}
	}
}