import { getRandomNumber } from "../../utils";
import cloudinary from "./cloudinary";

type CloudinaryResource = {
  asset_id: string;
  public_id: string;
  format: string;
  version: number;
  resource_type: "image";
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  folder: string;
  url: string;
  secure_url: string;
};

type GetRandomImageParams = {
  prefix: string;
};

/**
 * Allow get a random image from cloudinary
 * @param prefix - this allow filter the images from cloudinary by folder and name
 * @returns
 */
export default async function getRandomImage({ prefix }: GetRandomImageParams) {
  const { resources } = (await cloudinary.api.resources({
    type: "upload",
    prefix,
    max_results: 40,
  })) as { resources: CloudinaryResource[] };
  const randomIndex = getRandomNumber(0, resources.length - 1);
  return resources[randomIndex];
}
