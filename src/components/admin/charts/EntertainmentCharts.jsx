import React from 'react';
import { PartyPopper, Gamepad2, CalendarHeart, HeartHandshake, Sparkles } from 'lucide-react';
import { Card, SectionHeader, BarList, Donut, Columns, SectionSkeleton, Insight, topOf, fmtPct, BRAND, COLOR_MAPS } from '../ui/primitives';

export default function EntertainmentCharts({ data, loading, total, index = 4 }) {
  const topArea = topOf(data?.entertainmentAreas);
  const topEvent = topOf(data?.desiredEvents);

  return (
    <section className="space-y-4 sm:space-y-5">
      <SectionHeader
        id="hiburan" index={index} icon={PartyPopper} color={BRAND.purple}
        title="Hiburan & Event" subtitle="Area favorit dan event yang dinanti"
        highlight={topEvent && (
          <Insight>Event paling diminati: <b className="text-[#14141F]">{topEvent.name}</b> ({fmtPct(topEvent.value, total)}). Area favorit: <b className="text-[#14141F]">{topArea?.name}</b>.</Insight>
        )}
      />
      {loading && !data ? <SectionSkeleton cols={2} count={4} /> : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <Card title="Area Hiburan Favorit" subtitle="Boleh pilih > 1 · % dari responden" icon={Gamepad2} accent={BRAND.purple}>
            <BarList data={data?.entertainmentAreas} total={total} color={BRAND.purple} />
          </Card>
          <Card title="Event yang Diminati" subtitle="Boleh pilih > 1 · % dari responden" icon={CalendarHeart} accent={BRAND.pink}>
            <BarList data={data?.desiredEvents} total={total} color={BRAND.pink} />
          </Card>
          <Card title="Pentingnya Hiburan Keluarga" subtitle="Dari tidak penting ke sangat penting" icon={HeartHandshake} accent={BRAND.teal}>
            <Columns data={data?.familyEntertainmentImportance} color={BRAND.teal} height={170} />
          </Card>
          <Card title="Minat Datang Karena Event" subtitle="Ketertarikan berkunjung saat ada event" icon={Sparkles} accent={BRAND.orange}>
            <Donut data={data?.eventVisitInterest} colorMap={COLOR_MAPS.interest} size={170} wide />
          </Card>
        </div>
      )}
    </section>
  );
}
