import { SelectAvatarOptions } from '../lib';

/**
 * 必传的配置项 key（有默认值的/运行必须的）
 */
export type RequiredOption =
	| 'title'
	| 'confirmButtonText'
	| 'cancelButtonText'
	| 'themeColor'
	| 'edgeLine'
	| 'overlay'
	| 'dark'
	| 'gridBackground'
	| 'dataType'
	| 'ext'
	| 'maxZoomRatio'
	| 'workspaceSize'
	| 'fileSizeLimit'
	| 'maxAvatarSize'
	| 'minAvatarSize'
	| 'cropperSize'
	| 'closeOnClickOverlay'
	| 'closeOnPressEscape';

/**
 * 必传的配置项
 */
export type DefaultOptionsType = Required<Pick<SelectAvatarOptions, RequiredOption>>;

/**
 * 融合配置项
 */
export type UnionOptions = SelectAvatarOptions & DefaultOptionsType;
