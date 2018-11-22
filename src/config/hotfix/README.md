# Minify hotfixes

Packages `rehype-katex` and `remark-math` cannot be minified since they are
_not_ compiled by Babel prior to distribution. This results in failure to
build a static React app when running `yarn build`, so all files in these
subdirectories and hand-compiled and used until the update to the original
package is pushed to npm.

## Helpful Links

- Bug issue https://github.com/Rokt33r/remark-math/issues/18
- Pending pull requests: https://github.com/Rokt33r/remark-math/pull/25
- Explaination of bugs and method to hand-compile the package https://github.com/facebook/create-react-app/issues/3734
