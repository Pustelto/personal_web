---
title: How to add Shadcn UI into an existing React app in Nx Monorepo
twitter: 'Having trouble integrating Shadcn UI into your Nx monorepo with pure React? Check out this step-by-step guide from @pustelto to make the process easier!'
tags: ['Front-end', 'Nx', 'Tooling', 'CSS', 'React', 'Shadcn UI']
excerpt: 'When integrating Shadcn UI into an React app in Nx monorepo can you can stumble upon few issues. In this article, I will provide a step-by-step guide to help you set it up smoothly.'
date: 2024-09-21
published: true
---

When integrating [Shadcn UI](https://ui.shadcn.com) into an Nx monorepo you can stumble upon few issues.

At least I did when I decided to add Shadcn UI into [Clipio](https://clipio.app). Due to Nx structure, running `shadcn init` will not work. So I have decided to write this article to help others have a smooth setup journey for Shadcn UI and Nx monorepo using pure React.

Let's get into it.

<aside><strong>NOTE:</strong>  I'm not working with Next.js or any other framework. Since I'm building a browser extension, I'm using pure React. So this article focuses on that setup.</aside>

Most of the time, you can follow the steps in the [Shadcn UI documentation for manual installation](https://ui.shadcn.com/docs/installation/manual). I will briefly describe the steps below for easy follow-up and highlight extra steps relevant for Nx monorepo.

## 1. Bootstrap the React UI Library

In my setup, I want to have Nx library which will contain Shadcn UI components, I will call it `ui`. Later I can easily import it to other libs or apps in my monorepo.

### Add Nx Library

You can easily add your new library for Shadcn UI using the Nx generator. It will do most of the heavy lifting for you; just double-check the correct imports after the process is complete.

Run this command in your terminal:

```bash
pnpm nx g @nx/react:library ui --directory libs/ui --compiler swc --bundler vite
```

Next, delete the content of the `src` folder in the UI lib we just generated, and create two new folders:

- `ui` where the Shadcn UI components will live
- `styles` where we will put the global styles for the UI lib

Add a `global.css` file to the styles folder. We will update it later.

<aside><strong>NOTE:</strong> Names of folders and files are not mandatory; feel free to name them whatever you like, e.g., components instead of ui. But you will have to update the names in other places as well.</aside>

### Update TypeScript Config Paths

Now, go to the `tsconfig.base.json` file in the root of your monorepo. You should see the new path for the UI lib:

```json
"paths": {
    "@shadcn-in-nx/ui": ["libs/ui/src/index.ts"],
    "...": "other paths"
}
```

Change it to this format:

```json
"paths": {
    "@shadcn-in-nx/ui": [ "libs/ui/src/ui" ],
    "...": "other paths"
}
```

Using an import path in this format will allow you to import individual components into your codebase like this:

```tsx
import { Button } from '@shadcn-in-nx/ui/button';
```

## 2. Set Up Tailwind CSS

Install the additional dependencies as described in the Shadcn UI documentation:

```bash
pnpm add tailwindcss-animate class-variance-authority clsx tailwind-merge
```

Add icons to your project based on your preferred style of Shadcn UI components. I chose the New York style, so I'm using Radix UI icons:

```bash
pnpm add @radix-ui/react-icons
```

Now, set up Tailwind CSS in your monorepo. Nx provides a handy generator for this task. Run this command for both the UI lib where Shadcn UI will live and the main app:

```bash
pnpm nx g @nx/react:setup-tailwind
```

When initializing Tailwind in the UI lib, the Nx generator might complain it can't find a stylesheet to update. Don't worry about it. Copy the Tailwind styles from [Step 6 in the Shadcn UI documentation](https://ui.shadcn.com/docs/installation/manual#configure-styles) into the `global.css` file you created earlier.

Also, update the Tailwind config in your UI lib based on instructions from [Step 5 in the docs](https://ui.shadcn.com/docs/installation/manual#configure-tailwindconfigjs).

Next, update the Tailwind config in your app. Import the Tailwind config from the UI lib and merge it with the app's config. Here's how you can do it:

```diff-javascript
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
+ const TailwindConfig = require('../../libs/ui/tailwind.config');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
+  ...TailwindConfig,
  content: [
+    ...TailwindConfig.content,
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
-  theme: {
-    extend: {},
-  },
-  plugins: [],
};
```

You have to inject styles from `global.css` into your app, otherwise Shadcn UI components will have broken styles. I have decided to use path alias for this as well. I inserted this line into `paths` property in `tsconfig.base.json`:

```json
"@shadcn-test/styles/*": [ "libs/ui/src/styles/*" ],
```

Then in your app you will inject it like this:

```tsx
import '@shadcn-test/styles/global.css';
```

## 3. Create utils lib with `cn`

Next step is to create a `cn` utility to merge styles in components. For that I have created a new lib in my monorepo called `utils` and placed the function here (I have other general purpose utility functions here, so this makes sense for me). In this case I have left the TS path in the `tsconfig.base.json` as is: `"@shadcn-in-nx/utils": ["libs/utils/src/index.ts"]`.

If you want to generate new lib, run this Nx command: `pnpm nx g @nx/js:lib utils` and follow setup instructions. Once generated copy `cn` from [Shadcn UI docs](https://ui.shadcn.com/docs/installation/manual#add-a-cn-helper) inside.

## 4. Initialize Shadcn UI

Last step before we can add components is to create `components.json` file into the root of monorepo. Below is example `components.json` file for a reference:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "libs/ui/tailwind.config.js",
    "css": "libs/ui/src/styles/global.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@shadcn-in-nx/ui",
    "ui": "@shadcn-in-nx/ui",
    "utils": "@shadcn-in-nx/utils"
  }
}
```

Notice the `ui` alias. This one is important to ensure generated components are placed in correct folder.

## 5. Add Components

Now you're all set to generate Shadcn UI components from the command line. Use this command:

```bash
TS_NODE_PROJECT=tsconfig.base.json pnpx shadcn@latest add <"optional component name">
```

<aside><strong>NOTE:</strong> Since we're in a monorepo, we have to specify <code>TS_NODE_PROJECT</code> to point to the <code>tsconfig.base.json</code> file. Shadcn UI will look for tsconfig.json by default, but that is not available in the monorepo root.</aside>

Your components will be generated in the UI lib and you can easily import them to the main app as well. Import across the components will use path alias as well, which is not optimal in Nx, but I haven't found any way how to change this. Nevertheless, even if Nx eslint might complain (if you install it) everything will work.

## Conclusion

I hope this guide helps you smoothly integrate Shadcn UI into your Nx monorepo. While adding it isn't overly difficult, there are some Nx-specific steps that can trip you up. By following these instructions, you should be able to get everything working as expected in no time.
