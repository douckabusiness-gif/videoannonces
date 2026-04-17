module.exports = {
    apps: [
        {
            name: 'videoboutique-web',
            script: 'npm',
            args: 'start',
            cwd: '/home/videoboutique/videoboutique',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
            error_file: './logs/web-error.log',
            out_file: './logs/web-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        },
        {
            name: 'videoboutique-live',
            script: 'server-live.js',
            cwd: '/home/videoboutique/videoboutique',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '500M',
            env: {
                NODE_ENV: 'production',
            },
            error_file: './logs/live-error.log',
            out_file: './logs/live-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
        },
    ],
};
