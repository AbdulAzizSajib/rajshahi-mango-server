import { z } from "zod";
import { prisma } from "../../lib/prisma";
import {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} from "../../config/cloudinary.config";
import { createProductSchema, updateProductSchema } from "./product.validation";

type CreateProductInput = z.infer<typeof createProductSchema>;
type UpdateProductInput = z.infer<typeof updateProductSchema>;

const createProduct = async (
  data: CreateProductInput,
  file?: Express.Multer.File,
) => {
  let image: string | null = null;

  if (file) {
    const uploaded = await uploadFileToCloudinary(file.buffer, file.originalname, {
      folder: "rajshahi-mango/products",
    });
    image = uploaded.secure_url;
  }

  return prisma.product.create({
    data: {
      name: data.name,
      category: data.category,
      location: data.location,
      regularprice: data.regularprice,
      description: data.description ?? null,
      offerPrice: data.offerPrice ?? null,
      image,
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
  file?: Express.Multer.File,
) => {
  const existing = await prisma.product.findUnique({ where: { id } });

  const updateData: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) updateData[key] = value;
  }

  if (file) {
    if (existing?.image) {
      await deleteFileFromCloudinary(existing.image);
    }
    const uploaded = await uploadFileToCloudinary(file.buffer, file.originalname, {
      folder: "rajshahi-mango/products",
    });
    updateData["image"] = uploaded.secure_url;
  }

  return prisma.product.update({
    where: { id },
    data: updateData,
  });
};

const deleteProduct = async (id: string) => {
  const product = await prisma.product.findUnique({ where: { id } });
  if (product?.image) {
    await deleteFileFromCloudinary(product.image);
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
