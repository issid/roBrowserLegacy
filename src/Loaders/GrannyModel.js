/**
 * @module Loaders/GrannyModel
 *
 * Loaders for Gravity .gr2 file (Resource Model with animation for the Granny3D Engine)
 *
 * TODO: Figure out how to decompress.
 * TODO: Figure out how to use this structure tree that granny has by default for each sections information.
 */
define(['Utils/BinaryReader', 'Utils/BinaryWriter', 'Utils/gl-matrix', 'Utils/Struct', 'Utils/CRC32', 'Utils/lz77', 'Utils/arithmeticCompression', 'Vendors/text-encoding'],
    function (BinaryReader, BinaryWriter, glMatrix, Struct, CRC32, lz77, AC, TextEncoding) {
    'use strict';

    /**
     * Types compression
     *
     * No compression = 0; Oodlee0 = 1; Oodlee1 = 2; Bitknit = 3; Bitknit2 = 4;
     */
    const compresedTypes = {
        NO_COMPRESSION: 0,
        OODLE0: 1,
        OODLE1: 2,
        BITKNIT: 3,
        BITKNIT2: 4,
    };

    // todo remove test cube
    const testCube = {
        vertices: [
            -0.1, -0.1, -0.1, 0.1, -0.1, -0.1, 0.1, 0.1, -0.1, -0.1, 0.1, -0.1,
            -0.1, -0.1, 0.1, 0.1, -0.1, 0.1, 0.1, 0.1, 0.1, -0.1, 0.1, 0.1,
            -0.1, -0.1, -0.1, -0.1, 0.1, -0.1, -0.1, 0.1, 0.1, -0.1, -0.1, 0.1,
            0.1, -0.1, -0.1, 0.1, 0.1, -0.1, 0.1, 0.1, 0.1, 0.1, -0.1, 0.1,
            -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.1, -0.1, 0.1, 0.1, -0.1, -0.1,
            -0.1, 0.1, -0.1, -0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, -0.1,
        ],
        indices: [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15,
            16, 17, 18, 16, 18, 19,
            20, 21, 22, 20, 22, 23,
        ],
        textureCoords: [
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
        ],
    };

    /**
     * Import
     */
    var vec3 = glMatrix.vec3;
    var mat3 = glMatrix.mat3;
    var mat4 = glMatrix.mat4;

    var _gr2HeaderStructure = {};


    /**
     * Model class loader
     *
     * @param {ArrayBuffer} data - optional
     */
    function GR2 (data) {
        if (data) {
            this.load(data);
        }
    }


    // headers structs
    GR2.relocationHeader = new Struct(
        'int relocationOffset',        // Where the relocation data is stored in the section
        'int relocationCount',         // How many relocation data sets (?) are stored at this location
    );

    GR2.marshallingHeader = new Struct(
        'int marshallingDataOffset',  // Where the marshalling data is stored in the section
        'int marshallingBlockCount',  // How many marshalling data sets (?) are stored at this location
    );

    GR2.sectionHeadersStructure = new Struct(
        'int compressionMode',         // 0 = No compression; 1 = Oodlee 0; 2 = Oodlee 1; 3 = Bitknit; 4 = Bitknit 2
        'int sectionOffset',           // After how many bytes in the file the section starts
        'int compressedSize',          // After how many bytes the section ends (when compressed)
        'int decompressedSize',        // How large the section is after decompressing it
        'int alignmentSize',           // Used for packing the data on hardware-aligned boundaries (?)
        'int stop_0',                  // "Compressor stop 0" - Oodle0 parameter (?)
        'int stop_1',                  // "Compressor stop 1" - Oodle0 parameter (?)
        { relocationHeader: GR2.relocationHeader },      // Used to restore the fixed pointers to their original form
        { marshallingHeader: GR2.marshallingHeader },    // Used to restore the fixed pointers to their final, hardware-dependant form (?)
    );

    GR2.relocationData = new Struct(
        'int Offset1',
        'int SectorNumber',
        'int Offset2',
    );

    GR2.marshallingData = new Struct(
        'int Unknown',
        'int Offset1',
        'int SectorNumber',
        'int Offset2',
    );

    function crc32string (str) {
        var crcTable = window.crcTable || (window.crcTable = function () {
            var c;
            var crcTable = [];
            for (var n = 0; n < 256; n++) {
                c = n;
                for (var k = 0; k < 8; k++) {
                    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                }
                crcTable[n] = c;
            }
            return crcTable;
        });
        var crc = 0 ^ (-1);

        for (var i = 0; i < str.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
        }

        return (crc ^ (-1)) >>> 0;
    }


    /**
     * Loading GR2 file
     * todo https://github.com/rdw-archive/RagnarokFileFormats/blob/master/GR2.MD
     *
     * @param {ArrayBuffer} data
     */
    GR2.prototype.load = function Load (data) {
        // Read header.
        var fp = new BinaryReader(data);

        this.checksum = null;
        this.version = null;
        this.nodes = [];
        this.instances = [];

        // create header structure
        _gr2HeaderStructure = {
            'signature': fp.readHex(16),       // Always B8 67 B0 CA F8 6D B1 0F 84 72 8C 7E 5E 19 00 1E
            'headerSize': fp.readUInt(),           // Always 352 (decimal)
            'compressionFlag': fp.readUInt(),      // Always 0 (no compression)
            'unknown1': fp.readUInt(),             // Unused (probably) since it's always zero
            'unknown2': fp.readUInt(),             // Unused (probably) since it's always zero
            'version': fp.readUInt(),              // The Granny File version (always 6)
            'fileSize': fp.readUInt(),             // The total file size in bytes
            'checksum': fp.readUInt(),             // A CRC checksum over the file contents
            'sectionOffset': fp.readUInt(),        // Where the sections begin (always 56)
            'sectionCount': fp.readUInt(),         // Number of sections (always 6)
            // 'rootNodeType': fp.readUInt64(),      // Points to a definition of the top-level node object's type
            // 'rootNodeObject': fp.readUInt64(),    // Points to the top-level node object in the data tree
            // 'userTag': fp.readHex(4),             // Always 0F 00 00 80
            // 'userData': fp.readHex(16),           // Unused (probably) since it's always zero
            'rootNode': {
                rootNodeType: {
                    dataSegmentID: fp.readUInt(),
                    offsetFromStartOfSegment: fp.readUInt(),
                },
                rootNodeObject: {
                    dataSegmentID: fp.readUInt(),
                    offsetFromStartOfSegment: fp.readUInt(),
                },
                userTag: fp.readHex(4),// Always 0F 00 00 80
                userData: fp.readHex(16), // Unused (probably) since it's always zero
                // user_data:[
                //     fp.readUInt(), // 0
                //     fp.readUInt(), // 0
                //     fp.readUInt(), // 0
                //     fp.readUInt(), // 0
                // ],
            },
            // 'sectionHeaders': fp.readStruct(GR2.sectionHeadersStructure), //44 Bytes per section (here: 6 * 28 = 264)
        };

        // set section headers
        _gr2HeaderStructure.sectionHeaders = [];
        for (var i = 0; i < _gr2HeaderStructure.sectionCount; ++i) {
            _gr2HeaderStructure.sectionHeaders[i] = fp.readStruct(GR2.sectionHeadersStructure);
        }

        // check offset on fp
        if (fp.offset !== _gr2HeaderStructure.headerSize) {
            console.error('gr2 cannot load: ' + fp.offset + ' != ' + _gr2HeaderStructure.headerSize + ' fp.offset');
        }

        // set vars
        this.gr2HeaderStructure = _gr2HeaderStructure; // todo remove
        this.checksum = _gr2HeaderStructure.checksum;
        this.version = _gr2HeaderStructure.version;

        // create nodes
        var count = _gr2HeaderStructure.sectionCount;
        var nodes = new Array(count);
        for (var i = 0; i < count; ++i) {
            nodes[i] = new GR2.Node(this, fp, _gr2HeaderStructure.sectionHeaders[i], i);
        }


        // todo remove create test node
        function createTestNode (self) {
            nodes[i] = new GR2.Node(self, fp);
            nodes[i].vertices = testCube.vertices;

            var LI = nodes[i].indices[nodes[i].indices.length - 1];

            if (LI === undefined) {
                nodes[i].indices = testCube.indices;
            } else {
                nodes[i].indices.push(
                    LI + 1, LI + 2, LI + 3, LI + 1, LI + 3, LI + 4,
                    LI + 5, LI + 6, LI + 7, LI + 5, LI + 7, LI + 8,
                    LI + 9, LI + 10, LI + 11, LI + 9, LI + 12, LI + 13,
                    LI + 14, LI + 15, LI + 16, LI + 14, LI + 16, LI + 17,
                    LI + 18, LI + 19, LI + 20, LI + 18, LI + 20, LI + 21,
                    LI + 22, LI + 23, LI + 24, LI + 22, LI + 24, LI + 25,
                );
            }
            nodes[i].textureCoords = testCube.textureCoords;

            // nodes[i].image = new Image();
            // nodes[i].image.src = 'data/izlude/iz_rookie_03.bmp';
        }


        createTestNode(this); // todo remove create test node

        if (this.main_node === null) {
            this.main_node = nodes[0];
        }
        this.nodes = nodes;

        this.mov_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

        console.log(this);
    };

    /**
     * Node Constructor
     *
     * @param {object} gr2
     * @param {object} fp BinaryReader
     * @param sectionHeader
     * @param currentSector
     */
    GR2.Node = function Node (gr2, fp, sectionHeader = null, currentSector = null) {

        this.main = gr2;
        var vertices = [];
        var indices = [];
        var textureCoords = [];
        var saveOffset = fp.offset;


        if (sectionHeader !== null) {
            console.log('sectionHeader', sectionHeader);

            var relocationCount = null;
            var relocationOffset = null;
            var marshallingBlockCount = null;
            var marshallingDataOffset = null;
            var parseFixupData;
            var marshallingData;

            relocationCount = sectionHeader.relocationHeader.relocationCount;
            relocationOffset = sectionHeader.relocationHeader.relocationOffset;

            if (relocationCount > 0) {
                parseFixupData = ParseFixupData(fp, relocationOffset, relocationCount, sectionHeader.sectionOffset);
            }

            marshallingBlockCount = sectionHeader.marshallingHeader.marshallingBlockCount;
            marshallingDataOffset = sectionHeader.marshallingHeader.marshallingDataOffset;

            if (marshallingBlockCount > 0) {
                marshallingData = ParseMarshallData(fp, marshallingDataOffset, marshallingBlockCount, sectionHeader.sectionOffset);
            }
            console.log(parseFixupData, marshallingData);

            // todo need decompression fp.nodes with Oodle0
            // todo https://github.com/RagnarokResearchLab/ragnarokresearchlab.github.io/blob/bac76d1875a0e543468665d0fdd5b0a4f51055a4/docs/file-formats/GR2.md
            // todo https://en.wikipedia.org/wiki/LZ77_and_LZ78#LZ77
            if (sectionHeader.compressionMode && sectionHeader.compressionMode === compresedTypes.OODLE0) { // Oodlee 0
                // lz77
                // console.log(sectionHeader.compressedSize, sectionHeader.decompressedSize);

                // console.log(fp.readLongPointer(sectionHeader.compressedSize));
                var out = '';
                var sectorData = new Uint8Array(sectionHeader.compressedSize);
                for (let i = 0; i < sectionHeader.compressedSize; i++) {
                    sectorData[i] = fp.getUint8();
                    out += String.fromCharCode(sectorData[i]).toString();
                }
                if (sectorData.length === sectionHeader.compressedSize) {
                    console.log('sectorData.length == sectionHeader.compressedSize');
                    // todo need oodle0 to decode sectorData and decoding length is equal to sectionHeader.decompressedSize



                    var data = TextEncoding.decode(sectorData.subarray(0, sectionHeader.compressedSize))
                    // console.log(out);
                    // console.log(data);
                    // var resu = lz77.decompress(out);
                    // var resu = lz77.lzw_decode(out);
                    // console.log(resu, out);
                    console.log(sectionHeader.compressedSize, resu.length, sectionHeader.decompressedSize);






                } else {
                    console.warn('sectorData.length != sectionHeader.compressedSize');
                }

            }

        }
        this.vertices = vertices;
        this.textureCoords = textureCoords;
        this.indices = indices;
        this.image = new Image();
        this.image.src = 'data/izlude/iz_rookie_03.bmp';
    };

    function ParseFixupData(fp, relocationOffset, relocationCount, sectionOffset) {
        // console.log('relocation', relocationOffset, relocationCount, sectionOffset);
        var relocationData = [];
        for (var i = 0; i < relocationCount; i++) {
            // todo struct t_FixUpData* data = (struct t_FixUpData*)(fileData + offset + (i * 12));
            relocationData.push(fp.readStruct(GR2.relocationData)); // todo what to do with this?
        }

        var sOffset = relocationOffset + (i * 12);
        if (sOffset == sectionOffset) {
            console.log('relocation sectionOffset:', sectionOffset, sOffset);
        }
        return relocationData;
    }

    function ParseMarshallData(fp, marshallingDataOffset, marshallingBlockCount, sectionOffset) {
        // console.log('marshall',marshallingDataOffset, marshallingBlockCount, sectionOffset);
        var marshallingData = [];
        for (var i = 0; i < marshallingBlockCount; i++) {
            // todo struct t_MarshallData* data = (struct t_MarshallData*)(fileData + offset + (i * 16));
            marshallingData.push(fp.readStruct(GR2.marshallingData)); // todo what to do with this?
        }

        var sOffset = marshallingDataOffset + (i * 16);
        if (sOffset == sectionOffset) {
            console.log('marshalling sectionOffset:', sectionOffset, sOffset);
        }
        return marshallingData;
    }

    /**
     * Bounding Box
     */
    GR2.Box = function BoundingBox () {
        this.max = vec3.fromValues(-Infinity, -Infinity, -Infinity);
        this.min = vec3.fromValues(Infinity, Infinity, Infinity);
        this.offset = vec3.create();
        this.range = vec3.create();
        this.center = vec3.create();
    };

    /**
     * Create a model instance
     *
     * @param {object} model
     * @param {number} width
     * @param {number} height
     */
    GR2.prototype.createInstance = function CreateInstance (model, width, height) {
        this.filename = model.filename;

        var matrix = mat4.create();

        mat4.identity(matrix);
        mat4.translate(matrix, matrix, [model.position[0] + width, model.position[1], model.position[2] + height]);
        mat4.rotateZ(matrix, matrix, model.rotation[2] / 180 * Math.PI);
        mat4.rotateX(matrix, matrix, model.rotation[0] / 180 * Math.PI);
        mat4.rotateY(matrix, matrix, model.rotation[1] / 180 * Math.PI);
        mat4.scale(matrix, matrix, model.scale);

        this.instances.push(matrix);
    };

    /**
     * Compile Model
     */
    GR2.prototype.compile = function Compile () {
        return {
            nodes: this.nodes,
        };
    };

    /**
     * Export
     */
    return GR2;
});
