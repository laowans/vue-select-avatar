export interface SelectAvatarOptions {
	/**
	 * 标题
	 * @default '选择头像'
	 */
	title?: string;

	/**
	 * 确定按钮文本
	 * @default '确定'
	 */
	confirmButtonText?: string;

	/**
	 * 取消按钮文本
	 * @default '取消'
	 */
	cancelButtonText?: string;

	/**
	 * 主题色(格式：'#409EFF' / '0, 0, 0')
	 * @default '#409EFF'
	 */
	themeColor?: string;

	/**
	 * 是否展示边缘线
	 * @default true
	 */
	edgeLine?: boolean;

	/**
	 * 是否需要遮罩层
	 * @default true
	 */
	overlay?: boolean;

	/**
	 * 对话框距离顶部的距离，接受css长度值(10px, 10vh)，不传就是垂直居中
	 */
	top?: string;

	/**
	 * 是否为暗色模式
	 * @default true
	 */
	dark: boolean;

	/**
	 * 是否使用网格背景
	 * @default true
	 */
	gridBackground: boolean;

	/**
	 * 返回数据格式
	 * @default 'all'
	 */
	dataType?: 'base64' | 'file' | 'all';

	/**
	 * 返回图片格式
	 * @default 'png'
	 */
	ext?: 'png' | 'jpg';

	/**
	 * 返回图片格式为 file 的文件名，默认为选择图片的文件名（注意不要加扩展名）
	 */
	filename?: string;

	/**
	 * 最大缩放比（需要大于 0）
	 * @default 6
	 */
	maxZoomRatio?: number;

	/**
	 * 取景器/视口大小
	 * @default 300
	 */
	viewportSize?: number;

	/**
	 * 选择图片文件的大小限制，单位：KB
	 * @default 2048
	 */
	fileSizeLimit?: 2048;

	/**
	 * 返回头像最大值，当选择区域的头像大小(宽高)超过这个时，则按照这个值返回（大于0生效）
	 * @default 0
	 */
	maxAvatarSize?: number;

	/**
	 * 选择的图片宽高的最小值
	 * @default 0
	 */
	minAvatarSize?: number;

	/**
	 * 当这个为 true 且设置了 minAvatarSize 时，图片放大时宽高的最小值就不能超过 minAvatarSize
	 * @default false
	 */
	minAvatarSizeLimit: boolean;

	/**
	 * 遮挡区宽度
	 * @default 60
	 */
	cropperSize?: number;

	/**
	 * 是否可以通过点击遮罩层关闭
	 * @default true
	 */
	closeOnClickOverlay?: boolean;

	/**
	 * 是否可以通过按下 ESC 关闭
	 * @default true
	 */
	closeOnPressEscape?: boolean;

	/**
	 * 关闭前的回调，回调函数内执行 done 参数方法的时候才是真正关闭的时候
	 */
	beforeClose?: (done: Function) => void;

	/**
	 * 是否可以通过方向键和w、a、s、d键调整位置
	 * @default true
	 */
	arrowKeys: boolean;
}

// 返回结果
export type SelectAvatarResult =
	| string
	| File
	| {
			base64: string;
			file: File;
	  };

export declare function selectAvatar(options: SelectAvatarOptions): Promise<SelectAvatarResult>;
