import React from 'react';
import { Footprints, Target, UsersRound, Repeat2, Timer, Wallet } from 'lucide-react';
import { Card, SectionHeader, BarList, Donut, Columns, ClickHint, SectionSkeleton, Insight, topOf, sumOf, fmtPct, BRAND } from '../ui/primitives';

export default function BehaviorCharts({ data, loading, filters = {}, onFilter, index = 2 }) {
  const topPurpose = topOf(data?.visitPurpose);
  const topComp = topOf(data?.companions);

  return (
    <section className="space-y-4 sm:space-y-5">
      <SectionHeader
        id="perilaku" index={index} icon={Footprints} color={BRAND.orange}
        title="Perilaku Kunjungan" subtitle="Seberapa sering, untuk apa, dan berapa lama"
        highlight={topPurpose && (
          <Insight>Tujuan utama <b className="text-[#14141F]">{topPurpose.name}</b> ({fmtPct(topPurpose.value, sumOf(data.visitPurpose))}), paling sering datang bersama <b className="text-[#14141F]">{topComp?.name}</b>.</Insight>
        )}
      />
      {loading && !data ? <SectionSkeleton count={5} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <Card title="Tujuan Kunjungan" subtitle="Alasan utama datang ke mall" icon={Target} accent={BRAND.orange} action={onFilter && <ClickHint />} className="lg:col-span-2">
            <BarList data={data?.visitPurpose} color={BRAND.orange} onSelect={onFilter && (v => onFilter('visitPurpose', v))} activeName={filters.visitPurpose} />
          </Card>
          <Card title="Datang Bersama" subtitle="Rombongan kunjungan" icon={UsersRound} accent={BRAND.purple}>
            <Donut data={data?.companions} size={170} />
          </Card>
          <Card title="Frekuensi Kunjungan" subtitle="Dari jarang ke sering" icon={Repeat2} accent={BRAND.pink}>
            <Columns data={data?.visitFrequency} color={BRAND.pink} height={160} />
          </Card>
          <Card title="Durasi Kunjungan" subtitle="Dari singkat ke lama" icon={Timer} accent={BRAND.teal}>
            <Columns data={data?.visitDuration} color={BRAND.teal} height={160} />
          </Card>
          <Card title="Estimasi Pengeluaran" subtitle="Per kunjungan, kecil ke besar" icon={Wallet} accent={BRAND.purple}>
            <Columns data={data?.estimatedSpending} color={BRAND.purple} height={160} />
          </Card>
        </div>
      )}
    </section>
  );
}
