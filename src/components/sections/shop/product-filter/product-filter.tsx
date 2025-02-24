"use client";

import Checkbox from "@/components/common/checkbox/checkbox";

const info1 = [
  { id: 1, label: "Đồ ăn cho chó", checked: false, itemCount: 10 },
  { id: 2, label: "Đồ ăn cho mèo", checked: false, itemCount: 10 },
];

const info2 = [
  { id: 1, label: "Natural food", checked: false, itemCount: 10 },
  { id: 2, label: "Pet care", checked: false, itemCount: 10 },
  { id: 3, label: "Dogs friend", checked: false, itemCount: 10 },
  { id: 4, label: "Pet food", checked: false, itemCount: 10 },
  { id: 5, label: "Favourite pet", checked: false, itemCount: 10 },
  { id: 6, label: "Green line", checked: false, itemCount: 10 },
];

export default function ProductFilter() {
  return (
    <>
      <div className="w-[306px] flex flex-col gap-4">
        {info1.map((item) => (
          <Checkbox
            key={item.id}
            label={item.label}
            checked={item.checked}
            itemCount={item.itemCount}
            onChange={() => {}}
          />
        ))}

        <div></div>

        {info2.map((item) => (
          <Checkbox
            key={item.id}
            label={item.label}
            checked={item.checked}
            itemCount={item.itemCount}
            onChange={() => {}}
          />
        ))}
      </div>
    </>
  );
}
