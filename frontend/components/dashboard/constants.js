export const CATEGORIES = {
  Food: { label: "Food", color: "var(--color-cat-food)" },
  Transport: { label: "Transport", color: "var(--color-cat-transport)" },
  Bills: { label: "Bills", color: "var(--color-cat-bills)" },
  Shopping: { label: "Shopping", color: "var(--color-cat-shopping)" },
  Health: { label: "Health", color: "var(--color-cat-health)" },
  Entertainment: { label: "Entertainment", color: "var(--color-cat-entertainment)" },
  Other: { label: "Other", color: "var(--color-cat-other)" },
};

export const money = (n) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const shortDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const monthLabelFromKey = (key) => {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};
