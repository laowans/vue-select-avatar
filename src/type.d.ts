import { SelectAvatarOptions } from '../lib';

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

export type DefaultOptionsType = Required<Pick<SelectAvatarOptions, RequiredOption>>;

export type UnionOptions = SelectAvatarOptions & DefaultOptionsType;
