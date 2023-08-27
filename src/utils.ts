/**
 * 解析颜色
 */
export function parseColor(str: string, def: string) {
	// 16 进制颜色
	const hex = (s: string) => {
		return [s.slice(1, 3), s.slice(3, 5), s.slice(5, 7)].map((a) => parseInt(a, 16));
	};
	// rgb 颜色
	const rgb = (s: string) => {
		return s.split(',').map((a) => +a.trim());
	};

	if (/^#[0-9A-Fa-f]{6}$/.test(str)) {
		return hex(str);
	} else if (/^\d+ ?, ?\d+ ?, ?\d+$/) {
		return rgb(str);
	} else {
		return hex(def);
	}
}
