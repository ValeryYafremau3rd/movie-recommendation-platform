type SubHeaderProps = {
  title: string;
  description: string;
};

export default function SubHeader({ title, description }: SubHeaderProps) {
  return (
    <>
      <h2 className="mb-2 text-xl font-semibold text-gray-900">{title}</h2>

      <p className="mb-6 text-sm text-gray-500">{description}</p>
    </>
  );
}
