<template>
    <div id="selectAvatarBox">
        <div class="maskLayer" ref="maskLayer" @click="Bclose"></div>
        <div id="selectAvatar" ref="selectAvatar" :class="{ ye:nightMode, phone:isPhone }" :style="colorStr">
            <svg t="1666582617718"  @click="Bclose" title="点击关闭" class="icon selectAvatar-box__close" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3359" width="200" height="200"><path d="M1007.603202 929.818395L592.684241 514.699473 1007.603202 99.780512c10.797891-10.797891 16.196837-24.795157 16.196837-38.992385 0-13.997266-5.398946-28.194493-16.196837-38.992384-21.595782-21.595782-56.388987-21.595782-77.984768 0L514.699473 436.914665 99.780512 21.795743C78.18473 0.199961 43.391525 0.199961 21.795743 21.795743s-21.595782 56.388987 0 77.984769l415.118922 414.918961L21.795743 929.818395c-21.595782 21.595782-21.595782 56.388987 0 77.984768s56.388987 21.595782 77.984769 0l414.918961-415.118922L929.818395 1007.603202c10.797891 10.797891 24.795157 16.196837 38.992384 16.196837 13.997266 0 28.194493-5.398946 38.992384-16.196837 21.395821-21.395821 21.395821-56.388987-0.199961-77.784807z" p-id="3360"></path></svg>
            <div id="AvatarTitle">{{title}}</div>
            <div id="AvatarBox">
                <div id="left"></div>
                <div id="right"></div>
                <img :src="base64" id="img" ref="img" :style="`width: ${width}px; height: ${height}px; top: ${img_y}px; left: ${img_x}px;`">
                <template v-if="edgeLine">
                    <div id="edgeLine" :style="edgeLineOpacityStr" class="_top"></div>
                    <div id="edgeLine" :style="edgeLineOpacityStr" class="_right"></div>
                    <div id="edgeLine" :style="edgeLineOpacityStr" class="_bottom"></div>
                    <div id="edgeLine" :style="edgeLineOpacityStr" class="_left"></div>
                </template>
            </div>
            <div id="buttonBox">
                <div onselectstart="return false">
                    <button v-if="isPhone" class="AvatarBut phoneBut" @touchstart.prevent="continuousZoom(1, $event)">+</button>
                    <button v-if="isPhone" class="AvatarBut phoneBut" @touchstart.prevent="continuousZoom(0, $event)">-</button>
                </div>
                <div>
                    <button class="AvatarBut" @click="close">{{cancelButtonText}}</button>
                    <button class="AvatarBut primary" @click="confirm">{{confirmButtonText}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:'selectAvatar',
    data(){
        return {
            y_img_width: 0, // 图片原始宽度
            y_img_height: 0, // 图片原始高度
            img_width: 0, // 图片处理后的宽度
            img_height: 0, // 图片处理后的高度
            img_ZoomRatio: 0, // 图片缩放比例（基于300）
            img_x: 0, // 图片 x 轴坐标
            img_y: 0, // 图片 Y 轴坐标
            drag: false, // 图片是否处于移动中
            colorStr: '', // 颜色变量
            edgeLineOpacityStr: '',
        }
    },
    mounted(){
        // 根据主题色计算不同深浅的颜色
        let colorStr = `--theme-color: rgb(${this.RGB[0]}, ${this.RGB[1]}, ${this.RGB[2]});`
        colorStr += `--theme-color-90: rgba(${this.RGB[0]} ${this.RGB[1]} ${this.RGB[2]} / 90% );`
        colorStr += `--theme-color-75: rgba(${this.RGB[0]} ${this.RGB[1]} ${this.RGB[2]} / 75% );`
        colorStr += `--theme-color-50: rgba(${this.RGB[0]} ${this.RGB[1]} ${this.RGB[2]} / 50% );`
        colorStr += `--theme-color-20: rgba(${this.RGB[0]} ${this.RGB[1]} ${this.RGB[2]} / 20% );`
        colorStr += `--theme-color-10: rgba(${this.RGB[0]} ${this.RGB[1]} ${this.RGB[2]} / 10% );`
        this.colorStr = colorStr

        this.edgeLineOpacityStr = `opacity: ${this.edgeLineOpacity};`

        setTimeout(() => {
            if(this.maskLayer){
                this.$refs.maskLayer.classList.add('active')
            }
            this.$refs.selectAvatar.classList.add('active')
        }, 10);

        const img = new Image();
        img.src = this.base64;
        img.onload = ()=>{
            this.y_img_width = img.width
            this.y_img_height = img.height

            let minObj = { // 小的值对象
                value:null,
                name:null,
            }
            let maxObj = { // 大的值对象
                value:null,
                name:null,
            }

            // 找出宽高的大值和小值
            if(this.y_img_width > this.y_img_height){
                minObj.value = this.y_img_height
                minObj.name = 'height'

                maxObj.value = this.y_img_width
                maxObj.name = 'width'
            }else{
                minObj.value = this.y_img_width
                minObj.name = 'width'
                
                maxObj.value = this.y_img_height
                maxObj.name = 'height'
            }

            // 计算缩放比
            let proportion = 300 / minObj.value
            
            // 初始宽高赋值
            this[`img_${minObj.name}`] = 300
            this[`img_${maxObj.name}`] = Math.floor(maxObj.value * proportion) // 根据缩放比计算宽高之间大的值的长度
            
            this.$refs.img.width = this.img_width
            this.$refs.img.height = this.img_height

            // 计算图片初始 x，y 轴
            if(minObj.name === 'height'){
                if(this.isPhone){
                    this.img_x = (340 - this.img_width) / 2
                    this.img_y = 40
                }else{
                    this.img_x = (420 - this.img_width) / 2
                    this.img_y = 80
                }
            }else{
                if(this.isPhone){
                    this.img_x = 20
                    this.img_y = (380 - this.img_height) / 2
                }else{
                    this.img_x = 60
                    this.img_y = (460 - this.img_height) / 2
                }
            }

            this.addEvent()
        };
    },
    beforeDestroy(){
        document.removeEventListener('touchstart', this.touchstartCallback)
    },
    methods:{
        Bclose(){ // 当 beforeClose 为函数时，关闭前调用这个函数，并传入一个函数形参。需调用传入的函数才可关闭窗口
            if(this.beforeClose && this.beforeClose instanceof Function){
                this.beforeClose(this.close)
            }else{
                this.close()
            }
        },
        close(){ // 关闭窗口方法
            this.$refs.maskLayer.classList.remove('active')
            this.$refs.selectAvatar.classList.remove('active')
            setTimeout(()=>{
                this.$destroy(true) // 销毁组件
                this.$el.parentNode.removeChild(this.$el) // 从页面删除组件
            },500)
        },
        addEvent(){ // 绑定事件方法
            if(!this.isPhone){
                this.$refs.img.addEventListener('wheel', this.wheelCallback)
            }

            if(this.isPhone){
                // 手指触摸
                this.$refs.img.addEventListener('touchstart', (event)=>{
                    event = event || window.event  // 兼容处理
                    event.preventDefault()

                    this.$refs.img.classList.add('cursor-grab')
                    this.drag = true

                    // 存储移动前的手指和图片的 x，y 轴数据
                    let startX = event.targetTouches[0].pageX
                    let startY = event.targetTouches[0].pageY
                    let x = this.img_x
                    let y = this.img_y

                    // 手指按住移动
                    const touchmoveCallback =  event =>{
                        if(event.targetTouches.length === 1){
                            event.preventDefault()
                            //  计算手指的移动距离：手指移动之后的坐标减去手指初始的坐标
                            const moveX = event.targetTouches[0].pageX - startX;
                            const moveY = event.targetTouches[0].pageY - startY;

                            // 计算偏移量
                            this.img_x = moveX + x
                            this.img_y = moveY + y
                        }
                    }
                    this.$refs.img.addEventListener('touchmove', touchmoveCallback);

                    // 手指离开
                    const touchendCallback = ()=>{
                        this.$refs.img.removeEventListener('touchmove', touchmoveCallback)
                        this.$refs.img.removeEventListener('touchend',touchendCallback)
                        this.$refs.img.classList.remove('cursor-grab')
                        this.drag = false
                    }
                    this.$refs.img.addEventListener('touchend',touchendCallback)
                })
            }else{
                this.$refs.img.onmousedown = event => { // 鼠标按下
                    event = event || window.event  // 兼容处理
                    event.preventDefault()
                    this.$refs.img.classList.add('cursor-grab')
                    this.drag = true
                
                    // 存储移动前的鼠标和图片的 x，y 轴数据
                    let startX = event.clientX
                    let startY = event.clientY
                    let x = this.$refs.img.offsetLeft
                    let y = this.$refs.img.offsetTop
                
                    this.c_onmousemove = event => {  // 鼠标移动
                        // 计算偏移量
                        this.img_x = (event.clientX - startX) + x
                        this.img_y = (event.clientY - startY) + y
                    }
                    document.addEventListener('mousemove', this.c_onmousemove)
                    
                    this.c_onmouseup = () => {  // 鼠标抬起
                        document.removeEventListener('mousemove', this.c_onmousemove)
                        document.removeEventListener('mouseup', this.c_onmouseup)
                        this.$refs.img.classList.remove('cursor-grab')
                        this.drag = false
                    }
                    document.addEventListener('mouseup', this.c_onmouseup)
                }
            }
        },
        wheelCallback(event){ // 鼠标滚动事件回调
            event = event || window.event; // 兼容处理

            event.preventDefault()

            // 存储原始宽高
            const width = this.width
            const height = this.height

            if(this.img_ZoomRatio < 0 || this.img_ZoomRatio > this.zoomRatio) return // 限制缩放比例
            
            if(event.deltaY < 0){
                this.img_ZoomRatio += 0.04 // 放大
            }else{
                this.img_ZoomRatio -= 0.04 // 缩小
            }

            // 防止超出或低于规定的缩放比例
            if(this.img_ZoomRatio < 0){
                this.img_ZoomRatio = 0
            }else if(this.img_ZoomRatio > this.zoomRatio){
                this.img_ZoomRatio = this.zoomRatio
            }

            // 获取鼠标位于图片的位置
            const offsetX = event.offsetX
            const offsetY = event.offsetY

            // 计算偏移量
            let x = (this.width - width) * (offsetX / width)
            let y = (this.height - height) * (offsetY / height)

            // 减去并存储偏移量
            this.img_x -= Math.round(x * 10) / 10
            this.img_y -= Math.round(y * 10) / 10

            // 调用矫正函数
            this.correct()
        },
        correct(){ // 图片矫正函数(保证图片在正确的位置上)
            clearTimeout(this.correctTimer) // 防抖
            if(this.drag) return
            this.correctTimer = setTimeout(() => {
                this.$refs.img.classList.add('transition01')

                if(this.isPhone){
                    if(this.img_x > 20){ // 上
                        this.img_x = 20
                    }
                    if(this.img_y > 40){ // 左
                        this.img_y = 40
                    }
                    if(this.width + this.img_x < 320){ // 右
                        this.img_x = this.img_x + (320 - (this.width + this.img_x))
                    }
                    if(this.height + this.img_y < 340){ // 下
                        this.img_y = this.img_y + (340 - (this.height + this.img_y))
                    }
                }else{
                    if(this.img_x > 60){ // 上
                        this.img_x = 60
                    }
                    if(this.img_y > 80){ // 左
                        this.img_y = 80
                    }
                    if(this.width + this.img_x < 360){ // 右
                        this.img_x = this.img_x + (360 - (this.width + this.img_x))
                    }
                    if(this.height + this.img_y < 380){ // 下
                        this.img_y = this.img_y + (380 - (this.height + this.img_y))
                    }
                }

                setTimeout(() => {
                    this.$refs.img.classList.remove('transition01')
                }, 100);
            }, 200);
        },
        confirm(){ // 确定按钮回调
            let x, y, l
            let zoomRatio = this.width / this.y_img_width  // 计算缩放比例

            if(this.isPhone){ // 移动端
                x = Math.abs(Math.abs((20 - this.img_x)) / zoomRatio) // 获取 x 轴的截取坐标
                y = Math.abs(Math.abs((40 - this.img_y)) / zoomRatio) // 获取 y 轴的截取坐标
                l = Math.abs(Math.floor(300 / zoomRatio)) // 截取的像素长度
            }else{ // PC端
                x = Math.abs(Math.abs((60 - this.img_x)) / zoomRatio) // 获取 x 轴的截取坐标
                y = Math.abs(Math.abs((80 - this.img_y)) / zoomRatio) // 获取 y 轴的截取坐标
                l = Math.abs(Math.floor(300 / zoomRatio)) // 截取的像素长度
            }

            const thid = this // 存储this
            const newImage = new Image();
            newImage.onload = function () {
                const canvas = document.createElement("canvas");// 创建canvas对象
                const ctx = canvas.getContext("2d");

                // 设置画板大小
                canvas.width = thid.y_img_width;
                canvas.height = thid.y_img_height;

                // 在canvas绘制图片
                ctx.drawImage(this, 0, 0, canvas.width, canvas.height);

                // 获取截图区域的内容，截图区域的像素点矩阵
                const cutImage = ctx.getImageData(x, y, l, l);

                // 创建一个新的画布
                const nCanvas = document.createElement('canvas');
                const nCtx = nCanvas.getContext('2d');

                // 设置新的画布的宽高
                nCanvas.width = l;
                nCanvas.height = l;

                // 将获取的截图区域内容，放入新的画布
                nCtx.putImageData(cutImage, 0, 0);

                // 获取 base64 数据
                const base64Data = nCanvas.toDataURL('image/png')

                // 结束函数
                function end(base64){
                    if(thid.returnType === 'base64'){ // 返回 base64 格式数据
                        thid.resolve(base64)
                    }else if(thid.returnType === 'file'){ // 返回 file 格式数据
                        const arr = base64.split(','),
                        mime = arr[0].match(/:(.*?);/)[1], // 获取 base64 的文件类型
                        bstr = atob(arr[1]); // 解码 base64
                            
                        let n = bstr.length,
                        u8arr = new Uint8Array(n);

                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        
                        thid.resolve(new File([u8arr], 'images', {type: mime}))
                    }

                    // 关闭选择窗口
                    thid.close()
                }

                // 开启了开启返回头像最大尺寸且计算的尺寸大于设置的的尺寸
                if(thid.avatarMaxSize && thid.returnAvatarMaxSize < l){
                    const newImage2 = new Image()
                    newImage2.onload = function () {
                        const canvas2 = document.createElement("canvas");// 创建canvas对象
                        const ctx2 = canvas2.getContext("2d");

                        // 设置画板大小
                        canvas2.width = thid.returnAvatarMaxSize
                        canvas2.height = thid.returnAvatarMaxSize

                        // 在canvas绘制图片
                        ctx2.drawImage(this, 0, 0, canvas2.width, canvas2.height)

                        // 获取 base64 数据
                        const base642 = canvas2.toDataURL('image/png')

                        end(base642)
                    }
                    newImage2.src = base64Data
                }else{
                    end(base64Data)
                }
            }
            newImage.src = this.base64
        },
        zoom(s){ // 移动端缩放函数
            // 存储原始宽高
            const width = this.width
            const height = this.height

            if(this.img_ZoomRatio < 0 || this.img_ZoomRatio > this.zoomRatio) return // 限制缩放比例

            if(s){
                this.img_ZoomRatio += 0.04 // 放大
            }else{
                this.img_ZoomRatio -= 0.04 // 缩小
            }

            // 防止超出或低于规定的缩放比例
            if(this.img_ZoomRatio < 0){
                this.img_ZoomRatio = 0
            }else if(this.img_ZoomRatio > this.zoomRatio){
                this.img_ZoomRatio = this.zoomRatio
            }

            // 计算偏移量
            let x = (this.width - width) / 2
            let y = (this.height - height) / 2

            // 减去并存储偏移量
            this.img_x -= Math.round(x * 10) / 10
            this.img_y -= Math.round(y * 10) / 10

            // 调用矫正函数
            this.correct()
        },
        continuousZoom(s, event){ // 移动端连续缩放函数
            event.target.classList.add('active')
            this.zoom(s)
            this.continuousZoomTimer2 = setTimeout(() => {
                this.continuousZoomTimer = setInterval(() => {
                    this.zoom(s)
                }, 20);
            }, 300 );
            event.target.ontouchend = ()=>{
                event.target.classList.remove('active')
                clearInterval(this.continuousZoomTimer)
                clearTimeout(this.continuousZoomTimer2)
            }
        }
    },
    computed:{
        width(){ // 图片宽度
            return Math.floor(this.img_width * (this.img_ZoomRatio +1))
        },
        height(){ // 图片高度
            return Math.floor(this.img_height * (this.img_ZoomRatio +1))
        },
    },
    watch:{
        // 在数据改变时调用矫正函数
        img_x(){ this.correct() },
        img_y(){ this.correct() },
        drag(newval){ if(!newval){ this.correct() } },
    },
}
</script>

