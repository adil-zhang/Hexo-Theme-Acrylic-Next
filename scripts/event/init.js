hexo.extend.filter.register('before_generate', () => {
    // Get first two digits of the Hexo version number
    const hexoVer = hexo.version.replace(/(^.*\..*)\..*/, '$1')
    const logger = hexo.log, config = hexo.config, theme = hexo.theme.config
  
    if (hexoVer < 5.3) {
      logger.error('请把 Hexo 升级到 V5.3.0 或更高的版本！')
      process.exit(-1)
    }

    if(config.prismjs.enable){
      logger.error('主题尚未支持 prismjs 请使用 highlightjs ！')
      process.exit(-1)
    }
    if (theme.hometop.banner && !theme.hometop.icon) {
      logger.error('\n 启用banner的情况下，必须提供 icon 图片！\n 请在主题配置文件中设置 hometop.banner.icon 选项。');
      process.exit(-1);
    }
  })