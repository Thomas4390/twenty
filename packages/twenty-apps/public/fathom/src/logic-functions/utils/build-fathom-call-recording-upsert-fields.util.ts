import { isDefined } from 'src/utils/is-defined';

import { type CallRecordingSyncFields } from 'src/logic-functions/types/call-recording-sync-fields.type';
import { type CallRecordingMediaState } from 'src/logic-functions/types/call-recording-media-state.type';
import { type FathomRecordingImportFields } from 'src/logic-functions/types/fathom-recording-import-fields.type';

export const buildFathomCallRecordingUpsertFields = ({
  sharedFields,
  existingCallRecording,
  connectedAccountId,
  fathomRecordingImportId,
  recordingId,
  retryMedia,
}: {
  sharedFields: CallRecordingSyncFields;
  existingCallRecording:
    | Pick<
        CallRecordingMediaState,
        | 'hasVideo'
        | 'hasAudio'
        | 'failureReason'
        | 'downloadId'
        | 'connectedAccountId'
        | 'hasTranscript'
        | 'hasSummary'
      >
    | undefined;
  connectedAccountId: string;
  fathomRecordingImportId: string;
  recordingId: string;
  retryMedia: boolean;
}): {
  createCallRecordingFields: CallRecordingSyncFields;
  updateCallRecordingFields: CallRecordingSyncFields;
  recordingImportFields: FathomRecordingImportFields & {
    recordingId: string;
  };
  isMediaDownloadRequestNeeded: boolean;
} => {
  const isRetryingSettledMedia =
    retryMedia &&
    isDefined(existingCallRecording?.failureReason) &&
    !existingCallRecording.hasVideo &&
    !existingCallRecording.hasAudio;
  const hasActiveDownloadForCurrentConnection =
    !isRetryingSettledMedia &&
    isDefined(existingCallRecording?.downloadId) &&
    existingCallRecording.connectedAccountId === connectedAccountId;
  const isReplacingActiveDownload =
    isDefined(existingCallRecording) &&
    existingCallRecording.connectedAccountId !== connectedAccountId &&
    !existingCallRecording.hasVideo &&
    !existingCallRecording.hasAudio &&
    !isDefined(existingCallRecording.failureReason);
  const isMissingMedia =
    !existingCallRecording?.hasVideo &&
    !existingCallRecording?.hasAudio &&
    !isDefined(existingCallRecording?.downloadId) &&
    !isDefined(existingCallRecording?.failureReason);
  const ownershipFields = hasActiveDownloadForCurrentConnection
    ? {}
    : { connectedAccountId };

  return {
    createCallRecordingFields: {
      ...sharedFields,
      fathomRecordingImportId,
      status: 'PROCESSING',
    },
    updateCallRecordingFields: {
      ...sharedFields,
      fathomRecordingImportId,
      ...(existingCallRecording?.hasTranscript
        ? { transcript: undefined }
        : {}),
      ...(existingCallRecording?.hasSummary ? { summary: undefined } : {}),
      ...(isRetryingSettledMedia ? { status: 'PROCESSING' } : {}),
    },
    recordingImportFields: {
      recordingId,
      ...ownershipFields,
      ...(isReplacingActiveDownload || isRetryingSettledMedia
        ? {
            mediaDownloadId: null,
            mediaUploadCheckpoint: null,
            mediaImportClaimedAt: null,
          }
        : {}),
      ...(isRetryingSettledMedia ? { mediaFailureReason: null } : {}),
    },
    isMediaDownloadRequestNeeded:
      isRetryingSettledMedia || isReplacingActiveDownload || isMissingMedia,
  };
};
