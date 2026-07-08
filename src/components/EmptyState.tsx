import Image from "next/image";
import { Text } from "@/components/Text";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-24">
      <Image src="/svg/empty.svg" alt="" width={80} height={80} />
      <Text variant="caption" color="secondary">
        {message}
      </Text>
    </div>
  );
}
