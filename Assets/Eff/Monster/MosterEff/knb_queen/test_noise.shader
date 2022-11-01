// Upgrade NOTE: replaced '_Object2World' with 'unity_ObjectToWorld'
// Upgrade NOTE: replaced '_World2Object' with 'unity_WorldToObject'
// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

// Shader created with Shader Forge v1.02 
// Shader Forge (c) Neat Corporation / Joachim Holmer - http://www.acegikmo.com/shaderforge/
// Note: Manually altering this data may prevent you from opening it in Shader Forge
/*SF_DATA;ver:1.02;sub:START;pass:START;ps:flbk:,lico:1,lgpr:1,nrmq:1,limd:1,uamb:True,mssp:True,lmpd:False,lprd:False,rprd:False,enco:False,frtr:True,vitr:True,dbil:False,rmgx:True,rpth:0,hqsc:True,hqlp:False,tesm:0,blpr:1,bsrc:3,bdst:7,culm:0,dpts:2,wrdp:False,ufog:True,aust:True,igpj:True,qofs:0,qpre:3,rntp:2,fgom:False,fgoc:False,fgod:False,fgor:False,fgmd:0,fgcr:0.5,fgcg:0.5,fgcb:0.5,fgca:1,fgde:0.01,fgrn:0,fgrf:300,ofsf:0,ofsu:0,f2p0:False;n:type:ShaderForge.SFN_Final,id:3656,x:35045,y:32882,varname:node_3656,prsc:2|emission-3308-RGB,alpha-3308-A,voffset-4913-OUT,tess-8067-OUT;n:type:ShaderForge.SFN_FragmentPosition,id:4600,x:32285,y:32840,varname:node_4600,prsc:2;n:type:ShaderForge.SFN_Transform,id:2034,x:32532,y:32840,varname:node_2034,prsc:2,tffrom:0,tfto:1|IN-4600-XYZ;n:type:ShaderForge.SFN_Negate,id:3613,x:32760,y:32840,varname:node_3613,prsc:2|IN-2034-XYZ;n:type:ShaderForge.SFN_Vector4Property,id:4183,x:32546,y:33095,ptovrint:False,ptlb:node_4183,ptin:_node_4183,varname:node_4183,prsc:2,glob:False,v1:0,v2:0,v3:0,v4:0;n:type:ShaderForge.SFN_Transform,id:5782,x:32761,y:33095,varname:node_5782,prsc:2,tffrom:0,tfto:1|IN-4183-XYZ;n:type:ShaderForge.SFN_Add,id:23,x:33003,y:32958,varname:node_23,prsc:2|A-3613-OUT,B-5782-XYZ;n:type:ShaderForge.SFN_SwitchProperty,id:1668,x:33272,y:33036,ptovrint:False,ptlb:m2m,ptin:_m2m,varname:node_1668,prsc:2,on:False|A-23-OUT,B-5782-XYZ;n:type:ShaderForge.SFN_Time,id:9455,x:32546,y:33338,varname:node_9455,prsc:2;n:type:ShaderForge.SFN_Slider,id:6210,x:32416,y:33565,ptovrint:False,ptlb:x,ptin:_x,varname:node_6210,prsc:2,min:0,cur:0,max:1;n:type:ShaderForge.SFN_Multiply,id:6583,x:32819,y:33429,varname:node_6583,prsc:2|A-9455-T,B-6210-OUT;n:type:ShaderForge.SFN_Slider,id:6701,x:32419,y:33848,ptovrint:False,ptlb:y,ptin:_y,varname:node_6701,prsc:2,min:0,cur:0,max:1;n:type:ShaderForge.SFN_Time,id:9542,x:32554,y:33683,varname:node_9542,prsc:2;n:type:ShaderForge.SFN_Multiply,id:642,x:32817,y:33751,varname:node_642,prsc:2|A-9542-T,B-6701-OUT;n:type:ShaderForge.SFN_Append,id:3716,x:33076,y:33598,varname:node_3716,prsc:2|A-6583-OUT,B-642-OUT;n:type:ShaderForge.SFN_TexCoord,id:4996,x:33076,y:33352,varname:node_4996,prsc:2,uv:0;n:type:ShaderForge.SFN_Add,id:840,x:33341,y:33461,varname:node_840,prsc:2|A-4996-UVOUT,B-3716-OUT;n:type:ShaderForge.SFN_Tex2d,id:8498,x:33559,y:33461,ptovrint:False,ptlb:node_8498,ptin:_node_8498,varname:node_8498,prsc:2,ntxv:0,isnm:False|UVIN-840-OUT;n:type:ShaderForge.SFN_Slider,id:4587,x:33258,y:33787,ptovrint:False,ptlb:transform,ptin:_transform,varname:node_4587,prsc:2,min:0,cur:0,max:1;n:type:ShaderForge.SFN_RemapRange,id:907,x:33615,y:33788,varname:node_907,prsc:2,frmn:0,frmx:1,tomn:-2,tomx:1|IN-4587-OUT;n:type:ShaderForge.SFN_Add,id:2808,x:33874,y:33403,varname:node_2808,prsc:2|A-4996-V,B-8498-R,C-907-OUT;n:type:ShaderForge.SFN_Clamp01,id:4551,x:34094,y:33403,varname:node_4551,prsc:2|IN-2808-OUT;n:type:ShaderForge.SFN_Lerp,id:4913,x:34430,y:33153,varname:node_4913,prsc:2|A-2245-OUT,B-1668-OUT,T-4551-OUT;n:type:ShaderForge.SFN_Vector1,id:2245,x:33953,y:32887,varname:node_2245,prsc:2,v1:0;n:type:ShaderForge.SFN_Tex2d,id:3308,x:34644,y:32998,ptovrint:False,ptlb:main,ptin:_main,varname:node_3308,prsc:2,ntxv:0,isnm:False;n:type:ShaderForge.SFN_Slider,id:8067,x:34351,y:33379,ptovrint:False,ptlb:tessellation,ptin:_tessellation,varname:node_8067,prsc:2,min:0,cur:0,max:10;proporder:4183-1668-6210-6701-8498-4587-8067-3308;pass:END;sub:END;*/

