"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ThemeController() {
  const { setTheme, theme } = useTheme();
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const isAnimatingRef = React.useRef(false);

  const handleThemeChange = (newTheme: string) => {
    // 防止动画重复触发
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    // 先获取切换按钮的中心位置
    if (!buttonRef.current) {
      setTheme(newTheme);
      isAnimatingRef.current = false;
      return;
    }

    const button = buttonRef.current;
    const buttonRect = button.getBoundingClientRect();
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;

    // 计算需要覆盖整个屏幕的半径
    const maxRadius =
      Math.max(
        Math.max(
          Math.hypot(buttonCenterX, buttonCenterY),
          Math.hypot(window.innerWidth - buttonCenterX, buttonCenterY)
        ),
        Math.max(
          Math.hypot(buttonCenterX, window.innerHeight - buttonCenterY),
          Math.hypot(
            window.innerWidth - buttonCenterX,
            window.innerHeight - buttonCenterY
          )
        )
      ) * 1.1; // 稍微增大半径确保完全覆盖

    // 获取当前主题状态
    const isDark = theme === "dark";
    const isChangingToDark = newTheme === "dark";

    if (isDark && !isChangingToDark) {
      // 暗色到浅色：白色小球扩张
      const circle = document.createElement("div");
      circle.style.position = "fixed";
      circle.style.top = `${buttonCenterY}px`;
      circle.style.left = `${buttonCenterX}px`;
      circle.style.borderRadius = "50%";
      circle.style.backgroundColor = "white";
      circle.style.width = "0";
      circle.style.height = "0";
      circle.style.transform = "translate(-50%, -50%)";
      circle.style.pointerEvents = "none";
      circle.style.zIndex = "-1";
      circle.style.transition = "width 0.5s ease-out, height 0.5s ease-out";

      document.body.appendChild(circle);

      // 强制重绘
      void circle.offsetWidth;

      // 扩张
      circle.style.width = `${maxRadius * 2}px`;
      circle.style.height = `${maxRadius * 2}px`;

      // 动画结束后更新主题并移除动画元素
      setTimeout(() => {
        setTheme(newTheme);
        setTimeout(() => {
          circle.remove();
          isAnimatingRef.current = false;
        }, 100);
      }, 450);
    } else if (!isDark && isChangingToDark) {
      // 浅色到暗色：白色覆盖全屏然后缩小

      // 创建动画元素
      const circle = document.createElement("div");
      circle.style.position = "fixed";
      circle.style.top = `${buttonCenterY}px`;
      circle.style.left = `${buttonCenterX}px`;
      circle.style.borderRadius = "50%";
      circle.style.backgroundColor = "white";
      circle.style.transform = "translate(-50%, -50%)";
      circle.style.pointerEvents = "none";
      circle.style.zIndex = "-1";

      // 设置初始大小（覆盖全屏）
      circle.style.width = `${maxRadius * 2}px`;
      circle.style.height = `${maxRadius * 2}px`;

      // 添加到DOM
      document.body.appendChild(circle);

      // 立即设置主题
      setTheme(newTheme);

      // 确保主题已设置并且元素已渲染，再设置过渡动画
      setTimeout(() => {
        // 添加过渡效果
        circle.style.transition = "width 0.5s ease-in, height 0.5s ease-in";

        // 强制重绘
        void circle.offsetWidth;

        // 缩小动画
        circle.style.width = "0";
        circle.style.height = "0";

        // 动画结束后移除元素
        setTimeout(() => {
          circle.remove();
          isAnimatingRef.current = false;
        }, 500);
      }, 50);
    } else {
      // 直接切换主题
      setTheme(newTheme);
      isAnimatingRef.current = false;
    }
  };

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      className="cursor-pointer"
      onClick={() => handleThemeChange(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
