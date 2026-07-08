"use client";

import { memo, useState } from "react";
import Image from "next/image";
import { RiArrowDownSLine } from "@remixicon/react";
import { LikeButton } from "./LikeButton";
import { ActionButton } from "@/components/ActionButton";
import { Text } from "@/components/Text";
import { formatPrice } from "@/shared/utils/format";
import type { Book } from "@/shared/types/book";

const THUMBNAIL_CONFIG = {
  sm: {
    width: 48,
    height: 64,
    imageClassName: "h-16 w-12 rounded object-cover",
    fallbackClassName: "bg-light-gray h-16 w-12 rounded",
    likeButtonClassName: "absolute top-0.5 right-0.5",
    likeButtonSize: "sm" as const,
  },
  lg: {
    width: 210,
    height: 280,
    imageClassName: "rounded object-cover",
    fallbackClassName: "bg-gray h-40 w-28 rounded",
    likeButtonClassName: "absolute top-2 right-2",
    likeButtonSize: "md" as const,
  },
};

function BookThumbnail({ book, size }: { book: Book; size: keyof typeof THUMBNAIL_CONFIG }) {
  const config = THUMBNAIL_CONFIG[size];

  return (
    <div className="relative shrink-0">
      {book.thumbnailUrl ? (
        <Image
          src={book.thumbnailUrl}
          alt={book.title}
          width={config.width}
          height={config.height}
          className={config.imageClassName}
        />
      ) : (
        <div className={config.fallbackClassName} />
      )}
      <div className={config.likeButtonClassName}>
        <LikeButton book={book} size={config.likeButtonSize} />
      </div>
    </div>
  );
}

export const BookListItem = memo(function BookListItem({ book }: { book: Book }) {
  const [expanded, setExpanded] = useState(false);
  const hasDiscount = book.salePrice > 0 && book.salePrice < book.price;
  const displayPrice = hasDiscount ? book.salePrice : book.price;
  const canPurchase = Boolean(book.url);

  const toggle = () => setExpanded((v) => !v);

  // expanded status
  if (expanded) {
    return (
      <li className="border-gray border-b">
        <div className="flex gap-8 pt-6 pr-4 pb-10 pl-14">
          <BookThumbnail book={book} size="lg" />

          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <Text variant="title-3" className="flex items-center gap-4">
                {book.title}
                <Text as="span" variant="body-2" color="secondary">
                  {book.authors.join(", ")}
                </Text>
              </Text>

              <ActionButton
                title="상세보기"
                variant="secondary"
                size="medium"
                className="shrink-0"
                onClick={toggle}
                trailingIcon={<RiArrowDownSLine className="h-4 w-4 rotate-180" />}
              />
            </div>

            <div className="flex flex-1 gap-6">
              <div className="flex-1">
                <Text variant="body-2" bold>
                  책 소개
                </Text>
                <Text
                  variant="body-2"
                  color="secondary"
                  className="mt-3 line-clamp-6 whitespace-pre-line"
                >
                  {book.contents || "책 소개가 없습니다."}
                </Text>
              </div>

              <div className="flex w-40 shrink-0 flex-col items-end justify-end gap-2">
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <Text as="span" variant="small" color="subtitle" className="font-medium">
                      원가
                    </Text>
                    <Text as="span" variant="title-3" color="secondary" className="line-through">
                      {formatPrice(book.price)}
                    </Text>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Text as="span" variant="small" color="subtitle" className="font-medium">
                    {hasDiscount ? "할인가" : "가격"}
                  </Text>
                  <Text as="span" variant="title-3" bold>
                    {formatPrice(displayPrice)}
                  </Text>
                </div>
                <ActionButton
                  title="구매하기"
                  href={book.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="primary"
                  size="medium"
                  fullWidth
                  disabled={!canPurchase}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }

  // default status
  return (
    <li className="border-gray border-b py-4">
      <div className="flex items-center justify-between gap-12">
        <div className="flex min-w-0 flex-1 items-center gap-12">
          <BookThumbnail book={book} size="sm" />
          {/* book details */}
          <div className="flex min-w-0 flex-1 items-baseline gap-4">
            <Text as="span" variant="body-1" bold className="min-w-0 truncate">
              {book.title}
            </Text>
            <Text as="span" variant="body-2" color="secondary" className="min-w-0 truncate">
              {book.authors.join(", ")}
            </Text>
          </div>
          <Text variant="body-1" bold className="shrink-0">
            {formatPrice(displayPrice)}
          </Text>
        </div>

        {/* buttons */}
        <div className="flex items-center gap-2">
          <ActionButton
            title="구매하기"
            href={book.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="medium"
            disabled={!canPurchase}
            className="shrink-0"
          />

          <ActionButton
            title="상세보기"
            variant="secondary"
            size="medium"
            className="shrink-0"
            onClick={toggle}
            trailingIcon={<RiArrowDownSLine className="h-4 w-4" />}
          />
        </div>
      </div>
    </li>
  );
});
