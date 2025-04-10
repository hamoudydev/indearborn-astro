import { z, defineCollection } from "astro:content";
import configData from "@util/themeConfig";
import { sheetLoad } from "@lib/loaders/sheets";
import { mockLoader } from "@ascorbic/mock-loader";
import { glob } from 'astro/loaders';

// Define hours schema
const hoursSchema = z.object({
  sunday: z.string().optional(),
  monday: z.string().optional(),
  tuesday: z.string().optional(),
  wednesday: z.string().optional(),
  thursday: z.string().optional(),
  friday: z.string().optional(),
  saturday: z.string().optional(),
}).optional();

const directorySchema = (imageSchema: z.ZodTypeAny) =>
  z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    icon: z.string().optional(),
    image: imageSchema.optional(),
    link: z.string().url().optional(),
    instagram: z.string().url().optional(),
    facebook: z.string().url().optional(),
    youtube: z.string().url().optional(),
    tiktok: z.string().url().optional(),
    doordash: z.string().url().optional(),
    ubereats: z.string().url().optional(),
    textorder: z.string().url().optional(),
    orderonline: z.string().url().optional(),
    phone: z.string().url().optional(),
    apple: z.string().url().optional(),
    google: z.string().url().optional(),
    featured: z.boolean().default(false),
    hours: hoursSchema, // Add hours schema
  });

let directory;
const source = configData.directory.data.source;
if (source === 'sheets') {
  directory = defineCollection({
    loader: sheetLoad(),
    schema: directorySchema(z.string().url())
  });
}
else if (source === 'mock') {
  directory = defineCollection({
    loader: mockLoader({schema: directorySchema(z.string().url()), entryCount: 10},),
    schema: directorySchema(z.string().url())
  });
}
else {
  directory = defineCollection({
    loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/data/directory" }),
    schema: ({ image }) => directorySchema(image())
  });
}

const pages = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/data/pages" }),
  schema: z.object({
    title: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/data/blog" }),
  schema: z.object({
    title: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  directory,
  pages,
  blog,
};