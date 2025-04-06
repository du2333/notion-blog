export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isEmoji(str: string) {
  const emojiRegex =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  return emojiRegex.test(str);
}

export function isIterable(obj: any) {
  return (
    obj !== null &&
    obj !== undefined &&
    typeof obj[Symbol.iterator] === "function"
  );
}

export function isUUID(str: string) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
}

export function generatePagination(
  totalPages: number,
  currentPage: number,
  maxVisiblePages: number = 5
): (number | string)[] {
  const result: (number | string)[] = [];

  // 如果总页数小于等于最大可见页数，直接返回所有页码
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 始终显示第一页
  result.push(1);

  // 计算需要显示的页码范围
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  // 调整范围以确保显示固定数量的页码
  if (endPage - startPage + 1 > maxVisiblePages - 2) {
    if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
      startPage = 2;
      endPage = maxVisiblePages - 1;
    } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
      startPage = totalPages - maxVisiblePages + 2;
      endPage = totalPages - 1;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }
  }

  // 添加省略号
  if (startPage > 2) {
    result.push("...");
  }

  // 添加中间的页码
  for (let i = startPage; i <= endPage; i++) {
    result.push(i);
  }

  // 添加省略号
  if (endPage < totalPages - 1) {
    result.push("...");
  }

  // 始终显示最后一页
  if (totalPages > 1) {
    result.push(totalPages);
  }

  return result;
}


export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}