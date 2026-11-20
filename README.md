# @misty/ui

Misty's components and design system. Misty itself, its website and the apps people build for Misty all use it,
so everything looks like one product.

```bash
npm install @misty/ui lucide-react
```

```css
@import "tailwindcss";
@import "@misty/ui/styles.css";
```

```tsx
import { Button } from "@misty/ui";

<Button variant="primary">New chat</Button>;
```

- [DESIGN.md](DESIGN.md): the rules, tokens and which component does which job.
- [docs/components.md](docs/components.md): every component, generated from the code.
- [Docs](https://misty-org.github.io/misty-ui/): every component on its own page, with a live example, its code
  and props. `npm run dev` runs them locally at http://127.0.0.1:5191.

React 19, Tailwind CSS 4. MIT licensed.
