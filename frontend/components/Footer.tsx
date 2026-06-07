// Simple footer at the very bottom of the page
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xl font-bold text-[#0E3D2E]">Haarvo</div>
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Haarvo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}