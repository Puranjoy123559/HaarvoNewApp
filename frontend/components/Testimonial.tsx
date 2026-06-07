// Props are ONLY for values that will come from the database later.
// Everything else (the quote, the label "FARMERS ONBOARDED") is static UI copy
// and stays hardcoded — that's fine.
type TestimonialProps = {
  authorName?: string;     // Will come from DB
  authorRole?: string;     // Will come from DB
  authorImage?: string;    // Will come from DB
  farmerCount?: string;    // Will come from DB (e.g. API returns total farmers)
};

export default function Testimonial({
  // Default placeholder values — replaced when real data is passed in
  authorName = "[ Author Name ]",
  authorRole = "[ Author Role, Organization ]",
  authorImage,
  farmerCount = "—",
}: TestimonialProps) {
  return (
    <section className="bg-[#F5F4F1] py-16 px-6">
      <div className=" hidden max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT — Testimonial quote (static text — stays hardcoded) */}
        <div>
          <p className="text-2xl text-[#0E3D2E] font-semibold mb-6 leading-relaxed">
            &ldquo;Haarvo gave us instant access to institutional buyers we
            could never reach before. Our farmers are getting fairer prices,
            faster.&rdquo;
          </p>

          {/* Person info — these values come from the database */}
          <div className="flex items-center gap-4">
            {/* If we have an image URL, show the image; otherwise show a gray circle placeholder */}
            {authorImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={authorImage}
                alt={authorName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
            )}

            <div>
              {/* Name (from DB) */}
              <p className="font-bold text-[#0E3D2E]">{authorName}</p>
              {/* Role / organization (from DB) */}
              <p className="text-sm text-gray-600">{authorRole}</p>
            </div>
          </div>
        </div>

        {/* RIGHT — Stat card */}
        <div className="flex justify-center md:justify-end">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            {/* The big number — comes from DB via API call later */}
            <p className="text-4xl font-bold text-green-700 mb-1">
              {farmerCount}
            </p>
            {/* Static label — stays hardcoded */}
            <p className="text-xs font-bold text-gray-700 tracking-wider">
              FARMERS ONBOARDED
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}