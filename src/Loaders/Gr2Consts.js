// todo remove before implementation of 3dmob

/**
 *  Transformation Flags
 */
GR2.TRANSFORM_FLAGS = {
    HasPosition: 0x1,
    HasOrientation: 0x2,
    HasScaleShear: 0x4,
};

GR2.MARSHALLING_TYPE = {
    AnyMarshalling: 0x0,
    Int8Marshalling: 0x1,
    Int16Marshalling: 0x2,
    Int32Marshalling: 0x4,
    MarshallingMask: 0x7,
};

GR2.MEMBER_TYPE = {
    EndMember: 0,
    InlineMember: 1,
    ReferenceMember: 2,
    ReferenceToArrayMember: 3,
    ArrayOfReferencesMember: 4,
    VariantReferenceMember: 5,
    UnsupportedMemberType_Remove: 6,
    ReferenceToVariantArrayMember: 7,
    StringMember: 8,
    TransformMember: 9,
    Real32Member: 10,
    Int8Member: 11,
    UInt8Member: 12,
    BinormalInt8Member: 13,
    NormalUInt8Member: 14,
    Int16Member: 15,
    UInt16Member: 16,
    BinormalInt16Member: 17,
    NormalUInt16Member: 18,
    Int32Member: 19,
    UInt32Member: 20,
    Real16Member: 21,
    EmptyReferenceMember: 22,
    OnePastLastMemberType: 23,
    Bool32Member: 19,  // Same as Int32Member
};

GR2.MATERIAL_TEXTURE_TYPE = {
    UnknownTextureType: 0,
    AmbientColorTexture: 1,
    DiffuseColorTexture: 2,
    SpecularColorTexture: 3,
    SelfIlluminationTexture: 4,
    OpacityTexture: 5,
    BumpHeightTexture: 6,
    ReflectionTexture: 7,
    RefractionTexture: 8,
    DisplacementTexture: 9,
    OnePastLastMaterialTextureType: 10,
};

GR2.BOUND_TRANSFORM_TRACK_FLAGS = {
    PositionCurveIsIdentity: (0x0 << 0), // TODO Turn these into the number it would become
    PositionCurveIsConstant: (0x1 << 0),
    PositionCurveIsKeyframed: (0x2 << 0),
    PositionCurveIsGeneral: (0x3 << 0),
    PositionCurveFlagMask: (0x3 << 0),
    OrientationCurveIsIdentity: (0x0 << 2),
    OrientationCurveIsConstant: (0x1 << 2),
    OrientationCurveIsKeyframed: (0x2 << 2),
    OrientationCurveIsGeneral: (0x3 << 2),
    OrientationCurveFlagMask: (0x3 << 2),
    ScaleShearCurveIsIdentity: (0x0 << 4),
    ScaleShearCurveIsConstant: (0x1 << 4),
    ScaleShearCurveIsKeyframed: (0x2 << 4),
    ScaleShearCurveIsGeneral: (0x3 << 4),
    ScaleShearCurveFlagMask: (0x3 << 4),
};

GR2.TRANSFORM_FILE_FLAGS = {
    RenormalizeNormals: 0x1,
    ReorderTriangleIndices: 0x2,
};

GR2.BINK_TEXTURE_FLAGS = {
    EncodeAlpha: 0x1,
    UseScaledRGBInsteadOfYUV: 0x2,
    UseBink1: 0x4,
};

GR2.BSPLINE_SOLVER_FLAGS = {
    BSplineSolverEvaluateAsQuaternions: 0x1,
    BSplineSolverAllowC0Splitting: 0x2,
    BSplineSolverAllowC1Splitting: 0x4,
    BSplineSolverExtraDOFKnotZero: 0x10,
    BSplineSolverForceEndpointAlignment: 0x20,
    BSplineSolverAllowReduceKeys: 0x40,
};

GR2.CAMERA_OUTPUT_Z_RANGE = {
    CameraOutputZZeroToOne: 0,
    CameraOutputZNegativeOneToOne: 1,
    CameraOutputZNegativeOneToZero: 2,
};

GR2.ACCUMULATION_MODE = {
    NoAccumulation: 0,
    ConstantExtractionAccumulation: 1,
    VariableDeltaAccumulation: 2,
};

GR2.BLEND_DAG_NODE_TYPE = {
    Leaf_AnimationBlend: 0,
    Leaf_LocalPose: 1,
    Leaf_Callback: 2,
    OnePastLastLeafType: 3,
    Node_Crossfade: 4,
    Node_WeightedBlend: 5,
    OnePastLast: 6,
};

