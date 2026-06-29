function ImageModal({

  images,

  selectedIndex,

  setSelectedIndex,

  darkMode,

  onClose

}) {

  if (!images || images.length === 0) {
    return null;
  }

  const nextImage = () => {

    setSelectedIndex(
      (prev) =>
        prev === images.length - 1
          ? 0
          : prev + 1
    );

  };

  const prevImage = () => {

    setSelectedIndex(
      (prev) =>
        prev === 0
          ? images.length - 1
          : prev - 1
    );

  };

  return (

    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

      <div
        className={`relative p-6 rounded-2xl animate-[fadeIn_.3s_ease-in-out] max-w-4xl w-full ${darkMode
            ? "bg-gray-900"
            : "bg-white"
          }`}
      >

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded"
        >
          ✕
        </button>

        <img
          src={images[selectedIndex]}
          alt="Proof"
          className="w-full max-h-[70vh] object-contain rounded-lg"
        />

        <div className="flex gap-2 mt-4 justify-center flex-wrap">

          {images.map((image, index) => (

            <img
              key={`${image}-${index}`}
              src={image}
              alt="Thumbnail"
              onClick={() =>
                setSelectedIndex(index)
              }
              className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 transition ${selectedIndex === index
                  ? "border-blue-500 scale-110"
                  : "border-gray-400"
                }`}
            />

          ))}

        </div>

        <div className="flex justify-between mt-4">

          <button
            onClick={prevImage}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            ← Previous
          </button>

          <span
            className={
              darkMode
                ? "text-white"
                : "text-black"
            }
          >
            {selectedIndex + 1}
            {" / "}
            {images.length}
          </span>

          <button
            onClick={nextImage}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next →
          </button>

        </div>

      </div>

    </div>

  );

}

export default ImageModal;