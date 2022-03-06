import React, { Component } from 'react';
import * as THREE from 'three';

class GraphicsComponent extends Component {
  componentDidMount() {
    this.sceneSetup = this.sceneSetup.bind(this);
    this.renderLoop = this.renderLoop.bind(this);

    this.errorMessages = [];
    this.pause = false;
    this.startPaused = this.props.pause;
    this.mouse = new THREE.Vector4(0, 0, -1, -1);
    this.mouseHeldDown = false;
    this.height = this.props.height ? this.props.height : 350;
    this.width = (this.height * 15) / 9;
    this.clock = new THREE.Clock();
    this.keyboard = new THREE.DataTexture(
      new Uint8Array(4 * 256),
      256,
      1,
      THREE.RGBAFormat
    );
    this.frameNumber = 0;
    this.pauseStartTime = 0;
    this.timePaused = 0;
    let tempDate = new Date();
    this.date = new THREE.Vector4(
      tempDate.getFullYear(),
      tempDate.getMonth(),
      tempDate.getDate(),
      tempDate.getHours() * 3600 +
      tempDate.getMinutes() * 60 +
      tempDate.getSeconds() +
      tempDate.getMilliseconds / 1000
    );
    this.loader = new THREE.TextureLoader();
    this.cubeLoader = new THREE.CubeTextureLoader();

    document.addEventListener('keydown', this.keyDownCallback);
    document.addEventListener('keyup', this.keyUpCallback);

    this.sceneSetup();
    this.renderLoop();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.height !== prevProps.height) {
      this.height = this.props.height;
      this.width = (this.height * 16) / 9;
      this.renderer.setSize(this.width, this.height);
      this.createRenderBuffers();
      this.createMaterials();
    }
    else if (
      this.props.finalFragShaderCustomCode !== prevProps.finalFragShaderCustomCode ||
      this.props.channels !== prevProps.channels ||
      this.props.buffer1FragShaderCustomCode !== prevProps.buffer1FragShaderCustomCode ||
      this.props.buffer2FragShaderCustomCode !== prevProps.buffer2FragShaderCustomCode ||
      this.props.buffer3FragShaderCustomCode !== prevProps.buffer3FragShaderCustomCode ||
      this.props.buffer4FragShaderCustomCode !== prevProps.buffer4FragShaderCustomCode ||
      this.props.commonFragShaderCustomCode !== prevProps.commonFragShaderCustomCode
    ) {
      this.createMaterials();
      this.restartCallback(null);
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.requestID);
  }

  sceneSetup() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera();
    this.camera.position.z = 1;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.width, this.height);
    this.mount.appendChild(this.renderer.domElement);

    this.createRenderBuffers();

    this.planeGeometry = new THREE.PlaneGeometry(2, 2);
    this.createMaterials();

    this.quad = new THREE.Mesh(this.planeGeometry, this.finalMat);

    this.scene.add(this.quad);
  }

  createRenderBuffers() {
    const renderBufferSettings = {
      wrapS: THREE.RepeatWrapping,
      wrapT: THREE.RepeatWrapping,
      minFilter: THREE.LinearMipmapLinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      generateMipmaps: true
    };

    this.renderTarget1 = new THREE.WebGLRenderTarget(
      this.width,
      this.height,
      renderBufferSettings
    );
    this.renderTarget2 = new THREE.WebGLRenderTarget(
      this.width,
      this.height,
      renderBufferSettings
    );
    this.renderTarget3 = new THREE.WebGLRenderTarget(
      this.width,
      this.height,
      renderBufferSettings
    );
    this.renderTarget4 = new THREE.WebGLRenderTarget(
      this.width,
      this.height,
      renderBufferSettings
    );
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
        iChannel0: { value: this.getChannelData(0, 0) },
        iChannel1: { value: this.getChannelData(0, 1) },
        iChannel2: { value: this.getChannelData(0, 2) },
        iChannel3: { value: this.getChannelData(0, 3) },
        iChannel0Resolution: { value: this.getChannelResolution(0, 0) },
        iChannel1Resolution: { value: this.getChannelResolution(0, 1) },
        iChannel2Resolution: { value: this.getChannelResolution(0, 2) },
        iChannel3Resolution: { value: this.getChannelResolution(0, 3) },
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getFinalFragmentShader(),
      glslVersion: THREE.GLSL3,
    });


    this.bufferMat1 = new THREE.RawShaderMaterial({
      uniforms: {
        iTime: { value: 0.0 },
        iDeltaTime: { value: 0.0 },
        iFrame: { value: this.frameNumber },
        iMouse: { value: this.mouse },
        iKeyboard: { value: this.keyboard },
        iResolution: { value: new THREE.Vector2(this.width, this.height) },
        iDate: { value: this.date },
        iChannel0: { value: this.getChannelData(1, 0) },
        iChannel1: { value: this.getChannelData(1, 1) },
        iChannel2: { value: this.getChannelData(1, 2) },
        iChannel3: { value: this.getChannelData(1, 3) },
        iChannel0Resolution: { value: this.getChannelResolution(0, 0) },
        iChannel1Resolution: { value: this.getChannelResolution(0, 1) },
        iChannel2Resolution: { value: this.getChannelResolution(0, 2) },
        iChannel3Resolution: { value: this.getChannelResolution(0, 3) },
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getBuffer1FragShader(),
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
        iChannel0: { value: this.getChannelData(2, 0) },
        iChannel1: { value: this.getChannelData(2, 1) },
        iChannel2: { value: this.getChannelData(2, 2) },
        iChannel3: { value: this.getChannelData(2, 3) },
        iChannel0Resolution: { value: this.getChannelResolution(0, 0) },
        iChannel1Resolution: { value: this.getChannelResolution(0, 1) },
        iChannel2Resolution: { value: this.getChannelResolution(0, 2) },
        iChannel3Resolution: { value: this.getChannelResolution(0, 3) },
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getBuffer2FragShader(),
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
        iChannel0: { value: this.getChannelData(3, 0) },
        iChannel1: { value: this.getChannelData(3, 1) },
        iChannel2: { value: this.getChannelData(3, 2) },
        iChannel3: { value: this.getChannelData(3, 3) },
        iChannel0Resolution: { value: this.getChannelResolution(0, 0) },
        iChannel1Resolution: { value: this.getChannelResolution(0, 1) },
        iChannel2Resolution: { value: this.getChannelResolution(0, 2) },
        iChannel3Resolution: { value: this.getChannelResolution(0, 3) },
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getBuffer3FragShader(),
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
        iChannel0: { value: this.getChannelData(4, 0) },
        iChannel1: { value: this.getChannelData(4, 1) },
        iChannel2: { value: this.getChannelData(4, 2) },
        iChannel3: { value: this.getChannelData(4, 3) },
        iChannel0Resolution: { value: this.getChannelResolution(0, 0) },
        iChannel1Resolution: { value: this.getChannelResolution(0, 1) },
        iChannel2Resolution: { value: this.getChannelResolution(0, 2) },
        iChannel3Resolution: { value: this.getChannelResolution(0, 3) },
      },
      vertexShader: this.getVertexShader(),
      fragmentShader: this.getBuffer4FragShader(),
      glslVersion: THREE.GLSL3,
    });
  }

  getChannelData(bufferNumber, channelNumber) {
    if (!this.props.channels || !this.props.channels[bufferNumber][channelNumber]) {
      return null;
    }
    if (this.props.channels[bufferNumber][channelNumber].genType === 'sampler2D') {
      let tex = this.loader.load("/textures/" + this.props.channels[bufferNumber][channelNumber].path);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      return tex;
    }
    let tex = this.cubeLoader.load(["/textures/" + this.props.channels[bufferNumber][channelNumber].path + "/posx.jpg",
    "/textures/" + this.props.channels[bufferNumber][channelNumber].path + "/negx.jpg",
    "/textures/" + this.props.channels[bufferNumber][channelNumber].path + "/posy.jpg",
    "/textures/" + this.props.channels[bufferNumber][channelNumber].path + "/negy.jpg",
    "/textures/" + this.props.channels[bufferNumber][channelNumber].path + "/posz.jpg",
    "/textures/" + this.props.channels[bufferNumber][channelNumber].path + "/negz.jpg"]);
    return tex;
  }

  getChannelResolution(bufferNumber, channelNumber) {
    if (!this.props.channels || !this.props.channels[bufferNumber][channelNumber] || this.props.channels[bufferNumber][channelNumber].genType === 'samplerCube') {
      return new THREE.Vector2(2048, 2048);
    }
    let re = new RegExp("[0-9]+x[0-9]+");
    let matches = re.exec(this.props.channels[bufferNumber][channelNumber].path);
    matches = matches[0].split('x');
    return new THREE.Vector2(matches[0], matches[1]);
  }

  getChannelType(bufferNumber, channelNumber) {
    return this.props.channels &&
      this.props.channels[bufferNumber][channelNumber]
      ? this.props.channels[bufferNumber][channelNumber].genType
      : 'float';
  }

  renderLoop() {
    if (!this.pause) {

      this.updateBufferUniforms();

      this.updateFinalUniforms();

      const holder = console.error;
      console.error = (...messages) => {
        this.errorMessages.push(messages[0])
      }

      this.renderBufferTextures();

      this.renderFinalScene();

      console.error = holder;

      if (this.errorMessages.length > 0) {
        this.props.handleErrors(this.errorMessages);
        this.errorMessages = [];
      }

    }

    if (this.startPaused) {
      if (this.frameNumber > 10) {
        this.pause = true;
        this.startPaused = false;
      }
    }

    this.requestID = window.requestAnimationFrame(this.renderLoop);
  }

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

  updateBufferUniforms() {
    if (!this.pause) {
      this.bufferMat1.uniforms.iDeltaTime.value =
        this.bufferMat2.uniforms.iDeltaTime.value =
        this.bufferMat3.uniforms.iDeltaTime.value =
        this.bufferMat4.uniforms.iDeltaTime.value =
        this.clock.getDelta();
      this.bufferMat1.uniforms.iTime.value =
        this.bufferMat2.uniforms.iTime.value =
        this.bufferMat3.uniforms.iTime.value =
        this.bufferMat4.uniforms.iTime.value =
        this.clock.getElapsedTime() - this.timePaused;
      this.frameNumber++;
      let tempDate = new Date();
      this.date.x = tempDate.getFullYear();
      this.date.y = tempDate.getMonth();
      this.date.z = tempDate.getDay();
      this.date.w =
        tempDate.getHours() * 3600 +
        tempDate.getMinutes() * 60 +
        tempDate.getSeconds() +
        tempDate.getMilliseconds / 1000;
    }
  }

  updateFinalUniforms() {
    this.finalMat.uniforms.iDeltaTime.value = this.bufferMat1.uniforms.iDeltaTime.value;
    this.finalMat.uniforms.iTime.value = this.bufferMat1.uniforms.iTime.value;
  }

  getVertexShader() {
    return `
            in vec3 position;

            void main(){
                gl_Position = vec4(position, 1.0);
            }
        
        `;
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
uniform vec2 iChannel0Resolution;
uniform vec2 iChannel1Resolution;
uniform vec2 iChannel2Resolution;
uniform vec2 iChannel3Resolution;
`;
  }

  getFinalFragmentShader() {
    return (
      `
precision highp float;
` +
      this.getCommonUniforms() +
      `
uniform sampler2D iBufferTexture1;
uniform sampler2D iBufferTexture2;
uniform sampler2D iBufferTexture3;
uniform sampler2D iBufferTexture4;

uniform ` + this.getChannelType(0, 0) + ` iChannel0;
uniform ` + this.getChannelType(0, 1) + ` iChannel1;
uniform ` + this.getChannelType(0, 2) + ` iChannel2;
uniform ` + this.getChannelType(0, 3) + ` iChannel3;

out vec4 FragColor;

` + this.getCommonFragCode() + `\n\n` + this.getFinalFragShaderCustomCode() + `

void main(){
    mainImage(FragColor);
}
`);
  }

  getBuffer1FragShader() {
    return (
      `
precision highp float;
` + this.getCommonUniforms() + `
uniform ` + this.getChannelType(1, 0) + ` iChannel0;
uniform ` + this.getChannelType(1, 1) + ` iChannel1;
uniform ` + this.getChannelType(1, 2) + ` iChannel2;
uniform ` + this.getChannelType(1, 3) + ` iChannel3;

out vec4 FragColor;

` + this.getCommonFragCode() + `\n\n` + this.getBuffer1FragShaderCustomCode() + `

void main(){
    mainImage(FragColor);
}
`
    );
  }

  getBuffer2FragShader() {
    return (
      `
precision highp float;
` + this.getCommonUniforms() + `
uniform sampler2D iBufferTexture1;

uniform ` + this.getChannelType(2, 0) + ` iChannel0;
uniform ` + this.getChannelType(2, 1) + ` iChannel1;
uniform ` + this.getChannelType(2, 2) + ` iChannel2;
uniform ` + this.getChannelType(2, 3) + ` iChannel3;

out vec4 FragColor;

` + this.getCommonFragCode() + `\n\n` + this.getBuffer2FragShaderCustomCode() + `

void main(){
    mainImage(FragColor);
}
`
    );
  }

  getBuffer3FragShader() {
    return (
      `
precision highp float;

` + this.getCommonUniforms() + `
uniform sampler2D iBufferTexture1;
uniform sampler2D iBufferTexture2;

uniform ` + this.getChannelType(3, 0) + ` iChannel0;
uniform ` + this.getChannelType(3, 1) + ` iChannel1;
uniform ` + this.getChannelType(3, 2) + ` iChannel2;
uniform ` + this.getChannelType(3, 3) + ` iChannel3;

out vec4 FragColor;

` + this.getCommonFragCode() + `\n\n` + this.getBuffer3FragShaderCustomCode() + `

void main(){
    mainImage(FragColor);
}
`
    );
  }

  getBuffer4FragShader() {
    return (
      `
 precision highp float;
 ` + this.getCommonUniforms() +
      `
uniform sampler2D iBufferTexture1;
uniform sampler2D iBufferTexture2;
uniform sampler2D iBufferTexture3;

uniform ` + this.getChannelType(4, 0) + ` iChannel0;
uniform ` + this.getChannelType(4, 1) + ` iChannel1;
uniform ` + this.getChannelType(4, 2) + ` iChannel2;
uniform ` + this.getChannelType(4, 3) + ` iChannel3;

out vec4 FragColor;

` + this.getCommonFragCode() + `\n\n` + this.getBuffer4FragShaderCustomCode() + `

void main(){
    mainImage(FragColor);
}`
    );
  }

  getCommonFragCode() {
    return this.props.commonFragShaderCustomCode
      ? this.props.commonFragShaderCustomCode
      : '';
  }

  getFinalFragShaderCustomCode() {
    return this.props.finalFragShaderCustomCode
      ? this.props.finalFragShaderCustomCode
      : `void mainImage(out vec4 FragColor){ FragColor = vec4(0.0, 0.0, 0.0, 1.0);}`;
  }

  getBuffer1FragShaderCustomCode() {
    return this.props.buffer1FragShaderCustomCode
      ? this.props.buffer1FragShaderCustomCode
      : `void mainImage(out vec4 FragColor){ FragColor = vec4(0.0, 0.0, 0.0, 1.0);}`;
  }

  getBuffer2FragShaderCustomCode() {
    return this.props.buffer2FragShaderCustomCode
      ? this.props.buffer2FragShaderCustomCode
      : `void mainImage(out vec4 FragColor){ FragColor = vec4(0.0, 0.0, 0.0, 1.0);}`;
  }

  getBuffer3FragShaderCustomCode() {
    return this.props.buffer3FragShaderCustomCode
      ? this.props.buffer3FragShaderCustomCode
      : `void mainImage(out vec4 FragColor){ FragColor = vec4(0.0, 0.0, 0.0, 1.0);}`;
  }

  getBuffer4FragShaderCustomCode() {
    return this.props.buffer4FragShaderCustomCode
      ? this.props.buffer4FragShaderCustomCode
      : `void mainImage(out vec4 FragColor){ FragColor = vec4(0.0, 0.0, 0.0, 1.0);}`;
  }

  mouseMoveCallback = (e) => {
    const rect = e.target.getBoundingClientRect();
    this.mouse.y = Math.min(rect.bottom - e.clientY, this.height);
    this.mouse.x = Math.min(e.clientX - rect.left, this.width);
    if (this.mouseHeldDown === true) {
      this.mouse.w = Math.min(rect.bottom - e.clientY, this.height);
      this.mouse.z = Math.min(e.clientX - rect.left, this.width);
    }
  };

  mouseDownCallback = (e) => {
    this.mouseHeldDown = true;
  };

  mouseUpCallback = (e) => {
    this.mouseHeldDown = false;
    const rect = e.target.getBoundingClientRect();
    this.mouse.w = Math.min(rect.bottom - e.clientY, this.height);
    this.mouse.z = Math.min(e.clientX - rect.left, this.width);
  }

  keyDownCallback = (e) => {
    if (e.keyCode > 255) return;
    this.keyboard.image.data[e.keyCode * 4] = 255;
    this.keyboard.image.data[e.keyCode * 4 + 1] = this.keyboard.image.data[e.keyCode * 4 + 1] === 255 ? 0 : 255;
    this.keyboard.image.data[e.keyCode * 4 + 2] = this.frameNumber % 256;
    this.keyboard.needsUpdate = true;
  };

  keyUpCallback = (e) => {
    if (e.keyCode > 255) return;
    this.keyboard.image.data[e.keyCode * 4] = 0;
    this.keyboard.needsUpdate = true;
  };

  pauseStartCallback = (e) => {
    this.pauseStartTime = this.clock.getElapsedTime();
    this.pause = true;
  };

  pauseEndCallback = (e) => {
    this.timePaused =
      this.clock.getElapsedTime() - this.pauseStartTime + this.timePaused;
    this.pause = false;
  };

  restartCallback = (e) => {
    this.clock.stop();
    this.clock.start();
    this.frameNumber = 0;
    this.pauseStartTime = 0;
    this.timePaused = 0;
    this.pause = false;
  };

  render() {
    const style = {
      float: 'left',
      backgroundColor: 'gray',
    };
    return (
      <div style={style}>
        <div
          onMouseMove={(e) => this.mouseMoveCallback(e)}
          onMouseDown={(e) => this.mouseDownCallback(e)}
          onMouseUp={(e) => this.mouseUpCallback(e)}
          onMouseEnter={(e) => { this.props.playOnMouseOver ? this.pauseEndCallback(e) : <></>; }}
          onMouseLeave={(e) => { this.props.playOnMouseOver ? this.pauseStartCallback(e) : <></>; }}
          ref={(ref) => (this.mount = ref)}
        />
        {this.props.showButtons ? (<button onClick={(e) => this.restartCallback(e)}>{'\u23ee'}</button>) : (<></>)}
        {this.props.showButtons ? (<button onClick={(e) => !this.pause ? this.pauseStartCallback(e) : this.pauseEndCallback(e)}>{'\u23ef'}</button>) : (<></>)}
      </div>
    );
  }
}

export default GraphicsComponent;