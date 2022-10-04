import type { Request } from "express";
import path from "path";
import cloudinary from "./cloudinary";

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg"];

export type ImageUpload = {
  error: boolean;
  message: string;
  imageName?: string;
};

export default async function imageUpload(req: Request): Promise<ImageUpload> {
  if (!req.file) {
    return {
      imageName: undefined,
      message: "No hay imagen para subir",
      error: true,
    };
  }
  const image = req.file;
  const ext = path.extname(image.originalname).toLowerCase();
  if (!IMAGE_EXTENSIONS.includes(ext)) {
    return {
      imageName: undefined,
      message: "El formato de la imágen debe ser .png .jpg o .jpeg",
      error: true,
    };
  }
  const result = await cloudinary.uploader.upload(req.file.path);
  if (!result) {
    return {
      imageName: undefined,
      error: true,
      message: "Error al subir la imagen",
    };
  }
  return {
    imageName: result.secure_url,
    message: "Imagen actualizada correctamente",
    error: false,
  };
}
