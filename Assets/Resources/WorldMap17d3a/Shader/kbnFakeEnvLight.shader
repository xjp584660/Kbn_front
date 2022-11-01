// Upgrade NOTE: replaced '_Object2World' with 'unity_ObjectToWorld'
// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "_KBNShaders_/kbnFakeEnvLight" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_SecondaryTex ("Secondary (RGBA)", 2D) = "white" {}
		_LitGroundWorldPos("Lit Ground World Pos", Vector) = (0.0, 0.0, 0.0, 0.0)
	}
	SubShader {
		Tags { "Queue" = "Transparent" "RenderType"="Opaque" }
		LOD 200
		Alphatest Greater 0
		
		pass {
			CGPROGRAM
			
			#pragma vertex vert
      		#pragma fragment frag
      		
      		#include "UnityCG.cginc"

			sampler2D _MainTex;
			sampler2D _SecondaryTex;
			uniform float4 _LitGroundWorldPos;
			uniform float4 _SecondaryTex_ST;

			struct vertexInput {
				float4 vertex : POSITION;
				float2 texcoord0 : TEXCOORD0;
				float2 texcoord1 : TEXCOORD1;
			};

			struct fragmentInput {
				float4 position : SV_POSITION;
				float2 texcoord0 : TEXCOORD0;
				float2 texcoord1 : TEXCOORD1;
			};
			
			
			fragmentInput vert(vertexInput i) {
				fragmentInput o;
				o.position = UnityObjectToClipPos (i.vertex);
				o.texcoord0 = i.texcoord0;
				float4 wpos = mul( unity_ObjectToWorld, i.vertex );
				float2 xy = _LitGroundWorldPos.xy + float2( -1.28, 1.28 );
				float2 cr = _LitGroundWorldPos.zw;
				float2 refPos = wpos.xy - xy;
				
				
				float b = 2.56 * 4.0;
				o.texcoord1.x = fmod( refPos.x + cr.x * 2.56, b ) / b;
				o.texcoord1.y = 1.0 - fmod( refPos.y - cr.y * 2.56, b ) / b;
				return o;
			}
			
			
			float4 frag(fragmentInput i) : COLOR {
				float4 color1 = tex2D( _MainTex, i.texcoord0 );
				float4 color2 = tex2D( _SecondaryTex, i.texcoord1 );
				float4 final = color1;
				
				return final;
			}
			ENDCG
		}
	}
	FallBack "Diffuse"
}
