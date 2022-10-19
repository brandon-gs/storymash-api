import { ObjectId } from "mongodb";

export const storyFilterByChapterId = (storyId: string, chapterId: string) => ({
  _id: new ObjectId(storyId),
  chapters: {
    $elemMatch: {
      _id: new ObjectId(chapterId),
    },
  },
  isDeleted: false,
});
