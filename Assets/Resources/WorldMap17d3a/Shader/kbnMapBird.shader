Shader "_KBNShaders_/kbnMapBird" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Color ("Color (RGBA)", Color) = (1, 1, 1, 1)
	}
	SubShader {
		Tags { "Queue" = "Transparent+13" "RenderType"="Transparent" }
		LOD 200
		ZWrite Off
		Lighting Off
		Blend SrcAlpha OneMinusSrcAlpha
		
		Pass {
			SetTexture [_MainTex] {
				constantColor [_Color]
				combine texture * constant
			}
		}
	} 
	FallBack "Diffuse"
}
