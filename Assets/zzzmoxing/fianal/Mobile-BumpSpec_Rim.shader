
Shader "Zan/Bumped Specular Rim"
{
    Properties
    {
        _Color ("Color Tint", Color) = (1, 1, 1, 1)
        _Shininess ("Shininess", Range(0.03, 1)) = 0.078125
        _MainTex ("Base (RGB) Gloss (A)", 2D) = "white" { }
        _BumpMap ("Normalmap", 2D) = "bump" { }
        _Cutoff ("Alpha Cutoff", Range(0, 1)) = 0.5
        _RimColor ("Rim Color", Color) = (0.000, 0.000, 0.000, 1.000)
        _RimPower ("Rim Range", Range(0.5, 15.0)) = 3.0
        _Rimstrong ("Rim Strength", Float) = 1
    }
    SubShader
    {
        Cull Off
        Tags { "RenderType" = "Opaque" "Queue" = "Transparent+9" }
        LOD 250
        
        CGPROGRAM
        
        #pragma surface surf MobileBlinnPhong 
        fixed4 _Color;

        inline fixed4 LightingMobileBlinnPhong(SurfaceOutput s, fixed3 lightDir, fixed3 halfDir, fixed atten)
        {

            fixed diff = max(0, dot(s.Normal, lightDir));
            fixed nh = max(0, dot(s.Normal, halfDir));
            fixed spec = pow(nh, s.Specular * 128) * s.Gloss;
            
            fixed4 c;
            c.rgb = (s.Albedo * _Color.rgb * diff + _Color.rgb * spec) ;
            c.a = 0.0;
            
            return c;
        }

        sampler2D _MainTex;
        sampler2D _BumpMap;
        half _Shininess;
        fixed _Cutoff;
        
        float4 _RimColor;
        float _RimPower;
        float _Rimstrong;

        struct Input
        {
            float2 uv_MainTex;
            float3 viewDir;
        };

        void surf(Input IN, inout SurfaceOutput o)
        {
            fixed4 tex = tex2D(_MainTex, IN.uv_MainTex);
            clip(tex.a - _Cutoff);
            o.Albedo = tex.rgb;
            o.Gloss = _Shininess;
            o.Alpha = tex.a;
            o.Specular = _Shininess;
//            float3 n = o.Normal;
            o.Normal = UnpackNormal(tex2D(_BumpMap, IN.uv_MainTex));

            half rim = 1.0 - saturate(dot(normalize(IN.viewDir), o.Normal));
            o.Emission = saturate(((_RimColor.rgb * pow(rim, _RimPower)) * _RimColor.a * _Rimstrong)) ;
        }
        ENDCG
        
    }

    FallBack "Mobile/VertexLit"
}
