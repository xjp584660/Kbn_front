// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "_KBNShaders_/kbnMarchOutLight" {
	Properties {
		_MainTex  ("Base (RGB)", 2D) = "white" {}
		_Color    ("Color", Color) = (1, 1, 1, 1)
		_Color2   ("Color", Color) = (1, 1, 1, 1)
		_Progress ("Progress", Range(0, 1)) = 0
	}
	SubShader {
		Tags { "Queue"="Transparent+6" "RenderType"="Transparent" }
		Lighting Off
		ZWrite Off
		ZTest Always
		Blend SrcAlpha OneMinusSrcAlpha
		
		Pass {
			CGPROGRAM
// Upgrade NOTE: excluded shader from DX11 and Xbox360; has structs without semantics (struct v2f members uv2)
#pragma exclude_renderers d3d11 xbox360
			#pragma vertex vert
			#pragma fragment frag
			#include "UnityCG.cginc"
			
			sampler2D _MainTex;
			
			float4 _Color;
			float4 _Color2;
			
			float4 _MainTex_ST;
			
			float _Progress;
			
			struct v2f {
				float4 position	: SV_POSITION;
				float2 uv		: TEXCOORD0;
				float4 uv2		: TEXCOORD1;
			};
			
			v2f vert(appdata_base i) {
				v2f o;
				
				o.position = UnityObjectToClipPos(i.vertex);
				o.uv = i.texcoord.xy;
				o.uv = TRANSFORM_TEX(i.texcoord, _MainTex);
				o.uv2 = i.texcoord;
				
				return o;
			}
			
			float4 frag(v2f i) : COLOR {
				float4 c = tex2D(_MainTex, i.uv.xy);
				float k = step(_Progress, i.uv2.x);
				c = c * (k * _Color + (1 - k) * _Color2);
				
				float x = min(i.uv2.x, 1 - i.uv2.x);
				float r = 1.0 / _MainTex_ST.x * 2;
				c.a = c.a * smoothstep(0, r, x);
				
				return c;
			}
			
			ENDCG
		}
	}
	
	FallBack "Diffuse"
}