<!-- color -->
<style scoped>
#selectAvatar{
    --solid-color: #ffffff; /* 纯色 */
    --text-color: #313234; /* 文字颜色 */
    --bag-color: #f5f7fa; /* 背景颜色 */
    --close-but-color: #909399; /* 关闭按钮颜色 */
    --but-border-color: #828282; /* 按钮边框颜色 */
}
#selectAvatar.ye{
    --text-color: #eeeeee; /* 文字颜色 */
    --bag-color: #262727; /* 背景颜色 */
    --close-but-color: #a3a6ad; /* 关闭按钮颜色 */
}
</style>

<style scoped>
#selectAvatarBox{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}
#selectAvatar{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 420px;
    min-height: 520px;
    background-color: var(--bag-color);
    transform: translate(-50%,-60%);
    opacity: 0;
    border-radius: 4px;
    transition: all 0.4s;
    z-index: 9999999999999;
    box-shadow: 3px 3px 15px 0 rgb(0 0 0 / 25%);
    padding: 20px;
}
#selectAvatar.active{
    transform: translate(-50%,-50%);
    opacity: 1;
}
.selectAvatar-box__close{
    position: absolute;
    top: 20px;
    right: 20px;
    fill: var(--close-but-color);
    width: 14px;
    height: 14px;
}
.selectAvatar-box__close:hover{
    fill: var(--theme-color) !important;
}
#AvatarBox{
    width: 100%;
    height: 460px;
    margin-top: 20px;
    overflow: hidden;
    position: relative;
}
#left,
#right,
#AvatarBox::before,
#AvatarBox::after{
    content: '';
    display: block;
    background-color: #000;
    opacity: 0.3;
    position: absolute;
    z-index: 99;
}
#AvatarBox::before{
    width: 100%;
    height: 80px;
    top: 0;
    left: 0;
}
#AvatarBox::after{
    width: 100%;
    height: 80px;
    bottom: 0;
    left: 0;
}
#left{
    height: calc(100% - 160px);
    width: 60px;
    top: 80px;
    left: 0;
}
#right{
    height: calc(100% - 160px);
    width: 60px;
    top: 80px;
    right: 0;
}
#img{
    position: absolute;
    touch-action: pan-y;
}
#img:active{
    cursor: grab;
}
#AvatarTitle{
    font-size: 16px;
    color: var(--text-color);
}
.maskLayer{
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0);
    opacity: 0;
    transition: all 0.5s;
}
.maskLayer.active{
    opacity: 0.35;
}
#buttonBox{
    height: 30;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}
