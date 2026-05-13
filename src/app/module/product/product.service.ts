import { z } from "zod";
import { prisma } from "../../lib/prisma";
import {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} from "../../config/cloudinary.config";
import { createProductSchema, updateProductSchema } from "./product.validation";

type CreateProductInput = z.infer<typeof createProductSchema>;
type UpdateProductInput = z.infer<typeof updateProductSchema>;

const uploadImages = async (files: Express.Multer.File[]): Promise<string[]> => {
  const urls = await Promise.all(
    files.map((file) =>
      uploadFileToCloudinary(file.buffer, file.originalname, {
        folder: "rajshahi-mango/products",
      }).then((res) => res.secure_url),
    ),
  );
  return urls;
};

const createProduct = async (
  data: CreateProductInput,
  files: Express.Multer.File[] = [],
) => {
  const images = files.length > 0 ? await uploadImages(files) : [];

  return prisma.product.create({
    data: {
      name: data.name,
      category: data.category,
      location: data.location,
      regularprice: data.regularprice,
      description: data.description ?? null,
      offerPrice: data.offerPrice ?? null,
      images,
    },
  });
};

const getAllProducts = async () => {
  return prisma.product.findMany({ orderBy: { createdAt: "desc" } });
};

const getProductById = async (id: string) => {
  return prisma.product.findUnique({ where: { id } });
};

const updateProduct = async (
  id: string,
  data: UpdateProductInput,
  files: Express.Multer.File[] = [],
) => {
  const existing = await prisma.product.findUnique({ where: { id } });

  const updateData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) updateData[key] = value;
  }

  if (files.length > 0) {
    if (existing?.images?.length) {
      await Promise.all(existing.images.map((url) => deleteFileFromCloudinary(url)));
    }
    updateData["images"] = await uploadImages(files);
  }

  return prisma.product.update({
    where: { id },
    data: updateData,
  });
};

const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (product?.images?.length) {
    await Promise.all(product.images.map((url) => deleteFileFromCloudinary(url)));
  }
  return prisma.product.delete({ where: { id } });
};

export const productService = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
