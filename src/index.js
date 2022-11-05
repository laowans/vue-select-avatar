import Vue from "vue"
import selectAvatar from './index.vue'

let selectAvatarConstructor = Vue.extend(selectAvatar); // 创建构造组件实例

const selectAvatars = ({
    returnType = 'base64', // 返回的数据格式(base64 | file)
    nightMode = false, // 是否为夜间模式
    title = '选择头像', // 标题
    maskLayer = true, // 是否出现遮罩层
    beforeClose = null, // 点击遮罩层和右上角叉的回调函数，关闭前调用这个函数，并传入一个函数形参。需调用传入的函数才可关闭窗口
    cancelButtonText = '取消', // 确定按钮文本
    confirmButtonText = '确定', // 取消按钮文本
    zoomRatio = 6, // 最大放大倍数
    accept = ['jpg', 'jpeg', 'png'], // 文件格式
    maxKB = 2048, // 文件最大KB值
    edgeLine = false, // 是否展示边缘线
    themeColor = '#40a1ff', // 主题色
} = {}) =>{
    // 验证参数
    if(returnType !== 'base64' && returnType !== 'file') throw new Error('Parameter error: "returnType" should be a string and the value should be "base64" or "file"')
    if(typeof nightMode !== 'boolean') throw new Error('Parameter error: "nightMode" should be boolean')
    if(typeof title !== 'string') throw new Error('Parameter error: "title" should be string')
    if(typeof maskLayer !== 'boolean') throw new Error('Parameter error: "maskLayer" should be boolean')
    if(!(beforeClose instanceof Function) && typeof beforeClose === null) throw new Error('Parameter error: "beforeClose" should be Function')
    if(typeof cancelButtonText !== 'string') throw new Error('Parameter error: "cancelButtonText" should be string')
    if(typeof confirmButtonText !== 'string') throw new Error('Parameter error: "confirmButtonText" should be string')
    if(typeof zoomRatio !== 'number') throw new Error('Parameter error: "zoomRatio" should be number')
    if(!(accept instanceof Array)) throw new Error('Parameter error: "accept" should be Array')
    if(!accept.every(a=>typeof a === 'string')) throw new Error('Parameter error: each item of "accept" should be a string')
    if(typeof maxKB !== 'number') throw new Error('Parameter error: "maxKB" should be number')
    if(typeof edgeLine !== 'boolean') throw new Error('Parameter error: "edgeLine" should be boolean')
    if(typeof themeColor !== 'string' || !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(themeColor)) throw new Error('Parameter error: "themeColor" should be a hexadecimal color code')

    return new Promise((resolve, reject)=>{
        const fileInput = document.createElement('input') // 创建input元素
        fileInput.type = 'file' // 设置元素的类型
        fileInput.accept = accept.map(a=>'.'+a).join(', ')
        fileInput.click() // 执行元素的点击事件
        fileInput.oninput = (event)=>{
            const FileList = event.target.files
            if(FileList){
                const reader = new FileReader();
                reader.readAsDataURL(FileList[0]); // 转base64
                reader.onload = ()=>{
                    const base64 = reader.result
                    try{
                        // 验证图片的格式
                        let fileName =  base64.replace(/data:image\/([^;]+).*/i,'$1') // 匹配文件格式
                        if(fileName === 'svg+xml') fileName = 'svg'
                        if(accept.indexOf(fileName) === -1) throw new Error('Picture format error') // 图片格式错误

                        // 验证图片大小
                        const base64n = base64.replace(/^data:image\/\w+;base64,/, "") //去掉图片base64码前面部分data:image/png;base64
                        let fileSize = base64n.length - (base64n.length / 8) * 2 // 获取字节数byte
                        fileSize = fileSize / 1024 // 获取KB数
                        if(Math.floor(fileSize) > maxKB) throw new Error('Picture is too large') // 图片过大

                        // 是否为移动端
                        const isPhone = /mobile/i.test(navigator.userAgent)
                        
                        // 创建组件实例
                        const instance = new selectAvatarConstructor({
                            data:{
                                returnType,
                                base64,
                                nightMode,
                                title,
                                maskLayer,
                                beforeClose,
                                cancelButtonText,
                                confirmButtonText,
                                zoomRatio,
                                isPhone,
                                edgeLine,
                                resolve,
                                reject,
                            },
                        })
                        document.body.appendChild(instance.$mount().$el) // 挂载并添加到页面上
                    }
                    catch(err){
                        reject(err)
                    }
                };
            }
        }
    })
}

// 导出
export default selectAvatars