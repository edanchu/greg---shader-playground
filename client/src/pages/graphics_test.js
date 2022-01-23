import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from 'three';

class GraphicsTest extends Component {
    componentDidMount() {
        this.sceneSetup = this.sceneSetup.bind(this);
        this.renderLoop = this.renderLoop.bind(this);

        this.sceneSetup();
        this.renderLoop();
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.requestID);
    }

    sceneSetup() {
        this.height = this.mount.clientHeight;
        this.width = this.height * 16 / 9;

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera();
        this.camera.position.z = 1;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.mount.appendChild(this.renderer.domElement);

        this.clock = new THREE.Clock(true);

        this.createRenderBuffers();


        this.planeGeometry = new THREE.PlaneGeometry(2, 2)
        this.createMaterials();

        this.quad = new THREE.Mesh(this.planeGeometry, this.finalMat);

        this.scene.add(this.quad);
    };

    renderLoop() {

        this.updateBufferUniforms();

        this.renderBufferTextures();

        this.updateFinalUniforms();

        this.renderFinalScene();

        this.requestID = window.requestAnimationFrame(this.renderLoop);
    };

    renderFinalScene() {
        this.renderer.setRenderTarget(null);
        this.quad.material = this.finalMat;
        this.renderer.render(this.scene, this.camera);
    }

    renderBufferTextures() {
        this.renderer.setRenderTarget(this.renderTarget1);
        this.quad.material = this.bufferMat1;
        this.renderer.render(this.scene, this.camera);

        this.renderer.setRenderTarget(this.renderTarget2);
        this.quad.material = this.bufferMat2;
        this.renderer.render(this.scene, this.camera);

        this.renderer.setRenderTarget(this.renderTarget3);
        this.quad.material = this.bufferMat3;
        this.renderer.render(this.scene, this.camera);

        this.renderer.setRenderTarget(this.renderTarget4);
        this.quad.material = this.bufferMat4;
        this.renderer.render(this.scene, this.camera);
    }

    createRenderBuffers() {
        this.renderTarget1 = new THREE.WebGLRenderTarget(this.width, this.height);
        this.renderTarget2 = new THREE.WebGLRenderTarget(this.width, this.height);
        this.renderTarget3 = new THREE.WebGLRenderTarget(this.width, this.height);
        this.renderTarget4 = new THREE.WebGLRenderTarget(this.width, this.height);

        this.renderTarget1.texture.wrapS = this.renderTarget1.texture.wrapT = THREE.RepeatWrapping;
        this.renderTarget2.texture.wrapS = this.renderTarget2.texture.wrapT = THREE.RepeatWrapping;
        this.renderTarget3.texture.wrapS = this.renderTarget3.texture.wrapT = THREE.RepeatWrapping;
        this.renderTarget4.texture.wrapS = this.renderTarget4.texture.wrapT = THREE.RepeatWrapping;

        this.renderTarget1.texture.magFilter = this.renderTarget1.texture.minFilter = THREE.NearestFilter;
        this.renderTarget2.texture.magFilter = this.renderTarget2.texture.minFilter = THREE.NearestFilter;
        this.renderTarget3.texture.magFilter = this.renderTarget3.texture.minFilter = THREE.NearestFilter;
        this.renderTarget4.texture.magFilter = this.renderTarget4.texture.minFilter = THREE.NearestFilter;

        this.renderTarget1.texture.depthBuffer = false;
        this.renderTarget2.texture.depthBuffer = false;
        this.renderTarget3.texture.depthBuffer = false;
        this.renderTarget4.texture.depthBuffer = false;
    }

    updateFinalUniforms() {
        this.finalMat.uniforms.iDeltaTime.value = this.bufferMat1.uniforms.iDeltaTime.value;
        this.finalMat.uniforms.iTime.value = this.bufferMat1.uniforms.iTime.value;
        this.finalMat.uniforms.iFrame.value += 1;
    }

    updateBufferUniforms() {
        this.bufferMat1.uniforms.iDeltaTime.value = this.bufferMat2.uniforms.iDeltaTime.value = this.bufferMat3.uniforms.iDeltaTime.value = this.bufferMat4.uniforms.iDeltaTime.value = this.clock.getDelta();
        this.bufferMat1.uniforms.iTime.value = this.bufferMat2.uniforms.iTime.value = this.bufferMat3.uniforms.iTime.value = this.bufferMat4.uniforms.iTime.value = this.clock.getElapsedTime();
        this.bufferMat1.uniforms.iFrame.value = this.bufferMat2.uniforms.iFrame.value = this.bufferMat3.uniforms.iFrame.value = this.bufferMat4.uniforms.iFrame.value += 1;
    }

    createMaterials() {
        this.finalMat = new THREE.RawShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iDeltaTime: { value: 0.0 },
                iFrame: { value: 0 },
                iResolution: { value: new THREE.Vector2(this.width, this.height) },
                iBufferTexture1: { value: this.renderTarget1.texture },
                iBufferTexture2: { value: this.renderTarget2.texture },
                iBufferTexture3: { value: this.renderTarget3.texture },
                iBufferTexture4: { value: this.renderTarget4.texture },
            }, vertexShader: this.getVertexShader(), fragmentShader: this.getFinalFragmentShader()
        });

        this.bufferMat1 = new THREE.RawShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iDeltaTime: { value: 0.0 },
                iFrame: { value: 0 },
                iResolution: { value: new THREE.Vector2(this.width, this.height) },
            }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer1FragShader()
        });

        this.bufferMat2 = new THREE.RawShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iDeltaTime: { value: 0.0 },
                iFrame: { value: 0 },
                iResolution: { value: new THREE.Vector2(this.width, this.height) },
                iBufferTexture1: { value: this.renderTarget1.texture },
            }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer2FragShader()
        });

        this.bufferMat3 = new THREE.RawShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iDeltaTime: { value: 0.0 },
                iFrame: { value: 0 },
                iResolution: { value: new THREE.Vector2(this.width, this.height) },
                iBufferTexture1: { value: this.renderTarget1.texture },
                iBufferTexture2: { value: this.renderTarget2.texture },
            }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer3FragShader()
        });

        this.bufferMat4 = new THREE.RawShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iDeltaTime: { value: 0.0 },
                iFrame: { value: 0 },
                iResolution: { value: new THREE.Vector2(this.width, this.height) },
                iBufferTexture1: { value: this.renderTarget1.texture },
                iBufferTexture2: { value: this.renderTarget2.texture },
                iBufferTexture3: { value: this.renderTarget3.texture },
            }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer4FragShader()
        });
    }


    getVertexShader() {
        return `
            attribute vec3 position;

            void main(){
                gl_Position = vec4(position, 1.0);
            }
        
        `;
    }

    getCommonFragCode() {
        return `
        
        
        `
    }

    getFinalFragShaderCustomCode() {
        return `

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


        void mainImage( out vec4 fragColor, in vec2 fragCoord )
        {
            vec2 uv = (fragCoord-iResolution.xy*.5)/iResolution.y;
            t=iTime*7.;
            vec3 from=path(t);
            adv=path(t+6.+sin(t*.1)*3.);
            vec3 dir=normalize(vec3(uv,.7));
            dir=lookat(adv-from,vec3(0.,1.,0.))*dir;
            vec3 col=march(from, dir);
            fragColor=vec4(col,1.0);
        }

        `;
    }

    getFinalFragmentShader() {
        return `
        precision mediump float;

        uniform float iTime;
        uniform float iDeltaTime;
        uniform int iFrame;
        uniform sampler2D iBufferTexture1;
        uniform sampler2D iBufferTexture2;
        uniform sampler2D iBufferTexture3;
        uniform sampler2D iBufferTexture4;
        uniform vec2 iResolution;

        ` + this.getCommonFragCode() + this.getFinalFragShaderCustomCode() + `

        void main(){
            mainImage(gl_FragColor, vec2(gl_FragCoord.xy));
        }
    
    `;
    }

    getBuffer1FragShader() {
        return `
        precision mediump float;

        uniform float iTime;
        uniform float iDeltaTime;
        uniform int iFrame;
        uniform vec2 iResolution;
        
        ` + this.getCommonFragCode() + this.getBuffer1FragShaderCustomCode() + `

        void main(){
            mainImage(gl_FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer2FragShader() {
        return `
        precision mediump float;

        uniform float iTime;
        uniform float iDeltaTime;
        uniform int iFrame;
        uniform vec2 iResolution;
        uniform sampler2D iBufferTexture1;

        ` + this.getCommonFragCode() + this.getBuffer2FragShaderCustomCode() + `

        void main(){
            mainImage(gl_FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer3FragShader() {
        return `
        precision mediump float;

        uniform float iTime;
        uniform float iDeltaTime;
        uniform int iFrame;
        uniform vec2 iResolution;
        uniform sampler2D iBufferTexture1;
        uniform sampler2D iBufferTexture2;

        ` + this.getCommonFragCode() + this.getBuffer3FragShaderCustomCode() + `

        void main(){
            mainImage(gl_FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer4FragShader() {
        return `
        precision mediump float;

        uniform float iTime;
        uniform float iDeltaTime;
        uniform int iFrame;
        uniform vec2 iResolution;
        uniform sampler2D iBufferTexture1;
        uniform sampler2D iBufferTexture2;
        uniform sampler2D iBufferTexture3;

        ` + this.getCommonFragCode() + this.getBuffer4FragShaderCustomCode() + `

        void main(){
            mainImage(gl_FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer1FragShaderCustomCode() {
        return `

        void mainImage(out vec4 FragColor, in vec4 FragCoord)
        {
            FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }

        `;
    }

    getBuffer2FragShaderCustomCode() {
        return `

        void mainImage(out vec4 FragColor, in vec4 FragCoord)
        {
            FragColor = vec4(0.0, 1.0, 0.0, 1.0);
        }

        `;
    }

    getBuffer3FragShaderCustomCode() {
        return `

        void mainImage(out vec4 FragColor, in vec4 FragCoord)
        {
            FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        }

        `;
    }

    getBuffer4FragShaderCustomCode() {
        return `

        void mainImage(out vec4 FragColor, in vec4 FragCoord)
        {
            FragColor = vec4(1.0, 0.0, 1.0, 1.0);
        }

        `;
    }


    render() {
        return <div style={{ height: 720 }} ref={ref => (this.mount = ref)} />;
    }
}

export default GraphicsTest