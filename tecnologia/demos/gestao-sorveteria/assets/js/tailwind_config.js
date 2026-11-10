tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#E11D48',
                    primary: '#E11D48',
                    light:   '#FB7185',
                    dark:    '#BE123C',
                    darker:  '#9F1239',
                    black:   '#0f172a',
                    red:     '#EF4444',
                    yellow:  '#F59E0B',
                    gray:    '#64748B'
                },
                sorveteria: {
                    light:  '#FFF1F2',
                    soft:   '#FFE4E6',
                    dark:   '#0B0F19',
                    card:   '#151B2C',
                    border: 'rgba(255, 255, 255, 0.08)'
                },
                success: '#22C55E',
                danger:  '#EF4444'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(13, 148, 136, 0.10)',
                'card':  '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
            },
            animation: {
                'pulse-slow': 'pulse 3s infinite',
                'slide-in':   'slideIn 0.3s ease-out',
                'fade-in':    'fadeIn 0.5s ease-out',
                'slide-up':   'slideUp 0.3s ease-out'
            },
            keyframes: {
                slideUp: {
                    'from': { transform: 'translateY(20px)', opacity: '0' },
                    'to':   { transform: 'translateY(0)',    opacity: '1' }
                }
            }
        }
    }
}
