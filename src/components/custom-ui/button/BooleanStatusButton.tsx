import { cn } from "@/lib/utils";

export interface BooleanStatusButtonProps {
  getColor: () => {
    style: string;
    value: string;
  };
}

export default function BooleanStatusButton(props: BooleanStatusButtonProps) {
  const { getColor } = props;
  const data = getColor();

  return (
    <h1
      className={cn(
        "truncate ring-1 shadow-md text-center rounded-2xl rtl:text-md-rtl ltr:text-md-ltr px-1 py-[2px] text-primary-foreground font-bold",
        data?.style
      )}
    >
      {data?.value}
    </h1>
  );
}
