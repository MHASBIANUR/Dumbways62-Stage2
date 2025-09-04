export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen rounded-4xl overflow-hidden">
      <img src="/images/movies.jpg" alt="Movies Background" className="absolute inset-0 w-full h-full object-cover"/>
      <div className="absolute inset-0 bg-black/25 dark:bg-black/60 backdrop-blur-[1px]"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 text-white drop-shadow-lg">
          HOME PAGE
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 dark:text-gray-300 drop-shadow">
          MOVIES
        </p>
      </div>
    </div>
  );
}
