import { z } from "zod";
import { prisma } from "../../lib/prisma";
import {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} from "../../config/cloudinary.config";
import {
  createHeroBannerSchema,
  updateHeroBannerSchema,
} from "./heroBanner.validation";

type CreateHeroBannerInput = z.infer<typeof createHeroBannerSchema>;
type UpdateHeroBannerInput = z.infer<typeof updateHeroBannerSchema>;

const uploadImages = async (files: Express.Multer.File[]): Promise<string[]> => {
  const uploads = files.map((file) =>
    uploadFileToCloudinary(file.buffer, file.originalname, {
      folder: "rajshahi-mango/hero-banners",
    }),
  );
  const results = await Promise.all(uploads);
  return results.map((r) => r.secure_url);
};

const createHeroBanner = async (
  data: CreateHeroBannerInput,
  files?: Express.Multer.File[],
) => {
  const images = files && files.length > 0 ? await uploadImages(files) : [];

  return prisma.heroBanner.create({
    data: {
      title: data.title,
      subtitle: data.subtitle ?? null,
      category: data.category ?? null,
      badgeText: data.badgeText ?? null,
      badgeDate: data.badgeDate ?? null,
      footerText: data.footerText ?? null,
      plateIndex: data.plateIndex ?? null,
      plateTotal: data.plateTotal ?? null,
      isActive: data.isActive ?? true,
      order: data.order ?? 0,
      images,
    },
  });
};

const getAllHeroBanners = async () => {
  return prisma.heroBanner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
};

const getHeroBannerById = async (id: string) => {
  return prisma.heroBanner.findUnique({ where: { id } });
};

const updateHeroBanner = async (
  id: string,
  data: UpdateHeroBannerInput,
  files?: Express.Multer.File[],
) => {
  const existing = await prisma.heroBanner.findUnique({ where: { id } });
  if (!existing) return null;

  const { removeImages, ...rest } = data;

  const updateData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined) updateData[key] = value;
  }

  let images = existing.images;

  if (removeImages && removeImages.length > 0) {
    await Promise.all(removeImages.map((url) => deleteFileFromCloudinary(url)));
    images = images.filter((url) => !removeImages.includes(url));
  }

  if (files && files.length > 0) {
    const uploaded = await uploadImages(files);
    images = [...images, ...uploaded];
  }

  if (removeImages || (files && files.length > 0)) {
    updateData["images"] = images;
  }

  return prisma.heroBanner.update({
    where: { id },
    data: updateData,
  });
};

const deleteHeroBanner = async (id: string) => {
  const banner = await prisma.heroBanner.findUnique({ where: { id } });
  if (banner && banner.images.length > 0) {
    await Promise.all(banner.images.map((url) => deleteFileFromCloudinary(url)));
  }
  return prisma.heroBanner.delete({ where: { id } });
};

export const heroBannerService = {
  createHeroBanner,
  getAllHeroBanners,
  getHeroBannerById,
  updateHeroBanner,
  deleteHeroBanner,
};
