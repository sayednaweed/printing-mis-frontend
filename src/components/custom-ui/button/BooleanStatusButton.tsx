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
    <div
      className={`border-[1px] min-w-fit rtl:text-xl-rtl rtl:font-medium w-fit flex items-center gap-x-2 ltr:py-1 rtl:py-[2px] px-[8px] rounded-full ${data.style}`}
    >
      <div
        className={`size-[12px] min-h-[12px] min-w-[12px] rounded-full border-[3px] ${data.style}`}
      />
      <h1 className="text-nowrap">{data.value}</h1>
    </div>
  );
}
