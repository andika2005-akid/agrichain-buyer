export interface GoodsDistributionResult {
  label: string;
  equivalent: number;
}

export function getGoodsDistributionFromAmount(
  subsidyType: string,
  amount: number
): GoodsDistributionResult {
  const items = subsidyType.split("+").map((item) => item.trim());
  const splitAmount = amount / Math.max(items.length, 1);

  let equivalent = 0;
  const labels = items.map((item) => {
    const normalized = item.toLowerCase();
    if (normalized.includes("pupuk")) {
      const ton = splitAmount / 5000000;
      equivalent += ton;
      return `${ton.toFixed(1)} ton pupuk`;
    }
    if (normalized.includes("benih")) {
      const ton = splitAmount / 7000000;
      equivalent += ton;
      return `${ton.toFixed(1)} ton benih`;
    }
    if (normalized.includes("alat")) {
      const unit = Math.max(1, Math.round(splitAmount / 2500000));
      equivalent += unit * 0.1;
      return `${unit} unit alat pertanian`;
    }
    if (normalized.includes("irigasi")) {
      const paket = Math.max(1, Math.round(splitAmount / 10000000));
      equivalent += paket * 0.3;
      return `${paket} paket irigasi`;
    }

    const paket = Math.max(1, Math.round(splitAmount / 1000000));
    equivalent += paket * 0.05;
    return `${paket} paket bantuan`;
  });

  return {
    label: labels.join(", "),
    equivalent,
  };
}
