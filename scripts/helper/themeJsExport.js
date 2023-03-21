hexo.extend.helper.register('export_config', function() {
    const { config, theme } = this, lang = hexo.theme.i18n.get(config.language || 'zh-CN');
    const exportGobalConfig = {
        root: config.root,
        runtime: theme.aside.analytics.runtime,
        lazyload: {
            enable: theme.lazyload.enable,
            error: theme.lazyload.errorimg
        },
        lightbox: theme.lightbox,
        randomlinks: theme.footer.randomlink,
        lang: {
            theme: {
                dark: lang['theme.dark'],
                light: lang['theme.light'],
            },
            copy: {
                success: lang['copy.success'],
                error: lang['copy.error'],
            },
            backtop: lang['nav.backtop'],
            time: {
                recent: lang['time.recent'],
                yesterday: lang['time.yesterday'],
                berforeyesterday: lang['time.berforeyesterday'],
                daybefore: lang['time.daybefore'],
                runtime: lang['time.runtime'],
            },
            sayhello: {
                morning: lang['sayhello.morning'],
                noon: lang['sayhello.noon'],
                afternoon: lang['sayhello.afternoon'],
                night: lang['sayhello.night'],
                goodnight: lang['sayhello.goodnight'],
                iam: lang['sayhello.iam'],
            },
            
        },
        covercolor: theme.post.covercolor

    }
    const pagetype = this.is_post() || this.is_page()
    const exportPageConfig = {
        is_home: this.is_home(),
        is_post: this.is_post(),
        is_page: this.is_page(),
        comment: (pagetype && theme.comment.enable && this.page.comment !== false) ? true : false,
        page: this.is_page() && (this.page.type || 'default'),
        toc: (pagetype && this.page.toc !== false && this.page.aside !==false ) ? true : false,
        commentBarrageConfig: { 
            enable: theme.comment.enable,
            token: theme.comment.commentbarrage.token,
            url: theme.comment.twikoo.envId,
        }
    }
    return `<script>var GOBALCONFIG = ${JSON.stringify(exportGobalConfig)};</script><script id="site-config">var PAGECONFIG = ${JSON.stringify(exportPageConfig)};</script>`;
})