Shader "Shader Forge/222" {
    Properties {
        _node_4183 ("node_4183", Vector) = (0,0,0,0)
        [MaterialToggle] _m2m ("m2m", Float ) = 0
        _x ("x", Range(0, 1)) = 0
        _y ("y", Range(0, 1)) = 0
        _node_8498 ("node_8498", 2D) = "white" {}
        _transform ("transform", Range(0, 1)) = 0
        _tessellation ("tessellation", Range(0, 10)) = 0
        _main ("main", 2D) = "white" {}
        [HideInInspector]_Cutoff ("Alpha cutoff", Range(0,1)) = 0.5
    }
    SubShader {
        Tags {
            "IgnoreProjector"="True"
            "Queue"="Transparent"
            "RenderType"="Transparent"
        }
        Pass {
            Name "ForwardBase"
            Tags {
                "LightMode"="ForwardBase"
            }
            Blend SrcAlpha OneMinusSrcAlpha
            ZWrite Off
            
            CGPROGRAM
            #pragma hull hull
            #pragma domain domain
            #pragma vertex tessvert
            #pragma fragment frag
            #define UNITY_PASS_FORWARDBASE
            #include "UnityCG.cginc"
            #include "Tessellation.cginc"
            #pragma multi_compile_fwdbase
            #pragma exclude_renderers xbox360 ps3 flash d3d11_9x 
            #pragma target 5.0
            #pragma glsl
            uniform float4 _TimeEditor;
            uniform float4 _node_4183;
            uniform fixed _m2m;
            uniform float _x;
            uniform float _y;
            uniform sampler2D _node_8498; uniform float4 _node_8498_ST;
            uniform float _transform;
            uniform sampler2D _main; uniform float4 _main_ST;
            uniform float _tessellation;
            struct VertexInput {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float4 tangent : TANGENT;
                float2 texcoord0 : TEXCOORD0;
            };
            struct VertexOutput {
                float4 pos : SV_POSITION;
                float2 uv0 : TEXCOORD0;
                float4 posWorld : TEXCOORD1;
            };
            VertexOutput vert (VertexInput v) {
                VertexOutput o;
                o.uv0 = v.texcoord0;
                float node_2245 = 0.0;
                float3 node_5782 = mul( unity_WorldToObject, float4(_node_4183.rgb,0) ).xyz;
                float4 node_9455 = _Time + _TimeEditor;
                float4 node_9542 = _Time + _TimeEditor;
                float2 node_840 = (o.uv0+float2((node_9455.g*_x),(node_9542.g*_y)));
                float4 _node_8498_var = tex2Dlod(_node_8498,float4(TRANSFORM_TEX(node_840, _node_8498),0.0,0));
                v.vertex.xyz += lerp(float3(node_2245,node_2245,node_2245),lerp( ((-1*mul( unity_WorldToObject, float4(mul(unity_ObjectToWorld, v.vertex).rgb,0) ).xyz.rgb)+node_5782.rgb), node_5782.rgb, _m2m ),saturate((o.uv0.g+_node_8498_var.r+(_transform*3.0+-2.0))));
                o.posWorld = mul(unity_ObjectToWorld, v.vertex);
                o.pos = UnityObjectToClipPos(v.vertex);
                return o;
            }
            #ifdef UNITY_CAN_COMPILE_TESSELLATION
                struct TessVertex {
                    float4 vertex : INTERNALTESSPOS;
                    float3 normal : NORMAL;
                    float4 tangent : TANGENT;
                    float2 texcoord0 : TEXCOORD0;
                };
                struct OutputPatchConstant {
                    float edge[3]         : SV_TessFactor;
                    float inside          : SV_InsideTessFactor;
                    float3 vTangent[4]    : TANGENT;
                    float2 vUV[4]         : TEXCOORD;
                    float3 vTanUCorner[4] : TANUCORNER;
                    float3 vTanVCorner[4] : TANVCORNER;
                    float4 vCWts          : TANWEIGHTS;
                };
                TessVertex tessvert (VertexInput v) {
                    TessVertex o;
                    o.vertex = v.vertex;
                    o.normal = v.normal;
                    o.tangent = v.tangent;
                    o.texcoord0 = v.texcoord0;
                    return o;
                }
                float Tessellation(TessVertex v){
                    return _tessellation;
                }
                float4 Tessellation(TessVertex v, TessVertex v1, TessVertex v2){
                    float tv = Tessellation(v);
                    float tv1 = Tessellation(v1);
                    float tv2 = Tessellation(v2);
                    return float4( tv1+tv2, tv2+tv, tv+tv1, tv+tv1+tv2 ) / float4(2,2,2,3);
                }
                OutputPatchConstant hullconst (InputPatch<TessVertex,3> v) {
                    OutputPatchConstant o;
                    float4 ts = Tessellation( v[0], v[1], v[2] );
                    o.edge[0] = ts.x;
                    o.edge[1] = ts.y;
                    o.edge[2] = ts.z;
                    o.inside = ts.w;
                    return o;
                }
                [domain("tri")]
                [partitioning("fractional_odd")]
                [outputtopology("triangle_cw")]
                [patchconstantfunc("hullconst")]
                [outputcontrolpoints(3)]
                TessVertex hull (InputPatch<TessVertex,3> v, uint id : SV_OutputControlPointID) {
                    return v[id];
                }
                [domain("tri")]
                VertexOutput domain (OutputPatchConstant tessFactors, const OutputPatch<TessVertex,3> vi, float3 bary : SV_DomainLocation) {
                    VertexInput v;
                    v.vertex = vi[0].vertex*bary.x + vi[1].vertex*bary.y + vi[2].vertex*bary.z;
                    v.normal = vi[0].normal*bary.x + vi[1].normal*bary.y + vi[2].normal*bary.z;
                    v.tangent = vi[0].tangent*bary.x + vi[1].tangent*bary.y + vi[2].tangent*bary.z;
                    v.texcoord0 = vi[0].texcoord0*bary.x + vi[1].texcoord0*bary.y + vi[2].texcoord0*bary.z;
                    VertexOutput o = vert(v);
                    return o;
                }
            #endif
            fixed4 frag(VertexOutput i) : COLOR {
/////// Vectors:
////// Lighting:
////// Emissive:
                float4 _main_var = tex2D(_main,TRANSFORM_TEX(i.uv0, _main));
                float3 emissive = _main_var.rgb;
                float3 finalColor = emissive;
                return fixed4(finalColor,_main_var.a);
            }
            ENDCG
        }
        Pass {
            Name "ShadowCollector"
            Tags {
                "LightMode"="ShadowCollector"
            }
            
            Fog {Mode Off}
            CGPROGRAM
            #pragma hull hull
            #pragma domain domain
            #pragma vertex tessvert
            #pragma fragment frag
            #define UNITY_PASS_SHADOWCOLLECTOR
            #define SHADOW_COLLECTOR_PASS
            #include "UnityCG.cginc"
            #include "Lighting.cginc"
            #include "Tessellation.cginc"
            #pragma fragmentoption ARB_precision_hint_fastest
            #pragma multi_compile_shadowcollector
            #pragma exclude_renderers xbox360 ps3 flash d3d11_9x 
            #pragma target 5.0
            #pragma glsl
            uniform float4 _TimeEditor;
            uniform float4 _node_4183;
            uniform fixed _m2m;
            uniform float _x;
            uniform float _y;
            uniform sampler2D _node_8498; uniform float4 _node_8498_ST;
            uniform float _transform;
            uniform float _tessellation;
            struct VertexInput {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float4 tangent : TANGENT;
                float2 texcoord0 : TEXCOORD0;
            };
            struct VertexOutput {
                V2F_SHADOW_COLLECTOR;
                float2 uv0 : TEXCOORD5;
                float4 posWorld : TEXCOORD6;
            };
            VertexOutput vert (VertexInput v) {
                VertexOutput o;
                o.uv0 = v.texcoord0;
                float node_2245 = 0.0;
                float3 node_5782 = mul( unity_WorldToObject, float4(_node_4183.rgb,0) ).xyz;
                float4 node_9455 = _Time + _TimeEditor;
                float4 node_9542 = _Time + _TimeEditor;
                float2 node_840 = (o.uv0+float2((node_9455.g*_x),(node_9542.g*_y)));
                float4 _node_8498_var = tex2Dlod(_node_8498,float4(TRANSFORM_TEX(node_840, _node_8498),0.0,0));
                v.vertex.xyz += lerp(float3(node_2245,node_2245,node_2245),lerp( ((-1*mul( unity_WorldToObject, float4(mul(unity_ObjectToWorld, v.vertex).rgb,0) ).xyz.rgb)+node_5782.rgb), node_5782.rgb, _m2m ),saturate((o.uv0.g+_node_8498_var.r+(_transform*3.0+-2.0))));
                o.posWorld = mul(unity_ObjectToWorld, v.vertex);
                o.pos = UnityObjectToClipPos(v.vertex);
                TRANSFER_SHADOW_COLLECTOR(o)
                return o;
            }
            #ifdef UNITY_CAN_COMPILE_TESSELLATION
                struct TessVertex {
                    float4 vertex : INTERNALTESSPOS;
                    float3 normal : NORMAL;
                    float4 tangent : TANGENT;
                    float2 texcoord0 : TEXCOORD0;
                };
                struct OutputPatchConstant {
                    float edge[3]         : SV_TessFactor;
                    float inside          : SV_InsideTessFactor;
                    float3 vTangent[4]    : TANGENT;
                    float2 vUV[4]         : TEXCOORD;
                    float3 vTanUCorner[4] : TANUCORNER;
                    float3 vTanVCorner[4] : TANVCORNER;
                    float4 vCWts          : TANWEIGHTS;
                };
                TessVertex tessvert (VertexInput v) {
                    TessVertex o;
                    o.vertex = v.vertex;
                    o.normal = v.normal;
                    o.tangent = v.tangent;
                    o.texcoord0 = v.texcoord0;
                    return o;
                }
                float Tessellation(TessVertex v){
                    return _tessellation;
                }
                float4 Tessellation(TessVertex v, TessVertex v1, TessVertex v2){
                    float tv = Tessellation(v);
                    float tv1 = Tessellation(v1);
                    float tv2 = Tessellation(v2);
                    return float4( tv1+tv2, tv2+tv, tv+tv1, tv+tv1+tv2 ) / float4(2,2,2,3);
                }
                OutputPatchConstant hullconst (InputPatch<TessVertex,3> v) {
                    OutputPatchConstant o;
                    float4 ts = Tessellation( v[0], v[1], v[2] );
                    o.edge[0] = ts.x;
                    o.edge[1] = ts.y;
                    o.edge[2] = ts.z;
                    o.inside = ts.w;
                    return o;
                }
                [domain("tri")]
                [partitioning("fractional_odd")]
                [outputtopology("triangle_cw")]
                [patchconstantfunc("hullconst")]
                [outputcontrolpoints(3)]
                TessVertex hull (InputPatch<TessVertex,3> v, uint id : SV_OutputControlPointID) {
                    return v[id];
                }
                [domain("tri")]
                VertexOutput domain (OutputPatchConstant tessFactors, const OutputPatch<TessVertex,3> vi, float3 bary : SV_DomainLocation) {
                    VertexInput v;
                    v.vertex = vi[0].vertex*bary.x + vi[1].vertex*bary.y + vi[2].vertex*bary.z;
                    v.normal = vi[0].normal*bary.x + vi[1].normal*bary.y + vi[2].normal*bary.z;
                    v.tangent = vi[0].tangent*bary.x + vi[1].tangent*bary.y + vi[2].tangent*bary.z;
                    v.texcoord0 = vi[0].texcoord0*bary.x + vi[1].texcoord0*bary.y + vi[2].texcoord0*bary.z;
                    VertexOutput o = vert(v);
                    return o;
                }
            #endif
            fixed4 frag(VertexOutput i) : COLOR {
/////// Vectors:
                SHADOW_COLLECTOR_FRAGMENT(i)
            }
            ENDCG
        }
        Pass {
            Name "ShadowCaster"
            Tags {
                "LightMode"="ShadowCaster"
            }
            Cull Off
            Offset 1, 1
            
            Fog {Mode Off}
            CGPROGRAM
            #pragma hull hull
            #pragma domain domain
            #pragma vertex tessvert
            #pragma fragment frag
            #define UNITY_PASS_SHADOWCASTER
            #include "UnityCG.cginc"
            #include "Lighting.cginc"
            #include "Tessellation.cginc"
            #pragma fragmentoption ARB_precision_hint_fastest
            #pragma multi_compile_shadowcaster
            #pragma exclude_renderers xbox360 ps3 flash d3d11_9x 
            #pragma target 5.0
            #pragma glsl
            uniform float4 _TimeEditor;
            uniform float4 _node_4183;
            uniform fixed _m2m;
            uniform float _x;
            uniform float _y;
            uniform sampler2D _node_8498; uniform float4 _node_8498_ST;
            uniform float _transform;
            uniform float _tessellation;
            struct VertexInput {
                float4 vertex : POSITION;
                float3 normal : NORMAL;
                float4 tangent : TANGENT;
                float2 texcoord0 : TEXCOORD0;
            };
            struct VertexOutput {
                V2F_SHADOW_CASTER;
                float2 uv0 : TEXCOORD1;
                float4 posWorld : TEXCOORD2;
            };
            VertexOutput vert (VertexInput v) {
                VertexOutput o;
                o.uv0 = v.texcoord0;
                float node_2245 = 0.0;
                float3 node_5782 = mul( unity_WorldToObject, float4(_node_4183.rgb,0) ).xyz;
                float4 node_9455 = _Time + _TimeEditor;
                float4 node_9542 = _Time + _TimeEditor;
                float2 node_840 = (o.uv0+float2((node_9455.g*_x),(node_9542.g*_y)));
                float4 _node_8498_var = tex2Dlod(_node_8498,float4(TRANSFORM_TEX(node_840, _node_8498),0.0,0));
                v.vertex.xyz += lerp(float3(node_2245,node_2245,node_2245),lerp( ((-1*mul( unity_WorldToObject, float4(mul(unity_ObjectToWorld, v.vertex).rgb,0) ).xyz.rgb)+node_5782.rgb), node_5782.rgb, _m2m ),saturate((o.uv0.g+_node_8498_var.r+(_transform*3.0+-2.0))));
                o.posWorld = mul(unity_ObjectToWorld, v.vertex);
                o.pos = UnityObjectToClipPos(v.vertex);
                TRANSFER_SHADOW_CASTER(o)
                return o;
            }
            #ifdef UNITY_CAN_COMPILE_TESSELLATION
                struct TessVertex {
                    float4 vertex : INTERNALTESSPOS;
                    float3 normal : NORMAL;
                    float4 tangent : TANGENT;
                    float2 texcoord0 : TEXCOORD0;
                };
                struct OutputPatchConstant {
                    float edge[3]         : SV_TessFactor;
                    float inside          : SV_InsideTessFactor;
                    float3 vTangent[4]    : TANGENT;
                    float2 vUV[4]         : TEXCOORD;
                    float3 vTanUCorner[4] : TANUCORNER;
                    float3 vTanVCorner[4] : TANVCORNER;
                    float4 vCWts          : TANWEIGHTS;
                };
                TessVertex tessvert (VertexInput v) {
                    TessVertex o;
                    o.vertex = v.vertex;
                    o.normal = v.normal;
                    o.tangent = v.tangent;
                    o.texcoord0 = v.texcoord0;
                    return o;
                }
                float Tessellation(TessVertex v){
                    return _tessellation;
                }
                float4 Tessellation(TessVertex v, TessVertex v1, TessVertex v2){
                    float tv = Tessellation(v);
                    float tv1 = Tessellation(v1);
                    float tv2 = Tessellation(v2);
                    return float4( tv1+tv2, tv2+tv, tv+tv1, tv+tv1+tv2 ) / float4(2,2,2,3);
                }
                OutputPatchConstant hullconst (InputPatch<TessVertex,3> v) {
                    OutputPatchConstant o;
                    float4 ts = Tessellation( v[0], v[1], v[2] );
                    o.edge[0] = ts.x;
                    o.edge[1] = ts.y;
                    o.edge[2] = ts.z;
                    o.inside = ts.w;
                    return o;
                }
                [domain("tri")]
                [partitioning("fractional_odd")]
                [outputtopology("triangle_cw")]
                [patchconstantfunc("hullconst")]
                [outputcontrolpoints(3)]
                TessVertex hull (InputPatch<TessVertex,3> v, uint id : SV_OutputControlPointID) {
                    return v[id];
                }
                [domain("tri")]
                VertexOutput domain (OutputPatchConstant tessFactors, const OutputPatch<TessVertex,3> vi, float3 bary : SV_DomainLocation) {
                    VertexInput v;
                    v.vertex = vi[0].vertex*bary.x + vi[1].vertex*bary.y + vi[2].vertex*bary.z;
                    v.normal = vi[0].normal*bary.x + vi[1].normal*bary.y + vi[2].normal*bary.z;
                    v.tangent = vi[0].tangent*bary.x + vi[1].tangent*bary.y + vi[2].tangent*bary.z;
                    v.texcoord0 = vi[0].texcoord0*bary.x + vi[1].texcoord0*bary.y + vi[2].texcoord0*bary.z;
                    VertexOutput o = vert(v);
                    return o;
                }
            #endif
            fixed4 frag(VertexOutput i) : COLOR {
/////// Vectors:
                SHADOW_CASTER_FRAGMENT(i)
            }
            ENDCG
        }
    }
    FallBack "Diffuse"
    CustomEditor "ShaderForgeMaterialInspector"
}
