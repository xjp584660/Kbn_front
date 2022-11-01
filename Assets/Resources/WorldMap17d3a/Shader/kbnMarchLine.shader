// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "_KBNShaders_/kbnMarchLine" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
		_MiddlePos( "Middle Pos", Vector ) = ( 0.0, 0.0, 0.0, 0.0 )
	}
	SubShader {
		Tags { "Queue" = "Overlay-2" "RenderType"="Transparent" }
		LOD 200
		Blend SrcAlpha OneMinusSrcAlpha
		ZWrite Off
		Cull Off
		
		pass {
			CGPROGRAM
			
			#pragma vertex vert
      		#pragma fragment frag
      		
      		#include "UnityCG.cginc"

			sampler2D _MainTex;
			
			uniform float4 _MainTex_ST;
			uniform float4 _MiddlePos;

			struct vertexInput {
				float4 vertex : POSITION;
				float4 texcoord0 : TEXCOORD0;
				float4 texcoord1 : TEXCOORD1;
			};

			struct fragmentInput {
				float4 _position : SV_POSITION;
				float4 texcoord0 : TEXCOORD0;
				//float4 middlepos : TEXCOORD1;
				float4 position : TEXCOORD1;
			};
			
			
			fragmentInput vert(vertexInput i) {
				fragmentInput o;
				o.position = i.vertex;
				
				
				o._position = UnityObjectToClipPos (i.vertex);
				o.texcoord0 = i.texcoord0;
				
				
				//o.middlepos = _MiddlePos;
//				float dist = distance(i.vertex.xyz, float3(0.0,0.0,0.0));
//				o.c = float4(dist, 0, 0, 1);
				return o;
			}
			
			
			float4 frag(fragmentInput i) : COLOR {
				float4 color = tex2D( _MainTex, TRANSFORM_TEX( i.texcoord0, _MainTex ) );
				//float alpha = color.w;
				float dist = length( i.position.xyz );
				//color.y = fmod(dist, 1.0f);//min( dist * 0.1, alpha );
				//color.xz = 0.0;
//				color = float4(abs(fmod(i.position.xyz, 1.0f)), 1.0f);
				return color;
			}
			ENDCG
		}
	}
	FallBack "Diffuse"
}
