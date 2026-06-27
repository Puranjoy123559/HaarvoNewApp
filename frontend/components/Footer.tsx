// Simple footer at the very bottom of the page
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <Logo variant="dark" className="h-8 scale-400 origin-left" />
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Haarvo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}