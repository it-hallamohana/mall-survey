import React from 'react';
import { Megaphone, BadgePercent, Radar, RadioTower } from 'lucide-react';
import { Card, SectionHeader, BarList, SectionSkeleton, Insight, topOf, fmtPct, BRAND } from '../ui/primitives';

export default function PromoCharts({ data, loading, total, index = 5 }) {
  const topPromo = topOf(data?.preferredPromotions);
  const topMedia = topOf(data?.effectiveMediaChannels);

  return (
    <section className="space-y-4 sm:space-y-5">
      <SectionHeader
        id="promosi" index={index} icon={Megaphone} color={BRAND.yellow}
        title="Media & Promosi" subtitle="Cara terbaik menjangkau pengunjung"
        highlight={topMedia && (
          <Insight><b className="text-[#14141F]">{topMedia.name}</b> jadi media paling efektif ({fmtPct(topMedia.value, total)}); promo favorit: <b className="text-[#14141F]">{topPromo?.name}</b>.</Insight>
        )}
      />
      {loading && !data ? <SectionSkeleton count={3} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <Card title="Promosi yang Disukai" subtitle="% dari responden" icon={BadgePercent} accent={BRAND.pink}>
            <BarList data={data?.preferredPromotions} total={total} color={BRAND.pink} />
          </Card>
          <Card title="Sumber Informasi Promosi" subtitle="Dari mana tahu info promo" icon={Radar} accent={BRAND.orange}>
            <BarList data={data?.promotionInfoSources} total={total} color={BRAND.orange} />
          </Card>
          <Card title="Media Komunikasi Efektif" subtitle="Media paling efektif menurut pengunjung" icon={RadioTower} accent={BRAND.teal}>
            <BarList data={data?.effectiveMediaChannels} total={total} color={BRAND.teal} />
          </Card>
        </div>
      )}
    </section>
  );
}
