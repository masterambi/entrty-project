export const formatCurrency = (price: number, withSymbol?: boolean) => {
  if (!withSymbol) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace(/Rp|rp/, "")
      .trim();
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  })
    .format(price)
    .trim();
};

export const createFakeArray = (length: number): number[] => {
  return [...new Array(length)].map((_, idx) => idx);
};
