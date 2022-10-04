import type { Request } from "express";
import type { UserWithId } from "../../api/user/user.model";
import path from "path";
import fs from "fs-extra";
import cloudinary from "./cloudinary";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg"];

export type ImageUpload = {
  error: boolean;
  message: string;
  imageUrl?: string;
};

export default async function imageUpload(req: Request): Promise<ImageUpload> {
  const user = req.user as UserWithId;
  if (!req.file) {
    return {
      imageUrl: undefined,
      message: "No hay imagen para subir",
      error: false,
    };
  }
  const image = req.file;
  const ext = path.extname(image.originalname).toLowerCase();
  await fs.unlink(req.file.path);
  if (!IMAGE_EXTENSIONS.includes(ext)) {
    return {
      imageUrl: undefined,
      message: "El formato de la imágen debe ser .png .jpg o .jpeg",
      error: true,
    };
  }
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: `/storymash/${user.account.username}/`,
  });
  if (!result) {
    return {
      imageUrl: undefined,
      error: true,
      message: "Error al subir la imagen",
    };
  }
  return {
    imageUrl: result.secure_url,
    message: "Imagen actualizada correctamente",
    error: false,
  };
}