GR2.FILE_DATA_TREE_FLAGS = {
    ExcludeTypeTree: 0x1,
};

GR2.DEFORMATION_TYPE = { // Starts from 1
    Position: 1,
    PositionNormal: 2,
    PositionNormalTangent: 3,
    PositionNormalTangentBinormal: 4,
};

GR2.DEGREE_OF_FREEDOM = {
    NoDOFs: 0,
    XTranslation: 0x001,
    YTranslation: 0x002,
    ZTranslation: 0x004,
    XRotation: 0x008,
    YRotation: 0x010,
    ZRotation: 0x020,
    XScaleShear: 0x040,
    YScaleShear: 0x080,
    ZScaleShear: 0x100,
    TranslationDOFs: 0x001 | 0x002 | 0x004, //XTranslation | YTranslation | ZTranslation,
    RotationDOFs: 0x008 | 0x010 | 0x020, //XRotation | YRotation | ZRotation,
    ScaleShearDOFs: 0x040 | 0x080 | 0x100, //XScaleShear | YScaleShear | ZScaleShear,
    AllDOFs: 0x001 | 0x002 | 0x004 |        // RotationDOFs
        0x008 | 0x010 | 0x020 |        // ScaleShearDOFs
        0x040 | 0x080 | 0x100,          // TranslationDOFs
};

GR2.COMPRESSION_TYPE = {
    NoCompression: 0,
    Oodle0Compression: 1,
    Oodle1Compression: 2,
    OnePastLastCompressionType: 3,
};

GR2.STANDARD_SECTION_INDEX = {
    MainSection: 0,
    RigidVertexSection: 1,
    RigidIndexSection: 2,
    DeformableVertexSection: 3,
    DeformableIndexSection: 4,
    TextureSection: 5,
    DiscardableSection: 6,
    UnloadedSection: 7,
    SectionCount: 8,
};

GR2.GRN_TYPE_TAG = {
    FirstGRNUserTag: 0,
    LastGRNUserTag: 0x7FFFFFFF,
    FirstGRNStandardTag: 0x80000000,
    LastGRNStandardTag: 0xFFFFFFFF,
};

GR2.FILE_WRITER_SEEK_TYPE = {
    GrannySeekStart: 0,
    GrannySeekEnd: 1,
    GrannySeekCurrent: 2,
};

GR2.PIXEL_FILTER_TYPE = {
    CubicPixelFilter: 0,
    LinearPixelFilter: 1,
    BoxPixelFilter: 2,
    OnePastLastPixelFilterType: 3,
};

GR2.QUATERNION_MODE = {
    BlendQuaternionDirectly: 0,
    BlendQuaternionInverted: 1,
    BlendQuaternionNeighborhooded: 2,
    BlendQuaternionAccumNeighborhooded: 3,
};

GR2.LOG_MESSAGE_TYPE = {
    IgnoredLogMessage: 0,
    NoteLogMessage: 1,
    WarningLogMessage: 2,
    ErrorLogMessage: 3,
    OnePastLastMessageType: 4,
};

GR2.LOG_MESSAGE_ORIGIN = {
    NotImplementedLogMessage: 0,
    ApplicationLogMessage: 1,
    Win32SubsystemLogMessage: 2,
    Win64SubsystemLogMessage: 3,
    MacOSSubsystemLogMessage: 4,
    ANSISubsystemLogMessage: 5,
    GamecubeSubsystemLogMessage: 6,
    PS2SubsystemLogMessage: 7,
    PSPSubsystemLogMessage: 8,
    PS3SubsystemLogMessage: 9,
    XboxSubsystemLogMessage: 10,
    XenonSubsystemLogMessage: 11,
    MAXSubsystemLogMessage: 12,
    MayaSubsystemLogMessage: 13,
    XSISubsystemLogMessage: 14,
    LightwaveSubsystemLogMessage: 15,
    FileWritingLogMessage: 16,
    FileReadingLogMessage: 17,
    ExporterLogMessage: 18,
    CompressorLogMessage: 19,
    StringLogMessage: 20,
    StringTableLogMessage: 21,
    VertexLayoutLogMessage: 22,
    MeshLogMessage: 23,
    PropertyLogMessage: 24,
    SkeletonLogMessage: 25,
    AnimationLogMessage: 26,
    SetupGraphLogMessage: 27,
    TextureLogMessage: 28,
    BSplineLogMessage: 29,
    HashLogMessage: 30,
    LinkerLogMessage: 31,
    InstantiatorLogMessage: 32,
    DataTypeLogMessage: 33,
    NameMapLogMessage: 34,
    MaterialLogMessage: 35,
    ModelLogMessage: 36,
    StackAllocatorLogMessage: 37,
    FixedAllocatorLogMessage: 38,
    SceneLogMessage: 39,
    TrackMaskLogMessage: 40,
    LocalPoseLogMessage: 41,
    WorldPoseLogMessage: 42,
    NameLibraryLogMessage: 43,
    ControlLogMessage: 44,
    MeshBindingLogMessage: 45,
    MathLogMessage: 46,
    VersionLogMessage: 47,
    MemoryLogMessage: 48,
    DeformerLogMessage: 49,
    VoxelLogMessage: 50,
    BitmapLogMessage: 51,
    IKLogMessage: 52,
    CurveLogMessage: 53,
    TrackGroupLogMessage: 54,
    ThreadSafetyLogMessage: 55,
    QuantizeLogMessage: 56,
    BlendDagLogMessage: 57,
    OnePastLastMessageOrigin: 58,
};

