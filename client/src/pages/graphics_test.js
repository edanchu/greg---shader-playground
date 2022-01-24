import React, { Component } from "react";
//import ReactDOM from "react-dom";
import * as THREE from 'three';

class GraphicsTest extends Component {
    componentDidMount() {
        this.sceneSetup = this.sceneSetup.bind(this);
        this.renderLoop = this.renderLoop.bind(this);

        this.mouse = new THREE.Vector4(0, 0, -1, -1);
        this.height = this.props.height;
        this.width = this.height * 16 / 9;
        this.clock = new THREE.Clock(true);
        

        this.sceneSetup();
        this.renderLoop();
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.requestID);
    }

    mouseMoveCallback(e){
        this.mouse.y = Math.min((this.height - e.clientY - e.target.offsetTop), this.height);
        this.mouse.x = Math.min((e.clientX - e.target.offsetLeft), this.width);
    }

    mouseDownCallback(e){
        this.mouse.w = Math.min((this.height - e.clientY - e.target.offsetTop), this.height);
        this.mouse.z = Math.min((e.clientX - e.target.offsetLeft), this.width);
    }

    mouseUpCallback(e){
        this.mouse.w = -1;
        this.mouse.z = -1;
    }

    sceneSetup() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera();
        this.camera.position.z = 1;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.mount.appendChild(this.renderer.domElement);

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
                iMouse: {value: this.mouse},
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
                iMouse: {value: this.mouse},
            }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer1FragShader()
        });

        this.bufferMat2 = new THREE.RawShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iDeltaTime: { value: 0.0 },
                iFrame: { value: 0 },
                iResolution: { value: new THREE.Vector2(this.width, this.height) },
                iMouse: {value: this.mouse},
                iBufferTexture1: { value: this.renderTarget1.texture },
            }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer2FragShader()
        });

        this.bufferMat3 = new THREE.RawShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iDeltaTime: { value: 0.0 },
                iFrame: { value: 0 },
                iResolution: { value: new THREE.Vector2(this.width, this.height) },
                iMouse: {value: this.mouse},
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
                iMouse: {value: this.mouse},
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


        void mainImage( out vec4 fragColor, in vec2 fragCoord )
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
        uniform vec4 iMouse;

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
        uniform vec4 iMouse;
        
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
        uniform vec4 iMouse;
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
        uniform vec4 iMouse;
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
        uniform vec4 iMouse;
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
        return <div 
            onMouseMove={(e) => this.mouseMoveCallback(e)} 
            onMouseDown={(e) => this.mouseDownCallback(e)} 
            onMouseUp={(e) => this.mouseUpCallback(e)} 
            ref={ref => (this.mount = ref)} 
        />;
    }
}

export default GraphicsTest