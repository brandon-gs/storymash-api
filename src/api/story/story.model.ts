import { ObjectId, WithId } from "mongodb";
import { z } from "zod";
import { db } from "../../db";

export const StoryComment = z.object({
  _id: z.instanceof(ObjectId), // ObjectID from mongodb
  authorId: z.string().min(1, "El autor del comentario es requerido"),
  content: z.string().min(1, "El comentario es requerido"),
  likes: z.array(z.string()).default([]), // array with user's id
  createdAt: z.string().default(new Date().toUTCString()),
  isEdited: z.boolean().default(false),
});

export const StoryChapter = z.object({
  _id: z.instanceof(ObjectId), // ObjectID from mongodb
  content: z
    .string()
    .min(1, "El contenido del capítulo debe tener al menos un caracter"),
  likes: z.array(z.string()).default([]), // array with user's id
  comments: z.array(StoryComment).default([]), // array with StoryComment structure
  createdAt: z.string().default(new Date().toUTCString()),
});

export const Story = z.object({
  authorId: z.instanceof(ObjectId), // user's id
  title: z.string().min(1, "El título es requerido"),
  imageUrl: z.string().min(1, "La imagen es requerida"),
  categories: z.array(z.string()).min(1, "Al menos una categoria es requerida"),
  chapters: z.array(StoryChapter),
  views: z.array(z.string()).default([]), // array with user's id
  isPublished: z.boolean().default(false),
  isCompleted: z.boolean().default(false),
  isDeleted: z.boolean().default(false),
  createdAt: z.string().default(new Date().toUTCString()),
});

export type StoryComment = z.infer<typeof StoryComment>;
export type StoryChapter = z.infer<typeof StoryChapter>;
export type Story = z.infer<typeof Story>;
export type StoryWithId = WithId<Story>;

export const Stories = db.collection<Story>("stories");
