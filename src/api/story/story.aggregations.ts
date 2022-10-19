export const storyCardAggregations = [
  {
    $match: {
      isDeleted: false,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "authorId",
      foreignField: "_id",
      as: "author",
      pipeline: [
        {
          $addFields: {
            username: "$account.username",
            imageUrl: "$profile.imageUrl",
          },
        },
        {
          $project: { username: 1, imageUrl: 1 },
        },
      ],
    },
  },
  {
    $unwind: "$author",
  },
  {
    $addFields: {
      firstChapter: { $first: "$chapters" },
      lastChapter: { $last: "$chapters.createdAt" },
      totalChapters: {
        $size: "$chapters",
      },
      totalLikes: {
        $size: {
          $reduce: {
            input: "$chapters.likes",
            initialValue: [],
            in: {
              $concatArrays: ["$$value", "$$this"],
            },
          },
        },
      },
      totalComments: {
        $size: {
          $reduce: {
            input: "$chapters.comments",
            initialValue: [],
            in: {
              $concatArrays: ["$$value", "$$this"],
            },
          },
        },
      },
    },
  },
  {
    $project: {
      authorId: 0,
      chapters: 0,
      firstChapter: { comments: 0, createdAt: 0 },
      lastChapter: { content: 0, likes: 0, comments: 0 },
    },
  },
  {
    $sort: {
      lastChapter: -1,
    },
  },
];
