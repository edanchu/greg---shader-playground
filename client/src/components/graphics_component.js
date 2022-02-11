import React, { Component } from "react";
//import ReactDOM from "react-dom";
import * as THREE from 'three';

class GraphicsComponent extends Component {
    componentDidMount() {
        this.sceneSetup = this.sceneSetup.bind(this);
        this.renderLoop = this.renderLoop.bind(this);

        this.pause = this.props.pause;
        this.mouse = new THREE.Vector4(0, 0, -1, -1);
        this.height = this.props.height;
        this.width = this.height * 16 / 9;
        this.clock = new THREE.Clock();
        this.keyboard = new THREE.DataTexture(new Uint8Array(4 * 256), 256, 1, THREE.RGBAFormat);
        this.frameNumber = 0;
        this.pauseStartTime = 0;
        this.timePaused = 0;
        let tempDate = new Date();
        this.date = new THREE.Vector4(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), (tempDate.getHours() * 3600) + (tempDate.getMinutes() * 60) + tempDate.getSeconds() + (tempDate.getMilliseconds / 1000));


        document.addEventListener('keydown', this.keyDownCallback);
        document.addEventListener('keyup', this.keyUpCallback);

        this.sceneSetup();
        this.renderLoop();
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.requestID);
    }

    mouseMoveCallback = (e) => {
        this.mouse.y = Math.min((this.height - e.clientY - e.target.offsetTop), this.height);
        this.mouse.x = Math.min((e.clientX - e.target.offsetLeft), this.width);
    }

    mouseDownCallback = (e) => {
        this.mouse.w = Math.min((this.height - e.clientY - e.target.offsetTop), this.height);
        this.mouse.z = Math.min((e.clientX - e.target.offsetLeft), this.width);
    }

    keyDownCallback = (e) => {
        if (e.keyCode > 255) return;
        this.keyboard.image.data[e.keyCode * 4] = 255;
        this.keyboard.image.data[(e.keyCode * 4) + 1] = this.keyboard.image.data[(e.keyCode * 4) + 1] === 255 ? 0 : 255;
        this.keyboard.image.data[(e.keyCode * 4) + 2] = this.frameNumber % 256;
        this.keyboard.needsUpdate = true;
    }

    keyUpCallback = (e) => {
        if (e.keyCode > 255) return;
        this.keyboard.image.data[e.keyCode * 4] = 0;
        this.keyboard.needsUpdate = true;
    }

    pauseStartCallback = (e) => {
        this.pauseStartTime = this.clock.getElapsedTime();
        this.pause = true;
    }

    pauseEndCallback = (e) => {
        this.timePaused = this.clock.getElapsedTime() - this.pauseStartTime + this.timePaused;
        this.pause = false;
    }

    restartCallback = (e) => {
        this.clock.stop();
        this.clock.start();
        this.frameNumber = 0;
        this.pauseStartTime = 0;
        this.timePaused = 0;
        this.pause = false;
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
        const renderBufferSettings = { wrapS: THREE.RepeatWrapping, wrapT: THREE.RepeatWrapping, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: false };

        this.renderTarget1 = new THREE.WebGLRenderTarget(this.width, this.height, renderBufferSettings);
        this.renderTarget2 = new THREE.WebGLRenderTarget(this.width, this.height, renderBufferSettings);
        this.renderTarget3 = new THREE.WebGLRenderTarget(this.width, this.height, renderBufferSettings);
        this.renderTarget4 = new THREE.WebGLRenderTarget(this.width, this.height, renderBufferSettings);
    }

    updateFinalUniforms() {
        this.finalMat.uniforms.iDeltaTime.value = this.bufferMat1.uniforms.iDeltaTime.value;
        this.finalMat.uniforms.iTime.value = this.bufferMat1.uniforms.iTime.value;
    }

    updateBufferUniforms() {
        if (!this.pause) {
            this.bufferMat1.uniforms.iDeltaTime.value = this.bufferMat2.uniforms.iDeltaTime.value = this.bufferMat3.uniforms.iDeltaTime.value = this.bufferMat4.uniforms.iDeltaTime.value = this.clock.getDelta();
            this.bufferMat1.uniforms.iTime.value = this.bufferMat2.uniforms.iTime.value = this.bufferMat3.uniforms.iTime.value = this.bufferMat4.uniforms.iTime.value = this.clock.getElapsedTime() - this.timePaused;
            this.frameNumber++;
            let tempDate = new Date();
            this.date.x = tempDate.getFullYear();
            this.date.y = tempDate.getMonth();
            this.date.z = tempDate.getDay();
            this.date.w = (tempDate.getHours() * 3600) + (tempDate.getMinutes() * 60) + tempDate.getSeconds() + (tempDate.getMilliseconds / 1000);
        }
    }

    createMaterials() {
        this.finalMat = new THREE.RawShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iDeltaTime: { value: 0.0 },
                iFrame: { value: this.frameNumber },
                iResolution: { value: new THREE.Vector2(this.width, this.height) },
                iMouse: { value: this.mouse },
                iKeyboard: { value: this.keyboard },
                iDate: { value: this.date },
                iBufferTexture1: { value: this.renderTarget1.texture },
                iBufferTexture2: { value: this.renderTarget2.texture },
                iBufferTexture3: { value: this.renderTarget3.texture },
                iBufferTexture4: { value: this.renderTarget4.texture },
            }, vertexShader: this.getVertexShader(), fragmentShader: this.getFinalFragmentShader(),
            glslVersion: THREE.GLSL3,
        });

        this.bufferMat1 = new THREE.RawShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iDeltaTime: { value: 0.0 },
                iFrame: { value: this.frameNumber },
                iResolution: { value: new THREE.Vector2(this.width, this.height) },
                iMouse: { value: this.mouse },
                iKeyboard: { value: this.keyboard },
                iDate: { value: this.date },
            }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer1FragShader(),
            glslVersion: THREE.GLSL3,
        });

        this.bufferMat2 = new THREE.RawShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iDeltaTime: { value: 0.0 },
                iFrame: { value: this.frameNumber },
                iResolution: { value: new THREE.Vector2(this.width, this.height) },
                iMouse: { value: this.mouse },
                iKeyboard: { value: this.keyboard },
                iDate: { value: this.date },
                iBufferTexture1: { value: this.renderTarget1.texture },
            }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer2FragShader(),
            glslVersion: THREE.GLSL3,
        });

        this.bufferMat3 = new THREE.RawShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iDeltaTime: { value: 0.0 },
                iFrame: { value: this.frameNumber },
                iResolution: { value: new THREE.Vector2(this.width, this.height) },
                iMouse: { value: this.mouse },
                iKeyboard: { value: this.keyboard },
                iDate: { value: this.date },
                iBufferTexture1: { value: this.renderTarget1.texture },
                iBufferTexture2: { value: this.renderTarget2.texture },
            }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer3FragShader(),
            glslVersion: THREE.GLSL3,
        });

        this.bufferMat4 = new THREE.RawShaderMaterial({
            uniforms: {
                iTime: { value: 0.0 },
                iDeltaTime: { value: 0.0 },
                iFrame: { value: this.frameNumber },
                iResolution: { value: new THREE.Vector2(this.width, this.height) },
                iMouse: { value: this.mouse },
                iKeyboard: { value: this.keyboard },
                iDate: { value: this.date },
                iBufferTexture1: { value: this.renderTarget1.texture },
                iBufferTexture2: { value: this.renderTarget2.texture },
                iBufferTexture3: { value: this.renderTarget3.texture },
            }, vertexShader: this.getVertexShader(), fragmentShader: this.getBuffer4FragShader(),
            glslVersion: THREE.GLSL3,
        });
    }

    getVertexShader() {
        return `
            in vec3 position;

            void main(){
                gl_Position = vec4(position, 1.0);
            }
        
        `;
    }

    getCommonFragCode() {
        return this.props.commonFragShaderCustomCode ? this.props.commonFragShaderCustomCode : "";
    }

    getCommonUniforms() {
        return `
        uniform float iTime;
        uniform float iDeltaTime;
        uniform int iFrame;
        uniform vec2 iResolution;
        uniform vec4 iMouse;
        uniform sampler2D iKeyboard;
        uniform vec4 iDate;
        `
    }

    getFinalFragShaderCustomCode() {
        return this.props.finalFragShaderCustomCode ? this.props.finalFragShaderCustomCode : "";
    }

    getFinalFragmentShader() {
        return `
        precision highp float;

        ` + this.getCommonUniforms() + `

        uniform sampler2D iBufferTexture1;
        uniform sampler2D iBufferTexture2;
        uniform sampler2D iBufferTexture3;
        uniform sampler2D iBufferTexture4;

        out vec4 FragColor;

        ` + this.getCommonFragCode() + this.getFinalFragShaderCustomCode() + `

        void main(){
            mainImage(FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer1FragShader() {
        return `
        precision highp float;

        ` + this.getCommonUniforms() + `

        out vec4 FragColor;
        
        ` + this.getCommonFragCode() + this.getBuffer1FragShaderCustomCode() + `

        void main(){
            mainImage(FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer2FragShader() {
        return `
        precision highp float;

        ` + this.getCommonUniforms() + `

        uniform sampler2D iBufferTexture1;

        out vec4 FragColor;

        ` + this.getCommonFragCode() + this.getBuffer2FragShaderCustomCode() + `

        void main(){
            mainImage(FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer3FragShader() {
        return `
        precision highp float;

        ` + this.getCommonUniforms() + `
        
        uniform sampler2D iBufferTexture1;
        uniform sampler2D iBufferTexture2;

        out vec4 FragColor;

        ` + this.getCommonFragCode() + this.getBuffer3FragShaderCustomCode() + `

        void main(){
            mainImage(FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer4FragShader() {
        return `
        precision highp float;

        ` + this.getCommonUniforms() + `
        
        uniform sampler2D iBufferTexture1;
        uniform sampler2D iBufferTexture2;
        uniform sampler2D iBufferTexture3;

        out vec4 FragColor;

        ` + this.getCommonFragCode() + this.getBuffer4FragShaderCustomCode() + `

        void main(){
            mainImage(FragColor, gl_FragCoord);
        }
    
    `;
    }

    getBuffer1FragShaderCustomCode() {
        return this.props.buffer1FragShaderCustomCode ? this.props.buffer1FragShaderCustomCode : "";
    }

    getBuffer2FragShaderCustomCode() {
        return this.props.buffer2FragShaderCustomCode ? this.props.buffer2FragShaderCustomCode : "";
    }

    getBuffer3FragShaderCustomCode() {
        return this.props.buffer3FragShaderCustomCode ? this.props.buffer3FragShaderCustomCode : "";
    }

    getBuffer4FragShaderCustomCode() {
        return this.props.buffer4FragShaderCustomCode ? this.props.buffer4FragShaderCustomCode : "";
    }

    render() {
        const style = {
            float: "left",
            backgroundColor: "gray"
        }
        return (<div style={style}>
            <div
                onMouseMove={(e) => this.mouseMoveCallback(e)}
                onMouseDown={(e) => this.mouseDownCallback(e)}
                onMouseEnter={(e) => { this.props.playOnMouseOver ? this.pauseEndCallback(e) : <></> }}
                onMouseLeave={(e) => { this.props.playOnMouseOver ? this.pauseStartCallback(e) : <></> }}
                ref={ref => (this.mount = ref)}
            />
            {(this.props.showButtons ? <button onClick={(e) => this.restartCallback(e)}>{'\u23ee'}</button> : <></>)}
            {(this.props.showButtons ? <button onClick={(e) => !this.pause ? this.pauseStartCallback(e) : this.pauseEndCallback(e)}>{"\u23ef"}</button> : <></>)}
        </div>);
    }
}

export default GraphicsComponent