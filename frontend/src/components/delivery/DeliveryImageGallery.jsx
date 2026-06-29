function DeliveryImageGallery({ images, onGalleryOpen }) {

  if (!images || images.length === 0) {
    return (
      <span className="text-xs text-gray-400 italic">No Proof</span>
    );
  }

  return (
    <div
      onClick={() => onGalleryOpen(images, 0)}
      className="cursor-pointer flex items-center gap-2"
    >
      <div className="relative group/img">
        <img
          src={images[0]}
          alt="Proof"
          className="w-14 h-14 object-cover rounded-xl border border-gray-200 dark:border-slate-600 shadow-md transition-transform duration-200 group-hover/img:scale-110 group-hover/img:shadow-xl"
        />
        {/* overlay hint */}
        <div className="absolute inset-0 rounded-xl bg-black/0 group-hover/img:bg-black/20 transition-all duration-200" />
      </div>

      {images.length > 1 && (
        <span className="bg-blue-600 text-white px-2 py-0.5 rounded-lg text-xs font-semibold shadow">
          +{images.length - 1}
        </span>
      )}
    </div>
  );

}

export default DeliveryImageGallery;