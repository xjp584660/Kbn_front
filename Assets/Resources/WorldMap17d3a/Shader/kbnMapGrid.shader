Shader "_KBNShaders_/kbnMapGrid" {
	Properties {
//		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Color ("Color (RGBA)", Color) = (1, 1, 1, 0.3)
	}
	SubShader {
		Tags { "Queue"="Transparent+3" "RenderType"="Transparent" }
//		LOD 200
		Lighting Off
		ZWrite Off
		ZTest Always
		Blend SrcAlpha OneMinusSrcAlpha
		
		Pass {
			Color [_Color]
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
////			half4 c = tex2D (_MainTex, IN.uv_MainTex);
//			o.Albedo = half3(1.0, 1.0, 1.0);
//			o.Alpha = 0.3;
//		}
//		ENDCG
	} 
	FallBack "Diffuse"
}
