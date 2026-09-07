'use client';

interface Building {
  id: number;
  name: string;
  address: string;
  city: string;
  postcode: string;
  floors_count: number;
  year_built: number;
  total_area_sqm: number;
  building_type: string;
  status: string;
  health_score: number;
  notes: string;
}

interface Props {
  buildings: Building[];
  onSelect: (b: Building) => void;
}

const buildingImages = [
  'https://readdy.ai/api/search-image?query=modern%20glass%20commercial%20office%20tower%20building%20exterior%20London%20city%20architecture%20blue%20sky%20clean%20minimal%20professional%20photography%20wide%20angle%20urban%20skyline%20corporate%20headquarters&width=400&height=220&seq=dt-b1&orientation=landscape',
  'https://readdy.ai/api/search-image?query=riverside%20mixed%20use%20building%20Thames%20London%20waterfront%20architecture%20modern%20brick%20facade%20commercial%20residential%20exterior%20photography%20urban%20development&width=400&height=220&seq=dt-b2&orientation=landscape',
  'https://readdy.ai/api/search-image?query=modern%20tech%20campus%20office%20building%20Manchester%20contemporary%20architecture%20glass%20steel%20facade%20corporate%20park%20exterior%20photography%20clean%20minimal%20design&width=400&height=220&seq=dt-b3&orientation=landscape',
  'https://readdy.ai/api/search-image?query=large%20industrial%20warehouse%20logistics%20hub%20Birmingham%20exterior%20photography%20modern%20distribution%20centre%20steel%20structure%20loading%20bays%20clean%20professional&width=400&height=220&seq=dt-b4&orientation=landscape',
];

export default function DTBuildingsOverview({ buildings, onSelect }: Props) {
  const healthColor = (score: number) =>
    score >= 85 ? 'text-green-600' : score >= 70 ? 'text-amber-600' : 'text-red-600';
  const healthBg = (score: number) =>
    score >= 85 ? 'bg-green-100 border-green-200' : score >= 70 ? 'bg-amber-100 border-amber-200' : 'bg-red-100 border-red-200';
  const healthBar = (score: number) =>
    score >= 85 ? 'bg-green-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        {buildings.map((b, i) => (
          <div
            key={b.id}
            onClick={() => onSelect(b)}
            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
          >
            <div className="relative h-36 overflow-hidden">
              <img
                src={buildingImages[i % buildingImages.length]}
                alt={b.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold border ${healthBg(b.health_score)} ${healthColor(b.health_score)}`}>
                {b.health_score}%
              </div>
              <div className="absolute bottom-3 left-3">
                <div className="text-white font-bold text-sm">{b.name}</div>
                <div className="text-white/80 text-xs">{b.city}</div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 capitalize">{b.building_type.replace('_', ' ')}</span>
                <span className="text-xs text-gray-500">{b.floors_count} floors</span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Health Score</span>
                  <span className={`font-semibold ${healthColor(b.health_score)}`}>{b.health_score}%</span>
                </div>
                <div className="bg-gray-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${healthBar(b.health_score)}`} style={{ width: `${b.health_score}%` }}></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div><i className="ri-map-pin-line mr-1"></i>{b.address}</div>
                <div><i className="ri-building-line mr-1"></i>{b.total_area_sqm?.toLocaleString()} m²</div>
              </div>
              <button className="mt-3 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium py-2 rounded-lg cursor-pointer transition-colors">
                Open Digital Twin
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}