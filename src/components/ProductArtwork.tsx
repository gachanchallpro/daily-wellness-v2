import React from 'react';
import { Product } from '../types';

interface ProductArtworkProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
}

export const PharmacySealSvg: React.FC<{ className?: string }> = ({
  className = 'w-11 h-11',
}) => (
  <svg
    viewBox="0 0 64 64"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M32 5L38.4 10.6L46.8 9.2L49.4 17.3L57.2 20.8L55.2 29.1L60 36.2L53.8 42.1L54.4 50.6L46 52.3L41.8 59.7L33.6 56.8L25.4 59.7L21.2 52.3L12.8 50.6L13.4 42.1L7.2 36.2L12 29.1L10 20.8L17.8 17.3L20.4 9.2L28.8 10.6L32 5Z"
      fill="#95D5B2"
      stroke="#141413"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <circle
      cx="32"
      cy="32"
      r="16"
      fill="#FDF6E9"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <path
      d="M25.5 32.5L29.8 36.8L39 27.5"
      stroke="#0F5C56"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DiscreetParcelSvg: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <svg
    viewBox="0 0 72 72"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      x="10"
      y="18"
      width="52"
      height="40"
      rx="5"
      fill="#E5B985"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <rect
      x="29"
      y="18"
      width="14"
      height="40"
      fill="#FFD166"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <rect
      x="16"
      y="34"
      width="24"
      height="16"
      rx="2"
      fill="#FDF6E9"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <line
      x1="20"
      y1="40"
      x2="34"
      y2="40"
      stroke="#141413"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <line
      x1="20"
      y1="45"
      x2="30"
      y2="45"
      stroke="#F26B50"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const SmartLockerSvg: React.FC<{ className?: string }> = ({
  className = 'w-14 h-14',
}) => (
  <svg
    viewBox="0 0 72 72"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect
      x="12"
      y="8"
      width="48"
      height="56"
      rx="6"
      fill="#0F5C56"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <rect
      x="18"
      y="14"
      width="24"
      height="44"
      rx="3"
      fill="#95D5B2"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <rect
      x="46"
      y="18"
      width="8"
      height="14"
      rx="2"
      fill="#FFD166"
      stroke="#141413"
      strokeWidth="2.5"
    />
    <circle cx="37" cy="36" r="2.5" fill="#141413" />
    <line
      x1="23"
      y1="22"
      x2="35"
      y2="22"
      stroke="#141413"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

function renderUniqueProductSvg(product: Product, svgClass: string): React.ReactNode {
  switch (product.id) {
    // 1. Durex Invisible Siêu Mỏng (0.04mm): Foil pack + diamond ultra-thin feather wave
    case 'durex-invisible':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="19" y="15" width="46" height="52" rx="6" fill="#141413" />
          <rect x="15" y="11" width="46" height="52" rx="6" fill="#0F5C56" stroke="#141413" strokeWidth="2.5" />
          <rect x="21" y="17" width="34" height="9" rx="2.5" fill="#FDF6E9" stroke="#141413" strokeWidth="2.2" />
          <path d="M38 30L51 43L38 56L25 43L38 30Z" fill="#FFD166" stroke="#141413" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M31 43C33.5 39.5 42.5 46.5 45 43" stroke="#0F5C56" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // 2. Sagami Original 0.01: Iconic circular peelable "butter cup" tub + corner pull tab
    case 'sagami-001':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 22H52L64 34V58C64 61.3 61.3 64 58 64H22C18.7 64 16 61.3 16 58V24C16 22.9 16.9 22 18 22Z" fill="#141413" />
          <path d="M15 18H49L61 30V54C61 57.3 58.3 60 55 60H19C15.7 60 13 57.3 13 54V20C13 18.9 13.9 18 15 18Z" fill="#FDF6E9" stroke="#141413" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M49 18V30H61" fill="#F26B50" stroke="#141413" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="36" cy="41" r="13" fill="#95D5B2" stroke="#141413" strokeWidth="2.4" />
          <circle cx="36" cy="41" r="6" fill="#0F5C56" stroke="#141413" strokeWidth="2" />
          <circle cx="36" cy="41" r="2" fill="#FFD166" />
        </svg>
      );

    // 3. Okamoto 0.03 HA: Sage foil pack with Hyaluronic Acid glossy droplet core
    case 'okamoto-003-ha':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="15" width="46" height="52" rx="6" fill="#141413" />
          <rect x="16" y="11" width="46" height="52" rx="6" fill="#95D5B2" stroke="#141413" strokeWidth="2.5" />
          <line x1="22" y1="21" x2="56" y2="21" stroke="#141413" strokeWidth="2.4" strokeDasharray="3 3" strokeLinecap="round" />
          <circle cx="39" cy="40" r="14" fill="#FDF6E9" stroke="#141413" strokeWidth="2.4" />
          <path d="M39 29.5C39 29.5 32 37.5 32 42C32 45.87 35.13 49 39 49C42.87 49 46 45.87 46 42C46 37.5 39 29.5 39 29.5Z" fill="#0F5C56" stroke="#141413" strokeWidth="2.2" strokeLinejoin="round" />
          <circle cx="37" cy="42.5" r="1.7" fill="#FFD166" />
        </svg>
      );

    // 4. Okamoto Harmony 49mm: Tailored snug-fit vertical sleeve with hugging chevron curves
    case 'okamoto-harmony':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="13" width="34" height="56" rx="7" fill="#141413" />
          <rect x="21" y="9" width="34" height="56" rx="7" fill="#FFD166" stroke="#141413" strokeWidth="2.5" />
          <rect x="26" y="15" width="24" height="8" rx="2" fill="#0F5C56" stroke="#141413" strokeWidth="2" />
          <path d="M27 33C31 37 31 44 27 48" stroke="#141413" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M49 33C45 37 45 44 49 48" stroke="#141413" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="38" cy="40.5" r="7" fill="#FDF6E9" stroke="#141413" strokeWidth="2.3" />
          <circle cx="38" cy="40.5" r="2.6" fill="#F26B50" />
          <line x1="27" y1="56" x2="49" y2="56" stroke="#141413" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      );

    // 5. Sagami Original 0.02 Large: Wide arched pack with outward size brackets < >
    case 'sagami-002-large':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="13" y="18" width="56" height="46" rx="8" fill="#141413" />
          <rect x="9" y="14" width="56" height="46" rx="8" fill="#F26B50" stroke="#141413" strokeWidth="2.5" />
          <rect x="15" y="20" width="44" height="34" rx="5" fill="#FDF6E9" stroke="#141413" strokeWidth="2.2" />
          <path d="M25 32L20 37L25 42" stroke="#0F5C56" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M49 32L54 37L49 42" stroke="#0F5C56" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="37" cy="37" r="8" fill="#95D5B2" stroke="#141413" strokeWidth="2.2" />
          <circle cx="37" cy="37" r="3" fill="#FFD166" stroke="#141413" strokeWidth="1.8" />
        </svg>
      );

    // 6. Durex Jeans Easy-On: Denim pocket stitched silhouette + easy-down arrow
    case 'durex-jeans':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 15H63V49L41 66L19 49V15Z" fill="#141413" />
          <path d="M15 11H59V45L37 62L15 45V11Z" fill="#0F5C56" stroke="#141413" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M20 17H54V42L37 55.5L20 42V17Z" stroke="#FFD166" strokeWidth="2" strokeDasharray="3.5 3" strokeLinejoin="round" />
          <circle cx="37" cy="33" r="10" fill="#FDF6E9" stroke="#141413" strokeWidth="2.3" />
          <path d="M37 28V37M33 34L37 38L41 34" stroke="#0F5C56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // 7. Durex Pleasuremax Gân & Gai: Ribbed wavy contour + tactile stud dots
    case 'durex-pleasuremax':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="19" y="15" width="46" height="52" rx="6" fill="#141413" />
          <rect x="15" y="11" width="46" height="52" rx="6" fill="#FFD166" stroke="#141413" strokeWidth="2.5" />
          <path d="M22 21C27 18 33 24 38 21C43 18 49 24 54 21" stroke="#F26B50" strokeWidth="2.8" strokeLinecap="round" />
          <path d="M22 29C27 26 33 32 38 29C43 26 49 32 54 29" stroke="#0F5C56" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="28" cy="40" r="3" fill="#141413" />
          <circle cx="38" cy="40" r="3" fill="#F26B50" stroke="#141413" strokeWidth="1.5" />
          <circle cx="48" cy="40" r="3" fill="#141413" />
          <circle cx="33" cy="50" r="3" fill="#0F5C56" />
          <circle cx="43" cy="50" r="3" fill="#0F5C56" />
        </svg>
      );

    // 8. Postinor 1 (72h): Single emergency pill centered in blister card + 72h clock ring
    case 'postinor-1':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="18" y="15" width="48" height="52" rx="8" fill="#141413" />
          <rect x="14" y="11" width="48" height="52" rx="8" fill="#FDF6E9" stroke="#141413" strokeWidth="2.5" />
          <rect x="20" y="17" width="36" height="8" rx="2" fill="#F26B50" stroke="#141413" strokeWidth="2" />
          <circle cx="38" cy="42" r="14" stroke="#0F5C56" strokeWidth="2.5" strokeDasharray="6 3" />
          <circle cx="38" cy="42" r="9" fill="#FFD166" stroke="#141413" strokeWidth="2.4" />
          <path d="M38 37V42L42 44.5" stroke="#141413" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // 9. Ella 30mg (120h): Shield-cut next-gen blister + faceted hexagon pill + 5-day ring
    case 'ella-120h':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 14H62V43C62 54 41 66 41 66C41 66 20 54 20 43V14Z" fill="#141413" />
          <path d="M16 10H58V39C58 50 37 62 37 62C37 62 16 50 16 39V10Z" fill="#95D5B2" stroke="#141413" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M37 22L48 28.5V41.5L37 48L26 41.5V28.5L37 22Z" fill="#FDF6E9" stroke="#141413" strokeWidth="2.4" strokeLinejoin="round" />
          <circle cx="37" cy="35" r="4.5" fill="#F26B50" stroke="#141413" strokeWidth="2" />
        </svg>
      );

    // 10. Marvelon 28 viên: 28-day blister sheet (active cream/amber pills + green placebo row + arrow)
    case 'marvelon-28':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="16" y="13" width="52" height="56" rx="7" fill="#141413" />
          <rect x="12" y="9" width="52" height="56" rx="7" fill="#FDF6E9" stroke="#141413" strokeWidth="2.5" />
          <rect x="17" y="14" width="42" height="8" rx="2" fill="#0F5C56" stroke="#141413" strokeWidth="2" />
          {[22, 32, 42, 52].map((cx) => (
            <React.Fragment key={cx}>
              <circle cx={cx} cy="29" r="3.4" fill="#FFD166" stroke="#141413" strokeWidth="1.8" />
              <circle cx={cx} cy="39" r="3.4" fill="#FFD166" stroke="#141413" strokeWidth="1.8" />
              <circle cx={cx} cy="49" r="3.4" fill="#95D5B2" stroke="#141413" strokeWidth="1.8" />
            </React.Fragment>
          ))}
          <path d="M20 58H51M47 55L51 58L47 61" stroke="#F26B50" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    // 11. Durex Intense Orgasmic Gel (10ml): Precision pump serum vial with warm flame + cool spark
    case 'durex-intense-gel':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="33" y="9" width="14" height="10" rx="2.5" fill="#141413" />
          <path d="M35 12H51" stroke="#141413" strokeWidth="3" strokeLinecap="round" />
          <rect x="25" y="19" width="30" height="49" rx="8" fill="#141413" />
          <rect x="22" y="16" width="30" height="49" rx="8" fill="#FDF6E9" stroke="#141413" strokeWidth="2.5" />
          <rect x="27" y="27" width="20" height="27" rx="4" fill="#F26B50" stroke="#141413" strokeWidth="2.2" />
          <path d="M37 32C40 36 42 38.5 42 42C42 44.8 39.8 47 37 47C34.2 47 32 44.8 32 42C32 39 34.5 36.5 37 32Z" fill="#FFD166" stroke="#141413" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );

    // 12. Gel Thảo Dược Kéo Dài Dịu Nhẹ (Tuýp 30ml): Inverted flip-cap squeeze tube + mint leaf
    case 'ky-duration-gel':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 14H58L52 54H28L22 14Z" fill="#FDF6E9" stroke="#141413" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="21" y="10" width="38" height="6" rx="2" fill="#0F5C56" stroke="#141413" strokeWidth="2.2" />
          <rect x="31" y="54" width="18" height="12" rx="3" fill="#FFD166" stroke="#141413" strokeWidth="2.4" />
          <path d="M40 24C46 27 48 33 44 40C38 41 33 36 33 30C35 27 37 25 40 24Z" fill="#95D5B2" stroke="#141413" strokeWidth="2.2" strokeLinejoin="round" />
          <line x1="36" y1="36" x2="43" y2="29" stroke="#0F5C56" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    // 13. Xịt Hỗ Trợ Kéo Dài Dịu Nhẹ + Vit E (15ml): Atomizer spray bottle + 5 mist droplets
    case 'stud-gentle-spray':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="27" y="11" width="16" height="11" rx="2.5" fill="#FFD166" stroke="#141413" strokeWidth="2.4" />
          <circle cx="38" cy="16.5" r="2" fill="#141413" />
          <rect x="21" y="22" width="28" height="45" rx="7" fill="#0F5C56" stroke="#141413" strokeWidth="2.5" />
          <rect x="26" y="31" width="18" height="24" rx="3" fill="#FDF6E9" stroke="#141413" strokeWidth="2.1" />
          <path d="M37 36L32 43H36.5L35 50L40 42.5H36L37 36Z" fill="#F26B50" stroke="#141413" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="52" cy="14" r="2.2" fill="#0F5C56" />
          <circle cx="59" cy="11" r="2" fill="#F26B50" />
          <circle cx="60" cy="17" r="2.4" fill="#0F5C56" />
          <circle cx="56" cy="23" r="1.8" fill="#141413" />
          <circle cx="65" cy="14" r="1.8" fill="#141413" />
        </svg>
      );

    // 14. Durex Naturals Gel (100ml): Rounded apothecary bottle + water droplet & pH leaf
    case 'durex-naturals':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="28" y="9" width="24" height="10" rx="3" fill="#FFD166" stroke="#141413" strokeWidth="2.5" />
          <rect x="20" y="19" width="40" height="50" rx="12" fill="#FDF6E9" stroke="#141413" strokeWidth="2.5" />
          <path d="M40 29C40 29 31 39 31 45C31 49.97 35.03 54 40 54C44.97 54 49 49.97 49 45C49 39 40 29 40 29Z" fill="#0F5C56" stroke="#141413" strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M40 48C40 44 43 41 46 41C45 45 43 47 40 48Z" fill="#95D5B2" />
          <line x1="29" y1="61" x2="51" y2="61" stroke="#141413" strokeWidth="2.3" strokeLinecap="round" />
        </svg>
      );

    // 15. Sagami Original Glide (Tuýp 60g): Standing Japanese soft-gel bottle with flowing dual wave
    case 'sagami-glide-gel':
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="9" width="20" height="9" rx="2.5" fill="#0F5C56" stroke="#141413" strokeWidth="2.4" />
          <path d="M24 18H56L60 60C60 64.4 56.4 68 52 68H28C23.6 68 20 64.4 20 60L24 18Z" fill="#95D5B2" stroke="#141413" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="26" y="29" width="28" height="24" rx="5" fill="#FDF6E9" stroke="#141413" strokeWidth="2.2" />
          <path d="M30 37C33 34 37 40 40 37C43 34 47 40 50 37" stroke="#0F5C56" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M30 45C33 42 37 48 40 45C43 42 47 48 50 45" stroke="#F26B50" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // Fallback default
    default:
      return (
        <svg viewBox="0 0 80 80" className={svgClass} fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="19" y="15" width="46" height="52" rx="6" fill="#141413" />
          <rect x="15" y="11" width="46" height="52" rx="6" fill="#0F5C56" stroke="#141413" strokeWidth="2.5" />
          <circle cx="38" cy="40" r="10" fill="#FDF6E9" stroke="#141413" strokeWidth="2.5" />
        </svg>
      );
  }
}

