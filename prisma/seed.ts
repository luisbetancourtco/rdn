import { PrismaClient } from "@prisma/client";
import structure from "../tacticomd_structure.json";

const prisma = new PrismaClient();

// Decode HTML entities (&#8211; → –, &#038; → &, etc.)
function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

async function main() {
  console.log("Seeding TácticoMD courses…");

  for (const course of structure.courses) {
    // Upsert course preserving original LearnDash ID
    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        slug: course.slug,
        title: decodeEntities(course.title),
        description: null,
        isRequired: course.is_required ?? false,
        unlocksAfter: course.unlocks_after ?? null,
        order: course.order,
        status: "publicado",
      },
      create: {
        id: course.id,
        slug: course.slug,
        title: decodeEntities(course.title),
        isRequired: course.is_required ?? false,
        unlocksAfter: course.unlocks_after ?? null,
        order: course.order,
        status: "publicado",
      },
    });

    for (const mod of course.modules) {
      // Deterministic module ID: courseId * 100 + module order
      // e.g. course 25006, module order 1 → 2500601
      const moduleId = course.id * 100 + mod.order;

      await prisma.courseModule.upsert({
        where: { id: moduleId },
        update: {
          courseId: course.id,
          slug: mod.slug,
          title: decodeEntities(mod.title),
          order: mod.order,
        },
        create: {
          id: moduleId,
          courseId: course.id,
          slug: mod.slug,
          title: decodeEntities(mod.title),
          order: mod.order,
        },
      });

      for (let i = 0; i < mod.topics.length; i++) {
        const topic = mod.topics[i];

        // Preserve original LearnDash topic ID
        await prisma.topic.upsert({
          where: { id: topic.id },
          update: {
            moduleId: moduleId,
            title: decodeEntities(topic.title),
            description: topic.description ?? null,
            videoUrl: topic.video_url ?? null,
            videoProvider: topic.video_provider ?? null,
            order: i + 1,
          },
          create: {
            id: topic.id,
            moduleId: moduleId,
            title: decodeEntities(topic.title),
            description: topic.description ?? null,
            videoUrl: topic.video_url ?? null,
            videoProvider: topic.video_provider ?? null,
            order: i + 1,
          },
        });
      }

      console.log(
        `  ✓ ${decodeEntities(course.title)} → ${decodeEntities(mod.title)} (${mod.topics.length} topics)`
      );
    }
  }

  console.log("\nDone! Seeded courses with original LearnDash IDs.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
