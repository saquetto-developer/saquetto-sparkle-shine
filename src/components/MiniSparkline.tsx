import { cn } from '@/lib/utils';

interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

export function MiniSparkline({
  data,
  width = 100,
  height = 24,
  className,
  color = 'currentColor'
}: MiniSparklineProps) {
  if (!data || data.length === 0) {
    return null;
  }

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  // Generate path
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  const path = `M ${points.join(' L ')}`;

  // Generate area path for gradient fill
  const areaPath = `${path} L ${width},${height} L 0,${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      className={cn("inline-block", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sparklineGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path
        d={areaPath}
        fill="url(#sparklineGradient)"
      />

      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
