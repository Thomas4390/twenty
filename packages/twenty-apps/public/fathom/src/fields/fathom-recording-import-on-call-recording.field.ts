import {
  defineField,
  FieldType,
  OnDeleteAction,
  RelationType,
  STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS,
} from 'twenty-sdk/define';

import {
  CALL_RECORDINGS_ON_FATHOM_RECORDING_IMPORT_FIELD_UNIVERSAL_IDENTIFIER,
  FATHOM_RECORDING_IMPORT_OBJECT_UNIVERSAL_IDENTIFIER,
  FATHOM_RECORDING_IMPORT_ON_CALL_RECORDING_FIELD_UNIVERSAL_IDENTIFIER,
} from 'src/constants/universal-identifiers';

export default defineField({
  universalIdentifier:
    FATHOM_RECORDING_IMPORT_ON_CALL_RECORDING_FIELD_UNIVERSAL_IDENTIFIER,
  objectUniversalIdentifier:
    STANDARD_OBJECT_UNIVERSAL_IDENTIFIERS.callRecording.universalIdentifier,
  type: FieldType.RELATION,
  name: 'fathomRecordingImport',
  label: 'Fathom Recording Import',
  description: 'Internal lifecycle state for this Fathom recording import.',
  icon: 'IconDownload',
  isNullable: true,
  isUIEditable: false,
  relationTargetObjectMetadataUniversalIdentifier:
    FATHOM_RECORDING_IMPORT_OBJECT_UNIVERSAL_IDENTIFIER,
  relationTargetFieldMetadataUniversalIdentifier:
    CALL_RECORDINGS_ON_FATHOM_RECORDING_IMPORT_FIELD_UNIVERSAL_IDENTIFIER,
  universalSettings: {
    relationType: RelationType.MANY_TO_ONE,
    onDelete: OnDeleteAction.SET_NULL,
    joinColumnName: 'fathomRecordingImportId',
  },
});
