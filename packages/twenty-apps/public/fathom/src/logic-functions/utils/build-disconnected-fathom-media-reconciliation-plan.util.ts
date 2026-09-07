import { isNonEmptyString } from '@sniptt/guards';

import {
  type DisconnectedFathomMediaReconciliationPlan,
  type FathomMediaReconciliationCandidate,
} from 'src/logic-functions/types/fathom-media-reconciliation-plan.type';
import { isFathomMediaSettled } from 'src/logic-functions/utils/is-fathom-media-settled.util';

export const buildDisconnectedFathomMediaReconciliationPlan = (
  callRecordings: FathomMediaReconciliationCandidate[],
): DisconnectedFathomMediaReconciliationPlan => {
  const plan: DisconnectedFathomMediaReconciliationPlan = {
    callRecordingsToSettle: [],
    callRecordingsToSettleAndComplete: [],
    callRecordingsToSettleAndFail: [],
    callRecordingsToComplete: [],
    callRecordingsToFail: [],
  };

  for (const callRecording of callRecordings) {
    if (
      !isNonEmptyString(callRecording.fathomRecordingImportId) ||
      !isNonEmptyString(callRecording.fathomRecordingImportUpdatedAt)
    ) {
      continue;
    }

    const reference = {
      callRecordingId: callRecording.id,
      callRecordingUpdatedAt: callRecording.updatedAt,
      fathomRecordingImportId: callRecording.fathomRecordingImportId,
      fathomRecordingImportUpdatedAt:
        callRecording.fathomRecordingImportUpdatedAt,
    };

    if (!isFathomMediaSettled(callRecording)) {
      if (callRecording.status === 'PROCESSING') {
        if (callRecording.hasTranscript) {
          plan.callRecordingsToSettleAndComplete.push(reference);
        } else {
          plan.callRecordingsToSettleAndFail.push(reference);
        }
      } else {
        plan.callRecordingsToSettle.push(reference);
      }

      continue;
    }

    if (callRecording.status === 'PROCESSING') {
      if (callRecording.hasTranscript) {
        plan.callRecordingsToComplete.push(reference);
      } else {
        plan.callRecordingsToFail.push(reference);
      }
    }
  }

  return plan;
};
