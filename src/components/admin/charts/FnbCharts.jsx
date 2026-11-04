import React from 'react';
import { UtensilsCrossed, Salad, Store, ListChecks, MessageSquareText } from 'lucide-react';
import { Card, SectionHeader, BarList, Donut, TextFeed, SectionSkeleton, Insight, topOf, fmtPct, BRAND, COLOR_MAPS } from '../ui/primitives';

export default function FnbCharts({ data, loading, total, index = 3 }) {
  const topTenant = topOf(data?.desiredFnbTenants);
  const topFactor = topOf(data?.diningFactors);

  return (
    <section className="space-y-4 sm:space-y-5">
      <SectionHeader
        id="kuliner" index={index} icon={UtensilsCrossed} color={BRAND.teal}
        title="Kuliner & F&B" subtitle="Preferensi makan pengunjung"
        highlight={topTenant && (
          <Insight><b className="text-[#14141F]">{fmtPct(topTenant.value, total)}</b> responden ingin tenant <b className="text-[#14141F]">{topTenant.name}</b>; faktor utama memilih: <b className="text-[#14141F]">{topFactor?.name}</b>.</Insight>
        )}
      />
      {loading && !data ? <SectionSkeleton count={4} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <Card title="Variasi Makanan" subtitle="Penilaian kelengkapan kuliner" icon={Salad} accent={BRAND.teal}>
            <Donut data={data?.foodVariety} colorMap={COLOR_MAPS.variety} size={170} />
          </Card>
          <Card title="Tenant F&B yang Diinginkan" subtitle="Boleh pilih > 1 · % dari responden" icon={Store} accent={BRAND.pink}>
            <BarList data={data?.desiredFnbTenants} total={total} color={BRAND.pink} />
          </Card>
          <Card title="Faktor Memilih Tempat Makan" subtitle="Boleh pilih > 1 · % dari responden" icon={ListChecks} accent={BRAND.orange}>
            <BarList data={data?.diningFactors} total={total} color={BRAND.orange} />
          </Card>
          <Card title="Tenant yang Diharapkan Hadir" subtitle="Jawaban terbuka pengunjung" icon={MessageSquareText} accent={BRAND.purple} className="lg:col-span-3">
            <TextFeed items={data?.requestedTenants || []} placeholder="Cari nama tenant, mis. 'Mie Gacoan'..." accent={BRAND.purple} height={260} />
          </Card>
        </div>
      )}
    </section>
  );
}
