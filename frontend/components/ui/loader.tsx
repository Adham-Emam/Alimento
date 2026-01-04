export default function Loader() {
  return (
    <div className="flex items-center justify-center  fixed top-0 left-0 z-50 min-h-screen w-full">
      <div className="pan-loader">
        <div className="loader"></div>
        <div className="pan-container ">
          <div className="pan bg-gray-800 dark:bg-white"></div>
          <div className="handle bg-gray-500 dark:bg-gray-700"></div>
        </div>
        <div className="shadow"></div>
      </div>
    </div>
  )
}
