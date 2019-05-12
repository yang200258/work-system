const state = {
    // 是否要缓存页面，默认不缓存
    cachePage: false,
    // 已经打开的页面
    openedPageList: [],
    // 缓存的页面
    cachedPageName: []
}

const mutations = {
    addTagNav(state, data) {
        console.log('路由data', data);
        if (state.openedPageList.some(v => v.path === data.path)) return
        if (state.cachedPageName.includes(data.name)) {
            console.error(`${data.name} 组件出现命名重复，请检查组件中的name字段。当前组件所在的路由地址为：${data.path}`)
            return
        }
        state.openedPageList.push(data)
        if (state.cachePage) {
            state.cachedPageName.push(data.name)
        }
    },
}


export default {
    namespaced: true,
    state,
    mutations
}