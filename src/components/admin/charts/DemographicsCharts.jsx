import React from 'react';
import { Users, Cake, VenusAndMars, MapPin } from 'lucide-react';
import { Card, SectionHeader, BarList, Donut, Columns, ClickHint, SectionSkeleton, Insight, topOf, sumOf, fmtPct, BRAND, COLOR_MAPS } from '../ui/primitives';

export default function DemographicsCharts({ data, loading, filters = {}, onFilter, index = 1 }) {
  const topAge = topOf(data?.ageGroups);
  const topCity = topOf(data?.cities);
  const ageTotal = sumOf(data?.ageGroups);
  const cityTotal = sumOf(data?.cities);

  return (
    <section className="space-y-4 sm:space-y-5">
      <SectionHeader
        id="demografi" index={index} icon={Users} color={BRAND.pink}
        title="Demografi Pengunjung" subtitle="Siapa yang datang ke PXchange"
        highlight={topAge && topAge.value > 0 && (
          <Insight>Mayoritas berusia <b className="text-[#14141F]">{topAge.name}</b> ({fmtPct(topAge.value, ageTotal)}), terbanyak dari <b className="text-[#14141F]">{topCity?.name}</b>.</Insight>
        )}
      />
      {loading && !data ? <SectionSkeleton count={3} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <Card title="Kelompok Usia" subtitle="Diurutkan dari usia termuda" icon={Cake} accent={BRAND.pink} action={onFilter && <ClickHint />} className="lg:col-span-2">
            <Columns data={data?.ageGroups} color={BRAND.pink} onSelect={onFilter && (v => onFilter('ageGroup', v))} activeName={filters.ageGroup} />
          </Card>
          <Card title="Gender" subtitle="Komposisi pengunjung" icon={VenusAndMars} accent={BRAND.teal} action={onFilter && <ClickHint />}>
            <Donut data={data?.genders} colorMap={COLOR_MAPS.gender} size={180} onSelect={onFilter && (v => onFilter('gender', v))} activeName={filters.gender} />
          </Card>
          <Card title="10 Kota / Domisili Teratas" subtitle="Ejaan & variasi nama kota sudah disatukan" icon={MapPin} accent={BRAND.orange} className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <BarList data={(data?.cities || []).slice(0, 5)} total={cityTotal} color={BRAND.orange} maxItems={5} />
              <BarList data={(data?.cities || []).slice(5, 10)} total={cityTotal} color={BRAND.purple} maxItems={5} rankOffset={5} maxValue={data?.cities?.[0]?.value} />
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}
