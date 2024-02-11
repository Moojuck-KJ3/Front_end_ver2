const FinalRestaurantDetails = () => {
  // Placeholder data for the other sections, replace with real data as needed

  return (
    <div className="grid grid-cols-2 grid-rows-2 p-4 gap-4 text-white font-tenada">
      {/* Top-left cell for the main image */}
      <div className="row-span-1">
        <img
          src="/돈까스.png" // Replace with `restaurant.imageUrl` or similar
          alt="Main Dish"
          className="w-full max-h-[300px] rounded-md"
        />
      </div>
      {/* Top-right cell for details */}
      <div>
        <h3 className="text-md font-semibold">식당 정보</h3>
        <p>이름</p>
      </div>
      {/* Bottom-right cell for reviews */}

      {/* Additional cells can go here, e.g., for a map or other images */}
      {/* Map cell */}
      <div className="col-span-1">
        <h3 className="text-md font-semibold">리뷰</h3>
        <p>리뷰리뷰</p>

        {/* Insert map component here */}
      </div>
      <div className="col-span-1">
        <h3 className="text-md font-semibold">위치</h3>
        <p>위치위치</p>

        {/* Insert map component here */}
      </div>
    </div>
  );
};
export default FinalRestaurantDetails;
