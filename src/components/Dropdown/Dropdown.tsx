import { useState, useRef, useEffect, useMemo } from 'react';
import {
  useFloating,
  offset,
  flip,
  size,
  autoUpdate,
} from '@floating-ui/react-dom';
import { createPortal } from 'react-dom';
import type { DropdownProps, DropdownOption } from './Dropdown.types';

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const parts = text.split(new RegExp(`(${escapeRegex(query)})`, 'gi'));
  return (
    <>
      {parts.map((chunk, i) =>
        chunk.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-cyan-300 text-inherit rounded-xs">
            {chunk}
          </mark>
        ) : (
          chunk
        ),
      )}
    </>
  );
}

function CircleXIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <circle cx="8" cy="8" r="6.5" />
      <path d="M5 5l6 6M11 5l-6 6" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      className="w-5.75 h-5.75"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8l4 4 4-4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg className="w-3.75 h-3.75 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <circle cx="6.75" cy="6.75" r="4.75" />
      <path d="M10.25 10.25L14 14" />
    </svg>
  );
}

export function Dropdown({
  id,
  options,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  multiple = false,
  withSearch = false,
  outlined = false,
  portal = false,
  zIndex = 1050,
  renderOption,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(-1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(1),
      flip({ padding: 8 }),
      size({
        padding: 8,
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const selected = useMemo(() => {
    if (multiple) {
      const vals = Array.isArray(value) ? value : [];
      return options.filter((o) => vals.includes(o.value));
    }
    return options.filter((o) => o.value === value);
  }, [value, options, multiple]);

  const hasValue = selected.length > 0;

  // focus search 
  useEffect(() => {
    if (open && withSearch) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    if (!open) {
      setQuery('');
      setFocused(-1);
    }
  }, [open, withSearch]);

  // click outside to close
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      const t = e.target as Node;
      if (
        wrapperRef.current?.contains(t) ||
        refs.floating.current?.contains(t)
      )
        return;
      setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open, refs.floating]);

  // scroll focused item into view
  useEffect(() => {
    if (focused < 0 || !listRef.current) return;
    const el = listRef.current.children[focused] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [focused]);

  function isSelected(opt: DropdownOption) {
    if (multiple) {
      return (Array.isArray(value) ? value : []).includes(opt.value);
    }
    return value === opt.value;
  }

  function select(opt: DropdownOption) {
    if (multiple) {
      const cur = Array.isArray(value) ? value : [];
      const next = cur.includes(opt.value)
        ? cur.filter((v) => v !== opt.value)
        : [...cur, opt.value];
      onChange?.(next);
    } else {
      onChange?.(opt.value);
      setOpen(false);
    }
  }

  function remove(e: React.MouseEvent, val: string) {
    e.stopPropagation();
    if (multiple) {
      const cur = Array.isArray(value) ? value : [];
      onChange?.(cur.filter((v) => v !== val));
    } else {
      onChange?.('');
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (['ArrowDown', 'Enter', ' '].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocused((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocused((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focused >= 0 && focused < filtered.length)
          select(filtered[focused]);
        break;
      case 'Escape':
        setOpen(false);
        break;
    }
  }

  const panel = open ? (
    <div
      ref={refs.setFloating}
      style={{ ...floatingStyles, zIndex }}
      className="bg-white border border-[#e4e7eb] rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden"
    >
      {withSearch && (
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-[#eef0f2]">
          <span className="text-[#b0b7c0]">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocused(-1);
            }}
            onKeyDown={onKeyDown}
            className="flex-1 outline-none text-[13px] bg-transparent text-[#555] placeholder:text-[#bbb]"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="text-[#b0b7c0] hover:text-[#888]"
            >
              <CircleXIcon />
            </button>
          )}
        </div>
      )}

      <ul ref={listRef} role="listbox" className="max-h-64 overflow-y-auto">
        {filtered.length === 0 && (
          <li className="px-3.5 py-2.5 text-[13px] text-[#bbb]">No results</li>
        )}
        {filtered.map((opt, i) => {
          const sel = isSelected(opt);
          return (
            <li
              key={opt.value}
              role="option"
              aria-selected={sel}
              onClick={() => select(opt)}
              className={[
                'px-3.5 py-2.5 cursor-pointer text-[13px] text-[#555] transition-colors',
                i === focused
                  ? 'bg-[#f0faf8]'
                  : sel
                    ? 'bg-[#f0faf8]'
                    : 'hover:bg-[#f8fafa]',
              ].join(' ')}
            >
              {renderOption ? (
                renderOption(opt, sel)
              ) : (
                <span className="flex items-center gap-2">
                  {opt.icon}
                  <span><Highlight text={opt.label} query={query} /></span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;

  return (
    <div ref={wrapperRef}>
      <div
        ref={refs.setReference}
        id={id}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          'w-full rounded-md px-2 py-1.25 flex items-center text-[13px] text-left min-h-9 outline-none flex-wrap',
          outlined
            ? 'border border-[#dde0e4] bg-white'
            : 'border border-transparent bg-[#eef0f2]',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          !disabled && outlined ? 'hover:border-[#ccc]' : '',
          !disabled && !outlined ? 'hover:bg-[#e6e8ec]' : '',
        ].join(' ')}
      >
        {hasValue ? (
          <span className="flex items-center flex-wrap flex-1 min-w-0">
            {selected.map((s) => (
              <span
                key={s.value}
                className="inline-flex items-center gap-1 bg-[#f4f5f7] rounded-full pl-2.5 pr-1 py-0.5 text-[13px] text-[#555] max-w-full"
              >
                <span className="truncate">{s.label}</span>
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => remove(e, s.value)}
                  className="text-[#b0b7c0] hover:text-[#888] shrink-0"
                >
                  <CircleXIcon />
                </span>
              </span>
            ))}
          </span>
        ) : (
          <span className="flex-1 truncate text-[#bbb] pl-1">{placeholder}</span>
        )}
        <span className="text-[#b0b7c0] ml-auto shrink-0 pl-1">
          <ChevronIcon />
        </span>
      </div>

      {portal ? panel && createPortal(panel, document.body) : panel}
    </div>
  );
}
