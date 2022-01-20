import React, { Component } from "react";
import ReactDOM from "react-dom";
import * as THREE from 'three';

class GraphicsTest extends Component {
    componentDidMount() {
        this.sceneSetup();
        this.startAnimationLoop();
    }

    componentWillUnmount() {
        window.cancelAnimationFrame(this.requestID);
    }

    sceneSetup(){
        const width = 720;
        const height = 480;

        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera();
        this.camera.position.z = 1;
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( width, height );
        this.mount.appendChild( this.renderer.domElement );

        const planeGeometry = new THREE.PlaneGeometry(2,2)
        const planeMaterial = new THREE.RawShaderMaterial({
            uniforms:{},
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
        });

        this.scene.add(new THREE.Mesh(planeGeometry, planeMaterial));
    };

    startAnimationLoop(){
        this.renderer.render( this.scene, this.camera );

        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    getVertexShader(){
        return `
            attribute vec3 position;

            void main(){
                gl_Position = vec4(position, 1.0);
            }
        
        `
    }

    getFragmentShader(){
        return `
            void main(){
                gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
            }
        
        `
    }

    render() {
        return <div ref={ref => (this.mount = ref)} />;
    }
}

export default GraphicsTest