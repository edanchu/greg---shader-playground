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

    sceneSetup(){
        this.height = 720;
        this.width = this.height * 16/9;

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera();
        this.camera.position.z = 1;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( this.width, this.height );
        this.mount.appendChild( this.renderer.domElement );

        this.clock = new THREE.Clock(true);

        this.createRenderBuffers();

        this.planeGeometry = new THREE.PlaneGeometry(2,2)
        this.createMaterials();

        this.quad = new THREE.Mesh(this.planeGeometry, this.finalMat);

        this.scene.add(this.quad);
    };

    renderLoop(){

        this.updateBufferUniforms();

        this.renderer.setRenderTarget(this.renderTarget1);
        this.quad.material = this.bufferMat1;
        this.renderer.render( this.scene, this.camera );

        this.renderer.setRenderTarget(this.renderTarget2);
        this.quad.material = this.bufferMat2;
        this.renderer.render( this.scene, this.camera );

        this.renderer.setRenderTarget(this.renderTarget3);
        this.quad.material = this.bufferMat3;
        this.renderer.render( this.scene, this.camera );

        this.updateFinalUniforms();

        this.renderer.setRenderTarget(null);
        this.quad.material = this.bufferMat1;
        this.renderer.render( this.scene, this.camera );

        this.requestID = window.requestAnimationFrame(this.renderLoop);
    };

    createRenderBuffers(){
        this.renderTarget1 = new THREE.WebGLRenderTarget(this.width, this.height);
        this.renderTarget2 = new THREE.WebGLRenderTarget(this.width, this.height);
        this.renderTarget3 = new THREE.WebGLRenderTarget(this.width, this.height);

        this.renderTarget1.texture.wrapS = this.renderTarget1.texture.wrapT = THREE.RepeatWrapping;
        this.renderTarget2.texture.wrapS = this.renderTarget2.texture.wrapT = THREE.RepeatWrapping;
        this.renderTarget3.texture.wrapS = this.renderTarget3.texture.wrapT = THREE.RepeatWrapping;

        this.renderTarget1.texture.magFilter = this.renderTarget1.texture.minFilter = THREE.NearestFilter;
        this.renderTarget2.texture.magFilter = this.renderTarget2.texture.minFilter = THREE.NearestFilter;
        this.renderTarget3.texture.magFilter = this.renderTarget3.texture.minFilter = THREE.NearestFilter;

        this.renderTarget1.texture.depthBuffer = false;
        this.renderTarget2.texture.depthBuffer = false;
        this.renderTarget3.texture.depthBuffer = false;
    }

    updateFinalUniforms(){
        this.finalMat.uniforms.iDeltaTime.value = this.bufferMat1.uniforms.iDeltaTime.value;
        this.finalMat.uniforms.iTime.value = this.bufferMat1.uniforms.iTime.value;
        this.finalMat.uniforms.iFrame.value += 1;
    }

    updateBufferUniforms(){
        this.bufferMat1.uniforms.iDeltaTime.value = this.bufferMat2.uniforms.iDeltaTime.value = this.bufferMat3.uniforms.iDeltaTime.value = this.clock.getDelta();
        this.bufferMat1.uniforms.iTime.value = this.bufferMat2.uniforms.iTime.value = this.bufferMat3.uniforms.iTime.value = this.clock.getElapsedTime();
        this.bufferMat1.uniforms.iFrame.value = this.bufferMat2.uniforms.iFrame.value = this.bufferMat3.uniforms.iFrame.value += 1;
    }

    createMaterials(){
        this.finalMat = new THREE.RawShaderMaterial({uniforms:{
            iTime: {value: 0.0},
            iDeltaTime: {value: 0.0},
            iFrame: {value: 0},
            iBufferTexture1: {value: this.renderTarget1.texture},
            iBufferTexture2: {value: this.renderTarget2.texture},
            iBufferTexture3: {value: this.renderTarget3.texture}
        }, vertexShader: this.getVertexShader(), fragmentShader: this.getFinalFragmentShader()});

        this.bufferMat1 = new THREE.RawShaderMaterial({uniforms:{
            iTime: {value: 0.0},
            iDeltaTime: {value: 0.0},
            iFrame: {value: 0},
        }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer1FragShader()});

        this.bufferMat2 = new THREE.RawShaderMaterial({uniforms:{
            iTime: {value: 0.0},
            iDeltaTime: {value: 0.0},
            iFrame: {value: 0},
        }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer2FragShader()});

        this.bufferMat3 = new THREE.RawShaderMaterial({uniforms:{
            iTime: {value: 0.0},
            iDeltaTime: {value: 0.0},
            iFrame: {value: 0},
        }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer3FragShader()});
    }


    getVertexShader(){
        return `
            attribute vec3 position;

            void main(){
                gl_Position = vec4(position, 1.0);
            }
        
        `;
    }

    getFinalFragShaderCustomCode(){
        return `

        void mainImage(out vec4 FragColor, in vec4 FragCoord)
        {
            vec4 buff1 = texture2D(iBufferTexture1, FragCoord.xy);
            FragColor = buff1;
        }

        `;
    }

    getFinalFragmentShader(){
        return `
        precision mediump float;

        uniform float iTime;
        uniform float iDeltaTime;
        uniform int iFrame;
        uniform sampler2D iBufferTexture1;
        uniform sampler2D iBufferTexture2;
        uniform sampler2D iBufferTexture3;

        ` + this.getFinalFragShaderCustomCode() + `

        void main(){
            mainImage(gl_FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer1FragShader(){
        return `
        precision mediump float;

        uniform float iTime;
        uniform float iDeltaTime;
        uniform int iFrame;

        ` + this.getBuffer1FragShaderCustomCode() + `

        void main(){
            mainImage(gl_FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer2FragShader(){
        return `
        precision mediump float;

        uniform float iTime;
        uniform float iDeltaTime;
        uniform int iFrame;

        ` + this.getBuffer2FragShaderCustomCode() + `

        void main(){
            mainImage(gl_FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer3FragShader(){
        return `
        precision mediump float;

        uniform float iTime;
        uniform float iDeltaTime;
        uniform int iFrame;

        ` + this.getBuffer3FragShaderCustomCode() + `

        void main(){
            mainImage(gl_FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer1FragShaderCustomCode(){
        return `

        void mainImage(out vec4 FragColor, in vec4 FragCoord)
        {
            FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }

        `;
    }

    getBuffer2FragShaderCustomCode(){
        return `

        void mainImage(out vec4 FragColor, in vec4 FragCoord)
        {
            FragColor = vec4(0.0, 1.0, 0.0, 1.0);
        }

        `;
    }

    getBuffer3FragShaderCustomCode(){
        return `

        void mainImage(out vec4 FragColor, in vec4 FragCoord)
        {
            FragColor = vec4(0.0, 0.0, 1.0, 1.0);
        }

        `;
    }


    render() {
        return <div ref={ref => (this.mount = ref)} />;
    }
}

export default GraphicsTest