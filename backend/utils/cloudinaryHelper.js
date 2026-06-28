function getPublicId(imageUrl) {
  const parts = imageUrl.split("/upload/");
  if (parts.length < 2) return null;
  return parts[1]
    .replace(/^v\d+\//, "")
    .replace(/\.[^/.]+$/, "");
}

module.exports = {
  getPublicId,
};
