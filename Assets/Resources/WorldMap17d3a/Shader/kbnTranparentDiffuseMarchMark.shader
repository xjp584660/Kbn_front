// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "_KBNShaders_/kbnTransparentDiffuseMarchMark" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
	}
	SubShader {
		Tags { "Queue" = "Transparent+8" "RenderType"="Transparent" }
		LOD 200
		Blend SrcAlpha OneMinusSrcAlpha
		ZWrite Off
		
		pass {
			CGPROGRAM
			
			#pragma vertex vert
      		#pragma fragment frag
      		
      		#include "UnityCG.cginc"

			sampler2D _MainTex;

			struct vertexInput {
				float4 vertex : POSITION;
				float4 texcoord0 : TEXCOORD0;
				
			};

			struct fragmentInput {
				float4 _position : SV_POSITION;
				float4 texcoord0 : TEXCOORD0;
			};
			
			
			fragmentInput vert(vertexInput i) {
				fragmentInput o;
				o._position = UnityObjectToClipPos (i.vertex);
				o.texcoord0 = i.texcoord0;
				return o;
			}
			
			
			float4 frag(fragmentInput i) : COLOR {
				float4 color = tex2D( _MainTex, i.texcoord0.xy );
				return color;
			}
			ENDCG
		}
	} 
	FallBack "Diffuse"
}
