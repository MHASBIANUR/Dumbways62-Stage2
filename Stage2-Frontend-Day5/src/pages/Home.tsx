export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-emerald-200 dark:bg-gray-900 rounded-4xl">
      <img
        src="/images/Product.jpg"
        alt="Background Product"
        className="absolute inset-0 w-full h-full object-cover rounded-4xl opacity-70 dark:opacity-40"/>
      <div className="absolute inset-0 bg-white/40 dark:bg-black/50 rounded-4xl"></div>
      <div className="relative text-gray-900 dark:text-white text-center z-10">
        <h1 className="text-4xl font-bold m-4">Home Page</h1>
        <p className="text-lg">Selamat Datang di Toko Product</p>
      </div>
    </div>
  );
}
