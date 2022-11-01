Shader "_KBNShaders_/kbnFlag" {
	Properties {
		_Color ("Main Color", Color) = (1,1,1,1)
		_MainTex ("Base (RGB) Trans (A)", 2D) = "white" {}
	}

	SubShader {
		Tags {"Queue"="Transparent+7" "RenderType"="Transparent"}
	//	LOD 200
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
	//CGPROGRAM
	//#pragma surface surf Lambert alpha
	//
	//sampler2D _MainTex;
	//fixed4 _Color;
	//
	//struct Input {
	//	float2 uv_MainTex;
	//};
	//
	//void surf (Input IN, inout SurfaceOutput o) {
	//	fixed4 c = tex2D(_MainTex, IN.uv_MainTex) * _Color;
	//	o.Albedo = c.rgb;
	//	o.Alpha = c.a;
	//}
	//ENDCG
	}

Fallback "Transparent/VertexLit"
}
