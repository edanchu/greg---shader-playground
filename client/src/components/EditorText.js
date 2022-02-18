import React, { useState } from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/javascript/javascript'
import '../assets/glsl'
import {Controlled as ControlledEditor} from 'react-codemirror2'
import './EditorText.css'
import CodeMirror from 'codemirror'
import GraphicsComponent from './graphics_component'

export default function EditorText(props) {
    const {
        language,
        displayName,
        value,
        onChange,
    } = props
    function handleChange(editor, data, value){
        onChange(value)
    }
    function handleCompile()
    {
        /*var editor = CodeMirror.fromTextArea(Doc.getValue("\n"), {});
        mainFragShader = editor.CodeMirror.getCode();*/
        /*mainFragShader = value;
        console.log(value);*/
        /*<GraphicsComponent 
             height={480}
             pause={false}
             playOnMouseOver={false}
             showButtons={true}
             finalFragShaderCustomCode={value} />*/
        console.log(value);
    }
    return (
    <>
        <div className='editor-container'>
            <button onClick={(e) => handleCompile()}>{'\u25B6'}</button>
            <div className='editor-title'>
                {displayName}
            </div>
            <ControlledEditor
                onBeforeChange={handleChange}
                value={value}
                className = "code-mirror-wrapper"
                options={{
                    lineWrapping: true,
                    lint: true,
                    mode: language,
                    theme: 'material',
                    lineNumbers: true
                }}  
            />
        </div>
    </>
  );
};