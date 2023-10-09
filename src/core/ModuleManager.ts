class ModuleManager {
    private isModule (module?: NodeModule): module is NodeModule {
        if (!module || !module.exports || !module.loaded) return false;
        return Object.prototype.toString.call(module.exports) === '[object Module]';
    }

    getModules(): NodeModule[] {
        const cache = Object.values(require.cache);
        const modules = cache.filter((m): m is NodeModule => this.isModule(m));
        return modules;
    }
}

export default ModuleManager;