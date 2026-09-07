export const FATHOM_MEDIA_RECONCILIATION_SELECTION = {
  pageInfo: { hasNextPage: true },
  edges: {
    node: {
      id: true,
      video: { fileId: true },
      audio: { fileId: true },
      fathomRecordingImport: {
        id: true,
        updatedAt: true,
        recordingId: true,
        connectedAccountId: true,
        mediaDownloadId: true,
        mediaFailureReason: true,
        mediaImportClaimedAt: true,
        mediaUploadCheckpoint: true,
      },
      transcript: true,
      status: true,
      updatedAt: true,
    },
  },
};
