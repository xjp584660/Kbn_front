// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "Mobile/Brightener" {
	Properties {
		_MainTex ("Base (RGB)", 2D) = "white" {}
        brighteningFactor ("Brightening Factor", float) = 0
	}
    SubShader 
    {
        Tags {"Queue"="Transparent" "IgnoreProjector"="True" "RenderType"="Transparent"}
        ZWrite Off
        Lighting Off
        Cull Off
        Fog { Mode Off }
        Blend SrcAlpha OneMinusSrcAlpha       
    
        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            
            sampler2D _MainTex;
            float brighteningFactor;
            
            struct appdata 
            {
                float4 vertex:POSITION;
                float4 texcoord:TEXCOORD0;
            }; 
            
            
            struct v2f 
            {
                float4 pos:SV_POSITION;
                float2 uv:TEXCOORD0;
            };
            
            v2f vert (appdata v) 
            {
                v2f o;
                o.pos = UnityObjectToClipPos(v.vertex);
                o.uv = v.texcoord.xy;
                return o;
            }
            
            half4 frag(v2f i):COLOR 
            {
                float4 texColor = tex2D(_MainTex, i.uv);
                texColor.rgb = 1 - pow(1 - texColor.rgb, brighteningFactor);
                return texColor;
            }
            ENDCG       
        }               
    }
	FallBack "Diffuse"
}
