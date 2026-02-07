# makyo-dropdown

Lightweight searchable dropdown for React. Single/multi-select, portal support, custom rendering.

## Install

```bash
npm install makyo-dropdown
```

## Quick Start

```tsx
import { Dropdown } from 'makyo-dropdown';
import 'makyo-dropdown/styles.css';

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

function App() {
  const [value, setValue] = useState('');
  return (
    <Dropdown
      options={options}
      value={value}
      onChange={setValue}
      placeholder="Pick a fruit..."
      withSearch
    />
  );
}
```

### Multi-select

```tsx
const [value, setValue] = useState<string[]>([]);
<Dropdown options={options} value={value} onChange={setValue} multiple withSearch />
```

### Portal mode

```tsx
<Dropdown options={options} value={value} onChange={setValue} portal />
```

### Custom rendering

```tsx
<Dropdown
  options={options}
  value={value}
  onChange={setValue}
  renderOption={(opt, selected) => <span>{selected ? '> ' : ''}{opt.label}</span>}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `{ value, label, icon? }[]` | required | Dropdown options |
| `value` | `string \| string[]` | — | Selected value(s) |
| `onChange` | `(v) => void` | — | Change handler |
| `placeholder` | `string` | `''` | Placeholder text |
| `disabled` | `boolean` | `false` | Disable interaction |
| `multiple` | `boolean` | `false` | Multi-select mode |
| `withSearch` | `boolean` | `false` | Searchable filtering |
| `outlined` | `boolean` | `false` | Outlined style variant |
| `portal` | `boolean` | `false` | Render menu in portal |
| `zIndex` | `number` | `1050` | Menu z-index |
| `renderOption` | `(opt, sel) => ReactNode` | — | Custom option renderer |

## Dev

```bash
npm run dev            # Storybook
npm run build          # Library build
npm run build-storybook
```

Only runtime dep: `@floating-ui/react-dom` (~3KB). Peer deps: React 18+.
