// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "Unlit/GuiTransforRotateUVsDistortion (AlphaClip)"
{
	Properties
	{
		_MainTex ("Base (RGB), Alpha (A)", 2D) = "white" {}
		_RotationSpeed ("Rotation Speed", float) = 0.0
        _Color ("Main Color", Color) = (1,1,1,1)
        _UOffset ("U Offset", float) = 0
		_VOffset ("V Offset", float) = 0
		_Power ("Power", float) = 1
		_TimeInterval ("TimeInterval", float) = 0
		_Scale ("Scale", float) = 0
		_ScaleTimeInterval ("ScaleTimeInterval", float) = 0
		
		_BumpTex ("Bump (RGB)", 2D) = "white" {}
		_Distortion ("Distortion", float) = 0.02
		_UBumpOffset ("U Bump Offset", float) = 0
		_VBumpOffset ("V Bump Offset", float) = 0
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

			Blend SrcAlpha One
			AlphaTest Greater .01
			ColorMask RGB
			Cull Back Lighting Off ZWrite Off Fog { Mode Off }
		
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#include "UnityCG.cginc"

			sampler2D _MainTex;
			float4 _MainTex_ST;
			float _RotationSpeed;
	        float4 _Color;
	        float _UOffset;
			float _VOffset;
			float _Power;
			float _TimeInterval;
			float _Scale;
			float _ScaleTimeInterval;
			
			float _Distortion;
			float _UBumpOffset;
			float _VBumpOffset;
			sampler2D _BumpTex;
			float4 _BumpTex_ST;

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
				float2 uvbump	: TEXCOORD2;
			};
			
			v2f vert (appdata_t v)
			{
				v2f o;
				o.uvbump = TRANSFORM_TEX( v.texcoord, _BumpTex );
				v.texcoord.xy -=0.5;
				float s = -sin ( _RotationSpeed * _Time );
				float c = cos ( _RotationSpeed * _Time );
				float2x2 rotationMatrix = float2x2( c, -s, s, c);
				rotationMatrix *=0.5;
				rotationMatrix +=0.5;
				rotationMatrix = rotationMatrix * 2-1;
				v.texcoord.xy = mul ( v.texcoord.xy, rotationMatrix *( 1 + sin(_Time.y*_ScaleTimeInterval) * _Scale));
				v.texcoord.xy += 0.5;

				o.vertex = UnityObjectToClipPos(v.vertex);
				o.color = v.color;
				o.texcoord = v.texcoord;
				o.worldPos = TRANSFORM_TEX(v.vertex.xy, _MainTex);
				return o;
			}

			half4 frag (v2f IN) : COLOR
			{
				// Sample the texture
				half2 bump = tex2D( _BumpTex, IN.uvbump + float2(_UBumpOffset,_VBumpOffset) * fmod(_Time.y,64) ).rg;

				half2 uvofs = bump*_Distortion;
				if (_ProjectionParams.x<0) uvofs.y = -uvofs.y;
				IN.texcoord.xy += uvofs;
				
				half4 col = tex2D (_MainTex, IN.texcoord + float2(_UOffset, _VOffset) * fmod(_Time.y,64)) * _Color;// * IN.color * _Color;
            	half p = pow(_Power, 2) * (1 + abs(sin(_Time.y*_TimeInterval)));

				float2 factor = abs(IN.worldPos);
				float val = 1.0 - max(factor.x, factor.y);

				// Option 1: 'if' statement
				//if (val < 0.0) col.a = 0.0;

				// Option 2: no 'if' statement -- may be faster on some devices
				//col.a *= ceil(clamp(val, 0.0, 1.0));

				return col * p;
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