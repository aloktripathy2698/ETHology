const getColorByAvailability = (availability: string): string => {
  if (availability.toLowerCase() === "available") {
    return "#26a69a";
  }
  if (availability.toLowerCase() === "finished") {
    return "#ff3d00";
  }
  return "#ffa000";
};

export { getColorByAvailability};
