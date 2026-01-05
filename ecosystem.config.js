module.exports = {
  apps: [{
    name      : 'strapi',
    script    : 'npm',
    args      : 'start',
    env_file  : './.env',       // 关键：指定 env 文件
    autorestart: true,
    max_memory_restart: '1G'
  }]
};