GR2.DEFORMER_TAIL_FLAGS = {
    DontAllowUncopiedTail: 0,
    AllowUncopiedTail: 1,
};

GR2.S3TC_TEXTURE_FORMAT = {
    S3TCBGR565: 0,
    S3TCBGRA5551: 1,
    S3TCBGRA8888MappedAlpha: 2,
    S3TCBGRA8888InterpolatedAlpha: 3,
    OnePastLastS3TCTextureFormat: 4,
};

GR2.SKELETON_LOD_TYPE = {
    GrannyNoSkeletonLOD: 0x0,
    GrannyEstimatedLOD: 0x1,
    GrannyMeasuredLOD: 0x2,
};

GR2.SPU_CURVE_TYPES = {
    CurveTypeReal32: 0,
    CurveTypeK16: 1,
    CurveTypeK8: 2,
    CurveType4nK16: 3,
    CurveType4nK8: 4,
};

GR2.spu_replication_type = {
    ReplicationRaw: 0,
    ReplicationNormOri: 1,
    ReplicationDiagonalSS: 2,
};

GR2.TEXTURE_TYPE = {
    ColorMapTextureType: 0,
    CubeMapTextureType: 1,
    OnePastLastTextureType: 2,
};

GR2.TEXTURE_ENCODING = {
    UserTextureEncoding: 0,
    RawTextureEncoding: 1,
    S3TCTextureEncoding: 2,
    BinkTextureEncoding: 3,
    OnePastLastTextureEncoding: 4,
};

GR2.TRANSFORM_TRACK_FLAGS = {
    UseAccumulatorNeighborhood: 0x1,
};

GR2.track_group_flags = {
    AccumulationExtracted: 0x1,
    TrackGroupIsSorted: 0x2,
    AccumulationIsVDA: 0x4,
};

GR2.VECTOR_DIFF_MODE = {
    DiffAsVectors: 0,
    DiffAsQuaternions: 1,
    ManhattanMetric: 2,
};

GR2.EXTRACT_TRACK_MASK_RESULT = {
    ExtractTrackMaskResult_AllDataPresent: 0,
    ExtractTrackMaskResult_PartialDataPresent: 1,
    ExtractTrackMaskResult_NoDataPresent: 2,
};

GR2.COMPOSITE_FLAG = {
    IncludeComposites: 0,
    ExcludeComposites: 1,
};

/**
 * Constants defined by the Granny Engine
 */
GR2.InfiniteFarClipPlane = 0.0;
GR2.LCD17PhysicalAspectRatio = 1.25;
GR2.NTSCTelevisionPhysicalAspectRatio = 1.33;
GR2.PALTelevisionPhysicalAspectRatio = 1.33;
GR2.WidescreenMonitorPhysicalAspectRatio = 1.56;
GR2.EuropeanFilmAspectRatio = 1.66;
GR2.USDigitalTelevisionAspectRatio = 1.78;
GR2.USAcademyFlatPhysicalAspectRatio = 1.85;
GR2.USPanavisionAspectRatio = 2.20;
GR2.USAnamorphicScopePhysicalAspectRatio = 2.35;
GR2.CurrentGRNStandardTag = (0x80000000 + 38);
GR2.CurrentGRNFileVersion = 7;
GR2.GRNExtraTagCount = 4;

