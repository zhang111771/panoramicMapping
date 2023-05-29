import * as THREE from 'three'
export default function WallShaderMaeterial(panorama){
  let point=panorama.point[0]
  let panoramaTexture=new THREE.TextureLoader().load(point.panoramaUrl)
  //y轴翻转为false
  panoramaTexture.flipY=false
  panoramaTexture.wrapS = THREE.RepeatWrapping;
  panoramaTexture.wrapT = THREE.RepeatWrapping;
  panoramaTexture.magFilter = THREE.NearestFilter;
  panoramaTexture.minFilter = THREE.NearestFilter;

  let center=new THREE.Vector3(point.x/100,point.z/100,point.y/100)
  return new THREE.ShaderMaterial({
    uniforms:{
      uPanorama:{value:panoramaTexture},
      uCenter:{value:center}
    },
    vertexShader:`
      varying vec2 vUv;
      uniform vec3 uCenter;
      varying vec3 vPosition;
      void main(){
        vUv=uv;
        vec4 modelpos=modelMatrix*vec4(position,1.0);
        vPosition=modelpos.xyz;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);
      }
      `,
      fragmentShader:`
      varying vec2 vUv;
      uniform sampler2D uPanorama;
      uniform vec3 uCenter;
      varying vec3 vPosition;
      void main(){
        vec3 nPos=normalize(vPosition-uCenter);
        float theta=acos(nPos.y)/3.14;
        float phi=(atan(nPos.z,nPos.x)+3.14)/6.28;
        phi+=0.75;
        vec4 pColor=texture2D(uPanorama,vec2(phi,theta));
        gl_FragColor=pColor;
      }
      `

  })
}