.AvatarBut{
    margin: 0 4px;
    border-radius: 4px;
    padding: 0 4px;
    min-width: 56px;
    height: 32px;
    font-size: 12px;
    background-color: transparent;
    border: 1px solid var(--but-border-color);
    color: var(--text-color);
    -webkit-tap-highlight-color: transparent;
}
.AvatarBut:hover{
    background-color: var(--theme-color-20);
    border: 1px solid var(--theme-color-50);
    color: var(--theme-color);
}
.AvatarBut:active{
    background-color: var(--theme-color-10);
    border: 1px solid var(--theme-color);
}
.AvatarBut.primary{
    background-color: var(--theme-color);
    border: 1px solid var(--theme-color);
    color: var(--solid-color) !important;
}
.AvatarBut.primary:hover{
    background-color: var(--theme-color-90);
    border: 1px solid var(--theme-color-10);
}
.AvatarBut.primary:active{
    background-color: var(--theme-color-75);
}
/* 边缘线样式 */
#edgeLine{
    position: absolute;
    border: none;
    z-index: 9999;
}
#edgeLine._top{
    border-bottom: 1px solid var(--theme-color);
    width: 301px;
    top: 79px;
    left: 60px;
}
#edgeLine._right{
    border-left: 1px solid var(--theme-color);
    height: 301px;
    top: 80px;
    right: 59px;
}
#edgeLine._bottom{
    border-top: 1px solid var(--theme-color);
    width: 301px;
    bottom: 79px;
    left: 59px;
}
#edgeLine._left{
    border-right: 1px solid var(--theme-color);
    height: 301px;
    top: 79px;
    left: 59px;
}
</style>

