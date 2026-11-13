import type { ReactNode } from 'react'

interface Option<T extends string> {
  value: T
  label: string
  icon?: ReactNode
}

export function Segmented<T extends string>(props: {
  label: string
  value: T
  options: readonly Option<T>[]
  onChange: (value: T) => void
}) {
  return (
    <div className="segmented" role="group" aria-label={props.label}>
      {props.options.map((option) => (
        <button
          key={option.value}
          type="button"
          className="segmented__option"
          aria-pressed={option.value === props.value}
          onClick={() => props.onChange(option.value)}
        >
          {option.icon}
          {option.label}
        </button>
      ))}
    </div>
  )
}
