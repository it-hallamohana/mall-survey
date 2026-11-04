import React from 'react';
import { Star, Smile, Repeat, MessageCircleHeart } from 'lucide-react';
import { Card, SectionHeader, Donut, TextFeed, ClickHint, SectionSkeleton, Insight, sumOf, fmtPct, BRAND, COLOR_MAPS } from '../ui/primitives';

export default function ExperienceCharts({ data, loading, filters = {}, onFilter, index = 6 }) {
  const sat = data?.satisfactionLevel || [];
  const satTotal = sumOf(sat);
  const positive = sat.filter(s => s.name === 'Puas' || s.name === 'Sangat Puas').reduce((a, b) => a + b.value, 0);
  // Skor 1-4 (Kurang Puas=1 ... Sangat Puas=4)
  const SCORE = { 'Kurang Puas': 1, 'Cukup': 2, 'Puas': 3, 'Sangat Puas': 4 };
  const score = satTotal ? sat.reduce((a, s) => a + (SCORE[s.name] || 0) * s.value, 0) / satTotal : 0;

  return (
    <section className="space-y-4 sm:space-y-5">
      <SectionHeader
        id="pengalaman" index={index} icon={Star} color={BRAND.teal}
        title="Pengalaman & Kepuasan" subtitle="Bagaimana perasaan pengunjung"
        highlight={satTotal > 0 && (
          <Insight>Skor kepuasan rata-rata <b className="text-[#14141F]">{score.toFixed(2).replace('.', ',')} / 4</b> · {fmtPct(positive, satTotal)} merasa puas atau sangat puas.</Insight>
        )}
      />
      {loading && !data ? <SectionSkeleton count={3} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          <Card title="Tingkat Kepuasan" subtitle="Kepuasan keseluruhan" icon={Smile} accent={BRAND.teal} action={onFilter && <ClickHint />}>
            <Donut data={sat} colorMap={COLOR_MAPS.satisfaction} size={180} onSelect={onFilter && (v => onFilter('satisfactionLevel', v))} activeName={filters.satisfactionLevel} />
          </Card>
          <Card title="Niat Berkunjung Kembali" subtitle="Dalam 1 bulan ke depan" icon={Repeat} accent={BRAND.purple}>
            <Donut data={data?.revisitIntention} colorMap={COLOR_MAPS.revisit} size={180} />
          </Card>
          <Card title="Saran Pengunjung" subtitle="Masukan terbaru" icon={MessageCircleHeart} accent={BRAND.pink}>
            <TextFeed items={data?.visitorSuggestions || []} placeholder="Cari kata kunci, mis. 'parkir'..." accent={BRAND.pink} height={330} />
          </Card>
        </div>
      )}
    </section>
  );
}
