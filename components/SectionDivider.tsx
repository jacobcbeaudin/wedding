import Image from 'next/image';

export default function SectionDivider() {
  return (
    <div className="my-12 flex items-center justify-center">
      <div className="h-px w-24 bg-border"></div>
      <Image
        src="/images/icons/otter.png"
        alt=""
        width={28}
        height={28}
        className="mx-4 opacity-70"
      />
      <div className="h-px w-24 bg-border"></div>
    </div>
  );
}
