"use client";

interface Props {
  error: Error
}

export default function RootError({ error }: Props) {
  return (
    <div>
      <p>  {error.message} </p>
    </div>
  );
}