<style>
.transition01{
    transition: all 0.1s;
}
</style>

<!-- Phone -->
<style scoped>
#selectAvatar.phone *{
    -webkit-touch-callout:none;
    -moz-touch-callout:none;
    -ms-touch-callout:none;
    -moz-user-select:none;/*火狐*/
    -webkit-user-select:none;/*webkit浏览器*/
    -ms-user-select:none;/*IE10*/
    -khtml-user-select:none;/*早期浏览器*/
    user-select:none;
}
#selectAvatar.phone{
    width: 340px;
    min-height: 450px;
}
.phone #AvatarBox{
    width: 100%;
    height: 380px;
}
.phone #AvatarBox::before{
    height: 40px;
}
.phone #AvatarBox::after{
    height: 40px;
}
.phone #left{
    height: calc(100% - 80px);
    width: 20px;
    top: 40px;
}
.phone #right{
    height: calc(100% - 80px);
    width: 20px;
    top: 40px;
}
.phoneBut.AvatarBut{
    font-size: 16px;
    min-width: 40px;
    outline: none;
    -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    -webkit-user-modify: read-write-plaintext-only;
}
.phoneBut.AvatarBut.active{
    background-color: var(--theme-color-10) !important;
    border: 1px solid var(--theme-color) !important;
    color: var(--theme-color) !important;
}
.phone #edgeLine._top{
    top: 39px;
    left: 20px;
}
.phone #edgeLine._right{
    top: 40px;
    right: 19px;
}
.phone #edgeLine._bottom{
    bottom: 39px;
    left: 19px;
}
.phone #edgeLine._left{
    top: 39px;
    left: 19px;
}
</style>