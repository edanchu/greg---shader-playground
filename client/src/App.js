import GraphicsComponent from './components/graphics_component'
import './App.css';
// import Home from './pages/home';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const finalFragShaderCustomCode = `

  void mainImage(out vec4 FragColor, in vec4 FragCoord){
      vec4 buff1 = texture(iBufferTexture1, 2. * FragCoord.xy/iResolution);
      vec4 buff2 = texture(iBufferTexture2, 2. * FragCoord.xy/iResolution);
      vec4 buff3 = texture(iBufferTexture3, 2. * FragCoord.xy/iResolution);
      vec4 buff4 = texture(iBufferTexture4, 2. * FragCoord.xy/iResolution);
      float xStep = step(0.5, FragCoord.x/iResolution.x);
      vec4 top = xStep * buff1 + (1.0 - xStep) * buff2;
      vec4 bottom = xStep * buff3 + (1.0 - xStep) * buff4;
      float yStep = step(0.5, FragCoord.y/iResolution.y);
      FragColor = yStep * top + (1.0 - yStep) * bottom;
  }

  `

  const buffer1FragShaderCustomCode = `

  #define PI 3.14159
  #define inf 999999.0

  vec2 rotate(vec2 point, float angle)
  {
      float x = point.x; float y = point.y;
      point.x = x * cos(angle) - y * sin(angle);
      point.y = y * cos(angle) + x * sin(angle);
      return point;
  }

  bool box2d(vec2 pos, vec2 uv, vec2 pivot, float angle, float w, float h)
  {
      uv -= pos;
      uv = rotate(uv, angle) + pivot;
      
      bool x = (w - uv.x) > 0.0 && (-w - uv.x) < 0.0;
      bool y = (h - uv.y) > 0.0 && (-h - uv.y) < 0.0;
      
      return x && y;
  }

  vec2 angletovec(float angle)
  {
      float xn = cos(angle);
      float yn = sin(angle);
      return vec2(xn, yn);
  }

  struct Joint
  {
      vec2 pos;
      float w;
      float h;
      float angle;
  };

  vec2 endPoint(in Joint j)
  {
      return j.pos + vec2(cos(-j.angle), sin(-j.angle)) * j.w * 2.0;
  }
      
  bool drawJoint(in Joint j, vec2 uv)
  {
      return box2d(j.pos, uv, vec2(-j.w, 0.0), j.angle, j.w, j.h);
  }

  void rotateJoint(inout Joint j1, in vec2 target, float amount)
  {	
      vec2 ep = j1.pos;
      vec2 targetv = normalize(target - ep);
      targetv.y *= -1.0;
      // which way to turn?
      // construct a vector normal to direction and check sign of dot product
      float an = (j1.angle) + PI * 0.5;
      vec2 norm = angletovec(an);
      float turn = dot(norm, targetv);
      float dir = turn > 0.0 ? 1.0 : -1.0;
      
      // turn
      vec2 fwd = angletovec(j1.angle);
      float d = clamp(dot(fwd, targetv), -1.0, 1.0);
      float turnangle = acos(d);
      
      j1.angle += turnangle * dir * amount;
  }


  void mainImage( out vec4 fragColor, in vec4 fragCoord )
  {
      
      
      fragColor = vec4(0.0);
      vec2 uv = fragCoord.xy / iResolution.xy;
      uv -= vec2(0.5);
      float aspect = iResolution.x / iResolution.y;
      uv.y /= aspect;
      
      float mx = iMouse.x / iResolution.x;
      float my = iMouse.y / iResolution.y;
      vec2 target = vec2(mx, my);
      target -= vec2(0.5);
      target.y /= aspect;

      if(iMouse.wz == vec2(-1.0, -1.0))
      {
          target = vec2(sin(iTime) * 0.45, 0.1 + cos(iTime) * 0.15);
      }
      
      const int JOINTS = 7;
      Joint j[JOINTS];
      
      j[0].pos = vec2(-0.0, -0.3);
      j[0].w = 0.05;
      j[0].h = 0.02;
      j[0].angle = -PI * 0.5;
      float fj = float(JOINTS);
      
      for (int i = 1; i < JOINTS; ++i)
      {
          j[i].pos = endPoint(j[i - 1]);
          float r = (fj - float(i)) / fj;
          j[i].w = 0.03;
          j[i].h = 0.01 * r;
          j[i].angle = -PI * 0.5;    
      }
      const int iter = 5;
      const float weight = 0.35;
      
      for (int x = 0; x < iter; ++x)
      {	
          for (int i = JOINTS - 1; i >= 1; --i)
          {
              j[i].pos = endPoint(j[i - 1]);
              rotateJoint(j[i], target, weight * (float(i) / float(iter)));
          }
      }
      
      for (int i = 1; i < JOINTS; ++i)
      {
      j[i].pos = endPoint(j[i - 1]);
      }

      bool b = false;
      for (int i = 0; i < JOINTS; ++i)
      {
          b = b || drawJoint(j[i], uv);
      }
      
      fragColor = vec4(0.7, 0.1, uv.y + 0.3, 0.0);
      fragColor -= vec4(b ? 1.0 : 0.0);
      fragColor = max(fragColor, 0.0);
      if(sin(uv.x * 17.0) * 0.01 - uv.y > 0.20)
      {
          fragColor = vec4(0.0);
      }
      
      // target "light";
      fragColor += 1.0 - smoothstep(length(uv - target), 0.0, 0.01);;
      
  }

  `

  const buffer2FragShaderCustomCode = `

  float det=.001,t, boxhit;
  vec3 adv, boxp;

  float hash(vec2 p)
  {
      vec3 p3  = fract(vec3(p.xyx) * .1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
  }


  mat2 rot(float a)
  {
      float s=sin(a), c=cos(a);
      return mat2(c,s,-s,c);
  }

  vec3 path(float t)
      {
      vec3 p=vec3(vec2(sin(t*.1),cos(t*.05))*10.,t);
      p.x+=smoothstep(.0,.5,abs(.5-fract(t*.02)))*10.;
      return p;
  }

  float fractal(vec2 p)
  {
      p=abs(5.-mod(p*.2,10.))-5.;
      float ot=1000.;
      for (int i=0; i<7; i++)
      {
          p=abs(p)/clamp(p.x*p.y,.25,2.)-1.;
          if(i>0)ot=min(ot,abs(p.x)+.7*fract(abs(p.y)*.05+t*.05+float(i)*.3));
          
      }
      ot=exp(-10.*ot);
      return ot;
  }

  float box(vec3 p, vec3 l)
  {
      vec3 c=abs(p)-l;
      return length(max(vec3(0.),c))+min(0.,max(c.x,max(c.y,c.z)));
  }

  float de(vec3 p)
  {
      boxhit=0.;
      vec3 p2=p-adv;
      p2.xz*=rot(t*.2);
      p2.xy*=rot(t*.1);
      p2.yz*=rot(t*.15);
      float b=box(p2,vec3(1.));
      p.xy-=path(p.z).xy;
      float s=sign(p.y);
      p.y=-abs(p.y)-3.;
      p.z=mod(p.z,20.)-10.;
      for (int i=0; i<5; i++)
      {
          p=abs(p)-1.;
          p.xz*=rot(radians(s*-45.));
          p.yz*=rot(radians(90.));
      }
      float f=-box(p,vec3(5.,5.,10.));
      float d=min(f,b);
      if (d==b) boxp=p2, boxhit=1.;
      return d*.7;
  }


  vec3 march(vec3 from, vec3 dir)
  {
      vec3 p,n,g=vec3(0.);
      float d, td=0.;
      for (int i=0; i<80; i++)
      {
          p=from+td*dir;
          d=de(p)*(1.-hash(gl_FragCoord.xy+t)*.3);
          if (d<det && boxhit<.5) break;
          td+=max(det,abs(d));
          float f=fractal(p.xy)+fractal(p.xz)+fractal(p.yz);
          //boxp*=.5;
          float b=fractal(boxp.xy)+fractal(boxp.xz)+fractal(boxp.yz);
          vec3 colf=vec3(f*f,f,f*f*f);
          vec3 colb=vec3(b+.1,b*b+.05,0.);
          g+=colf/(3.+d*d*2.)*exp(-.0015*td*td)*step(5.,td)/2.*(1.-boxhit);
          g+=colb/(10.+d*d*20.)*boxhit*.5;
      }
      return g;
  }

  mat3 lookat(vec3 dir, vec3 up) 
  {
      dir=normalize(dir);vec3 rt=normalize(cross(dir,normalize(up)));
      return mat3(rt,cross(rt,dir),dir);
  }


  void mainImage( out vec4 fragColor, in vec4 fragCoord )
  {
      vec2 uv = (fragCoord.xy-iResolution.xy*.5)/iResolution.y;
      t=iTime*7.;
      vec3 from=path(t);
      adv=path(t+6.+sin(t*.1)*3.);
      vec3 dir=normalize(vec3(uv,.7));
      dir=lookat(adv-from,vec3(0.,1.,0.))*dir;
      vec3 col=march(from, dir);
      fragColor=vec4(col,1.0);
  }

  `;

  const buffer3FragShaderCustomCode = `

  #define time iTime
  #define size iResolution

  float pixelSize,focalDistance,aperture,fudgeFactor=0.6;//,shadowCone=0.5;
  mat2 rmat(float a){float sa=sin(a),ca=cos(a);return mat2(ca,sa,-sa,ca);}
  vec3 mcol=vec3(0);
  const float mr=0.16, mxr=1.0; 
  const vec4 scale=vec4(-2.0,-2.0,-2.0,2.0); 
  vec4 p0=vec4(3.,0.76,1.12,0.2);//0.32,.76
  float lightPos; 
  vec2 DE(in vec3 z0){//amazing surface by kali/tglad with mods
  p0.x=cos((iTime+z0.y)*0.05)*3.5;
  z0.xz=z0.xz*rmat(z0.y*0.07);
  z0.y=abs(mod(z0.y,4.0)-2.0);
  vec4 z = vec4(z0,1.0); float dL=100.;
  for (int n = 0; n < 4; n++) { 
  if(z.x<z.z)z.xz=z.zx; 
  z.xy=clamp(z.xy, -1.0, 1.0) *2.0-z.xy; 
  z*=scale/clamp(max(dot(z.xy,z.xy),dot(z.xz,z.xz)),mr,mxr); 
  z+=p0; 
  if(n==1)dL=length(z.xyz+vec3(0.5,lightPos,0.5))/z.w;
  } 
  if(mcol.x>0.)mcol+=vec3(0.6)+sin(z.xyz*0.1)*0.4; 
  z.xyz=abs(z.xyz)-vec3(1.4,32.8,0.7); 
  return vec2(max(z.x,max(z.y,z.z))/z.w,dL); 
  } 

  float CircleOfConfusion(float t){//calculates the radius of the circle of confusion at length t
  return max(abs(focalDistance-t)*aperture,pixelSize*(1.0+t));
  }
  mat3 lookat(vec3 fw,vec3 up){
  fw=normalize(fw);vec3 rt=normalize(cross(fw,normalize(up)));return mat3(rt,cross(rt,fw),fw);
  }
  float linstep(float a, float b, float t){return clamp((t-a)/(b-a),0.,1.);}// i got this from knighty and/or darkbeam
  //random seed and generator
  vec2 randv2;
  float rand2(){// implementation derived from one found at: lumina.sourceforge.net/Tutorials/Noise.html
  randv2+=vec2(1.0,1.0);
  return fract(sin(dot(randv2 ,vec2(12.9898,78.233))) * 43758.5453);
  }
  vec3 bg(vec3 rd){
  float d=max(0.,rd.x+rd.y+rd.z);
  return vec3(d*d*.25)+rd*.05;
  }
  void mainImage( out vec4 fragColor, in vec4 fragCoord ) {
  randv2=fract(cos((fragCoord.xy+fragCoord.yx*vec2(100.0,100.0))+vec2(time)*10.0)*1000.0);
  pixelSize=1.0/size.y;
  float tim=time*0.1;//camera, lighting and object setup
  lightPos=sin(tim*20.0)*5.; 
  vec3 ro=vec3(cos(tim),tim*2.0,sin(tim))*5.0; 
  vec3 rd=lookat(vec3(-ro.x,5.0,-ro.z),vec3(0.0,1.0,1.0))*normalize(vec3((2.0*gl_FragCoord.xy-size.xy)/size.y,2.0)); 
  focalDistance=min(length(ro)+0.001,1.0);
  aperture=0.007*focalDistance;
  vec3 rt=normalize(cross(vec3(0,1,0),rd)),up=cross(rd,rt);//just need to be perpendicular
  vec3 lightColor=vec3(1.0,0.5,0.25)*2.0;
  vec4 col=vec4(0.0);vec3 blm=vec3(0);//color accumulator, .w=alpha, bloom accum
  vec2 D;//for surface and light dist
  float t=0.0,mld=100.0,od,d=1.,old,ld=100.,dt=0.,ot;//distance traveled, minimum light distance
  for(int i=1;i<72;i++){//march loop
  if(col.w>0.9 || t>15.0)break;//bail if we hit a surface or go out of bounds
  float rCoC=CircleOfConfusion(t);//calc the radius of CoC
  od=D.x;old=D.y,dt=t-ot;ot=t;//save old distances for normal, light direction calc
  D=DE(ro+rd*t);
  d=D.x+0.33*rCoC;
  ld=D.y;//the distance estimate to light
  mld=min(mld,ld);//the minimum light distance along the march
  if(d<rCoC){//if we are inside the sphere of confusion add its contribution
  vec3 p=ro+rd*(t-dt);//back up to previos checkpoint
  mcol=vec3(0.01);//collect color samples with normal deltas
  vec2 Drt=DE(p+rt*dt),Dup=DE(p+up*dt);
  vec3 N=normalize(rd*(D.x-od)+rt*(Drt.x-od)+up*(Dup.x-od));
  if(N!=N)N=-rd;//if no gradient assume facing us
  vec3 L=-normalize(rd*(D.y-old)+rt*(Drt.y-old)+up*(Dup.y-old));
  float lightStrength=1.0/(1.0+ld*ld*20.0);
  vec3 scol=mcol*(0.4*(1.0+dot(N,L)+.2))*lightStrength;//average material color * diffuse lighting * attenuation
  scol+=pow(max(0.0,dot(reflect(rd,N),L)),8.0)*lightColor;//specular lighting
  mcol=vec3(0);//clear the color accumulator before shadows
  //scol*=FuzzyShadow(p,L,ld,shadowCone,rCoC);//now stop the shadow march at light distance
  blm+=lightColor*exp(-mld*t*10.)*(1.0-col.w);//add a bloom around the light
  mld=100.0;//clear the minimum light distance for the march
  float alpha=fudgeFactor*(1.0-col.w)*linstep(-rCoC,rCoC,-d);//calculate the mix like cloud density
  col=vec4(col.rgb+scol*alpha,clamp(col.w+alpha,0.0,1.0));//blend in the new color 
  }//move the minimum of the object and light distance
  d=abs(fudgeFactor*min(d,ld+0.33*rCoC)*(0.8+0.2*rand2()));//add in noise to reduce banding and create fuzz
  t+=d;
  }//mix in background color and remaining bloom
  t=min(15.,t);
  blm+=lightColor*exp(-mld*t*10.)*(1.0-col.w);///(1.0+mld*mld*3000.0
  col.rgb=mix(col.rgb,bg(rd),t/15.);
  fragColor = vec4(clamp(col.rgb+blm,0.0,1.0),1.0);
  }

  `;

  const buffer4FragShaderCustomCode = `

  vec3 palette(float d){
      return mix(vec3(0.2,0.7,0.9),vec3(1.,0.,1.),d);
  }
  
  vec2 rotate(vec2 p,float a){
      float c = cos(a);
      float s = sin(a);
      return p*mat2(c,s,-s,c);
  }
  
  float map(vec3 p){
      for( int i = 0; i<8; ++i){
          float t = iTime*0.2;
          p.xz =rotate(p.xz,t);
          p.xy =rotate(p.xy,t*1.89);
          p.xz = abs(p.xz);
          p.xz-=.5;
      }
      return dot(sign(p),p)/5.;
  }
  
  vec4 rm (vec3 ro, vec3 rd){
      float t = 0.;
      vec3 col = vec3(0.);
      float d;
      for(float i =0.; i<64.; i++){
          vec3 p = ro + rd*t;
          d = map(p)*.5;
          if(d<0.02){
              break;
          }
          if(d>100.){
              break;
          }
          //col+=vec3(0.6,0.8,0.8)/(400.*(d));
          col+=palette(length(p)*.1)/(400.*(d));
          t+=d;
      }
      return vec4(col,1./(d*100.));
  }
  void mainImage( out vec4 fragColor, in vec4 fragCoord )
  {
      vec2 uv = (fragCoord.xy-(iResolution.xy/2.))/iResolution.x;
      vec3 ro = vec3(0.,0.,-50.);
      ro.xz = rotate(ro.xz,iTime);
      vec3 cf = normalize(-ro);
      vec3 cs = normalize(cross(cf,vec3(0.,1.,0.)));
      vec3 cu = normalize(cross(cf,cs));
      
      vec3 uuv = ro+cf*3. + uv.x*cs + uv.y*cu;
      
      vec3 rd = normalize(uuv-ro);
      
      vec4 col = rm(ro,rd);
      
      
      fragColor = col;
  }

  `;

  return (
    <div>
      <GraphicsComponent
        height={480}
        pause={false}
        playOnMouseOver={false}
        showButtons={true}
        commonFragShaderCustomCode={""}
        finalFragShaderCustomCode={finalFragShaderCustomCode}
        buffer1FragShaderCustomCode={buffer1FragShaderCustomCode}
        buffer2FragShaderCustomCode={buffer2FragShaderCustomCode}
        buffer3FragShaderCustomCode={buffer3FragShaderCustomCode}
        buffer4FragShaderCustomCode={buffer4FragShaderCustomCode}
      />
    </div>
  );
}

export default App;