export const ProductArtwork: React.FC<ProductArtworkProps> = ({
  product,
  size = 'sm',
}) => {
  const stageBg: Record<Product['accentTone'], string> = {
    teal: 'bg-[#95D5B2]',
    slate: 'bg-[#FFD166]',
    sage: 'bg-[#FDF6E9]',
    coral: 'bg-[#F26B50]',
  };

  const containerClass =
    size === 'lg'
      ? 'w-full h-44 rounded-2xl border-[2.5px] border-[#141413] shadow-[4px_4px_0_#141413]'
      : size === 'md'
      ? 'w-full h-24 rounded-xl border-[2.5px] border-[#141413]'
      : 'w-16 h-16 rounded-xl border-[2.5px] border-[#141413] shrink-0';

  const svgClass =
    size === 'lg' ? 'w-32 h-32' : size === 'md' ? 'w-16 h-16' : 'w-12 h-12';

  const badgeText =
    product.category === 'condom'
      ? product.thickness
      : product.category === 'lubricant'
      ? product.nominalWidth
      : product.shortWidth;

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${stageBg[product.accentTone]} ${containerClass}`}
      aria-hidden="true"
    >
      {renderUniqueProductSvg(product, svgClass)}
      {size === 'lg' && (
        <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-[#FDF6E9] border-[2px] border-[#141413] text-[11px] font-mono font-bold text-[#141413]">
          {badgeText}
        </span>
      )}
    </div>
  );
};
