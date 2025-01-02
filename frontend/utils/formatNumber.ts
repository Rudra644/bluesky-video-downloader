export const formatNumber = (value: number): string => {
    return value > 999 ? `${(value / 1000).toFixed(1)}K` : value.toString();
  };
  