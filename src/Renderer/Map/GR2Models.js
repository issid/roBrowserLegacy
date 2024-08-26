/**
 * @module Renderer/Map/GR2Models
 *
 * Rendering gr2 Models
 */
define(['Utils/WebGL'], function (WebGL) {
    'use strict';

    /**
     * @var {WebGLBuffer}
     */
    var _buffer = null,
        _vertex_buffer = null,
        _texture_coords_buffer = null,
        _texture = null;

    /**
     * @var {Array} list of meshes
     */
    var _objects = [];

    /**
     * @var {string} vertex shader
     */
    var _vertexShader = `
        attribute vec3 aVertexPosition;
        attribute vec2 aVertexTextureCoords;
        varying vec2 vTextureCoords;
        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;
        void main(void) {
            gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
            vTextureCoords = aVertexTextureCoords;
        }
    `;

    /**
     * @var {string} fragment shader
     */
    var _fragmentShader = `
        precision highp float;
        uniform sampler2D uSampler;
        varying vec2 vTextureCoords;

        void main(void) {
            gl_FragColor =  texture2D(uSampler, vTextureCoords);
        }
    `;


    /**
     * Initialize models
     *
     * @param {object} gl context
     * @param {object} data ( models )
     */
    function init (gl, data) {
        var nodes = data.nodes;

        for (var i = 0; i < nodes.length; ++i) {
            var vertices = nodes[i].vertices;
            var indices = nodes[i].indices;
            var image = nodes[i].image;
            var textureCoords = nodes[i].textureCoords;

            // Create and store data into vertex buffer
            _vertex_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, _vertex_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

            // Create and store data into texture coords buffer
            _texture_coords_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, _texture_coords_buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);

            // Create and store a texture
            _texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, _texture);

            // Load image
            image.onload = function () {
                gl.bindTexture(gl.TEXTURE_2D, _texture);
                gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            };

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, _texture);

            // Create and store data into index buffer
            var index_buffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, _vertex_buffer);

            _objects[i] = {
                indices: indices,
            };
        }
    }


    /**
     * Render models
     *
     * @param gl
     * @param projection
     * @param view_matrix
     * @param mov_matrix
     */
    function render (gl, projection, view_matrix, mov_matrix) {
        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, _vertexShader);
        gl.compileShader(vertShader);

        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, _fragmentShader);
        gl.compileShader(fragShader);

        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertShader);
        gl.attachShader(shaderProgram, fragShader);
        gl.linkProgram(shaderProgram);
        gl.useProgram(shaderProgram);

        // Position
        gl.bindBuffer(gl.ARRAY_BUFFER, _vertex_buffer);
        var vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);

        // Texture
        gl.bindBuffer(gl.ARRAY_BUFFER, _texture_coords_buffer);
        var vertexTextureCoords = gl.getAttribLocation(shaderProgram, 'aVertexTextureCoords');
        gl.vertexAttribPointer(vertexTextureCoords, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(vertexPosition);
        gl.enableVertexAttribArray(vertexTextureCoords);

        var MVMatrix = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
        var ProjMatrix = gl.getUniformLocation(shaderProgram, 'uPMatrix');

        gl.uniformMatrix4fv(ProjMatrix, false, projection);
        gl.uniformMatrix4fv(MVMatrix, false, view_matrix);

        for (var i = 0; i < _objects.length; ++i) {
            gl.drawElements(gl.TRIANGLES, _objects[i].indices.length, gl.UNSIGNED_SHORT, 0);
        }
    }


    /**
     * Clean textures/buffer from memory
     *
     * @param {object} gl context
     */
    function free (gl) {
        var i, count;

        if (_buffer) {
            gl.deleteBuffer(_buffer);
            _buffer = null;
        }

        if (_vertex_buffer) {
            gl.deleteBuffer(_vertex_buffer);
            _vertex_buffer = null;
        }

        for (i = 0, count = _objects.length; i < count; ++i) {
            gl.deleteTexture(_objects[i].texture);
        }

        _objects.length = 0;
    }


    /**
     * Export
     */
    return {
        init: init,
        render: render,
        free: free,
    };
});
