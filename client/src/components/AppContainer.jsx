export default function AppContainer({ children }) {
  return (
    <div className="min-h-screen bg-[#F6F7FB] flex justify-center">
      <div className="
        w-full
        max-w-md
        md:max-w-lg
        lg:max-w-xl
        px-5
        sm:px-6
        md:px-0
      ">
        {children}
      </div>
    </div>
  );
}