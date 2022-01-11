// simple define
// api:
//  define(deps: string[], completeCallback(require, exports, ...deps))
//      dep: deps[0] = 'require', deps[1] = 'exports'
//          0. if dep = require, return
//          0.1 if dep = exports, return
//          1. if dep start with '/' | 'http(s):// goto 3
//          2.1 if dep start with './' set dep is context.base + dep.substring(2), goto 1
//          2.2 set dep is context.base + dep, goto 1
//          3. if already load, goto end
//          4. try load dep + '.js'
//          4.1. if load success goto end
//          5. try load dep + '/index.js'
//          5.1. if load success goto end
//          6. throw LoadError(dep is not found)
//          end
//      completeCallback:
//          require: to load module
//          exports: to export property
//          deps: the module dep

// 存在问题:
//  1. 循环引用不能解决
//  2. 引用必须先声明在使用

type Exports<Module> = Partial<Module>;
type Require = (id: string) => any;
type DefineFn<Deps extends any[], Module> = (require: Require, exports: Exports<Module>, ...args: Deps) => void

// 模块加载的缓存
const moduleCache: Record<string, any | Promise<any> | undefined> = {};
const contextCache: Record<string, DefineContext<any, any> | undefined> = {};

// same file should be same context
interface DefineContext<Deps extends any[], Module> {
  id: string;
  base: string;
  deps: string[];
  factory: DefineFn<Deps, Module>;
}

//region helper
function loadScript(path: string) {
  return new Promise<void>((resolve, reject) => {
    console.log("load file: (" + path + ") start");
    const script = document.createElement("script");
    script.onload = function () {
      console.log("load path: (" + path + ") complete");
      resolve();
    };
    script.onerror = function (error) {
      console.log("load path: (" + path + ") error", error);
      reject(error);
    };
    script.async = true;
    script.src = path;
    document.head.appendChild(script);
  });
}

function isPromise(maybePromise: any): maybePromise is Promise<any> {
  return typeof maybePromise.then === "function";
}

function getDir(src: string): string {
  return src.substring(0, src.lastIndexOf("/"));
}

//endregion

class Module<Deps extends any[], Module> {
  context: DefineContext<Deps, Module>;
  exports: Module = {} as any;
  loadCache: Record<string, string | undefined> = {};

  constructor(context: DefineContext<Deps, Module>, parent: DefineContext<Deps, Module> | null) {
    this.context = context;
  }

  normalPath(path: string | string[]): string | string[] {
    if (path instanceof Array) {
      return path.map(cp => this.normalPath(cp) as string);
    }
    if (
      path.startsWith("/") ||
      path.startsWith("http://") ||
      path.startsWith("https://")) {
      return path;
    }
    if (path.startsWith("./")) {
      return this.context.base + "/" + path.substring(2);
    }
    return this.context.base + "/" + path;
  }

  load(): Promise<void> | void {
    let moduleResolve: (m: Module) => void, moduleReject: VoidFunction;
    moduleCache[this.context.id] = new Promise<Module>((resolve, reject) => {
      moduleResolve = resolve;
      moduleReject = reject;
    });
    const promises: Promise<any>[] = [];
    for (const dep of this.context.deps) {
      const loadDepR = this.loadDep((dep));
      if (loadDepR && isPromise(loadDepR)) {
        promises.push(loadDepR);
      }
    }
    if (promises.length !== 0) {
      return Promise.all(promises).then(
        () => this.context.factory(
          this.loadDep.bind(this),
          this.exports,
          ...(this.context.deps.slice(2).map(dep => moduleCache[this.loadCache[dep]!])) as Deps,
        ),
      ).then(() => {
        moduleResolve(this.exports);
        moduleCache[this.context.id] = this.exports;
      });
    } else {
      this.context.factory(
        this.loadDep.bind(this),
        this.exports,
        ...(this.context.deps.slice(2).map(dep => moduleCache[this.normalPath(dep) as string])) as Deps);
      moduleCache[this.context.id] = this.exports;
    }
  }

  loadDep(dep: string): Promise<void> | void {
    if (dep === "require") {
      return;
    } else if (dep === "exports") {
      return;
    }
    const normalPath = this.normalPath(dep);
    return this.tryRequire(normalPath);
  }

  tryRequire(mod: string | string[]): Promise<any> | any {
    if (mod instanceof Array) {
      return mod.map(cm => this.tryRequire(cm));
    }
    // 已经加载
    if (this.loadCache[mod]) {
      return moduleCache[this.loadCache[mod]!];
    }
    const jsPath = mod + ".js";
    if (moduleCache[jsPath]) {
      return moduleCache[jsPath];
    }
    // cur + '.js'
    // cur + '/index.js'
    return loadScript(jsPath)
      .then(() => {
          this.loadCache[mod] = jsPath;
          // module start load
          return moduleCache[jsPath];
        },
        () => {
          const dirPath = mod + "/index.js";
          if (moduleCache[dirPath]) {
            return moduleCache[dirPath];
          }
          return loadScript(dirPath)
            .then(
              () => {
                this.loadCache[mod] = dirPath;
                // module start load
                return moduleCache[dirPath];
              },
              () => {
                throw new Error(mod + " not found");
              },
            );
        },
      );
  }
}

function define<Deps extends any[], Module>(deps: string[], defineFn: DefineFn<Deps, Module>): void {
  const curScriptElement = document.currentScript as HTMLScriptElement;
  const src = curScriptElement.src;
  const dir = getDir(src);
  contextCache[src] = { deps, factory: defineFn, base: dir, id: curScriptElement.src };
  new Module(contextCache[src]!, null).load();
}

function require(entry: string) {
  define([entry], () => {})
}

define.amd = true;

(window as any).define = define;
(window as any).require = require;
