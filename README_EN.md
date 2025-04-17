# Notion-Powered Static Blog

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-000000?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## Features

- Zero-cost content management based on Notion
- Automatic incremental static regeneration (ISR)
- Dark mode support
- Responsive design
- Minimalist style
- Built-in SEO optimization

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Data Layer**: Notion API
- **Styling**: Tailwind CSS
- **Icons**: Lucide
- **Component Library**: Shadcn UI
- **Animation**: Tailwindcss-Animate

## Deployment

1. Copy the [template database](https://zephyrrr.notion.site/1be1f833110780d98383fc637676cee8?v=1be1f833110780839e62000c8c92f8e3&pvs=4)
2. Modify the database permissions to public

3. Get the Notion database ID:

   - Copy the part before `?v=` in the URL (e.g., `1be1f833110780d98383fc637676cee8`)

4. Configure the environment variables or directly modify `blog.config.ts`

   ```typescript
   NOTION_PAGE_ID=your database ID

   // blog.config.ts
   NOTION_PAGE_ID:
      process.env.NOTION_PAGE_ID || "modify to your database ID",
   ```

5. Recommend using Vercel to deploy, simple and convenient

   - Fork this project
   - Register a Vercel account
   - Connect your GitHub account
   - Click the `New` button and select `Import Git Repository`
   - Configure the environment variable `NOTION_PAGE_ID`
   - Select your project and click the `Deploy` button
   - Wait for the deployment to complete

6. You can also use Docker to deploy, the `Dockerfile` is provided

   - Note that if you use environment variables, it is recommended to create a `.env` file after building the image, otherwise the environment variable cannot be obtained during the build
   - Example docker-compose.yml file:

     ```yaml
     version: "3"

     services:
     blog:
       build:
         context: .
       ports:
         - 3000:3000
     ```

## Configuration

You can directly configure most of the settings in Notion, except for `NOTION_PAGE_ID` and `NEXT_REVALIDATE_SECONDS` which need to be manually configured

## Thanks

Thanks to the following projects:

- [Shiro](https://github.com/Innei/Shiro)
- [Notion Next](https://github.com/tangly1024/NotionNext)