// GR2.CloseFileReader(Reader) if(Reader) {(*(Reader)->CloseFileReaderCallback)(__FILE__, __LINE__, Reader);};
// GR2.ReadAtMost(Reader, Pos, Count, Buffer) (*(Reader).ReadAtMostCallback)(__FILE__, __LINE__, Reader, Pos, Count, Buffer);
// GR2.ReadExactly(Reader, Pos, Count, Buffer) ((*(Reader).ReadAtMostCallback)(__FILE__, __LINE__, Reader, Pos, Count, Buffer) == Count);
// GR2.DeleteFileWriter(Writer) (*(Writer)->DeleteFileWriterCallback)(__FILE__, __LINE__, Writer);
// GR2.GetWriterPosition(Writer) (*(Writer).SeekWriterCallback)(__FILE__, __LINE__, Writer, 0, SeekCurrent);
// GR2.SeekWriterFromStart(Writer, OffsetInUInt8s) (SeekWriterFromStartStub(__FILE__, __LINE__, Writer, OffsetInUInt8s));
// GR2.SeekWriterFromEnd(Writer, OffsetInUInt8s) (SeekWriterFromEndStub(__FILE__, __LINE__, Writer, OffsetInUInt8s));
// GR2.SeekWriterFromCurrentPosition(Writer, OffsetInUInt8s) (SeekWriterFromCurrentPositionStub(__FILE__, __LINE__, Writer, OffsetInUInt8s));
// GR2.Write(Writer, UInt8Count, WritePointer) (*(Writer).WriteCallback)(__FILE__, __LINE__, Writer, UInt8Count, WritePointer);
// GR2.BeginWriterCRC(Writer) (*(Writer).BeginCRCCallback)(__FILE__, __LINE__, Writer);
// GR2.EndWriterCRC(Writer) (*(Writer).EndCRCCallback)(__FILE__, __LINE__, Writer);
// GR2.WriterIsCRCing(Writer) ((Writer).CRCing);

GR2.MaximumSystemFileNameSize = (1 << 9);
GR2.MaximumTempFileNameSize = (1 << 9);
GR2.MaximumMessageBufferSize = (1 << 15);
GR2.MaximumLogFileNameSize = (1 << 9);
GR2.MaximumAggregateCount = (1 << 6);
GR2.MaximumNumberToStringBuffer = (1 << 8);
GR2.MaximumIKLinkCount = (1 << 8);
GR2.MaximumMIPLevelCount = (1 << 5);
GR2.MaximumVertexNameLength = (1 << 6);
GR2.MaximumUserData = (1 << 2);
GR2.MaximumBoneNameLength = (1 << 9);
GR2.MaximumChannelCount = (1 << 8);
GR2.MaximumWeightCount = (1 << 8);
GR2.MaximumChannelWidth = (1 << 2);
GR2.MaximumBSplineDimension = 16;
GR2.MaximumBSplineKnotPower = 16;
GR2.DefaultAllocationAlignment = 4;
GR2.MatrixBufferAlignment = 16;
GR2.DefaultFixedAllocatorBlockAlignment = 16;
GR2.BlockFileFixupCount = (1 << 8);
GR2.ExpectedUsablePageSize = (4000);
GR2.MinimumAllocationsPerFixedBlock = (1 << 6);
GR2.FileCopyBufferSize = (1 << 16);
GR2.CRCCheckBufferSize = (1 << 16);
GR2.TrackWeightEpsilon = 0.001;
GR2.PositionIdentityThreshold = 0.001;
GR2.OrientationIdentityThreshold = 0.0001;
GR2.ScaleShearIdentityThreshold = 0.001;
GR2.BlendEffectivelyZero = 0.001;
GR2.BlendEffectivelyOne = 0.999;
GR2.TimeEffectivelyZero = 0.00001;
GR2.DefaultLocalPoseFillThreshold = 0.2;
GR2.NoSparseBone = -1;
GR2.NoParentBone = -1;
GR2.SPUTransformTrackNoCurve = 0xFFFFFFFF;
GR2.TopologyNullIndex = 0xFFFFFFFF;
GR2.ProductVersion = '2.7.0.30';
GR2.ProductMajorVersion = 2;
GR2.ProductMinorVersion = 7;
GR2.ProductCustomization = 0;
GR2.ProductBuildNumber = 30;
GR2.VertexPositionName = 'Position';
GR2.VertexNormalName = 'Normal';
GR2.VertexTangentName = 'Tangent';
GR2.VertexBinormalName = 'Binormal';
GR2.VertexTangentBinormalCrossName = 'TangentBinormalCross';
GR2.VertexBoneWeightsName = 'BoneWeights';
GR2.VertexBoneIndicesName = 'BoneIndices';
GR2.VertexDiffuseColorName = 'DiffuseColor';
GR2.VertexSpecularColorName = 'SpecularColor';
GR2.VertexTextureCoordinatesName = 'TextureCoordinates';
GR2.VertexMorphCurvePrefix = 'VertexMorphCurve';
