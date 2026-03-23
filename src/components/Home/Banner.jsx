const Banner = () => {
  return (
    <div className="w-full rounded-2xl overflow-hidden my-2.5 flex items-center justify-center">
      <img
        className="max-h-full max-w-full object-cover"
        src="https://storage.googleapis.com/campaigners-images/Temple%20Images/home-banner.jpg"
        alt="banner"
        loading="lazy"
      />
    </div>
  );
};

export default Banner;
