import { getRoutes } from '../getRoutes';
import { inMemoryContext } from '../testing-library/context-stubs';

describe(getRoutes.name, () => {
  // TODO(@hassankhan): ENG-16599

  describe('rewrites', () => {
    it('can handle URL rewrites', () => {
      const result = getRoutes(
        inMemoryContext({
          './index': () => null,
          './about': () => null,
        }),
        {
          internal_stripLoadRoute: true,
          skipGenerated: true,
          rewrites: [{ source: '/rewrite-about', destination: '/about' }],
          preserveRedirectAndRewrites: true,
        }
      );

      expect(result).toEqual({
        children: [
          {
            children: [],
            contextKey: './index.js',
            dynamic: null,
            entryPoints: ['expo-router/build/views/Navigator.js', './index.js'],
            route: 'index',
            type: 'route',
          },
          {
            children: [],
            contextKey: './about.js',
            dynamic: null,
            entryPoints: ['expo-router/build/views/Navigator.js', './about.js'],
            route: 'about',
            type: 'route',
          },
          {
            children: [],
            contextKey: './rewrite-about.js',
            destinationContextKey: './about.js',
            dynamic: null,
            generated: true,
            route: 'rewrite-about',
            type: 'rewrite',
          },
        ],
        contextKey: 'expo-router/build/views/Navigator.js',
        dynamic: null,
        generated: true,
        route: '',
        type: 'layout',
      });
    });

    it('does not include rewrites when not preserving redirects and rewrites', () => {
      expect(
        getRoutes(
          inMemoryContext({
            './index': () => null,
            './about': () => null,
          }),
          {
            internal_stripLoadRoute: true,
            skipGenerated: true,
            rewrites: [{ source: '/info', destination: '/about' }],
            preserveRedirectAndRewrites: false,
          }
        )
      ).toEqual({
        children: [
          {
            children: [],
            contextKey: './index.js',
            dynamic: null,
            entryPoints: ['expo-router/build/views/Navigator.js', './index.js'],
            route: 'index',
            type: 'route',
          },
          {
            children: [],
            contextKey: './about.js',
            dynamic: null,
            entryPoints: ['expo-router/build/views/Navigator.js', './about.js'],
            route: 'about',
            type: 'route',
          },
        ],
        contextKey: 'expo-router/build/views/Navigator.js',
        dynamic: null,
        generated: true,
        route: '',
        type: 'layout',
      });
    });
  });
});
