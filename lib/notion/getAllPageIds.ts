import { CollectionQueryResult, CollectionViewMap } from "@/types/notion";

type CollectionQuery = {
  [collectionId: string]: {
    [collectionViewId: string]: CollectionQueryResult;
  };
};

export function getAllPageIds(
  collectionQuery: CollectionQuery,
  collectionId: string | undefined,
  collectionView: CollectionViewMap,
  viewIds: string[]
) {
  if (!collectionQuery && !collectionView) {
    return [];
  }

  let pageIds: string[] = [];
  try {
    if (collectionId && viewIds.length > 0) {
      // 使用第一个视图获取所有pageId
      const ids =
        collectionQuery[collectionId][viewIds[0]]?.collection_group_results
          ?.blockIds;
      if (ids && ids.length > 0) {
        for (const id of ids) {
          pageIds.push(id);
        }
      }
    }
  } catch (error) {
    console.error("[getAllPageIds]获取页面数据失败", error);
    return [];
  }

  // 如果还没有获取到pageId，则遍历所有视图获取
  if (
    pageIds.length === 0 &&
    collectionQuery &&
    Object.values(collectionQuery).length > 0 &&
    collectionId
  ) {
    const pageSet: Set<string> = new Set();
    Object.values(collectionQuery[collectionId]).forEach((view) => {
      // group view
      view?.blockIds?.forEach((id) => pageSet.add(id));
      // table view
      view?.collection_group_results?.blockIds?.forEach((id) =>
        pageSet.add(id)
      );
    });
    pageIds = Array.from(pageSet);
  }

  return pageIds;
}
