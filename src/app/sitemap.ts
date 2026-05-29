import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // We use a relative path here, or hardcode a fallback if BASE_URL isn't set.
  // When you have a final domain, you should replace this base URL.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://luxeconfectionery.com'

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/track`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ]
}
