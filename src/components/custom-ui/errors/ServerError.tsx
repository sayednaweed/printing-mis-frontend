interface ServerErrorProps {
  errors: any;
}

export function ServerError(props: ServerErrorProps) {
  const { errors } = props;

  const errorElements: JSX.Element[] = [];
  let index = 0;
  for (const key in errors) {
    errorElements.push(
      <h1 key={key} className=" bg-black/10 p-2 mb-1 rounded-md w-full">
        <span>{index + 1}</span>: {errors[key][0]}
      </h1>
    );
    index++;
  }
  return errorElements;
}
