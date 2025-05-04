import { cn } from "@/lib/utils";

export interface BooleanStatusButtonProps {
  id: number;
  value1: string;
  value2: string;
}

export default function BooleanStatusButton(props: BooleanStatusButtonProps) {
  const { id, value1, value2 } = props;
  const data =
    id == 1
      ? {
          style: "bg-green-500/90",
          value: value1,
        }
      : {
          style: "bg-primary/90",
          value: value2,
        };

  return (
    <h1
      className={cn(
        "truncate ring-1 shadow-md text-center rounded-2xl rtl:text-md-rtl ltr:text-md-ltr px-1 py-[2px] text-primary-foreground font-bold",
        data.style
      )}
    >
      {data.value}
    </h1>
  );
}
