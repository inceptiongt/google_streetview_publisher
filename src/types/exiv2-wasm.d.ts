// src/types/exiv2-wasm.d.ts
declare module '*exiv2.esm.js' {
  /** exiv2-wasm 工厂函数类型 */
  export function createExiv2Module(options?: {
    locateFile?: (path: string) => string;
  }): Promise<Exiv2Module>;
  export default createExiv2Module;
}

declare module '*exiv2.js' {
  // UMD 版本会挂载到 globalThis，这里声明全局类型
}

/** 扩展 globalThis 类型，适配 UMD 版本 */
declare global {
  interface Window {
    createExiv2Module?: (options?: {
      locateFile?: (path: string) => string;
    }) => Promise<Exiv2Module>;
  }
  var createExiv2Module: (typeof window)['createExiv2Module'];
}

/** Exiv2 模块核心类型（根据实际 API 补充） */
interface Exiv2Module {
  /** 读取图片元数据的方法（根据实际 exiv2-wasm API 调整） */
  // readMetadata: (data: Uint8Array) => Record<string, any>;
  // 可根据 exiv2-wasm 实际提供的 API 补充其他方法类型
}

// 导出核心类型，方便业务代码使用
export type { Exiv2Module };