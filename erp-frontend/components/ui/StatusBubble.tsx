

interface statusItems {
  text: string;
  colorClass: string;
}

export default function statusBubble(dict: statusItems) {
  return (
    <div className={"w-fit px-3 rounded-full bg-" + dict.colorClass + "/20"}>
      <span className={"text-xs font-semibold text-" + dict.colorClass}>
        {dict.text}
      </span>
    </div>
  );
}
