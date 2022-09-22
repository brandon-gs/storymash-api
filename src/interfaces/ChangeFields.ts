export type ChangeFields<T, R> = Omit<T, keyof R> & R;

// Example
// type CampaignForm = ChangeFields<Campaign, {
//   attributeValues: Omit<Campaign['attributeValues'], 'mandatoryAttributes'|'optionalAttributes'>
// }>;
