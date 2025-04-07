import * as motion from "motion/react-client";

export default function AboutPage() {
  const bioEnglish =
    "Hello! I'm a developer, and creative thinker passionate about sharing ideas and exploring new concepts.";
  const bioEnglishSplit = bioEnglish.split(" ");
  const bio =
    "你好,我是一名开发者与创意思考者。​​热爱用代码构建想法,也享受分享技术见解与灵感碰撞。这里记录我的技术探索、项目思考，以及偶尔的奇思妙想。";

  return (
    <div className="container mx-auto flex flex-col gap-4 px-4 py-8 justify-center min-h-[70vh]">
      <motion.h1
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.3,
        }}
        className="text-4xl font-bold"
      >
        About Me
      </motion.h1>
      <div>
        {bioEnglishSplit.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              ease: "easeInOut",
            }}
            className="mr-1 inline-block"
          >
            {word}
          </motion.span>
        ))}
      </div>
      <div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            delay: bioEnglishSplit.length * 0.1,
          }}
          className="inline-block"
        >
          {bio}
        </motion.p>
      </div>
    </div>
  );
}
