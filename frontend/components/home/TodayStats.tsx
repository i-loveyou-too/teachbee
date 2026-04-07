interface StatItem {
  value: number;
  label: string;
  color: string;
}

interface TodayStatsProps {
  stats: StatItem[];
}

export default function TodayStats({ stats }: TodayStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-2.5 mb-6">
      {stats.map(({ value, label, color }) => (
        <div
          key={label}
          className="rounded-xl p-3 text-center bg-white border border-[#f0f0f0]"
          style={{ boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}
        >
          <div className="text-[20px] font-bold mb-0.5" style={{ color }}>
            {value}
          </div>
          <div className="text-[10px] font-medium" style={{ color: '#888' }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
