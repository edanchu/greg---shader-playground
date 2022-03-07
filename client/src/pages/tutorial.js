import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './tutorial.css';
import BrowseCards from '../components/BrowseCards.js';

function Browse() {

    return (
        <>
            <div className='tut-main'>
                <h1 className='tut-header'>Tutorial</h1>

                ``<h2 className='tut-header'>Fragment Shader Basics</h2>
                <p className='tut-p'>
                    Fragment shaders (also known as pixel shaders) are programs that are run for every fragment within an output image.
                    For our purposes, this means every pixel on the output canvas. Fragment shaders take input in the form of Uniforms,
                    perform calculations based on these inputs, and then output a color in RGBA format. Within GLSL ES 3.0 (the shader
                    language we are using) this means outputing a vec4 of floats between 0.0 and 1.0. For a more complete undestanding
                    of how GLSL and shaders in general work,
                    <a href="https://learnopengl.com/Getting-started/Shaders"> Learn OpenGL </a>
                    is a great resource.
                </p>

                <h2 className='tut-header'>Our Implementation</h2>

                <p className='tut-p'>
                    The fragment shaders that can be written on Greg all implement the
                    <code> void mainImage(out vec4 FragColor) </code> method
                    as an entry point. This is called once per pixel and is responsible for the final output color to the screen. Our
                    shaders also implement a series of shader passes that we call buffers. Buffers 1-4 are all fragment shaders that
                    render to internal textures that are passed on to each following buffer. Eg, Buffer2 has access to the output of
                    Buffer1, while Buffer4 has access to Buffers 1-3, and Main has access to all 4 buffers. These buffers all have the
                    same resolution and can be accessed like normal textures. Their outputs all follow the same format as Main. (These
                    buffers can be used to layer images on top of each other, create post-processing effects, or to perform
                    calculations).
                </p>

                <h2 className='tut-header'>Basic GLSL</h2>

                <p className='tut-p'>
                    GLSL is a strongly typed c-like language that is specifically designed for use with graphics shaders. Fragment
                    shaders in GLSL have access to a large set of built in functions that are useful for graphics calculations such as
                    <code> dot(vec3 a, vec3 b), sin(float a), reflect(vec2-4 I, vec 2-4 N), distance(vec2-4 a, vec2-4 b) </code> as well
                    as built in variables that give information about the current fragment being processed. The most useful of these is
                    <code> gl_FragCoord </code> which is a vec4 which stores positional information about the current Fragment. Only the x
                    and y components are of interest to us. For a complete list of built in functions and variables, <a
                        href="https://www.khronos.org/registry/OpenGL-Refpages/es3.0/">check out the GLSL ES 3.0 Docs</a>.
                </p>

                <h2 className='tut-header'>Uniforms</h2>

                <p className='tut-p'>
                    Uniforms are read-only variables that are passed in to shaders. Greg provides a set of commonly used uniforms that
                    can be accessed from within each buffer:
                    <dl>
                        <dt><strong>float iTime</strong></dt>
                        <dd>The time in ms that the shader has been running.</dd>
                        <dt><strong>float iDeltaTime</strong></dt>
                        <dd>The time in ms since the previous frame.</dd>
                        <dt><strong>int iFrame</strong></dt>
                        <dd>The number of frames that have been rendered thus far.</dd>
                        <dt><strong>vec2 iResolution</strong></dt>
                        <dd>The canvas' resolution in pixels [x,y].</dd>
                        <dt><strong>vec4 iMouse</strong></dt>
                        <dd>The mouse location in pixels. [x, y, last click location x, last click location y].</dd>
                        <dt><strong>sampler2D iKeyboard</strong></dt>
                        <dd>A 256x1 texture representing the keyboard's state. Each keyboard key is stored under it's ascii code and stores
                            information in a vec4 of floats.<br />
                            Index 0 is either 1.0 or 0.0 representing if the key is currently pressed.<br /> Index 1 follows the same
                            convention
                            but is toggeled every time the key is pressed.
                            <br />Index 2 stores the last frame that the key was pressed %256 and normalized to be between 0.0 and 1.0.
                            <br />Index
                            3 is
                            unused.
                        </dd>
                        <dt><strong>vec4 iDate</strong></dt>
                        <dd>A vector of 4 elements representing the current date. [year, month, day, seconds]</dd>
                        <dt><strong>sampler2D iBufferTexture1-4</strong></dt>
                        <dd>Textures storing the output from each Buffer. Each Buffer has access to the output of every previous Buffer,
                            Main has all of them. Resolution of iResolution
                        </dd>
                        <dt><strong>sampler2D or samplerCube iChannel0-3</strong></dt>
                        <dd>Textures or Cubemaps containing user defined data chosen from a pre-existing pool. Each Buffer has access to its
                            own set of channels. Each channel's resolution depends on the chosen data.</dd>
                        <dt><strong>vec2 iChannel0-3Resolution</strong></dt>
                        <dd>Vec2 Containing the x and y resolution of the chosen iChannel. Defaults to 2048x2048</dd>
                    </dl>
                </p>
            </div>
        </>
    );
}

export default Browse;