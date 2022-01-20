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
        const height = 720;
        const width = height * 16/9;

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera();
        this.camera.position.z = 1;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( width, height );
        this.mount.appendChild( this.renderer.domElement );

        this.clock = new THREE.Clock(true);

        let planeGeometry = new THREE.PlaneGeometry(2,2)
        let planeMaterial = new THREE.RawShaderMaterial({
            uniforms:{
                iTime: {value: 0.0},
                iDeltaTime: {value: 0.0},
                iFrame: {value: 0},
            },
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
        });

        this.quad = new THREE.Mesh(planeGeometry, planeMaterial);

        this.scene.add(this.quad);
    };

    renderLoop(){
        this.renderer.render( this.scene, this.camera );

        this.updateUniforms();

        this.requestID = window.requestAnimationFrame(this.renderLoop);
    };

    updateUniforms(){
        this.quad.material.uniforms.iDeltaTime.value = this.clock.getDelta();
        this.quad.material.uniforms.iTime.value = this.clock.getElapsedTime();
        this.quad.material.uniforms.iFrame.value += 1;
    }

    getVertexShader(){
        return `
            attribute vec3 position;

            void main(){
                gl_Position = vec4(position, 1.0);
            }
        
        `;
    }

    getFragShaderCustomCode(){
        return `

        void mainImage(out vec4 FragColor, in vec4 FragCoord)
        {
            FragColor = vec4(iTime, 0.0, 1.0, 1.0);
        }

        `;
    }

    getFragmentShader(){
        return `
        precision mediump float;

        uniform float iTime;
        uniform float iDeltaTime;

        ` + this.getFragShaderCustomCode() + `

        void main(){
            mainImage(gl_FragColor, gl_FragCoord);
        }
    
    `;
    }

    render() {
        return <div ref={ref => (this.mount = ref)} />;
    }
}

export default GraphicsTest