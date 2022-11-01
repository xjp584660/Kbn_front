Shader "_KBNShaders_/kbnCloudLv3" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Color ("Color (Alpha)", Color) = (1, 1, 1, 1)
	}
	SubShader {
		Tags { "Queue" = "Transparent+14" "RenderType"="Transparent" }
		LOD 200
		ZWrite Off
		Lighting Off
		Blend SrcAlpha OneMinusSrcAlpha
		
		Pass {
			SetTexture [_MainTex] {
				constantColor [_Color]
				combine texture, texture * constant
			}
		}
		
//		CGPROGRAM
//		#pragma surface surf Lambert
//
//		sampler2D _MainTex;
//		float _Alpha;
//
//		struct Input {
//			float2 uv_MainTex;
//		};
//
//		void surf (Input IN, inout SurfaceOutput o) {
//			half4 c = tex2D (_MainTex, IN.uv_MainTex);
//			o.Albedo = c.rgb;
//			o.Alpha = c.a * _Alpha;
//		}
//		ENDCG
	} 
	FallBack "Diffuse"
}
