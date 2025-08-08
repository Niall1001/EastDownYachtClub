import { prisma } from './prisma';

export const generateSlug = async (title: string): Promise<string> => {
  // Convert to lowercase and replace spaces with hyphens
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric chars with hyphens
    .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens

  // Ensure slug isn't empty
  if (!baseSlug) {
    baseSlug = 'story';
  }

  let slug = baseSlug;
  let counter = 1;

  // Check if slug exists and increment counter if needed
  while (true) {
    const existingStory = await prisma.stories.findUnique({
      where: { slug }
    });

    if (!existingStory) {
      break;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};