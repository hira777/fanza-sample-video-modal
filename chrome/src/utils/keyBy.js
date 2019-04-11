const keyBy = (array, key) =>
  (array || []).reduce((r, x) => ({ ...r, [key ? x[key] : x]: x }), {});

export default keyBy;
