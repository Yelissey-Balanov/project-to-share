module.exports = {
  apps: [
    {
      name: 'stella-nuxt_prod :9762',
      interpreter: '/bin/bash',
      script: 'yarn',
      args: 'run start-prod',

      cwd: 'current',
      error_file: '../logs/app.err.log',
      out_file: '../logs/app.out.log',
      log_date_format: 'DD.MM.YYYY HH:mm:ss',
      instance_var: 'INSTANCE_ID',
      autorestart: true,
      watch: false,
      merge_logs: true,
      max_memory_restart: '1G',
    },
  ],
}
