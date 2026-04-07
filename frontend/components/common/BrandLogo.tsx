type BrandLogoVariant = 'header' | 'hero';

const LOGO_SIZE: Record<BrandLogoVariant, { fontSize: number; letterSpacing: string }> = {
  header: { fontSize: 28, letterSpacing: '-0.3px' },
  hero: { fontSize: 36, letterSpacing: '-0.4px' },
};

interface BrandLogoProps {
  variant?: BrandLogoVariant;
  className?: string;
  style?: React.CSSProperties;
}

export default function BrandLogo({
  variant = 'header',
  className,
  style,
}: BrandLogoProps) {
  const size = LOGO_SIZE[variant];

  const baseText: React.CSSProperties = {
    fontFamily: '"Segoe UI", "Avenir Next Rounded", "Arial Rounded MT Bold", system-ui, sans-serif',
    fontWeight: 800,
    fontSize: size.fontSize,
    letterSpacing: size.letterSpacing,
    lineHeight: 1,
    textRendering: 'geometricPrecision',
  };

  const teachGradient: React.CSSProperties = {
    backgroundImage: 'linear-gradient(180deg, #FFE7A1 0%, #F6B23C 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  };

  const beeGradient: React.CSSProperties = {
    backgroundImage: 'linear-gradient(180deg, #A7DCCE 0%, #5FB4A4 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
  };

  return (
    <span
      role="img"
      aria-label="TeachBee"
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        ...baseText,
        ...style,
      }}
    >
      <span style={teachGradient}>Teach</span>
      <span style={beeGradient}>Bee</span>
    </span>
  );
}
