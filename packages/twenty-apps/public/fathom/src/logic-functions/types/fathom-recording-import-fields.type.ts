export type FathomRecordingImportFields = {
  recordingId?: string;
  connectedAccountId?: string;
  mediaDownloadId?: string | null;
  mediaFailureReason?: string | null;
  mediaImportClaimedAt?: string | null;
  mediaUploadCheckpoint?: unknown | null;
};
