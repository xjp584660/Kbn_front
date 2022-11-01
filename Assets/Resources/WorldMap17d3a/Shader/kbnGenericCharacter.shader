Shader "_KBNShaders_/kbnGenericCharacter" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Color ("Color (RGBA)", Color) = (1, 1, 1, 1)
		_Specular ("Specular", Range(0.01, 1)) = 0.7
		_Gloss ("Gloss", Range(0.01, 1)) = 0.7
	}
	SubShader {
		Tags { "Queue"="Transparent+6" "RenderType"="Opaque" }
		LOD 200
		Lighting On
		ZWrite On
//		Blend SrcAlpha OneMinusSrcAlpha
//		Offset 0, -100
		
//		Pass {
//			Material {
//				Diffuse [_Color]
//				Specular [_Specular]
//				Ambient [_Ambient]
//				Shininess [_Shininess]
//			}
//			SetTexture [_MainTex] {
//				combine texture * primary
//			}
//		}
		
		CGPROGRAM
		#pragma surface surf BlinnPhong

		sampler2D _MainTex;
		float4 _Color;
		float _Specular;
		float _Gloss;

		struct Input {
			float2 uv_MainTex;
		};

		void surf (Input IN, inout SurfaceOutput o) {
			half4 c = tex2D (_MainTex, IN.uv_MainTex);
			o.Albedo = c.rgb * _Color;
			o.Specular = 10;
			o.Gloss = _Gloss;
			o.Alpha = c.a;
		}
		ENDCG
	} 
	FallBack "Diffuse"
}
