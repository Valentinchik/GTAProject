Shader "Minimal" {
    Properties {
        _Color ("Main Color", Color) = (1.0,1.0,1.0,0.5)
        _MainTex ("Base (RGB)", 2D) = "white" { }
    }

    SubShader {
        Pass {
            Material {
                Diffuse [_Color]
                Ambient [_Color]
            }
            Lighting Off
            Color (0.5, 0.5, 0.5)
            SetTexture [_MainTex] {
                constantColor [_Color]
                Combine texture * constant
            }
        }
    }
} 