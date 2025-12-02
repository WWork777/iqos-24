"use client";
import { useEffect } from "react";

// Расширяем Window interface для Яндекс.Метрики
declare global {
  interface Window {
    ym: YmFunction;
  }
}

interface YmFunction {
  (counterId: number, method: string, ...params: any[]): void;
  a?: any[][];
  l?: number;
}

export default function YandexMetrika() {
  useEffect(() => {
    // Добавляем скрипт Яндекс.Метрики
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://mc.yandex.ru/metrika/tag.js";

    const firstScript = document.getElementsByTagName("script")[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    // Инициализируем счетчик после загрузки скрипта
    script.onload = () => {
      if (window.ym) {
        window.ym(105191074, "init", {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
        });
      }
    };

    // Объявляем ym функцию для отложенной инициализации
    if (!window.ym) {
      window.ym = function (...args: any[]) {
        (window.ym.a = window.ym.a || []).push(args);
      } as YmFunction;
    }
    window.ym.l = new Date().getTime();
  }, []);

  return (
    <noscript>
      <div>
        <img
          src="https://mc.yandex.ru/watch/105191074"
          style={{ position: "absolute", left: "-9999px" }}
          alt="Yandex Metrika"
        />
      </div>
    </noscript>
  );
}
