import { z, defineCollection } from "astro:content";
import configData from "@util/themeConfig";
import { sheetLoad } from "@lib/loaders/sheets";
import { mockLoader } from "@ascorbic/mock-loader";
import { glob } from 'astro/loaders';

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
    google: z.string().url().optional(),
    phone: z.string().url().optional(),
    dearbornphone: z.string().url().optional(),
    heightsphone: z.string().url().optional(),
    eastphone: z.string().url().optional(),
    westphone: z.string().url().optional(),
    location: z.string().url().optional(),
    dearbornlocation: z.string().url().optional(),
    heightslocation: z.string().url().optional(),
    eastlocation: z.string().url().optional(),
    westlocation: z.string().url().optional(),
    storefront: z.string().url().optional(),
    truck: z.string().url().optional(),
    storefrontphone: z.string().url().optional(),
    truckphone: z.string().url().optional(),
    featured: z.boolean().default(false),
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