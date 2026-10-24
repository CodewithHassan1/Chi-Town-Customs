import { Star, ShieldCheck, MapPin, Award, CheckCircle2 } from "lucide-react";

export default function TrustReviewsSection() {
  const reviews = [
    {
      author: "Dominic S. (Chicago, IL)",
      rating: 5,
      date: "Verified Customer",
      vehicle: "2023 Corvette C8",
      comment:
        "Bent two passenger side 20\" forged rims on a deep pothole on the Stevenson Expressway. Chi-Town Customs had them straightened back to factory runout in 24 hours. The Road Force balance is vibration-free at 90mph. Exceptional work.",
    },
    {
      author: "Malik T. (Oak Park, IL)",
      rating: 5,
      date: "Verified Customer",
      vehicle: "2022 Dodge Charger Widebody",
      comment:
        "Purchased a custom staggered 20x9.5 and 20x11 setup with Michelin PS4S tires. Fitment is completely flush with zero fender rub. Their shop team on Cicero Ave knows exactly what they are doing.",
    },
    {
      author: "Rachel K. (Lincoln Park, IL)",
      rating: 4.5,
      date: "Verified Customer",
      vehicle: "2021 BMW M3 Competition",
      comment:
        "Had severe curb rash powder coated in Satin Bronze. The finish is flawless and matches the OEM center caps perfectly. Super transparent communication from Marcus and the technicians.",
    },
  ];

  return (
    <section className="py-20 bg-[#08090B] border-b border-[#22262E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Rating Overview Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-14 bg-[#111317] border border-[#22262E] rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-xl bg-[#191C21] border border-[#292D34] flex flex-col items-center justify-center shrink-0">
              <span className="text-3xl font-black text-white">4.5</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                4.5 Stars from 207 Customer Reviews
              </h3>
              <p className="text-xs text-gray-400">
                Verified Chicago automotive enthusiasts, performance drivers, and local commuters.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#D71920]" />
                <span>Chi-Town Customs USA &bull; 311 N Cicero Ave, Chicago, IL</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300">
            <div className="flex items-center gap-2 bg-[#08090B] px-3.5 py-2 rounded-lg border border-[#292D34]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Hunter Road Force Facility</span>
            </div>
            <div className="flex items-center gap-2 bg-[#08090B] px-3.5 py-2 rounded-lg border border-[#292D34]">
              <Award className="w-4 h-4 text-[#D71920]" />
              <span>Aerospace 6061-T6 Alloys</span>
            </div>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-[#111317] border border-[#22262E] rounded-xl p-6 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#1F232B]">
                <p className="text-xs font-bold text-white">{rev.author}</p>
                <p className="text-[11px] text-[#D71920] font-medium">{rev.vehicle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
