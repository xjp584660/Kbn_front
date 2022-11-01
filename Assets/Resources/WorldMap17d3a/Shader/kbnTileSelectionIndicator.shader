Shader "_KBNShaders_/kbnTileSelectionIndicator" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Color ("Color (RBBA)", Color) = (1, 1, 1, 1)
	}
	SubShader {
		Tags { "Queue"="Transparent+4" "RenderType"="Transparent" }
//		LOD 200
		Lighting Off
		ZWrite Off
		ZTest Always
		Blend SrcAlpha OneMinusSrcAlpha
		
		Pass {
				SetTexture [_MainTex] { 
				constantColor [_Color]
				combine texture * constant
			}
		}
		
//		CGPROGRAM
//		#pragma surface surf Lambert
//
//		sampler2D _MainTex;
//
//		struct Input {
//			float2 uv_MainTex;
//		};
//
//		void surf (Input IN, inout SurfaceOutput o) {
//			half4 c = tex2D (_MainTex, IN.uv_MainTex);
//			o.Albedo = c.rgb;
//			o.Alpha = c.a;
//		}
//		ENDCG
	} 
	FallBack "Diffuse"
}
