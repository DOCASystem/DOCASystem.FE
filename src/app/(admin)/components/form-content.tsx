import Button from "@/components/common/button/button";
import LinkNav from "@/components/common/link/link";

export default function FormContent() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <Button className="w-32  h-11 text-lg">
            <LinkNav href={""}>Quay lại</LinkNav>
          </Button>
        </div>
      </div>
    </div>
  );
}
