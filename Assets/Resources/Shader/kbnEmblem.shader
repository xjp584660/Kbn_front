// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "_KBNShaders_/kbnEmblem" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_MaskTex ("Mask (Alpha)", 2D) = "white" {}
		
		_ShadowTex ("Shadow (RGBA)", 2D) = "white" {}
		
		_BannerColor ("Banner Color", Color) = (1, 1, 1, 1)
		_BannerUVRect ("Banner UV Rect", Vector) = (0, 0, 1, 1)
		
		_StyleColor ("Style Color", Color) = (1, 1, 1, 1)
		_StyleUVRect ("Style UV Rect", Vector) = (0, 0, 1, 1)
		
		_SymbolColor ("Symbol Color", Color) = (1, 1, 1, 1)
		_SymbolUVRect ("Symbol UV Rect", Vector) = (0, 0, 1, 1)
		
	}
	SubShader {
		Tags { "Queue" = "Transparent+4" "RenderType"="Transparent" }
		ZTest Off
		ZWrite Off
		Blend SrcAlpha OneMinusSrcAlpha
		
		Pass {
			CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			
			#include "UnityCG.cginc"
			
			uniform sampler2D _ShadowTex;
			
			v2f_img vert(appdata_img IN) {
				v2f_img OUT;
				float4 v = IN.vertex;
				v.xyz *= 1.5;
				OUT.pos = UnityObjectToClipPos(v);
				OUT.uv = MultiplyUV(UNITY_MATRIX_TEXTURE0, IN.texcoord);
				return OUT;
			}
			
			float4 frag(v2f_img IN) : COLOR {
				return tex2D(_ShadowTex, IN.uv) * 0.7;
			}
			
			ENDCG
		}
		
		Pass {
			CGPROGRAM
			#pragma vertex vert_img
			#pragma fragment frag
			
			#include "UnityCG.cginc"
			
			uniform sampler2D _MainTex;
			uniform sampler2D _MaskTex;
			
			uniform float4 _BannerColor;
			uniform float4 _BannerUVRect;
			
			uniform float4 _StyleColor;
			uniform float4 _StyleUVRect;
			
			uniform float4 _SymbolColor;
			uniform float4 _SymbolUVRect;
			
			float4 fetchTex(float2 uv, float4 uvRect) {
				return tex2D(_MainTex, float2(uvRect.x + uvRect.z * uv.x, uvRect.y + uvRect.w * uv.y));
			}
			
			float4 blendColor(float4 src, float4 dst) {
				return dst * (1 - src.a) + src * src.a;
			}
			
			float4 frag(v2f_img IN) : COLOR {
				float4 c = fetchTex(IN.uv, _BannerUVRect) * _BannerColor;
				
				float4 style = fetchTex(IN.uv, _StyleUVRect) * _StyleColor;
				c = blendColor(style, c);
				
				float4 symbol = fetchTex(IN.uv, _SymbolUVRect) * _SymbolColor;
				c = blendColor(symbol, c);
				c.a *= tex2D(_MaskTex, IN.uv).a;
				
				return c;
			}
			
			ENDCG
		}
	} 
	FallBack "Diffuse"
}
