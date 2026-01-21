// src/utils/exiv2.ts
// 仅在客户端加载，避免服务端执行报错
'use client';

import type { Exiv2Module } from '@/types/exiv2-wasm';

// 缓存初始化后的模块，避免重复加载
let exiv2Module: any;

/**
 * 初始化 exiv2-wasm 模块（仅客户端运行）
 * @returns 初始化后的 exiv2 模块实例
 */
export async function initExiv2(): Promise<any> {
  // 缓存命中，直接返回
  if (exiv2Module) return exiv2Module;

  try {
    // Next.js public 目录映射到根路径，拼接 exiv2-wasm 基础路径
    const baseUrl = `${window.location.origin}/exiv2-wasm/dist/`;

    /**
     * 路径定位函数：确保 WASM 文件从 public 目录加载
     * @param path 文件路径
     * @returns 完整的静态资源路径
     */
    const locateFile = (path: string): string => {
      if (path.endsWith('.wasm')) {
        return `${baseUrl}${path}`;
      }
      return path;
    };

    // 1. 优先加载 ESM 版本（通过变量路径规避 Next.js 构建解析）
    try {
      const esmModuleUrl = `${baseUrl}exiv2.esm.js`;
      const m = await import(/* webpackIgnore: true */ esmModuleUrl);
      const factory = m?.default || m?.createExiv2Module;

      if (typeof factory === 'function') {
        exiv2Module = await factory({ locateFile })
        return exiv2Module;
      }
    } catch (e) {
      console.warn('ESM 版本加载失败，尝试 UMD 版本:', e);
    }

    // 2. 降级加载 UMD 版本（动态创建 script 标签）
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${baseUrl}exiv2.js`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => 
        reject(new Error(`UMD 版本加载失败: ${baseUrl}exiv2.js`));
      document.head.appendChild(script);
    });

    // 3. 从全局获取工厂函数并初始化
    if (typeof globalThis.createExiv2Module === 'function') {
      exiv2Module = await globalThis.createExiv2Module({ locateFile })
      return exiv2Module
    }

    throw new Error('exiv2-wasm 初始化失败：未找到有效的工厂函数');
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : '未知错误';
    console.error('exiv2 初始化错误:', errMsg);
    throw new Error(`exiv2 初始化失败：${errMsg}`);
  }
}