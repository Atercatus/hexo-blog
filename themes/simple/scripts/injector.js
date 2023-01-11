const css = hexo.extend.helper.get('css').bind(hexo);
const js = hexo.extend.helper.get('js').bind(hexo);

hexo.extend.injector.register('header_end', css('reset'), 'home');
hexo.extend.injector.register('header_end', css('variable'), 'home');
hexo.extend.injector.register('header_end', css('index'), 'home');
hexo.extend.injector.register('header_end', css('header'), 'home');
hexo.extend.injector.register('body_end', js('header'), 'home');
