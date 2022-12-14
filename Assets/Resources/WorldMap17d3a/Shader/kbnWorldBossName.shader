Shader "_KBNShaders_/kbnWorldBossName" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_Color ("Color (RBBA)", Color) = (1, 1, 1, 1)
	}
	SubShader {
		Tags { "Queue"="Transparent+13" "RenderType"="Transparent" }

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
	} 
	FallBack "Diffuse"
}
