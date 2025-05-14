module.exports = {
    theme: {
      extend: {
        animation: {
          'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'pulse-medium': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          border: 'border-spin 3s linear infinite',
        },
        keyframes: {
          pulse: {
            '0%, 100%': { opacity: '0.3' },
            '50%': { opacity: '0.1' },
          },
          'border-spin': {
            'to': {
              '--angle': '360deg'
            }
          }
        }
      }
    }
  }