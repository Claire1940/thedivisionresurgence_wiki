import { BookOpen, Calendar, Monitor, Download, Tag, Shield, Headphones, Image } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'release', path: '/release', icon: Calendar, isContentType: true },
	{ key: 'pc', path: '/pc', icon: Monitor, isContentType: true },
	{ key: 'download', path: '/download', icon: Download, isContentType: true },
	{ key: 'codes', path: '/codes', icon: Tag, isContentType: true },
	{ key: 'classes', path: '/classes', icon: Shield, isContentType: true },
	{ key: 'support', path: '/support', icon: Headphones, isContentType: true },
	{ key: 'media', path: '/media', icon: Image, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['guide', 'release', 'pc', 'download', 'codes', 'classes', 'support', 'media']

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
