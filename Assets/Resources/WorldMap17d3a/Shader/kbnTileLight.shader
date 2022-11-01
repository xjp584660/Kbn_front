Shader "_KBNShaders_/kbnTileLight" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Color ("Color (RBBA)", Color) = (1, 1, 1, 1)
		_HighlightFactor ("Highlight Factor", Float) = 1
	}
	SubShader {
		Tags { "Queue"="Transparent" "RenderType"="Transparent" }
//		LOD 200
		Lighting Off
		ZWrite Off
		ZTest Always
		Blend SrcAlpha OneMinusSrcAlpha
		
//		Pass {
//			SetTexture [_MainTex] { combine texture }
//		}
		
		Pass {
			CGPROGRAM
			#pragma vertex vert_img
			#pragma fragment frag
			#include "UnityCG.cginc"
			
			sampler2D _MainTex;
			float4 _Color;
			float _HighlightFactor;
			
			half4 frag(v2f_img i) : COLOR {
				half4 c = tex2D (_MainTex, i.uv);
				float a = abs(i.uv.y - i.uv.x);
				float b = abs(i.uv.y + i.uv.x - 1);
				
				c *= _Color;
				
				if (a < 0.5 && b < 0.5)
					c.rgb *= _HighlightFactor;
					
				return c;
			}
			
			ENDCG
		}
		
//		CGPROGRAM
//		#pragma surface surf NoLighting
//
//		sampler2D _MainTex;
//		float4 _Color;
//		float _HighlightFactor;
//
//		struct Input {
//			float2 uv_MainTex;
//		};
//		
//		half4 LightingNoLighting (SurfaceOutput s, half3 lightDir, half atten) {
//			return half4(s.Albedo * 0.5, s.Alpha);
//		}
//
//		void surf (Input IN, inout SurfaceOutput o) {
//			half4 c = tex2D (_MainTex, IN.uv_MainTex);
//			float a = abs(IN.uv_MainTex.y - IN.uv_MainTex.x);
//			float b = abs(IN.uv_MainTex.y + IN.uv_MainTex.x - 1);
//			
//			o.Albedo = c.rgb * _Color;
//			o.Alpha = c.a;
//			
//			if (a < 0.5 && b < 0.5)
//				o.Albedo *= _HighlightFactor;
//		}
//		ENDCG
	} 
	FallBack "Diffuse"
}
