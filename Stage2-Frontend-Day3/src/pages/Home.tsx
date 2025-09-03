export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-emerald-200 rounded-4xl">
      <img src="/images/toko-makanan.jpg" alt="" className="absolute inset-0 w-full h-full object-cover rounded-4xl"/>

      <div className="relative  text-white">
        <h1 className="text-4xl font-bold m-4">Home Page</h1>
        <p>Selamat Datang di Toko Makanan</p>
      </div>
    </div>
  );
}
