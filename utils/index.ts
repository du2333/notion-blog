export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isEmoji(str: string) {
  const emojiRegex =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
  return emojiRegex.test(str);
}

export function isIterable(obj: any) {
  return obj !== null && obj !== undefined && typeof obj[Symbol.iterator] === "function";
}

export function isUUID(str: string) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
}