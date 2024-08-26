/**
 * @module UI/Components/GrannyModelViewer/GrannyModelViewer
 *
 * Granny3D Model Viewer (gr2 file)
 */
define(function (require) {
    'use strict';

    /**
     * Load dependencies
     */
    var glMatrix = require('Utils/gl-matrix');
    var Configs = require('Core/Configs');
    var Client = require('Core/Client');
    var GrannyModel = require('Loaders/GrannyModel');
    var Renderer = require('Renderer/Renderer');
    var ModelRenderer = require('Renderer/Map/GR2Models');
    var Camera = require('Renderer/Camera');

    var UIManager = require('UI/UIManager');
    var UIComponent = require('UI/UIComponent');
    var htmlText = require('text!./GrannyModelViewer.html');
    var cssText = require('text!./GrannyModelViewer.css');

    var mat4 = glMatrix.mat4;
    var mat3 = glMatrix.mat3;

    /**
     * @var {object} model global parameters
     */
    var _GlobalParameters = {
        position: new Float32Array(3),
        rotation: new Float32Array(3),
        scale: new Float32Array([-0.075, -0.075, 0.075]),
        filename: null,
    };

    /**
     * @var {object} current model
     */
    var _model = null;

    /**
     * Create GRFViewer component
     */
    var Viewer = new UIComponent('GRFViewer', htmlText, cssText);

    /**
     * Initialize Component
     */
    Viewer.init = function Init () {
        // Initialize WebGL
        Renderer.init({
            alpha: true,
            depth: true,
            stencil: false,
            antialias: true,
            premultipliedAlpha: false,
        });
        Renderer.show();

        // Initialize the dropdown
        if (!Configs.get('API')) {
            initDropDown(this.ui.find('select').get(0));
        } else {
            var hash = decodeURIComponent(location.hash);
            location.hash = hash;
            loadModel(hash.substr(1));
        }
    };


    /**
     * Initialise Drop Down list
     *
     * @param {HTMLElement} drop down
     */
    function initDropDown (select) {
        // Search GR2's from the client
        Client.search(/data\\[^\0]+\.gr2/gi, function (list) {
            var i, count;
            var hash;

            // Add selection
            for (i = 0, count = list.length; i < count; ++i) {
                list[i] = list[i].replace(/\\/g, '/');
                select.add(new Option(list[i], list[i]), null);
            }

            // Bind change
            select.onchange = function () {
                loadModel(location.hash = this.value);
            };

            // Start loading a model ?
            hash = decodeURIComponent(location.hash);
            location.hash = hash;

            // Load GR2 from url ?
            if (hash.indexOf('.gr2') !== -1) {
                loadModel(hash.substr(1));
                select.value = hash.substr(1);
            } else {
                loadModel(select.value);
            }

            Viewer.ui.find('.head').show();
            select.focus();
        });
    }


    /**
     * Stop to render
     */
    function stop () {
        var gl = Renderer.getContext();

        Renderer.stop();
        ModelRenderer.free(gl);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }


    /**
     * Start loading a model
     *
     * @param {string} filename
     */
    function loadModel (filename) {
        stop();

        Client.getFile(filename, function (buf) {
            _model = new GrannyModel(buf);

            // Create model in world
            _GlobalParameters.filename = filename.replace('data/model/3dmob/', '');
            _model.createInstance(_GlobalParameters, 0, 0);
            var data = _model.compile();

            var gl = Renderer.getContext();
            ModelRenderer.init(gl, data);

            Renderer.render(render);
        });
    }


    var tick_old = 0;


    /**
     * Rendering scene
     *
     * @param {number} tick
     * @param {object} gl context
     */
    function render (tick, gl) {
        _model.view_matrix[14] = -15;//zoom

        var dt = tick - tick_old;
        dt /= 10; // slowly rotate
        mat4.rotateZ(_model.view_matrix, _model.view_matrix, dt * 0.005);
        mat4.rotateY(_model.view_matrix, _model.view_matrix, dt * 0.002);
        mat4.rotateX(_model.view_matrix, _model.view_matrix, dt * 0.003);
        tick_old = tick;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        ModelRenderer.render(gl, Camera.projection, _model.view_matrix, _model.mov_matrix);
    }


    /**
     * Export
     */
    Viewer.loadModel = loadModel;
    Viewer.stop = stop;

    /**
     * Stored component and return it
     */
    return UIManager.addComponent(Viewer);
});
