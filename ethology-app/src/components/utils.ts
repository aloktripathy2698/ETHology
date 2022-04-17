const getColorByAvailability = (availability: string): string => {
  if (availability === "positive") {
    return "#26a69a";
  }
  if (availability === "negative") {
    return "#ff3d00";
  }
  return "#ffa000";
};

export { getColorByAvailability};
