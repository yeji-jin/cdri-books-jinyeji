import Image from "next/image";
import { Text } from "@/components/Text";
import { ActionButton } from "@/components/ActionButton";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24">
      <Image src="/svg/empty.svg" alt="" width={80} height={80} />
      <div className="flex flex-col items-center gap-2">
        <Text variant="title-3">페이지를 찾을 수 없습니다</Text>
        <Text variant="body-2" color="secondary">
          주소가 잘못되었거나 삭제된 페이지일 수 있습니다.
        </Text>
      </div>
      <ActionButton title="도서 검색으로 이동" href="/search" variant="primary" className="mt-2" />
    </div>
  );
}
