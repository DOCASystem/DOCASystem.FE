import Input from "@/components/common/input/input";

export default function FormContact() {
  return (
    <>
      <div className="bg-gray-600 w-[550px] p-10">
        <div className="flex flex-row gap-6">
          <Input label="Name" placeholder="Enter your name" />
          <Input label="Name" placeholder="Enter your name" />
        </div>

        <Input label="Name" placeholder="Enter your name" />
        <Input label="Name" placeholder="Enter your name" />
      </div>
    </>
  );
}
