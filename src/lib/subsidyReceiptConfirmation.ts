export interface SubsidyReceiptConfirmation {
  applicationId: string;
  programId: string;
  farmerId: string;
  farmerName: string;
  blockchainHash?: string;
  confirmedAt: string;
  proofMethod: "camera";
  proofImageDataUrl?: string;
}

const STORAGE_KEY = "agrichain_subsidy_receipt_confirmations_v1";

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const getSubsidyReceiptConfirmations = (): SubsidyReceiptConfirmation[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as SubsidyReceiptConfirmation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const upsertSubsidyReceiptConfirmation = (
  confirmation: SubsidyReceiptConfirmation
): SubsidyReceiptConfirmation[] => {
  const current = getSubsidyReceiptConfirmations();
  const exists = current.some((item) => item.applicationId === confirmation.applicationId);
  const next = exists
    ? current.map((item) =>
        item.applicationId === confirmation.applicationId ? { ...item, ...confirmation } : item
      )
    : [confirmation, ...current];

  if (canUseStorage()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return next;
};

export const getSubsidyReceiptConfirmationByApplicationId = (
  applicationId: string
): SubsidyReceiptConfirmation | undefined => {
  return getSubsidyReceiptConfirmations().find((item) => item.applicationId === applicationId);
};

export const getSubsidyReceiptConfirmationByBlockchainHash = (
  blockchainHash: string
): SubsidyReceiptConfirmation | undefined => {
  return getSubsidyReceiptConfirmations().find((item) => item.blockchainHash === blockchainHash);
};
