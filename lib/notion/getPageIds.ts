import { CollectionQueryResult, CollectionViewMap } from "@/types/notion";

const CONFIG_PAGE_NAME = "Config";

type Query = {
  [collectionId: string]: {
    [collectionViewId: string]: CollectionQueryResult;
  };
};

export function getPageIdsInCollection(
  collectionId: string | null,
  collectionQuery: Query,
  collectionView: CollectionViewMap,
  viewIds: string[]
) {
  if (!collectionId) return [];
  if (!collectionQuery && !collectionView) return [];

  const pageIds = new Set<string>();
  // 遍历所有视图
  for (const viewId of viewIds) {
    const ids =
      collectionQuery[collectionId][viewId].collection_group_results
        ?.blockIds || [];
    ids.forEach((id) => pageIds.add(id));
  }

  return Array.from(pageIds);
}

export function getConfigPageId(
  collectionId: string | null,
  collectionQuery: Query,
  collectionView: CollectionViewMap
) {
    if (!collectionId || !collectionView) return null;

    for (const view of Object.values(collectionView)) {
        if (view.value.name === CONFIG_PAGE_NAME) {
            return collectionQuery[collectionId][view.value.id].collection_group_results?.blockIds[0] || null;
        }
    }

    return null;
}
