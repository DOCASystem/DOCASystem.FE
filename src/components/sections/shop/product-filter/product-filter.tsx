"use client";

import Checkbox from "@/components/common/checkbox/checkbox";

export default function ProductFilter() {
  return (
    <>
      <div>
        <Checkbox label="In stock" checked={true} onChange={() => {}} />
      </div>
    </>
  );
}
