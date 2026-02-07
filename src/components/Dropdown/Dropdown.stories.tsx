import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import type { DropdownOption } from './Dropdown.types';

const sampleOptions: DropdownOption[] = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option with icon' },
  { value: 'opt3', label: 'Long Long Option 3' },
  { value: 'opt4', label: 'Long Long Long Option 4' },
  { value: 'opt5', label: 'Long Long Long Long Option 5' },
  { value: 'opt6', label: 'Long Long Long Long Long Option 6' },
];

const longOptions: DropdownOption[] = Array.from({ length: 50 }, (_, i) => ({
  value: `item-${i + 1}`,
  label: `Item ${i + 1}`,
}));

const meta = {
  title: 'Form/Select Dropdown Field',
  component: Dropdown,
  args: {
    id: 'sdd-1',
    options: sampleOptions,
    withSearch: true,
    multiple: false,
    outlined: false,
    placeholder: '',
  },
  decorators: [
    (Story) => (
      <div className="flex items-start gap-32 w-full p-6">
        <span className="text-sm text-gray-600 pt-2 shrink-0">Label</span>
        <div className="flex-1">
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | string[]>('');
    return <Dropdown {...args} value={value} onChange={setValue} />;
  },
};

export const WithPlaceholder: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | string[]>('');
    return <Dropdown {...args} value={value} onChange={setValue} />;
  },
  args: {
    placeholder: 'Select an option...',
  },
};

export const WithoutSearch: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | string[]>('');
    return <Dropdown {...args} value={value} onChange={setValue} />;
  },
  args: {
    withSearch: false,
  },
};

export const MultiSelect: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string[]>(['opt1', 'opt3']);
    return (
      <Dropdown
        {...args}
        value={value}
        onChange={(v) => setValue(v as string[])}
      />
    );
  },
  args: {
    multiple: true,
  },
};

export const Outlined: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | string[]>('');
    return <Dropdown {...args} value={value} onChange={setValue} />;
  },
  args: {
    outlined: true,
    placeholder: 'Select an option...',
  },
};

export const Disabled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | string[]>('opt1');
    return <Dropdown {...args} value={value} onChange={setValue} />;
  },
  args: {
    disabled: true,
  },
};

export const LongList: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | string[]>('');
    return <Dropdown {...args} value={value} onChange={setValue} />;
  },
  args: {
    options: longOptions,
    placeholder: 'Search to filter 50 items...',
  },
};

export const WithPortal: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | string[]>('');
    return <Dropdown {...args} value={value} onChange={setValue} />;
  },
  args: {
    portal: true,
  },
};

export const CustomRender: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string | string[]>('');
    return (
      <Dropdown
        {...args}
        value={value}
        onChange={setValue}
        renderOption={(opt, sel) => (
          <span className={`flex items-center gap-2 ${sel ? 'font-medium' : ''}`}>
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            {opt.label}
          </span>
        )}
      />
    );
  },
};
