"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RiCloseLine } from "@remixicon/react";
import { Select } from "@/components/Select";
import { ActionButton } from "@/components/ActionButton";
import { Text } from "@/components/Text";
import type { BookSearchTarget } from "@/shared/types/book";

const detailSearchSchema = z.object({
  target: z.enum(["title", "person", "publisher"]),
  keyword: z.string().trim().min(1, "검색어를 입력해주세요"),
});

type DetailSearchValues = z.infer<typeof detailSearchSchema>;

const TARGET_OPTIONS: { value: BookSearchTarget; label: string }[] = [
  { value: "title", label: "제목" },
  { value: "person", label: "저자명" },
  { value: "publisher", label: "출판사" },
];

interface DetailSearchPopoverProps {
  onClose: () => void;
  onSubmit: (values: { keyword: string; target: BookSearchTarget }) => void;
}

export function DetailSearchPopover({ onClose, onSubmit }: DetailSearchPopoverProps) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DetailSearchValues>({
    resolver: zodResolver(detailSearchSchema),
    defaultValues: { target: "title", keyword: "" },
  });

  return (
    <div
      id="detail-search-popover"
      role="dialog"
      aria-label="상세검색"
      className="border-gray absolute top-full right-0 z-10 mt-3 w-72 rounded-lg border bg-white p-4 shadow-lg"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="상세검색 닫기"
        className="text-subtitle absolute top-3 right-3"
      >
        <RiCloseLine aria-hidden="true" className="h-5 w-5" />
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 pt-2">
        <div className="flex items-center gap-1">
          <Controller
            name="target"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={TARGET_OPTIONS}
                label="검색 대상"
              />
            )}
          />
          <input
            {...register("keyword")}
            placeholder="검색어 입력"
            aria-label="검색어 입력"
            aria-invalid={Boolean(errors.keyword)}
            aria-describedby={errors.keyword ? "detail-search-keyword-error" : undefined}
            className="border-gray text-body-2 text-primary flex-1 border-b px-1 py-2 outline-none"
          />
        </div>

        {errors.keyword && (
          <Text id="detail-search-keyword-error" variant="caption" color="error">
            {errors.keyword.message}
          </Text>
        )}

        <ActionButton title="검색하기" size="small" type="submit" variant="primary" fullWidth />
      </form>
    </div>
  );
}
