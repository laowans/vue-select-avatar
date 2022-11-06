import selectAvatars from './dist/avatar.umd.min'
import './dist/avatar.css'

function _fn(config = {
    returnType:undefined,
    nightMode:undefined,
    title:undefined,
    maskLayer:undefined,
    beforeClose:undefined,
    cancelButtonText:undefined,
    confirmButtonText:undefined,
    zoomRatio:undefined,
    accept:undefined,
    maxKB:undefined,
    edgeLine:undefined,
    edgeLineOpacity:undefined,
    themeColor:undefined,
}){
    const _keys = Object.keys(config)

    for (let i = 0; i < _keys.length; i++) {
        if(config[_keys[i]] === undefined) delete config[_keys[i]]
    }

    return selectAvatars({...config})
}

export default _fn