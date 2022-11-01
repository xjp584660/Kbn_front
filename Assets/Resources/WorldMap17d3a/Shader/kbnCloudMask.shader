Shader "_KBNShaders_/kbnCloudMask" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Color ("Color (Alpha)", Color) = (1, 1, 1, 1)
	}
	SubShader {
		Tags { "Queue" = "Transparent+15" "RenderType"="Transparent" }
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
	} 
	FallBack "Diffuse"
}
