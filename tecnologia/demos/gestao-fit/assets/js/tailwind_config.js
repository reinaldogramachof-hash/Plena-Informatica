tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#16A34A',
                    primary: '#16A34A',
                    dark: '#15803D',
                    black: '#0F0F11',
                    green: '#16A34A',
                    red: '#EF4444',
                    yellow: '#F59E0B',
                    orange: '#F59E0B',
                    gray: '#9CA3AF'
                },
                accent: {
                    DEFAULT: '#16A34A',
                    hover: '#15803D'
                },
                fit: {
                    light: '#F5F5F7',
                    soft: '#F0F0F2',
                    dark: '#0F0F11',
                    card: '#1A1A1E',
                    border: '#2E2E32'
                },
                success: '#16A34A',
                danger: '#EF4444'
            },
            borderRadius: {
                'none': '0px',
                'sm': '4px',
                'DEFAULT': '6px',
                'md': '6px',
                'lg': '8px',
                'xl': '12px',
                '2xl': '12px',
                '3xl': '12px',
                'panel': '8px',
                'control': '6px',
                'section': '12px',
                'full': '9999px'
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgba(0, 0, 0, 0.18)',
                'panel': '0 2px 4px 0 rgba(0, 0, 0, 0.18)',
                'elevated': '0 4px 12px 0 rgba(0, 0, 0, 0.18)',
                'glass': 'none'
            },
            animation: {
                'fade-in': 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }
        }
    }
}
