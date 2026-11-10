tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                gray: { 50:'#fafafa',100:'#f4f4f5',200:'#e4e4e7',300:'#d4d4d8',400:'#a1a1aa',500:'#71717a',600:'#52525b',700:'#3f3f46',800:'#27272a',900:'#18181b',950:'#09090b' },
                slate: { 50:'#fafafa',100:'#f4f4f5',200:'#e4e4e7',300:'#d4d4d8',400:'#a1a1aa',500:'#71717a',600:'#52525b',700:'#3f3f46',800:'#27272a',900:'#18181b',950:'#09090b' },
                brand: {
                    DEFAULT: '#0D9488',
                    primary: '#0D9488',
                    dark: '#0F766E',
                    black: '#0f172a',
                    blue: '#3B82F6',
                    green: '#10B981',
                    red: '#EF4444',
                    yellow: '#F59E0B',
                    orange: '#f59e0b',
                    gray: '#64748B'
                },

                salas: {
                    light: '#F8FAFC',
                    soft: '#E2E8F0',
                    dark: '#0B0F19',
                    card: '#151B2C',
                    border: 'rgba(255, 255, 255, 0.08)'
                },
                surface: 'var(--color-surface)',
                elevated: 'var(--color-elevated)',
                'app-base': 'var(--color-app-base)',
                border: 'var(--color-border)',
                muted: 'var(--color-muted)',
                success: '#10B981',
                danger: '#EF4444'
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(13, 148, 136, 0.07)',
                'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            },
            animation: {
                'pulse-slow': 'pulse 3s infinite',
                'slide-in': 'slideIn 0.3s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.3s ease-out'
            },
            keyframes: {
                slideUp: {
                    'from': { transform: 'translateY(20px)', opacity: '0' },
                    'to': { transform: 'translateY(0)', opacity: '1' }
                }
            }
        }
    }
}
